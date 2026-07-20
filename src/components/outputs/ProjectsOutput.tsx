import { motion } from "framer-motion";

const PROJECTS = [
  {
    id: "01",
    name: "DEVFLOW",
    subtitle: "AI-Powered GitHub PR Review Agent",
    description: "An end-to-end intelligent code review platform that automates pull request analysis and generates actionable insights.",
    features: [
      "Built an end-to-end LLM-powered PR review pipeline using Python and Gemini API with structured JSON outputs, issue extraction, and automated fix suggestions from raw GitHub diffs.",
      "Engineered preprocessing and batch-analysis workflows using LangChain to detect recurring code patterns, prioritize files, and generate dashboard-based PR insights.",
      "Containerized the system with Docker Compose and implemented secure HMAC-SHA256 webhook verification with automated CI/CD pipelines using GitHub Actions."
    ],
    tech: ["Python", "LangChain", "Go", "TypeScript", "React", "Redis", "PostgreSQL", "Docker", "Gemini API"],
  },
  {
    id: "02",
    name: "IR-1 CENTRIFUGE SIMULATION",
    subtitle: "Stuxnet Demo & Physics Engine",
    description: "An interactive, high-fidelity simulation of an IR-1 gas centrifuge cascade designed to demonstrate the mechanics of physical-cyber attacks.",
    features: [
      "Decoupled 3-Tier Architecture",
      "Discrete-Tick Physics Engine",
      "Stateless PLC Middleware Relay",
      "3D Cascade View (Three.js/ECS)",
      "HMI Dashboard with Telemetry",
      "Stuxnet-style MITM Vulnerability"
    ],
    tech: ["Rust", "Python", "React", "Three.js", "WebSocket", "JSONL"],
  },
  {
    id: "03",
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
    id: "04",
    name: "KESHAV OS PORTFOLIO",
    subtitle: "Dual-Interface Web Portfolio",
    description: "An interactive developer portfolio featuring a fully functional Linux-style terminal and a modern Cyberpunk GUI.",
    features: [
      "Terminal Interface Engine",
      "Mock Filesystem",
      "Command Parsing",
      "Modern GUI Mode",
      "Framer Motion Transitions",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
];

export function ProjectsOutput({ projectId }: { projectId?: string }) {
  const projectsToRender = projectId
    ? PROJECTS.filter(p => p.id === projectId || p.name.toLowerCase().replace(" ", "_") === projectId.toLowerCase())
    : PROJECTS;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {projectsToRender.map((project, i) => (
        <motion.div 
          key={project.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="border border-terminal-surface p-4 hover:border-terminal-primary transition-colors bg-terminal-bg"
        >
          <div className="flex items-end gap-4 border-b border-terminal-surface pb-2 mb-4">
            {!projectId && (
              <span className="text-2xl font-bold text-terminal-primary">PROJECT {project.id}</span>
            )}
            <span className={projectId ? "text-2xl font-bold text-terminal-primary" : "text-lg text-terminal-secondary"}>
              {project.name}
            </span>
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
