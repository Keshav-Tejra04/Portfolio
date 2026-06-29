import { motion } from "framer-motion";
import { Mail, Copy, ExternalLink, Check, Phone } from "lucide-react";
import { useState } from "react";

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.36-1.54 6.36-7a5.2 5.2 0 0 0-1.4-3.6 5.5 5.5 0 0 0-.1-3.5s-1.1-.35-3.5 1.25a12.3 12.3 0 0 0-6.2 0C6.6 2.75 5.5 3.1 5.5 3.1a5.5 5.5 0 0 0-.1 3.5 5.2 5.2 0 0 0-1.4 3.6c0 5.4 3.2 6.6 6.3 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export function ContactOutput() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("cto@scratchbox.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText("+917828251527");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-xl"
    >
      <div className="flex flex-col gap-2 p-4 border border-terminal-surface">
        <div className="flex items-center gap-2 text-terminal-secondary mb-2">
          <Mail size={16} /> Email
        </div>
        <div className="flex items-center justify-between bg-terminal-surface/50 p-2 rounded">
          <a href="mailto:cto@scratchbox.app" className="text-terminal-primary hover:underline">
            cto@scratchbox.app
          </a>
          <button 
            onClick={copyEmail}
            className="text-terminal-secondary hover:text-terminal-primary transition-colors flex items-center gap-1 text-sm"
          >
            {copiedEmail ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 border border-terminal-surface">
        <div className="flex items-center gap-2 text-terminal-secondary mb-2">
          <Phone size={16} /> Phone
        </div>
        <div className="flex items-center justify-between bg-terminal-surface/50 p-2 rounded">
          <a href="tel:+917828251527" className="text-terminal-primary hover:underline">
            +91 78282 51527
          </a>
          <button 
            onClick={copyPhone}
            className="text-terminal-secondary hover:text-terminal-primary transition-colors flex items-center gap-1 text-sm"
          >
            {copiedPhone ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 border border-terminal-surface">
        <div className="flex items-center gap-2 text-terminal-secondary mb-2">
          <GithubIcon /> GitHub
        </div>
        <div className="flex items-center justify-between bg-terminal-surface/50 p-2 rounded">
          <a 
            href="https://github.com/Keshav-Tejra04" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-primary hover:underline"
          >
            github.com/Keshav-Tejra04
          </a>
          <a 
            href="https://github.com/Keshav-Tejra04" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-secondary hover:text-terminal-primary transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 border border-terminal-surface">
        <div className="flex items-center gap-2 text-terminal-secondary mb-2">
          <LinkedinIcon /> LinkedIn
        </div>
        <div className="flex items-center justify-between bg-terminal-surface/50 p-2 rounded">
          <a 
            href="https://linkedin.com/in/keshav-tejra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-primary hover:underline"
          >
            linkedin.com/in/keshav-tejra
          </a>
          <a 
            href="https://linkedin.com/in/keshav-tejra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terminal-secondary hover:text-terminal-primary transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
