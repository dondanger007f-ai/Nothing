/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { InteractionProvider, useInteraction } from './components/Shared';
import { Volume2, VolumeX } from 'lucide-react';
import IndexPage from './components/IndexPage';
import GiftPage from './components/GiftPage';
import MemoryPage from './components/MemoryPage';
import KavithaiPage from './components/KavithaiPage';
import FinalPage from './components/FinalPage';

import IntroPage from './components/IntroPage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="min-h-screen">
        <Routes location={location}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/kavithai" element={<KavithaiPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/final" element={<FinalPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AmbienceControl() {
  const { isMuted, toggleMute } = useInteraction();
  
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMute}
      className="fixed top-8 right-8 z-[200] glass px-6 py-3 rounded-full flex items-center gap-3 text-white/40 hover:text-white transition-all shadow-2xl group"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        {isMuted ? "Unmute" : "Mute"}
      </span>
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse text-white" />}
    </motion.button>
  );
}

export default function App() {
  return (
    <Router>
      <InteractionProvider>
        <div className="relative text-white min-h-screen selection:bg-white/20">
          <AmbienceControl />
          <AnimatedRoutes />
        </div>
      </InteractionProvider>
    </Router>
  );
}
