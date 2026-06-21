import { motion } from "framer-motion";

const PROJECTS = [
  {
    id: "01",
    name: "DEVFLOW",
    subtitle: "AI-Powered GitHub PR Review Agent",
    description: "An end-to-end intelligent code review platform that automates pull request analysis and generates actionable insights.",
    features: [
      "Automated PR Reviews",
      "Structured JSON Outputs",
      "LangChain Pipelines",
      "Dockerized Deployment",
      "GitHub Integration",
      "Engineering Dashboards",
    ],
    tech: ["Python", "LangChain", "Go", "React", "Redis", "PostgreSQL", "Docker", "Gemini API"],
  },
  {
    id: "02",
    name: "SKILL EVALUATOR",
    subtitle: "AI Resume Analyzer & Career Coach",
    description: "Cross-platform Web and Android application that analyzes resumes and generates personalized career roadmaps.",
    features: [
      "Resume Analysis",
      "Skill Gap Detection",
      "Career Recommendations",
      "AI Assistant",
      "Learning Roadmaps",
    ],
    tech: ["React", "React Native", "FastAPI", "Gemini API", "PostgreSQL"],
  },
  {
    id: "03",
    name: "PRODUCTION MANAGEMENT SYSTEM",
    subtitle: "Manufacturing workflow platform",
    description: "Manufacturing workflow platform designed to streamline production processes and improve operational visibility.",
    features: [
      "Production Tracking",
      "Order Management",
      "BOM Management",
      "Reporting Dashboard",
      "Workflow Automation",
    ],
    tech: ["React", "Django", "PostgreSQL"],
  },
];

export function ProjectsOutput() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {PROJECTS.map((project, i) => (
        <motion.div 
          key={project.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="border border-terminal-surface p-4 hover:border-terminal-primary transition-colors bg-terminal-bg"
        >
          <div className="flex items-end gap-4 border-b border-terminal-surface pb-2 mb-4">
            <span className="text-2xl font-bold text-terminal-primary">PROJECT {project.id}</span>
            <span className="text-lg text-terminal-secondary">{project.name}</span>
          </div>

          <p className="text-terminal-body font-bold mb-2">{project.subtitle}</p>
          <p className="text-terminal-secondary mb-4">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Features:</span>
              <ul className="list-disc list-inside text-terminal-secondary">
                {project.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Tech Stack:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tech.map((tech, j) => (
                  <span key={j} className="px-2 py-1 bg-terminal-surface text-terminal-primary text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
