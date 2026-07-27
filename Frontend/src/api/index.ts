import { mockApi } from './mockApi';

// Single entry point for services.
// Switching to a real API in Phase 2 will only require replacing this import with real API implementation.
export const api = mockApi;
export default api;
