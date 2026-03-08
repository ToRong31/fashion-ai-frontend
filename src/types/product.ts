export interface ProductMetadata {
  category?: string;
  color?: string;
  season?: string[];
  style?: string;
  material?: string;
  gender?: string;
  sizes_available?: string[];
  [key: string]: unknown;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  metadata: ProductMetadata | null;
}

export interface ProductListResponse {
  products: Product[];
}
