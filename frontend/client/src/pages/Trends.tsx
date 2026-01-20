import { useState } from "react";
import { useTrends } from "@/hooks/use-trends";
import { Search, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Trends() {
  const [search, setSearch] = useState("");
  const { data: trends, isLoading } = useTrends(search);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-2 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">Latest Trends</h1>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-secondary/50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            placeholder="Search news, tips, and trends..."
          />
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {isLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-secondary/50 rounded-3xl animate-pulse" />
            ))
          ) : (
            trends?.map((trend, i) => (
              <motion.article
                key={trend.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-border"
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                   {/* Unsplash image with descriptive comment */}
                  {/* gardening greenhouse plants close up */}
                  <img 
                    src={trend.imageUrl || "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=60"} 
                    alt={trend.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold font-display text-foreground leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {trend.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {trend.description}
                  </p>
                  
                  {trend.sourceUrl && (
                    <a 
                      href={trend.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80"
                    >
                      Read full story <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
