import React, { useState } from 'react';
import { searchCompanyLegitimacy } from '../services/geminiService';

const CompanyVerify: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, urls: { title: string, url: string }[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await searchCompanyLegitimacy(query);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Trust Search</h1>
        <p className="text-lg text-slate-600 mt-2">Verify company registration, reviews, or suspicious website URLs.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Enter company name or website URL (e.g. acme.com)..."
            className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all pr-40 text-lg font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 px-8 py-3.5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Verify Now'}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 lg:p-14">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900">Verification Verdict</h2>
              </div>
              
              <div className="prose prose-slate max-w-none text-slate-700 mb-12 text-lg leading-relaxed whitespace-pre-wrap">
                {result.text}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Discovery Footprint (Live Search)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.urls.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:bg-indigo-600 transition-colors">
                        <svg className="w-5 h-5 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700 line-clamp-1 group-hover:text-indigo-900">{source.title}</span>
                    </a>
                  ))}
                  {result.urls.length === 0 && (
                    <p className="text-slate-400 italic text-sm py-4">No direct registration records found on the public web for this specific query.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
             <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest mb-2">Pro Tip</h4>
                  <p className="text-amber-800 text-sm font-medium">Verify the domain age. If a website offering a "Fortune 500" role was registered only 2 months ago, it is highly likely to be a fraudulent site.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyVerify;