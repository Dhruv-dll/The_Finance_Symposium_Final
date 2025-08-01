import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '../hooks/useSmoothScroll';

interface ScrollProgressIndicatorProps {
  className?: string;
}

export default function ScrollProgressIndicator({ className }: ScrollProgressIndicatorProps) {
  const scrollProgress = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    // Show indicator when user starts scrolling
    setIsVisible(scrollProgress > 5);
    
    // Calculate level based on scroll progress
    const level = Math.floor(scrollProgress);
    setCurrentLevel(level);
  }, [scrollProgress]);

  // Determine level tier and color
  const getLevelTier = (level: number) => {
    if (level >= 90) return { tier: 'LEGEND', color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-400/50' };
    if (level >= 75) return { tier: 'MASTER', color: 'from-purple-400 to-pink-500', glow: 'shadow-purple-400/50' };
    if (level >= 50) return { tier: 'EXPERT', color: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-400/50' };
    if (level >= 25) return { tier: 'SKILLED', color: 'from-green-400 to-emerald-500', glow: 'shadow-green-400/50' };
    return { tier: 'NOVICE', color: 'from-gray-400 to-gray-500', glow: 'shadow-gray-400/50' };
  };

  const levelInfo = getLevelTier(currentLevel);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-1/2 right-4 sm:right-6 md:right-8 transform -translate-y-1/2 z-40 ${className}`}
        >
          <div className="relative">
            {/* Main Level Indicator */}
            <motion.div
              className={`relative bg-finance-navy/90 backdrop-blur-xl border border-finance-gold/30 rounded-2xl p-4 shadow-2xl ${levelInfo.glow} min-w-[140px]`}
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 18, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
              }}
              animate={{
                scale: currentLevel >= 90 ? [1, 1.05, 1] : 1,
                boxShadow: currentLevel >= 90 ? [
                  `0 0 30px rgba(255, 215, 0, 0.5)`,
                  `0 0 50px rgba(255, 215, 0, 0.8)`,
                  `0 0 30px rgba(255, 215, 0, 0.5)`
                ] : `0 0 20px ${levelInfo.glow.includes('yellow') ? 'rgba(255, 215, 0, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Level Text */}
              <motion.div
                className="text-center mb-3"
                animate={{ 
                  scale: currentLevel % 10 === 0 && currentLevel > 0 ? [1, 1.2, 1] : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xs font-medium text-finance-electric mb-1">
                  {levelInfo.tier}
                </div>
                <div className="text-2xl font-bold text-finance-gold">
                  Level {currentLevel}%
                </div>
              </motion.div>

              {/* Progress Bar Container */}
              <div className="relative h-3 bg-finance-navy-light/50 rounded-full overflow-hidden border border-finance-gold/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-finance-gold/10 to-transparent animate-pulse" />
                
                {/* Progress Fill */}
                <motion.div
                  className={`h-full bg-gradient-to-r ${levelInfo.color} relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: `${scrollProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>

                {/* Level Markers */}
                <div className="absolute inset-0 flex justify-between items-center px-1">
                  {[25, 50, 75, 90].map((marker) => (
                    <div
                      key={marker}
                      className={`w-0.5 h-full ${
                        currentLevel >= marker ? 'bg-white/50' : 'bg-finance-gold/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* XP/Progress Text */}
              <div className="text-center mt-2">
                <div className="text-xs text-finance-electric">
                  {scrollProgress.toFixed(1)}% Complete
                </div>
              </div>

              {/* Achievement Burst */}
              <AnimatePresence>
                {currentLevel > 0 && currentLevel % 25 === 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-4xl">✨</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Floating Particles */}
            <motion.div
              className="absolute -top-2 -right-2 w-2 h-2 bg-finance-gold rounded-full"
              animate={{
                y: [-5, -15, -5],
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-finance-electric rounded-full"
              animate={{
                y: [5, -10, 5],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1
              }}
            />
            <motion.div
              className="absolute top-1/2 -left-3 w-1 h-1 bg-finance-gold/70 rounded-full"
              animate={{
                x: [-5, 5, -5],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
