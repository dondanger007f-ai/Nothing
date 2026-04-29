import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { InteractiveBackground, PageTransition, TypingText, useInteraction, BrandLogo } from './Shared';
import { ChevronRight } from 'lucide-react';

const IntroPage = () => {
  const navigate = useNavigate();
  const { triggerMoodShift, playAudio } = useInteraction();

  React.useEffect(() => {
    playAudio();
  }, [playAudio]);

  return (
    <PageTransition>
      <InteractiveBackground />
      <div className="min-h-screen flex items-center justify-center px-6 relative py-20">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 z-10">
          
          {/* Friend's Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass p-4 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/regenerated_image_1777485027807.png" 
                alt="Sindhuja"
                className="w-72 h-96 object-cover rounded-2xl transition-all duration-700"
              />
              <div className="absolute -top-10 -right-10 z-20">
                <BrandLogo size={80} />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <TypingText 
                text="The star of this story..."
                className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold"
              />
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-display italic text-white leading-tight"
              >
                Sindhuja.
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg text-white/60 font-light leading-relaxed max-w-md"
            >
              Before we walk through the memories we've gathered, take a moment to see the person who makes every second worth remembering.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={() => {
                triggerMoodShift();
                navigate('/memory');
              }}
              className="group relative inline-flex items-center gap-4 py-4 px-8 rounded-full glass hover:bg-white/10 transition-all"
            >
              <span className="text-sm tracking-[0.2em] font-bold uppercase">See our moments</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default IntroPage;
