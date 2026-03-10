import { backendApi } from './client';
import type { CreateOrderRequest, Order, PaymentLinkResponse } from '../types/order';

export async function autoCreateOrder(req: CreateOrderRequest): Promise<Order> {
  const { data } = await backendApi.post<Order>('/api/orders/auto-create', req);
  return data;
}

/** Creates order from the user's cart, clears the cart, returns the order with vnpay_ref */
export async function checkoutFromCart(userId: number): Promise<Order> {
  const { data } = await backendApi.post<Order>('/api/orders/checkout', { user_id: userId });
  return data;
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await backendApi.get<Order>(`/api/orders/${id}`);
  return data;
}

export async function getPaymentLink(orderId: number): Promise<PaymentLinkResponse> {
  const { data } = await backendApi.get<PaymentLinkResponse>('/api/payments/vnpay-gen', {
    params: { orderId },
  });
  return data;
}
