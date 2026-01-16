import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderPlus, 
  Cloud, 
  Layers,
  Menu,
  X,
  Globe
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { ArchAdvisorLogo } from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navigation = [
    { name: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.nav.newProject, href: "/projects/new", icon: FolderPlus },
    { name: t.nav.cloudComparison, href: "/cloud-comparison", icon: Cloud },
    { name: t.nav.templates, href: "/templates", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl glass-strong rounded-full px-6 py-3 z-50 shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 group"
            data-testid="nav-logo"
          >
            <ArchAdvisorLogo size={40} />
            <span className="font-heading font-bold text-xl text-white hidden sm:block">
              Arch<span className="text-cyan-400">Advisor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="ml-2 flex items-center gap-2 text-slate-400 hover:text-white"
              data-testid="language-switcher"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-fade-in">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 w-full"
            >
              <Globe className="w-5 h-5" />
              {language === 'fr' ? 'English' : 'Français'}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center glass-strong border-t border-white/5">
        <p className="text-sm text-slate-500 font-mono">
          © {new Date().getFullYear()} {t.footer.copyright}{" "}
          <span className="text-primary">Malek Berrezouga</span>
        </p>
      </footer>
    </div>
  );
}
