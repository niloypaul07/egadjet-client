'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const STARTER_PROMPTS = [
  'Find me a laptop under $1500 for video editing',
  'Compare iPhone 15 Pro Max vs Galaxy S24 Ultra',
  'Best noise-canceling headphones for travel?',
  'Recommend a gaming setup under $2500',
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hello! I'm eGadjet AI, your personal shopping assistant. I can help you find gadgets, compare products, and make smart purchase decisions. What are you looking for today?",
};

// Renders markdown-like bold (**text**) and newlines
function MessageContent({ content }) {
  return (
    <div className="space-y-1.5">
      {content.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
}

// Animated typing dots indicator
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-slate/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      // Abort any in-progress stream
      if (abortRef.current) abortRef.current.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      const userMessage = { role: 'user', content: trimmed };
      const history = [...messages, userMessage];

      setMessages(history);
      setInput('');
      setFollowUps([]);
      setIsTyping(true);
      setIsStreaming(true);

      // conversation history to send (exclude initial greeting)
      const chatHistory = history
        .slice(1) // skip system greeting
        .slice(-12) // keep last 12 messages
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${API_BASE}/ai/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            history: chatHistory.slice(0, -1), // don't include latest user msg (sent separately)
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Stream request failed');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let assistantContent = '';
        let buffer = '';
        let firstChunk = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              // handled with next data line
            } else if (line.startsWith('data: ')) {
              const raw = line.slice(6).trim();
              if (!raw) continue;

              try {
                const parsed = JSON.parse(raw);

                // Determine event type from previous event line
                const eventLine = lines[lines.indexOf(line) - 1] ?? '';
                const eventType = eventLine.startsWith('event: ')
                  ? eventLine.slice(7).trim()
                  : 'delta';

                if (eventType === 'delta' || parsed.text !== undefined) {
                  if (firstChunk) {
                    setIsTyping(false);
                    firstChunk = false;
                    // Add empty assistant message to start streaming into
                    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
                  }
                  assistantContent += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: assistantContent,
                    };
                    return updated;
                  });
                } else if (parsed.items !== undefined) {
                  // Could be recommendations or followUps
                  if (Array.isArray(parsed.items) && parsed.items[0]?.id !== undefined) {
                    setRecommendations(parsed.items);
                  } else if (Array.isArray(parsed.items)) {
                    setFollowUps(parsed.items);
                  }
                }
              } catch {
                // malformed JSON line, skip
              }
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Sorry, I ran into an issue. Please try again or browse the Explore page for products.',
          },
        ]);
      } finally {
        setIsTyping(false);
        setIsStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [isStreaming, messages]
  );

  // parse SSE properly using EventSource-style parsing
  // The above fetch+reader approach needs a cleaner event parser
  // Let's re-send using a proper line-pair parser
  const sendMessageSSE = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMessage = { role: 'user', content: trimmed };
      const updatedHistory = [...messages, userMessage];

      setMessages(updatedHistory);
      setInput('');
      setFollowUps([]);
      setIsTyping(true);
      setIsStreaming(true);

      const chatHistory = updatedHistory
        .slice(1)
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${API_BASE}/ai/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            history: chatHistory.slice(0, -1),
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let assistantContent = '';
        let messageAdded = false;
        let currentEvent = 'delta';

        const processLine = (line) => {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (!raw) return;
            try {
              const parsed = JSON.parse(raw);
              if (currentEvent === 'delta') {
                if (!messageAdded) {
                  setIsTyping(false);
                  messageAdded = true;
                  setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
                }
                assistantContent += parsed.text ?? '';
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: 'assistant', content: assistantContent };
                  return copy;
                });
              } else if (currentEvent === 'recommendations') {
                setRecommendations(parsed.items ?? []);
              } else if (currentEvent === 'followUps') {
                setFollowUps(parsed.items ?? []);
              } else if (currentEvent === 'error') {
                setIsTyping(false);
                if (!messageAdded) {
                  setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: parsed.message ?? 'Something went wrong.' },
                  ]);
                }
              }
            } catch {}
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) processLine(line);
        }
        // process any remaining buffer
        if (buffer) processLine(buffer);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I ran into an issue. Please try again or browse the Explore page.',
          },
        ]);
      } finally {
        setIsTyping(false);
        setIsStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [isStreaming, messages]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessageSSE(input);
  };

  const handleFollowUp = (prompt) => {
    sendMessageSSE(prompt);
  };

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([INITIAL_MESSAGE]);
    setRecommendations([]);
    setFollowUps([]);
    setIsStreaming(false);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  return (
    <div className="container-main py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          AI Shopping Assistant
        </span>
        <h1 className="mt-4 section-title">eGadjet AI Assistant</h1>
        <p className="section-subtitle mx-auto max-w-xl">
          Ask anything about gadgets — get personalized recommendations, comparisons, and expert advice.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chat panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-base flex flex-col overflow-hidden" style={{ height: '520px' }}>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-slate/10 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  AI
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate">eGadjet Assistant</p>
                  <p className="text-xs text-slate-muted flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                    {isStreaming ? 'Thinking...' : 'Online'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-muted border border-slate/10 hover:bg-neutral-100 transition"
                title="Clear conversation"
              >
                Clear chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-neutral-100 text-slate rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <MessageContent content={msg.content} />
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold mt-0.5">
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-slate/10 p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about gadgets, compare products..."
                  className="input-field flex-1"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="btn-primary !px-5 flex items-center gap-2 disabled:opacity-50"
                >
                  {isStreaming ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Follow-up suggestions */}
          {followUps.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-muted uppercase tracking-wide">Suggested follow-ups</p>
              <div className="flex flex-wrap gap-2">
                {followUps.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleFollowUp(prompt)}
                    disabled={isStreaming}
                    className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Starter prompts when no follow-ups */}
          {followUps.length === 0 && messages.length <= 1 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-muted uppercase tracking-wide">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleFollowUp(prompt)}
                    disabled={isStreaming}
                    className="rounded-full border border-slate/10 bg-white px-4 py-2 text-xs text-slate-muted transition hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — recommendations */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-slate">Recommended Products</h3>
            <div className="mt-4 space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((item) => (
                  <Link
                    key={item.id}
                    href={`/gadgets/${item.id}`}
                    className="card-base flex gap-3 p-3 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate line-clamp-2">{item.title}</p>
                      <p className="mt-0.5 text-sm font-bold text-primary">${item.price}</p>
                      <p className="text-xs text-slate-muted">⭐ {item.rating}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate/20 p-6 text-center">
                  <p className="text-sm text-slate-muted">
                    Product recommendations will appear here as you chat.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-semibold text-slate">Quick Links</h3>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Browse All Products', href: '/explore' },
                { label: 'Today\'s Deals', href: '/explore?sort=newest' },
                { label: 'Top Rated', href: '/explore?sort=rating' },
                { label: 'View Cart', href: '/cart' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg border border-slate/10 px-4 py-2.5 text-sm text-slate transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                  <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
