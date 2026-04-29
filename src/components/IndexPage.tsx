import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { TypingText, InteractiveBackground, PageTransition, useInteraction } from './Shared';
import { ChevronRight, Crown } from 'lucide-react';

const IndexPage = () => {
  const navigate = useNavigate();
  const { isStarted, startExperience } = useInteraction();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const getCamera = async () => {
      if (!isStarted) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.log("Mirror camera access declined or unavailable:", err);
        }
      }
    };
    
    getCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isStarted]);

  return (
    <PageTransition>
      <InteractiveBackground />
      
      <AnimatePresence>
        {!isStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(30px) brightness(0)', scale: 1.2 }}
            transition={{ duration: 2, ease: "circOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background: Castle Balcony & Velvet Shadows */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[#0a0514]" />
              <img 
                src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=2400" 
                className="w-full h-full object-cover opacity-20 scale-110 blur-md grayscale-[0.5]"
                alt="Magic Castle"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B33]/60 via-transparent to-[#0a0514]" />
              {/* Velvet Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none" />
            </div>

            {/* Glowing Magical Butterflies (Light trails) */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  opacity: 0 
                }}
                animate={{ 
                  x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                  y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                  opacity: [0, 0.6, 0],
                  scale: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  duration: 8 + Math.random() * 15, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute z-10 text-white/50 pointer-events-none select-none blur-[1px]"
              >
                <div className="w-1 h-1 bg-[#E9D5FF] rounded-full shadow-[0_0_10px_2px_#E9D5FF]" />
              </motion.div>
            ))}

            {/* Ornate Mirror Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 group cursor-pointer flex flex-col items-center"
              onClick={startExperience}
            >
              {/* The Mirror itself */}
              <div className="relative w-72 md:w-96 aspect-[2/3] p-1 bg-gradient-to-b from-[#F7E7CE] via-[#C5A059] to-[#8a6d3b] rounded-[150px] shadow-[0_0_120px_rgba(197,160,89,0.3)] border-[4px] border-[#C5A059]/40 preserve-3d">
                <div className="w-full h-full overflow-hidden rounded-[145px] relative inner-shadow bg-[#0a0514]">
                  {/* Real-time Camera Reflection */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-125 contrast-125 opacity-30 scale-x-[-1]"
                  />

                  {/* Swirling Stardust Portal */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-30%] bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4999d?auto=format&fit=crop&q=80&w=1200')] bg-cover mix-blend-screen pointer-events-none"
                  />
                  
                  {/* Internal Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A2E]/60 via-transparent to-[#F7E7CE]/20 mix-blend-overlay pointer-events-none" />
                  
                  {/* Butterflies inside the portal */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          translateY: [20, -150],
                          translateX: [0, 20, -20, 0],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{ 
                          duration: 4 + Math.random() * 3, 
                          repeat: Infinity,
                          delay: Math.random() * 5
                        }}
                        className="absolute text-[#F7E7CE] font-serif"
                        style={{ left: `${20 + Math.random() * 60}%`, top: `${70 + Math.random() * 30}%` }}
                      >
                        ✦
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Royal Hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 2 }}
                className="mt-16 text-center"
              >
                <div className="glass px-10 py-5 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:border-amber-400/20 transition-all duration-700 shadow-2xl">
                  <Crown className="text-[#C5A059]/40 mb-1" size={24} strokeWidth={1} />
                  <span className="text-[10px] uppercase tracking-[1em] font-black text-[#F7E7CE]/50 animate-pulse">Touch the Awakening</span>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                  <p className="text-[8px] text-white/20 italic tracking-widest uppercase">To reveal your story</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center relative px-8 text-center select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="inline-block px-4 py-1 rounded-full glass border border-white/5 text-[10px] uppercase tracking-[0.4em] text-white/40 mb-12"
          >
            A soft space for curiosity
          </motion.div>
          
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 2px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)",
                "0 2px 20px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 255, 255, 0.5)",
                "0 2px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)"
              ],
              scale: [1, 1.01, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl md:text-8xl font-display italic text-white text-glow mb-10 leading-[1.1] tracking-tight relative flex flex-wrap justify-center items-center gap-x-4"
          >
            <TypingText text="Hey" delay={1.5} stagger={0.1} />
            <span className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.3, rotate: -20 }}
                animate={{ opacity: 1, y: -45, scale: 0.4, rotate: -15 }}
                transition={{ delay: 3.5, duration: 1.5, ease: "easeOut" }}
                className="absolute left-[-20%] top-0 text-white/50 pointer-events-none"
              >
                <Crown size={80} strokeWidth={0.5} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </motion.div>
              <TypingText text="Sindhu..." delay={2.5} stagger={0.1} />
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6, duration: 4 }}
            className="space-y-6"
          >
            <p className="text-white/40 text-xl font-light leading-relaxed italic">
              Some things are better felt slowly… <br />
              this is one of them.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 10, duration: 3 }}
          className="mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gift')}
            className="group relative flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="glass px-12 py-5 rounded-full flex items-center gap-4 hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.4)] transition-all duration-1000">
              <span className="text-[11px] uppercase tracking-[0.6em] font-black text-white/20 group-hover:text-white transition-colors">Move to little world</span>
              <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                <ChevronRight size={16} className="text-white/10 group-hover:text-white" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 12, duration: 3 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[1em] text-white/5"
      >
        Quietly crafted for the soft moments
      </motion.div>
    </PageTransition>
  );
};

export default IndexPage;

