import { motion } from "framer-motion";

export function MobileOutput() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl border border-terminal-surface p-6"
    >
      <h3 className="text-xl text-terminal-primary mb-4 pb-2 border-b border-terminal-surface">
        Cross-Platform Mobile Development
      </h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-terminal-secondary block mb-1">Framework:</span>
          <span className="text-terminal-body font-bold">React Native</span>
        </div>
        
        <div>
          <span className="text-terminal-secondary block mb-1">Platforms:</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Android</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> iOS</span>
          </div>
        </div>

        <div>
          <span className="text-terminal-secondary block mb-1">Experience:</span>
          <p className="text-terminal-body">
            Building performant mobile applications with shared codebases and native user experiences.
          </p>
        </div>

        <div>
          <span className="text-terminal-secondary block mb-2">Skills:</span>
          <ul className="grid grid-cols-2 gap-2 list-none">
            {["Mobile Navigation", "State Management", "Authentication", "API Integration", "Responsive UI", "Cross Platform Architecture"].map((skill, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-terminal-primary">▹</span> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
