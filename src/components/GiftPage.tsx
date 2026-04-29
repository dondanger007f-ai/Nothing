import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Gift as GiftIcon, X, ChevronRight } from 'lucide-react';
import { InteractiveBackground, PageTransition, useInteraction, TypingText, BrandLogo } from './Shared';

const giftsData = [
  { id: 1, message: "you have this quiet way of making everyone feel heard. it's rare.", title: "Whisper", color: "from-pink-500/20 to-lavender-500/10", animation: "wobble" },
  { id: 2, message: "somehow, you make things feel lighter without even trying. it's nice.", title: "Glow", color: "from-blue-500/20 to-cyan-500/10", animation: "glow" },
  { id: 3, message: "i'm still learning how to be as kind as you are. i'm getting there.", title: "Sincerity", color: "from-purple-600/20 to-rose-500/10", animation: "breath" },
  { id: 4, message: "you deserve all the softest, most beautiful things in the world. purely.", title: "Softness", color: "from-indigo-600/20 to-blue-400/10", animation: "float" },
  { id: 5, message: "don't ever lose that goofy side of yours. it's the best part.", title: "Playful", color: "from-teal-500/20 to-emerald-400/10", animation: "spin" },
  { id: 6, message: "whatever happens, i'm genuinely glad we're in each other's worlds.", title: "Connection", color: "from-violet-600/30 to-fuchsia-500/10", animation: "drift" },
];

const GiftPage = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [selectedGift, setSelectedGift] = useState<typeof giftsData[0] | null>(null);
  const [isOpening, setIsOpening] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const { triggerMoodShift } = useInteraction();

  const handleOpen = (gift: typeof giftsData[0]) => {
    if (unlocked.includes(gift.id)) {
      setSelectedGift(gift);
      return;
    }
    
    setIsOpening(gift.id);
    // Add anticipation delay before actually starting the "opening" sequence
    setTimeout(() => {
      setTimeout(() => {
        setUnlocked([...unlocked, gift.id]);
        setSelectedGift(gift);
        setIsOpening(null);
        setShowCelebration(true);
        triggerMoodShift();
        // Reset celebration after a literal burst
        setTimeout(() => setShowCelebration(false), 3000);
      }, 2000); // Intentionally slow
    }, 400); // Anticipation pause
  };

  return (
    <PageTransition>
      <InteractiveBackground />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] pointer-events-none bg-white/10 backdrop-blur-sm"
          >
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div 
                 initial={{ scale: 0, opacity: 1 }}
                 animate={{ scale: 4, opacity: 0 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="w-64 h-64 border-2 border-white/40 rounded-full"
               />
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                   animate={{ 
                     x: (Math.random() - 0.5) * 1000, 
                     y: (Math.random() - 0.5) * 1000, 
                     opacity: 0,
                     scale: 0
                   }}
                   transition={{ duration: 2, ease: "easeOut" }}
                   className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                 />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen py-20 px-6 relative overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto z-10 relative">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="mb-8 inline-block"
            >
              <BrandLogo size={100} />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="text-5xl md:text-8xl font-display italic tracking-tight"
            >
              Quiet Tokens
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 3 }}
              className="text-white/30 text-sm italic mt-8 max-w-sm mx-auto"
            >
              six small thoughts i found while <br /> wandering around my headspace...
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
            className="flex flex-col items-center mb-40 cursor-pointer group"
            onClick={() => document.getElementById('gift-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="text-[10px] uppercase tracking-[1em] text-white/20 group-hover:text-white/40 transition-colors mb-4">Discover</div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>

          <div id="gift-grid" className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
            {giftsData.map((gift, index) => (
              <div key={gift.id}>
                <GiftCard 
                  gift={gift} 
                  index={index} 
                  isOpened={unlocked.includes(gift.id)} 
                  onOpen={() => handleOpen(gift)}
                  isLoading={isOpening === gift.id}
                />
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 3 }}
            className="mt-40 flex justify-center pb-20"
          >
            <button 
              onClick={() => navigate('/kavithai')}
              className="group flex flex-col items-center gap-10"
            >
              <div className="text-[11px] uppercase tracking-[1em] font-black text-white/10 group-hover:text-white transition-all">
                The poetry of now
              </div>
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl">
                <ChevronRight size={24} className="text-white/20 group-hover:text-white" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedGift && (
          <GiftOverlay gift={selectedGift} onClose={() => setSelectedGift(null)} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

const GiftCard = ({ gift, index, isOpened, onOpen, isLoading }: { gift: any, index: number, isOpened: boolean, onOpen: () => void, isLoading: boolean }) => {
  const animPresets = {
    wobble: { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] },
    glow: { scale: [1, 1.4, 1], filter: ["blur(0px)", "blur(15px)", "blur(0px)"] },
    breath: { scale: [0.9, 1.1, 0.9] },
    float: { y: [0, -30, 0], rotate: [0, 5, -5, 0] },
    spin: { rotateY: [0, 180, 0], scale: [1, 1.1, 1] },
    drift: { x: [0, 25, -25, 0], scale: [1, 1.2, 1] }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2 + 2, duration: 2 }}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.08, rotate: index % 2 === 0 ? 4 : -4 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpen}
        className={`
          aspect-square rounded-[3.5rem] glass flex items-center justify-center cursor-pointer overflow-hidden
          ${isOpened ? 'shadow-[0_0_80px_rgba(255,255,255,0.15)] ring-1 ring-white/10' : 'hover:bg-white/[0.08]'}
          transition-all duration-1000 relative
        `}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gift.color} ${isOpened ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'} transition-opacity duration-1000`} />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={isOpened ? (animPresets as any)[gift.animation] : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <GiftIcon 
              size={40} 
              className={`${isOpened ? 'text-white' : 'text-white/10'} transition-all duration-1000 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`} 
            />
          </motion.div>
          <div className={`mt-8 text-[10px] uppercase tracking-[0.8em] font-black transition-all duration-1000 ${isOpened ? 'text-white/60' : 'text-white/10'}`}>
            {gift.title}
          </div>

          {isLoading && (
             <motion.div 
               className="absolute inset-0 bg-[#08080a]/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
             >
               <motion.div 
                 animate={
                   gift.animation === 'spin' ? { rotateY: [0, 360], scale: [1, 1.2, 1] } :
                   gift.animation === 'glow' ? { scale: [1, 1.5, 1], filter: ["blur(0px)", "blur(10px)", "blur(0px)"] } :
                   { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                 }
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center relative"
               >
                 <BrandLogo size={32} />
                 {gift.animation === 'glow' && (
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-white/20 rounded-full"
                    />
                 )}
               </motion.div>
               <span className="mt-6 text-[8px] uppercase tracking-[0.4em] text-white/40 font-black">
                 {gift.animation === 'wobble' ? 'Unwrapping...' : gift.animation === 'glow' ? 'Igniting...' : 'Revealing...'}
               </span>
             </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const GiftOverlay = ({ gift, onClose }: { gift: any, onClose: () => void }) => {
  const [canShowText, setCanShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanShowText(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-[40px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 25, duration: 1.5 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full relative text-center flex flex-col items-center p-14 glass-premium rounded-[3rem]"
      >
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="mb-14 relative"
        >
          <motion.div 
             animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 5, repeat: Infinity }}
             className="absolute inset-0 bg-white/20 blur-[120px] rounded-full"
          />
          <BrandLogo size={120} className="relative z-10" />
        </motion.div>
        
        <h3 className="text-white/30 text-[10px] uppercase tracking-[1.2em] font-black mb-10">{gift.title}</h3>
        
        <div className="text-white text-4xl md:text-5xl font-display italic leading-relaxed min-h-[160px] flex items-center justify-center text-glow">
          {canShowText && (
            <TypingText text={gift.message} stagger={0.08} />
          )}
        </div>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: canShowText ? 1 : 0 }}
          transition={{ delay: 1 }}
          onClick={onClose}
          className="mt-20 text-[11px] uppercase tracking-[0.8em] text-white/30 hover:text-white transition-all font-black px-14 py-5 rounded-full border border-white/10 hover:bg-white/10"
        >
          Return to world
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GiftPage;

