
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { useLocalization } from '../App';
import { GoogleGenAI } from "@google/genai";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const { t, formatPrice } = useLocalization();
  
  // Local state for the interactive AI demo (NovaCV)
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
    // Simulate a high-end "booting" sequence
    setTimeout(() => setDemoState('active'), 1200);
  };

  const handleAiResumeOptimize = async () => {
    setIsOptimizing(true);
    try {
      // Create a fresh instance for each call as per best practices
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
      const parts = resultText.split('SKILLS:');
      const newSummary = parts[0]?.trim();
      const newSkills = parts[1]?.trim();

      setResumeData(prev => ({
        ...prev,
        summary: newSummary || prev.summary,
        skills: newSkills || prev.skills
      }));
    } catch (error) {
      console.error('AI Demo Error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="group relative bg-zinc-900/10 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 flex flex-col h-full hover:shadow-[0_30px_60px_rgba(168,85,247,0.06)]">
      {/* Interactive Sandbox Overlay */}
      {demoState !== 'idle' && (
        <div className="absolute inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.6)]"></div>
               <span className="text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] font-mono">Instance_{project.id}</span>
             </div>
             <button onClick={() => setDemoState('idle')} className="group/close p-2 hover:bg-white/10 rounded-full transition-all">
               <svg className="w-5 h-5 text-zinc-500 group-hover/close:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {demoState === 'loading' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Virtual Runtime...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {project.id === '7' ? (
                /* Specialized AI Demo for NovaCV */
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                  <div className="bg-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Input Parameters</span>
                      <button 
                        onClick={handleAiResumeOptimize}
                        disabled={isOptimizing}
                        className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/30 transition-all disabled:opacity-50"
                      >
                        {isOptimizing ? 'Synthesizing...' : '⚡ Optimize via AI'}
                      </button>
                    </div>
                    <textarea 
                      value={resumeData.summary}
                      onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-[11px] outline-none focus:border-purple-500/60 h-32 resize-none text-zinc-300 font-medium leading-relaxed"
                    />
                  </div>
                  <div className="flex-1 bg-white text-zinc-950 p-8 rounded-[2.5rem] shadow-2xl overflow-y-auto animate-in slide-in-from-bottom-8 duration-700">
                    <h4 className="font-black text-3xl tracking-tighter uppercase mb-1">{resumeData.name}</h4>
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-6">Generated Architecture Output</p>
                    <div className="border-t border-zinc-100 pt-6">
                      <p className="text-xs leading-relaxed text-zinc-700 italic font-medium">"{resumeData.summary}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard "Interface Standby" Demo for other projects */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <h4 className="text-white font-black text-2xl tracking-tighter mb-4 uppercase">System Standby</h4>
                  <p className="text-zinc-500 text-sm mb-12 max-w-[280px] leading-relaxed font-medium italic">"The full sandbox and architectural logs are reserved for verified collaborators."</p>
                  <Link 
                    to={`/project/${project.id}`}
                    className="bg-purple-500 text-black font-black text-[11px] px-12 py-5 rounded-2xl uppercase tracking-[0.3em] hover:bg-purple-400 active:scale-95 transition-all shadow-[0_15px_40px_rgba(168,85,247,0.3)]"
                  >
                    Open Full Dossier
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Visual Component */}
      <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={handleDemoTrigger}>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
        
        {/* Pricing Badge */}
        <div className="absolute top-6 right-6">
          <div className="bg-zinc-950/90 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.15em] border border-zinc-800/60 backdrop-blur-md shadow-2xl">
            {formatPrice(project.price)}
          </div>
        </div>

        {/* Profile Deep-Link */}
        <Link 
          to={`/profile/${project.authorId}`}
          className="absolute bottom-8 left-8 flex items-center gap-4 group/author z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-0 group-hover/author:opacity-40 transition-opacity"></div>
            <img src={project.authorAvatar} className="relative w-10 h-10 rounded-full border-2 border-zinc-800/80 p-0.5 bg-black object-cover" alt={project.authorName} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white uppercase tracking-[0.1em] group-hover/author:text-purple-400 transition-colors">{project.authorName}</span>
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Verified Architect</span>
          </div>
        </Link>
      </div>
      
      {/* Narrative Component */}
      <div className="p-10 flex-1 flex flex-col">
        <div className="mb-8">
          <h3 className="text-4xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors tracking-tighter uppercase leading-none">{project.title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-medium italic">
            "{project.description}"
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5 mb-10">
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} className="text-[9px] font-black bg-zinc-900/50 text-zinc-600 px-4 py-2 rounded-xl uppercase tracking-widest border border-zinc-800/40 group-hover:border-purple-500/20 transition-all">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Triggers */}
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to={`/project/${project.id}`} 
            className="flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-black py-4.5 rounded-2xl transition-all uppercase tracking-[0.3em]"
          >
            Review Node
          </Link>
          
          <button 
            onClick={handleDemoTrigger}
            className="group/demo relative flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-400 text-black text-[10px] font-black py-4.5 rounded-2xl transition-all uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(168,85,247,0.2)] active:scale-95 overflow-hidden"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            Try Instance
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
  const [suggestions, setSuggestions] = useState<string[]>(['AI Agents', 'Rust Systems', 'Next.js 15', 'Solidity Hub', 'WASM Tools']);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { t } = useLocalization();
  
  const filters = ['All', 'React', 'AI', 'Security', 'Web3', 'System'];

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        p.title.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.techStack.some(t => t.toLowerCase().includes(searchTerm)) ||
        p.authorName.toLowerCase().includes(searchTerm);
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
        contents: "Generate 5 trending high-impact developer search keywords like 'Edge Computing', 'Zero Knowledge', 'WASM Runtime', etc. Return only the 5 keywords separated by commas.",
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
      {/* Header & Global Search */}
      <header className="mb-32 text-center py-24">
        <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-6 py-2 rounded-full mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
          <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em]">Engineered Showcase v4.1</span>
        </div>
        
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
          Build<span className="text-zinc-800">Space</span>
        </h1>
        <p className="text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed italic opacity-80 mb-20">
          "{t('heroSubtitle')}"
        </p>

        {/* Tactical Search Interface */}
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-[3rem] blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-black border border-zinc-800 rounded-[2.5rem] py-8 pl-20 pr-24 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-800 text-xl font-medium shadow-3xl"
            />
            <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-zinc-800 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <button 
              onClick={handleVoiceSearch}
              className={`absolute right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse scale-110 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-zinc-900 text-zinc-600 hover:text-purple-500 hover:bg-zinc-800'}`}
              title="Voice Protocol"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>

          {/* AI Keywords */}
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Trending Intelligence</span>
              <button 
                onClick={fetchAiSuggestions}
                disabled={isRegenerating}
                className="group flex items-center gap-2 text-[9px] font-black text-purple-500/50 hover:text-purple-500 uppercase tracking-widest transition-all"
              >
                <svg className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Sync
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSearch(s)}
                  className="px-6 py-2.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 rounded-2xl text-[11px] font-bold text-zinc-500 hover:text-white transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          {/* Classification Filters */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${activeFilter === filter ? 'bg-purple-500 border-purple-500 text-black shadow-3xl shadow-purple-500/20 scale-105' : 'bg-transparent border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-48">
        {filteredProjects.map(project => (
          <div key={project.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-48 bg-zinc-950/50 rounded-[4rem] border border-dashed border-zinc-900 flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-900/50 rounded-[2rem] flex items-center justify-center mb-10 border border-zinc-800 shadow-2xl">
             <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 className="text-zinc-600 font-black uppercase tracking-[0.5em] text-xs mb-4">Zero Nodes Identified</h4>
          <p className="text-zinc-700 text-sm font-medium mb-12">"No archives match your current query parameters."</p>
          <button 
            onClick={() => {setSearch(''); setActiveFilter('All');}} 
            className="text-purple-500 hover:text-purple-400 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b border-purple-500/20 pb-1"
          >
            Reset Query
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
