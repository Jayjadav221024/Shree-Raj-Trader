import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Called when the API rejects a request with 401. Registered by AuthProvider so
 * this module never has to import the store (which imports this module back).
 */
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // `/auth/me` is the session probe — a 401 there is the expected answer for
      // a signed-out visitor, not a session expiry, so it must not bounce anyone.
      const url = error.config?.url || '';
      const isSessionProbe = url.includes('/auth/me') || url.includes('/auth/login');

      if (!isSessionProbe && typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
