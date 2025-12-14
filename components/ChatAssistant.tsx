import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { GlassCard, Button } from './UI';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      senderId: 'ai', 
      senderName: 'EventOS AI',
      text: 'Hello! I am EventOS AI. How can I help you discover events today?', 
      timestamp: new Date().toLocaleTimeString(),
      isMe: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { 
        id: Date.now().toString(), 
        senderId: 'user',
        senderName: 'You',
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        isMe: true 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const reply = await chatWithAssistant(input);
    
    const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        senderId: 'ai', 
        senderName: 'EventOS AI',
        text: reply, 
        timestamp: new Date().toLocaleTimeString(),
        isMe: false 
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <GlassCard className="w-80 md:w-96 h-[500px] mb-4 flex flex-col shadow-2xl border-neon-cyan/20 bg-dark-surface/95 backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-cyan" />
                    <span className="font-semibold text-white">EventOS AI</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.isMe 
                            ? 'bg-neon-blue/20 text-white rounded-br-none border border-neon-blue/30' 
                            : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/10'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                     <div className="flex justify-start">
                        <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/10 flex gap-1">
                            <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce delay-150"></span>
                        </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="pt-2 flex gap-2 border-t border-white/10">
                <input 
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
                    placeholder="Ask about events..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="p-2 bg-neon-blue text-white rounded-full hover:bg-neon-blue/80 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </GlassCard>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(45,125,255,0.5)] hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
      </button>
    </div>
  );
};