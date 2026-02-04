import React, { useState } from 'react';
import { generateQuizFromTopic } from '../services/geminiService';
import { QuizQuestion } from '../types';

interface QuizGenProps {
  onQuizComplete: (score: number, total: number) => void;
}

export const QuizGen: React.FC<QuizGenProps> = ({ onQuizComplete }) => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const generated = await generateQuizFromTopic(topic);
    setQuestions(generated);
    setLoading(false);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerChecked(true);
    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setShowResult(true);
      onQuizComplete(score + (selectedOption === questions[currentIndex].correctAnswer ? 1 : 0), questions.length);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-400">Generating a custom quiz for you...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-2xl shadow-primary/30">
          <i className="fa-solid fa-trophy text-4xl text-white"></i>
        </div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-300 mb-6">
          You scored <span className="text-highlight font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span>
        </p>
        <button 
          onClick={() => { setQuestions([]); setTopic(''); }}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-3 rounded-full transition-all"
        >
          Generate New Quiz
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQ = questions[currentIndex];
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-400">Question {currentIndex + 1}/{questions.length}</span>
          <span className="text-sm font-medium text-highlight">Score: {score}</span>
        </div>
        
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          <h3 className="text-xl font-semibold mb-6 leading-relaxed">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
              if (isAnswerChecked) {
                if (option === currentQ.correctAnswer) btnClass += "bg-green-500/20 border-green-500/50 text-green-200";
                else if (option === selectedOption) btnClass += "bg-red-500/20 border-red-500/50 text-red-200";
                else btnClass += "bg-white/5 border-white/10 opacity-50";
              } else {
                btnClass += selectedOption === option 
                  ? "bg-primary/20 border-primary text-blue-200"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
              }

              return (
                <button 
                  key={idx}
                  onClick={() => !isAnswerChecked && setSelectedOption(option)}
                  disabled={isAnswerChecked}
                  className={btnClass}
                >
                  <span className="inline-block w-6 font-mono text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              )
            })}
          </div>

          {isAnswerChecked && (
            <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
              <p className="text-sm text-blue-200"><strong className="block mb-1 text-blue-100">Explanation:</strong>{currentQ.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
            {!isAnswerChecked ? (
                <button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-all"
                >
                  Check Answer
                </button>
            ) : (
                <button 
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-all flex items-center"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="max-w-md w-full bg-[#0F0F0F] border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-secondary">
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <h2 className="text-xl font-bold mb-2">AI Quiz Generator</h2>
            <p className="text-gray-400 text-sm">Enter a topic, and AI will create a personalized quiz to test your knowledge.</p>
        </div>

        <div className="space-y-4">
            <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, Calculus 101, World War II..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-secondary focus:outline-none transition-colors"
            />
            <button 
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full bg-gradient-to-r from-secondary to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.2)] disabled:opacity-50"
            >
                Generate Quiz
            </button>
        </div>
      </div>
    </div>
  );
};