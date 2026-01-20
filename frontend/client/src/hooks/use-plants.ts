import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function usePlants() {
  return useQuery({
    queryKey: [api.plants.list.path],
    queryFn: async () => {
      const res = await fetch(api.plants.list.path);
      if (!res.ok) throw new Error("Failed to fetch plants");
      return api.plants.list.responses[200].parse(await res.json());
    },
  });
}

export function usePlant(id: number) {
  return useQuery({
    queryKey: [api.plants.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.plants.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch plant");
      return api.plants.get.responses[200].parse(await res.json());
    },
  });
}
