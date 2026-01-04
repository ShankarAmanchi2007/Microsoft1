
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DEVELOPERS, MOCK_PROJECTS } from '../constants';

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const developer = MOCK_DEVELOPERS.find(d => d.id === id);
  const projects = MOCK_PROJECTS.filter(p => p.authorId === id);

  if (!developer) return <div className="text-center py-20 font-black uppercase tracking-widest text-zinc-600">Developer not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-[3rem] mb-16 flex flex-col md:flex-row gap-12 items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src={developer.avatar} 
            alt={developer.name} 
            className="relative w-48 h-48 rounded-full border-4 border-black p-1 object-cover shadow-2xl" 
          />
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-purple-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
            <span className="w-2.5 h-2.5 bg-black rounded-full animate-pulse"></span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <h1 className="text-6xl font-black tracking-tighter">{developer.name}</h1>
            <span className="bg-purple-500/10 text-purple-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-purple-500/30">
              AVAILABLE FOR HIRE
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
            {developer.skills.map(skill => (
              <span key={skill} className="text-purple-400 font-bold text-sm bg-purple-500/5 px-3 py-1 rounded-lg border border-purple-500/10">
                {skill}
              </span>
            ))}
          </div>

          <p className="text-zinc-400 text-xl max-w-3xl mb-8 leading-relaxed font-light italic">
            "{developer.bio}"
          </p>

          {/* GitHub Profile Link Section */}
          {developer.github && (
            <div className="mb-10 p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4 max-w-fit mx-auto md:mx-0 group/gh-sec hover:border-purple-500/30 transition-all duration-300 shadow-xl">
              <div className="p-3 bg-zinc-900 rounded-xl group-hover/gh-sec:bg-purple-500/10 transition-all">
                <svg className="w-6 h-6 text-zinc-400 group-hover/gh-sec:text-purple-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Source Repository</p>
                <a 
                  href={developer.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 font-bold transition-colors flex items-center gap-2 group/gh-link"
                >
                  {developer.github.replace('https://github.com/', 'github.com/')}
                  <svg className="w-4 h-4 group-hover/gh-link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a 
              href={developer.github || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700 flex items-center justify-center gap-3 active:scale-95"
            >
              Review Codebase
            </a>
            <a 
              href={`mailto:${developer.contactEmail}`} 
              className="bg-purple-500 hover:bg-purple-400 text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-purple-500/20 flex items-center justify-center active:scale-95"
            >
              HIRE {developer.name.split(' ')[0].toUpperCase()}
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-12 border-b border-zinc-800 pb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase">Build Repository</h2>
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">A curated selection of verified technical assets</p>
        </div>
        <span className="text-zinc-400 text-sm font-black uppercase tracking-[0.2em]">{projects.length} Showcases</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`} className="group block h-full">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] overflow-hidden group-hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 right-4">
                   {project.isPaid ? (
                     <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg uppercase">PAID</span>
                   ) : (
                     <span className="bg-black/80 text-white text-[8px] font-black px-2 py-1 rounded border border-zinc-700 uppercase">FREE</span>
                   )}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors mb-4 uppercase">{project.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-8 italic">"{project.description}"</p>
                <div className="mt-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-zinc-500 px-3 py-1 bg-zinc-800/50 rounded-lg">{project.techStack[0]}</span>
                  <span className="text-purple-500 group-hover:translate-x-1 transition-transform flex items-center gap-2">Explore Case Study <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
