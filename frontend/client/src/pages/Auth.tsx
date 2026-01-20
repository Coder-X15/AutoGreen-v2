import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Auth() {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onError: (err) => setError(err.message),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-xl shadow-primary/20 mb-6">
            <span className="font-display font-bold text-3xl text-primary-foreground tracking-tighter">AG</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your greenhouse</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 ml-1">Username</label>
              <input
                {...form.register("username")}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="Enter your username"
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs ml-1">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 ml-1">Password</label>
              <input
                {...form.register("password")}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs ml-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center group"
            >
              {isLoggingIn ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Create one</span>
        </p>
      </motion.div>
    </div>
  );
}
