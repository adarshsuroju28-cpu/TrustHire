
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ScamDetector from './components/ScamDetector';
import CompanyVerify from './components/CompanyVerify';
import CareerGuide from './components/CareerGuide';
import Upskilling from './components/Upskilling';
import { User } from './types';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const savedUser = await dbService.getUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await dbService.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    const updatedUser = await dbService.getUser();
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onAuthSuccess={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/detect" 
              element={user ? <ScamDetector /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/verify" 
              element={user ? <CompanyVerify /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/career" 
              element={user ? <CareerGuide user={user} onUpdate={refreshUser} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/upskilling" 
              element={user ? <Upskilling user={user} onUpdate={refreshUser} /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">TrustHire</span>
                </div>
                <p className="text-sm leading-relaxed max-w-sm">
                  TrustHire is an enterprise-grade protection platform that safeguards career transitions through real-time AI security audits and company verification.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform Tools</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Scam Detector</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Company Lookup</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Career Pathways</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Upskilling Hub</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Ethics & Safety</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
              <p>© {new Date().getFullYear()} TrustHire Secure. All verifications powered by Google Gemini AI.</p>
              <div className="flex space-x-6">
                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
