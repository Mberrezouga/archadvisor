import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  DollarSign, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Calculator,
  TrendingUp,
  Server,
  Cloud,
  Database
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CostEstimation() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    provider: "aws",
    compute_instances: 5,
    storage_tb: 1,
    database_type: "postgresql",
    monthly_users: 10000,
    data_transfer_gb: 100,
    region: "us-east-1"
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/analyze`, {
        project_id: id,
        analysis_type: "cost_estimation",
        input_data: {
          ...formData,
          project_name: project?.name,
          industry: project?.industry
        }
      });
      setResult(response.data);
      toast.success("Estimation générée!");
    } catch (error) {
      console.error("Error estimating:", error);
      toast.error("Erreur lors de l'estimation");
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
    <div className="space-y-8 animate-fade-in" data-testid="cost-estimation">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t.cost.title}
          </h1>
          <p className="text-slate-400">{project?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                {t.cost.infraParams}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Provider */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t.cost.cloudProvider}</Label>
                <Select 
                  value={formData.provider}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}
                >
                  <SelectTrigger className="input-tech" data-testid="provider-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
                    <SelectItem value="azure">Microsoft Azure</SelectItem>
                    <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compute Instances */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-slate-300">
                    <Server className="w-4 h-4 inline mr-2" />
                    {t.cost.computeInstances}
                  </Label>
                  <span className="text-primary font-mono">{formData.compute_instances}</span>
                </div>
                <Slider
                  value={[formData.compute_instances]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, compute_instances: value }))}
                  max={50}
                  min={1}
                  step={1}
                  className="cursor-pointer"
                  data-testid="compute-slider"
                />
              </div>

              {/* Storage */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-slate-300">
                    <Database className="w-4 h-4 inline mr-2" />
                    {t.cost.storageTB}
                  </Label>
                  <span className="text-primary font-mono">{formData.storage_tb} TB</span>
                </div>
                <Slider
                  value={[formData.storage_tb]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, storage_tb: value }))}
                  max={100}
                  min={1}
                  step={1}
                  className="cursor-pointer"
                />
              </div>

              {/* Database Type */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t.cost.databaseType}</Label>
                <Select 
                  value={formData.database_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, database_type: value }))}
                >
                  <SelectTrigger className="input-tech">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="dynamodb">DynamoDB / CosmosDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly Users */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t.cost.monthlyUsers}</Label>
                <Input
                  type="number"
                  value={formData.monthly_users}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_users: parseInt(e.target.value) || 0 }))}
                  className="input-tech"
                  data-testid="users-input"
                />
              </div>

              {/* Data Transfer */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-slate-300">
                    <Cloud className="w-4 h-4 inline mr-2" />
                    {t.cost.dataTransfer}
                  </Label>
                  <span className="text-primary font-mono">{formData.data_transfer_gb} GB</span>
                </div>
                <Slider
                  value={[formData.data_transfer_gb]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, data_transfer_gb: value }))}
                  max={1000}
                  min={10}
                  step={10}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleEstimate}
            className="btn-primary w-full"
            disabled={loading}
            data-testid="estimate-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.cost.calculating}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t.cost.estimateWithAI}
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        <div>
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                {t.cost.costEstimation}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center animate-pulse mb-4">
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-slate-400">{t.cost.calculating}</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                      <p className="text-xs text-slate-500 uppercase">{t.cost.monthlyEstimate}</p>
                      <p className="text-2xl font-heading font-bold text-emerald-400">
                        ~$2,500
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-xs text-slate-500 uppercase">{t.cost.tco3Years}</p>
                      <p className="text-2xl font-heading font-bold text-primary">
                        ~$90,000
                      </p>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {result.ai_recommendation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <DollarSign className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {t.cost.configurePrompt}
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
