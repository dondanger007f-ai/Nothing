import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { InteractiveBackground, PageTransition, TypingText, useInteraction, BrandLogo } from './Shared';
import { Heart, ChevronRight } from 'lucide-react';

const FinalPage = () => {
  const [isReady, setIsReady] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const { mood, setMoodIndex, playAudio } = useInteraction();

  useEffect(() => {
    // Slower transition to Warmth mood
    const timer = setTimeout(() => {
      setIsReady(true);
      setMoodIndex(3);
      playAudio();
    }, 4000);
    return () => clearTimeout(timer);
  }, [setMoodIndex, playAudio]);

  const triggerMagic = () => {
    setShowMagic(true);
    const end = Date.now() + 8 * 1000;
    const colors = ['#b19cd9', '#ffb7c5', '#ffffff', '#818cf8', '#f472b6'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        ticks: 300,
        gravity: 0.5,
        scalar: 0.8
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        ticks: 300,
        gravity: 0.5,
        scalar: 0.8
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <PageTransition>
      <InteractiveBackground />
      
      <div className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden select-none">
        <div className="z-10 text-center max-w-4xl">
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, delay: 1, duration: 2 }}
            className="w-40 h-40 rounded-full glass !p-0 flex items-center justify-center mx-auto mb-20 relative"
          >
            <motion.div 
               animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               className="absolute inset-0 bg-white/10 rounded-full blur-[80px]"
            />
            <BrandLogo size={100} />
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-display italic mb-12 leading-tight tracking-tight">
            <span className="text-white/20 block text-2xl md:text-3xl font-light mb-6 tracking-[0.4em] uppercase">Happy Birthday,</span>
            <TypingText text="Sindhuja" delay={3} className="text-white text-glow underline decoration-white/5 underline-offset-[20px]" />
          </h1>

          <div className="space-y-12 mb-32 h-64 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6, duration: 4 }}
              className="text-white/50 font-light text-3xl md:text-4xl italic leading-relaxed"
            >
              some people just leave the world <br />
              a little softer than they found it. <br />
              you're one of them.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 10, duration: 3 }}
              className="text-white/10 font-black text-[12px] tracking-[2em] uppercase"
            >
              thanks for existing.
            </motion.p>
          </div>

          <AnimatePresence>
            {isReady && !showMagic && (
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={triggerMagic}
                className="group relative"
              >
                <div className="absolute inset-0 bg-white/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="glass px-20 py-8 rounded-full text-[12px] font-black uppercase tracking-[0.8em] text-white/20 group-hover:text-white transition-all duration-1000 flex items-center gap-10">
                  <BrandLogo size={32} className="group-hover:animate-pulse" />
                  <span>Spark a wish</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {showMagic && (
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ type: "spring", damping: 15, duration: 2 }}
               className="mt-20 flex flex-col items-center gap-12"
             >
                <motion.div 
                  animate={{ scale: [1, 2, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Heart size={80} className="text-pink-400/80 stroke-[0.5px] fill-pink-400/10 shadow-[0_0_100px_rgba(244,114,182,0.4)]" />
                </motion.div>
                <div className="text-white/60 text-lg md:text-2xl font-display italic opacity-80 h-10">
                  <TypingText text="hope your year is as precious as you are." delay={0.5} stagger={0.05} />
                </div>
             </motion.div>
          )}
        </div>

        {/* Closing text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 15, duration: 5 }}
          className="absolute bottom-12 text-[8px] tracking-[2em] text-white/5 uppercase font-bold text-center w-full px-12"
        >
          Slowly • Softly • Specifically for you
        </motion.div>
      </div>

      {/* Finishing Ripple */}
      {showMagic && (
        <motion.div 
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 4 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-white rounded-full pointer-events-none z-[-1]"
        />
      )}
    </PageTransition>
  );
};

export default FinalPage;
