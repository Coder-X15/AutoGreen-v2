import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";

import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Plants from "@/pages/Plants";
import Trends from "@/pages/Trends";
import Tasks from "@/pages/Tasks";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  const [location] = useLocation();
  const hideBottomNav = location === "/auth" || location === "/chat";

  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        
        {/* Protected Routes */}
        <Route path="/">
          {() => <ProtectedRoute component={Home} />}
        </Route>
        <Route path="/plants">
          {() => <ProtectedRoute component={Plants} />}
        </Route>
        <Route path="/trends">
          {() => <ProtectedRoute component={Trends} />}
        </Route>
        <Route path="/tasks">
          {() => <ProtectedRoute component={Tasks} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        <Route path="/chat">
          {() => <ProtectedRoute component={Chat} />}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router />
    </QueryClientProvider>
  );
}

export default App;
