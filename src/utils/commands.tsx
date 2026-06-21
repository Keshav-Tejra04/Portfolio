import React from "react";
import { AboutOutput } from "@/components/outputs/AboutOutput";
import { ExperienceOutput } from "@/components/outputs/ExperienceOutput";
import { ProjectsOutput } from "@/components/outputs/ProjectsOutput";
import { SkillsOutput } from "@/components/outputs/SkillsOutput";
import { MobileOutput } from "@/components/outputs/MobileOutput";
import { StatsOutput } from "@/components/outputs/StatsOutput";
import { AchievementsOutput } from "@/components/outputs/AchievementsOutput";
import { ContactOutput } from "@/components/outputs/ContactOutput";

export type CommandHandler = (args: string[]) => React.ReactNode;

export const COMMANDS: Record<string, { description: string; handler: CommandHandler }> = {
  help: {
    description: "List all available commands",
    handler: () => null, // Handled internally
  },
  whoami: {
    description: "Display current user profile",
    handler: () => (
      <div className="flex flex-col gap-2">
        <div>Name:<br /><span className="text-terminal-primary">Keshav Tejra</span></div>
        <div>Role:<br /><span className="text-terminal-primary">Full-Stack Developer<br />AI Engineer<br />Mobile App Developer</span></div>
        <div>Focus Areas:<br />
          <ul className="list-disc list-inside text-terminal-primary">
            <li>Full Stack Development</li>
            <li>Backend Engineering</li>
            <li>Android Development</li>
            <li>Generative AI</li>
            <li>System Design</li>
            <li>Performance Optimization</li>
          </ul>
        </div>
      </div>
    ),
  },
  about: {
    description: "Read my bio and core interests",
    handler: () => <AboutOutput />,
  },
  experience: {
    description: "View my professional experience",
    handler: () => <ExperienceOutput />,
  },
  timeline: {
    description: "Alias for experience",
    handler: () => <ExperienceOutput />,
  },
  projects: {
    description: "View my featured projects",
    handler: () => <ProjectsOutput />,
  },
  skills: {
    description: "View my technical skills",
    handler: () => <SkillsOutput />,
  },
  mobile: {
    description: "Cross-platform mobile development experience",
    handler: () => <MobileOutput />,
  },
  android: {
    description: "Alias for mobile",
    handler: () => <MobileOutput />,
  },
  stats: {
    description: "View my career stats",
    handler: () => <StatsOutput />,
  },
  achievements: {
    description: "View my achievements",
    handler: () => <AchievementsOutput />,
  },
  contact: {
    description: "Get in touch with me",
    handler: () => <ContactOutput />,
  },
  github: {
    description: "Open my GitHub profile",
    handler: () => {
      window.open("https://github.com/Keshav-Tejra04", "_blank");
      return <div className="text-terminal-secondary">Opening GitHub profile...</div>;
    },
  },
  linkedin: {
    description: "Open my LinkedIn profile",
    handler: () => {
      window.open("https://linkedin.com/in/keshav-tejra", "_blank");
      return <div className="text-terminal-secondary">Opening LinkedIn profile...</div>;
    },
  },
  resume: {
    description: "Download my resume",
    handler: () => {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Keshav_Tejra_Resume.pdf";
      link.click();
      return <div className="text-terminal-secondary">Downloading resume...</div>;
    },
  },
  scratchbox: {
    description: "Learn about Scratchbox",
    handler: () => (
      <div className="text-terminal-primary">
        Scratchbox is a live coding LMS serving 2000+ active users, where I am the Co-Founder & Full-Stack Developer.
        <br />Run `experience` or `projects` for more details.
      </div>
    ),
  },
  devflow: {
    description: "Learn about Devflow project",
    handler: () => (
      <div className="text-terminal-primary">
        DEVFLOW: AI-Powered GitHub PR Review Agent.
        <br />Run `projects` for more details.
      </div>
    ),
  },
  "skill-evaluator": {
    description: "Learn about Skill Evaluator project",
    handler: () => (
      <div className="text-terminal-primary">
        SKILL EVALUATOR: AI Resume Analyzer & Career Coach.
        <br />Run `projects` for more details.
      </div>
    ),
  },
  sudo: {
    description: "Execute a command as superuser",
    handler: (args) => {
      if (args[0] === "hire-keshav") {
        return <div className="text-terminal-primary">Excellent choice.<br />Let's build something amazing together.</div>;
      }
      if (args[0] === "deploy-production") {
        return (
          <div className="text-terminal-primary">
            Deployment Successful<br /><br />
            Build Status: PASS<br />
            Tests: PASS<br />
            Performance: OPTIMIZED
          </div>
        );
      }
      if (args[0] === "make-coffee") {
        return (
          <div>
            <span className="text-terminal-error">Error:</span><br />
            Coffee package not installed.<br /><br />
            Try:<br />
            <span className="text-terminal-secondary">npm install coffee</span>
          </div>
        );
      }
      return <div className="text-terminal-error">keshav is not in the sudoers file. This incident will be reported.</div>;
    }
  }
};

