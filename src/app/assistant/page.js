'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

const starterPrompts = [
  'Find me a laptop under $1500 for video editing',
  'Compare iPhone 15 Pro Max vs Galaxy S24 Ultra',
  'Best noise-canceling headphones for travel?',
  'Recommend a gaming setup under $2500',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm eGadjet AI, your personal shopping assistant. I can help you find gadgets, compare products, and make smart purchase decisions. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.role !== 'assistant' || updatedMessages.indexOf(m) > 0)
        .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

      const { data } = await api.post('/ai/chat', {
        message: text.trim(),
        history: history.slice(0, -1),
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: data.data.reply }]);
      if (data.data.recommendations?.length > 0) {
        setRecommendations(data.data.recommendations);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or browse our Explore page.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-10">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          Agentic AI Assistant
        </span>
        <h1 className="mt-4 section-title">eGadjet AI Shopping Agent</h1>
        <p className="section-subtitle mx-auto">
          Powered by LLM technology — ask questions, get recommendations, and compare products intelligently.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card-base flex h-[500px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-card px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-slate'
                    }`}
                  >
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>
                        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-card bg-neutral-100 px-4 py-3 text-sm text-slate-muted">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="border-t border-slate/5 p-4"
            >
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about gadgets, compare products, get recommendations..."
                  className="input-field flex-1"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()} className="btn-primary !px-6">
                  Send
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="rounded-full border border-slate/10 bg-white px-4 py-2 text-xs text-slate-muted transition hover:border-primary hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate">Recommended Products</h3>
          <div className="mt-4 space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((item) => (
                <Link
                  key={item.id}
                  href={`/gadgets/${item.id}`}
                  className="card-base flex gap-3 p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate line-clamp-2">{item.title}</p>
                    <p className="text-sm font-bold text-primary">${item.price}</p>
                    <p className="text-xs text-slate-muted">{item.rating} rating</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-muted">
                Start a conversation to get personalized product recommendations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
