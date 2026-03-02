import { chatApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useConversations = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await chatApi.getConversations();
      return res.data.conversations;
    },
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  return {
    ...query,
    deleteConversation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
