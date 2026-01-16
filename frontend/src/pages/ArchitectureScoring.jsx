import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft,
  Loader2,
  TrendingUp,
  Shield,
  DollarSign,
  Zap,
  Users,
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Info,
  Star,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Scoring categories with weights
const scoringCategories = [
  { 
    id: "scalability", 
    icon: TrendingUp, 
    color: "#06b6d4",
    weight: 0.2,
    title: { fr: "Scalabilité", en: "Scalability" },
    description: { fr: "Capacité à évoluer avec la charge", en: "Ability to scale with load" }
  },
  { 
    id: "security", 
    icon: Shield, 
    color: "#10b981",
    weight: 0.25,
    title: { fr: "Sécurité", en: "Security" },
    description: { fr: "Protection des données et conformité", en: "Data protection and compliance" }
  },
  { 
    id: "cost", 
    icon: DollarSign, 
    color: "#f59e0b",
    weight: 0.15,
    title: { fr: "Coût-efficacité", en: "Cost Efficiency" },
    description: { fr: "Optimisation des coûts d'infrastructure", en: "Infrastructure cost optimization" }
  },
  { 
    id: "performance", 
    icon: Zap, 
    color: "#8b5cf6",
    weight: 0.2,
    title: { fr: "Performance", en: "Performance" },
    description: { fr: "Temps de réponse et débit", en: "Response time and throughput" }
  },
  { 
    id: "maintainability", 
    icon: Server, 
    color: "#ec4899",
    weight: 0.1,
    title: { fr: "Maintenabilité", en: "Maintainability" },
    description: { fr: "Facilité de maintenance et évolution", en: "Ease of maintenance and evolution" }
  },
  { 
    id: "reliability", 
    icon: CheckCircle2, 
    color: "#14b8a6",
    weight: 0.1,
    title: { fr: "Fiabilité", en: "Reliability" },
    description: { fr: "Disponibilité et tolérance aux pannes", en: "Availability and fault tolerance" }
  }
];

// Architecture quality indicators
const getScoreLevel = (score) => {
  if (score >= 85) return { level: "excellent", color: "#10b981", icon: Award };
  if (score >= 70) return { level: "good", color: "#06b6d4", icon: CheckCircle2 };
  if (score >= 50) return { level: "average", color: "#f59e0b", icon: AlertTriangle };
  return { level: "poor", color: "#ef4444", icon: XCircle };
};

export default function ArchitectureScoring() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [scores, setScores] = useState(null);
  const [architectureDescription, setArchitectureDescription] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
      // Pre-fill with project description
      setArchitectureDescription(response.data.description || "");
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeArchitecture = async () => {
    if (!architectureDescription.trim()) {
      toast.error(language === 'fr' ? "Veuillez décrire votre architecture" : "Please describe your architecture");
      return;
    }

    setAnalyzing(true);
    try {
      // Call AI to analyze architecture
      const response = await axios.post(`${API}/analyze`, {
        project_id: id,
        analysis_type: "scoring",
        input_data: {
          context: architectureDescription,
          requirements: project?.requirements?.join(", ") || "",
          constraints: `Industry: ${project?.industry || 'N/A'}, Budget: ${project?.budget_range || 'N/A'}`
        }
      });

      // Parse AI response to generate scores
      // In a real scenario, this would be more sophisticated
      const aiText = response.data.ai_recommendation || "";
      
      // Generate scores based on keywords in AI response
      const generatedScores = {};
      scoringCategories.forEach(cat => {
        // Simulate scoring based on analysis
        let baseScore = 60 + Math.random() * 30;
        
        // Adjust based on keywords
        if (cat.id === "security" && aiText.toLowerCase().includes("security")) baseScore += 10;
        if (cat.id === "scalability" && aiText.toLowerCase().includes("scalab")) baseScore += 10;
        if (cat.id === "performance" && aiText.toLowerCase().includes("perform")) baseScore += 10;
        
        generatedScores[cat.id] = Math.min(100, Math.round(baseScore));
      });

      setScores(generatedScores);

      // Generate recommendations
      const recs = [];
      if (generatedScores.security < 75) {
        recs.push({
          category: "security",
          priority: "high",
          text: language === 'fr' 
            ? "Renforcer la sécurité avec l'authentification multi-facteurs et le chiffrement des données au repos"
            : "Enhance security with multi-factor authentication and encryption at rest"
        });
      }
      if (generatedScores.scalability < 70) {
        recs.push({
          category: "scalability",
          priority: "high",
          text: language === 'fr'
            ? "Implémenter une architecture microservices pour améliorer la scalabilité horizontale"
            : "Implement microservices architecture to improve horizontal scaling"
        });
      }
      if (generatedScores.cost < 65) {
        recs.push({
          category: "cost",
          priority: "medium",
          text: language === 'fr'
            ? "Utiliser des instances spot/préemptives pour les workloads non critiques"
            : "Use spot/preemptible instances for non-critical workloads"
        });
      }
      if (generatedScores.performance < 70) {
        recs.push({
          category: "performance",
          priority: "medium",
          text: language === 'fr'
            ? "Ajouter une couche de cache (Redis/Memcached) pour réduire la latence"
            : "Add caching layer (Redis/Memcached) to reduce latency"
        });
      }
      if (generatedScores.reliability < 75) {
        recs.push({
          category: "reliability",
          priority: "medium",
          text: language === 'fr'
            ? "Implémenter des health checks et circuit breakers pour améliorer la résilience"
            : "Implement health checks and circuit breakers to improve resilience"
        });
      }
      
      setRecommendations(recs);
      toast.success(language === 'fr' ? "Analyse terminée" : "Analysis complete");
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error(language === 'fr' ? "Erreur d'analyse" : "Analysis error");
    } finally {
      setAnalyzing(false);
    }
  };

  // Calculate overall score
  const calculateOverallScore = () => {
    if (!scores) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    scoringCategories.forEach(cat => {
      if (scores[cat.id] !== undefined) {
        weightedSum += scores[cat.id] * cat.weight;
        totalWeight += cat.weight;
      }
    });
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  };

  const overallScore = calculateOverallScore();
  const scoreLevel = getScoreLevel(overallScore);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="architecture-scoring">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">
            {language === 'fr' ? 'Scoring d\'Architecture' : 'Architecture Scoring'}
          </h1>
          <p className="text-slate-400 text-sm">{project?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                {language === 'fr' ? 'Description de l\'Architecture' : 'Architecture Description'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={architectureDescription}
                onChange={(e) => setArchitectureDescription(e.target.value)}
                placeholder={language === 'fr' 
                  ? "Décrivez votre architecture (composants, technologies, flux de données...)"
                  : "Describe your architecture (components, technologies, data flows...)"
                }
                className="input-tech min-h-[200px]"
              />
              <Button 
                onClick={analyzeArchitecture}
                className="btn-primary w-full mt-4"
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'fr' ? 'Analyse en cours...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Analyser et Noter' : 'Analyze & Score'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Project Context */}
          {project && (
            <Card className="card-tech">
              <CardHeader className="py-3">
                <CardTitle className="text-sm text-white">
                  {language === 'fr' ? 'Contexte du Projet' : 'Project Context'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {project.industry && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'fr' ? 'Industrie' : 'Industry'}</span>
                    <span className="text-slate-300">{project.industry}</span>
                  </div>
                )}
                {project.budget_range && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget</span>
                    <span className="text-slate-300">{project.budget_range}</span>
                  </div>
                )}
                {project.requirements?.length > 0 && (
                  <div>
                    <span className="text-slate-500">{language === 'fr' ? 'Exigences' : 'Requirements'}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.requirements.map((req, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overall Score Card */}
          <Card className="card-tech overflow-hidden">
            <div 
              className="h-2"
              style={{ backgroundColor: scores ? scoreLevel.color : '#334155' }}
            />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">
                    {language === 'fr' ? 'Score Global' : 'Overall Score'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-heading text-5xl font-bold" style={{ color: scores ? scoreLevel.color : '#64748b' }}>
                      {scores ? overallScore : '--'}
                    </span>
                    <span className="text-slate-500">/100</span>
                  </div>
                </div>
                {scores && (
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${scoreLevel.color}20` }}
                  >
                    <scoreLevel.icon className="w-10 h-10" style={{ color: scoreLevel.color }} />
                  </div>
                )}
              </div>
              {scores && (
                <Badge 
                  className="mt-3"
                  style={{ backgroundColor: `${scoreLevel.color}20`, color: scoreLevel.color }}
                >
                  {scoreLevel.level === "excellent" && (language === 'fr' ? 'Excellent' : 'Excellent')}
                  {scoreLevel.level === "good" && (language === 'fr' ? 'Bon' : 'Good')}
                  {scoreLevel.level === "average" && (language === 'fr' ? 'Moyen' : 'Average')}
                  {scoreLevel.level === "poor" && (language === 'fr' ? 'À Améliorer' : 'Needs Improvement')}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="text-white">
                {language === 'fr' ? 'Scores par Catégorie' : 'Category Scores'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoringCategories.map((category) => {
                  const score = scores?.[category.id] || 0;
                  const catLevel = getScoreLevel(score);
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" style={{ color: category.color }} />
                          <span className="text-white text-sm">
                            {category.title[language] || category.title.en}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({Math.round(category.weight * 100)}%)
                          </span>
                        </div>
                        <span 
                          className="font-mono font-bold"
                          style={{ color: scores ? catLevel.color : '#64748b' }}
                        >
                          {scores ? score : '--'}
                        </span>
                      </div>
                      <Progress 
                        value={scores ? score : 0} 
                        className="h-2"
                        style={{ 
                          '--progress-background': category.color 
                        }}
                      />
                      <p className="text-xs text-slate-500">
                        {category.description[language] || category.description.en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="card-tech">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  {language === 'fr' ? 'Recommandations' : 'Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => {
                    const cat = scoringCategories.find(c => c.id === rec.category);
                    return (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-slate-800/50 border-l-4 flex gap-3"
                        style={{ borderColor: cat?.color || '#64748b' }}
                      >
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                          className="h-fit"
                        >
                          {rec.priority === 'high' 
                            ? (language === 'fr' ? 'Haute' : 'High')
                            : (language === 'fr' ? 'Moyenne' : 'Medium')
                          }
                        </Badge>
                        <p className="text-sm text-slate-300">{rec.text}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!scores && (
            <Card className="card-tech">
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  {language === 'fr' 
                    ? 'Décrivez votre architecture et cliquez sur "Analyser" pour obtenir un score'
                    : 'Describe your architecture and click "Analyze" to get a score'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
