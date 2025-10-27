import { useState, useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

const motivationalQuotes = [
  "It's okay to take a break.",
  "Progress, not perfection.",
  "Small steps matter.",
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "Self-care isn't selfish.",
  "Your mental health matters.",
  "One breath at a time.",
  "You are enough, just as you are.",
  "Healing isn't linear.",
  "Be patient with yourself.",
  "Tomorrow is a new opportunity."
];

export function DashboardLoader({ onComplete, duration = 4500 }: DashboardLoaderProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [quoteOpacity, setQuoteOpacity] = useState(1);

  useEffect(() => {
    // Quote rotation logic - slower for comfortable reading
    const quoteInterval = setInterval(() => {
      setQuoteOpacity(0);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setQuoteOpacity(1);
      }, 400);
    }, 2000); // Allow 2 seconds per quote for comfortable reading

    // Auto-complete after duration
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-surface animate-fade-out">
        <div className="text-center space-y-8 animate-scale-out">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-wellness rounded-2xl flex items-center justify-center shadow-wellness animate-float mx-auto">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-surface">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo with Animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-wellness rounded-2xl flex items-center justify-center shadow-wellness animate-float mx-auto">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient-primary">
            ManasikSeva
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Loading your wellness dashboard...
          </p>
        </div>

        {/* Motivational Quote */}
        <div className="min-h-[80px] flex items-center justify-center">
          <p 
            className={cn(
              "text-lg font-medium text-wellness text-center max-w-md transition-opacity duration-400",
              quoteOpacity ? "opacity-100" : "opacity-0"
            )}
          >
            "{motivationalQuotes[currentQuoteIndex]}"
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 bg-gradient-wellness rounded-full animate-pulse",
                  i === 0 && "animation-delay-0",
                  i === 1 && "animation-delay-150",
                  i === 2 && "animation-delay-300"
                )}
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "1.2s"
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="h-1.5 bg-gradient-wellness rounded-full transition-all duration-100 ease-out"
              style={{
                width: '100%',
                animation: `shimmer ${duration}ms ease-in-out`
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Preparing your wellness dashboard...
          </div>
        </div>
      </div>
    </div>
  );
}