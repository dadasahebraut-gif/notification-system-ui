export const API_CONFIG = {
  // https://platform.shauryatechnosoft.com/notification-api/api/v1/o/system/healthz
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api/v1/o",
  // BASE_URL:
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/o",
  ENDPOINTS: {
    CLIENTS: "/clients",
    PROJECTS: "/projects",
    PURPOSES: "/purposes",
    SMS: "/sms",
    LOGIN: "/users/login",
    PLANS: "/plans",
    MEMBERSHIP: "/membership",
    CAMPAIGN : "/campaign",
    SENDERS: "/senders",
  },
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
