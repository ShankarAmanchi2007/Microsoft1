
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from './types';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';

// --- Localization Types & Data ---
export type CountryCode = 'US' | 'IN' | 'FR' | 'JP';

export interface LocaleData {
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number;
  translations: Record<string, string>;
}

export const LOCALES: Record<CountryCode, LocaleData> = {
  US: {
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    rate: 1,
    translations: {
      explore: 'Explore',
      dashboard: 'Dashboard',
      tryDemo: 'Try Demo',
      viewDetails: 'View Details',
      buyNow: 'Buy Now',
      publishedUnits: 'Published Units',
      revenue: 'Net Revenue',
      login: 'Login',
      logout: 'Logout',
      heroTitle: 'BUILD FEED',
      heroSubtitle: 'The interactive gallery where high-impact engineers showcase architectures and secure licensing.',
      searchPlaceholder: 'Search builds, repos, and engineers...',
      noResults: 'No Results Identified',
      resetFilters: 'Reset Search Filters',
      engagementType: 'Engagement Type',
      budgetBracket: 'Budget Bracket',
      missionStatement: 'The Mission Statement',
      requestCollab: 'Request Collaboration',
      talentAcquisition: 'Talent Acquisition',
      instanceLicense: 'Instance License',
      executiveSummary: 'Executive Summary',
      stackInfra: 'Stack Infrastructure',
      applauses: 'Applauses',
      financialLedger: 'Financial Ledger',
      activeRepos: 'Active Repositories',
      trendingNow: 'Trending Now',
      regenerate: 'Regenerate',
      paymentMethod: 'Payment Method',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      upiId: 'UPI ID',
      payNow: 'Pay Now',
      secureCheckout: 'Secure Checkout'
    }
  },
  IN: {
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    rate: 83.5,
    translations: {
      explore: 'खोजें',
      dashboard: 'डैशबोर्ड',
      tryDemo: 'डेमो देखें',
      viewDetails: 'विवरण',
      buyNow: 'अभी खरीदें',
      publishedUnits: 'प्रकाशित इकाइयाँ',
      revenue: 'कुल आय',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      heroTitle: 'बिल्ड फीड',
      heroSubtitle: 'एक संवादात्मक गैलरी जहाँ इंजीनियर अपनी वास्तुकला प्रदर्शित करते हैं और लाइसेंस प्राप्त करते हैं।',
      searchPlaceholder: 'बिल्ड, रेपो और इंजीनियर खोजें...',
      noResults: 'कोई परिणाम नहीं मिला',
      resetFilters: 'फ़िल्टर रीसेट करें',
      engagementType: 'सगाई का प्रकार',
      budgetBracket: 'बजेट ब्रैकेट',
      missionStatement: 'मिशन वक्तव्य',
      requestCollab: 'सहयोग का अनुरोध करें',
      talentAcquisition: 'प्रतिभा अधिग्रहण',
      instanceLicense: 'लाइसेंस',
      executiveSummary: 'कार्यकारी सारांश',
      stackInfra: 'तकनीकी बुनियादी ढांचा',
      applauses: 'तालियां',
      financialLedger: 'वित्तीय बहीखाता',
      activeRepos: 'सक्रिय रिपॉजिटरी',
      trendingNow: 'ट्रेंडिंग',
      regenerate: 'फिर से बनाएं',
      paymentMethod: 'भुगतान विधि',
      cardNumber: 'कार्ड नंबर',
      expiryDate: 'समाप्ति तिथि',
      upiId: 'यूपीआई आईडी',
      payNow: 'अभी भुगतान करें',
      secureCheckout: 'सुरक्षित चेकआउट'
    }
  },
  FR: {
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    symbol: '€',
    rate: 0.92,
    translations: {
      explore: 'Explorer',
      dashboard: 'Tableau',
      tryDemo: 'Essayer Démo',
      viewDetails: 'Détails',
      buyNow: 'Acheter',
      publishedUnits: 'Unités Publiées',
      revenue: 'Revenu Net',
      login: 'Connexion',
      logout: 'Déconnexion',
      heroTitle: 'FLUX DE CONSTRUCTION',
      heroSubtitle: 'La galerie interactive où les ingénieurs présentent leurs architectures et sécurisent les licences.',
      searchPlaceholder: 'Rechercher des builds, des repos...',
      noResults: 'Aucun résultat identifié',
      resetFilters: 'Réinitialiser les filtres',
      engagementType: "Type d'engagement",
      budgetBracket: 'Tranche de budget',
      missionStatement: 'Déclaration de mission',
      requestCollab: 'Demander collaboration',
      talentAcquisition: 'Acquisition de talents',
      instanceLicense: 'Licence d\'instance',
      executiveSummary: 'Résumé exécutif',
      stackInfra: 'Infrastructure technologique',
      applauses: 'Applaudissements',
      financialLedger: 'Grand livre financier',
      activeRepos: 'Répertoires actifs',
      trendingNow: 'Tendance actuelle',
      regenerate: 'Régénérer',
      paymentMethod: 'Méthode de paiement',
      cardNumber: 'Numéro de carte',
      expiryDate: 'Date d\'expiration',
      upiId: 'Identifiant UPI',
      payNow: 'Payer maintenant',
      secureCheckout: 'Paiement sécurisé'
    }
  },
  JP: {
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    symbol: '¥',
    rate: 151.2,
    translations: {
      explore: '探索する',
      dashboard: 'ダッシュボード',
      tryDemo: 'デモを試す',
      viewDetails: '詳細を見る',
      buyNow: '今すぐ購入',
      publishedUnits: '公開ユニット',
      revenue: '純収益',
      login: 'ログイン',
      logout: 'ログアウト',
      heroTitle: 'ビルドフィード',
      heroSubtitle: 'エンジニアがアーキテクチャを展示し、ライセンスを確保するインタラクティブなギャラリー。',
      searchPlaceholder: 'ビルド、レポジトリ、エンジニアを検索...',
      noResults: '結果が見つかりません',
      resetFilters: 'フィルターをリセット',
      engagementType: 'エンゲージメントタイプ',
      budgetBracket: '予算範囲',
      missionStatement: 'ミッションステートメント',
      requestCollab: 'コラボレーションを依頼',
      talentAcquisition: '人材採用',
      instanceLicense: 'インスタンスライセンス',
      executiveSummary: 'エグゼクティブサマリー',
      stackInfra: 'スタックインフラ',
      applauses: '拍手',
      financialLedger: '財務元帳',
      activeRepos: 'アクティブなリポジトリ',
      trendingNow: '今のトレンド',
      regenerate: '再生成',
      paymentMethod: '支払い方法',
      cardNumber: 'カード番号',
      expiryDate: '有効期限',
      upiId: 'UPI ID',
      payNow: '今すぐ支払う',
      secureCheckout: '安全なチェックアウト'
    }
  }
};

interface LocalizationContextType {
  country: CountryCode;
  setCountry: (code: CountryCode) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount?: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, provider?: 'github' | 'google' | 'email') => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { country, setCountry, t } = useLocalization();
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-purple-900/20 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="text-2xl font-black text-purple-500 tracking-tighter hover:text-purple-400 transition-colors group">
        BUILD<span className="text-white group-hover:ml-1 transition-all">SPACE</span>
      </Link>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden md:block text-gray-400 hover:text-purple-400 transition-colors text-sm font-black uppercase tracking-widest">{t('explore')}</Link>
          
          {/* Country Selector Button - Positioned Beside Explore */}
          <div className="relative">
            <button 
              onClick={() => setShowSelector(!showSelector)}
              className="flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest transition-all group"
            >
              <span className="text-base leading-none">{LOCALES[country].flag}</span>
              <span className="text-zinc-400 group-hover:text-white transition-colors">{LOCALES[country].currency}</span>
              <svg className={`w-3 h-3 text-zinc-600 transition-transform ${showSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {showSelector && (
              <div className="absolute top-full mt-3 right-0 w-56 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                {(Object.keys(LOCALES) as CountryCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => { setCountry(code); setShowSelector(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mb-1 last:mb-0 ${country === code ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/10' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{LOCALES[code].flag}</span>
                      <span>{LOCALES[code].name}</span>
                    </div>
                    <span className={`opacity-50 text-[9px] ${country === code ? 'text-black' : 'text-zinc-600'}`}>{LOCALES[code].currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-black uppercase tracking-widest">{t('dashboard')}</Link>
        <div className="h-4 w-px bg-zinc-800"></div>
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-purple-500/50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="hidden sm:block text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [country, setCountry] = useState<CountryCode>('US');

  const login = (email: string, provider: 'github' | 'google' | 'email' = 'email') => {
    let name = email.split('@')[0] || 'Architect';
    let avatar = 'https://ui-avatars.com/api/?name=' + name + '&background=a855f7&color=000';
    
    if (provider === 'github') {
      avatar = 'https://github.com/identicons/user.png';
      name = 'GitHubExplorer';
    } else if (provider === 'google') {
      avatar = 'https://www.gstatic.com/images/branding/product/2x/avatar_square_blue_120dp.png';
      name = 'GoogleEngineer';
    }

    setUser({
      id: 'me',
      name: name,
      email: email || `${name}@${provider}.com`,
      avatar: avatar,
      github: provider === 'github' ? 'https://github.com/alexrivera' : ''
    });
  };

  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const localizationValue: LocalizationContextType = {
    country,
    setCountry,
    t: (key: string) => LOCALES[country].translations[key] || key,
    formatPrice: (usdAmount?: number) => {
      if (!usdAmount) return 'FREE';
      const locale = LOCALES[country];
      const converted = usdAmount * locale.rate;
      return `${locale.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <LocalizationContext.Provider value={localizationValue}>
      <AuthContext.Provider value={{ user, login, logout, updateUser }}>
        <HashRouter>
          <ScrollToTop />
          <Navbar />
          <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-black">
            <main className={user ? "pt-24 pb-12" : ""}>
              <Routes>
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/" element={<ProtectedRoute children={<HomePage />} />} />
                <Route path="/project/:id" element={<ProtectedRoute children={<ProjectDetailPage />} />} />
                <Route path="/profile/:id" element={<ProtectedRoute children={<ProfilePage />} />} />
                <Route path="/dashboard" element={<ProtectedRoute children={<DashboardPage />} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default App;
