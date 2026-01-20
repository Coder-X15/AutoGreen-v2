import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useChat() {
  const queryClient = useQueryClient();

  const history = useQuery({
    queryKey: [api.chat.history.path],
    queryFn: async () => {
      const res = await fetch(api.chat.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.chat.history.responses[200].parse(await res.json());
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.chat.send.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chat.history.path] });
    },
  });

  return {
    messages: history.data || [],
    isLoading: history.isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
}
