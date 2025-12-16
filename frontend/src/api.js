import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchLogs = () =>
  axios.get(`${API_BASE}/logs?limit=100`).then((r) => r.data);

export const fetchGroups = () =>
  axios.get(`${API_BASE}/logs/groups`).then((r) => r.data);

export const sendTestLog = () =>
  axios.post(`${API_BASE}/logs`, {
    origin: "frontend",
    level: "error",
    message:
      "Failed to load user profile. API returned unexpected response format.",
    meta: {
      page: "Profile",
      expectedFields: ["name", "email", "avatarUrl"],
      received: "null or malformed payload",
    },
  });
