import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Rocket } from "lucide-react";

const ACHIEVEMENTS = [
  { text: "State-Level Silver Medalist in Skating", icon: Medal },
  { text: "State-Level Carrom Competitor", icon: Trophy },
  { text: "Winner of Online Chess Competition", icon: Crown },
  { text: "Co-Founder of Scratchbox", icon: Star },
  { text: "Built Production Systems During Undergraduate Studies", icon: Rocket },
];

export function AchievementsOutput() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {ACHIEVEMENTS.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-3 bg-terminal-surface/30 border border-terminal-surface hover:border-terminal-primary hover:bg-terminal-surface transition-all"
          >
            <div className="text-terminal-primary">
              <Icon size={24} />
            </div>
            <span className="text-terminal-body">{item.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
