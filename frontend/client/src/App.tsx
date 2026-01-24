import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import { ProtectedRoute } from "@/components/protected-route";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Plants from "@/pages/Plants";
import Trends from "@/pages/Trends";
import Tasks from "@/pages/Tasks";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const hideBottomNav = location === "/auth" || location === "/chat";

  return (
    <>
      <Switch>
        <Route path="/auth" component={Auth} />
        
        {/* Protected Routes */}
        <Route path="/" component={() => <ProtectedRoute component={Home} />} />
        <Route path="/plants" component={() => <ProtectedRoute component={Plants} />} />
        <Route path="/trends" component={() => <ProtectedRoute component={Trends} />} />
        <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
        <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
        <Route path="/chat" component={() => <ProtectedRoute component={Chat} />} />
        
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
