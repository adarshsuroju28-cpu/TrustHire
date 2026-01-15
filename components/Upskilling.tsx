
import React, { useState, useEffect, useRef } from 'react';
import { getUpskillingResources } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { User, UpskillingResource } from '../types';

interface UpskillingProps {
  user: User;
  onUpdate: () => void;
}

const PREDEFINED_INTERESTS = [
  "React", "Node.js", "Python", "Java", "Machine Learning", "Data Science", "Cloud Computing", 
  "Cybersecurity", "TypeScript", "SQL", "DevOps", "Docker", "Kubernetes", "Mobile App Development",
  "Project Management", "Agile Methodologies", "UI/UX Design", "Product Strategy", "AI Ethics"
];

const Upskilling: React.FC<UpskillingProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<UpskillingResource[]>([]);
  const [sources, setSources] = useState<{title: string, url: string}[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests(prev => [...prev, trimmed]);
      setNewInterest('');
      setShowSuggestions(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim()) {
      handleAddInterest(newInterest);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  const fetchResources = async () => {
    if (interests.length === 0) return;
    setLoading(true);
    try {
      const data = await getUpskillingResources(interests);
      setResources(data.resources);
      setSources(data.sources);
      await dbService.saveHistory({
        type: 'Career Guidance',
        title: `Curated ${data.resources.length} learning resources`,
        status: 'Safe'
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to fetch upskilling resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = PREDEFINED_INTERESTS.filter(s => 
    s.toLowerCase().includes(newInterest.toLowerCase()) && !interests.includes(s)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm relative">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Skill Growth Targets</h2>
        
        <div className="relative" ref={suggestionRef}>
          <form onSubmit={onFormSubmit} className="flex items-center gap-3 mb-6">
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={newInterest}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setNewInterest(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="What skill do you want to master?"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all font-medium"
              />
            </div>
            <button 
              type="submit" 
              className="flex-shrink-0 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              aria-label="Add Topic"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" /></svg>
            </button>
          </form>

          {showSuggestions && (
            <div className="absolute z-50 left-0 right-16 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto animate-in fade-in">
              <div className="p-2">
                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Recommended Topics</p>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAddInterest(option)}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-indigo-700">{option}</span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-4 text-sm text-slate-400 italic">No matches. Press enter to add "{newInterest}".</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="min-h-[3rem] mb-10 mt-4">
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, i) => (
                <div key={i} className="flex items-center bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm animate-in zoom-in border border-indigo-100/50 shadow-sm">
                  {interest}
                  <button 
                    onClick={() => removeInterest(interest)} 
                    className="ml-3 hover:text-indigo-900 transition-colors"
                    aria-label={`Remove ${interest}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-slate-400 italic font-medium">Add learning targets to build a custom verified syllabus.</p>
          )}
        </div>

        <button 
          onClick={fetchResources}
          disabled={loading || interests.length === 0}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xl font-black rounded-2xl transition-all shadow-xl flex items-center justify-center active:scale-[0.99]"
        >
          {loading ? (
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
               Curating Expert Content...
             </div>
          ) : 'Scout Verified Learning Material'}
        </button>
      </div>

      <div className="pt-8">
        <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Syllabus Discovery</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 h-48 animate-pulse"></div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:border-indigo-300 transition-all hover:shadow-xl group flex flex-col animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    resource.type === 'Video' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>{resource.type}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 line-clamp-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">{resource.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{resource.provider}</span>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform inline-flex items-center group">
                    Begin Mastery <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <h4 className="text-2xl font-bold text-slate-400 mb-2">No Syllabus Found</h4>
            <p className="text-slate-400 font-medium">Add topics above to find verified learning resources.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upskilling;
