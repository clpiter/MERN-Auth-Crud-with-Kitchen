import { configureStore } from '@reduxjs/toolkit'
import authReducer, { SESSION_KEY, logout, sessionUpdated, readStoredSession } from './authSlice'
import itemsReducer from './itemsSlice'
import sessionsReducer from './sessionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    sessions: sessionsReducer
  }
});

// Persist the session so a page refresh keeps the user logged in
let saved = store.getState().auth.refreshToken + store.getState().auth.token;
store.subscribe(() => {
  const { token, refreshToken } = store.getState().auth;
  if (refreshToken + token === saved) return;
  saved = refreshToken + token;
  try {
    if (refreshToken) localStorage.setItem(SESSION_KEY, JSON.stringify({ token, refreshToken }));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable: session lasts until the tab is closed
  }
});

// Keep tabs in sync: logging in, refreshing or logging out in one tab applies to all
window.addEventListener("storage", (event) => {
  if (event.key !== SESSION_KEY) return;
  const session = readStoredSession();
  const { refreshToken } = store.getState().auth;
  if (session && session.refreshToken !== refreshToken) {
    store.dispatch(sessionUpdated(session));
  } else if (!session && refreshToken) {
    store.dispatch(logout());
  }
});
