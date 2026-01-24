import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginRequest, UpdateProfileRequest, User } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";

export function useCurrentUser() {
  const userId = localStorage.getItem("userId");

  return useQuery<User | null>({
    queryKey: ["auth-user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const url = buildUrl(api.auth.getUser.path, { id: userId });
      const res = await fetch(url);
      if (!res.ok) {
        localStorage.removeItem("userId");
        return null;
      }
      return api.auth.getUser.responses[200].parse(await res.json());
    },
    staleTime: Infinity, // User data is stable, don't refetch automatically
  });
}

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }

      const user = await res.json();
      localStorage.setItem("userId", String(user.id));
      return user;
    },
    onSuccess: (user) => {
      // Defer navigation to the next event loop tick to avoid race conditions
      // with component unmounting during the mutation's render cycle.
      setTimeout(() => {
        queryClient.setQueryData(["auth-user", String(user.id)], user);
        // A full page reload is the most robust way to navigate after login,
        // ensuring all state is reset and avoiding complex race conditions
        // with React's render cycle and hook lifecycles.
        window.location.href = "/";
      }, 0);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest & { id: number }) => {
      const { id, ...updates } = data;
      const url = buildUrl(api.auth.updateProfile.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-user", String(updatedUser.id)], updatedUser);
    },
  });

  const logout = () => {
    localStorage.removeItem("userId");
    queryClient.setQueryData(["auth-user", null], null);
    window.location.href = "/auth";
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    logout,
  };
}
