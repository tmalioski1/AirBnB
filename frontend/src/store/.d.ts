declare module './csrf' {
    export function csrfFetch(url: string, options?: RequestInit): Promise<Response>;
    export function restoreCSRF(): Promise<void>;
  }
  