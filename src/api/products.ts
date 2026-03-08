import { backendApi } from './client';
import type { Product, ProductListResponse } from '../types/product';

export async function getProducts(): Promise<ProductListResponse> {
  const { data } = await backendApi.get<ProductListResponse>('/api/products');
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await backendApi.get<Product>(`/api/products/${id}`);
  return data;
}

export async function vectorSearch(query: string, topK = 5): Promise<ProductListResponse> {
  const { data } = await backendApi.post<ProductListResponse>('/api/products/vector-search', {
    query,
    top_k: topK,
  });
  return data;
}
