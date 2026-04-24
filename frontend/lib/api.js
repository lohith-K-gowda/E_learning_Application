const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('ellipsonic_token') : null);

const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
};

export const login = (payload) => authFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const register = (payload) => authFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const getProfile = () => authFetch('/api/users/me');
export const getUsers = () => authFetch('/api/users');
export const getCourses = () => authFetch('/api/courses');
export const getCourseById = (id) => authFetch(`/api/courses/${id}`);
export const getAvailableCourses = () => authFetch('/api/courses/available');
export const createCourse = (payload) => authFetch('/api/courses', { method: 'POST', body: JSON.stringify(payload) });
export const updateCourse = (id, payload) => authFetch(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteCourse = (id) => authFetch(`/api/courses/${id}`, { method: 'DELETE' });
export const enrollCourse = (id) => authFetch(`/api/courses/${id}/enroll`, { method: 'POST' });
