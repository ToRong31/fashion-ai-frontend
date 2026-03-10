export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  price: number;
  size: string | null;
  quantity: number;
  total_price: number;
}

export interface CartResponse {
  items: CartItem[];
  total_amount: number;
}

export interface AddToCartRequest {
  user_id: number;
  product_id: number;
  size?: string | null;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
  size?: string | null;
}
