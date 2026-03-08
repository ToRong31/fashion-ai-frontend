export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
}

export interface CreateOrderRequest {
  user_id: number;
  product_ids: number[];
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  items: OrderItem[];
  vnpay_ref: string | null;
}

export interface PaymentLinkResponse {
  order_id: number;
  payment_url: string;
}
