import { useCurrentUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import React from "react";

// The `component` prop is not a standard prop for a React component. 
// The `ProtectedRoute` component expects `children`.
export const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { data: user, isLoading } = useCurrentUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return <Component />;
};
