import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SoilStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  colorClass: string; // Tailwind color class like "bg-orange-100 text-orange-600"
  delay?: number;
}

export function SoilStatCard({ label, value, icon: Icon, colorClass, delay = 0 }: SoilStatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl p-5 ${colorClass} flex flex-col justify-between aspect-[4/5] shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Icon className="w-24 h-24 rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/40 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm mb-3">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-display font-bold tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}
