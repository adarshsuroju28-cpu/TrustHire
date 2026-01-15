
import React, { useState, useEffect, useRef } from 'react';
import { getCareerGuidance } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { User, CareerSuggestion } from '../types';

interface CareerGuideProps {
  user: User;
  onUpdate: () => void;
}

const PREDEFINED_SKILLS = [
  "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "PHP", "SQL",
  "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "Flutter", "AWS", "Docker", "Kubernetes",
  "Data Analyst", "Data Scientist", "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "DevOps Engineer", "UI/UX Designer", "Product Manager", "Machine Learning Engineer", "Cybersecurity Analyst"
];

const CareerGuide: React.FC<CareerGuideProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(user.skills || []);
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

  const handleAddSkill = async (skillToAdd: string) => {
    const trimmedSkill = skillToAdd.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const updatedSkills = [...skills, trimmedSkill];
      setSkills(updatedSkills);
      setNewSkill('');
      setShowSuggestions(false);
      
      const updatedUser = { ...user, skills: updatedSkills };
      await dbService.updateUser(updatedUser);
      onUpdate();
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      handleAddSkill(newSkill);
    }
  };

  const removeSkill = async (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    const updatedUser = { ...user, skills: updatedSkills };
    await dbService.updateUser(updatedUser);
    onUpdate();
  };

  const fetchGuidance = async () => {
    if (skills.length === 0) return;
    setLoading(true);
    try {
      const data = await getCareerGuidance(skills);
      setSuggestions(data);
      await dbService.saveHistory({
        type: 'Career Guidance',
        title: `Path analysis for ${skills.length} skills`,
        status: 'Safe'
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to fetch guidance:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = PREDEFINED_SKILLS.filter(s => 
    s.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(s)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm relative">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Career Profile Skills</h2>
        
        <div className="relative" ref={suggestionRef}>
          <form onSubmit={onFormSubmit} className="flex items-center gap-3 mb-6">
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={newSkill}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search or add a skill..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 transition-all font-medium"
              />
            </div>
            <button 
              type="submit" 
              className="flex-shrink-0 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              aria-label="Add Skill"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" />
              </svg>
            </button>
          </form>

          {showSuggestions && (
            <div className="absolute z-50 left-0 right-16 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <div className="p-2">
                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Suggestions</p>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAddSkill(option)}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-indigo-700">{option}</span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-4 text-sm text-slate-400 italic">No matching suggestions. Press enter to add "{newSkill}".</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="min-h-[3rem] mb-10 mt-4">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm animate-in zoom-in border border-indigo-100/50 shadow-sm">
                  {skill}
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="ml-3 hover:text-indigo-900 transition-colors p-0.5 rounded-full hover:bg-indigo-100"
                    aria-label={`Remove ${skill}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic font-medium">Add skills to your profile to unlock personalized pathways.</p>
          )}
        </div>

        <button 
          onClick={fetchGuidance}
          disabled={loading || skills.length === 0}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xl font-black rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center active:scale-[0.99]"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Markets...
            </div>
          ) : 'Generate Professional Guidance'}
        </button>
      </div>

      <div className="pt-8">
        <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Verified Paths</h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-10">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] border border-slate-200 p-12 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-1 gap-10">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm hover:border-indigo-300 transition-all hover:shadow-2xl animate-in slide-in-from-bottom-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h3 className="text-3xl font-black text-slate-900">{suggestion.role}</h3>
                  <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">Verified Recommendation</div>
                </div>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-4xl">{suggestion.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-50">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Proficiencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.matchingSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg uppercase border border-emerald-100/50">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Legitimate Hiring Partners</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.topCompanies.map((c, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg uppercase border border-blue-100/50">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M16.243 16.243l-.707-.707M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
             </div>
            <h4 className="text-2xl font-bold text-slate-400">Ready to discover?</h4>
            <p className="text-slate-400 mt-2">Add your professional skills above to visualize matching paths.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerGuide;
