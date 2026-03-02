'use client';

import { useChat } from '@/hooks/useChat';
import { Message } from '@/types';
import { Bot, DollarSign, Send, Trash2, TrendingUp, User as UserIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface ChatProps {
  conversationId?: string;
  onNewConversation?: (id: string | undefined) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const toolCalls = message.metadata?.tool_calls;
  
  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`mt-1 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-indigo-400 border border-slate-700 ${isUser ? 'bg-slate-800' : 'bg-indigo-900/40'}`}>
          {isUser ? <UserIcon size={16} /> : <Bot size={16} />}
        </div>
        <div className={`flex flex-col gap-2`}>
          <div className={`rounded-2xl px-4 py-3 leading-relaxed shadow-sm whitespace-pre-wrap ${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
            {message.content}
          </div>
          
          {!isUser && toolCalls && toolCalls.length > 0 && (
            <div className="flex flex-col gap-2">
              {toolCalls.map((tool, idx) => (
                <div key={tool.tool_call_id || idx} className="bg-slate-900/50 border border-indigo-500/20 rounded-xl p-3 text-sm">
                  <div className="flex items-center gap-2 text-indigo-400 font-medium mb-2 border-b border-indigo-500/10 pb-1">
                    <TrendingUp size={14} />
                    <span>Result from {tool.name.replace(/_/g, ' ')}</span>
                  </div>
                  {tool.result && typeof tool.result === 'object' ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                      {Object.entries(tool.result).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-slate-200 font-mono">
                            {typeof value === 'number' && key.includes('rate') || key.includes('value') ? `${value}%` : String(value)}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-300 italic">{String(tool.result)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Chat: React.FC<ChatProps> = ({ conversationId, onNewConversation, onDelete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    messages, 
    input, 
    setInput, 
    handleSendMessage, 
    isLoading, 
    isSending 
  } = useChat({ conversationId, onNewConversation });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-500/20 shadow-lg">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">FinBot AI</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Real-time Market Data Enabled
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           {conversationId && onDelete && (
             <button 
              onClick={(e) => onDelete(conversationId, e)}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-all group"
              title="Delete conversation"
             >
                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
             </button>
           )}
           <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <TrendingUp size={20} />
           </button>
           <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <DollarSign size={20} />
           </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Bot size={64} className="mb-4" />
            <p className="text-xl font-medium">How can I help with your finances today?</p>
            <p className="text-sm">Ask about any stocks, trends, or market symbols.</p>
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))
        )}
        {isSending && (
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-900/40 border border-slate-700 flex items-center justify-center animate-pulse">
              <Bot size={16} className="text-indigo-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-500 italic">
              Scanning markets...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer / Input */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search symbols or ask financial questions..."
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};
