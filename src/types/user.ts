export interface LoginRequest {
  username: string;
  password: string;
}

export type RegisterRequest = LoginRequest;

export interface LoginResponse {
  user_id: number;
  username: string;
  token: string;
}

export interface UserPreferences {
  size?: string;
  favorite_color?: string;
  style?: string;
  [key: string]: unknown;
}

export interface User {
  id: number;
  username: string;
  preferences: UserPreferences;
}
