"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BOOT_LINES = [
  "Initializing Keshav's Profile...",
  "Loading Developer Profile...",
  "Loading Projects Database...",
  "Loading Mobile Systems...",
  "Loading AI Engineering Modules...",
  "Loading Career Timeline...",
  "Initializing Portfolio Engine...",
  "✓ Systems Online",
  "Welcome Visitor",
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, Math.random() * 200 + 100); // Random delay between 100ms and 300ms
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800); // Wait a bit before transitioning to terminal
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, onComplete]);

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-body p-4 sm:p-8 font-mono text-sm sm:text-base flex flex-col">
      {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${
            line.startsWith("✓") ? "text-terminal-primary mt-4" : "text-terminal-secondary"
          }`}
        >
          {line}
        </motion.div>
      ))}
      {visibleLines < BOOT_LINES.length && (
        <div className="mt-2 text-terminal-body animate-blink">_</div>
      )}
    </div>
  );
}
