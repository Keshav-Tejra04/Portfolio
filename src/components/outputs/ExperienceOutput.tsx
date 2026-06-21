import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    company: "SCRATCHBOX",
    role: "Co-Founder & Full-Stack Developer",
    date: "Aug 2025 – Present",
    highlights: [
      "Built and scaled a live coding LMS serving 2000+ active users.",
      "Architected the complete platform independently.",
      "Developed backend services using Go.",
      "Built React frontend applications.",
      "Implemented JWT authentication and RBAC.",
      "Designed analytics dashboards.",
      "Developed APIs achieving sub-150ms response times.",
    ],
    tech: ["Go", "React", "PostgreSQL", "JWT", "REST APIs"],
  },
  {
    company: "CODENCIOUS",
    role: "Software Developer Intern",
    date: "Jan 2025 – Apr 2025",
    highlights: [
      "Built Production Management System.",
      "Developed 20+ REST API endpoints.",
      "Implemented production tracking workflows.",
      "Built BOM management modules.",
      "Optimized PostgreSQL queries.",
      "Reduced report generation time by 35%.",
    ],
    tech: ["React", "Django", "PostgreSQL"],
  },
];

export function ExperienceOutput() {
  return (
    <div className="flex flex-col gap-8 border-l-2 border-terminal-surface pl-6 ml-2 relative">
      {EXPERIENCES.map((exp, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="relative"
        >
          {/* Timeline dot */}
          <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-terminal-primary rounded-full border-2 border-terminal-bg" />
          
          <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4">
            <h3 className="text-xl font-bold text-terminal-primary">{exp.company}</h3>
            <span className="text-terminal-secondary text-sm">{exp.date}</span>
          </div>
          
          <h4 className="text-lg text-terminal-body mb-4">{exp.role}</h4>
          
          <div className="mb-4">
            <span className="text-terminal-secondary block mb-2">Highlights:</span>
            <ul className="list-disc list-inside text-terminal-body space-y-1">
              {exp.highlights.map((highlight, j) => (
                <li key={j} className="text-sm">{highlight}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="text-terminal-secondary block mb-2">Tech:</span>
            <div className="flex flex-wrap gap-2">
              {exp.tech.map((tech, j) => (
                <span key={j} className="px-2 py-1 bg-terminal-surface text-terminal-primary text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
