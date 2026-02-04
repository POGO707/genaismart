import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onDashboardClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogoutClick, onDashboardClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2">
              <i className="fa-solid fa-brain text-white text-sm"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              SmartStudy<span className="text-primary">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button 
                  onClick={onDashboardClick}
                  className="hidden md:block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </button>
                <div className="flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
                  <i className="fa-solid fa-gem text-highlight mr-2 text-xs"></i>
                  <span className="text-highlight font-bold text-sm">{user.points}</span>
                </div>
                <div className="flex items-center gap-3 ml-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                   </div>
                   <button 
                    onClick={onLogoutClick}
                    className="text-gray-400 hover:text-white transition-colors"
                   >
                     <i className="fa-solid fa-right-from-bracket"></i>
                   </button>
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};