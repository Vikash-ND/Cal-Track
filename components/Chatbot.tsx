
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { CloseIcon, SendIcon } from './IconComponents';

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi there! I\'m Cal, your AI nutrition assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getChatbotResponse([...messages, userMessage], trimmedInput);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't connect to the assistant.";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="w-full max-w-lg h-[80vh] bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4">
        <header className="flex items-center justify-between p-4 bg-gray-900/70 border-b border-gray-700">
          <h2 className="text-xl font-bold text-brand-cyan-400">AI Nutritionist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-brand-cyan-600 flex-shrink-0"></div>}
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-cyan-700 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 rounded-full bg-brand-cyan-600 flex-shrink-0"></div>
                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 bg-gray-900/70 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about nutrition..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-cyan-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-brand-cyan-600 text-white p-3 rounded-full hover:bg-brand-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;
