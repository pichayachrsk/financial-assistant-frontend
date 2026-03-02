import { chatApi } from '@/lib/api';
import { HistoryResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useCallback, useMemo, useState } from 'react';

interface UseChatProps {
  conversationId?: string;
  onNewConversation?: (id: string) => void;
}

export const useChat = ({ conversationId, onNewConversation }: UseChatProps) => {
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['chat-history', conversationId], [conversationId]);

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey,
    queryFn: () => chatApi.getHistory(conversationId!),
    enabled: !!conversationId,
  });

  const messages = useMemo(() => historyData?.data?.messages ?? [], [historyData]);

  const messageMutation = useMutation({
    mutationFn: (userMsg: string) => chatApi.sendMessage(userMsg, conversationId),
    onSuccess: (response) => {
      const { user_message, assistant_message, conversation_id } = response.data;
      
      if (!conversationId && onNewConversation) {
        onNewConversation(conversation_id);
      } else {
        // Appending messages directly into the query cache to avoid local state syncing issues
        queryClient.setQueryData<AxiosResponse<HistoryResponse>>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              messages: [...old.data.messages, user_message, assistant_message],
            },
          };
        });
      }
      
      // Invalidate conversations list to show new title if needed
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const handleSendMessage = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || messageMutation.isPending) return;

    setInput('');
    messageMutation.mutate(trimmedInput);
  }, [input, messageMutation]);

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    isLoading: isHistoryLoading,
    isSending: messageMutation.isPending,
  };
};
