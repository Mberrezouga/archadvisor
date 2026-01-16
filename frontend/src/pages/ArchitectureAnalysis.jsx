import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  BarChart3, 
  Cloud, 
  Server, 
  Zap,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ArchitectureAnalysis() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [analysisType, setAnalysisType] = useState("cloud_choice");
  const [context, setContext] = useState("");
  const [requirements, setRequirements] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const analysisTypes = [
    {
      id: "cloud_choice",
      title: t.analysis.infraChoice,
      description: t.analysis.infraChoiceDesc,
      icon: Cloud
    },
    {
      id: "tech_comparison",
      title: t.analysis.techComparison,
      description: t.analysis.techComparisonDesc,
      icon: Server
    },
    {
      id: "recommendation",
      title: t.analysis.fullRecommendation,
      description: t.analysis.fullRecommendationDesc,
      icon: Zap
    }
  ];

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
      setContext(response.data.description || "");
      setRequirements(response.data.requirements?.join(", ") || "");
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Erreur lors du chargement du projet");
    } finally {
      setPageLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!context.trim()) {
      toast.error("Veuillez fournir un contexte pour l'analyse");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/analyze`, {
        project_id: id,
        analysis_type: analysisType,
        input_data: {
          context,
          requirements,
          constraints,
          industry: project?.industry,
          budget: project?.budget_range,
          current_infrastructure: project?.current_infrastructure
        }
      });

      setResult(response.data);
      toast.success("Analyse terminée!");
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error("Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="architecture-analysis">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t.analysis.title}
          </h1>
          <p className="text-slate-400">
            {project?.name}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Analysis Type */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {t.analysis.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={analysisType} 
                onValueChange={setAnalysisType}
                className="space-y-3"
              >
                {analysisTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                      analysisType === type.id 
                        ? "border-primary bg-primary/5" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => setAnalysisType(type.id)}
                  >
                    <RadioGroupItem value={type.id} id={type.id} />
                    <type.icon className={`w-5 h-5 ${analysisType === type.id ? "text-primary" : "text-slate-400"}`} />
                    <div className="flex-1">
                      <Label htmlFor={type.id} className="text-white cursor-pointer">
                        {type.title}
                      </Label>
                      <p className="text-sm text-slate-400">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Context */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white">
                {t.analysis.projectContext}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t.analysis.contextLabel}</Label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={t.analysis.contextPlaceholder}
                  className="input-tech min-h-[120px]"
                  data-testid="context-input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t.analysis.techRequirements}</Label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder={t.analysis.techRequirementsPlaceholder}
                  className="input-tech"
                  data-testid="requirements-input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t.analysis.constraints}</Label>
                <Textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder={t.analysis.constraintsPlaceholder}
                  className="input-tech"
                  data-testid="constraints-input"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleAnalyze} 
            className="btn-primary w-full"
            disabled={loading}
            data-testid="analyze-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.analysis.analyzing}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t.analysis.analyzeWithAI}
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        <div>
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t.analysis.aiRecommendation}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-slate-400">{t.analysis.generatingRecommendation}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.analysis.analysisComplete}</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {result.ai_recommendation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BarChart3 className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {t.analysis.fillFormPrompt}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
