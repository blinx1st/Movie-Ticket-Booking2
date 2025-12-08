export class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
    console.log('constructor:baseUrl:', baseUrl, ' - getToken:', getToken);
  }

  private async request(path: string, options: RequestInit = {}) {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`API ${res.status}: ${msg}`);
    }
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  get(path: string) { return this.request(path, { method: 'GET' }); }
  post(path: string, body?: any) {
    console.log('post:path:', path);
    console.log('post:body:', body);
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }
  put(path: string, body?: any) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(path: string) { return this.request(path, { method: 'DELETE' }); }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
);
