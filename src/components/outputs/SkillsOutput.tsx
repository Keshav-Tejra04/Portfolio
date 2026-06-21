import { motion } from "framer-motion";

const SKILL_CATEGORIES = [
  {
    category: "Programming Languages",
    skills: ["Python", "Go", "JavaScript", "TypeScript", "C++", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React", "React Native", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Backend",
    skills: ["Go", "Python", "FastAPI", "Django"],
  },
  {
    category: "AI Engineering",
    skills: ["Generative AI", "Prompt Engineering", "LangChain", "Gemini API", "AI Agents"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Firebase"],
  },
  {
    category: "DevOps",
    skills: ["Docker", "Docker Compose", "GitHub Actions", "CI/CD", "Git", "Linux"],
  },
];

export function SkillsOutput() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
      {SKILL_CATEGORIES.map((cat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="border border-terminal-surface p-4"
        >
          <h3 className="text-terminal-primary border-b border-terminal-surface pb-2 mb-3">
            {cat.category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill, j) => (
              <motion.span 
                key={j}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + j * 0.05 }}
                className="px-2 py-1 bg-terminal-surface/50 text-terminal-body text-sm rounded border border-terminal-surface hover:border-terminal-primary hover:text-terminal-primary transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
