import api from "./api";
import { storage } from "./storage";
import type { User, PaginatedResponse, MeResponse } from "./types";

export type { User };

export const getCurrentUser = async (): Promise<MeResponse> => {
  const response = await api.get('/api/me');
  const data = response.data as MeResponse;
  storage.setUser(data.user);
  return data;
}

export const fetchUsers = async (params?: { 
  search?: string; 
  status?: string; 
  per_page?: number; 
  page?: number; 
}): Promise<PaginatedResponse<User>> => {
  const response = await api.get('/api/users', { params });

  return response.data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get(`/api/users/${id}`);

  return response.data.user;
};

export const createUser = async (data: any) => {
  const response = await api.post('/api/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/api/users/${id}`, data);
  return response.data;
};

export const updateUserStatus = async (id: number, status: 'active' | 'inactive') => {
  const response = await api.patch(`/api/users/${id}/status`, { status });
  return response.data;
};
