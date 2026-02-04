import React, { useState, useRef, useEffect } from 'react';
import { generateTutorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface PDFTutorProps {
  onCorrectAnswer: () => void;
}

export const PDFTutor: React.FC<PDFTutorProps> = ({ onCorrectAnswer }) => {
  const [file, setFile] = useState<File | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // In a real app, we'd upload to Supabase Storage here and parse content.
      // For this demo, we simulate the "Start" of a session.
      setChatHistory([
        {
          id: '1',
          role: 'model',
          text: `I've analyzed "${e.target.files[0].name}". I'm ready to help you study! What specific topic from this document would you like to review?`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        // Convert chat history to Gemini format
        const geminiHistory = chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const responseText = await generateTutorResponse(
            geminiHistory,
            input,
            file ? `Document Name: ${file.name} (Assume standard textbook content for this topic)` : undefined
        );

        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, botMsg]);

        // Simple heuristic for points: if the model praises "correct", trigger point award
        if (responseText.toLowerCase().includes("correct") || responseText.toLowerCase().includes("excellent")) {
           onCorrectAnswer();
        }

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!file && chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 m-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-file-pdf text-2xl text-primary"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Upload your Study Material</h3>
          <p className="text-gray-400 max-w-md mb-6">
            Upload a PDF, lecture notes, or textbook chapter. Our AI will analyze it and become your personal tutor.
          </p>
          <label className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full cursor-pointer transition-all font-medium">
            <span>Select PDF File</span>
            <input type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-[600px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fa-solid fa-file-lines text-primary mr-3"></i>
              <div>
                <h3 className="font-semibold text-sm">{file?.name || "Study Session"}</h3>
                <p className="text-xs text-gray-500">AI Tutor Active</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); setChatHistory([]); }} className="text-xs text-gray-400 hover:text-white">
              <i className="fa-solid fa-rotate-left mr-1"></i> Reset
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-100 rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white placeholder-gray-500"
                placeholder="Type your answer or ask a question..."
                disabled={loading}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};