import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Activity, Heart, ArrowRight, Sparkles } from 'lucide-react';

const quotes = [
  "Your health is an investment, not an expense.",
  "Every journey starts with a single step towards well-being.",
  "Small daily improvements are the key to long-term health success.",
  "Trust the process. Resilience is built in the quiet moments of consistency.",
  "Your labs tell a story, but you write the ending.",
  "Strength doesn't come from what you can do; it comes from overcoming the things you once thought you couldn't."
];

export default function Home({ onNavigate }: { onNavigate: () => void }) {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-natural-sage/10 p-8 md:p-16 border border-natural-sage/20">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-natural-sage/20 text-natural-sage-dark rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Your Health Companion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-natural-title leading-tight mb-6"
          >
            Nurture Your Well-being with <span className="text-natural-sage">Precision</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-natural-muted mb-8"
          >
            Track your labs, monitor your progress, and stay resilient. A personalized journey to understanding your body.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigate}
            className="px-8 py-4 bg-natural-sage hover:bg-natural-sage-dark text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-natural-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 mr-32 mb-8 hidden md:block">
           <Activity className="w-48 h-48 text-natural-sage/20" />
        </div>
      </section>

      {/* Quote Carousel */}
      <section className="bg-white rounded-2xl p-8 border border-natural-border shadow-sm">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-4">
          <Quote className="w-10 h-10 text-natural-sage/30 mb-6" />
          <div className="h-24">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl md:text-2xl font-medium text-natural-title italic leading-relaxed"
              >
                "{quotes[currentQuote]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 mt-4">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuote(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentQuote ? 'bg-natural-sage w-6' : 'bg-natural-border hover:bg-natural-sage/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Milestones & Gratitude Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-natural-brown/5 rounded-3xl p-8 border border-natural-brown/10"
        >
          <h2 className="text-xl font-bold text-natural-title mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-natural-brown/10 flex items-center justify-center text-natural-brown">🗓️</span>
            Significant Milestones
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-natural-brown" />
              <div>
                <p className="text-xs font-bold text-natural-brown uppercase tracking-widest mb-1">Health Journey Start</p>
                <p className="text-lg font-bold text-natural-title">15 July 2024</p>
                <p className="text-sm text-natural-muted">The beginning of a resilient path towards recovery.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-natural-sage" />
              <div>
                <p className="text-xs font-bold text-natural-sage uppercase tracking-widest mb-1">Transplant Date</p>
                <p className="text-xl font-bold text-natural-title">20 March 2025</p>
                <p className="text-sm text-natural-muted italic">A new beginning. The gift of a healthier future.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-natural-sage/5 rounded-3xl p-8 border border-natural-sage/10 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-natural-title mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-natural-sage/10 flex items-center justify-center text-natural-sage">🙏</span>
              Heartfelt Gratitude
            </h2>
            <p className="text-natural-title font-medium italic leading-relaxed mb-4">
              "Deepest gratitude to the incredible doctors and medical staff at AIIMS for their dedication, skill, and compassion during this life-changing journey. Your expertise is the foundation of our hope."
            </p>
            <p className="text-natural-title font-medium italic leading-relaxed mb-4">
              "To my family and all my well-wishers: your unwavering support, prayers, and love have been my greatest strength. Thank you for standing by me every step of the way."
            </p>
            <div className="w-12 h-1 bg-natural-sage/30 rounded-full" />
          </div>
          {/* Decorative Background */}
          <div className="absolute bottom-0 right-0 -mr-8 -mb-8 opacity-[0.05]">
            <Heart className="w-32 h-32 text-natural-sage" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
