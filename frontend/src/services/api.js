const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const getStoredSession = () => {
  const stored = localStorage.getItem("issueTrackerSession");
  return stored ? JSON.parse(stored) : null;
};

export const setStoredSession = (session) =>
  localStorage.setItem("issueTrackerSession", JSON.stringify(session));

export const clearStoredSession = () => localStorage.removeItem("issueTrackerSession");

export const apiRequest = async (path, options = {}) => {
  const session = getStoredSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token && { Authorization: `Bearer ${session.token}` }),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Something went wrong");
  return body;
};
