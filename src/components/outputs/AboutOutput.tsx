import { motion } from "framer-motion";

export function AboutOutput() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 max-w-3xl"
    >
      <p>Hi, I'm <span className="text-terminal-primary">Keshav Tejra</span>.</p>
      
      <p>
        I'm a Computer Science undergraduate and Full-Stack Developer with hands-on experience building production-grade applications, mobile solutions, and AI-powered systems.
      </p>

      <p>
        Currently I am the Co-Founder and Full-Stack Developer at <span className="text-terminal-primary">Scratchbox</span>, where I independently architect and develop a live Learning Management System serving more than 2,000 active users.
      </p>

      <p>
        My expertise spans Go, Python, React, React Native, FastAPI, PostgreSQL, Generative AI pipelines, and modern software architecture.
      </p>

      <p>
        I enjoy taking products from idea to deployment and building scalable systems that solve real-world problems.
      </p>

      <div className="mt-2">
        <span className="text-terminal-secondary">Core Interests:</span>
        <ul className="list-disc list-inside text-terminal-primary mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
          <li>Full Stack Development</li>
          <li>Backend Systems</li>
          <li>Mobile Development</li>
          <li>AI Engineering</li>
          <li>Software Architecture</li>
          <li>Product Development</li>
        </ul>
      </div>
    </motion.div>
  );
}
