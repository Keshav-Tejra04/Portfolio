"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Terminal, Mail, ExternalLink,
  Copy, Check, Phone, ArrowRight, Menu, X, Code, Server, Database, Brain, Cpu, BookOpen
} from "lucide-react";

// Inline Custom SVG Components to bypass lucide-react version exports
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

// Types
interface GuiPortfolioProps {
  setMode: (m: "terminal" | "gui") => void;
}

interface Project {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  highlights: string[];
  tech: string[];
  code: string;
  liveUrl?: string;
  repoUrl?: string;
  date: string;
}

interface Skill {
  name: string;
  pct: number;
  category: "Languages" | "Backend" | "Frontend" | "Databases" | "AI/LLM" | "DevOps";
}

// Data Sets
const PROJECTS: Project[] = [
  {
    id: "01",
    name: "DEVFLOW",
    subtitle: "AI GitHub PR Agent",
    date: "Mar 2026",
    desc: "An intelligent pull request review agent that compiles and reviews codebase changes, generating detailed JSON audit reports to reduce review hours.",
    highlights: [
      "LLM-powered review pipeline using Python and Gemini API.",
      "Structured JSON audit responses highlighting code smell & fixes.",
      "Automated CI/CD workflows triggered by GitHub Action webhooks."
    ],
    tech: ["Python", "LangChain", "Go", "React", "Docker", "Gemini API"],
    code: `{\n  "name": "DevFlow",\n  "engine": "Gemini-1.5-Pro",\n  "reviews_completed": 412,\n  "github_integration": "Active"\n}`,
    repoUrl: "https://github.com/Keshav-Tejra04"
  },
  {
    id: "02",
    name: "IR-1 CENTRIFUGE SIMULATION",
    subtitle: "Stuxnet Demo",
    date: "Jul 2026",
    desc: "An interactive, high-fidelity simulation of an IR-1 gas centrifuge cascade demonstrating the mechanics of physical-cyber attacks.",
    highlights: [
      "Decoupled 3-tier architecture isolating physics engine from UI.",
      "Discrete-tick physics backend for real-time separation calculations.",
      "Stateless PLC middleware relay simulating network hubs and MITM attacks.",
      "3D ECS visualization of centrifuge physical telemetry."
    ],
    tech: ["Rust", "Python", "React", "Three.js", "WebSocket"],
    code: `{\n  "name": "IR-1 Centrifuge Sim",\n  "architecture": "Decoupled 3-Tier (Physics | Relay | HMI)",\n  "status": "COMPROMISED (MITM Attack Active)",\n  "vulnerability": "Stateless PLC Relay Interception"\n}`,
    repoUrl: "https://github.com/Keshav-Tejra04"
  },
  {
    id: "03",
    name: "SKILL EVALUATOR",
    subtitle: "AI Career Matchmaker",
    date: "Dec 2025",
    desc: "A cross-platform software parser running resumes against market requirements to map skill gaps and auto-generate training roadmaps.",
    highlights: [
      "Cross-platform parser (Web & Android) built with React Native.",
      "FastAPI backend parsing PDFs to generate structured vector index.",
      "Context-aware AI chatbot suggesting personalized learning steps."
    ],
    tech: ["React Native", "FastAPI", "Gemini API", "PostgreSQL", "Tailwind"],
    code: `{\n  "name": "Skill Evaluator",\n  "type": "Career Engine",\n  "ai_model": "Gemini-Flash",\n  "database": "Postgres"\n}`,
    liveUrl: "https://github.com/Keshav-Tejra04"
  },
  {
    id: "04",
    name: "KESHAV OS PORTFOLIO",
    subtitle: "Dual-Interface Web Portfolio",
    date: "Jun 2026",
    desc: "An interactive dual-interface portfolio system. Features a fully functional Linux-style terminal and a modern Cyberpunk GUI, with a custom syntax-highlighted filesystem.",
    highlights: [
      "Dual-interface Next.js app with Framer Motion page transitions.",
      "Custom Terminal engine parsing 10+ mock commands.",
      "State-driven GUI built with modern React hooks."
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    code: `{\n  "name": "Keshav OS",\n  "mode": "Dual (Terminal/GUI)",\n  "framework": "Next.js",\n  "status": "Deployed"\n}`,
    repoUrl: "https://github.com/Keshav-Tejra04",
    liveUrl: "https://keshav-tejra.vercel.app"
  }
];

const SKILLS_DATA: Skill[] = [
  // Languages
  { name: "Go / Gin / Microservices", pct: 90, category: "Backend" },
  { name: "Python / FastAPI / Django", pct: 85, category: "Backend" },
  { name: "TypeScript / JavaScript", pct: 88, category: "Languages" },
  { name: "SQL & Relational Algebra", pct: 80, category: "Languages" },
  { name: "C++ Programming", pct: 75, category: "Languages" },
  { name: "Bash & Shell Scripting", pct: 80, category: "Languages" },

  // Backend
  { name: "REST APIs / gRPC / WebSockets", pct: 92, category: "Backend" },
  { name: "JWT Auth & RBAC Systems", pct: 88, category: "Backend" },

  // Frontend
  { name: "React / React Native", pct: 90, category: "Frontend" },
  { name: "Next.js Framework", pct: 85, category: "Frontend" },
  { name: "Tailwind CSS & Styling", pct: 88, category: "Frontend" },
  { name: "Framer Motion Animations", pct: 82, category: "Frontend" },

  // Databases
  { name: "PostgreSQL Tuning", pct: 80, category: "Databases" },
  { name: "Redis Caching", pct: 78, category: "Databases" },
  { name: "MongoDB / Document DB", pct: 72, category: "Databases" },

  // AI/LLM
  { name: "LangChain Agent Architecture", pct: 85, category: "AI/LLM" },
  { name: "Gemini / OpenAI API Integration", pct: 92, category: "AI/LLM" },
  { name: "Vector Databases & Embeddings", pct: 80, category: "AI/LLM" },
  { name: "Prompt Engineering", pct: 88, category: "AI/LLM" },

  // DevOps
  { name: "Docker & Docker Compose", pct: 80, category: "DevOps" },
  { name: "GitHub Actions CI/CD", pct: 78, category: "DevOps" },
  { name: "Linux Administration", pct: 75, category: "DevOps" }
];

export function GuiPortfolio({ setMode }: GuiPortfolioProps) {
  // Navigation & Scroll states
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Interactive Skills filter state
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("All");

  // Ref for the main scrollable container of the GUI portfolio page
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll for the main page progress bar
  const { scrollYProgress: mainScrollYProgress } = useScroll({
    container: scrollContainerRef
  });

  // Ref for projects horizontal slider scroll
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: projectsScrollY } = useScroll({
    target: projectsScrollRef,
    container: scrollContainerRef
  });
  const projectsX = useTransform(projectsScrollY, [0, 1], ["0%", "-45%"]);

  // Typewriter effect for Hero
  const roles = ["Co-Founder", "Full-Stack Developer", "Gen AI Engineer", "System Architect"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll update for active section detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "skills", "education", "contact"];
      const scrollPos = container.scrollTop + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - container.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) return;

    setSubmitStatus("sending");
    setFormSent(true);

    const formUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;
    const emailEntry = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL;
    const subjectEntry = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_SUBJECT;
    const messageEntry = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE;

    if (formUrl && emailEntry && subjectEntry && messageEntry) {
      const bodyParams = new URLSearchParams();
      bodyParams.append(emailEntry, email);
      bodyParams.append(subjectEntry, subject);
      bodyParams.append(messageEntry, message);

      fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      })
        .then(() => {
          setSubmitStatus("success");
          setEmail("");
          setSubject("");
          setMessage("");
          setTimeout(() => {
            setSubmitStatus("idle");
            setFormSent(false);
          }, 3000);
        })
        .catch(() => {
          setSubmitStatus("error");
          setTimeout(() => {
            setSubmitStatus("idle");
            setFormSent(false);
          }, 3000);
        });
    } else {
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus("idle");
        setFormSent(false);
      }, 3000);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("cto@scratchbox.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Skill category filter list
  const skillCategories = ["All", "Languages", "Backend", "Frontend", "Databases", "AI/LLM", "DevOps"];

  const filteredSkills = selectedSkillCategory === "All"
    ? SKILLS_DATA
    : SKILLS_DATA.filter(skill => skill.category === selectedSkillCategory);

  return (
    <div
      ref={scrollContainerRef}
      className="gui-selection h-full w-full bg-[#07070A] text-gray-200 font-mono relative overflow-y-auto overflow-x-hidden scroll-smooth"
    >

      {/* Design Assets - Background Mesh Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,85,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,85,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gui-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[120vh] left-10 w-[400px] h-[400px] bg-gui-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-24 right-10 w-[450px] h-[450px] bg-gui-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* STICKY HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full border-b border-gui-border/30 bg-[#07070A]/85 backdrop-blur-md px-6 sm:px-12 py-4 flex justify-between items-center transition-all relative"
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gui-primary origin-left"
          style={{ scaleX: mainScrollYProgress }}
        />
        <div className="flex items-center gap-6">
          <span className="text-white font-bold text-xl tracking-wider cursor-pointer" onClick={() => scrollToSection("about")}>
            KT<span className="text-gui-primary">.</span>
          </span>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {["about", "experience", "projects", "skills", "education", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`hover:text-gui-primary transition-all cursor-pointer ${activeSection === section ? "text-gui-primary font-bold border-b border-gui-primary pb-0.5" : ""
                  }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <button
            onClick={() => setMode("terminal")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gui-border-hover/40 bg-gui-primary/5 text-gui-primary hover:bg-gui-primary hover:text-white hover:border-transparent font-bold text-xs tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(255,0,85,0.1)]"
          >
            <Terminal size={14} />
            <span>&gt;_ terminal</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 md:hidden border border-gui-border/40 rounded text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] bg-[#07070A] border-b border-gui-border/40 z-40 p-6 flex flex-col gap-4 text-sm font-bold uppercase md:hidden"
          >
            {["about", "experience", "projects", "skills", "education", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-left py-2 hover:text-gui-primary transition-all border-b border-gui-border/10 ${activeSection === section ? "text-gui-primary" : "text-gray-400"
                  }`}
              >
                {section}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col gap-28">

        {/* HERO SECTION (Image 1 styled) */}
        <motion.section
          id="hero"
          className="min-h-[80vh] flex flex-col justify-center relative pt-8 pb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-4 max-w-3xl">
            {/* Terminal Command Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gui-secondary">
              <span className="text-gui-primary">guest@portfolio:~</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-200">whoami</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mt-4">
              KESHAV TEJRA
            </h1>

            {/* Co-Founder Bullet pill */}
            <div className="flex items-center gap-2 text-gui-primary font-bold text-base sm:text-lg mt-2 h-8">
              <span className="text-sm">►</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="tracking-wider uppercase inline-block"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Subtitle Bio */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mt-4 font-mono">
              CS undergrad shipping production systems — from database schema to deployed frontend. Currently scaling <a href="https://scratchbox.com" target="_blank" rel="noopener noreferrer" className="text-gui-primary hover:underline decoration-1">Scratchbox</a> to 2,000+ developers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-6 py-3 rounded bg-gui-primary text-white font-bold hover:bg-gui-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,85,0.25)] flex items-center gap-2 text-sm uppercase"
              >
                <span>View Work</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 py-3 rounded border border-gui-border-hover/60 text-white font-bold hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer text-sm uppercase"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </motion.section>

        {/* ABOUT SECTION (The "profile thing" visible when scrolled below hero) */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8">
          {/* Left: Bio Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs text-gui-secondary">
              <span className="text-gui-primary">~/about</span>
              <span>$</span>
              <span className="text-gray-300">cat profile.md</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-snug">
              Building things that <span className="text-gui-primary drop-shadow-[0_0_8px_rgba(255,0,85,0.3)]">ship</span>.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              I'm a CS undergrad and full-stack developer who'd rather ship a working product than polish a deck about one. Most of my time lives across React and Go, with a growing focus on Gen AI pipelines and LLM prompt engineering — wiring language models into real backend systems instead of demos.
            </p>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              I co-founded <a href="https://scratchbox.com" target="_blank" rel="noopener noreferrer" className="text-gui-primary underline hover:text-gui-secondary decoration-gui-primary/50 transition-colors">Scratchbox</a>, a coding-practice platform now serving 2,000+ developers, where I own everything from the database schema to the pixels on screen.
            </p>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Currently: Scaling <span className="text-white">Scratchbox</span> to its full potential, ignoring my screen time alerts, and wondering how the build compiled on the first try ;)
            </p>
          </div>

          {/* Right: profile.json Mock Editor */}
          <div className="lg:col-span-5 border border-gui-border/40 bg-[#0E1117]/90 rounded-lg overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gui-primary/40 to-transparent" />

            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22]/70 border-b border-gui-border/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">profile.json</span>
              <div className="w-8" />
            </div>

            {/* Editor Content */}
            <pre className="p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto text-gray-300">
              <code>
                {`{\n`}
                {`  `}<span className="text-gui-secondary">"name"</span>{`: `}<span className="text-[#00FF88]">"Keshav Tejra"</span>{`,\n`}
                {`  `}<span className="text-gui-secondary">"role"</span>{`: `}<span className="text-[#00FF88]">"Full-Stack Dev"</span>{`,\n`}
                {`  `}<span className="text-gui-secondary">"stack"</span>{`: {\n`}
                {`    `}<span className="text-gui-secondary">"backend"</span>{`: [\n`}
                {`      `}<span className="text-[#00FF88]">"Gin"</span>{`,\n`}
                {`      `}<span className="text-[#00FF88]">"FastAPI"</span>{`\n`}
                {`    ],\n`}
                {`    `}<span className="text-gui-secondary">"frontend"</span>{`: [\n`}
                {`      `}<span className="text-[#00FF88]">"React + Native"</span>{`,\n`}
                {`      `}<span className="text-[#00FF88]">"Next.js"</span>{`\n`}
                {`    ]\n`}
                {`  },\n`}
                {`  `}<span className="text-gui-secondary">"focus"</span>{`: `}<span className="text-[#00FF88]">"Learning and Building"</span>{`,\n`}

                {`  `}<span className="text-gui-secondary">"based_in"</span>{`: `}<span className="text-[#00FF88]">"Indore, IN"</span>{`,\n`}
                {`  `}<span className="text-gui-secondary">"status"</span>{`: `}<span className="text-[#00FF88]">"overclocked"</span>{`,\n`}
                {`  `}<span className="text-gui-secondary">"todo_list"</span>{`: `}<span className="text-[#00FF88]">"we_dont_talk_about_it"</span>{`\n`}
                {`}`}
              </code>
            </pre>
          </div>
        </section>

        {/* WORK EXPERIENCE SECTION (Clean Timeline Theme) */}
        <section id="experience" className="flex flex-col gap-10">
          <div className="flex items-center gap-2 text-xs text-gui-secondary">
            <span className="text-gui-primary">~/experience</span>
            <span>$</span>
            <span className="text-gray-300">cat timeline.log</span>
          </div>

          <div className="relative border-l-2 border-gui-primary/30 pl-8 ml-4 flex flex-col gap-12 text-sm leading-relaxed">
            {/* Experience Entry 1 */}
            <div className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-4 border-[#07070A] bg-gui-primary group-hover:shadow-[0_0_15px_rgba(255,0,85,0.6)] transition-shadow" />

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white">Co-Founder / Full-Stack Developer   -</h3>
                  <span className="text-gui-primary font-bold text-2xl">Scratchbox</span>
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aug 2025 – Present | Indore</div>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mt-3 text-sm sm:text-base">
                  <li>Built and scaled a coding-practice LMS in <strong className="text-gray-200">Go</strong> and <strong className="text-gray-200">React</strong> serving <strong className="text-gray-200">2000+ active users</strong> in production, with role-based access control securing all API routes and UI views via <strong className="text-gray-200">JWT auth</strong>.</li>
                  <li>Designed <strong className="text-gray-200">RESTful APIs</strong> achieving <strong className="text-gray-200">&lt;150ms average response time</strong> and developed analytics dashboards visualizing performance across <strong className="text-gray-200">5+ metrics</strong>.</li>
                  <li>Architected the full product independently — from <strong className="text-gray-200">database schema</strong> to <strong className="text-gray-200">frontend</strong> — gaining end-to-end ownership of a production system.</li>
                </ul>
              </div>
            </div>

            {/* Experience Entry 2 */}
            <div className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-4 border-[#07070A] bg-gui-primary/50 group-hover:bg-gui-primary group-hover:shadow-[0_0_15px_rgba(255,0,85,0.6)] transition-all" />

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white">Software Developer Intern -</h3>
                  <span className="text-gui-primary font-bold text-2xl">Codencious</span>
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Jan 2025 – Apr 2025 | Indore</div>
                <ul className="list-disc list-inside text-gray-400 space-y-2 mt-3 text-sm sm:text-base">
                  <li>Built a <strong className="text-gray-200">Production Management System</strong> using <strong className="text-gray-200">React, Django, and PostgreSQL</strong>, digitizing workflows across <strong className="text-gray-200">3+ production lines</strong> with <strong className="text-gray-200">20+ RESTful API endpoints</strong>.</li>
                  <li>Designed and optimized backend workflows including <strong className="text-gray-200">production tracking, BOM handling, order management, and reporting modules</strong> for streamlined manufacturing operations.</li>
                  <li>Improved performance of complex <strong className="text-gray-200">PostgreSQL queries</strong> through indexing and query restructuring, reducing report generation time by <strong className="text-gray-200">~35%</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION (Image 2 style: Scrollable & Big) */}
        <section id="projects" className="relative flex flex-col gap-8">
          <div className="flex items-center gap-2 text-xs text-gui-secondary">
            <span className="text-gui-primary">~/projects</span>
            <span>$</span>
            <span className="text-gray-300">ls -la --group-directories-first</span>
          </div>

          {/* Sticky container for horizontal scroll */}
          <div ref={projectsScrollRef} className="h-[300vh] w-full relative">
            <div className="sticky top-[100px] flex flex-col gap-10 overflow-hidden pt-4 pb-20">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Things I've built<span className="text-gui-primary">.</span>
                </h2>
                <div className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block animate-pulse">
                  Scroll down to explore &darr;
                </div>
              </div>
              <motion.div
                className="flex gap-10 pb-6 w-max"
                style={{ x: projectsX }}
              >
                {PROJECTS.map((project, i) => (
                  <div
                    key={project.id}
                    className="w-[320px] sm:w-[500px] shrink-0 border border-gui-border/30 hover:border-gui-primary/60 bg-[#0E1117]/95 p-8 rounded-lg flex flex-col gap-5 shadow-2xl relative group"
                  >
                    {/* Glowing border highlight */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gui-primary/0 via-gui-primary/5 to-gui-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Card Header: Project No. & Date */}
                    <div className="flex justify-between items-center text-gray-500 text-xs sm:text-sm">
                      <span className="font-bold text-gui-secondary">0{i + 1}</span>
                      <span>{project.date}</span>
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase group-hover:text-gui-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gui-primary font-bold mt-1 uppercase tracking-wider">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Long description */}
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed flex-grow">
                      {project.desc}
                    </p>

                    {/* Key Bullet Highlights */}
                    <ul className="list-none text-xs sm:text-sm text-gray-400 space-y-2 border-l-2 border-gui-border/40 pl-4">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="relative before:content-['›'] before:absolute before:-left-4 before:text-gui-primary before:font-bold">
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* JSON Miniature Syntax Preview */}
                    <pre className="p-4 bg-[#07070A] rounded border border-gui-border/20 text-xs overflow-x-auto font-mono">
                      <code>
                        {project.code.split("\n").map((line, idx) => {
                          const match = line.match(/^(\s*)("(?:[^"\\]|\\.)*")(\s*:\s*)(.*)$/);
                          if (match) {
                            const [, indent, key, colon, value] = match;
                            return (
                              <div key={idx}>
                                <span>{indent}</span>
                                <span className="text-gui-secondary">{key}</span>
                                <span className="text-gray-400">{colon}</span>
                                <span className="text-[#00FF88]">{value}</span>
                              </div>
                            );
                          }
                          return <div key={idx} className="text-gray-400">{line}</div>;
                        })}
                      </code>
                    </pre>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tech.map((t, j) => (
                        <span
                          key={j}
                          className="text-[10px] sm:text-xs px-2.5 py-1 border border-gui-border/30 bg-gui-bg/50 text-gray-300 rounded font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex gap-6 mt-4 text-sm border-t border-gui-border/20 pt-5 font-mono">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gui-secondary hover:text-gui-primary transition-colors flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
                        >
                          <span>View Repo</span>
                          <ArrowRight size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-gui-primary transition-colors flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
                        >
                          <span>View Live</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* END CARD: More on GitHub */}
                <div className="w-[300px] sm:w-[400px] shrink-0 border border-dashed border-gui-border-hover/60 bg-[#0E1117]/50 p-10 rounded-lg flex flex-col justify-center items-center text-center gap-6 relative group">
                  <div className="w-16 h-16 rounded-full border border-gui-border/60 bg-gui-primary/5 flex items-center justify-center text-gui-primary group-hover:bg-gui-primary group-hover:text-white transition-colors duration-300 p-2">
                    <GithubIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase font-mono">More on GitHub</h3>
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed font-mono">
                      That's the highlight reel — there are more repositories and automation tools on my profile.
                    </p>
                  </div>
                  <a
                    href="https://github.com/Keshav-Tejra04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-6 py-3 border-2 border-gui-primary text-gui-primary hover:bg-gui-primary hover:text-[#07070A] rounded font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,0,85,0.2)] font-mono"
                  >
                    github.com/Keshav-Tejra04
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SKILLS SECTION (Redesigned & Animated Console) */}
        <section id="skills" className="flex flex-col gap-8">
          <div className="flex items-center gap-2 text-xs text-gui-secondary">
            <span className="text-gui-primary">~/skills</span>
            <span>$</span>
            <span className="text-gray-300">htop --view=skills</span>
          </div>

          <div className="border border-gui-border/30 bg-[#0E1117]/85 rounded-lg overflow-hidden flex flex-col shadow-2xl relative">
            {/* Header top bar */}
            <div className="px-5 py-4 bg-[#161B22]/70 border-b border-gui-border/20 flex flex-wrap justify-between items-center text-xs text-gray-400 gap-2">
              <span className="font-bold tracking-widest text-gui-primary uppercase font-mono">Skills Resource Dashboard</span>
              <span className="font-mono text-[10px]">Load Average: 0.95 // Active: {filteredSkills.length} cores</span>
            </div>

            {/* Interactivity Categories Tabs */}
            <div className="bg-[#10131B] border-b border-gui-border/10 p-2 flex flex-wrap gap-1.5">
              {skillCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedSkillCategory(category)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer font-mono ${selectedSkillCategory === category
                    ? "bg-gui-primary text-white shadow-[0_0_10px_rgba(255,0,85,0.3)]"
                    : "bg-[#181D26] text-gray-400 hover:bg-[#202733] hover:text-white"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Interactive Grid Console list */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 text-sm font-mono">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => (
                  <motion.div
                    layout
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-[160px_1fr_40px] sm:grid-cols-[200px_1fr_45px] gap-4 items-center hover:bg-white/5 p-2 -mx-2 rounded transition-colors group"
                  >
                    <span className="text-white font-bold group-hover:text-gui-primary transition-colors truncate">
                      {skill.name}
                    </span>

                    {/* Animated Progress Bar track */}
                    <div className="w-full h-2 bg-[#181D26] border border-gui-border/10 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${skill.pct >= 90 ? "bg-gui-primary" : skill.pct >= 80 ? "bg-gui-primary/80" : "bg-gui-secondary"
                          }`}
                      />
                    </div>

                    <span className="text-gray-400 text-right font-bold pl-1 font-mono">
                      {skill.pct}%
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION (Image 3 style) */}
        <section id="education" className="flex flex-col gap-8">
          <div className="flex items-center gap-2 text-xs text-gui-secondary">
            <span className="text-gui-primary">~/education</span>
            <span>$</span>
            <span className="text-gray-300">cat degree.txt</span>
          </div>

          {/* Education Card */}
          <div className="border border-gui-border/30 bg-[#0E1117]/85 p-8 sm:p-10 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-8 shadow-xl relative overflow-hidden group hover:border-gui-primary/40 transition-colors">
            {/* Neon indicator border overlay */}
            <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gui-primary" />

            <div className="flex flex-col gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-gui-primary transition-colors font-mono">
                Bachelor of Technology, Computer Science Engineering
              </h3>
              <p className="text-sm sm:text-base text-gray-400 font-mono">
                Indore Institute of Science & Technology <span className="text-gui-primary font-black">•</span> Indore
              </p>
              <div className="text-xs text-gray-500 font-mono mt-2">
                Relevant courses: Data Structures, Algorithms, Relational Database Management Systems, System Architecture.
              </div>
            </div>

            <div className="shrink-0 flex items-center mt-4 sm:mt-0">
              <span className="px-5 py-2.5 rounded-full border border-gui-primary/40 bg-[#10131B] text-gui-primary font-bold text-sm tracking-widest shadow-[0_0_15px_rgba(255,0,85,0.15)] font-mono uppercase">
                2023 – Present
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION (Image 4 style & Centered Mail detailed Form) */}
        <section id="contact" className="flex flex-col gap-8">
          <div className="flex items-center gap-2 text-xs text-gui-secondary">
            <span className="text-gui-primary">~/contact</span>
            <span>$</span>
            <span className="text-gray-300">open --new-connection</span>
          </div>

          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6 mb-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-mono">
              Let's  <span className="text-gui-primary">Build</span>.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl font-mono">
              Open to full-stack roles, Gen AI engineering, and interesting problems in general. Fastest way to reach me is email.
            </p>

            {/* Center Prominent Email Pill */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0E1117] border border-gui-border/30 px-6 py-3.5 rounded-full shadow-2xl mt-2 select-all group hover:border-gui-primary/60 transition-colors">
              <Mail size={16} className="text-gui-primary hidden sm:block" />
              <a
                href="mailto:cto@scratchbox.app"
                className="text-white hover:text-gui-primary font-bold text-sm sm:text-base tracking-wider transition-colors outline-none font-mono"
              >
                cto@scratchbox.app
              </a>
              <span className="text-gray-600 hidden sm:block">|</span>
              <button
                onClick={copyEmail}
                className="text-xs text-gray-400 hover:text-gui-primary transition-colors flex items-center gap-1 cursor-pointer font-bold uppercase tracking-widest pl-1 font-mono"
              >
                {copiedEmail ? <><Check size={12} className="text-gui-primary" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            {/* Row of Contact Info */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-gray-400 mt-2 font-mono">
              <a href="tel:+917828251527" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Phone size={14} className="text-gui-primary" />
                <span>Phone +91 78282 51527</span>
              </a>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <a href="https://linkedin.com/in/keshav-tejra" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <span>LinkedIn</span>
                <span className="text-gui-secondary font-bold">↗</span>
              </a>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <a href="https://github.com/Keshav-Tejra04" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <span>GitHub</span>
                <span className="text-gui-secondary font-bold">↗</span>
              </a>
            </div>
          </div>

          {/* Centered Premium Mail Form */}
          <div className="w-full max-w-2xl mx-auto border border-gui-border/30 p-6 sm:p-8 bg-[#0E1117]/85 rounded-lg flex flex-col gap-6 relative shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gui-primary/40 to-transparent" />

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-gui-primary font-bold tracking-wider font-mono">Email Payload (From) :</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full bg-[#07070A] border border-gui-border/30 focus:border-gui-primary focus:shadow-[0_0_10px_rgba(255,0,85,0.15)] rounded p-3 text-sm outline-none text-white transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-gui-primary font-bold tracking-wider font-mono">Subject Payload :</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry / Collaboration / Job Opportunity"
                  className="w-full bg-[#07070A] border border-gui-border/30 focus:border-gui-primary focus:shadow-[0_0_10px_rgba(255,0,85,0.15)] rounded p-3 text-sm outline-none text-white transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-gui-primary font-bold tracking-wider font-mono">Body Payload :</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What about it..."
                  className="w-full bg-[#07070A] border border-gui-border/30 focus:border-gui-primary focus:shadow-[0_0_10px_rgba(255,0,85,0.15)] rounded p-3 text-sm outline-none text-white transition-all font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formSent}
                className="w-full py-3.5 rounded border border-gui-primary bg-gui-primary/5 text-gui-primary hover:bg-gui-primary hover:text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_12px_rgba(255,0,85,0.15)] cursor-pointer active:scale-[0.98] font-mono"
              >
                {submitStatus === "sending" ? "Transmitting..." : submitStatus === "success" ? "Transmission Successful ✓" : submitStatus === "error" ? "Transmission Failed ✗" : "Send"}
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-gui-border/20 pt-6 pb-12 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4 font-mono">
          <div>© {new Date().getFullYear()} Keshav Tejra. All terminal &amp; graphic interfaces secured.</div>
          <div className="flex gap-4">
            <span className="text-gui-primary hover:underline cursor-pointer" onClick={() => setMode("terminal")}>terminal_mode</span>
            <span>gui_v2.2.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
