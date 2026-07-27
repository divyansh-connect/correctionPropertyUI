// Simulates custom fetch/axios client, which will be updated for a real backend in Phase 2.
export const apiClient = {
  delay: (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms)),

  get: async <T>(url: string): Promise<T> => {
    console.log(`[API CLIENT] GET request to ${url}`);
    await apiClient.delay();
    throw new Error("Method not implemented. Mock services active.");
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    console.log(`[API CLIENT] POST request to ${url}`, data);
    await apiClient.delay();
    throw new Error("Method not implemented. Mock services active.");
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    console.log(`[API CLIENT] PUT request to ${url}`, data);
    await apiClient.delay();
    throw new Error("Method not implemented. Mock services active.");
  },

  delete: async <T>(url: string): Promise<T> => {
    console.log(`[API CLIENT] DELETE request to ${url}`);
    await apiClient.delay();
    throw new Error("Method not implemented. Mock services active.");
  },
};
export default apiClient;
