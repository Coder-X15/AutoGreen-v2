import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTrends(search?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [api.trends.list.path, search],
    queryFn: async () => {
      const url = search
        ? `${api.trends.list.path}?search=${encodeURIComponent(search)}`
        : api.trends.list.path;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trends");
      return api.trends.list.responses[200].parse(await res.json());
    },
    enabled: options?.enabled,
  });
}
