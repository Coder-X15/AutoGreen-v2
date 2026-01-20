import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useLocation } from "wouter";
import type { LoginRequest, UpdateProfileRequest } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const userId = localStorage.getItem("userId"); // Simulating session for this demo

  // For this demo, we'll fetch a mock user if ID exists, or rely on login
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const url = buildUrl(api.auth.getUser.path, { id: userId });
      const res = await fetch(url);
      if (!res.ok) return null;
      return api.auth.getUser.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }

      const user = api.auth.login.responses[200].parse(await res.json());
      localStorage.setItem("userId", String(user.id));
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user", String(user.id)], user);
      setLocation("/");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest & { id: number }) => {
      const { id, ...updates } = data;
      const url = buildUrl(api.auth.updateProfile.path, { id });
      const res = await fetch(url, {
        method: api.auth.updateProfile.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      return api.auth.updateProfile.responses[200].parse(await res.json());
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user", String(updatedUser.id)], updatedUser);
    },
  });

  const logout = () => {
    localStorage.removeItem("userId");
    queryClient.setQueryData(["auth-user", null], null);
    setLocation("/auth");
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    logout,
  };
}
