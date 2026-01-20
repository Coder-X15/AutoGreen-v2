import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, User, Mail, Building, LogOut, Settings } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const profileSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateProfile, isUpdating, logout } = useAuth();
  
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      organization: user?.organization || "",
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 py-4 flex items-center gap-4 bg-white border-b border-border/40">
        <Link href="/">
          <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1 className="text-xl font-display font-bold">Profile Settings</h1>
      </header>

      <main className="px-6 py-8 max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 mb-4 shadow-xl shadow-primary/20">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
               {/* Avatar placeholder */}
              <img 
                src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
          <p className="text-muted-foreground">{user.organization || "No Organization"}</p>
        </div>

        <form 
          onSubmit={form.handleSubmit((data) => updateProfile({ id: user.id, ...data }))}
          className="space-y-6"
        >
          <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Username</label>
                <input 
                  {...form.register("username")}
                  className="w-full bg-transparent font-medium text-foreground outline-none border-b border-transparent focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="h-px bg-border/50" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Email</label>
                <input 
                  {...form.register("email")}
                  className="w-full bg-transparent font-medium text-foreground outline-none border-b border-transparent focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="h-px bg-border/50" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Organization</label>
                <input 
                  {...form.register("organization")}
                  className="w-full bg-transparent font-medium text-foreground outline-none border-b border-transparent focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isUpdating ? "Saving..." : (
              <>
                <Settings className="w-5 h-5" /> Update Profile
              </>
            )}
          </button>
        </form>

        <button
          onClick={logout}
          className="w-full mt-4 py-4 rounded-xl font-bold text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </main>
    </div>
  );
}
