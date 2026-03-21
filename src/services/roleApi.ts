import api from "./api";
import type { Role, PaginatedResponse } from "./types";

export const fetchRoles = async (params?: { 
  search?: string; 
  dropdown?: number; 
  per_page?: number; 
  page?: number; 
}): Promise<PaginatedResponse<Role> | { data: Role[] }> => {
  const response = await api.get('/api/roles', { params });
  return response.data;
};

export const fetchRole = async (id: number): Promise<Role> => {
  const response = await api.get(`/api/roles/${id}`);
  return response.data.data;
};

export const createRole = async (data: { 
  name: string; 
  slug: string; 
  permission_ids: number[]; 
}) => {
  const response = await api.post('/api/roles', data);
  return response.data;
};

export const updateRole = async (id: number, data: { 
  name?: string; 
  slug?: string; 
  permission_ids?: number[]; 
}) => {
  const response = await api.put(`/api/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: number) => {
  const response = await api.delete(`/api/roles/${id}`);
  return response.data;
};
