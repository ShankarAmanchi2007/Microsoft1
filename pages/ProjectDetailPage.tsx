
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { useLocalization } from '../App';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatPrice } = useLocalization();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [checkoutStep, setCheckoutStep] = useState<'method' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  
  const [collabForm, setCollabForm] = useState({
    type: 'End-to-End Build',
    budget: '$5k - $10k',
    mission: ''
  });

  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const [glitchValue, setGlitchValue] = useState(0);
  const [activeProtocols, setActiveProtocols] = useState<string[]>(['Shield-X', 'DeepPacket-Scan']);
  const [threatLogs, setThreatLogs] = useState([
    { id: 1, type: 'CRITICAL', origin: '192.168.1.1', status: 'Blocked' },
    { id: 2, type: 'WARNING', origin: '10.0.0.45', status: 'Analyzing' },
  ]);

  const [resumeData, setResumeData] = useState({
    name: 'Jane Developer',
    role: 'Senior Full Stack Engineer',
    summary: 'Building high-performance web applications with a focus on UX.',
    skills: 'React, Node.js, TypeScript'
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const loadingMessages = [
    "Allocating serverless nodes...",
    "Establishing encrypted tunnel...",
    "Syncing global threat database...",
    "Booting neural pattern recognition...",
    "Finalizing WebGL shaders...",
    "Initializing Command & Control interface..."
  ];

  useEffect(() => {
    let interval: any;
    let progressInterval: any;
    let logInterval: any;

    if (demoState === 'loading') {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 500);

      progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + 2));
      }, 60);
      
      const timeout = setTimeout(() => {
        setDemoState('active');
      }, 3000);
      
      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
        clearTimeout(timeout);
      };
    } else if (demoState === 'active') {
       logInterval = setInterval(() => {
         const newLog = {
           id: Date.now(),
           type: Math.random() > 0.8 ? 'CRITICAL' : 'INFO',
           origin: `103.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.1`,
           status: 'Monitored'
         };
         setThreatLogs(prev => [newLog, ...prev.slice(0, 5)]);
       }, 2000);
       return () => clearInterval(logInterval);
    } else {
      setLoadingStep(0);
      setProgress(0);
    }
  }, [demoState]);

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
          systemInstruction: "You are an expert tech recruiter and resume writer. Return only the new summary and then 'SKILLS:' followed by the new list.",
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
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!project) return <div className="text-center py-20 font-black uppercase tracking-widest text-zinc-600">404: Instance Not Found</div>;

  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('sending');
    setTimeout(() => {
      setInquiryStatus('sent');
      setTimeout(() => {
        setIsCollabModalOpen(false);
        setInquiryStatus('idle');
      }, 2000);
    }, 1500);
  };

  const handlePaymentSubmit = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setCheckoutStep('method');
      }, 3000);
    }, 2500);
  };

  const renderProjectDemo = () => {
    switch (project.id) {
      case '1': 
        return (
          <div className="w-full h-full relative overflow-hidden bg-[#020617] text-cyan-400 font-mono flex">
            {/* Sidebar Controls */}
            <div className="w-64 border-r border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-600 mb-4">Defense Protocols</h4>
                <div className="space-y-3">
                  {['Shield-X', 'DeepPacket-Scan', 'Neural-Wall', 'Ghost-IP'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setActiveProtocols(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${activeProtocols.includes(p) ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-transparent border-white/5 text-zinc-600 hover:border-cyan-500/30'}`}
                    >
                      {p} {activeProtocols.includes(p) ? '[ACTIVE]' : '[OFF]'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <p className="text-[9px] font-black uppercase text-red-500 mb-1 animate-pulse">Alert Level: High</p>
                  <p className="text-[8px] text-zinc-500">Anomaly detected in Asia-Pacific sector.</p>
                </div>
              </div>
            </div>

            {/* Main Visualizer */}
            <div className="flex-1 relative flex items-center justify-center">
              {/* Globe Simulation */}
              <div className="relative w-80 h-80 rounded-full border-2 border-cyan-500/20 shadow-[0_0_100px_rgba(34,211,238,0.1)] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                 <div className="absolute inset-4 rounded-full border border-cyan-500/10 border-dashed"></div>
                 <div className="absolute inset-10 rounded-full border-2 border-cyan-500/30"></div>
                 <div className="text-center animate-[spin_20s_linear_infinite_reverse]">
                   <p className="text-4xl font-black">KRYPTON</p>
                   <p className="text-[8px] uppercase tracking-[0.5em] text-cyan-600">Core Engine</p>
                 </div>
                 {/* Floating Points */}
                 {[0, 60, 120, 180, 240, 300].map(deg => (
                   <div 
                    key={deg} 
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                    style={{ 
                      transform: `rotate(${deg}deg) translate(160px) rotate(-${deg}deg)` 
                    }}
                   ></div>
                 ))}
              </div>

              {/* HUD Overlays */}
              <div className="absolute top-10 left-10 p-6 border border-cyan-500/10 rounded-3xl bg-black/20 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600 mb-2">Network Load</p>
                <div className="flex items-end gap-1 h-12">
                   {[40, 60, 30, 90, 70, 50, 80, 45, 60, 75].map((h, i) => (
                     <div key={i} className="w-1 bg-cyan-500/50 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                   ))}
                </div>
              </div>

              {/* Live Threat Feed */}
              <div className="absolute bottom-10 right-10 w-80 p-6 border border-cyan-500/10 rounded-3xl bg-black/60 backdrop-blur-xl animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-6">
                   <h5 className="text-[10px] font-black uppercase tracking-widest">Live Threat Feed</h5>
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                </div>
                <div className="space-y-3">
                  {threatLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center text-[9px] font-bold border-b border-white/5 pb-2 last:border-0">
                       <span className={log.type === 'CRITICAL' ? 'text-red-500' : 'text-cyan-400'}>{log.type}</span>
                       <span className="text-zinc-500">{log.origin}</span>
                       <span className="text-zinc-400 uppercase">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%),linear-gradient(to_right,_#22d3ee_1px,_transparent_1px),linear-gradient(to_bottom,_#22d3ee_1px,_transparent_1px)] bg-[size:100%_100%,40px_40px,40px_40px]"></div>
          </div>
        );
      case '7': 
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/2 border-r border-zinc-800 p-8 flex flex-col gap-6 overflow-y-auto">
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-500">Nova Editor</h4>
              <button onClick={handleAiResumeOptimize} disabled={isOptimizing} className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                {isOptimizing ? 'Optimizing...' : '⚡ AI Polish'}
              </button>
              <div className="space-y-4">
                <input type="text" value={resumeData.name} onChange={(e) => setResumeData({...resumeData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-white outline-none" />
                <textarea value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-white outline-none h-32" />
              </div>
            </div>
            <div className="flex-1 bg-white text-zinc-900 p-8 overflow-y-auto">
               <div className="bg-white p-10 min-h-full rounded-[2rem] shadow-2xl flex flex-col gap-6">
                  <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-1">{resumeData.name}</h2>
                  <p className="text-purple-600 font-bold uppercase text-xs tracking-widest">{resumeData.role}</p>
                  <p className="text-xs leading-relaxed text-zinc-700 font-medium italic">"{resumeData.summary}"</p>
               </div>
            </div>
          </div>
        );
      case '2': 
        return (
          <div className="w-full h-full relative overflow-hidden bg-black flex">
            <div className="flex-1 relative">
              <img src={project.image} className="w-full h-full object-cover" style={{ filter: `hue-rotate(${glitchValue * 2}deg)` }} />
            </div>
            <div className="w-72 bg-zinc-900 border-l border-zinc-800 p-8">
              <input type="range" className="w-full accent-purple-500" value={glitchValue} onChange={(e) => setGlitchValue(parseInt(e.target.value))} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const toggleAiSummary = async () => {
    if (aiSummary) { setAiSummary(null); return; }
    setIsAiSimplifying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain this project simply: ${project.title}. ${project.fullDescription}`,
      });
      setAiSummary(response.text || "Summary failed.");
    } catch (error) { setAiSummary("System error."); } finally { setIsAiSimplifying(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 p-12 rounded-[4rem] shadow-2xl animate-in zoom-in-95">
            {checkoutStep === 'method' ? (
              <>
                <div className="text-center mb-10">
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-4">{t('secureCheckout')}</span>
                  <h2 className="text-4xl font-black tracking-tighter uppercase">{t('paymentMethod')}</h2>
                  <p className="text-zinc-500 text-sm mt-2">Licensing {project.title} for {formatPrice(project.price)}</p>
                </div>
                
                <div className="space-y-4 mb-10">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">💳</div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase text-white">Credit / Debit Card</p>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === 'upi' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">⚡</div>
                      <div className="text-left">
                        <p className="text-sm font-black uppercase text-white">Instant UPI</p>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">GPay, PhonePe, Paytm</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="space-y-6">
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                      <input type="text" placeholder={t('cardNumber')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder={t('expiryDate')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:border-purple-500 outline-none" />
                        <input type="password" placeholder="CVV" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:border-purple-500 outline-none" />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="animate-in fade-in slide-in-from-top-4">
                      <input type="text" placeholder={t('upiId')} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm focus:border-purple-500 outline-none" />
                    </div>
                  )}
                  
                  <button 
                    onClick={handlePaymentSubmit}
                    className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-5 rounded-[2rem] text-xs uppercase tracking-widest shadow-2xl shadow-purple-500/20 active:scale-95 transition-all"
                  >
                    {t('payNow')}
                  </button>
                </div>
              </>
            ) : checkoutStep === 'processing' ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-black uppercase tracking-widest">Validating Transaction</h2>
                <p className="text-zinc-500 mt-2">Communicating with banking node...</p>
              </div>
            ) : (
              <div className="text-center py-20 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-black rounded-full flex items-center justify-center text-4xl mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">✓</div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Instance Acquired</h2>
                <p className="text-zinc-500 mt-4 leading-relaxed max-w-[280px]">License key synced to your vault. Redirecting to deployment docs...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Sandbox Modal */}
      {demoState !== 'idle' && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4 md:p-12">
          <div className="relative w-full h-full bg-zinc-950 border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between px-10 py-6 border-b border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                </div>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">{project.title} | Live Sandbox</h3>
              </div>
              <button onClick={() => setDemoState('idle')} className="text-zinc-600 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Terminate Instance</button>
            </div>
            <div className="flex-1 bg-black relative">
              {demoState === 'loading' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50">
                   <div className="w-full max-w-sm px-12 text-center">
                      <div className="mb-12">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                           <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-2">Virtualizing Command Center</h4>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest h-4">{loadingMessages[loadingStep]}</p>
                      </div>
                      
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-4 border border-zinc-800">
                        <div 
                          className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-700">
                         <span>Status: Syncing Nodes</span>
                         <span>{progress}%</span>
                      </div>
                   </div>
                </div>
              ) : renderProjectDemo()}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-purple-500 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] mb-12 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        Return
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[3.5rem] overflow-hidden">
            <img src={project.image} className="w-full aspect-video object-cover" alt="" />
            <div className="p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">{project.title}</h1>
                  <p className="text-purple-500 font-black text-xl hover:text-purple-400 cursor-pointer">{project.authorName}</p>
                </div>
                <button onClick={toggleAiSummary} className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {isAiSimplifying ? 'Parsing...' : aiSummary ? 'Docs' : 'AI Analysis'}
                </button>
              </div>
              {aiSummary && <div className="mb-16 p-10 bg-purple-500/5 border border-purple-500/20 rounded-[2.5rem] italic text-zinc-300 leading-relaxed font-medium">"{aiSummary}"</div>}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-6">{t('executiveSummary')}</h2>
                <p className="text-zinc-400 text-xl leading-relaxed mb-16">{project.fullDescription}</p>
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-10">{t('stackInfra')}</h2>
                <div className="flex flex-wrap gap-4">
                  {project.techStack.map(tech => <span key={tech} className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl text-zinc-400 font-black text-sm">{tech}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="bg-zinc-950 border border-purple-500/20 p-10 rounded-[3.5rem] shadow-2xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">{t('instanceLicense')}</p>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-10">{formatPrice(project.price)}</h2>
              <div className="space-y-4">
                <button onClick={() => setDemoState('loading')} className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-6 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20">{t('tryDemo')}</button>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-6 rounded-[1.5rem] text-xs uppercase tracking-widest border border-zinc-800">{t('buyNow')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
