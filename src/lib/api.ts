import type { User, Topic, Thesis, Argument, Perspective, FeedItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders ?? {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      apiFetch<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      apiFetch<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  topics: {
    list: () => apiFetch<{ topics: Topic[] }>('/topics'),
    get: (id: string) => apiFetch<Topic>(`/topics/${id}`),
    create: (data: { title: string; description: string }, token: string) =>
      apiFetch<Topic>('/topics', { method: 'POST', body: JSON.stringify(data), token }),
  },

  theses: {
    list: (topicId?: string) =>
      apiFetch<{ theses: Thesis[] }>(`/theses${topicId ? `?topicId=${topicId}` : ''}`),
    create: (
      data: { topicId: string; content: string; perspectiveId?: string },
      token: string,
    ) => apiFetch<Thesis>('/theses', { method: 'POST', body: JSON.stringify(data), token }),
    endorse: (id: string, token: string) =>
      apiFetch<{ ok: boolean }>(`/theses/${id}/endorse`, { method: 'POST', token }),
    unendorse: (id: string, token: string) =>
      apiFetch<{ ok: boolean }>(`/theses/${id}/endorse`, { method: 'DELETE', token }),
  },

  arguments: {
    list: (thesisId: string) =>
      apiFetch<{ arguments: Argument[] }>(`/arguments?thesisId=${thesisId}`),
    create: (
      data: { thesisId: string; content: string; stance: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL' },
      token: string,
    ) => apiFetch<Argument>('/arguments', { method: 'POST', body: JSON.stringify(data), token }),
  },

  perspectives: {
    list: () => apiFetch<{ perspectives: Perspective[] }>('/perspectives'),
    create: (data: { name: string; description: string }, token: string) =>
      apiFetch<Perspective>('/perspectives', { method: 'POST', body: JSON.stringify(data), token }),
    follow: (id: string, token: string) =>
      apiFetch<{ ok: boolean }>(`/perspectives/${id}/follow`, { method: 'POST', token }),
    unfollow: (id: string, token: string) =>
      apiFetch<{ ok: boolean }>(`/perspectives/${id}/follow`, { method: 'DELETE', token }),
  },

  feed: {
    get: (token: string) => apiFetch<{ feed: FeedItem[] }>('/feed', { token }),
  },
};
