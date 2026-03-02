import {
	AuthResponse,
	ConversationsResponse,
	HistoryResponse,
	LoginRequest,
	MarketSummaryResponse,
	RegisterRequest,
	SendMessageResponse,
	StockQuote
} from '@/types';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const PROXY_URL = '/api/proxy';

const getBaseUrl = () => {
    if (typeof window === 'undefined') return API_BASE_URL;
    return PROXY_URL;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/login', data, { baseURL: getBaseUrl() }),
  register: (data: RegisterRequest): Promise<AxiosResponse<void>> => 
    api.post('/auth/register', data, { baseURL: getBaseUrl() }),
  refresh: (data: { refresh_token: string }): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/refresh', data, { baseURL: getBaseUrl() }),
};

export const chatApi = {
  sendMessage: (message: string, conversationId?: string): Promise<AxiosResponse<SendMessageResponse>> => 
    api.post('/chat/message', { message, conversation_id: conversationId }, {
      baseURL: getBaseUrl()
    }),
  getConversations: (): Promise<AxiosResponse<ConversationsResponse>> => 
    api.get('/chat/conversations', {
      baseURL: getBaseUrl()
    }),
  getHistory: (conversationId: string): Promise<AxiosResponse<HistoryResponse>> => 
    api.get(`/chat/conversations/${conversationId}/history`, {
      baseURL: getBaseUrl()
    }),
  deleteConversation: (conversationId: string): Promise<AxiosResponse<void>> => 
    api.delete(`/chat/conversations/${conversationId}`, {
      baseURL: getBaseUrl()
    }),
  renameConversation: (conversationId: string, title: string): Promise<AxiosResponse<void>> => 
    api.patch(`/chat/conversations/${conversationId}`, { title }, {
      baseURL: getBaseUrl()
    }),
};

export const marketApi = {
  getQuote: (symbol: string): Promise<AxiosResponse<StockQuote>> => 
    api.get(`/market/quote/${symbol}`, {
      baseURL: getBaseUrl()
    }),
  getSummary: (): Promise<AxiosResponse<MarketSummaryResponse>> => 
    api.get('/market/summary', {
      baseURL: getBaseUrl()
    }),
};

export default api;
