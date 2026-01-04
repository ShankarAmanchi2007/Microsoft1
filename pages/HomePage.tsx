
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { useLocalization } from '../App';
import { GoogleGenAI } from "@google/genai";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const { t, formatPrice } = useLocalization();
  
  const [resumeData, setResumeData] = useState({
    name: 'Jane Developer',
    role: 'Full Stack Engineer',
    summary: 'Expert in building scalable web architectures with a focus on high-performance UX.',
    skills: 'React, Node.js, AI, TypeScript'
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleDemoTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setDemoState('loading');
    setTimeout(() => setDemoState('active'), 1200);
  };

  const handleAiResumeOptimize = async () => {
    setIsOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Professionalize this resume summary and skill list for a high-impact tech resume:
        Summary: ${resumeData.summary}
        Skills: ${resumeData.skills}`,
        config: {
          systemInstruction: "You are an expert tech recruiter. Rewrite the content to be metrics-driven and professional. Return only the new summary, then the word 'SKILLS:' followed by the new list.",
        }
      });
      const resultText = response.text || "";
      const [newSummary, newSkillsPart] = resultText.split('SKILLS:');
      setResumeData(prev => ({
        ...prev,
        summary: newSummary.trim(),
        skills: newSkillsPart ? newSkillsPart.trim() : prev.skills
      }));
    } catch (error) {
      console.error('AI Demo Error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="group relative bg-zinc-900/10 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 flex flex-col h-full hover:shadow-[0_30px_60px_rgba(168,85,247,0.06)]">
      {/* Functional Demo Overlay */}
      {demoState !== 'idle' && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_#a855f7]"></div>
               <span className="text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] font-mono">Sandbox_{project.id}</span>
             </div>
             <button onClick={() => setDemoState('idle')} className="group/close p-2 hover:bg-white/10 rounded-full transition-all">
               <svg className="w-5 h-5 text-zinc-500 group-hover/close:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {demoState === 'loading' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-zinc-500 font-black text-[9px] uppercase tracking-widest animate-pulse">Allocating Runtime Environment...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {project.id === '7' ? (
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Input Stream</span>
                      <button 
                        onClick={handleAiResumeOptimize}
                        disabled={isOptimizing}
                        className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all disabled:opacity-50"
                      >
                        {isOptimizing ? 'Synthesizing...' : '⚡ AI Optimize'}
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={resumeData.name} 
                      onChange={e => setResumeData({...resumeData, name: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-[10px] outline-none focus:border-purple-500 font-medium" 
                    />
                    <textarea 
                      value={resumeData.summary}
                      onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-[10px] outline-none focus:border-purple-500 h-24 resize-none font-medium leading-relaxed"
                    />
                  </div>
                  <div className="flex-1 bg-white text-zinc-950 p-6 rounded-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-bottom-4 duration-700">
                    <h4 className="font-black text-2xl tracking-tighter uppercase mb-1">{resumeData.name}</h4>
                    <p className="text-[8px] font-black text-purple-600 uppercase tracking-widest mb-4">NovaCV Generated Profile</p>
                    <div className="border-t border-zinc-100 pt-3">
                      <p className="text-[10px] leading-relaxed text-zinc-700 italic font-medium">"{resumeData.summary}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl">
                    <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <h4 className="text-white font-black text-xl tracking-tight mb-2 uppercase">Interface Standby</h4>
                  <p className="text-zinc-500 text-xs mb-8 max-w-[200px] leading-relaxed font-medium">Full virtualization and architecture logs available in the detailed showcase.</p>
                  <Link 
                    to={`/project/${project.id}`}
                    className="bg-purple-500 text-black font-black text-[10px] px-10 py-4 rounded-2xl uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(168,85,247,0.2)]"
                  >
                    Open Full Instance
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Visual Header */}
      <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={handleDemoTrigger}>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
        
        <div className="absolute top-6 right-6">
          <div className="bg-zinc-950/80 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.1em] border border-zinc-800 backdrop-blur-sm">
            {formatPrice(project.price)}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <img src={project.authorAvatar} className="w-8 h-8 rounded-full border-2 border-purple-500/40 p-0.5 bg-black" alt="" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{project.authorName}</span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Top Creator</span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-3xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors tracking-tighter uppercase leading-none">{project.title}</h3>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 font-medium italic">
            "{project.description}"
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} className="text-[8px] font-black bg-zinc-800/40 text-zinc-600 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-zinc-800/30 group-hover:border-purple-500/20 transition-colors">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <Link 
            to={`/project/${project.id}`} 
            className="flex-1 group/btn relative flex items-center justify-center gap-2 bg-transparent text-purple-400 hover:text-white text-[10px] font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10 overflow-hidden shadow-inner"
          >
            <span className="relative z-10">{t('viewDetails')}</span>
            <svg className="w-3 h-3 relative z-10 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          
          <button 
            onClick={handleDemoTrigger}
            className="flex-1 group/demo relative flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-black text-[10px] font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(168,85,247,0.2)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/demo:opacity-100 transition-opacity"></div>
            <div className="absolute -inset-1 bg-purple-500/30 blur-2xl opacity-0 group-hover/demo:opacity-100 transition-opacity animate-pulse"></div>
            
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            <span className="relative z-10">{t('tryDemo')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(['AI Agents', 'Rust Repos', 'Next.js 15', 'Zero Knowledge', 'WebContainers']);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { t } = useLocalization();
  
  const filters = ['All', 'React', 'AI', 'Mobile', 'Web3', 'Node.js'];

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        p.title.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.techStack.some(t => t.toLowerCase().includes(searchTerm));
      const matchesFilter = activeFilter === 'All' || p.techStack.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const fetchAiSuggestions = async () => {
    setIsRegenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate 5 trending or cool search keywords for a developer project gallery like 'WebAssembly', 'Edge Computing', etc. Return only the 5 keywords separated by commas, no numbers or bullets.",
      });
      const keywords = response.text?.split(',').map(s => s.trim().replace(/^"|"$/g, '')) || suggestions;
      setSuggestions(keywords.slice(0, 5));
    } catch (e) {
      console.error("Suggestion fetch failed", e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setSearch(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="mb-20 text-center py-16">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest">Global Showcase v4.0</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none uppercase">
          {t('heroTitle')}
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic opacity-80">
          "{t('heroSubtitle')}"
        </p>

        <div className="mt-16 max-w-2xl mx-auto space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-zinc-950 border border-zinc-800 rounded-[1.5rem] py-7 pl-16 pr-20 text-white focus:outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-700 text-lg shadow-2xl"
            />
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-zinc-700 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <button 
              onClick={handleVoiceSearch}
              className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse scale-110 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-zinc-900 text-zinc-500 hover:text-purple-500 hover:bg-zinc-800'}`}
              title="Voice Search"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>

          {/* Suggestions Section */}
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{t('trendingNow')}</span>
              <button 
                onClick={fetchAiSuggestions}
                disabled={isRegenerating}
                className="group flex items-center gap-1.5 text-[8px] font-black text-purple-500/60 hover:text-purple-500 uppercase tracking-widest transition-all"
              >
                <svg className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {t('regenerate')}
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSearch(s)}
                  className="px-4 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeFilter === filter ? 'bg-purple-500 border-purple-500 text-black shadow-2xl shadow-purple-500/20 scale-105' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'}`}
              >
                {filter === 'All' ? 'All' : filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
        {filteredProjects.map(project => (
          <div key={project.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-32 bg-zinc-900/10 rounded-[3rem] border-2 border-dashed border-zinc-900 flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
             <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">{t('noResults')}</p>
          <button onClick={() => {setSearch(''); setActiveFilter('All');}} className="mt-4 text-purple-500 hover:text-purple-400 text-[10px] font-black uppercase tracking-widest transition-colors">{t('resetFilters')}</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
