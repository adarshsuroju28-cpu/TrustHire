
import React, { useState, useRef } from 'react';
import { analyzeJobPost } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { ScamAnalysis } from '../types';

const ScamDetector: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [sources, setSources] = useState<{title: string, url: string}[]>([]);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!content.trim() && !selectedImage) {
      setError('Please provide text or a screenshot of the offer.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSources([]);
    try {
      const { analysis, sources: foundSources } = await analyzeJobPost(content, selectedImage || undefined, imageMime);
      setResult(analysis);
      setSources(foundSources);
      await dbService.saveHistory({
        type: 'Scam Check',
        title: analysis.verdict.substring(0, 40) + '...',
        status: analysis.riskLevel === 'Low' ? 'Safe' : analysis.riskLevel === 'Medium' ? 'Warning' : 'High Risk'
      });
    } catch (err) {
      setError('Security audit failed. This may be due to complex content or connectivity issues.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Security Audit</h1>
        <p className="text-lg text-slate-600 mt-3 font-medium">Instantly verify job offers against live security databases.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 lg:p-14 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Text Content / URL</label>
              <textarea
                className="w-full h-72 p-6 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 bg-slate-50 font-medium leading-relaxed shadow-inner"
                placeholder="Paste offer details, emails, or links here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Evidence Capture</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-72 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group shadow-inner ${
                  selectedImage ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 bg-slate-50'
                }`}
              >
                {selectedImage ? (
                  <>
                    <img src={`data:${imageMime};base64,${selectedImage}`} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white font-black text-xs uppercase tracking-widest">Replace Capture</p>
                    </div>
                    <button 
                      onClick={clearImage} 
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all z-10"
                      aria-label="Remove Capture"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    </div>
                    <p className="font-bold text-slate-500">Upload screenshot</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Capture your chat or email</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (!content.trim() && !selectedImage)}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center active:scale-95"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Initializing Neural Scan...
              </div>
            ) : 'Launch Expert Verification'}
          </button>
        </div>

        {error && <div className="p-6 bg-rose-50 text-rose-600 text-center font-bold border-t border-rose-100 animate-in slide-in-from-top-2">{error}</div>}

        {result && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-10 lg:p-14 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-end space-x-4">
                <span className={`text-7xl font-black leading-none ${result.score > 70 ? 'text-emerald-600' : result.score > 40 ? 'text-amber-500' : 'text-rose-600'}`}>{result.score}</span>
                <span className="text-slate-300 mb-1 font-black text-xl uppercase tracking-widest">/ Trust Index</span>
              </div>
              <div className={`px-10 py-5 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-xl border-2 ${
                result.riskLevel === 'Low' ? 'bg-emerald-500 text-white border-emerald-400' : 
                result.riskLevel === 'Medium' ? 'bg-amber-500 text-white border-amber-400' : 'bg-rose-500 text-white border-rose-400'
              }`}>{result.riskLevel} Risk Profile</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4a1 1 0 01-.8 1.6H6a3 3 0 01-3-3V6z" clipRule="evenodd" /></svg>
                  Detection Flags
                </h3>
                <ul className="space-y-4">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start text-slate-700 font-bold text-sm">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 mr-4 shrink-0"></div>
                      {flag}
                    </li>
                  ))}
                  {result.redFlags.length === 0 && <li className="text-emerald-600 font-bold">No standard red flags detected.</li>}
                </ul>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2H7a1 1 0 100-2h.01zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                  Neural Analysis
                </h3>
                <p className="text-slate-700 font-medium leading-relaxed mb-10">{result.verdict}</p>
                <div className="pt-8 border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Artifacts</h4>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, i) => (
                      <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">{source.title}</a>
                    ))}
                    {sources.length === 0 && <span className="text-xs text-slate-400 italic">No public web artifacts found.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScamDetector;
