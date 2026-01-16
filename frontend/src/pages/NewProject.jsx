import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { 
  FolderPlus, 
  Building2, 
  Calendar, 
  DollarSign,
  Server,
  ListChecks,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function NewProject() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_name: "",
    industry: "",
    budget_range: "",
    timeline: "",
    current_infrastructure: "",
    requirements: []
  });
  const [requirementInput, setRequirementInput] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/projects`, formData);
      toast.success("Projet créé avec succès!");
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Erreur lors de la création du projet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" data-testid="new-project-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-white mb-2">
          {t.newProject.title}
        </h1>
        <p className="text-slate-400">
          {t.newProject.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" />
                {t.newProject.basicInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  {t.newProject.projectName} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t.newProject.projectNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="input-tech"
                  data-testid="project-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  {t.newProject.description} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t.newProject.descriptionPlaceholder}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="input-tech min-h-[120px]"
                  data-testid="project-description-input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-slate-300">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    {t.newProject.clientName}
                  </Label>
                  <Input
                    id="client"
                    placeholder={t.newProject.clientPlaceholder}
                    value={formData.client_name}
                    onChange={(e) => handleChange("client_name", e.target.value)}
                    className="input-tech"
                    data-testid="client-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">{t.newProject.industry}</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => handleChange("industry", value)}
                  >
                    <SelectTrigger className="input-tech" data-testid="industry-select">
                      <SelectValue placeholder={t.newProject.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      {t.industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Parameters */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                {t.newProject.projectParams}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    {t.newProject.budget}
                  </Label>
                  <Select 
                    value={formData.budget_range} 
                    onValueChange={(value) => handleChange("budget_range", value)}
                  >
                    <SelectTrigger className="input-tech" data-testid="budget-select">
                      <SelectValue placeholder={t.newProject.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      {t.budgetRanges.map((budget) => (
                        <SelectItem key={budget} value={budget}>
                          {budget}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {t.newProject.timeline}
                  </Label>
                  <Select 
                    value={formData.timeline} 
                    onValueChange={(value) => handleChange("timeline", value)}
                  >
                    <SelectTrigger className="input-tech" data-testid="timeline-select">
                      <SelectValue placeholder={t.newProject.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      {t.timelines.map((timeline) => (
                        <SelectItem key={timeline} value={timeline}>
                          {timeline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t.newProject.currentInfra}</Label>
                <Select 
                  value={formData.current_infrastructure} 
                  onValueChange={(value) => handleChange("current_infrastructure", value)}
                >
                  <SelectTrigger className="input-tech" data-testid="infrastructure-select">
                    <SelectValue placeholder={t.newProject.selectOption} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.infrastructures.map((infra) => (
                      <SelectItem key={infra} value={infra}>
                        {infra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary" />
                {t.newProject.requirements}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t.newProject.requirementPlaceholder}
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="input-tech flex-1"
                  data-testid="requirement-input"
                />
                <Button 
                  type="button" 
                  onClick={addRequirement}
                  variant="outline"
                  data-testid="add-requirement-btn"
                >
                  {t.newProject.addBtn}
                </Button>
              </div>

              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              {t.newProject.cancel}
            </Button>
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              data-testid="create-project-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.newProject.creating}
                </>
              ) : (
                <>
                  {t.newProject.create}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
