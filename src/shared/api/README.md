# Shared API

**Purpose**: HTTP clients, API endpoints, Tauri commands.

## Structure

```
api/
  http/
    client.ts         # Axios/fetch configuration
    interceptors.ts   # Request/response interceptors
  tauri/
    commands.ts       # Tauri invoke wrappers
    events.ts         # Tauri event listeners
  endpoints.ts        # API URL constants
  types.ts           # API request/response types
```

## Example

```ts
// http/client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// tauri/commands.ts
export const tauriApi = {
  readFile: (path: string) => invoke<string>('read_file', { path }),
}
```

## Rules

- All API requests through centralized client
- Error handling in interceptors
- Type all requests/responses
