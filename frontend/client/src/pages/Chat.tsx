import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function Chat() {
  const { messages, sendMessage, isSending } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  return (
    <div className="flex flex-col fixed inset-0 bg-[#FFFDF7] z-[50]">
      <header className="px-6 py-4 flex items-center gap-4 bg-white/80 backdrop-blur-md border-b border-border/40 shrink-0 z-10">
        <Link href="/">
          <button className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-display font-bold flex items-center gap-2">
            Chat with Olivia <Sparkles className="w-4 h-4 text-accent" />
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AI Assistant Online
          </p>
        </div>
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-white text-foreground border border-border/50 rounded-tl-sm'
                }`}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(msg.content)) }}
              />
            </motion.div>
          ))}
          
          {isSending && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-border/50 flex gap-1.5 items-center shadow-sm">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-4 bg-white border-t border-border/40 shrink-0 mb-[env(safe-area-inset-bottom)]">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your plants..."
            className="flex-1 px-4 py-3 rounded-xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all outline-none min-h-[48px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
