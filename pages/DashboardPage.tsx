
import React, { useState, useRef } from 'react';
import { useAuth, useLocalization } from '../App';
import { MOCK_PROJECTS } from '../constants';

const DashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t, formatPrice } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isApplausesOpen, setIsApplausesOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  
  // Profile Update State
  const [githubUrl, setGithubUrl] = useState(user?.github || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [githubError, setGithubError] = useState('');

  // Project Deployment State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    price: '0',
    isPaid: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDeploying, setIsDeploying] = useState(false);

  const publishedUnitsCount = 32; 
  const myProjects = MOCK_PROJECTS.slice(0, 2);

  const MOCK_APPLAUSES = [
    { id: 1, user: 'Sarah Chen', project: 'Aether OS', time: '2m ago', avatar: 'https://i.pravatar.cc/150?u=dev2' },
    { id: 2, user: 'Marcus Volt', project: 'Aether OS', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=dev3' },
    { id: 3, user: 'TechLead_01', project: 'NovaCV AI', time: '4h ago', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 4, user: 'Elena_Dev', project: 'Aether OS', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=5' },
  ];

  const MOCK_PAYMENTS = [
    { id: 'TX-9021', project: 'Aether OS', type: 'Enterprise License', amount: 149, date: 'Oct 24, 2025', status: 'Settled' },
    { id: 'TX-8842', project: 'Sentinel Ledger', type: 'Standard Unit', amount: 299, date: 'Oct 22, 2025', status: 'Settled' },
    { id: 'TX-8710', project: 'Aether OS', type: 'Standard Unit', amount: 149, date: 'Oct 15, 2025', status: 'Settled' },
    { id: 'TX-8601', project: 'Aether OS', type: 'Custom Bundle', amount: 500, date: 'Oct 02, 2025', status: 'Settled' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProjectImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateGithub = (url: string) => {
    if (!url) return true; 
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
    if (!githubRegex.test(url) && !url.startsWith('github.com/')) {
      setGithubError('Invalid GitHub profile pattern');
      return false;
    }
    setGithubError('');
    return true;
  };

  const handleUpdateGithub = () => {
    if (!validateGithub(githubUrl)) return;
    setSaveStatus('saving');
    setTimeout(() => {
      updateUser({ github: githubUrl });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const validateProjectForm = () => {
    const errors: Record<string, string> = {};
    if (newProject.title.length < 3) errors.title = 'Title must be at least 3 characters';
    if (newProject.description.length < 20) errors.description = 'Description needs more technical detail (min 20 chars)';
    if (!newProject.techStack) errors.techStack = 'At least one technology is required';
    if (newProject.isPaid && parseFloat(newProject.price) <= 0) errors.price = 'Paid units require a positive value';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProjectForm()) return;
    
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsModalOpen(false);
      setProjectImage(null);
      setNewProject({ title: '', description: '', techStack: '', price: '0', isPaid: false });
    }, 2000);
  };

  const REWARDS = [
    { units: 5, reward: 'Bronze Badge', type: 'Community Perk', unlocked: publishedUnitsCount >= 5 },
    { units: 15, reward: '15% Fee Waiver', type: 'Platform Coupon', unlocked: publishedUnitsCount >= 15 },
    { units: 30, reward: '$100 BuildSpace Credit', type: 'Cash Voucher', code: 'BUILD30_ALPHA', unlocked: publishedUnitsCount >= 30 },
    { units: 50, reward: 'Exclusive Merch Kit', type: 'Physical Reward', unlocked: publishedUnitsCount >= 50 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Applauses History Modal */}
      {isApplausesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsApplausesOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
              <span className="text-purple-500">👏</span> Interactions
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {MOCK_APPLAUSES.map(applauset => (
                <div key={applauset.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={applauset.avatar} className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <p className="text-sm font-bold text-white">{applauset.user}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Applauded {applauset.project}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">{applauset.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsApplausesOpen(false)} className="w-full mt-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest border border-zinc-800 transition-all">Dismiss</button>
          </div>
        </div>
      )}

      {/* Revenue History Modal */}
      {isPaymentsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsPaymentsOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Financial Ledger</h2>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Oct 2025 Statement</p>
                <p className="text-purple-400 font-bold text-xl">{formatPrice(2840)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    <th className="pb-4 font-black">Asset Repository</th>
                    <th className="pb-4 font-black">License Type</th>
                    <th className="pb-4 font-black">Date</th>
                    <th className="pb-4 font-black">Value</th>
                    <th className="pb-4 font-black text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {MOCK_PAYMENTS.map(tx => (
                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-5">
                        <p className="text-sm font-bold text-white uppercase">{tx.project}</p>
                        <p className="text-[9px] text-zinc-600 font-mono">{tx.id}</p>
                      </td>
                      <td className="py-5 text-xs text-zinc-400 font-medium">{tx.type}</td>
                      <td className="py-5 text-xs text-zinc-400 font-medium">{tx.date}</td>
                      <td className="py-5 text-sm font-black text-white">{formatPrice(tx.amount)}</td>
                      <td className="py-5 text-right">
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-lg tracking-widest">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setIsPaymentsOpen(false)} className="w-full mt-12 py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest border border-zinc-800 transition-all">Close Statement</button>
          </div>
        </div>
      )}

      {/* Deploy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-500 my-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Deploy Build</h2>
            <p className="text-zinc-500 text-sm mb-10 font-medium">Initialize your project for global distribution.</p>
            
            <form onSubmit={handleDeploy} className="space-y-8">
              {/* Image Upload Field */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Repository Cover (Optional)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/40 hover:bg-zinc-800/50 transition-all overflow-hidden relative group"
                >
                  {projectImage ? (
                    <>
                      <img src={projectImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Asset</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-3 text-2xl">🖼️</div>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Click to provision image</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Project Identity (Title)</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className={`w-full bg-zinc-900 border ${formErrors.title ? 'border-red-500/40' : 'border-zinc-800'} rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none transition-all`} 
                  placeholder="e.g. Quantum Dashboard"
                />
                {formErrors.title && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Architectural Summary</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className={`w-full bg-zinc-900 border ${formErrors.description ? 'border-red-500/40' : 'border-zinc-800'} rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none h-32 resize-none transition-all`} 
                  placeholder="Describe the problem, solution, and high-level architecture..."
                />
                {formErrors.description && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Stack (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({...newProject, techStack: e.target.value})}
                    className={`w-full bg-zinc-900 border ${formErrors.techStack ? 'border-red-500/40' : 'border-zinc-800'} rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none transition-all`} 
                    placeholder="React, Rust, AWS..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Licensing Model</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNewProject({...newProject, isPaid: false})}
                      className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!newProject.isPaid ? 'bg-purple-500 text-black border-purple-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                    >
                      MIT / Open
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNewProject({...newProject, isPaid: true})}
                      className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newProject.isPaid ? 'bg-purple-500 text-black border-purple-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                    >
                      Paid Asset
                    </button>
                  </div>
                </div>
              </div>

              {newProject.isPaid && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Unit Price (USD)</label>
                  <input 
                    type="number" 
                    value={newProject.price}
                    onChange={(e) => setNewProject({...newProject, price: e.target.value})}
                    className={`w-full bg-zinc-900 border ${formErrors.price ? 'border-red-500/40' : 'border-zinc-800'} rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none transition-all`} 
                  />
                  {formErrors.price && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">{formErrors.price}</p>}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isDeploying}
                className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-5 rounded-[2rem] transition-all uppercase text-xs tracking-[0.3em] active:scale-95 shadow-2xl shadow-purple-500/20 disabled:opacity-50"
              >
                {isDeploying ? 'Syncing Node...' : 'Finalize & Deploy'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">Developer Portal</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">{t('dashboard')}</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-400 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-purple-500/10 uppercase tracking-widest text-xs"
        >
          Deploy New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <button 
          className="text-left group bg-zinc-900/40 border border-zinc-800 p-10 rounded-[2rem] hover:border-purple-500/60 hover:bg-purple-500/[0.02] transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="text-2xl">🚀</span>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">{t('publishedUnits')}</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-black tracking-tight">{publishedUnitsCount}</p>
          </div>
        </button>

        <button 
          onClick={() => setIsApplausesOpen(true)}
          className="text-left group bg-zinc-900/40 border border-zinc-800 p-10 rounded-[2rem] hover:border-purple-500/30 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-2xl">👏</span>
            <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View History</span>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Applauses</p>
          <p className="text-4xl font-black tracking-tight">1,248</p>
        </button>

        <button 
          onClick={() => setIsPaymentsOpen(true)}
          className="text-left group bg-zinc-900/40 border border-zinc-800 p-10 rounded-[2rem] hover:border-purple-500/30 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-2xl">💰</span>
            <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View History</span>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('revenue')}</p>
          <p className="text-4xl font-black tracking-tight">{formatPrice(2840)}</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <div className="px-10 py-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h2 className="text-xl font-bold tracking-tight">Active Repositories</h2>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {myProjects.map(project => (
              <div key={project.id} className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-purple-500/[0.02] transition-colors group">
                <div className="flex items-center gap-8 mb-4 md:mb-0">
                  <img src={project.image} alt="" className="w-24 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">{project.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <div className="text-right hidden sm:block">
                    <p className="font-black text-xl text-white">{project.views}</p>
                    <p className="text-zinc-600 text-[9px] uppercase font-black tracking-widest">Total Hits</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[2.5rem] flex flex-col">
          <h2 className="text-xl font-bold tracking-tight mb-8">Account Config</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">GitHub Sync</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    if (githubError) setGithubError('');
                  }}
                  onBlur={() => validateGithub(githubUrl)}
                  className={`w-full bg-zinc-950 border ${githubError ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-all placeholder:text-zinc-800`}
                  placeholder="github.com/username"
                />
                {githubError && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2">{githubError}</p>}
              </div>
            </div>
            <button 
              onClick={handleUpdateGithub}
              disabled={saveStatus === 'saving'}
              className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${saveStatus === 'saved' ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
              {saveStatus === 'saving' ? 'Verifying...' : saveStatus === 'saved' ? 'Identity Updated' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
