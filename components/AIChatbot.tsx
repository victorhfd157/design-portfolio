import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const AIChatbot: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t.chat.initial_msg, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes
  useEffect(() => {
    setMessages(prev => {
        // If the first message is the welcome message, update it
        if (prev.length === 1 && prev[0].role === 'model') {
            return [{ role: 'model', text: t.chat.initial_msg, timestamp: new Date() }];
        }
        return prev;
    });
  }, [t.chat.initial_msg]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const botMsg: Message = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        role: 'model',
        text: t.chat.error,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden ${
          isOpen ? 'bg-gray-800 rotate-90 border border-white/20' : 'scale-100 hover:scale-110'
        }`}
        aria-label="Toggle Chat"
      >
        {!isOpen && (
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent to-purple-600 animate-pulse-slow opacity-90"></div>
        )}
        <div className="relative z-10">
            {isOpen ? <X className="text-white" /> : <Sparkles className="text-white animate-pulse" />}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] z-40 glass-panel rounded-2xl flex flex-col shadow-2xl border border-white/10 animate-[float_0.5s_ease-out]">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-accent to-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Aura AI</h3>
                <p className="text-xs text-brand-accent">{t.chat.header_subtitle}</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-accent text-white rounded-br-none'
                      : 'bg-white/10 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">{t.chat.typing}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 rounded-b-2xl">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chat.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-brand-accent rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;