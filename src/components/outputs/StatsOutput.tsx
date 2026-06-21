import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STATS = [
  { label: "Active Users Served", value: 2000, prefix: "", suffix: "+" },
  { label: "Production APIs Built", value: 20, prefix: "", suffix: "+" },
  { label: "Performance Optimization", value: 35, prefix: "", suffix: "%" },
  { label: "Production Systems Built", value: 3, prefix: "", suffix: "+" },
];

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s
    const increment = value / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-4xl font-bold text-terminal-primary">
      {prefix}{count}{suffix}
    </span>
  );
}

export function StatsOutput() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center justify-center p-6 border border-terminal-surface bg-terminal-bg"
          >
            <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            <span className="text-terminal-secondary mt-2 text-center">{stat.label}</span>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 text-terminal-secondary"
      >
        <span>Web</span> • <span>Backend</span> • <span>Mobile</span> • <span>AI</span>
      </motion.div>
    </div>
  );
}
