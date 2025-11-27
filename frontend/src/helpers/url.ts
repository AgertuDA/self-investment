// Use environment variable in production, fallback to localhost for development
export const url = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? window.location.origin : "http://localhost:8000");
