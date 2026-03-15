import { orchesApi } from './client';
import type { ChatRequest, ChatResponse } from '../types/chat';

export async function sendMessage(req: ChatRequest): Promise<ChatResponse> {
  const { data } = await orchesApi.post<ChatResponse>('/chat', req);
  return data;
}

export interface ChatHistoryItem {
  role: string;
  content: string;
  products?: Record<string, unknown>[];
  cart_items?: Record<string, unknown>[];
  orders?: Record<string, unknown>[];
}

export async function getConversationHistory(userId: string): Promise<{ history: ChatHistoryItem[] }> {
  const { data } = await orchesApi.get<{ history: ChatHistoryItem[] }>(`/conversation/${userId}`);
  return data;
}
