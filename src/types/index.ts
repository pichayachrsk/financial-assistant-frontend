export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    tool_calls?: Array<{
      name: string;
      arguments: Record<string, unknown>;
      result: Record<string, unknown> | string | number | boolean | null;
      tool_call_id: string;
    }>;
  } | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
  conversation_id: string;
}

export interface HistoryResponse {
  messages: Message[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface StockQuote {
  symbol: string;
  name?: string | null;
  price: number;
  currency: string;
  change?: number | null;
  change_percent?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  previous_close?: number | null;
  volume?: number | null;
  market_cap?: number | null;
  fifty_two_week_high?: number | null;
  fifty_two_week_low?: number | null;
  fetched_at: string;
}

export interface MarketSummaryResponse {
  indices: StockQuote[];
  fetched_at: string;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
