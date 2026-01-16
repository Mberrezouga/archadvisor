import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  GitBranch, 
  FileText, 
  BarChart3,
  Shield,
  DollarSign,
  Building2,
  Calendar,
  Server,
  ArrowRight,
  Loader2,
  Trash2,
  Star,
  Pencil,
  History
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProjectDetail() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, analysesRes, diagramsRes, documentsRes] = await Promise.all([
        axios.get(`${API}/projects/${id}`),
        axios.get(`${API}/analyses/${id}`),
        axios.get(`${API}/diagrams/${id}`),
        axios.get(`${API}/documents/${id}`)
      ]);
      setProject(projectRes.data);
      setAnalyses(analysesRes.data);
      setDiagrams(diagramsRes.data);
      setDocuments(documentsRes.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Erreur lors du chargement du projet");
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      title: t.project.archAnalysis,
      description: t.project.archAnalysisDesc,
      href: `/analyze/${id}`,
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    {
      title: t.project.costEstimation,
      description: t.project.costEstimationDesc,
      href: `/cost-estimation/${id}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10"
    },
    {
      title: t.project.riskAnalysis,
      description: t.project.riskAnalysisDesc,
      href: `/risk-analysis/${id}`,
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10"
    },
    {
      title: t.project.generateDiagrams,
      description: t.project.generateDiagramsDesc,
      href: `/diagrams/${id}`,
      icon: GitBranch,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10"
    },
    {
      title: language === 'fr' ? 'Éditeur de Diagrammes' : 'Diagram Editor',
      description: language === 'fr' ? 'Créez des diagrammes avec drag-and-drop' : 'Create diagrams with drag-and-drop',
      href: `/diagram-editor/${id}`,
      icon: Pencil,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      title: language === 'fr' ? 'Scoring d\'Architecture' : 'Architecture Scoring',
      description: language === 'fr' ? 'Évaluez la qualité de votre architecture' : 'Evaluate your architecture quality',
      href: `/scoring/${id}`,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      title: t.project.exportDocs,
      description: t.project.exportDocsDesc,
      href: `/documents/${id}`,
      icon: FileText,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10"
    },
    {
      title: language === 'fr' ? 'Historique' : 'History',
      description: language === 'fr' ? 'Voir l\'historique des analyses' : 'View analysis history',
      href: `/history/${id}`,
      icon: History,
      color: "text-slate-400",
      bgColor: "bg-slate-400/10"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Projet non trouvé</p>
        <Link to="/dashboard">
          <Button variant="outline" className="mt-4">
            {t.common.back} {t.dashboard.title}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="project-detail">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl text-white">
                {project.name}
              </h1>
              <Badge variant="outline" className="mt-1">
                {project.status || "draft"}
              </Badge>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl mt-4">
            {project.description}
          </p>
        </div>
      </div>

      {/* Project Info */}
      <Card className="card-tech">
        <CardHeader>
          <CardTitle className="font-heading text-white">
            {t.project.info}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.client_name && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">{t.project.client}</p>
                  <p className="text-white">{project.client_name}</p>
                </div>
              </div>
            )}
            {project.industry && (
              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">{t.project.industry}</p>
                  <p className="text-white">{project.industry}</p>
                </div>
              </div>
            )}
            {project.budget_range && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">{t.project.budget}</p>
                  <p className="text-white">{project.budget_range}</p>
                </div>
              </div>
            )}
            {project.timeline && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">{t.project.timeline}</p>
                  <p className="text-white">{project.timeline}</p>
                </div>
              </div>
            )}
          </div>

          {project.requirements && project.requirements.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-sm text-slate-500 mb-3">{t.project.requirements}</p>
              <div className="flex flex-wrap gap-2">
                {project.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Grid */}
      <div>
        <h2 className="font-heading font-semibold text-xl text-white mb-4">
          {t.project.actions}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group"
              data-testid={`action-${action.title.toLowerCase().replace(' ', '-')}`}
            >
              <Card className="card-tech h-full hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-medium text-white group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analyses */}
        <Card className="card-tech">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="font-heading text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              {t.dashboard.analyses} ({analyses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {analyses.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {language === 'fr' ? 'Aucune analyse' : 'No analyses'}
              </p>
            ) : (
              <div className="space-y-2">
                {analyses.slice(0, 3).map((analysis) => (
                  <div key={analysis.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-white capitalize">
                      {analysis.analysis_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(analysis.created_at).toLocaleDateString('fr-CA')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagrams */}
        <Card className="card-tech">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="font-heading text-white text-lg flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              {t.dashboard.diagrams} ({diagrams.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {diagrams.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {language === 'fr' ? 'Aucun diagramme' : 'No diagrams'}
              </p>
            ) : (
              <div className="space-y-2">
                {diagrams.slice(0, 3).map((diagram) => (
                  <div key={diagram.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-white">{diagram.title}</p>
                    <p className="text-xs text-slate-500 mt-1 capitalize">
                      {diagram.diagram_type.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="card-tech">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="font-heading text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-400" />
              {t.dashboard.documents} ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {documents.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {language === 'fr' ? 'Aucun document' : 'No documents'}
              </p>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-white">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase">
                      {doc.template_type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
