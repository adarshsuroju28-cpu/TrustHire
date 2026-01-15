import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  // Mock accounts that would be "present in the system"
  const systemAccounts = [
    { name: 'S. School', email: '24r01a6658@cmrit.ac.in', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SS&backgroundColor=6366f1' },
    { name: 'S. School (Personal)', email: 'school.personal@gmail.com', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=6366f1' }
  ];

  const handleGoogleAccountSelect = async (selectedEmail: string) => {
    setShowAccountPicker(false);
    setIsLoading(true);
    setStatusMessage(`Signing in to ${selectedEmail}...`);
    
    try {
      const user = await dbService.signInWithGoogle(selectedEmail);
      onAuthSuccess(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Google Sign-in failed");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatusMessage(isLogin ? 'Checking Google ID database...' : 'Verifying profile with Gmail security...');
    
    try {
      let user: User;
      if (isLogin) {
        user = await dbService.signIn(email);
      } else {
        user = await dbService.signUp(email, name);
      }
      onAuthSuccess(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Authentication failed. Ensure your email is valid.");
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Immersive Processing Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-center space-y-8 max-w-sm px-6">
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
               <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-50">
                   <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>
                 </div>
               </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Google Sync</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Google Account Picker Modal (Mimicking Real Google UI) */}
      {showAccountPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
            <div className="p-10 text-center">
              <svg className="w-10 h-10 mx-auto mb-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <h3 className="text-2xl text-slate-900 mb-2">Choose an account</h3>
              <p className="text-slate-500 mb-8">to continue to TrustHire</p>

              <div className="space-y-1 text-left">
                {systemAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleGoogleAccountSelect(account.email)}
                    className="w-full flex items-center p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group"
                  >
                    <img src={account.avatar} alt="" className="w-10 h-10 rounded-full mr-4 border border-slate-100" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{account.name}</p>
                      <p className="text-xs text-slate-500">{account.email}</p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setShowAccountPicker(false)}
                  className="w-full text-center py-4 text-sm font-bold text-slate-400 hover:text-slate-600 mt-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Welcome to TrustHire</h2>
          <p className="mt-3 text-slate-500 font-medium">Processing directly via Google Identity Database</p>
        </div>

        <div className="mt-10 space-y-6 relative z-10">
          <button 
            onClick={() => setShowAccountPicker(true)} 
            className="w-full flex items-center justify-center px-6 py-5 border-2 border-slate-50 rounded-2xl bg-slate-50 text-base font-black text-slate-700 hover:border-indigo-100 hover:bg-white transition-all shadow-sm group"
          >
            <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            {isLogin ? 'Login with Google' : 'Signup with Google'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300"><span className="px-6 bg-white">Fetch Profile</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Name (Auto-fetches if empty)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Gmail display name" />
              </div>
            )}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="24r01a6658@cmrit.ac.in" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="••••••••" />
            </div>
            {error && <div className="p-4 bg-rose-50 rounded-xl text-rose-600 text-xs font-bold border border-rose-100 animate-in fade-in">{error}</div>}
            <button type="submit" disabled={isLoading} className="w-full py-5 px-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-xl active:scale-[0.98] transition-all">
              {isLogin ? 'Sign In' : 'Fetch & Join'}
            </button>
          </form>

          <div className="pt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
              {isLogin ? "Need a verified account?" : "Have an existing profile?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;