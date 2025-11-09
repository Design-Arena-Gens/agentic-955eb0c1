"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "../lib/engine";
import { createInitialSession, getQuickStartButtons, handleUserInput, introMessage } from "../lib/engine";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const [session, setSession] = useState(createInitialSession());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed intro message on mount
    setMessages([{ id: crypto.randomUUID(), role: "assistant", content: introMessage() }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const quickButtons = useMemo(() => getQuickStartButtons(), []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    // Simulate processing; all local
    setTimeout(() => {
      const { reply, session: next } = handleUserInput(session, trimmed);
      setSession(next);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      setPending(false);
    }, 120);
  }

  return (
    <div className="card chat">
      <div ref={scrollRef} className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.role === "user" ? "user" : "assistant"}`}>
            {msg.content}
          </div>
        ))}
        {!session.activeWorkflow && (
          <div className="workflows">
            {quickButtons.map((w) => (
              <button key={w} className="wfBtn" onClick={() => send(w)}>{w}</button>
            ))}
          </div>
        )}
      </div>
      <div className="inputBar">
        <input
          className="textInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder={pending ? "Processing..." : "Type here"}
          disabled={pending}
        />
        <button className="sendBtn" onClick={() => send(input)} disabled={pending || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
