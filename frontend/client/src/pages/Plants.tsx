import { usePlants } from "@/hooks/use-plants";
import { ArrowLeft, MoreVertical, Droplets, Sun, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Plants() {
  const { data: plants, isLoading } = usePlants();

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs water': return 'text-blue-600 bg-blue-50';
      case 'check light': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
          </Link>
          <h1 className="text-xl font-display font-bold">In Greenhouse</h1>
        </div>
        <button className="p-2 -mr-2 hover:bg-secondary rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-muted-foreground" />
        </button>
      </header>

      <main className="px-6 py-6 max-w-3xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-secondary/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {plants?.map((plant, i) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl bg-secondary flex-shrink-0 overflow-hidden relative">
                   {/* Dynamic image or placeholder */}
                  {plant.imageUrl ? (
                    <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <Sun className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors">
                    {plant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{plant.species}</p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${getStatusColor(plant.healthStatus)}`}>
                  {plant.healthStatus === 'Needs Water' && <Droplets className="w-3 h-3" />}
                  {plant.healthStatus === 'Good' && <Sun className="w-3 h-3" />}
                  {plant.healthStatus !== 'Needs Water' && plant.healthStatus !== 'Good' && <AlertCircle className="w-3 h-3" />}
                  {plant.healthStatus}
                </div>
              </motion.div>
            ))}

            {plants?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No plants in your greenhouse yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
