"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTerminal } from "@/hooks/useTerminal";
import { BootSequence } from "./BootSequence";
import { COMMANDS } from "@/utils/commands";
import { FakeAIOutput } from "./outputs/FakeAIOutput";
import { MatrixRain } from "./MatrixRain";

export function Terminal() {
  const [isBooting, setIsBooting] = useState(true);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const { history, input, setInput, executeCommand, clearHistory, navigateHistory } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, input]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // simple command palette focus
        inputRef.current?.focus();
        // We could open a real modal here if needed
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      if (!cmd) {
        executeCommand("", null);
        return;
      }

      const args = cmd.split(" ");
      const baseCmd = args[0].toLowerCase();

      // Handle AI Mode logic
      if (isAiMode) {
        if (baseCmd === "exit") {
          setIsAiMode(false);
          executeCommand(cmd, <div className="text-terminal-secondary">Exiting AI Mode.</div>);
        } else {
          executeCommand(cmd, <FakeAIOutput query={cmd} />);
        }
        return;
      }

      if (baseCmd === "clear") {
        clearHistory();
        setInput("");
        return;
      }

      if (baseCmd === "matrix") {
        setIsMatrixMode(!isMatrixMode);
        executeCommand(cmd, <div className="text-terminal-secondary">Matrix mode {isMatrixMode ? "disabled" : "enabled"}.</div>);
        return;
      }

      if (baseCmd === "ai") {
        setIsAiMode(true);
        executeCommand(cmd, <div className="text-terminal-primary">Entering AI Mode. Type 'exit' to return to normal terminal.</div>);
        return;
      }

      if (baseCmd === "theme") {
        if (args.length < 2) {
          executeCommand(cmd, (
            <div>
              <span className="text-terminal-secondary">Available themes:</span><br />
              hacker-green (default)<br />
              cyberpunk-blue<br />
              github-dark<br />
              vercel-black<br /><br />
              <span className="text-terminal-secondary">Usage: theme [name]</span>
            </div>
          ));
          return;
        }
        const targetTheme = args[1].toLowerCase();
        const validThemes = ["hacker-green", "cyberpunk-blue", "github-dark", "vercel-black"];
        if (validThemes.includes(targetTheme)) {
          setTheme(targetTheme);
          executeCommand(cmd, <div className="text-terminal-primary">Theme switched to {targetTheme}.</div>);
        } else {
          executeCommand(cmd, <div className="text-terminal-error">Unknown theme: {targetTheme}</div>);
        }
        return;
      }

      if (baseCmd === "help") {
        const helpOutput = (
          <div className="flex flex-col gap-1">
            <div className="mb-2">Available commands:</div>
            {Object.entries(COMMANDS).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="w-32 text-terminal-primary">{key}</span>
                <span className="text-terminal-secondary">- {value.description}</span>
              </div>
            ))}
            <div className="flex">
              <span className="w-32 text-terminal-primary">clear</span>
              <span className="text-terminal-secondary">- Clear terminal history</span>
            </div>
            <div className="flex">
              <span className="w-32 text-terminal-primary">ai</span>
              <span className="text-terminal-secondary">- Enter Fake AI Assistant mode</span>
            </div>
            <div className="flex">
              <span className="w-32 text-terminal-primary">theme [name]</span>
              <span className="text-terminal-secondary">- Switch terminal theme</span>
            </div>
            <div className="flex">
              <span className="w-32 text-terminal-primary">matrix</span>
              <span className="text-terminal-secondary">- Toggle Matrix rain effect</span>
            </div>
          </div>
        );
        executeCommand(cmd, helpOutput);
        return;
      }

      const commandDef = COMMANDS[baseCmd];
      if (commandDef) {
        executeCommand(cmd, commandDef.handler(args.slice(1)));
      } else {
        executeCommand(
          cmd,
          <div className="text-terminal-error">
            Command not found: {baseCmd}. Type 'help' to see available commands.
          </div>
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const availableCommands = [...Object.keys(COMMANDS), "clear", "theme", "matrix", "ai"];
      const matches = availableCommands.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  const promptPrefix = isAiMode ? "ask>" : "keshav@portfolio:~$";

  return (
    <>
      {isMatrixMode && <MatrixRain />}
      <div
        className="h-full w-full bg-terminal-bg text-terminal-body p-4 sm:p-8 font-mono text-sm sm:text-base flex flex-col overflow-y-auto cursor-text relative z-10"
        onClick={handleTerminalClick}
        ref={terminalRef}
      >
        <div className="mb-8 select-none">
          <pre className="text-terminal-primary hidden sm:block">
            {`╔════════════════════════════════════════════╗
║              KESHAV OS v2.0               ║
║ Full-Stack Developer • AI Engineer        ║
║ Mobile App Developer                      ║
╚════════════════════════════════════════════╝`}
          </pre>
          <pre className="text-terminal-primary sm:hidden text-xs">
            {`╔════════════════════════════════╗
║        KESHAV OS v2.0         ║
║ Full-Stack Developer          ║
║ AI Engineer • Mobile Dev      ║
╚════════════════════════════════╝`}
          </pre>
          <div className="mt-4 text-terminal-secondary">
            Status: <span className="text-terminal-primary">● Available for Opportunities</span>
          </div>
          <div className="text-terminal-secondary">
            Current Role: <span className="text-terminal-body">Co-Founder & Full-Stack Developer @ Scratchbox</span>
          </div>
          <div className="text-terminal-secondary">
            Location: <span className="text-terminal-body">India</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 pb-16">
          {history.map((entry) => (
            <div key={entry.id}>
              <div className="flex gap-2 text-terminal-secondary">
                <span>{entry.command.toLowerCase().startsWith("who is") || isAiMode ? "ask>" : "keshav@portfolio:~$"}</span>
                <span className="text-terminal-body">{entry.command}</span>
              </div>
              {entry.output && <div className="mt-2 mb-4">{entry.output}</div>}
            </div>
          ))}

          <div className="flex gap-2 text-terminal-secondary">
            <span>{promptPrefix}</span>
            <div className="relative flex-1 flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none border-none text-terminal-body caret-transparent absolute opacity-0"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <span className="whitespace-pre text-terminal-body break-all">
                {input}
                <span className="inline-block w-2.5 h-4 bg-terminal-primary ml-0.5 animate-blink align-middle" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

