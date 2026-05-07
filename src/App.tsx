/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Play, RotateCcw, Volume2, Sparkles, Mic2 } from 'lucide-react';

// list of open-ended topics as requested
const TOPICS = [
  "Airplane mode", "First impressions", "Morning routines", "Silence", "Expensive taste",
  "The group chat", "Moving cities", "Being misunderstood", "Screenshots", "Delayed replies",
  "A fresh start", "The last 10%", "Taste", "Overthinking", "Main character energy",
  "Being early", "A closed door", "The algorithm", "Private ambition", "Leaving quietly",
  "A good excuse", "The waiting room", "New money", "The outfit", "Background noise",
  "Bad timing", "A tiny habit", "The soft launch", "Being perceived", "A second chance",
  "The notes app", "A green flag", "A missed call", "Low battery", "The Sunday feeling",
  "Doing too much", "A clean break", "The elevator", "A voice note", "The window seat",
  "Plans changing", "Offline days", "Secondary characters", "The notification curve",
  "Public transportation", "Late night grocery shopping", "The unread pile", "Small talk",
  "Empty calendars", "The perfect pen", "Drafts folder", "Long-form thinking",
  "The coffee shop effect", "Analog hobbies", "Digital clutter", "The social battery",
  "High maintenance", "Low effort", "The long game", "Comfort zones", "Second guessing",
  "Early birds", "Night owls", "Home office", "Open floor plans", "Deep work",
  "Shallow focus", "The commute", "Jet lag", "Cultural shifts", "Nostalgia",
  "Future shock", "Simple pleasures", "Luxury tax", "Minimalist living", "Maximalist style",
  "Quiet luxury", "Loud budgeting", "The side hustle", "Career paths", "Hidden talents",
  "Imposter syndrome", "Stage fright", "Public speaking", "Body language", "Eye contact",
  "Active listening", "Silent treatment", "Inner monologue", "Daydreaming", "Nightmares",
  "Lucid dreams", "Memory lanes", "Childhood homes", "Family ties", "Found family",
  "Best friends", "Work friends", "Casual acquaintances", "Modern dating", "Blind dates",
  "Long distance", "Ghosting", "Breadcrumbing", "Love bombing", "Situationships",
  "Commitment issues", "Trust falls", "Betrayal", "Forgiveness", "High stakes",
  "Low risk", "Calculated moves", "Blind luck", "Hard work", "Strategic rest",
  "Burnout", "Recovery", "Self-care", "Beauty standards", "Skincare routines",
  "Fast fashion", "Thrifting", "Capsule wardrobes", "Uniform dressing", "Power suits",
  "Casual Fridays", "Remote culture", "Office politics", "Mentorship", "Networking",
  "Small wins", "Big breaks", "Turning points", "Crossroads", "Dead ends",
  "Shortcuts", "The long way", "Scenic routes", "Travel bugs", "Solo trips",
  "Group tours", "Staycations", "Tourist traps", "Local spots", "Hidden gems",
  "Street food", "Fine dining", "Meal prep", "Kitchen hacks", "Comfort foods",
  "Acquired tastes", "Guilty pleasures", "Binge watching", "Spoiler alerts", "Fan fiction",
  "Fandoms", "Niche interests", "Mainstream media", "Viral trends", "Cancel culture",
  "Echo chambers", "Critical thinking", "Media literacy", "Fake news", "Truth seeking",
  "Personal ethics", "Moral compass", "Social justice", "Climate change", "Urban planning",
  "Public space", "Community gardens", "Neighborhood watch", "Small towns", "Metropolis life",
  "Suburban dreams", "Architecture", "Interior design", "Feng shui", "Plant parents",
  "Pet peeves", "Animal instincts", "Natural selection", "Space race", "Mars colonies",
  "Artificial intelligence", "Automation", "Universal basic income", "Privacy settings", "Data breaches",
  "Cyber security", "Cryptographic souls", "Blockchain dreams", "Metaverse reality", "Virtual presence",
  "Augmented life", "Biotech futures", "Longevity", "Mortality", "The backup plan",
  "Crowd mentality", "Individualism", "Groupthink", "Role models", "Legacy"
];

export default function App() {
  const [topic, setTopic] = useState<string>("");
  const [showLayout, setShowLayout] = useState<boolean>(false);
  const [hasChosenOnce, setHasChosenOnce] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play a simple synthesized beep
  const playEndSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context not supported or interaction required", e);
    }
  }, []);

  const generateTopic = useCallback(() => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    handleReset();

    let iterations = 0;
    const isFirstTime = !hasChosenOnce;
    const maxIterations = isFirstTime ? 30 : 20; 
    
    const shuffleInterval = setInterval(() => {
      setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        
        if (isFirstTime) {
          setHasChosenOnce(true);
          // Wait a beat for the user to see the chosen topic before shifting
          setTimeout(() => {
            setShowLayout(true);
          }, 800);
        }
      }
    }, 70); 
  }, [isShuffling, hasChosenOnce]);

  const handleStart = () => {
    if (!isActive && timeLeft > 0) {
      setIsActive(true);
      setIsFinished(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(60);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      playEndSound();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, playEndSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2926] font-sans selection:bg-[#EAE1D8] selection:text-[#2D2926] flex flex-col">
      <div className={`mx-auto px-6 py-12 md:py-16 transition-all duration-700 flex-grow w-full ${showLayout ? 'max-w-7xl' : 'max-w-xl'}`}>
        
        {/* Header - Only visible when layout hasn't shifted yet */}
        {!showLayout && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center mb-16"
            id="header"
          >
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3">
              Say It Better
            </h1>
            <p className="text-[#8C8379] text-lg font-normal">
              Train your voice. Sharpen your ideas.
            </p>
          </motion.header>
        )}

        {/* Unified Layout Grid */}
        <div className={`grid gap-x-12 lg:gap-x-20 transition-all duration-1000 ${
          showLayout 
            ? 'grid-cols-1 lg:grid-cols-[180px_1fr_0.8fr] auto-rows-min gap-y-0' 
            : 'grid-cols-1 place-items-center gap-y-12'
        }`}>
          
          {/* Row 1: Legends (Only when layout is shown) */}
          {showLayout ? (
            <>
              <div className="lg:border-b border-[#EAE1D8]/50 lg:pb-4 lg:mb-12">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium tracking-tight text-[#8C8379]"
                >
                  Session Active.
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:block border-b border-[#EAE1D8]/50 pb-4 mb-12"
              >
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A6998A]">Topic</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:block border-b border-[#EAE1D8]/50 pb-4 mb-12"
              >
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A6998A]">Timer</span>
              </motion.div>
            </>
          ) : (
            <div className="hidden"></div>
          )}

          {/* Row 2: Content */}
          {showLayout && <div className="hidden lg:block"></div>}

          <div className={`w-full flex flex-col items-center ${showLayout ? 'lg:items-start' : ''}`}>
            {!showLayout ? (
              <div className="flex flex-col items-center gap-12 w-full">
                <AnimatePresence mode="popLayout">
                  {!hasChosenOnce && !isShuffling ? (
                    <motion.button
                      key="start-btn"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateTopic}
                      className="bg-[#2D2926] text-[#FDFCFB] px-10 py-5 rounded-full font-medium flex items-center gap-2 shadow-xl hover:bg-[#403B37] transition-all"
                      id="generate-btn"
                    >
                      <Sparkles className="w-5 h-5" />
                      Give me a topic
                    </motion.button>
                  ) : (
                    <motion.div
                      key="initial-shuffle"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isShuffling ? 1 : 1.2,
                        filter: isShuffling ? "blur(1px)" : "blur(0px)" 
                      }}
                      className="text-center py-12"
                    >
                      <motion.h2 
                        key={topic}
                        initial={{ opacity: 0, y: isShuffling ? 40 : 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: isShuffling ? 0.06 : 0.4 }}
                        className="text-5xl md:text-6xl lg:text-8xl font-medium tracking-tight text-[#2D2926]"
                      >
                        {topic}
                      </motion.h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="w-full">
                <div className="lg:hidden mb-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A6998A]">Topic</span>
                </div>
                
                {/* Stable Card Container */}
                <motion.div 
                  className="w-full max-w-lg aspect-[3/2] flex items-center justify-center p-8 md:p-10 rounded-[3rem] border border-[#EAE1D8] shadow-sm relative overflow-hidden"
                  id="topic-card"
                  animate={{ 
                    backgroundColor: isFinished ? "#F8F5F2" : "#FFFFFF",
                  }}
                >
                  {/* Internal Shuffling Text */}
                  <div className="relative w-full flex items-center justify-center overflow-hidden h-full">
                    <AnimatePresence mode={isShuffling ? "popLayout" : "wait"}>
                      <motion.p
                        key={topic}
                        initial={{ 
                          opacity: 0, 
                          y: isShuffling ? 60 : 20, 
                          scale: isShuffling ? 0.95 : 1 
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          filter: isShuffling ? "blur(1px)" : "blur(0px)",
                          color: isFinished ? "#8C8379" : "#2D2926"
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: isShuffling ? -60 : 20, 
                          scale: isShuffling ? 0.95 : 1 
                        }}
                        transition={{ 
                          duration: isShuffling ? 0.04 : 0.4, 
                          type: "spring", 
                          stiffness: isShuffling ? 300 : 100,
                          damping: isShuffling ? 15 : 20
                        }}
                        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center leading-tight px-6 absolute"
                      >
                        {topic}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Shuffle Button (Fixed in Card) */}
                  <motion.button
                    whileHover={{ scale: isShuffling ? 1 : 1.1, rotate: isShuffling ? 0 : 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={generateTopic}
                    disabled={isShuffling}
                    className={`absolute bottom-8 right-8 p-3 rounded-full text-[#A6998A] transition-all z-10 ${
                      isShuffling ? "animate-spin cursor-wait opacity-50" : "hover:text-[#2D2926]"
                    }`}
                    title="New topic"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showLayout && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="w-full flex flex-col items-center lg:items-start" 
                id="timer-section"
              >
                <div className="lg:hidden w-full mb-4 mt-12">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A6998A]">Timer</span>
                </div>

                <div className="w-full flex flex-col items-center lg:items-start gap-12 lg:mt-6">
                  <div className="relative flex flex-col items-center lg:items-start">
                    <motion.div 
                      className="text-[5rem] md:text-8xl lg:text-[10rem] font-mono text-[#2D2926] tracking-tighter leading-none"
                      animate={isFinished ? { 
                        scale: [1, 1.02, 1],
                        color: ["#2D2926", "#8C8379", "#2D2926"]
                      } : {}}
                      transition={{ duration: 0.5 }}
                      id="timer-display"
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                    
                    {isFinished && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-medium text-[#8C8379] mt-6"
                      >
                        Time's up.
                      </motion.p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center lg:justify-start">
                    {!isActive && !isFinished ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStart}
                        className="bg-[#F8F5F2] border border-[#EAE1D8] text-[#2D2926] px-8 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#EAE1D8] transition-all shadow-sm w-full sm:w-auto"
                        id="start-timer-btn"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Start 1-minute timer
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="bg-transparent border border-[#EAE1D8] text-[#8C8379] px-8 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#F8F5F2] transition-all w-full sm:w-auto"
                        id="reset-timer-btn"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset timer
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer info */}
      <footer className="pb-12 text-center" id="footer">
        <div className="flex items-center justify-center gap-2 text-[#A6998A]">
          <Mic2 className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.2em]">Speak with intent</span>
        </div>
      </footer>
    </div>
  );
}
