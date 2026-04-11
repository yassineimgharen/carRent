const BASE = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const getToken = () => localStorage.getItem("token");

export const api = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const changeUserStatus = async (userId: number, account_status: string, status_reason?: string) => {
  return api(`/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ account_status, status_reason }),
  });
};
