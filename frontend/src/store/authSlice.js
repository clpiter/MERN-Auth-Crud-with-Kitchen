import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest, decodeToken, isTokenExpiring } from '../api'

// { token, refreshToken } of the current session, shared by all tabs
export const SESSION_KEY = "session";

export function readStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session?.refreshToken && decodeToken(session.token)) return session;
  } catch {
    // Storage unavailable (private mode etc.) or broken value
  }
  return null;
}

// Restore the session from localStorage; drop anything broken
function loadSession() {
  const session = readStoredSession();
  if (!session) {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("token"); // token from before sessions existed
    } catch {
      // Storage unavailable: start logged out
    }
  }
  return session;
}

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await apiRequest("/auth/login", { method: "POST", body: credentials });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const result = await apiRequest("/user/register", { method: "POST", body: userData });
    return result.message;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Ends the session on the server too, then clears it locally
export const signOut = createAsyncThunk("auth/signOut", async (_, { getState, dispatch }) => {
  const { refreshToken } = getState().auth;
  dispatch(logout());
  if (refreshToken) {
    await apiRequest("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }
});

const SESSION_ENDED = "Your session has ended. Please log in again.";

// Swaps the refresh token for a new token pair. Only one refresh runs at a time,
// because the server rotates the refresh token and the old one stops working.
let refreshPromise = null;

function refreshSession({ getState, dispatch }) {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken } = getState().auth;
      if (!refreshToken) throw Object.assign(new Error(SESSION_ENDED), { status: 401 });
      try {
        const tokens = await apiRequest("/auth/refresh-token", { method: "POST", body: { refreshToken } });
        dispatch(sessionUpdated(tokens));
        return tokens.token;
      } catch (error) {
        if (error.status !== 401) throw error; // network/server error: keep the session
        // Another tab may have just rotated the token; use its copy if so
        const stored = readStoredSession();
        if (stored && stored.refreshToken !== refreshToken) {
          dispatch(sessionUpdated(stored));
          return stored.token;
        }
        dispatch(logout(SESSION_ENDED));
        throw Object.assign(new Error(SESSION_ENDED), { status: 401 });
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Calls the API with a valid access token: refreshes it first when it is about
// to expire, and once more if the server still answers 401.
export async function authRequest(thunkApi, path, options = {}) {
  let { token } = thunkApi.getState().auth;
  if (!token) throw Object.assign(new Error(SESSION_ENDED), { status: 401 });
  if (isTokenExpiring(token)) token = await refreshSession(thunkApi);
  try {
    return await apiRequest(path, { ...options, token });
  } catch (error) {
    if (error.status !== 401) throw error;
    token = await refreshSession(thunkApi);
    return apiRequest(path, { ...options, token });
  }
}

// Builds a thunk that calls an authenticated API route
export function apiThunk(type, buildRequest, transform = (result) => result) {
  return createAsyncThunk(type, async (arg, thunkApi) => {
    const { path, ...options } = buildRequest(arg);
    try {
      const result = await authRequest(thunkApi, path, options);
      return transform(result, arg);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  });
}

const initialSession = loadSession();

function applySession(state, { token, refreshToken }) {
  state.token = token;
  state.refreshToken = refreshToken;
  state.user = decodeToken(token);
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialSession?.token || null,
    refreshToken: initialSession?.refreshToken || null,
    user: decodeToken(initialSession?.token),
    status: "idle",
    error: null,
    // Info shown on the login page, e.g. why the user was logged out
    notice: null
  },
  reducers: {
    // Clears the session locally; payload is an optional reason to show on the login page
    logout(state, action) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.notice = typeof action.payload === "string" ? action.payload : null;
    },
    // New tokens from a refresh or from another tab
    sessionUpdated(state, action) {
      applySession(state, action.payload);
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.notice = null;
        applySession(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout, sessionUpdated, clearAuthError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthNotice = (state) => state.auth.notice;

export default authSlice.reducer;
