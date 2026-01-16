import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft,
  Loader2,
  History,
  BarChart3,
  DollarSign,
  Shield,
  GitBranch,
  FileText,
  Clock,
  ChevronRight,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Analysis type configurations
const analysisTypes = {
  architecture: { 
    icon: BarChart3, 
    color: "#06b6d4", 
    label: { fr: "Analyse d'Architecture", en: "Architecture Analysis" }
  },
  cost: { 
    icon: DollarSign, 
    color: "#10b981", 
    label: { fr: "Estimation des Coûts", en: "Cost Estimation" }
  },
  risk: { 
    icon: Shield, 
    color: "#f59e0b", 
    label: { fr: "Analyse de Risques", en: "Risk Analysis" }
  },
  scoring: { 
    icon: BarChart3, 
    color: "#8b5cf6", 
    label: { fr: "Scoring", en: "Scoring" }
  },
  cloud_choice: { 
    icon: BarChart3, 
    color: "#06b6d4", 
    label: { fr: "Choix Cloud", en: "Cloud Choice" }
  },
  tech_comparison: { 
    icon: BarChart3, 
    color: "#6366f1", 
    label: { fr: "Comparaison Tech", en: "Tech Comparison" }
  },
  recommendation: { 
    icon: BarChart3, 
    color: "#ec4899", 
    label: { fr: "Recommandation", en: "Recommendation" }
  }
};

export default function AnalysisHistory() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected item for detail view
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, analysesRes, diagramsRes, documentsRes] = await Promise.all([
        axios.get(`${API}/projects/${id}`),
        axios.get(`${API}/analyses?project_id=${id}`).catch(() => ({ data: [] })),
        axios.get(`${API}/diagrams?project_id=${id}`).catch(() => ({ data: [] })),
        axios.get(`${API}/documents?project_id=${id}`).catch(() => ({ data: [] }))
      ]);
      
      setProject(projectRes.data);
      setAnalyses(analysesRes.data || []);
      setDiagrams(diagramsRes.data || []);
      setDocuments(documentsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(language === 'fr' ? "Erreur de chargement" : "Loading error");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (type, itemId) => {
    try {
      await axios.delete(`${API}/${type}/${itemId}`);
      
      if (type === "analyses") {
        setAnalyses(prev => prev.filter(a => a.id !== itemId));
      } else if (type === "diagrams") {
        setDiagrams(prev => prev.filter(d => d.id !== itemId));
      } else if (type === "documents") {
        setDocuments(prev => prev.filter(d => d.id !== itemId));
      }
      
      toast.success(language === 'fr' ? "Supprimé avec succès" : "Successfully deleted");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(language === 'fr' ? "Erreur de suppression" : "Delete error");
    }
  };

  // Combine and sort all items by date
  const getAllItems = () => {
    const items = [
      ...analyses.map(a => ({ ...a, itemType: "analysis", category: a.analysis_type })),
      ...diagrams.map(d => ({ ...d, itemType: "diagram", category: "diagram" })),
      ...documents.map(d => ({ ...d, itemType: "document", category: "document" }))
    ];
    
    // Filter by type
    let filtered = items;
    if (filterType !== "all") {
      if (filterType === "analysis") {
        filtered = items.filter(i => i.itemType === "analysis");
      } else if (filterType === "diagram") {
        filtered = items.filter(i => i.itemType === "diagram");
      } else if (filterType === "document") {
        filtered = items.filter(i => i.itemType === "document");
      }
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.title?.toLowerCase().includes(query) ||
        i.analysis_type?.toLowerCase().includes(query) ||
        i.template_type?.toLowerCase().includes(query) ||
        i.diagram_type?.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp || 0);
      const dateB = new Date(b.created_at || b.timestamp || 0);
      return dateB - dateA;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return language === 'fr' ? 'Date inconnue' : 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getItemIcon = (item) => {
    if (item.itemType === "diagram") return GitBranch;
    if (item.itemType === "document") return FileText;
    const config = analysisTypes[item.analysis_type] || analysisTypes.architecture;
    return config.icon;
  };

  const getItemColor = (item) => {
    if (item.itemType === "diagram") return "#6366f1";
    if (item.itemType === "document") return "#ec4899";
    const config = analysisTypes[item.analysis_type] || analysisTypes.architecture;
    return config.color;
  };

  const getItemLabel = (item) => {
    if (item.itemType === "diagram") {
      return item.diagram_type || (language === 'fr' ? 'Diagramme' : 'Diagram');
    }
    if (item.itemType === "document") {
      return item.template_type?.toUpperCase() || (language === 'fr' ? 'Document' : 'Document');
    }
    const config = analysisTypes[item.analysis_type] || analysisTypes.architecture;
    return config.label[language] || config.label.en;
  };

  const items = getAllItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="analysis-history">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/projects/${id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">
              {language === 'fr' ? 'Historique' : 'History'}
            </h1>
            <p className="text-slate-400 text-sm">{project?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-400">
            {items.length} {language === 'fr' ? 'éléments' : 'items'}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-tech">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analyses.length}</p>
              <p className="text-xs text-slate-500">{language === 'fr' ? 'Analyses' : 'Analyses'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-tech">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{diagrams.length}</p>
              <p className="text-xs text-slate-500">{language === 'fr' ? 'Diagrammes' : 'Diagrams'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-tech">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{documents.length}</p>
              <p className="text-xs text-slate-500">{language === 'fr' ? 'Documents' : 'Documents'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-tech">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{items.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-tech">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder={language === 'fr' ? "Rechercher..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-tech pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="input-tech w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'fr' ? 'Tout' : 'All'}</SelectItem>
                <SelectItem value="analysis">{language === 'fr' ? 'Analyses' : 'Analyses'}</SelectItem>
                <SelectItem value="diagram">{language === 'fr' ? 'Diagrammes' : 'Diagrams'}</SelectItem>
                <SelectItem value="document">{language === 'fr' ? 'Documents' : 'Documents'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card className="card-tech">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {language === 'fr' ? 'Activité Récente' : 'Recent Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                {language === 'fr' 
                  ? 'Aucun historique pour ce projet'
                  : 'No history for this project'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => {
                const ItemIcon = getItemIcon(item);
                const itemColor = getItemColor(item);
                
                return (
                  <div
                    key={`${item.itemType}-${item.id || index}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${itemColor}20` }}
                    >
                      <ItemIcon className="w-5 h-5" style={{ color: itemColor }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">
                          {item.title || getItemLabel(item)}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: itemColor, color: itemColor }}
                        >
                          {getItemLabel(item)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at || item.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <ItemIcon className="w-5 h-5" style={{ color: itemColor }} />
                              {item.title || getItemLabel(item)}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.created_at || item.timestamp)}
                            </div>
                            
                            {item.ai_recommendation && (
                              <div className="prose prose-invert prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-slate-300 bg-slate-800/50 p-4 rounded-lg">
                                  {item.ai_recommendation}
                                </div>
                              </div>
                            )}
                            
                            {item.mermaid_code && (
                              <div>
                                <p className="text-sm text-slate-400 mb-2">Mermaid Code:</p>
                                <pre className="text-xs text-cyan-400 bg-slate-900 p-3 rounded-lg overflow-auto">
                                  {item.mermaid_code}
                                </pre>
                              </div>
                            )}
                            
                            {item.content && (
                              <div className="text-sm text-slate-300">
                                {typeof item.content === 'string' 
                                  ? item.content 
                                  : JSON.stringify(item.content, null, 2)
                                }
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => deleteItem(
                          item.itemType === "analysis" ? "analyses" : 
                          item.itemType === "diagram" ? "diagrams" : "documents",
                          item.id
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
