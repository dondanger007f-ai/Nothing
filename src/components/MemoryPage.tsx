import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { InteractiveBackground, PageTransition, useInteraction, TypingText, BrandLogo } from './Shared';

const memories = [
  { id: '1', url: '/regenerated_image_1777486905534.png', caption: 'sometimes the quietest mornings say the most.', date: 'Daybreak', x: '8%', y: '12%' },
  { id: '2', url: '/regenerated_image_1777486134123.png', caption: 'how did we ever start talking? serendipity, i guess.', date: 'First Sparks', x: '65%', y: '5%' },
  { id: '3', url: 'https://images.unsplash.com/photo-1518173946687-a4c8a9843586?auto=format&fit=crop&q=80&w=800', caption: 'some things just flow naturally. like us.', date: 'Serendipity', x: '12%', y: '58%' },
  { id: '4', url: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&q=80&w=800', caption: 'there’s a specific kind of beauty in our silence.', date: 'Deep Stillness', x: '58%', y: '52%' },
  { id: '5', url: '/regenerated_image_1777485288476.png', caption: 'every winding road, every quiet peak... it is all better with you.', date: 'Mountain Soul', x: '32%', y: '32%' },
  { id: '6', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800', caption: 'just a soft thought on a long day.', date: 'Reflection', x: '75%', y: '40%' },
];

const MemoryPage = () => {
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const navigate = useNavigate();
  const { mood, setMoodIndex, playAudio } = useInteraction();

  useEffect(() => {
    setMoodIndex(2);
    playAudio();
  }, [setMoodIndex, playAudio]);

  // Auto-advance logic
  useEffect(() => {
    if (!selectedImg) return;

    const timer = setTimeout(() => {
      const currentIndex = memories.findIndex(m => m.id === selectedImg.id);
      const nextIndex = (currentIndex + 1) % memories.length;
      setSelectedImg(memories[nextIndex]);
    }, 8000); // 8 seconds of focus before advancing

    return () => clearTimeout(timer);
  }, [selectedImg]);

  return (
    <PageTransition>
      <InteractiveBackground />

      <div className="min-h-screen py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto z-10 relative">
          <div className="mb-32 text-center relative">
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 2 }}
              className="mb-8"
            >
              <BrandLogo size={100} />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-display italic tracking-tight text-white text-glow"
            >
              Scattered Moments
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 3 }}
              className="text-white/30 text-sm italic mt-6"
            >
              like polaroids left on a messy desk... <br />
              tap to hold them a little closer.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
            className="flex flex-col items-center mb-40 cursor-pointer group"
            onClick={() => document.getElementById('photo-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="text-[10px] uppercase tracking-[1em] text-white/20 group-hover:text-white/40 transition-colors mb-4">Discover</div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>

          {/* 
              PHOTO PLACEMENT GUIDE:
              To replace with your own photos:
              1. Update the 'url' fields in the 'memories' array at the top of this file.
              2. You can use direct links to your photos (e.g., from Google Drive, Dropbox, or your own server).
              3. If you have photos locally, upload them to a service like PostImages or Imgur and use the 'Direct Link'.
          */}

          <div id="photo-grid" className="relative h-[900px] w-full">
            {memories.map((memory, i) => {
                const randomRotation = useMemo(() => (Math.random() * 20 - 10), []);
                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.7, rotate: randomRotation * 4, x: 0, y: 100, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, rotate: randomRotation, x: 0, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.7 + 2, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ 
                      y: -40, 
                      rotate: 0,
                      scale: 1.05,
                      zIndex: 50,
                    }}
                    onClick={() => setSelectedImg(memory)}
                    className="absolute cursor-pointer perspective-1000 w-64 md:w-80 group"
                    style={{ left: memory.x, top: memory.y }}
                  >
                    <div className="bg-white p-4 pb-12 rounded-sm transform transition-all duration-1000 group-hover:shadow-[0_60px_120px_rgba(255,255,255,0.15)] border-[10px] border-white relative overflow-hidden">
                      <div className="aspect-[4/5] overflow-hidden relative rounded-xs bg-gray-100">
                        <motion.img 
                          src={memory.url} 
                          alt={memory.caption} 
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                        />
                      </div>
                      <div className="mt-8 text-center px-4">
                        <div className="text-[#1a1a1a]/60 text-sm md:text-base font-display italic leading-relaxed">
                          {memory.caption}
                        </div>
                      </div>
                      
                      {/* Subtle "discovered" effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                );
            })}
          </div>

          {/* New Section: Her Eyes */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="mt-60 mb-80 text-center relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-96 bg-accent-pink/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10 space-y-12">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto overflow-hidden rounded-2xl glass p-3"
              >
                <div className="aspect-[21/9] overflow-hidden rounded-xl transition-all duration-1000 relative group">
                  <img 
                    src="/regenerated_image_1777487035796.png" 
                    alt="Her Eyes"
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3000ms]"
                  />
                </div>
              </motion.div>
              
              <div className="space-y-6">
                <TypingText 
                  text="the universe in a single glance..."
                  className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-bold"
                />
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="text-4xl md:text-6xl font-display italic text-white"
                >
                  Window to the soul.
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                  className="max-w-md mx-auto text-white/50 font-light leading-relaxed italic"
                >
                  "Sometimes, the most profound conversations happen without a single word being spoken. It's all there, in your eyes—the story we're writing together."
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 3 }}
            className="mt-60 flex justify-center pb-32"
          >
            <button 
              onClick={() => navigate('/final')}
              className="group flex flex-col items-center gap-12"
            >
               <div className="text-[11px] uppercase tracking-[1em] font-black text-white/10 group-hover:text-white transition-all">
                The Final Message
              </div>
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-2xl">
                <ChevronRight size={28} className="text-white/20 group-hover:text-white" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-[40px] p-6"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white p-5 pb-24 border-[20px] border-white shadow-[0_60px_150px_rgba(0,0,0,0.8)] rounded-sm relative overflow-hidden">
                <img src={selectedImg.url} alt={selectedImg.caption} className="w-full h-auto rounded-xs mb-10 shadow-inner" />
                <div className="text-center">
                   <div className="text-[#1a1a1a] text-3xl md:text-5xl font-display italic mb-6 leading-relaxed">
                     <TypingText text={selectedImg.caption} stagger={0.06} />
                   </div>
                   <p className="text-[#1a1a1a]/40 text-[10px] uppercase tracking-[1em] font-black">{selectedImg.date}</p>
                </div>
                {/* Subtle paper texture overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
              </div>
              <button 
                onClick={() => setSelectedImg(null)}
                className="mt-16 w-full text-white/40 hover:text-white text-[11px] uppercase tracking-[1.2em] font-black transition-all text-glow"
              >
                Return to the gallery
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default MemoryPage;
