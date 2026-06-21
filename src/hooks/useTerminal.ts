import { useState, useCallback } from "react";

export type CommandOutput = {
  command: string;
  output: React.ReactNode;
  id: string;
};

export function useTerminal() {
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const executeCommand = useCallback(
    (cmd: string, output: React.ReactNode) => {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output, id: Math.random().toString(36).substring(7) },
      ]);
      if (cmd.trim() && cmd !== commandHistory[0]) {
        setCommandHistory((prev) => [cmd, ...prev]);
      }
      setHistoryIndex(-1);
      setInput("");
    },
    [commandHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (commandHistory.length === 0) return;

      if (direction === "up") {
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    },
    [commandHistory, historyIndex]
  );

  return {
    history,
    input,
    setInput,
    executeCommand,
    clearHistory,
    navigateHistory,
  };
}
