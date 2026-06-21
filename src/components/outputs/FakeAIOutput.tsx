"use client";

import { useState, useEffect } from "react";

export function FakeAIOutput({ query }: { query: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Simple local knowledge base
  const kb: Record<string, string> = {
    "who is keshav": "Keshav Tejra is a Full-Stack Developer, AI Engineer, and Co-Founder at Scratchbox. He builds scalable systems and production-grade applications.",
    "what is scratchbox": "Scratchbox is a live coding LMS serving over 2000 active users, architected entirely by Keshav.",
    "resume": "You can download his resume by running the `resume` command.",
    "skills": "Keshav is skilled in Go, Python, React, React Native, PostgreSQL, and Generative AI pipelines.",
    "hello": "Hello! I am the KeshavOS local AI assistant. How can I help you?",
    "hi": "Hi there! I am the KeshavOS local AI assistant. Ask me anything about Keshav.",
  };

  useEffect(() => {
    const q = query.toLowerCase().trim();
    let response = "I don't have information on that. Try asking 'who is keshav', 'what is scratchbox', or 'skills'.";
    
    for (const key in kb) {
      if (q.includes(key)) {
        response = kb[key];
        break;
      }
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(response.slice(0, i + 1));
      i++;
      if (i >= response.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [query]);

  return (
    <div className="text-terminal-primary">
      {displayedText}
      {isTyping && <span className="inline-block w-2 h-4 bg-terminal-primary ml-1 animate-blink align-middle" />}
    </div>
  );
}
