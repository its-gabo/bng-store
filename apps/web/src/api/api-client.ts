import { BngStoreApi } from "./generated-api"

export const apiClient = new BngStoreApi({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
  withCredentials: true,
})
