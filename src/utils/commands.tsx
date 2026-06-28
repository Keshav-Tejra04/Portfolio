import React from "react";
import { AboutOutput } from "@/components/outputs/AboutOutput";
import { ExperienceOutput } from "@/components/outputs/ExperienceOutput";
import { ProjectsOutput } from "@/components/outputs/ProjectsOutput";
import { SkillsOutput } from "@/components/outputs/SkillsOutput";
import { MobileOutput } from "@/components/outputs/MobileOutput";
import { ContactOutput } from "@/components/outputs/ContactOutput";

export type TerminalContext = {
  cwd: string;
  setCwd: (cwd: string) => void;
  setTheme: (theme: string) => void;
  crt: boolean;
  setCrt: (crt: boolean) => void;
  sound: boolean;
  setSound: (sound: boolean) => void;
  setMailState: (state: any) => void;
  commandHistory: string[];
  setMode: (mode: "terminal" | "gui") => void;
};

export type CommandHandler = (args: string[], ctx: TerminalContext) => React.ReactNode;

export interface FileNode {
  type: "file";
  component: React.ReactNode;
}

export interface DirNode {
  type: "dir";
}

export type FSNode = FileNode | DirNode;

export interface FSDirectory {
  type: "dir";
  children: Record<string, FSNode>;
}

// Virtual Filesystem Map
export const FILE_SYSTEM: Record<string, FSDirectory> = {
  "~": {
    type: "dir",
    children: {
      "projects": { type: "dir" },
      "skills": { type: "dir" },
      "about.md": { type: "file", component: <AboutOutput /> },
      "experience.md": { type: "file", component: <ExperienceOutput /> },
      "contact.txt": { type: "file", component: <ContactOutput /> },
    },
  },
  "~/projects": {
    type: "dir",
    children: {
      "all_projects.md": { type: "file", component: <ProjectsOutput /> },
      "devflow.md": { type: "file", component: <ProjectsOutput projectId="01" /> },
      "skill_evaluator.md": { type: "file", component: <ProjectsOutput projectId="02" /> },
      "scratchbox.md": { 
        type: "file", 
        component: (
          <div className="border border-terminal-surface p-4 bg-terminal-bg">
            <div className="flex items-end gap-4 border-b border-terminal-surface pb-2 mb-4">
              <span className="text-2xl font-bold text-terminal-primary">STARTUP</span>
              <span className="text-lg text-terminal-secondary">SCRATCHBOX</span>
            </div>
            <p className="text-terminal-body font-bold mb-2">Co-Founder & Full-Stack Developer</p>
            <p className="text-terminal-secondary mb-4">A live coding LMS serving 2000+ active users, independently architected and scaled by Keshav.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Highlights:</span>
                <ul className="list-disc list-inside text-terminal-secondary space-y-1">
                  <li>Built and scaled platform serving 2000+ active users</li>
                  <li>Architected front-to-back system architecture</li>
                  <li>Go backend services & React frontend applications</li>
                  <li>JWT authentication, RBAC, and analytics dashboard</li>
                  <li>Sub-150ms API response times</li>
                </ul>
              </div>
              <div>
                <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Tech Stack:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Go", "React", "PostgreSQL", "JWT", "REST APIs"].map((tech, j) => (
                    <span key={j} className="px-2 py-1 bg-terminal-surface text-terminal-primary text-xs rounded">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
  },
  "~/skills": {
    type: "dir",
    children: {
      "core_skills.md": { type: "file", component: <SkillsOutput /> },
      "mobile.md": { type: "file", component: <MobileOutput /> },
    },
  },
};

const resolvePath = (cwd: string, target: string) => {
  if (!target || target === "~") return "~";
  if (target === ".") return cwd;
  if (target === "..") {
    if (cwd === "~") return "~";
    const parts = cwd.split("/");
    parts.pop();
    return parts.length === 1 ? "~" : parts.join("/");
  }
  if (target.startsWith("~/")) return target;
  if (target.startsWith("/")) return "~" + target;
  if (cwd === "~") return "~/" + target;
  return cwd + "/" + target;
};

export const COMMANDS: Record<string, { description: string; handler: CommandHandler }> = {
  help: {
    description: "List all available commands (man page style)",
    handler: () => (
      <div className="border border-terminal-surface p-4 bg-terminal-surface/30">
        <h2 className="text-terminal-primary font-bold mb-2">NAME</h2>
        <div className="pl-4 text-terminal-body mb-4">keshav-os - interactive terminal portfolio</div>
        
        <h2 className="text-terminal-primary font-bold mb-2">SYNOPSIS</h2>
        <div className="pl-4 text-terminal-body mb-4">&lt;command&gt; [arguments]</div>

        <h2 className="text-terminal-primary font-bold mb-2">COMMANDS</h2>
        <div className="pl-4 grid grid-cols-[100px_1fr] gap-y-1">
          {Object.entries(COMMANDS).map(([key, val]) => (
            <React.Fragment key={key}>
              <span className="text-terminal-secondary">{key}</span>
              <span className="text-terminal-body">{val.description}</span>
            </React.Fragment>
          ))}
          <span className="text-terminal-secondary">clear</span>
          <span className="text-terminal-body">Clear terminal history</span>
        </div>
      </div>
    ),
  },
  whoami: {
    description: "Display current user profile",
    handler: () => (
      <div className="flex flex-col gap-2">
        <div>Name:<br /><span className="text-terminal-primary">Keshav Tejra</span></div>
        <div>Role:<br /><span className="text-terminal-primary">Full-Stack Developer<br />AI Engineer<br />Mobile App Developer</span></div>
      </div>
    ),
  },
  pwd: {
    description: "Print working directory",
    handler: (args, ctx) => <div className="text-terminal-body">{ctx.cwd.replace("~", "/home/keshav")}</div>,
  },
  ls: {
    description: "List directory contents",
    handler: (args, ctx) => {
      const target = resolvePath(ctx.cwd, args[0] || ".");
      const dir = FILE_SYSTEM[target as keyof typeof FILE_SYSTEM];
      
      if (!dir || dir.type !== "dir") {
        return <div className="text-terminal-error">ls: cannot access '{args[0] || "."}': No such file or directory</div>;
      }

      return (
        <div className="flex flex-wrap gap-4">
          {Object.entries(dir.children).map(([name, info]) => (
            <span key={name} className={info.type === "dir" ? "text-terminal-secondary font-bold" : "text-terminal-body"}>
              {name}{info.type === "dir" ? "/" : ""}
            </span>
          ))}
        </div>
      );
    },
  },
  cd: {
    description: "Change working directory",
    handler: (args, ctx) => {
      const target = resolvePath(ctx.cwd, args[0] || "~");
      if (target === "~") {
        ctx.setCwd("~");
        return null;
      }
      
      const dir = FILE_SYSTEM[target as keyof typeof FILE_SYSTEM];
      if (!dir || dir.type !== "dir") {
        return <div className="text-terminal-error">cd: {args[0]}: Not a directory</div>;
      }
      
      ctx.setCwd(target);
      return null;
    },
  },
  cat: {
    description: "Print file contents",
    handler: (args, ctx) => {
      if (!args[0]) return <div className="text-terminal-error">cat: missing file operand</div>;
      
      const target = resolvePath(ctx.cwd, args[0]);
      const pathParts = target.split("/");
      const fileName = pathParts.pop()!;
      const dirPath = pathParts.join("/") || "~";
      
      const dir = FILE_SYSTEM[dirPath];
      if (!dir || !dir.children || !(fileName in dir.children)) {
        return <div className="text-terminal-error">cat: {args[0]}: No such file or directory</div>;
      }
      
      const fileInfo = dir.children[fileName];
      if (fileInfo.type === "dir") {
        return <div className="text-terminal-error">cat: {args[0]}: Is a directory</div>;
      }
      
      return (
        <div className="border border-terminal-surface p-2 mt-1 mb-1 bg-terminal-bg">
          <div className="text-terminal-secondary border-b border-terminal-surface pb-0.5 mb-1.5 text-xs font-bold">{fileName}</div>
          {fileInfo.component}
        </div>
      );
    },
  },
  tree: {
    description: "Show the filesystem tree",
    handler: () => {
      const tree = `~
├── projects/
│   ├── all_projects.md
│   ├── devflow.md
│   ├── scratchbox.md
│   └── skill_evaluator.md
├── skills/
│   ├── core_skills.md
│   └── mobile.md
├── about.md
├── experience.md
└── contact.txt`;
      return <pre className="text-terminal-body whitespace-pre-wrap">{tree}</pre>;
    },
  },
  history: {
    description: "Show command history",
    handler: (args, ctx) => {
      if (ctx.commandHistory.length === 0) return <div className="text-terminal-secondary">[empty history]</div>;
      // commandHistory is stored reversed (newest first), so we should reverse it for display
      return (
        <div className="flex flex-col gap-1">
          {[...ctx.commandHistory].reverse().map((cmd, i) => (
            <div key={i}>
              <span className="text-terminal-secondary inline-block w-8 text-right mr-4">{i + 1}</span>
              <span className="text-terminal-body">{cmd}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  man: {
    description: "Manual for a command",
    handler: (args) => {
      if (!args[0]) return <div className="text-terminal-error">What manual page do you want? Try 'man ls'</div>;
      const cmd = COMMANDS[args[0]];
      if (!cmd) return <div className="text-terminal-error">No manual entry for {args[0]}</div>;
      
      return (
        <div className="border border-terminal-surface p-4 bg-terminal-surface/30">
          <h2 className="text-terminal-primary font-bold mb-2">NAME</h2>
          <div className="pl-4 text-terminal-body mb-4">{args[0]} - {cmd.description}</div>
          <h2 className="text-terminal-primary font-bold mb-2">DESCRIPTION</h2>
          <div className="pl-4 text-terminal-body">Detailed manual pages are coming soon.</div>
        </div>
      );
    },
  },
  mail: {
    description: "Compose a message to me",
    handler: (args, ctx) => {
      if (!args[0]) return <div className="text-terminal-error">usage: mail &lt;address&gt;<br/>example: mail keshav.tejra04@gmail.com</div>;
      ctx.setMailState({ to: args[0], subject: "", lines: [], mode: "subject" });
      return (
        <div className="border border-terminal-surface border-dashed p-4 my-2">
          <div className="text-terminal-secondary">┌── compose ──────────────────────────────</div>
          <div><span className="text-terminal-secondary">│ to:</span> <span className="text-terminal-primary">{args[0]}</span></div>
          <div><span className="text-terminal-secondary">│ subject:</span> <span className="text-terminal-body">(type below, then Enter)</span></div>
          <div className="text-terminal-secondary">└─────────────────────────────────────────</div>
        </div>
      );
    },
  },
  theme: {
    description: "Switch terminal theme",
    handler: (args, ctx) => {
      if (!args[0]) return <div className="text-terminal-secondary">Usage: theme [hacker-green | cyberpunk-blue | github-dark | vercel-black]</div>;
      const validThemes = ["hacker-green", "cyberpunk-blue", "github-dark", "vercel-black"];
      if (validThemes.includes(args[0])) {
        ctx.setTheme(args[0]);
        return <div className="text-terminal-primary">Theme switched to {args[0]}.</div>;
      }
      return <div className="text-terminal-error">Unknown theme: {args[0]}</div>;
    },
  },
  crt: {
    description: "Toggle CRT scanlines and effects",
    handler: (args, ctx) => {
      const state = args[0] === "on" ? true : args[0] === "off" ? false : !ctx.crt;
      ctx.setCrt(state);
      return <div className="text-terminal-primary">CRT effects {state ? "enabled" : "disabled"}.</div>;
    },
  },
  sound: {
    description: "Toggle keypress sound",
    handler: (args, ctx) => {
      const state = args[0] === "on" ? true : args[0] === "off" ? false : !ctx.sound;
      ctx.setSound(state);
      return <div className="text-terminal-primary">Sound {state ? "enabled" : "disabled"}.</div>;
    },
  },
  gui: {
    description: "Switch to Graphical UI Portfolio",
    handler: (args, ctx) => {
      ctx.setMode("gui");
      return null;
    },
  },
  desktop: {
    description: "Alias for `gui` (Switch to GUI)",
    handler: (args, ctx) => {
      ctx.setMode("gui");
      return null;
    },
  },
  // Legacy aliases mapped to filesystem
  about: { description: "Alias for `cat ~/about.md`", handler: (args, ctx) => COMMANDS.cat.handler(["~/about.md"], ctx) },
  experience: { description: "Alias for `cat ~/experience.md`", handler: (args, ctx) => COMMANDS.cat.handler(["~/experience.md"], ctx) },
  projects: { description: "Alias for `cat ~/projects/all_projects.md`", handler: (args, ctx) => COMMANDS.cat.handler(["~/projects/all_projects.md"], ctx) },
  skills: { description: "Alias for `cat ~/skills/core_skills.md`", handler: (args, ctx) => COMMANDS.cat.handler(["~/skills/core_skills.md"], ctx) },
  mobile: { description: "Alias for `cat ~/skills/mobile.md`", handler: (args, ctx) => COMMANDS.cat.handler(["~/skills/mobile.md"], ctx) },
  contact: { description: "Alias for `cat ~/contact.txt`", handler: (args, ctx) => COMMANDS.cat.handler(["~/contact.txt"], ctx) },
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
  sudo: {
    description: "Execute a command as superuser",
    handler: (args) => {
      if (args[0] === "hire-keshav") {
        return <div className="text-terminal-primary">Excellent choice.<br />Let's build something amazing together.</div>;
      }
      return <div className="text-terminal-error">keshav is not in the sudoers file. This incident will be reported.</div>;
    }
  }
};
