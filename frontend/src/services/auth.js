import {
  apiRequest,
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from "./api";

const saveSession = (response) => {
  const user = response.user || response.data;
  const session = { token: response.token, user: { ...user, id: user.id || user._id } };
  setStoredSession(session);
  return session;
};

export const login = async (credentials) => saveSession(await apiRequest("/auth/login", {
  method: "POST",
  body: JSON.stringify(credentials),
}));

export const register = async (details) => saveSession(await apiRequest("/auth/register", {
  method: "POST",
  body: JSON.stringify(details),
}));

export const getCurrentUser = () => apiRequest("/auth/me");
export const getUsers = () => apiRequest("/auth/users");
export const getSession = getStoredSession;
export const logout = async () => {
  try {
    return await apiRequest("/auth/logout");
  } catch {
    return null;
  } finally {
    // Always remove the local token, even if the server cannot be reached.
    clearStoredSession();
  }
};
