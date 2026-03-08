export interface ChatRequest {
  user_id: string;
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  agent_used: string | null;
  data: Record<string, unknown> | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent_used?: string | null;
  data?: Record<string, unknown> | null;
  timestamp: number;
}
