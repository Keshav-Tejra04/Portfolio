"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { BootSequence } from "./BootSequence";
import { COMMANDS, FILE_SYSTEM } from "@/utils/commands";
import { FakeAIOutput } from "./outputs/FakeAIOutput";
import { MatrixRain } from "./MatrixRain";

// Helper to get auto-completion ghost text
function getGhostText(input: string, cwd: string): string {
  if (!input) return "";
  const parts = input.split(" ");
  const cmd = parts[0].toLowerCase();
  
  if (parts.length === 1) {
    const cmds = Object.keys(COMMANDS);
    const match = cmds.find(c => c.startsWith(cmd));
    return match ? match.slice(cmd.length) : "";
  }
  
  if (parts.length === 2 && ["cat", "ls", "cd"].includes(cmd)) {
    const target = parts[1];
    let searchDir = cwd;
    let searchPrefix = target;
    
    // If target contains a slash, we resolve the directory part and search inside it
    if (target.includes("/")) {
      const splitIndex = target.lastIndexOf("/");
      const prefix = target.slice(0, splitIndex);
      searchPrefix = target.slice(splitIndex + 1);
      
      if (prefix.startsWith("~")) {
        searchDir = prefix;
      } else {
        searchDir = cwd === "~" ? "~/" + prefix : cwd + "/" + prefix;
      }
    }
    
    const dir = FILE_SYSTEM[searchDir as keyof typeof FILE_SYSTEM];
    if (dir && dir.type === "dir" && dir.children) {
      const match = Object.keys(dir.children).find(c => c.startsWith(searchPrefix));
      return match ? match.slice(searchPrefix.length) : "";
    }
  }
  return "";
}

// Audio Context for typing sounds
let audioCtx: AudioContext | null = null;
function ensureAudio() {
  if (!audioCtx && typeof window !== "undefined") {
    try { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch (e) { audioCtx = null; }
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext) {
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = ctx.sampleRate * 0.05; // 50ms of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

let lastClickTime = 0;

function playClick(sound: boolean) {
  if (!sound) return;
  ensureAudio();
  if (!audioCtx) return;
  
  const now = audioCtx.currentTime;
  
  // Throttle to 35ms to match fast typing render speeds
  if (now - lastClickTime < 0.035) return;
  lastClickTime = now;
  
  try {
    // 1. Keycap Impact (bandpass noise at 1800Hz for plastic slap)
    const strike = audioCtx.createBufferSource();
    strike.buffer = getNoiseBuffer(audioCtx);
    
    const strikeFilter = audioCtx.createBiquadFilter();
    strikeFilter.type = "bandpass";
    strikeFilter.frequency.setValueAtTime(1800 + Math.random() * 400, now);
    strikeFilter.Q.setValueAtTime(2, now);
    
    const strikeGain = audioCtx.createGain();
    strikeGain.gain.setValueAtTime(0.012, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012); // 12ms strike decay
    
    strike.connect(strikeFilter);
    strikeFilter.connect(strikeGain);
    strikeGain.connect(audioCtx.destination);
    strike.start(now);
    
    // 2. High-pitch metallic switch contact snap (short chirp)
    const snap = audioCtx.createOscillator();
    const snapGain = audioCtx.createGain();
    snap.type = "sine";
    snap.frequency.setValueAtTime(2400 + Math.random() * 300, now);
    snap.frequency.exponentialRampToValueAtTime(600, now + 0.003); // very fast chirp down
    
    snapGain.gain.setValueAtTime(0.004, now); // quiet, just a click
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.003);
    
    snap.connect(snapGain);
    snapGain.connect(audioCtx.destination);
    snap.start(now);
    snap.stop(now + 0.006);
    
    // 3. Hollow cabinet bottom-out thud (lowpass triangle at 100Hz)
    const thud = audioCtx.createOscillator();
    const thudFilter = audioCtx.createBiquadFilter();
    const thudGain = audioCtx.createGain();
    
    thud.type = "triangle";
    thud.frequency.setValueAtTime(95 + Math.random() * 20, now);
    
    thudFilter.type = "lowpass";
    thudFilter.frequency.setValueAtTime(180, now); // deeply muffled casing thump
    
    thudGain.gain.setValueAtTime(0.028, now); // slightly louder bottom-out
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025); // 25ms thud decay
    
    thud.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(audioCtx.destination);
    thud.start(now);
    thud.stop(now + 0.03);
  } catch (e) {
    console.error("Audio Synthesis Error: ", e);
  }
}
function playBell(sound: boolean) {
  if (!sound) return;
  ensureAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(now); osc.stop(now + 0.4);
}

// Typewriter effect for arbitrary React Nodes
function TypewriterHTML({ children, sound, entryId }: { children: React.ReactNode, sound: boolean, entryId: string }) {
  const reactContainerRef = useRef<HTMLDivElement>(null);
  const typeContainerRef = useRef<HTMLDivElement>(null);
  
  // Use a ref for sound to read the latest value without re-triggering the effect
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  
  useEffect(() => {
    if (!reactContainerRef.current || !typeContainerRef.current) return;
    
    // Safely clone HTML from the React render
    const htmlToType = reactContainerRef.current.innerHTML;
    if (!htmlToType.trim()) return;
    
    // Clear and reset
    typeContainerRef.current.innerHTML = htmlToType;
    const el = typeContainerRef.current;
    
    // Strip initial Framer Motion opacity/transform styles so clones aren't invisible
    const allElements = el.getElementsByTagName("*");
    for (let j = 0; j < allElements.length; j++) {
      const element = allElements[j] as HTMLElement;
      element.style.opacity = "";
      element.style.transform = "";
      // Hide list items initially so their bullet points don't show up before text
      if (element.tagName.toLowerCase() === "li") {
        element.style.display = "none";
      }
    }
    
    const textNodes: Text[] = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let n;
    while((n = walk.nextNode())) {
      textNodes.push(n as Text);
    }
    
    const chars: HTMLElement[] = [];
    textNodes.forEach(node => {
      const text = node.textContent || "";
      const fragment = document.createDocumentFragment();
      for (const char of text) {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "none";
        chars.push(span);
        fragment.appendChild(span);
      }
      node.parentNode?.replaceChild(fragment, node);
    });
    
    // Find the scrollable terminal container
    const scrollContainer = el.closest(".overflow-y-auto");
    
    let i = 0;
    const interval = setInterval(() => {
      const chunkSize = 5; 
      for (let c = 0; c < chunkSize; c++) {
        if (i < chars.length) {
          const charSpan = chars[i];
          
          // Climb the tree to find any hidden parent list items and display them
          let parent = charSpan.parentElement;
          while (parent && parent !== el) {
            if (parent.tagName.toLowerCase() === "li" && parent.style.display === "none") {
              parent.style.display = "list-item";
            }
            parent = parent.parentElement;
          }
          
          charSpan.style.display = "inline";
          i++;
        }
      }
      
      // Scroll to bottom as text expands
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
      
      if (soundRef.current && i < chars.length && i % 15 === 0) {
        playClick(soundRef.current);
      }
      
      if (i >= chars.length) {
        clearInterval(interval);
      }
    }, 12);
    
    return () => clearInterval(interval);
  }, [entryId]);
  
  return (
    <div className="mt-1 mb-1">
      <div ref={reactContainerRef} style={{ display: "none" }}>{children}</div>
      <div ref={typeContainerRef}></div>
    </div>
  );
}

export function Terminal() {
  const [isBooting, setIsBooting] = useState(true);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [time, setTime] = useState("");
  const { theme, setTheme } = useTheme();
  
  const { 
    history, input, setInput, executeCommand, clearHistory, navigateHistory, commandHistory,
    cwd, setCwd, sound, setSound, crt, setCrt, mailState, setMailState
  } = useTerminal();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;

    // Scroll to bottom whenever content changes (e.g. AI streaming text)
    const observer = new MutationObserver(() => {
      el.scrollTop = el.scrollHeight;
    });
    
    observer.observe(el, { 
      childList: true, 
      subtree: true, 
      characterData: true,
      attributes: true,
      attributeFilter: ['style']
    });
    
    // Initial scroll
    el.scrollTop = el.scrollHeight;
    
    return () => observer.disconnect();
  }, []);

  // Also scroll down when typing
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [input]);

  const handleTerminalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'A') return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const ghostText = useMemo(() => getGhostText(input, cwd), [input, cwd]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      const cmd = val.trim();
      
      // Handle Mail composing mode
      if (mailState) {
        if (mailState.mode === "subject") {
          setMailState({ ...mailState, subject: val, mode: "body" });
          executeCommand(val, 
            <div>
              <div className="text-terminal-secondary">subject: <span className="text-terminal-primary">{val}</span></div>
              <div className="text-terminal-secondary">type your message. end with a single "." on its own line.</div>
            </div>
          );
        } else {
          if (cmd === ".") {
            executeCommand(".", 
              <div className="border border-terminal-surface bg-terminal-surface/30 p-4 my-2">
                <div className="text-terminal-secondary font-bold mb-2">─── message ready ───</div>
                <div><span className="text-terminal-secondary">To:</span> <span className="text-terminal-primary">{mailState.to}</span></div>
                <div className="mb-4"><span className="text-terminal-secondary">Subject:</span> <span className="text-terminal-primary">{mailState.subject}</span></div>
                {mailState.lines.map((l, i) => <div key={i} className="text-terminal-body">{l}</div>)}
                <div className="text-terminal-primary mt-4">[message sent. opening your mail client...]</div>
              </div>
            );
            const mailto = `mailto:${mailState.to}?subject=${encodeURIComponent(mailState.subject)}&body=${encodeURIComponent(mailState.lines.join("\n"))}`;
            setTimeout(() => { try { window.open(mailto, "_blank"); } catch (e) { } }, 800);
            setMailState(null);
          } else {
            setMailState({ ...mailState, lines: [...mailState.lines, val] });
            executeCommand(val, <div className="text-terminal-body pl-4">› {val}</div>);
          }
        }
        playClick(sound);
        return;
      }
      
      if (!cmd) {
        executeCommand("", null);
        playClick(sound);
        return;
      }

      const args = cmd.split(" ");
      const baseCmd = args[0].toLowerCase();
      const ctx = { cwd, setCwd, setTheme, crt, setCrt, sound, setSound, commandHistory, setMailState };

      if (isAiMode) {
        if (baseCmd === "exit") {
          setIsAiMode(false);
          executeCommand(cmd, <div className="text-terminal-secondary">Exiting AI Mode.</div>);
        } else {
          executeCommand(cmd, <FakeAIOutput query={cmd} />);
        }
        playClick(sound);
        return;
      }

      if (baseCmd === "clear") {
        clearHistory();
        setInput("");
        playClick(sound);
        return;
      }

      if (baseCmd === "matrix") {
        setIsMatrixMode(!isMatrixMode);
        executeCommand(cmd, <div className="text-terminal-secondary">Matrix mode {isMatrixMode ? "disabled" : "enabled"}.</div>);
        playClick(sound);
        return;
      }

      if (baseCmd === "ai") {
        setIsAiMode(true);
        executeCommand(cmd, <div className="text-terminal-primary">Entering AI Mode. Type 'exit' to return to normal terminal.</div>);
        playClick(sound);
        return;
      }

      const commandDef = COMMANDS[baseCmd];
      if (commandDef) {
        executeCommand(cmd, commandDef.handler(args.slice(1), ctx));
      } else {
        executeCommand(cmd, <div className="text-terminal-error">{baseCmd}: command not found. Type 'help' to see available commands.</div>);
        playBell(sound);
      }
      playClick(sound);
      
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      executeCommand(input + "^C", null);
      setMailState(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    } else if (e.key === "Tab" || e.key === "ArrowRight") {
      e.preventDefault();
      if (ghostText) {
        setInput(input + ghostText);
        playClick(sound);
      } else if (e.key === "Tab") {
        playBell(sound);
      }
    } else {
      playClick(sound);
    }
  };

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  let promptPrefix = "";
  if (mailState) {
    promptPrefix = "mail(" + mailState.mode + ")▸";
  } else if (isAiMode) {
    promptPrefix = "ask>";
  } else {
    promptPrefix = "keshav@portfolio:" + cwd + "$";
  }

  return (
    <>
      {isMatrixMode && <MatrixRain />}
      {crt && (
        <div className="crt-overlay">
          <div className="scanlines"></div>
          <div className="vignette"></div>
          <div className="flicker"></div>
          <div className="film-grain"></div>
        </div>
      )}
      <div
        className="h-full w-full bg-terminal-bg text-terminal-body font-mono text-sm sm:text-base flex flex-col cursor-text relative z-10"
        onClick={handleTerminalClick}
      >
        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 py-1 bg-terminal-surface border-b border-terminal-surface text-xs text-terminal-secondary select-none flex-shrink-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-terminal-primary animate-pulse shadow-[0_0_8px_var(--terminal-primary)]"></span>keshav@portfolio</span>
            <span className="hidden sm:inline">pwd: <span className="text-terminal-primary">{cwd}</span></span>
          </div>
          <div className="flex gap-4">
            <span className="hidden sm:inline">theme: <span className="text-terminal-primary">{theme || "hacker-green"}</span></span>
            <span className="hidden sm:inline">crt: <span className="text-terminal-primary">{crt ? "on" : "off"}</span></span>
            <span className="hidden sm:inline">sound: <span className="text-terminal-primary">{sound ? "on" : "off"}</span></span>
            <span className="text-terminal-primary">{time}</span>
          </div>
        </div>

        {/* History / Output View */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-4 pb-2" ref={historyRef}>
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
            <div className="mt-4 text-terminal-secondary">Type <span className="text-terminal-primary">help</span> to see commands. Type <span className="text-terminal-primary">ls</span> to look around.</div>
            <div className="text-terminal-secondary">Type <span className="text-terminal-primary">cat about.md</span> to begin.</div>
          </div>

          <div className="flex flex-col gap-4">
            {history.map((entry) => (
              <div key={entry.id}>
                <div className="flex gap-2 text-terminal-secondary">
                  <span className={entry.command.startsWith("mail") || isAiMode ? "text-terminal-error" : "text-terminal-primary"}>
                    {entry.command.toLowerCase().startsWith("who is") || isAiMode ? "ask>" : 
                     entry.command.startsWith("mail") ? "mail▸" : 
                     `keshav@portfolio:${cwd}$`}
                  </span>
                  <span className="text-terminal-body">{entry.command}</span>
                </div>
                {entry.output && (
                  <TypewriterHTML sound={sound} entryId={entry.id}>
                    {entry.output}
                  </TypewriterHTML>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Prompt (Pinned to bottom) */}
        <div className="px-4 sm:px-8 py-4 border-t border-terminal-surface bg-terminal-bg flex-shrink-0">
          <div className="flex gap-2 text-terminal-secondary">
            <span className={mailState || isAiMode ? "text-terminal-error" : "text-terminal-primary"}>{promptPrefix}</span>
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
              <span className="whitespace-pre text-terminal-body break-all relative">
                {input}
                {ghostText && <span className="text-terminal-secondary opacity-50 absolute pointer-events-none">{ghostText}</span>}
                <span className="inline-block w-2.5 h-4 bg-terminal-primary ml-0.5 animate-blink align-middle" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
