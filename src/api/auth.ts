import { backendApi } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/user';

export async function register(req: RegisterRequest): Promise<LoginResponse> {
  const { data } = await backendApi.post<LoginResponse>('/api/auth/register', req);
  return data;
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await backendApi.post<LoginResponse>('/api/auth/login', req);
  return data;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await backendApi.get<User>(`/api/users/${id}`);
  return data;
}
