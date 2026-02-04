import React, { useState } from 'react';
import { generateEducationalVideo } from '../services/geminiService';

export const VideoGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    // Check for API key selector (from system guidelines)
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
        await window.aistudio.openSelectKey();
        // Assuming success and continuing
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateEducationalVideo(topic);
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Failed to generate video. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex items-center mb-6 border-b border-white/10 pb-4">
             <i className="fa-solid fa-film text-highlight mr-3 text-2xl"></i>
             <div>
                 <h2 className="text-xl font-bold">Topic to Video</h2>
                 <p className="text-gray-400 text-sm">Visualize complex concepts with AI-generated videos (Powered by Veo).</p>
             </div>
        </div>

        {!videoUrl && !loading ? (
            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">What concept do you want to visualize?</label>
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. The structure of a DNA double helix"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-highlight focus:outline-none"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={!topic.trim()}
                        className="bg-highlight text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">{error}</p>}
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2"><i className="fa-solid fa-atom"></i></div>
                      <p className="text-xs text-gray-400">Science Visualization</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2"><i className="fa-solid fa-landmark"></i></div>
                      <p className="text-xs text-gray-400">Historical Events</p>
                   </div>
                </div>
            </div>
        ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-highlight rounded-full border-t-transparent animate-spin"></div>
                    <i className="fa-solid fa-video absolute inset-0 flex items-center justify-center text-gray-500"></i>
                </div>
                <h3 className="text-lg font-bold mb-2">Rendering Video...</h3>
                <p className="text-gray-400 text-sm max-w-xs">This takes about 1-2 minutes. AI is generating frames using Veo model.</p>
             </div>
        ) : (
            <div className="flex-1 flex flex-col">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-6 group">
                    <video 
                        src={videoUrl || ""} 
                        controls 
                        className="w-full h-full object-cover"
                        autoPlay
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{topic}</h3>
                        <p className="text-sm text-gray-400">AI Generated Content</p>
                    </div>
                    <button 
                        onClick={() => { setVideoUrl(null); setTopic(''); }}
                        className="text-sm text-gray-400 hover:text-white flex items-center bg-white/5 px-4 py-2 rounded-lg"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> New Video
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
