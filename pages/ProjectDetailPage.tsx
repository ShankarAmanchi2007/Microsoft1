
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { useLocalization } from '../App';
import { TrustAudit } from '../types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatPrice } = useLocalization();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  
  // AI States
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [explainerStep, setExplainerStep] = useState(0);

  // Trust Engine States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<TrustAudit | null>(project?.audit || null);
  const [auditProgress, setAuditProgress] = useState(0);

  // General UI States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'method' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);

  const auditMessages = [
    "Analyzing dependency graph...",
    "Scanning for sensitive leaks...",
    "Validating documentation clarity...",
    "Simulating production deployment...",
    "Checking ethical compliance...",
    "Calculating final Trust Index..."
  ];

  const explainerLoadingMessages = [
    "Reading technical docs...",
    "Translating complex jargon...",
    "Crafting a friendly analogy...",
    "Polishing the explanation..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAuditing) {
      interval = setInterval(() => {
        setAuditProgress(prev => (prev < auditMessages.length - 1 ? prev + 1 : prev));
      }, 700);
    } else {
      setAuditProgress(0);
    }
    return () => clearInterval(interval);
  }, [isAuditing]);

  useEffect(() => {
    let interval: any;
    if (isAiSimplifying) {
      interval = setInterval(() => {
        setExplainerStep(prev => (prev < explainerLoadingMessages.length - 1 ? prev + 1 : prev));
      }, 800);
    } else {
      setExplainerStep(0);
    }
    return () => clearInterval(interval);
  }, [isAiSimplifying]);

  if (!project) return <div className="text-center py-20 font-black uppercase tracking-widest text-zinc-600">404: Instance Not Found</div>;

  const performTrustAudit = async () => {
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate this project for engineering quality and trust. 
        Title: ${project.title}. 
        Stack: ${project.techStack.join(', ')}. 
        Description: ${project.fullDescription}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: 'Overall trust score 0-100' },
              level: { type: Type.STRING, description: 'High, Medium, or Low based on score' },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  maintainability: { type: Type.INTEGER },
                  security: { type: Type.INTEGER },
                  documentation: { type: Type.INTEGER },
                  relevance: { type: Type.INTEGER },
                  readiness: { type: Type.INTEGER },
                  ethics: { type: Type.INTEGER }
                }
              },
              reasoning: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'level', 'breakdown', 'reasoning', 'recommendations', 'redFlags']
          },
          systemInstruction: "You are a senior Lead Engineer and Security Auditor. Be critical but fair. Provide precise JSON output based on the provided technical data."
        }
      });
      
      const parsed = JSON.parse(response.text || '{}');
      setAuditResult({
        ...parsed,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Audit Error:", error);
    } finally {
      setIsAuditing(false);
    }
  };

  const fetchSimpleExplanation = async () => {
    if (aiSummary) { setAiSummary(null); return; }
    setIsAiSimplifying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain simply: ${project.title}. Description: ${project.fullDescription}.`,
        config: {
          systemInstruction: "You are a patient and kind technology mentor. Explain in 3 friendly sentences with an analogy."
        }
      });
      setAiSummary(response.text || "I'm having a moment to think. Let's try again!");
    } catch (error) {
      console.error("Mentor Error:", error);
      setAiSummary("My connection to the teaching hub was interrupted.");
    } finally {
      setIsAiSimplifying(false);
    }
  };

  const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
        <span className="text-zinc-500">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Checkout Logic and UI (Assuming existence or adding as per request) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 p-12 rounded-[4rem] shadow-2xl animate-in zoom-in-95">
            {checkoutStep === 'method' ? (
              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">{t('paymentMethod')}</h2>
                <div className="space-y-4 mb-8">
                  <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800'}`}>Card Payment</button>
                  <button onClick={() => setPaymentMethod('upi')} className={`w-full p-6 rounded-2xl border transition-all ${paymentMethod === 'upi' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800'}`}>UPI Instant</button>
                </div>
                <button onClick={() => { setCheckoutStep('processing'); setTimeout(() => setCheckoutStep('success'), 2000); }} className="w-full bg-purple-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">Authorize Payment</button>
              </div>
            ) : checkoutStep === 'processing' ? (
              <div className="text-center py-10"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><h2 className="text-xl font-black uppercase">Validating Hash</h2></div>
            ) : (
              <div className="text-center py-10"><div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div><h2 className="text-xl font-black uppercase tracking-tighter">Instance Acquired</h2></div>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-purple-500 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] mb-12 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        Back to Archive
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Visual and Content */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-[3.5rem] overflow-hidden">
            <img src={project.image} className="w-full aspect-video object-cover" alt="" />
            <div className="p-12">
              <div className="mb-12">
                <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">{project.title}</h1>
                <p className="text-purple-500 font-black text-xl">{project.authorName}</p>
              </div>

              {/* NEURAL TRUST ENGINE DASHBOARD */}
              <div className="mb-16 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-[3rem] blur-xl"></div>
                <div className="relative bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Visual Gauge */}
                    <div className="shrink-0 mx-auto md:mx-0 relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="80" fill="none" stroke="rgba(24, 24, 27, 0.8)" strokeWidth="12" />
                        <circle 
                          cx="88" cy="88" r="80" fill="none" 
                          stroke={auditResult ? (auditResult.score > 70 ? '#10b981' : auditResult.score > 40 ? '#f59e0b' : '#ef4444') : '#3f3f46'} 
                          strokeWidth="12" 
                          strokeDasharray="502.4"
                          strokeDashoffset={502.4 - (502.4 * (auditResult?.score || 0) / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black tracking-tighter">{auditResult?.score || '--'}</span>
                        <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em]">Trust Index</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-8 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Neural Trust Engine</h3>
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Autonomous Architectural Audit v2.0</p>
                        </div>
                        {!auditResult && !isAuditing && (
                          <button 
                            onClick={performTrustAudit}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                          >
                            Initialize Audit
                          </button>
                        )}
                        {auditResult && !isAuditing && (
                          <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${
                            auditResult.level === 'High' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                            auditResult.level === 'Medium' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                            'bg-red-500/10 border-red-500/40 text-red-400'
                          }`}>
                            {auditResult.level} Integrity Tier
                          </div>
                        )}
                      </div>

                      {isAuditing ? (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">
                              {auditMessages[auditProgress]}
                            </span>
                            <span className="text-xs text-zinc-700 font-mono">{(auditProgress + 1) * 16}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(auditProgress + 1) * 16}%` }}></div>
                          </div>
                        </div>
                      ) : auditResult ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-700">
                          <ScoreBar label="Security" value={auditResult.breakdown.security} color="#ef4444" />
                          <ScoreBar label="Maintainability" value={auditResult.breakdown.maintainability} color="#8b5cf6" />
                          <ScoreBar label="Documentation" value={auditResult.breakdown.documentation} color="#3b82f6" />
                          <ScoreBar label="Readiness" value={auditResult.breakdown.readiness} color="#10b981" />
                          <ScoreBar label="Tech Relevance" value={auditResult.breakdown.relevance} color="#ec4899" />
                          <ScoreBar label="AI Ethics" value={auditResult.breakdown.ethics} color="#f59e0b" />
                        </div>
                      ) : (
                        <p className="text-zinc-600 text-sm font-medium italic">
                          "Project awaiting quality verification. Run the Neural Audit to generate detailed trust benchmarks."
                        </p>
                      )}
                    </div>
                  </div>

                  {auditResult && !isAuditing && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-zinc-800 animate-in fade-in zoom-in-95 duration-1000">
                      <div>
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Red Flags & Risks</h4>
                        <div className="space-y-3">
                          {auditResult.redFlags.length > 0 ? auditResult.redFlags.map((flag, i) => (
                            <div key={i} className="flex gap-3 text-red-400 items-start">
                              <span className="text-sm shrink-0">⚠️</span>
                              <p className="text-[11px] font-bold tracking-tight leading-relaxed">{flag}</p>
                            </div>
                          )) : (
                            <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">No Critical Risks Identified</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Improvement Roadmap</h4>
                        <ul className="space-y-3">
                          {auditResult.recommendations.map((rec, i) => (
                            <li key={i} className="text-zinc-400 text-[11px] font-medium leading-relaxed list-disc ml-4">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Content and Mentor Section */}
              <div className="mb-16 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-teal-500/20 rounded-[3rem] blur-lg opacity-70"></div>
                <div className="relative bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-[3rem] backdrop-blur-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shrink-0 animate-bounce-slow">💡</div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">Project Mentor</h3>
                      <p className="text-zinc-500 text-sm mb-6">Need a simpler explanation? Our mentor breaks down complex architecture into easy stories.</p>
                      {!aiSummary && !isAiSimplifying && (
                        <button onClick={fetchSimpleExplanation} className="bg-amber-500 text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Simplify for Me</button>
                      )}
                      {isAiSimplifying && <span className="text-[10px] font-black uppercase text-amber-500 animate-pulse">{explainerLoadingMessages[explainerStep]}</span>}
                    </div>
                  </div>
                  {aiSummary && <p className="mt-8 p-6 bg-zinc-950/50 rounded-2xl text-zinc-300 italic text-lg border-l-4 border-amber-500">"{aiSummary}"</p>}
                </div>
              </div>

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
                <button onClick={() => setDemoState('loading')} className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-6 rounded-2xl uppercase tracking-widest shadow-xl shadow-purple-500/20">{demoState === 'loading' ? 'Initializing...' : t('tryDemo')}</button>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-zinc-900 text-white font-black py-6 rounded-2xl uppercase tracking-widest border border-zinc-800">{t('buyNow')}</button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3.5rem]">
              <div className="space-y-8">
                <div>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Architecture Views</p>
                  <p className="text-3xl font-black text-white">{project.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                  <p className="text-emerald-500 text-xl font-black uppercase tracking-tighter">Production Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailPage;
