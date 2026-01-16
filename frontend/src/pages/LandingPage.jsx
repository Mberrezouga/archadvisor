import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Cloud, 
  Shield, 
  FileText, 
  Cpu,
  Zap,
  BarChart3,
  Lock,
  Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ArchAdvisorLogo, ArchAdvisorLogoFull } from "../components/Logo";
import { useLanguage } from "../context/LanguageContext";

export default function LandingPage() {
  const { language, toggleLanguage, t } = useLanguage();

  const features = [
    { icon: Cloud, title: t.landing.feature1Title, description: t.landing.feature1Desc },
    { icon: BarChart3, title: t.landing.feature2Title, description: t.landing.feature2Desc },
    { icon: Cpu, title: t.landing.feature3Title, description: t.landing.feature3Desc },
    { icon: Shield, title: t.landing.feature4Title, description: t.landing.feature4Desc },
    { icon: Zap, title: t.landing.feature5Title, description: t.landing.feature5Desc },
    { icon: FileText, title: t.landing.feature6Title, description: t.landing.feature6Desc }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-slate-400 hover:text-white glass"
          data-testid="lang-switch-landing"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'fr' ? 'EN' : 'FR'}</span>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <ArchAdvisorLogo size={80} className="animate-pulse-glow" />
          </div>

          {/* Title */}
          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up stagger-1">
            <span className="text-gradient">{t.landing.title}</span>
          </h1>
          
          <p className="font-heading text-xl sm:text-2xl text-slate-300 mb-4 animate-fade-in-up stagger-2">
            {t.landing.subtitle}
          </p>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in-up stagger-3">
            {t.landing.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-4">
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-6 group"
                data-testid="get-started-btn"
              >
                {t.landing.getStarted}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/cloud-comparison">
              <Button 
                variant="outline" 
                size="lg"
                className="btn-secondary text-lg px-8 py-6"
                data-testid="compare-cloud-btn"
              >
                <Cloud className="mr-2 w-5 h-5" />
                {t.landing.compareCloud}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-semibold text-3xl text-center text-white mb-4">
            {t.landing.features}
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            {t.landing.featuresSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-tech p-6 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-medium text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "19+", label: t.landing.diagramTypes },
              { value: "3", label: t.landing.cloudProviders },
              { value: "TOGAF", label: "Templates" },
              { value: "IA", label: t.landing.aiRecommendations }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading font-bold text-4xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-semibold text-3xl text-white mb-6">
                {t.landing.whyTitle}
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Zap, text: t.landing.why1 },
                  { icon: Lock, text: t.landing.why2 },
                  { icon: FileText, text: t.landing.why3 }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-slate-300 pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-tech p-8 tracing-border">
              <div className="font-mono text-sm text-slate-500 mb-2">// Architecture Decision</div>
              <pre className="text-cyan-400 text-sm overflow-x-auto">
{`{
  "decision": "Hybrid Cloud",
  "provider": "Azure + On-Prem",
  "confidence": 94,
  "reasoning": [
    "Sensitive data",
    "PCI-DSS compliance",
    "Scalability required"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-semibold text-3xl text-white mb-6">
            {t.landing.readyTitle}
          </h2>
          <p className="text-slate-400 mb-8">
            {t.landing.readyDesc}
          </p>
          <Link to="/projects/new">
            <Button 
              size="lg" 
              className="btn-primary text-lg px-10 py-6"
              data-testid="create-project-cta"
            >
              {t.landing.createProject}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500 font-mono">
          © {new Date().getFullYear()} {t.footer.copyright}{" "}
          <span className="text-primary">Malek Berrezouga</span>
        </p>
      </footer>
    </div>
  );
}
