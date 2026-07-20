"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "@/components/Terminal";
import { GuiPortfolio } from "@/components/GuiPortfolio";

export default function Home() {
  const [mode, setMode] = useState<"terminal" | "gui">("gui");

  return (
    <main className={`flex-1 h-full w-full ${mode === "terminal" ? "overflow-hidden" : ""}`}>
      <AnimatePresence mode="wait">
        {mode === "terminal" ? (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <Terminal setMode={setMode} />
          </motion.div>
        ) : (
          <motion.div
            key="gui"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <GuiPortfolio setMode={setMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
