import { useTasks, useToggleTask } from "@/hooks/use-tasks";
import { Check, Calendar, Clock, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const { mutate: toggleTask } = useToggleTask();

  const handleToggle = (id: number, currentStatus: boolean) => {
    toggleTask({ id, isCompleted: !currentStatus });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-border/40 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/">
            <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">Scheduled Tasks</h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-10">Keep your garden thriving</p>
      </header>

      <main className="px-6 py-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          {isLoading ? (
             [1, 2, 3].map(i => (
               <div key={i} className="h-20 bg-secondary/50 rounded-2xl animate-pulse" />
             ))
          ) : (
            <AnimatePresence mode="popLayout">
              {tasks?.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border",
                    task.isCompleted 
                      ? "bg-secondary/30 border-transparent opacity-60" 
                      : "bg-white border-border/50 shadow-sm hover:shadow-md hover:border-primary/20"
                  )}
                >
                  <button
                    onClick={() => handleToggle(task.id, task.isCompleted)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      task.isCompleted
                        ? "bg-primary border-primary text-white"
                        : "border-muted-foreground/30 hover:border-primary text-transparent"
                    )}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-bold text-lg transition-all",
                      task.isCompleted ? "text-muted-foreground line-through decoration-2 decoration-border" : "text-foreground"
                    )}>
                      {task.title}
                    </h3>
                    
                    {task.dueDate && (
                      <div className="flex items-center gap-2 mt-1 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(task.dueDate), "MMM d, h:mm a")}
                      </div>
                    )}
                  </div>

                  {!task.isCompleted && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-2 py-1 bg-accent/10 text-accent rounded text-[10px] font-bold uppercase tracking-wider">
                        Due Soon
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {tasks?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">All caught up!</h3>
              <p className="text-muted-foreground">No pending tasks for today.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
