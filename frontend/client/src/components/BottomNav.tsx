import { Link, useLocation } from "wouter";
import { Leaf, TrendingUp, CheckSquare, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { href: "/plants", icon: Leaf, label: "Plants" },
    { href: "/trends", icon: TrendingUp, label: "Trends" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  ];

  if (location === "/auth") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-white/80 backdrop-blur-md border-t border-border/50">
      
      {/* Floating AI Chat Button */}
      {location === "/" && (
        <div className="absolute right-6 -top-16">
          <Link href="/chat" className="group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-tr from-accent to-accent/80 rounded-full shadow-lg shadow-accent/30 flex items-center justify-center text-white cursor-pointer"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          </Link>
        </div>
      )}

      <nav className="max-w-md mx-auto flex justify-around items-center">
        {/* Home Button (Hidden but accessible via logo elsewhere, these are the main tabs) */}
        
        {tabs.map((tab) => {
          const isActive = location === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className={cn(
              "flex flex-col items-center justify-center space-y-1 w-16 transition-colors duration-200",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}>
              <div className="relative">
                <tab.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
