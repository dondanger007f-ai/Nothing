import React, { useEffect, useState, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Crown } from 'lucide-react';

// Global state for mood/interaction
const InteractionContext = createContext<{
  mood: number;
  triggerMoodShift: () => void;
  addTouch: (x: number, y: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  playAudio: () => void;
  isStarted: boolean;
  startExperience: () => void;
  setMoodIndex: (index: number) => void;
}>({ 
  mood: 0, 
  triggerMoodShift: () => {}, 
  addTouch: () => {}, 
  isMuted: false, 
  toggleMute: () => {}, 
  playAudio: () => {},
  isStarted: false,
  startExperience: () => {},
  setMoodIndex: () => {}
});

const introSong = "https://files.catbox.moe/uhufqe.mpeg";
const finalSong = "https://files.catbox.moe/8j3khk.mpeg";
const defaultSong = "https://files.catbox.moe/pofntt.mp3";

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [touches, setTouches] = useState<{ id: number, x: number, y: number, emoji: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  // Choose song based on location
  const currentSong = useMemo(() => {
    if (location.pathname === '/final') return finalSong;
    if (location.pathname === '/intro' || location.pathname === '/memory') return introSong;
    return defaultSong;
  }, [location.pathname]);

  // Handle source changes - strictly only when URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      const absoluteCurrent = new URL(currentSong, window.location.href).href;
      if (audio.src !== absoluteCurrent) {
        audio.src = currentSong;
        audio.load();
        if (isStarted && !isMuted) {
          audio.play().catch(err => console.log("Play failed after source change:", err));
        }
      }
    } catch (e) {
      console.error("Audio src change error:", e);
    }
  }, [currentSong]);

  // Handle play/pause sync on state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isStarted) return;

    if (!isMuted) {
      audio.play().catch(() => {
        console.log("Play blocked/deferred");
      });
    } else {
      audio.pause();
    }
  }, [isMuted, isStarted]);

  // Scroll to top on every route change - IMMUTABLE rule
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    // Also scroll any possible overflow containers with zero delay
    const scrollable = [document.documentElement, document.body];
    scrollable.forEach(el => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
    
    // Short delay fallback for slower renders
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const triggerMoodShift = useCallback(() => setMood(prev => (prev + 1) % 4), []);
  const setMoodIndex = useCallback((index: number) => setMood(index % 4), []);
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const startExperience = useCallback(() => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const addTouch = useCallback((x: number, y: number) => {
    // If we haven't started yet, allow the first touch to start everything
    if (!isStarted) {
      startExperience();
    }

    const id = Date.now();
    const emojis = ['💖', '✨', '🌸', '☁️', '🎐', '💫', '🦋'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setTouches(prev => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setTouches(prev => prev.filter(t => t.id !== id));
    }, 1500);
    if (Math.random() > 0.8) triggerMoodShift();
  }, [isStarted, startExperience, triggerMoodShift]);

  const playAudio = useCallback(() => {
    if (audioRef.current && isStarted && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  }, [isStarted, isMuted]);

  return (
    <InteractionContext.Provider value={{ mood, triggerMoodShift, setMoodIndex, addTouch, isMuted, toggleMute, playAudio, isStarted, startExperience }}>
      <div 
        className="relative min-h-screen w-full overflow-hidden"
        onMouseDown={(e) => addTouch(e.clientX, e.clientY)}
        onTouchStart={(e) => addTouch(e.touches[0].clientX, e.touches[0].clientY)}
      >
        <audio 
          ref={audioRef}
          loop 
          preload="auto"
          onLoadedData={() => {
            if (audioRef.current) {
              audioRef.current.volume = 0.4;
              if (isStarted && !isMuted) audioRef.current.play().catch(() => {});
            }
          }}
          onError={(e) => {
            const target = e.target as HTMLAudioElement;
            const error = target.error;
            let errorMessage = "Unknown Audio Error";
            
            if (error) {
              switch (error.code) {
                case 1: errorMessage = "Aborted by user"; break;
                case 2: errorMessage = "Network error while loading"; break;
                case 3: errorMessage = "Audio decoding failed (unsupported format?)"; break;
                case 4: errorMessage = "Source not supported or URL dead"; break;
              }
            }

            console.error("Audio Load Error Details:", {
              code: error?.code,
              message: errorMessage,
              src: currentSong
            });
          }}
        />
        {children}
        <AnimatePresence>
          {touches.map(touch => (
            <React.Fragment key={touch.id}>
              <motion.div
                initial={{ opacity: 0.8, scale: 0, y: 0 }}
                animate={{ opacity: 0, scale: 2.5, y: -150, rotate: Math.random() * 60 - 30 }}
                exit={{ opacity: 0 }}
                className="fixed pointer-events-none z-[9999] text-3xl"
                style={{ left: touch.x, top: touch.y }}
              >
                {touch.emoji}
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150" />
              </motion.div>
              {/* Ripple effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                className="fixed pointer-events-none z-[9998] w-40 h-40 border border-white/20 rounded-full"
                style={{ left: touch.x - 80, top: touch.y - 80 }}
              />
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </InteractionContext.Provider>
  );
};

export const useInteraction = () => useContext(InteractionContext);

export const TypingText = React.memo(({ text, delay = 0, className = "", onComplete, stagger = 0.05 }: { text: string, delay?: number, className?: string, onComplete?: () => void, stagger?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    // Reset if text changes
    setDisplayedText("");
    
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, stagger * 1000);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay, stagger]); // Removed onComplete from deps to be safe

  return (
    <motion.span 
      animate={{ opacity: [0.9, 1, 0.9] }} 
      transition={{ duration: 3, repeat: Infinity }}
      className={className}
    >
      {displayedText}
    </motion.span>
  );
});

TypingText.displayName = "TypingText";

export const InteractiveBackground = () => {
  const { mood } = useInteraction();
  const mouseX = useSpring(0, { stiffness: 30, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 30, damping: 25 });

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
    };
  }, [mouseX, mouseY]);

  const moods = [
    'from-[#050507] via-[#0d0c14] to-[#050507]', // Index: Deep Silence
    'from-[#07050a] via-[#150d18] to-[#07050a]', // Gifts: Curiosity
    'from-[#0b080f] via-[#1a1226] to-[#0b080f]', // Memories: Nostalgia
    'from-[#0d080a] via-[#2a1318] to-[#0d080a]', // Final: Warmth
  ];

  const auraColors = ['#b19cd9', '#818cf8', '#ffb7c5', '#f472b6'];

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ opacity: 1 }}
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-[4000ms] ease-in-out ${moods[mood]}`}
      />
      
      {/* Reactive Aura - Stronger and deeper */}
      <motion.div 
        className="absolute w-[120vw] h-[120vw] rounded-full blur-[180px] opacity-25 transition-colors duration-[3000ms]"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: '-50%', 
          translateY: '-50%',
          backgroundColor: auraColors[mood]
        }}
      />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay contrast-125" />

      {/* Floating Blobs for depth */}
      <motion.div 
        animate={{ 
          x: [0, 100, -100, 0], 
          y: [0, -100, 100, 0],
          scale: [1, 1.2, 0.9, 1] 
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 80, 0], 
          y: [0, 80, -80, 0],
          scale: [1, 0.8, 1.1, 1] 
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[150px]"
      />

      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <Particle key={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>
    </div>
  );
};

const Particle: React.FC<{ mouseX: any, mouseY: any }> = ({ mouseX, mouseY }) => {
  const initialX = useMemo(() => Math.random() * 100, []);
  const initialY = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 4 + 2, []);
  const driftSpeed = useMemo(() => Math.random() * 0.05 + 0.01, []);
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  const color = useMemo(() => {
    const colors = ['rgba(255,255,255,0.2)', 'rgba(255,182,193,0.15)', 'rgba(177,156,217,0.15)', 'rgba(135,206,235,0.1)'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  
  // Dynamic position handles
  const x = useTransform([mouseX, mouseY], ([mx, my]: any) => {
    const screenX = (initialX / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const screenY = (initialY / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000);
    
    const dx = mx - screenX;
    const dy = my - screenY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Swirl logic
    const force = Math.max(0, (400 - dist) / 400);
    const angle = Math.atan2(dy, dx) + force * Math.PI; // Swirl angle
    
    const swirlX = Math.cos(angle) * force * 100;
    const driftX = Math.sin(Date.now() / 2000 + angleOffset) * 20;
    
    return swirlX + driftX;
  });

  const y = useTransform([mouseX, mouseY], ([mx, my]: any) => {
    const screenX = (initialX / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const screenY = (initialY / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000);
    
    const dx = mx - screenX;
    const dy = my - screenY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const force = Math.max(0, (400 - dist) / 400);
    const angle = Math.atan2(dy, dx) + force * Math.PI;
    
    const swirlY = Math.sin(angle) * force * 100;
    const driftY = Math.cos(Date.now() / 2000 + angleOffset) * 20;
    
    return swirlY + driftY;
  });

  const scale = useTransform([mouseX, mouseY], ([mx, my]: any) => {
    const screenX = (initialX / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const screenY = (initialY / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000);
    const dist = Math.sqrt(Math.pow(mx - screenX, 2) + Math.pow(my - screenY, 2));
    return dist < 300 ? 1.5 : 1;
  });

  const opacity = useTransform([mouseX, mouseY], ([mx, my]: any) => {
    const screenX = (initialX / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const screenY = (initialY / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000);
    const dist = Math.sqrt(Math.pow(mx - screenX, 2) + Math.pow(my - screenY, 2));
    return dist < 300 ? 0.6 : 0.15;
  });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        backgroundColor: color,
        x, y, scale, opacity,
        boxShadow: `0 0 10px ${color}`,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: 'blur(30px) brightness(1.5)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px) brightness(1)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(30px) brightness(0.5)' }}
    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

export const RevealOnScroll = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const BrandLogo: React.FC<{ size?: number, className?: string }> = ({ size = 64, className = "" }) => {
  return (
    <motion.div 
      animate={{ 
        y: [0, -5, 0],
        rotate: [-2, 2, -2]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 4,
        ease: "easeInOut"
      }}
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      <Crown 
        className="text-yellow-400 fill-yellow-400/20 mb-[-12px] relative z-10 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" 
        size={size * 0.45} 
      />
      <div 
        className="rounded-full glass border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-xl relative"
        style={{ width: size, height: size }}
      >
        <span 
          className="font-display italic font-bold bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-md"
          style={{ fontSize: size * 0.55 }}
        >
          S
        </span>
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10" />
      </div>
    </motion.div>
  );
};
