import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const history = user.history || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 animate-in fade-in slide-in-from-left duration-700">
        <div className="flex items-center gap-5 mb-6">
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-[2rem] shadow-xl border-4 border-white" />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-100">Verified Google Identity</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 text-xs font-bold tracking-wide">{user.email}</p>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900">{user.name}</span>
        </h1>
        <p className="text-xl text-slate-500 mt-4 font-medium max-w-2xl leading-relaxed">
          Your profile is secured by Google Identity. All job verifications and career guidance are tailored to your verified academic background.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/detect" className="group p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all hover:-translate-y-1">
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Scam Detector</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Analyze offer screenshots and emails for hidden red flags.</p>
          <div className="mt-6 flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Open Tool <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" /></svg>
          </div>
        </Link>

        <Link to="/verify" className="group p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all hover:-translate-y-1">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Company Verify</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Check physical registrations and global employer reviews.</p>
          <div className="mt-6 flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Verify Now <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" /></svg>
          </div>
        </Link>

        <Link to="/career" className="group p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all hover:-translate-y-1">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors shadow-sm">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Career Guide</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Discover legitimate career paths based on your skills.</p>
          <div className="mt-6 flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Find Paths <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" /></svg>
          </div>
        </Link>

        <Link to="/upskilling" className="group p-8 bg-indigo-600 rounded-[2.5rem] border border-indigo-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">Upskilling Hub</h2>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">Access verified learning resources to grow your talent.</p>
            <div className="mt-6 flex items-center text-white font-black text-[10px] uppercase tracking-[0.2em]">
              Start Learning <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" /></svg>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 -mr-8 -mb-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Recent Verifications</h3>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="flex items-center space-x-5 p-5 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white transition-colors ${
                    item.type === 'Scam Check' ? 'bg-rose-50 text-rose-600' : 
                    item.type === 'Company Verify' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.type === 'Scam Check' ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    ) : (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-base font-black text-slate-900 line-clamp-1">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.type} • {item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${
                      item.status === 'Safe' || item.status === 'Verified' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      item.status === 'Warning' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                      'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold italic">No recent activity found. Start a new verification above.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col justify-center text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Verified Identity</h3>
          <p className="text-2xl font-black text-indigo-600 tracking-tight mb-4">{user.name}</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 w-[100%] rounded-full"></div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Identity Score: 100/100</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;