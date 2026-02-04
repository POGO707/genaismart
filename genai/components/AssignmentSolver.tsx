import React, { useState } from 'react';
import { solveAssignment } from '../services/geminiService';

export const AssignmentSolver: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setSolution('');
    
    try {
      const result = await solveAssignment(question);
      setSolution(result);
    } catch (error) {
      setSolution("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 md:p-8 flex-1 flex flex-col shadow-2xl">
        <div className="flex items-center mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mr-4">
            <i className="fa-solid fa-pen-to-square text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">Assignment Solver</h2>
            <p className="text-gray-400 text-sm">Get step-by-step solutions for complex problems using advanced AI.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Input Section */}
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">Your Question</label>
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste your math problem, physics question, or coding assignment here..."
              className="flex-1 w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-green-500/50 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all resize-none font-mono text-sm leading-relaxed"
            />
            <button 
              onClick={handleSolve}
              disabled={loading || !question.trim()}
              className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                  Solving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                  Solve with AI
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-full bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Solution</span>
              {solution && (
                <button 
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white flex items-center transition-colors"
                >
                  <i className="fa-regular fa-copy mr-1"></i> Copy
                </button>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm">Analyzing problem...</p>
                 </div>
              ) : solution ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{solution}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <i className="fa-solid fa-lightbulb text-4xl mb-3 opacity-20"></i>
                  <p className="text-sm">Solution will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};