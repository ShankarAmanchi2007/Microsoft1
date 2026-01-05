
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { useLocalization } from '../App';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatPrice } = useLocalization();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  
  // AI Simplification States
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [explainerStep, setExplainerStep] = useState(0);

  // General UI States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'method' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Allocating serverless nodes...",
    "Establishing encrypted tunnel...",
    "Syncing global threat database...",
    "Booting neural pattern recognition...",
    "Finalizing WebGL shaders...",
    "Initializing Command & Control interface..."
  ];

  const explainerLoadingMessages = [
    "Reading technical docs...",
    "Translating complex jargon...",
    "Crafting a friendly analogy...",
    "Polishing the explanation..."
  ];

  useEffect(() => {
    let interval: any;
    if (demoState === 'loading') {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 500);
      const timeout = setTimeout(() => setDemoState('active'), 3000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setLoadingStep(0);
    }
  }, [demoState]);

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

  const fetchSimpleExplanation = async () => {
    if (aiSummary) { setAiSummary(null); return; }
    setIsAiSimplifying(true);
    try {
      // Create a fresh instance for the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want you to explain this technical project to someone who is NOT a programmer.
        Project Name: ${project.title}. 
        Technical Description: ${project.fullDescription}.
        
        Requirements:
        1. Use a very friendly, encouraging, and educational tone.
        2. Use a simple analogy if possible.
        3. Explain what it actually DOES for a user, not how it works internally.
        4. Keep it to 3 clear sentences.`,
        config: {
          systemInstruction: "You are a patient and kind technology mentor. Your goal is to make everyone feel smart and capable of understanding complex tools."
        }
      });
      setAiSummary(response.text || "I'm having a moment to think. Let's try again!");
    } catch (error) {
      console.error("Mentor Error:", error);
      setAiSummary("My connection to the teaching hub was interrupted. Please try again later!");
    } finally {
      setIsAiSimplifying(false);
    }
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
                  <button onClick={() => setPaymentMethod('card')} className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">💳</div>
                      <div className="text-left"><p className="text-sm font-black uppercase text-white">Credit / Debit Card</p></div>
                    </div>
                  </button>
                  <button onClick={() => setPaymentMethod('upi')} className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === 'upi' ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900 border-zinc-800 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">⚡</div>
                      <div className="text-left"><p className="text-sm font-black uppercase text-white">Instant UPI</p></div>
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
                  <button onClick={handlePaymentSubmit} className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-5 rounded-[2rem] text-xs uppercase tracking-widest shadow-2xl shadow-purple-500/20 active:scale-95 transition-all">
                    {t('payNow')}
                  </button>
                </div>
              </>
            ) : checkoutStep === 'processing' ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-black uppercase tracking-widest">Validating Transaction</h2>
              </div>
            ) : (
              <div className="text-center py-20 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-black rounded-full flex items-center justify-center text-4xl mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">✓</div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Instance Acquired</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-purple-500 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] mb-12 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        Return
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[3.5rem] overflow-hidden">
            <img src={project.image} className="w-full aspect-video object-cover" alt="" />
            <div className="p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">{project.title}</h1>
                  <p className="text-purple-500 font-black text-xl hover:text-purple-400 cursor-pointer">{project.authorName}</p>
                </div>
              </div>

              {/* AI PROJECT MENTOR SECTION */}
              <div className="mb-16 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-teal-500/20 rounded-[3rem] blur-lg opacity-70"></div>
                <div className="relative bg-zinc-900/60 border border-zinc-800/80 p-8 md:p-12 rounded-[3rem] backdrop-blur-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shrink-0 animate-bounce-slow">
                      💡
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <h3 className="text-white font-black text-2xl tracking-tight uppercase">Project Mentor</h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-emerald-500/20">Verified AI Insight</span>
                      </div>
                      <p className="text-zinc-400 text-base font-medium mb-8 leading-relaxed">
                        Technology is for everyone. Let our AI mentor translate the technical details into a simple, friendly story just for you.
                      </p>
                      
                      {!aiSummary && !isAiSimplifying && (
                        <button 
                          onClick={fetchSimpleExplanation}
                          className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-4.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 flex items-center gap-3 mx-auto md:mx-0 group"
                        >
                          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 10-2 0c0-1.103-.897-2-2-2h-1.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L12.414 10H14c2.206 0 4 1.794 4 4v1a1 1 0 102 0v-1c0-2.206-1.794-4-4-4z"/></svg>
                          Explain in Simple Terms
                        </button>
                      )}

                      {isAiSimplifying && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-amber-400 justify-center md:justify-start">
                            <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                              {explainerLoadingMessages[explainerStep]}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 transition-all duration-500 ease-out" 
                              style={{ width: `${(explainerStep + 1) * 25}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {aiSummary && (
                    <div className="mt-12 pt-10 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-8 duration-1000">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] bg-amber-500/10 px-5 py-2 rounded-full border border-amber-500/20">The Friendly Version</span>
                        <button 
                          onClick={() => setAiSummary(null)} 
                          className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors ml-auto flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Refresh
                        </button>
                      </div>
                      <div className="bg-zinc-950/40 p-10 rounded-[2.5rem] border border-zinc-800/50 relative">
                        <div className="absolute -top-4 -left-4 text-6xl text-amber-500/20 font-serif">“</div>
                        <p className="text-zinc-100 text-xl md:text-2xl leading-relaxed font-medium italic relative z-10">
                          {aiSummary}
                        </p>
                        <div className="absolute -bottom-10 -right-4 text-6xl text-amber-500/20 font-serif">”</div>
                      </div>
                    </div>
                  )}
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

        {/* Sidebar Licensing & Pricing */}
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="bg-zinc-950 border border-purple-500/20 p-10 rounded-[3.5rem] shadow-2xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">{t('instanceLicense')}</p>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-10">{formatPrice(project.price)}</h2>
              <div className="space-y-4">
                <button onClick={() => setDemoState('loading')} className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-6 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20">
                  {demoState === 'loading' ? 'Initializing...' : t('tryDemo')}
                </button>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-6 rounded-[1.5rem] text-xs uppercase tracking-widest border border-zinc-800">{t('buyNow')}</button>
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
