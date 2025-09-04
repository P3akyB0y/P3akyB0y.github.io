import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// TerminalPortfolio.jsx
// Single-file React component that looks and behaves like a Linux terminal portfolio.
// Uses Tailwind CSS (assumes your project already includes Tailwind) and Framer Motion for subtle animation.
// TODO: Replace placeholder data (NAME, BIO, PROJECTS, CONTACT) with your real info.

export default function TerminalPortfolio() {
  // === Replace these with your actual info ===
  const PROFILE = {
    name: "Nicholas Broussard",
    handle: "@P3akyB0y",
    role: "Aspiring Cybersecurity Practitioner",
    location: "Houston, TX",
    bio:
      "I build accessible, performant web apps. I love terminals, small utilities, and clean design.",
    resumeLink: "#", // replace with resume URL
  };

  const PROJECTS = [
    {
      title: "Linux Terminal Web Portfolio ",
      desc: "OMG ITS LIKE YOURE CURRENTLY USING IT. WHAAAAAAAAAAAT",
      url: "#",
      tech: ["React", "Node", "Postgres"],
    },
    {
      title: "Capstone Software Engineering Project",
      desc: "Intruwatch my college classmates and i designed and developed a Host Base Intrusion Detection System (HIDS) that monitors and analyzes the internals of a computing system as well as the network packets on its network interfaces for suspicious activity.",
      url: "#",
      tech: ["Python", "Packet Sniffing and Instpection"],
    },
  ];
  const WorkExperience = [
    {
      title: "Northrock Cybersecurity - Field Technician",
      desc: "Add Experience Description.",
      url: "#",
      tech: [""],
    },
  ];
  const CONTACT = {
    email: "NBroussard0710@gmail.com",
    linkedin: "https://www.linkedin.com/in/nicholas-broussard",
    github: "https://github.com/P3akyB0y",
  };

  // === Terminal state ===
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // initial welcome lines
  useEffect(() => {
    const welcome = [
      `Welcome to ${PROFILE.name}'s portfolio — type 'help' to get started.`,
      `Type commands like: about, projects, skills, contact, clear, resume`,
    ];
    setTimeout(() => setLines(welcome), 300);
    // autofocus
    inputRef.current && inputRef.current.focus();
  }, []);

  useEffect(() => {
    // auto-scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // command handlers
  const commands = {
    help: () => [
      "Available commands:",
      "help - show this help",
      "about - who I am",
      "projects - list projects",
      "skills - list tech skills",
      "contact - contact info",
      "resume - open resume link",
      "clear - clear terminal",
    ],
    about: () => [
      `${PROFILE.name} ${PROFILE.handle}`,
      PROFILE.role + " — " + PROFILE.location,
      PROFILE.bio,
    ],
    projects: () => [
      "Projects:",
      ...PROJECTS.flatMap((p, i) => [`${i + 1}. ${p.title} — ${p.desc}`, `   → ${p.url}`, `   tech: ${p.tech.join(", ")}`]),
    ],
    skills: () => [
      "Skills:",
      "JavaScript, TypeScript, React, Node.js, SQL, HTML/CSS, Tailwind, Testing",
    ],
    contact: () => [
      `Email : ${CONTACT.email}`,
      `GitHub : ${CONTACT.github}`,
      `LinkedIn : ${CONTACT.linkedin}`,
    ],
    resume: () => {
      window.open(PROFILE.resumeLink, "_blank");
      return ["Opening resume..."];
    },
    clear: () => {
      setLines([]);
      return [];
    },
  };

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((l) => [...l, `$ ${cmd}`]);
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(-1);

    const [name, ...args] = cmd.split(" ");
    const handler = commands[name.toLowerCase()];

    if (handler) {
      const res = handler(args);
      if (res && res.length) {
        setTimeout(() => setLines((l) => [...l, ...res]), 150);
      }
    } else {
      setTimeout(() =>
        setLines((l) => [...l, `Command not found: ${name} — try 'help'`])
      , 150);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      // history
      e.preventDefault();
      const idx = historyIndex === -1 ? history.length - 1 : historyIndex - 1;
      if (idx >= 0) {
        setInput(history[idx]);
        setHistoryIndex(idx);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setInput("");
        setHistoryIndex(-1);
      } else {
        setInput(history[idx]);
        setHistoryIndex(idx);
      }
    }
  }

  // small prompt component
  function Prompt() {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-green-400">{PROFILE.handle}</span>
        <span className="text-gray-400">:~$</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl shadow-2xl rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-850 border-b border-neutral-800">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-mono">{PROFILE.name} — terminal</div>
              <div className="text-xs text-neutral-400 font-mono">{PROFILE.role}</div>
            </div>
          </div>
          <div className="text-xs text-neutral-500">Press <kbd className="px-1 py-0.5 rounded bg-neutral-800">Enter</kbd> to run command</div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* left column: terminal */}
          <div className="md:col-span-3 p-4 bg-black bg-opacity-40">
            <div
              ref={scrollRef}
              className="h-[60vh] md:h-[70vh] overflow-auto font-mono text-sm leading-relaxed text-neutral-200"
            >
              {lines.length === 0 && (
                <div className="text-neutral-500 italic">terminal cleared. type 'help' to see commands.</div>
              )}

              {lines.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap py-0.5">
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                <Prompt />
              </div>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent focus:outline-none border-b border-neutral-800 pb-1 font-mono text-sm"
                placeholder="Type a command — 'help'"
                autoFocus
                aria-label="terminal-input"
              />

              <button
                onClick={() => {
                  runCommand(input);
                  setInput("");
                  inputRef.current && inputRef.current.focus();
                }}
                className="ml-2 px-3 py-1 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700"
              >
                Run
              </button>
            </div>

            <div className="mt-4 text-xs text-neutral-500">
              Tip: use <span className="text-neutral-300">Arrow Up</span>/<span className="text-neutral-300">Arrow Down</span> to browse command history.
            </div>
          </div>

          {/* right column: profile card */}
          <aside className="md:col-span-1 p-4 border-l border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950">
            <div className="flex flex-col items-start gap-3">
              <div className="w-full flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{PROFILE.name}</div>
                  <div className="text-xs text-neutral-400">{PROFILE.role}</div>
                </div>
              </div>

              <div className="w-full bg-neutral-800 p-3 rounded-lg">
                <div className="text-xs font-mono text-neutral-300">Quick Commands</div>
                <div className="mt-2 flex flex-col gap-2">
                  <button onClick={() => runCommand("about")} className="text-left px-3 py-2 rounded bg-neutral-850 hover:bg-neutral-800 text-sm">about</button>
                  <button onClick={() => runCommand("projects")} className="text-left px-3 py-2 rounded bg-neutral-850 hover:bg-neutral-800 text-sm">projects</button>
                  <button onClick={() => runCommand("contact")} className="text-left px-3 py-2 rounded bg-neutral-850 hover:bg-neutral-800 text-sm">contact</button>
                  <button onClick={() => runCommand("resume")} className="text-left px-3 py-2 rounded bg-neutral-850 hover:bg-neutral-800 text-sm">resume</button>
                </div>
              </div>

              <div className="w-full">
                <div className="text-xs text-neutral-400">Social</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a href={CONTACT.github} target="_blank" rel="noreferrer" className="text-sm font-mono underline">GitHub</a>
                  <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="text-sm font-mono underline">LinkedIn</a>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm font-mono underline">Email</a>
                </div>
              </div>

              <div className="mt-auto text-xs text-neutral-500">
                Built with React • Tailwind • Framer Motion
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}