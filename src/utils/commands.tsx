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
      "portfolio.md": { 
        type: "file", 
        component: (
          <div className="border border-terminal-surface p-4 bg-terminal-bg">
            <div className="flex items-end gap-4 border-b border-terminal-surface pb-2 mb-4">
              <span className="text-2xl font-bold text-terminal-primary">PROJECT</span>
              <span className="text-lg text-terminal-secondary">KESHAV OS PORTFOLIO</span>
            </div>
            <p className="text-terminal-body font-bold mb-2">Dual-Interface Web Portfolio</p>
            <p className="text-terminal-secondary mb-4">An interactive developer portfolio featuring a fully functional Linux-style terminal and a modern Cyberpunk GUI.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Features:</span>
                <ul className="list-disc list-inside text-terminal-secondary space-y-1">
                  <li>Terminal Interface Engine & Command Parsing</li>
                  <li>Mock Virtual Filesystem with Autocomplete</li>
                  <li>Modern Cyberpunk GUI Mode</li>
                  <li>Fluid Framer Motion Page Transitions</li>
                </ul>
              </div>
              <div>
                <span className="text-terminal-primary border-b border-terminal-primary/30 inline-block mb-2">Tech Stack:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech, j) => (
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
    description: "List all available commands",
    handler: () => (
      <div className="flex flex-col gap-4 max-w-2xl font-mono text-sm mt-2 mb-2">
        <div>
          <span className="text-gui-primary font-bold">NAME</span>
          <p className="pl-4 text-terminal-body mt-1">keshav-os - an interactive developer portfolio, in terminal form</p>
        </div>

        <div>
          <span className="text-gui-primary font-bold">SYNOPSIS</span>
          <p className="pl-4 text-terminal-body mt-1">&lt;command&gt; [arguments]</p>
        </div>

        <div>
          <span className="text-gui-primary font-bold">DESCRIPTION</span>
          <p className="pl-4 text-terminal-body mt-1">
            You are reading my portfolio by typing commands at a prompt. 
            You can also switch to the graphical layout at any time.
          </p>
        </div>

        <div>
          <span className="text-gui-primary font-bold">COMMANDS</span>
          <div className="pl-4 grid grid-cols-[130px_1fr] gap-y-1 mt-1 text-terminal-body">
            <span className="text-terminal-primary font-bold">help</span>
            <span>Show this help message</span>

            <span className="text-terminal-primary font-bold">ls [path]</span>
            <span>List directory contents</span>

            <span className="text-terminal-primary font-bold">cat &lt;file&gt;</span>
            <span>Print a file's contents</span>

            <span className="text-terminal-primary font-bold">cd &lt;dir&gt;</span>
            <span>Change directory</span>

            <span className="text-terminal-primary font-bold">pwd</span>
            <span>Print working directory</span>

            <span className="text-terminal-primary font-bold">whoami</span>
            <span>Display author profile information</span>

            <span className="text-terminal-primary font-bold">mail</span>
            <span>Compose and send an email message</span>

            <span className="text-terminal-primary font-bold">tree</span>
            <span>Show the virtual filesystem tree</span>

            <span className="text-terminal-primary font-bold">history</span>
            <span>Show command history list</span>

            <span className="text-terminal-primary font-bold">man &lt;command&gt;</span>
            <span>Display manual details for a command</span>

            <span className="text-terminal-primary font-bold">date</span>
            <span>Display current date and time</span>

            <span className="text-terminal-primary font-bold">echo &lt;text&gt;</span>
            <span>Print text back to screen</span>

            <span className="text-terminal-primary font-bold">clear</span>
            <span>Clear screen history</span>
          </div>
        </div>

        <div>
          <span className="text-gui-primary font-bold">SETTINGS</span>
          <div className="pl-4 grid grid-cols-[130px_1fr] gap-y-1 mt-1 text-terminal-body">
            <span className="text-terminal-primary font-bold">theme [name]</span>
            <span>gui-inspired | hacker-green | cyberpunk-blue | github-dark | vercel-black</span>

            <span className="text-terminal-primary font-bold">crt [on|off]</span>
            <span>Toggle CRT scanlines and screen effects</span>

            <span className="text-terminal-primary font-bold">sound [on|off]</span>
            <span>Toggle keypress feedback sound effects</span>
          </div>
        </div>

        <div>
          <span className="text-gui-primary font-bold">KEYBOARD</span>
          <div className="pl-4 grid grid-cols-[130px_1fr] gap-y-1 mt-1 text-terminal-body">
            <span className="text-terminal-secondary font-bold">Tab / &rarr;</span>
            <span>Autocomplete current word / accept ghost-text</span>

            <span className="text-terminal-secondary font-bold">Up / Down</span>
            <span>Navigate command history list</span>

            <span className="text-terminal-secondary font-bold">Ctrl+C</span>
            <span>Cancel current input line</span>
          </div>
        </div>

        <div>
          <span className="text-gui-primary font-bold">TIPS</span>
          <ul className="list-disc list-inside pl-4 mt-1 text-terminal-body space-y-0.5">
            <li>Files in <span className="text-terminal-primary font-bold">projects/</span> are markdown. Try '<span className="text-terminal-primary font-bold">cat projects/portfolio.md</span>'.</li>
            <li>Directories are virtual. Try '<span className="text-terminal-primary font-bold">cd projects</span>' then '<span className="text-terminal-primary font-bold">ls</span>'.</li>
          </ul>
        </div>

        <div>
          <span className="text-gui-primary font-bold">REPORTING BUGS</span>
          <p className="pl-4 text-terminal-body mt-1">There are no bugs. There are only features you have not found yet.</p>
        </div>
      </div>
    ),
  },
  whoami: {
    description: "Display author profile information",
    handler: () => (
      <div className="flex flex-col gap-4 max-w-xl font-mono text-sm leading-relaxed mt-2 mb-2">
        <div className="text-terminal-primary border-b border-gui-border/20 pb-1.5 font-bold uppercase tracking-wider">Profile: Keshav Tejra</div>
        <div className="text-terminal-body">
          I'm a full-stack developer who'd rather ship a working product than polish a deck about one. Most of my time is spent building scalable backends with Go/Python and fluid frontends using React and Next.js.
        </div>
        <div className="text-terminal-secondary text-xs">
          <span className="text-terminal-primary font-bold">CURRENTLY:</span> Scaling <span className="text-white font-bold">Scratchbox</span> to its full potential, ignoring my phone's screen time alerts, and wondering how the build compiled on the first try.
        </div>
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
│   ├── portfolio.md
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
    description: "Compose and send an email message",
    handler: (args, ctx) => {
      ctx.setMailState({ to: "cto@scratchbox.app", subject: "", lines: [], mode: "subject" });
      return (
        <div className="border border-terminal-surface border-dashed p-4 my-2">
          <div className="text-terminal-secondary">┌── compose ──────────────────────────────</div>
          <div><span className="text-terminal-secondary">│ to:</span> <span className="text-terminal-primary">cto@scratchbox.app</span></div>
          <div><span className="text-terminal-secondary">│ subject:</span> <span className="text-terminal-body">(type below, then Enter)</span></div>
          <div className="text-terminal-secondary">└─────────────────────────────────────────</div>
        </div>
      );
    },
  },
  theme: {
    description: "Switch terminal theme",
    handler: (args, ctx) => {
      if (!args[0]) return <div className="text-terminal-secondary">Usage: theme [gui-inspired | hacker-green | cyberpunk-blue | github-dark | vercel-black]</div>;
      const validThemes = ["gui-inspired", "hacker-green", "cyberpunk-blue", "github-dark", "vercel-black"];
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
  about: { description: "View my background bio", handler: (args, ctx) => COMMANDS.cat.handler(["~/about.md"], ctx) },
  experience: { description: "View my professional timeline", handler: (args, ctx) => COMMANDS.cat.handler(["~/experience.md"], ctx) },
  projects: { description: "View featured projects", handler: (args, ctx) => COMMANDS.cat.handler(["~/projects/all_projects.md"], ctx) },
  skills: { description: "View technical skills list", handler: (args, ctx) => COMMANDS.cat.handler(["~/skills/core_skills.md"], ctx) },
  mobile: { description: "View mobile app technologies", handler: (args, ctx) => COMMANDS.cat.handler(["~/skills/mobile.md"], ctx) },
  contact: { description: "View my contact channels", handler: (args, ctx) => COMMANDS.cat.handler(["~/contact.txt"], ctx) },
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
  date: {
    description: "Display current date and time",
    handler: () => <div className="text-terminal-body">{new Date().toString()}</div>,
  },
  echo: {
    description: "Print text back to screen",
    handler: (args) => <div className="text-terminal-body">{args.join(" ")}</div>,
  },
  sudo: {
    description: "Execute commands as superuser (try: sudo hire-keshav)",
    handler: (args) => {
      if (args[0] === "hire-keshav") {
        return <div className="text-terminal-primary font-bold">Excellent choice.<br />Let's build something amazing together.</div>;
      }
      return (
        <div className="text-terminal-error">
          Usage: sudo &lt;command&gt;<br />
          Try running: <span className="text-terminal-primary font-bold">sudo hire-keshav</span>
        </div>
      );
    }
  }
};
