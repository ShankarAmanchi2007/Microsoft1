
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DEVELOPERS, MOCK_PROJECTS } from '../constants';
import { useLocalization } from '../App';

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { t, formatPrice } = useLocalization();
  const developer = MOCK_DEVELOPERS.find(d => d.id === id);
  const projects = MOCK_PROJECTS.filter(p => p.authorId === id);

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedProjectForHire, setSelectedProjectForHire] = useState<string | null>(null);

  if (!developer) return (
    <div className="text-center py-32 flex flex-col items-center">
      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
        <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">Identity Not Found</p>
      <Link to="/" className="mt-8 text-purple-500 hover:text-purple-400 text-[10px] font-black uppercase tracking-widest transition-all">Back to Grid</Link>
    </div>
  );

  const openHireModal = (projectId?: string) => {
    setSelectedProjectForHire(projectId || null);
    setIsHireModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {/* Universal Hiring Interface */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsHireModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]">Talent Engagement</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Initialize Project</h2>
              <p className="text-zinc-500 text-sm mt-4 font-medium leading-relaxed">
                Direct request to {developer.name} {selectedProjectForHire ? `specifically for the ${projects.find(p => p.id === selectedProjectForHire)?.title} architecture.` : 'for a new mission.'}
              </p>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Contract Type</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none text-white appearance-none cursor-pointer font-bold">
                  <option>Full-Stack Build-Out</option>
                  <option>Technical Architecture Review</option>
                  <option>Strategic SaaS Consulting</option>
                  <option>Custom Feature Integration</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">The Brief</label>
                <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none h-32 resize-none text-white placeholder:text-zinc-700 font-medium" placeholder="Describe your vision, stack requirements, and deadline..."></textarea>
              </div>
              <button 
                type="button"
                onClick={() => setIsHireModalOpen(false)}
                className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(168,85,247,0.3)] active:scale-95 transition-all"
              >
                Dispatch Protocol
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Header Dossier */}
      <div className="relative mb-32 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-[4rem] blur opacity-20 transition duration-1000"></div>
        <div className="relative bg-zinc-950 border border-zinc-900 p-12 lg:p-16 rounded-[4rem] overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
            <div className="relative">
              <div className="w-64 h-64 rounded-full p-2 bg-gradient-to-tr from-purple-500 via-zinc-800 to-cyan-500 animate-in spin-in-1 duration-1000">
                <img src={developer.avatar} alt={developer.name} className="w-full h-full rounded-full border-[12px] border-zinc-950 object-cover shadow-2xl" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-purple-500 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/30">
                {developer.rank}
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-10">
              <div>
                <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-none mb-6">{developer.name}</h1>
                <p className="text-zinc-500 text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl italic mx-auto lg:mx-0">
                  "{developer.bio}"
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <button 
                  onClick={() => openHireModal()}
                  className="bg-white hover:bg-zinc-100 text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95"
                >
                  Hire for Project
                </button>
                <a 
                  href={developer.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4"
                >
                  View GitHub
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-12 lg:border-l lg:border-zinc-900 lg:pl-16">
              <div className="text-center lg:text-left">
                <p className="text-6xl font-black text-white tracking-tighter mb-1">{projects.length}</p>
                <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Builds Logged</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-6xl font-black text-white tracking-tighter mb-1">12K+</p>
                <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Global Reach</p>
              </div>
              <div className="text-center lg:text-left pt-10 border-t border-zinc-900 hidden lg:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: Open</span>
                </div>
                <p className="text-2xl font-black text-white tracking-tighter">98% Success</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Sidebar Dossier Information */}
        <div className="lg:col-span-4 space-y-24">
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-zinc-900 flex-1"></div>
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] whitespace-nowrap">Skill Matrix</h3>
              <div className="h-px bg-zinc-900 flex-1"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {developer.skills.map(skill => (
                <span key={skill} className="px-6 py-3.5 bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-purple-500/40 hover:text-purple-400 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-zinc-900 flex-1"></div>
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] whitespace-nowrap">Rewards Vault</h3>
              <div className="h-px bg-zinc-900 flex-1"></div>
            </div>
            <div className="space-y-6">
              {developer.rewards.map((reward, i) => (
                <div key={i} className="flex items-center gap-6 p-7 bg-zinc-950 border border-zinc-900/80 rounded-[2.5rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/10 group-hover:bg-emerald-500 transition-all"></div>
                   <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-500">🏆</div>
                   <div className="flex-1">
                      <p className="text-lg font-black uppercase text-white tracking-tight group-hover:text-emerald-400 transition-colors">{reward.name}</p>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">{reward.platform} • {reward.year}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Impact Feed */}
        <div className="lg:col-span-8 space-y-32">
          {/* Detailed Achievements */}
          <section>
            <div className="flex justify-between items-end mb-16">
               <div>
                 <h3 className="text-[11px] font-black text-purple-500 uppercase tracking-[0.5em] mb-3">Impact Ledger</h3>
                 <h4 className="text-5xl font-black uppercase tracking-tighter">Key Technical Milestones</h4>
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {developer.achievements.map((ach, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[3.5rem] hover:border-purple-500/30 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-5xl mb-8 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-700">{ach.icon}</div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 relative z-10 group-hover:text-purple-400 transition-colors leading-tight">{ach.title}</h4>
                  <p className="text-zinc-500 text-base leading-relaxed relative z-10 font-medium">{ach.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Historical Repository */}
          <section>
            <div className="flex justify-between items-end mb-16">
               <div>
                 <h3 className="text-[11px] font-black text-purple-500 uppercase tracking-[0.5em] mb-3">Build History</h3>
                 <h4 className="text-5xl font-black uppercase tracking-tighter">Deployed Architectures</h4>
               </div>
               <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest block">{projects.length} System Nodes Online</span>
               </div>
            </div>

            <div className="space-y-20">
              {projects.map(project => (
                <div key={project.id} className="group relative bg-zinc-950 border border-zinc-900 rounded-[4.5rem] overflow-hidden hover:border-purple-500/30 transition-all duration-1000 shadow-2xl">
                  <div className="flex flex-col xl:flex-row">
                    <div className="xl:w-1/2 aspect-video xl:aspect-auto overflow-hidden relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent"></div>
                    </div>
                    
                    <div className="xl:w-1/2 p-12 xl:p-20 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-8">
                         <div>
                            <h4 className="text-5xl font-black uppercase tracking-tighter text-white mb-4 group-hover:text-purple-400 transition-colors leading-none">{project.title}</h4>
                            <div className="flex flex-wrap gap-3">
                               {project.techStack.slice(0, 3).map(tech => (
                                 <span key={tech} className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1.5 rounded-xl">{tech}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium italic mb-12 line-clamp-3">
                        "{project.description}"
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <Link 
                          to={`/project/${project.id}`}
                          className="py-6 text-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all"
                         >
                           Review Node
                         </Link>
                         <button 
                          onClick={() => openHireModal(project.id)}
                          className="py-6 text-center bg-purple-500 hover:bg-purple-400 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-purple-500/20 active:scale-95"
                         >
                           Hire For Similar Build
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
