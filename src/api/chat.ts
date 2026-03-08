import { orchesApi } from './client';
import type { ChatRequest, ChatResponse } from '../types/chat';

export async function sendMessage(req: ChatRequest): Promise<ChatResponse> {
  const { data } = await orchesApi.post<ChatResponse>('/chat', req);
  return data;
}

export async function getConversationHistory(userId: string): Promise<{ history: { role: string; content: string }[] }> {
  const { data } = await orchesApi.get<{ history: { role: string; content: string }[] }>(`/conversation/${userId}`);
  return data;
}
