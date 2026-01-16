import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  FolderPlus, 
  GitBranch, 
  FileText, 
  BarChart3,
  ArrowRight,
  Clock,
  Layers,
  Cloud
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total_projects: 0,
    total_analyses: 0,
    total_diagrams: 0,
    total_documents: 0
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/projects`)
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: t.dashboard.projects, 
      value: stats.total_projects, 
      icon: Layers, 
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    { 
      title: t.dashboard.analyses, 
      value: stats.total_analyses, 
      icon: BarChart3, 
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10"
    },
    { 
      title: t.dashboard.diagrams, 
      value: stats.total_diagrams, 
      icon: GitBranch, 
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10"
    },
    { 
      title: t.dashboard.documents, 
      value: stats.total_documents, 
      icon: FileText, 
      color: "text-amber-400",
      bgColor: "bg-amber-400/10"
    }
  ];

  const quickActions = [
    { 
      title: t.nav.newProject, 
      description: t.dashboard.subtitle,
      href: "/projects/new",
      icon: FolderPlus,
      primary: true
    },
    { 
      title: t.nav.cloudComparison, 
      description: "AWS vs Azure vs GCP",
      href: "/cloud-comparison",
      icon: Cloud
    },
    { 
      title: t.nav.templates, 
      description: "TOGAF & ArchiMate",
      href: "/templates",
      icon: Layers
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" data-testid="dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl text-white mb-2">
            {t.dashboard.title}
          </h1>
          <p className="text-slate-400">
            {t.dashboard.subtitle}
          </p>
        </div>
        <Link to="/projects/new">
          <Button className="btn-primary" data-testid="new-project-btn">
            <FolderPlus className="w-4 h-4 mr-2" />
            {t.nav.newProject}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="card-tech"
            data-testid={`stat-${stat.title.toLowerCase()}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`font-heading font-bold text-3xl ${stat.color}`}>
                  {loading ? "-" : stat.value}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t.dashboard.recentProjects}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">{t.dashboard.noProjects}</p>
                  <Link to="/projects/new">
                    <Button variant="outline" size="sm">
                      {t.dashboard.createFirst}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      data-testid={`project-${project.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GitBranch className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-slate-400 truncate max-w-xs">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white">
                {t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all group ${
                    action.primary 
                      ? "bg-primary/10 hover:bg-primary/20 border border-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  data-testid={`quick-action-${action.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.primary ? "bg-primary/20" : "bg-white/5"
                  }`}>
                    <action.icon className={`w-5 h-5 ${action.primary ? "text-primary" : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${action.primary ? "text-primary" : "text-white"}`}>
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="card-tech tracing-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading font-semibold text-xl text-white mb-2">
                {t.dashboard.needHelp}
              </h3>
              <p className="text-slate-400">
                {t.dashboard.helpDesc}
              </p>
            </div>
            <Link to="/templates">
              <Button className="btn-secondary whitespace-nowrap">
                {t.dashboard.viewTemplates}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
