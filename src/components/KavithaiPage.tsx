import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { InteractiveBackground, PageTransition, useInteraction, BrandLogo } from './Shared';
import { Wind, ChevronRight } from 'lucide-react';

const poems = [
  "there's a certain way you tilt your head",
  "when you're thinking of something silly.",
  "it's my favorite part of the day.",
  "வாழ்க்கை சில சமயம் அமைதியானது..",
  "உன் நட்பு அதை அழகாக மாற்றியது.",
  "thanks for being exactly who you are.",
  "happy birthday, sindhuja."
];

const GlitchText = ({ text, active }: { text: string; active: boolean }) => {
  return (
    <span className="relative inline-block">
      {text}
      {active && (
        <>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [-2, 2, -1, 3, 0],
              clipPath: [
                "inset(20% 0 50% 0)",
                "inset(10% 0 80% 0)",
                "inset(40% 0 30% 0)",
                "inset(80% 0 10% 0)",
                "inset(0 0 0 0)"
              ]
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity, 
              repeatType: "reverse",
              repeatDelay: Math.random() * 5 + 2
            }}
            className="absolute top-0 left-0 w-full h-full text-white/40 select-none pointer-events-none"
          >
            {text}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              x: [2, -2, 1, -3, 0],
              clipPath: [
                "inset(50% 0 20% 0)",
                "inset(80% 0 10% 0)",
                "inset(30% 0 40% 0)",
                "inset(10% 0 80% 0)",
                "inset(0 0 0 0)"
              ]
            }}
            transition={{ 
              duration: 0.3, 
              repeat: Infinity, 
              repeatType: "reverse",
              repeatDelay: Math.random() * 4 + 3
            }}
            className="absolute top-0 left-0 w-full h-full text-white/20 select-none pointer-events-none"
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
};

const KavithaiPage = () => {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { triggerMoodShift } = useInteraction();

  const nextLine = () => {
    if (currentLine < poems.length - 1) {
      setCurrentLine(prev => prev + 1);
      if (currentLine % 3 === 0) triggerMoodShift();
    } else {
      setIsFinished(true);
    }
  };

  return (
    <PageTransition>
      <InteractiveBackground />
      
      <div className="min-h-screen flex items-center justify-center relative px-6">
        <div className="max-w-4xl w-full z-10 text-center relative py-12">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4 }}
            className="mb-24 inline-block"
          >
            <BrandLogo size={120} />
          </motion.div>

          <div className="space-y-16 min-h-[500px] flex flex-col justify-center text-center">
            <AnimatePresence mode="popLayout">
              {poems.slice(0, currentLine + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
                  animate={{ 
                    opacity: i === currentLine ? 1 : 0.05, 
                    y: 0, 
                    filter: i === currentLine ? 'blur(0px)' : 'blur(2px)',
                    scale: i === currentLine ? 1.05 : 0.95
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  <p className="text-3xl md:text-6xl font-display italic tracking-wide leading-relaxed text-white/80">
                    <GlitchText text={line} active={i === currentLine} />
                  </p>
                  {i === currentLine && (
                    <motion.div 
                      layoutId="poem-glow"
                      className="absolute inset-0 bg-white/5 blur-[120px] -z-10 opacity-40 rounded-full" 
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="mt-40"
          >
            {!isFinished ? (
              <motion.button
                onClick={nextLine}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex flex-col items-center gap-10"
              >
                <div className="flex items-center gap-8 text-[11px] uppercase tracking-[1em] font-black text-white/10 group-hover:text-white transition-all duration-1000">
                  <Wind size={20} className="text-white/20 group-hover:rotate-180 transition-transform duration-[2000ms]" />
                  <span> {currentLine < poems.length - 1 ? "Breathe deeper" : "One last thing"}</span>
                </div>
                <div className="relative h-16 w-[1px] overflow-hidden">
                  <motion.div 
                    animate={{ y: [-60, 60] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-white/20"
                  />
                </div>
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/intro')}
                className="group relative inline-flex flex-col items-center gap-8"
              >
                <div className="text-[11px] uppercase tracking-[1.2rem] font-black text-white/20 group-hover:text-white transition-all">
                  The End of the Path
                </div>
                <div className="glass px-12 py-5 rounded-full hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] transition-all">
                   <ChevronRight size={24} className="text-white/40 group-hover:text-white" />
                </div>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Quiet moment overlay */}
      {currentLine === 3 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.5, 1] }}
          className="fixed inset-0 z-50 bg-[#050507] pointer-events-none flex items-center justify-center p-12"
        >
          <span className="text-white/10 text-[10px] tracking-[1.5em] uppercase italic">just silence for a second...</span>
        </motion.div>
      )}
    </PageTransition>
  );
};

export default KavithaiPage;
