import { createSlice } from '@reduxjs/toolkit'
import { apiThunk, logout } from './authSlice'

export const fetchSessions = apiThunk("sessions/fetch", () => ({
  path: "/auth/sessions"
}), (result) => result.sessions);

export const revokeSession = apiThunk("sessions/revoke", (id) => ({
  path: `/auth/sessions/${id}`, method: "DELETE"
}), (result, id) => ({ id, current: result.current }));

export const revokeOtherSessions = apiThunk("sessions/revokeOthers", () => ({
  path: "/auth/sessions", method: "DELETE"
}));

const initialState = {
  list: [],
  status: "idle",
  error: null
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionsError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.list = state.list.filter((session) => session.id !== action.payload.id);
      })
      .addCase(revokeOtherSessions.fulfilled, (state) => {
        state.list = state.list.filter((session) => session.current);
      })
      .addCase(logout, () => initialState);

    [revokeSession, revokeOtherSessions].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.error = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = action.payload || action.error.message;
        });
    });
  }
});

export const { clearSessionsError } = sessionsSlice.actions;

export const selectSessionsState = (state) => state.sessions;

export default sessionsSlice.reducer;
