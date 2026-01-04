
import React, { useState } from 'react';
import { useAuth } from '../App';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSocialLoading, setIsSocialLoading] = useState<'github' | 'google' | null>(null);
  const { login } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(email, 'email');
    }
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    setIsSocialLoading(provider);
    // Simulate OAuth delay
    setTimeout(() => {
      login('', provider);
      setIsSocialLoading(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] relative z-10 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.3em]">Secure Gateway</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">BUILD<span className="text-purple-500">SPACE</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Join the high-impact engineering community.</p>
        </div>

        <div className="space-y-4 mb-10">
          <button 
            onClick={() => handleSocialLogin('github')}
            disabled={!!isSocialLoading}
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-zinc-100 text-black font-black py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-white/5 relative overflow-hidden disabled:opacity-50"
          >
            {isSocialLoading === 'github' ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest">Continue with GitHub</span>
              </>
            )}
          </button>

          <button 
            onClick={() => handleSocialLogin('google')}
            disabled={!!isSocialLoading}
            className="w-full flex items-center justify-center gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-black py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl disabled:opacity-50"
          >
            {isSocialLoading === 'google' ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs uppercase tracking-widest">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-zinc-800 flex-1"></div>
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">OR</span>
          <div className="h-px bg-zinc-800 flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Email Identity</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full bg-black/50 border ${errors.email ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-800 font-medium`}
              placeholder="architect@buildspace.com"
            />
            {errors.email && (
              <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 ml-1 animate-in slide-in-from-left-2">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Password Hash</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className={`w-full bg-black/50 border ${errors.password ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-800 font-medium`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 ml-1 animate-in slide-in-from-left-2">{errors.password}</p>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-5 px-6 rounded-2xl transition-all duration-300 transform active:scale-95 uppercase text-xs tracking-[0.2em] shadow-[0_15px_30px_rgba(168,85,247,0.2)]"
          >
            Initialize Session
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest leading-relaxed">
            By authenticating, you agree to the <br/>
            <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors">Architect Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
