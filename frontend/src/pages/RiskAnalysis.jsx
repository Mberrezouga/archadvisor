import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  Shield, 
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  Server
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const complianceFrameworks = [
  { id: "pci_dss", label: "PCI-DSS", description: "Payment Card Industry" },
  { id: "gdpr", label: "GDPR", description: "General Data Protection Regulation" },
  { id: "soc2", label: "SOC 2", description: "Service Organization Control 2" },
  { id: "hipaa", label: "HIPAA", description: "Health Insurance Portability" },
  { id: "iso27001", label: "ISO 27001", description: "Information Security Management" }
];

export default function RiskAnalysis() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    architecture_description: "",
    selected_compliance: [],
    security_concerns: [],
    data_sensitivity: "medium",
    existing_controls: ""
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
      setFormData(prev => ({
        ...prev,
        architecture_description: response.data.description || ""
      }));
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const toggleCompliance = (id) => {
    setFormData(prev => ({
      ...prev,
      selected_compliance: prev.selected_compliance.includes(id)
        ? prev.selected_compliance.filter(c => c !== id)
        : [...prev.selected_compliance, id]
    }));
  };

  const toggleSecurityConcern = (id) => {
    setFormData(prev => ({
      ...prev,
      security_concerns: prev.security_concerns.includes(id)
        ? prev.security_concerns.filter(c => c !== id)
        : [...prev.security_concerns, id]
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/analyze`, {
        project_id: id,
        analysis_type: "risk_analysis",
        input_data: {
          ...formData,
          project_name: project?.name,
          industry: project?.industry
        }
      });
      setResult(response.data);
      toast.success("Analyse de risques terminée!");
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
    <div className="space-y-8 animate-fade-in" data-testid="risk-analysis">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t.risk.title}
          </h1>
          <p className="text-slate-400">{project?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Architecture Description */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t.risk.archDescription}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.architecture_description}
                onChange={(e) => setFormData(prev => ({ ...prev, architecture_description: e.target.value }))}
                placeholder={t.risk.archDescPlaceholder}
                className="input-tech min-h-[150px]"
                data-testid="architecture-input"
              />
            </CardContent>
          </Card>

          {/* Compliance Frameworks */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white">
                {t.risk.complianceFrameworks}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {complianceFrameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => toggleCompliance(framework.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.selected_compliance.includes(framework.id)
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    data-testid={`compliance-${framework.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={formData.selected_compliance.includes(framework.id)}
                        className="pointer-events-none"
                      />
                      <div>
                        <p className="font-medium text-white text-sm">{framework.label}</p>
                        <p className="text-xs text-slate-500">{framework.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Concerns */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white">
                {t.risk.securityPoints}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: "data_encryption", label: t.risk.dataEncryption, icon: Lock },
                  { id: "access_control", label: t.risk.accessControl, icon: Shield },
                  { id: "monitoring", label: t.risk.monitoring, icon: Eye },
                  { id: "network_security", label: t.risk.networkSecurity, icon: Server }
                ].map((concern) => (
                  <div
                    key={concern.id}
                    onClick={() => toggleSecurityConcern(concern.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.security_concerns.includes(concern.id)
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Checkbox 
                      checked={formData.security_concerns.includes(concern.id)}
                      className="pointer-events-none"
                    />
                    <concern.icon className={`w-5 h-5 ${
                      formData.security_concerns.includes(concern.id) 
                        ? "text-amber-400" 
                        : "text-slate-400"
                    }`} />
                    <span className="text-white">{concern.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleAnalyze}
            className="btn-primary w-full"
            disabled={loading}
            data-testid="analyze-risk-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.analysis.analyzing}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t.risk.analyzeRisks}
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        <div>
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                {t.risk.riskReport}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center animate-pulse mb-4">
                    <Shield className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="text-slate-400">{t.risk.evaluatingRisks}</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Risk Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                      <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">{t.risk.critical}</p>
                      <p className="text-xl font-bold text-red-400">2</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                      <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">{t.risk.moderate}</p>
                      <p className="text-xl font-bold text-amber-400">5</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">{t.risk.low}</p>
                      <p className="text-xl font-bold text-emerald-400">3</p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {result.ai_recommendation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Shield className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {t.risk.configureRiskPrompt}
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
