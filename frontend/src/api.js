import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchLogs = () =>
  axios.get(`${API_BASE}/logs?limit=100`).then((r) => r.data);

export const fetchGroups = () =>
  axios.get(`${API_BASE}/logs/groups`).then((r) => r.data);

export const sendTestLog = () => {
  const logs = [
    {
      origin: "frontend",
      level: "error",
      message:
        "Failed to load user profile. API returned unexpected response format.",
      meta: {
        page: "Profile",
        expectedFields: ["name", "email", "avatarUrl"],
        received: "null or malformed payload",
      },
    },
    {
      origin: "frontend",
      level: "warn",
      message: "User session expired while accessing protected resource.",
      meta: {
        page: "Dashboard",
        action: "fetchUserData",
        httpStatus: 401,
      },
    },
    {
      origin: "frontend",
      level: "error",
      message: "API request timed out after 10 seconds.",
      meta: {
        endpoint: "/api/reports/monthly",
        method: "GET",
        timeoutMs: 10000,
        retryAttempt: 1,
      },
    },
    {
      origin: "frontend",
      level: "info",
      message: "Form submission failed due to invalid input.",
      meta: {
        page: "Signup",
        invalidFields: ["email", "password"],
        reason: "Email format invalid, password too short",
      },
    },
    {
      origin: "frontend",
      level: "error",
      message: "Payment gateway responded with failure status.",
      meta: {
        provider: "Stripe",
        operation: "createPaymentIntent",
        errorCode: "card_declined",
        userAction: "Checkout",
      },
    },
  ];

  // pick one randomly so dashboard feels alive
  const randomLog = logs[Math.floor(Math.random() * logs.length)];

  return axios.post(`${API_BASE}/logs`, randomLog);
};


// export const sendTestLog = async () => {
//   const logs = [
//     {
//       origin: "frontend",
//       level: "error",
//       message:
//         "Failed to load user profile. API returned unexpected response format.",
//       meta: {
//         page: "Profile",
//         expectedFields: ["name", "email", "avatarUrl"],
//         received: "null or malformed payload",
//       },
//     },
//     {
//       origin: "frontend",
//       level: "warn",
//       message: "User session expired while accessing protected resource.",
//       meta: {
//         page: "Dashboard",
//         action: "fetchUserData",
//         httpStatus: 401,
//       },
//     },
//     {
//       origin: "frontend",
//       level: "error",
//       message: "API request timed out after 10 seconds.",
//       meta: {
//         endpoint: "/api/reports/monthly",
//         method: "GET",
//         timeoutMs: 10000,
//         retryAttempt: 1,
//       },
//     },
//     {
//       origin: "frontend",
//       level: "info",
//       message: "Form submission failed due to invalid input.",
//       meta: {
//         page: "Signup",
//         invalidFields: ["email", "password"],
//         reason: "Email format invalid, password too short",
//       },
//     },
//     {
//       origin: "frontend",
//       level: "error",
//       message: "Payment gateway responded with failure status.",
//       meta: {
//         provider: "Stripe",
//         operation: "createPaymentIntent",
//         errorCode: "card_declined",
//         userAction: "Checkout",
//       },
//     },
//   ];

//   // fire all requests in parallel
//   return Promise.all(logs.map((log) => axios.post(`${API_BASE}/logs`, log)));
// };