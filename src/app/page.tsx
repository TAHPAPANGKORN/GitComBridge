"use client";

import { Navbar } from "@/components/Navbar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Layers, 
  Code2,
  ChevronRight,
  Maximize2,
  X,
  Copy,
  Check,
  Moon,
  Sun,
  Info,
  Terminal,
  MousePointer2,
  Loader2,
  HelpCircle,
  ExternalLink,
  Layout,
  PlayCircle,
  Eye,
  AlertTriangle,
  Lock,
  Sparkles
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Brand SVGs
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const GitLabIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.417-.724-.417-.859 0L16.425 9.452H7.575L4.91 1.263c-.135-.417-.724-.417-.859 0L1.387 9.452.045 13.587c-.114.352.016.74.323.963l11.632 8.455 11.633-8.455c.307-.222.437-.611.322-.963z"/>
  </svg>
);

export default function Home() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { data: session } = useSession();
  
  const [baseUrl, setBaseUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string>('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState<{ github: boolean; gitlab: boolean; tier: 'free' | 'pro' }>({ github: false, gitlab: false, tier: 'free' });

  useEffect(() => {
    setPreviewTheme(theme);
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, [theme]);

  const [codeStyle, setCodeStyle] = useState<'markdown' | 'html' | 'link'>('markdown');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/user/status");
        if (res.ok) {
          const data = await res.json();
          setAccountStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    };
    if (session) fetchStatus();
  }, [session]);

  useEffect(() => {
    if (session?.user?.name && baseUrl) {
      const encodedName = encodeURIComponent(session.user.name);
      setGeneratedUrl(`${baseUrl}/api/graph/${encodedName}`);
    }
  }, [session, baseUrl]);

  const getFinalUrl = (pTheme: string, customName?: string) => {
    if (!baseUrl) return null;
    const name = customName || (session?.user?.name ? encodeURIComponent(session.user.name) : "demo");
    return `${baseUrl}/api/graph/${name}?theme=${pTheme}&t=${Date.now()}`;
  };

  const getFormattedCode = () => {
    const url = `${generatedUrl}?theme=${previewTheme}`;
    if (codeStyle === 'markdown') return `![GitComBridge Unified Graph](${url})`;
    if (codeStyle === 'html') return `<p align="center">\n  <img src="${url}" alt="GitComBridge" />\n</p>`;
    return `<p align="center">\n  <a href="${baseUrl}">\n    <img src="${url}" alt="GitComBridge" />\n  </a>\n</p>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen grid-bg selection:bg-gitlab-purple/30 transition-colors duration-300">
      <Navbar />
      
      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <motion.button className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              {getFinalUrl(previewTheme) && (
                <img 
                  src={getFinalUrl(previewTheme) as string} 
                  alt="Expanded Preview" 
                  className="w-full h-auto rounded-xl shadow-2xl border border-white/5"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
            <span className="bg-gitlab-gradient bg-clip-text text-transparent">{t("hero_title")}</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-60 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {!session ? (
              <button onClick={() => signIn()} className="btn-gradient w-full sm:w-auto flex items-center justify-center gap-3 text-lg">
                {t("cta_get_started")} <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <a href="#generator" className="btn-gradient w-full sm:w-auto flex items-center justify-center gap-3 text-lg">
                Go to Console <ChevronRight className="w-5 h-5" />
              </a>
            )}
            <a href="#showcase" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-3 text-lg">
              <Eye className="w-5 h-5" /> {t("cta_view_demo")}
            </a>
          </div>
        </motion.div>
      </section>

      {/* Live Showcase Section */}
      <section id="showcase" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Live Showcase</h2>
            <p className="opacity-60">See how it looks on a real profile</p>
          </div>
          
          <div className="glass-card p-2 md:p-4 bg-white/5 border-none shadow-2xl overflow-hidden">
            {/* GitHub Profile Mockup Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-white/5">
              <div className="w-12 h-12 rounded-full bg-gitlab-gradient" />
              <div>
                <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>
            
            {/* The Graph Demo */}
            <div className="p-8 flex flex-col items-center justify-center bg-[#0d1117] min-h-[300px]">
              <div className="w-full max-w-3xl space-y-8">
                 <div className="space-y-2">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                 </div>
                 <div className="p-6 rounded-xl border border-white/10 bg-black/40 shadow-xl">
                    {getFinalUrl('dark', 'demo') && (
                      <img 
                        src={getFinalUrl('dark', 'demo') as string} 
                        alt="Demo Graph" 
                        className="w-full h-auto"
                      />
                    )}
                 </div>
                 <div className="h-4 w-3/4 bg-white/5 rounded" />
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-card p-8 bg-white/5 text-center">
                <h4 className="font-bold mb-4 flex items-center justify-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" /> Light Mode Profile
                </h4>
                <div className="p-4 bg-white rounded-lg shadow-inner">
                  {getFinalUrl('light', 'demo') && (
                    <img src={getFinalUrl('light', 'demo') as string} alt="Light Demo" className="w-full h-auto" />
                  )}
                </div>
             </div>
             <div className="glass-card p-8 bg-white/5 text-center">
                <h4 className="font-bold mb-4 flex items-center justify-center gap-2">
                  <Moon className="w-5 h-5 text-purple-500" /> Dark Mode Profile
                </h4>
                <div className="p-4 bg-[#0d1117] rounded-lg shadow-inner">
                  {getFinalUrl('dark', 'demo') && (
                    <img src={getFinalUrl('dark', 'demo') as string} alt="Dark Demo" className="w-full h-auto" />
                  )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How it Works Bento */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">{t("how_it_works")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-10 md:col-span-2 group">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t("step1_title")}</h3>
            <p className="opacity-70 text-lg leading-relaxed">{t("step1_desc")}</p>
          </div>
          <div className="glass-card p-10 group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t("step2_title")}</h3>
            <p className="opacity-70 text-lg leading-relaxed">{t("step2_desc")}</p>
          </div>
          <div className="glass-card p-10 group">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mb-8 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t("step3_title")}</h3>
            <p className="opacity-70 text-lg leading-relaxed">{t("step3_desc")}</p>
          </div>
        </div>
      </section>

      {/* Console Workspace */}
      <section id="generator" className="py-24 px-4 bg-black/5">
        <div className="max-w-5xl mx-auto space-y-12">
          {session ? (
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden shadow-2xl border-white/10 dark:border-white/5">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                {/* Theme Picker */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "dark",    label: "Dark",    color: "#0d1117", pro: false },
                    { id: "light",   label: "Light",   color: "#ffffff", pro: false },
                    { id: "ocean",   label: "Ocean",   color: "#0a1628", pro: true },
                    { id: "sunset",  label: "Sunset",  color: "#1a0a0a", pro: true },
                    { id: "neon",    label: "Neon",    color: "#000000", pro: true },
                    { id: "dracula", label: "Dracula", color: "#282a36", pro: true },
                    { id: "nord",    label: "Nord",    color: "#2e3440", pro: true },
                  ].map((t) => {
                    const isLocked = t.pro && accountStatus.tier !== "pro";
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (isLocked) { setShowUpgradeModal(true); return; }
                          setPreviewTheme(t.id); setIsLoading(true);
                        }}
                        title={isLocked ? `${t.label} — Pro only` : t.label}
                        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                          previewTheme === t.id
                            ? "border-purple-500/60 bg-purple-500/10 text-purple-300"
                            : isLocked
                            ? "border-white/5 opacity-50 cursor-pointer hover:opacity-80"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: t.color }} />
                        {t.label}
                        {isLocked && <Lock className="w-2.5 h-2.5 text-yellow-400" />}
                        {t.pro && accountStatus.tier === "pro" && <Sparkles className="w-2.5 h-2.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <h2 className="text-3xl font-black">Workspace</h2>
                  <div className="flex gap-3">
                    <button onClick={() => signIn("github")} className="p-3 glass-card hover:bg-black/5 flex items-center gap-3 transition-all relative cursor-pointer">
                      <GitHubIcon /> 
                      <div className="text-left">
                        <div className="text-[10px] font-bold opacity-50 uppercase">GitHub</div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${accountStatus.github ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                          <span className="text-xs font-black">{accountStatus.github ? 'Linked' : 'Not Linked'}</span>
                        </div>
                      </div>
                    </button>
                    <button onClick={() => signIn("gitlab")} className="p-3 glass-card hover:bg-black/5 flex items-center gap-3 transition-all relative cursor-pointer">
                      <GitLabIcon />
                      <div className="text-left">
                        <div className="text-[10px] font-bold opacity-50 uppercase">GitLab</div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${accountStatus.gitlab ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                          <span className="text-xs font-black">{accountStatus.gitlab ? 'Linked' : 'Not Linked'}</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                      <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Info className="w-3 h-3" /> {t("update_info_title")}
                      </label>
                      <p className="text-[10px] text-github-text/70 leading-relaxed">
                        {t("update_info_desc")}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex p-1 bg-black/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 gap-1">
                        {(['markdown', 'html', 'link'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => setCodeStyle(style)}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                              codeStyle === style 
                              ? 'bg-gitlab-gradient text-white shadow-lg' 
                              : 'opacity-40 hover:opacity-100'
                            }`}
                          >
                            {style === 'markdown' ? 'Markdown' : style === 'html' ? 'Centered' : 'Interactive'}
                          </button>
                        ))}
                      </div>
                      <label className="text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-3 h-3" /> Resulting Code</label>
                      <div className="bg-black/5 dark:bg-black/40 rounded-xl border border-black/5 dark:border-white/5 relative group overflow-hidden min-h-[80px] flex items-center">
                        <div className="p-5 pr-14 w-full">
                          <code className={`text-[10px] font-mono whitespace-pre-wrap break-all leading-relaxed ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                            {getFormattedCode()}
                          </code>
                        </div>
                        <button 
                          onClick={handleCopy} 
                          className="absolute top-2 right-2 p-2.5 bg-gitlab-gradient rounded-lg shadow-lg hover:scale-105 transition-all active:scale-95 opacity-80 group-hover:opacity-100"
                        >
                          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2"><Maximize2 className="w-3 h-3" /> Visual Output</label>
                    <div 
                      className={`glass-card p-4 flex items-center justify-center min-h-[180px] cursor-zoom-in relative group transition-all overflow-hidden border-black/5 ${previewTheme === 'light' ? 'bg-[#f6f8fa]' : 'bg-[#0d1117]'}`}
                      onClick={() => setIsExpanded(true)}
                    >
                      <AnimatePresence>
                        {isLoading && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]"
                          >
                            <Loader2 className="w-8 h-8 animate-spin text-gitlab-orange" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                        {getFinalUrl(previewTheme) && (
                          <img 
                            src={getFinalUrl(previewTheme) as string} 
                            alt="Preview" 
                            onLoad={() => setIsLoading(false)}
                            className={`max-w-full h-auto shadow-sm transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
               <h3 className="text-4xl font-black mb-8">Ready to sync?</h3>
               <button onClick={() => signIn()} className="btn-gradient inline-flex items-center gap-4 text-xl px-12 py-5">Get My Graph Now <ChevronRight className="w-6 h-6" /></button>
            </div>
          )}
        </div>
      </section>

      {/* Usage Guide Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gitlab-gradient/10 border border-gitlab-gradient/20 text-gitlab-orange text-xs font-bold uppercase tracking-widest mb-4">
              <HelpCircle className="w-4 h-4" /> {t("tutorial_title")}
            </div>
            <h2 className="text-4xl font-black">{t("tutorial_title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center space-y-4 p-8 glass-card bg-white/5 border-none shadow-xl hover:shadow-gitlab-purple/5 transition-all">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">{t("tut_step1")}</h3>
               <p className="text-sm opacity-60 leading-relaxed">{t("tut_desc1")}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-8 glass-card bg-white/5 border-none shadow-xl hover:shadow-gitlab-purple/5 transition-all">
               <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                 <Copy className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">{t("tut_step2")}</h3>
               <p className="text-sm opacity-60 leading-relaxed">{t("tut_desc2")}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-8 glass-card bg-white/5 border-none shadow-xl hover:shadow-gitlab-purple/5 transition-all">
               <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2">
                 <Layout className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">{t("tut_step3")}</h3>
               <p className="text-sm opacity-60 leading-relaxed">{t("tut_desc3")}</p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 p-8 glass-card bg-gitlab-gradient/5 border-gitlab-gradient/10 rounded-3xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h4 className="text-2xl font-black flex items-center gap-3">
                  <GitHubIcon /> {t("pro_tip_title")}
                </h4>
                <p className="text-sm opacity-70 leading-relaxed">
                  {t("pro_tip_desc")}
                </p>
                <div className="bg-black/40 p-4 rounded-xl font-mono text-xs text-green-400 border border-white/5">
                  &lt;p align="center"&gt;<br />
                  &nbsp;&nbsp;&lt;img src="URL_HERE" alt="GitComBridge" /&gt;<br />
                  &lt;/p&gt;
                </div>
              </div>
              <div className="hidden md:block">
                <ExternalLink className="w-20 h-20 opacity-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10 opacity-50">
           <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
             <span className="font-black text-xl tracking-tight">GitComBridge</span>
           </div>
            <p className="text-[10px] uppercase tracking-[0.2em]">Crafted with passion for developers (Papangkorn PJ.)</p>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
               <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
               <a href="https://github.com/tahpapangkorn" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors"><GitHubIcon /> GitHub</a>
            </div>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </main>
  );
}
