import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { PDFTutor } from './components/PDFTutor';
import { QuizGen } from './components/QuizGen';
import { VideoGen } from './components/VideoGen';
import { AssignmentSolver } from './components/AssignmentSolver';
import { User, ViewState, FeatureView } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [activeFeature, setActiveFeature] = useState<FeatureView>(FeatureView.PDF_TUTOR);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // --- Handlers ---
  const handleAuthSuccess = (name: string) => {
    setUser({
      id: 'uuid-123',
      email: 'student@example.com',
      name: name,
      points: 0
    });
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.LANDING);
  };

  const awardPoints = (amount: number = 10) => {
    if (user) {
      setUser({ ...user, points: user.points + amount });
    }
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-highlight text-xs font-bold tracking-wider uppercase">New: Veo Video Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Master Any Subject <br /> with <span className="text-primary">AI Superpowers</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Upload PDFs, generate quizzes, and visualize concepts with Gemini Pro. The all-in-one platform for modern students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
            >
              Get Started for Free
            </button>
            <button className="glass glass-hover text-white px-8 py-4 rounded-full text-lg font-medium transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-file-pdf" 
              title="PDF Tutor" 
              desc="Upload textbook chapters. Our AI reads them and quizzes you specifically on that content."
              color="text-blue-400"
            />
            <FeatureCard 
              icon="fa-brain" 
              title="Smart Quizzes" 
              desc="Generate multiple-choice quizzes on any topic instantly with detailed explanations."
              color="text-purple-400"
            />
            <FeatureCard 
              icon="fa-video" 
              title="Visual Learning" 
              desc="Turn abstract concepts into 16:9 educational videos using the latest Veo models."
              color="text-yellow-400"
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
              <p>&copy; 2024 SmartStudy AI. Built with Google Gemini.</p>
          </div>
      </footer>
    </div>
  );

  const renderDashboard = () => (
    <div className="pt-16 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 bottom-0 top-16 bg-[#080808] border-r border-white/5 hidden md:flex flex-col">
        <div className="p-4 space-y-2">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tools</p>
            <SidebarItem 
                active={activeFeature === FeatureView.PDF_TUTOR} 
                onClick={() => setActiveFeature(FeatureView.PDF_TUTOR)}
                icon="fa-comments"
                label="AI Tutor Chat"
            />
            <SidebarItem 
                active={activeFeature === FeatureView.QUIZ_GEN} 
                onClick={() => setActiveFeature(FeatureView.QUIZ_GEN)}
                icon="fa-clipboard-question"
                label="Quiz Generator"
            />
             <SidebarItem 
                active={activeFeature === FeatureView.ASSIGNMENT_SOLVER} 
                onClick={() => setActiveFeature(FeatureView.ASSIGNMENT_SOLVER)}
                icon="fa-pen-to-square"
                label="Assignment Solver"
            />
             <SidebarItem 
                active={activeFeature === FeatureView.VIDEO_GEN} 
                onClick={() => setActiveFeature(FeatureView.VIDEO_GEN)}
                icon="fa-film"
                label="Topic to Video"
            />
        </div>
        
        <div className="mt-auto p-6 border-t border-white/5">
             <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-white/10">
                <h4 className="font-bold text-sm mb-1">Pro Plan</h4>
                <p className="text-xs text-gray-400 mb-3">Upgrade for 4K video & unlimited text.</p>
                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-lg">Upgrade</button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-[#050505] relative">
         <div className="h-full max-w-6xl mx-auto p-4 md:p-8">
            {activeFeature === FeatureView.PDF_TUTOR && (
                <PDFTutor onCorrectAnswer={() => awardPoints(5)} />
            )}
            {activeFeature === FeatureView.QUIZ_GEN && (
                <QuizGen onQuizComplete={(score, total) => awardPoints(score * 10)} />
            )}
            {activeFeature === FeatureView.ASSIGNMENT_SOLVER && (
                <AssignmentSolver />
            )}
             {activeFeature === FeatureView.VIDEO_GEN && (
                <VideoGen />
            )}
         </div>
      </main>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-primary/30">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onDashboardClick={() => setView(ViewState.DASHBOARD)}
      />
      
      {view === ViewState.LANDING ? renderLanding() : renderDashboard()}
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

// Sub-components for cleaner App.tsx
const FeatureCard = ({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group hover:-translate-y-1">
    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <i className={`fa-solid ${icon} ${color} text-xl`}></i>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const SidebarItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        <i className={`fa-solid ${icon} w-6 text-center mr-2`}></i>
        {label}
    </button>
);

export default App;