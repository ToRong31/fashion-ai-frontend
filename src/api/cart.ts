import { backendApi } from './client';
import type { CartResponse, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

export async function getCart(userId: number): Promise<CartResponse> {
  const { data } = await backendApi.get<CartResponse>('/api/cart', { params: { userId } });
  return data;
}

export async function addToCart(req: AddToCartRequest): Promise<CartItem> {
  const { data } = await backendApi.post<CartItem>('/api/cart/items', req);
  return data;
}

export async function updateCartItem(itemId: number, req: UpdateCartItemRequest): Promise<CartItem | null> {
  const response = await backendApi.put<CartItem>(`/api/cart/items/${itemId}`, req);
  if (response.status === 204) return null;
  return response.data;
}

export async function removeCartItem(itemId: number): Promise<void> {
  await backendApi.delete(`/api/cart/items/${itemId}`);
}

export async function clearCart(userId: number): Promise<void> {
  await backendApi.delete('/api/cart', { params: { userId } });
}
