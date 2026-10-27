// Set VITE_API_URL in .env (local) or in Vercel project settings (production)
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Reads the user from a JWT payload (id, name, email, role, sid, exp).
// Returns null if the token is malformed. An expired access token still identifies
// the user; the session is renewed with the refresh token on the next request.
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    const user = JSON.parse(new TextDecoder().decode(bytes));
    return { ...user, name: user.name || user.email?.split("@")[0] || "there" };
  } catch {
    return null;
  }
}

// True when the token is expired or will expire within `marginMs`
export function isTokenExpiring(token, marginMs = 30 * 1000) {
  const payload = decodeToken(token);
  return !payload?.exp || payload.exp * 1000 - marginMs < Date.now();
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }
  return result;
}
