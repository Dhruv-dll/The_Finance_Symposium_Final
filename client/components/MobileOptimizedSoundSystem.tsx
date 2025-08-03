import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { useMobile } from "../hooks/useMobile";

interface SoundContextType {
  playSound: (
    type: "bell" | "typing" | "success" | "notification" | "ambient",
  ) => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [isMuted, setMuted] = useState(() => {
    const saved = localStorage.getItem("tfs-sound-muted");
    return saved ? JSON.parse(saved) : false;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("tfs-sound-volume");
    return saved ? parseFloat(saved) : 0.3;
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem("tfs-sound-muted", JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem("tfs-sound-volume", volume.toString());
  }, [volume]);

  // Initialize audio context
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // Simplified ambient sound for mobile performance
  useEffect(() => {
    if (!isMuted && volume > 0) {
      if (!ambientAudioRef.current) {
        ambientAudioRef.current = new Audio();
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = volume * 0.1; // Even more subtle on mobile

        // Simplified oscillator for mobile
        if (audioContextRef.current) {
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();

          oscillator.frequency.setValueAtTime(
            40,
            audioContextRef.current.currentTime,
          );
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(
            volume * 0.02, // Very low for mobile
            audioContextRef.current.currentTime,
          );

          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);

          oscillator.start();

          // Stop after 15 seconds on mobile to save battery
          setTimeout(() => {
            oscillator.stop();
          }, 15000);
        }
      }
    } else if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
  }, [isMuted, volume]);

  const playSound = (
    type: "bell" | "typing" | "success" | "notification" | "ambient",
  ) => {
    if (isMuted || volume === 0 || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(volume * 0.7, ctx.currentTime); // Slightly reduced for mobile

    // Simplified sound generation for mobile performance
    switch (type) {
      case "bell": {
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          ctx.currentTime + 0.3, // Shorter duration
        );
        oscillator.type = "sine";

        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      }

      case "typing": {
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(
          300 + Math.random() * 100, // Reduced randomness
          ctx.currentTime,
        );
        oscillator.type = "square";

        gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.05,
        );

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      }

      case "success": {
        // Simplified success sound
        const frequencies = [262, 330, 392]; // Reduced notes
        frequencies.forEach((freq, index) => {
          const oscillator = ctx.createOscillator();
          const noteGain = ctx.createGain();

          oscillator.connect(noteGain);
          noteGain.connect(gainNode);

          oscillator.frequency.setValueAtTime(
            freq,
            ctx.currentTime + index * 0.08,
          );
          oscillator.type = "sine";

          noteGain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
          noteGain.gain.linearRampToValueAtTime(
            volume * 0.3,
            ctx.currentTime + index * 0.08 + 0.02,
          );
          noteGain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + index * 0.08 + 0.2,
          );

          oscillator.start(ctx.currentTime + index * 0.08);
          oscillator.stop(ctx.currentTime + index * 0.08 + 0.2);
        });
        break;
      }

      case "notification": {
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          700,
          ctx.currentTime + 0.1,
        );
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      }

      case "ambient": {
        // Skip ambient generation on mobile for performance
        break;
      }
    }
  };

  return (
    <SoundContext.Provider
      value={{ playSound, isMuted, setMuted, volume, setVolume }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export default function MobileOptimizedSoundControls() {
  const { isMuted, setMuted, volume, setVolume } = useSound();
  const [showControls, setShowControls] = useState(false);
  const isMobile = useMobile();

  return (
    <div
      className={`fixed z-50 ${
        isMobile
          ? "bottom-2 left-2" // Mobile positioning
          : "bottom-6 left-6" // Desktop positioning
      }`}
    >
      <div className="flex items-end space-x-2 sm:space-x-3">
        {/* Volume Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`backdrop-blur-xl bg-finance-navy/80 rounded-xl border border-finance-gold/20 shadow-2xl ${
                isMobile ? "p-3 w-56" : "p-4 w-48"
              }`}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium text-finance-gold ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    Sound Effects
                  </span>
                  <span
                    className={`text-muted-foreground ${
                      isMobile ? "text-xs" : "text-xs"
                    }`}
                  >
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className={`w-full bg-finance-navy-light rounded-lg appearance-none cursor-pointer slider ${
                      isMobile ? "h-1.5" : "h-2"
                    }`}
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mute-toggle"
                      checked={isMuted}
                      onChange={(e) => setMuted(e.target.checked)}
                      className={`rounded ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                    />
                    <label
                      htmlFor="mute-toggle"
                      className={`text-muted-foreground ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      Mute all sounds
                    </label>
                  </div>

                  {!isMobile && (
                    <div className="text-xs text-muted-foreground">
                      <p>Includes:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Market bell chimes</li>
                        <li>Typing animations</li>
                        <li>Success notifications</li>
                        <li>Subtle ambience</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Control Button - Mobile Optimized */}
        <motion.button
          onClick={() => setShowControls(!showControls)}
          className={`backdrop-blur-xl bg-finance-navy/80 rounded-full border border-finance-gold/20 shadow-2xl hover:border-finance-gold/40 transition-all duration-300 group ${
            isMobile
              ? "p-3 min-w-[48px] min-h-[48px]" // Mobile touch target
              : "p-4"
          }`}
          whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,215,0,0.2)",
              "0 0 30px rgba(255,215,0,0.4)",
              "0 0 20px rgba(255,215,0,0.2)",
            ],
          }}
          transition={{
            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          // Mobile haptic feedback
          onTouchStart={() => {
            if (isMobile && navigator.vibrate) {
              navigator.vibrate(50);
            }
          }}
        >
          {isMuted ? (
            <VolumeX
              className={`text-finance-red ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
            />
          ) : (
            <Volume2
              className={`text-finance-gold ${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              }`}
            />
          )}

          {/* Settings indicator - adjusted for mobile */}
          {showControls && (
            <motion.div
              className={`absolute bg-finance-electric rounded-full ${
                isMobile
                  ? "-top-0.5 -right-0.5 w-2.5 h-2.5"
                  : "-top-1 -right-1 w-3 h-3"
              }`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
