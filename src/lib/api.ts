import type { Lead, Task, Activity, DashboardStats } from './types';

const BASE = '/api';

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API Error ${res.status}: ${body}`);
  }
  return res.json();
}

// Dashboard
export function getDashboardStats(): Promise<DashboardStats> {
  return fetchJSON<DashboardStats>(`${BASE}/dashboard`);
}

// Leads
export function getLeads(): Promise<Lead[]> {
  return fetchJSON<Lead[]>(`${BASE}/leads`);
}

export function getLead(id: string): Promise<Lead> {
  return fetchJSON<Lead>(`${BASE}/leads/${id}`);
}

export function createLead(data: Partial<Lead>): Promise<Lead> {
  return fetchJSON<Lead>(`${BASE}/leads`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  return fetchJSON<Lead>(`${BASE}/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteLead(id: string): Promise<void> {
  return fetchJSON<void>(`${BASE}/leads/${id}`, { method: 'DELETE' });
}

export function updateLeadStage(id: string, stage: string): Promise<Lead> {
  return fetchJSON<Lead>(`${BASE}/leads/${id}/stage`, {
    method: 'PUT',
    body: JSON.stringify({ stage }),
  });
}

export function markMockupReady(id: string): Promise<Lead> {
  return fetchJSON<Lead>(`${BASE}/leads/${id}/mockup-ready`, {
    method: 'PUT',
  });
}

// Tasks
export function getTasks(): Promise<Task[]> {
  return fetchJSON<Task[]>(`${BASE}/tasks`);
}

export function createTask(data: Partial<Task>): Promise<Task> {
  return fetchJSON<Task>(`${BASE}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  return fetchJSON<Task>(`${BASE}/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: string): Promise<void> {
  return fetchJSON<void>(`${BASE}/tasks/${id}`, { method: 'DELETE' });
}

export function completeTask(id: string): Promise<Task> {
  return fetchJSON<Task>(`${BASE}/tasks/${id}/complete`, {
    method: 'PUT',
  });
}

// Activities
export function getActivities(): Promise<Activity[]> {
  return fetchJSON<Activity[]>(`${BASE}/activities`);
}
