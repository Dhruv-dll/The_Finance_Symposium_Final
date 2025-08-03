import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Settings } from "lucide-react";

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

    // Initialize on first user interaction
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

  // Ambient sound management
  useEffect(() => {
    if (!isMuted && volume > 0) {
      // Create or resume ambient sound
      if (!ambientAudioRef.current) {
        ambientAudioRef.current = new Audio();
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = volume * 0.2; // Very subtle ambient

        // Create a simple ambient sound using oscillators
        if (audioContextRef.current) {
          const oscillator1 = audioContextRef.current.createOscillator();
          const oscillator2 = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();

          oscillator1.frequency.setValueAtTime(
            40,
            audioContextRef.current.currentTime,
          );
          oscillator2.frequency.setValueAtTime(
            60,
            audioContextRef.current.currentTime,
          );
          oscillator1.type = "sine";
          oscillator2.type = "sine";

          gainNode.gain.setValueAtTime(
            volume * 0.05,
            audioContextRef.current.currentTime,
          );

          oscillator1.connect(gainNode);
          oscillator2.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);

          oscillator1.start();
          oscillator2.start();

          // Stop oscillators after 30 seconds to prevent memory leak
          setTimeout(() => {
            oscillator1.stop();
            oscillator2.stop();
          }, 30000);
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
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    switch (type) {
      case "bell": {
        // Market bell chime
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          ctx.currentTime + 0.5,
        );
        oscillator.type = "sine";

        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1);
        break;
      }

      case "typing": {
        // Gentle typing sound
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(
          300 + Math.random() * 200,
          ctx.currentTime,
        );
        oscillator.type = "square";

        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      }

      case "success": {
        // Success notification - ascending notes
        const frequencies = [262, 330, 392, 523]; // C, E, G, C
        frequencies.forEach((freq, index) => {
          const oscillator = ctx.createOscillator();
          const noteGain = ctx.createGain();

          oscillator.connect(noteGain);
          noteGain.connect(gainNode);

          oscillator.frequency.setValueAtTime(
            freq,
            ctx.currentTime + index * 0.1,
          );
          oscillator.type = "sine";

          noteGain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
          noteGain.gain.linearRampToValueAtTime(
            volume * 0.4,
            ctx.currentTime + index * 0.1 + 0.02,
          );
          noteGain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + index * 0.1 + 0.3,
          );

          oscillator.start(ctx.currentTime + index * 0.1);
          oscillator.stop(ctx.currentTime + index * 0.1 + 0.3);
        });
        break;
      }

      case "notification": {
        // Subtle notification sound
        const oscillator = ctx.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          800,
          ctx.currentTime + 0.1,
        );
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      }

      case "ambient": {
        // Subtle trading floor ambience
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate subtle noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() - 0.5) * 0.1 * volume;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.loop = true;

        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

        source.start(ctx.currentTime);
        source.stop(ctx.currentTime + 10); // Play for 10 seconds
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

export default function SoundControls() {
  const { isMuted, setMuted, volume, setVolume } = useSound();
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 z-50">
      <div className="flex items-end space-x-3">
        {/* Volume Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-xl bg-finance-navy/80 rounded-xl p-4 border border-finance-gold/20 shadow-2xl"
            >
              <div className="space-y-4 w-48">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-finance-gold">
                    Sound Effects
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-finance-navy-light rounded-lg appearance-none cursor-pointer slider"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mute-toggle"
                      checked={isMuted}
                      onChange={(e) => setMuted(e.target.checked)}
                      className="rounded"
                    />
                    <label
                      htmlFor="mute-toggle"
                      className="text-sm text-muted-foreground"
                    >
                      Mute all sounds
                    </label>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Includes:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Market bell chimes</li>
                      <li>Typing animations</li>
                      <li>Success notifications</li>
                      <li>Subtle ambience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Control Button */}
        <motion.button
          onClick={() => setShowControls(!showControls)}
          className="p-2 sm:p-3 md:p-4 backdrop-blur-xl bg-finance-navy/80 rounded-full border border-finance-gold/20 shadow-2xl hover:border-finance-gold/40 transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
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
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-finance-red" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-finance-gold" />
          )}

          {/* Settings indicator */}
          {showControls && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-finance-electric rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
