"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Globe, LogOut, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gitlab-gradient rounded-lg flex items-center justify-center font-bold text-white">
            UG
          </div>
          <span className="font-bold text-lg hidden sm:block">UnifiedGraph</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-current"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setLanguage(language === "EN" ? "TH" : "EN")}
            className="flex items-center gap-1 text-sm hover:text-white transition-colors px-2"
          >
            <Globe className="w-4 h-4" />
            {language}
          </button>

          {session ? (
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <span className="text-sm hidden md:block opacity-60">{session.user?.name}</span>
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
