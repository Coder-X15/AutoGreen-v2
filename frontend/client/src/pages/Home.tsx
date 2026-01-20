import { SoilStatCard } from "@/components/SoilStatCard";
import { Droplets, Thermometer, Sun, Wind, CloudRain, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  const stats = [
    { label: "Moisture", value: "97%", icon: Droplets, colorClass: "bg-blue-50 text-blue-600" },
    { label: "pH Level", value: "6.5", icon: Activity, colorClass: "bg-green-50 text-green-600" },
    { label: "Light", value: "15%", icon: Sun, colorClass: "bg-amber-50 text-amber-600" },
    { label: "Temperature", value: "24°C", icon: Thermometer, colorClass: "bg-red-50 text-red-600" },
    { label: "Humidity", value: "82%", icon: CloudRain, colorClass: "bg-indigo-50 text-indigo-600" },
    { label: "Air Flow", value: "Good", icon: Wind, colorClass: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Your soil stats</h1>
            <p className="text-muted-foreground mt-1 text-sm">Greenhouse A • Updated 5m ago</p>
          </div>
          <Link href="/profile">
             {/* Dynamic images: usually fetched from user profile */}
            <div className="w-12 h-12 rounded-full bg-secondary border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform">
               {/* placeholder avatar */}
               <img src="https://ui-avatars.com/api/?name=User&background=16a34a&color=fff" alt="User" />
            </div>
          </Link>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <SoilStatCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </main>
    </div>
  );
}
