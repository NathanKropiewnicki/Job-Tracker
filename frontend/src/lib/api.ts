import type { JobApplication } from '../types';

const BASE_URL = '/api/applications';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const applicationsApi = {
  list: () => request<JobApplication[]>(BASE_URL),
  create: (payload: Omit<JobApplication, 'id'>) =>
    request<JobApplication>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Omit<JobApplication, 'id'>) =>
    request<JobApplication>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    request<{ success: boolean }>(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    }),
};
