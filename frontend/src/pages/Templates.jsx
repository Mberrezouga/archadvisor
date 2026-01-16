import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Layers, 
  Cloud,
  Server,
  Shield,
  Database,
  Zap,
  ArrowRight,
  Loader2,
  X,
  FolderPlus,
  GitBranch,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryIcons = {
  application: Layers,
  infrastructure: Cloud,
  data: Database,
  security: Shield
};

const categoryColors = {
  application: "text-cyan-400",
  infrastructure: "text-indigo-400",
  data: "text-emerald-400",
  security: "text-amber-400"
};

const complexityColors = {
  low: "bg-emerald-400/10 text-emerald-400",
  medium: "bg-amber-400/10 text-amber-400",
  high: "bg-red-400/10 text-red-400"
};

// Template details with diagrams and descriptions
const templateDetails = {
  microservices: {
    fullDescription: `L'architecture microservices décompose une application en services indépendants, 
    chacun responsable d'une fonction métier spécifique. Les services communiquent via API REST ou messaging.`,
    benefits: [
      "Scalabilité indépendante par service",
      "Déploiement continu facilité",
      "Isolation des pannes",
      "Liberté technologique par service"
    ],
    useCases: ["E-commerce", "Plateformes SaaS", "Applications bancaires", "Streaming"],
    diagram: `flowchart TB
    subgraph Gateway["API Gateway"]
        AG[Kong/Nginx]
    end
    subgraph Services["Microservices"]
        Auth[Auth Service]
        User[User Service]
        Order[Order Service]
        Payment[Payment Service]
    end
    subgraph Data["Data Layer"]
        DB1[(Users DB)]
        DB2[(Orders DB)]
        DB3[(Payments DB)]
        Cache[(Redis Cache)]
    end
    subgraph Messaging["Event Bus"]
        Kafka[Apache Kafka]
    end
    
    AG --> Auth
    AG --> User
    AG --> Order
    AG --> Payment
    
    User --> DB1
    Order --> DB2
    Payment --> DB3
    
    Auth --> Cache
    Order --> Kafka
    Kafka --> Payment`
  },
  serverless: {
    fullDescription: `L'architecture serverless permet d'exécuter du code sans gérer de serveurs. 
    Les fonctions sont déclenchées par des événements et facturées à l'utilisation.`,
    benefits: [
      "Pas de gestion de serveurs",
      "Scaling automatique",
      "Paiement à l'utilisation",
      "Temps de mise en marché réduit"
    ],
    useCases: ["APIs légères", "Traitement d'images", "Webhooks", "Scheduled tasks"],
    diagram: `flowchart LR
    subgraph Triggers["Déclencheurs"]
        HTTP[HTTP Request]
        S3[S3 Event]
        Schedule[CloudWatch]
        Queue[SQS Message]
    end
    subgraph Functions["Lambda Functions"]
        F1[API Handler]
        F2[Image Processor]
        F3[Scheduled Job]
        F4[Queue Worker]
    end
    subgraph Storage["Stockage"]
        DDB[(DynamoDB)]
        S3B[(S3 Bucket)]
    end
    
    HTTP --> F1
    S3 --> F2
    Schedule --> F3
    Queue --> F4
    
    F1 --> DDB
    F2 --> S3B
    F3 --> DDB
    F4 --> DDB`
  },
  "data-lake": {
    fullDescription: `Une architecture Data Lake centralise toutes les données (structurées et non structurées) 
    dans un référentiel unique pour l'analytics et le machine learning.`,
    benefits: [
      "Stockage de données brutes",
      "Analyses avancées possibles",
      "Support ML/AI",
      "Schéma à la lecture"
    ],
    useCases: ["Big Data Analytics", "Machine Learning", "Business Intelligence", "IoT"],
    diagram: `flowchart TB
    subgraph Sources["Sources de Données"]
        App[Applications]
        IoT[IoT Devices]
        DB[Databases]
        Files[Files/Logs]
    end
    subgraph Ingestion["Ingestion"]
        Kinesis[Kinesis/Kafka]
        Batch[AWS Glue]
    end
    subgraph Lake["Data Lake"]
        Raw[(Raw Zone)]
        Cleaned[(Cleaned Zone)]
        Curated[(Curated Zone)]
    end
    subgraph Analytics["Analytics"]
        Athena[Athena/Presto]
        ML[SageMaker]
        BI[QuickSight]
    end
    
    App --> Kinesis
    IoT --> Kinesis
    DB --> Batch
    Files --> Batch
    
    Kinesis --> Raw
    Batch --> Raw
    Raw --> Cleaned
    Cleaned --> Curated
    
    Curated --> Athena
    Curated --> ML
    Athena --> BI`
  },
  "hybrid-cloud": {
    fullDescription: `L'architecture hybride combine infrastructure on-premise et cloud public, 
    permettant de garder les données sensibles en interne tout en bénéficiant de la scalabilité cloud.`,
    benefits: [
      "Flexibilité maximale",
      "Conformité réglementaire",
      "Optimisation des coûts",
      "Migration progressive"
    ],
    useCases: ["Secteur bancaire", "Santé", "Gouvernement", "Entreprises réglementées"],
    diagram: `flowchart TB
    subgraph OnPrem["On-Premise"]
        FW[Firewall]
        subgraph Internal["Zone Interne"]
            Legacy[Legacy Systems]
            SecureDB[(Données Sensibles)]
            AD[Active Directory]
        end
    end
    subgraph Cloud["Cloud Public"]
        subgraph CloudApps["Applications"]
            Web[Web Tier]
            API[API Tier]
            Cache[(Cache)]
        end
        CDN[CDN]
    end
    subgraph Connectivity["Connectivité"]
        VPN[VPN/ExpressRoute]
    end
    
    Users --> CDN
    CDN --> Web
    Web --> API
    API --> Cache
    
    API --> VPN
    VPN --> FW
    FW --> Legacy
    Legacy --> SecureDB
    API --> AD`
  },
  "zero-trust": {
    fullDescription: `L'architecture Zero Trust part du principe "ne jamais faire confiance, toujours vérifier". 
    Chaque requête est authentifiée et autorisée, qu'elle vienne de l'intérieur ou l'extérieur du réseau.`,
    benefits: [
      "Sécurité renforcée",
      "Protection contre menaces internes",
      "Microsegmentation",
      "Visibilité complète"
    ],
    useCases: ["Entreprises post-COVID", "Travail à distance", "Multi-cloud", "Secteurs réglementés"],
    diagram: `flowchart TB
    subgraph Users["Utilisateurs"]
        Employee[Employés]
        Partner[Partenaires]
        Device[Devices]
    end
    subgraph Identity["Identity Layer"]
        IDP[Identity Provider]
        MFA[MFA]
        SSO[SSO]
    end
    subgraph Policy["Policy Engine"]
        PDP[Policy Decision]
        Context[Context Engine]
        Risk[Risk Score]
    end
    subgraph Resources["Ressources"]
        App1[App 1]
        App2[App 2]
        Data[(Data)]
    end
    
    Employee --> IDP
    Partner --> IDP
    Device --> IDP
    
    IDP --> MFA
    MFA --> SSO
    
    SSO --> PDP
    Context --> PDP
    Risk --> PDP
    
    PDP -->|Authorized| App1
    PDP -->|Authorized| App2
    PDP -->|Authorized| Data`
  },
  "event-driven": {
    fullDescription: `L'architecture event-driven permet aux composants de communiquer via des événements asynchrones, 
    offrant un couplage faible et une grande réactivité.`,
    benefits: [
      "Couplage faible",
      "Scalabilité élastique",
      "Résilience accrue",
      "Traçabilité des événements"
    ],
    useCases: ["Trading", "E-commerce temps réel", "IoT", "Notifications"],
    diagram: `flowchart LR
    subgraph Producers["Producteurs"]
        Web[Web App]
        Mobile[Mobile App]
        IoT[IoT Sensors]
    end
    subgraph Broker["Message Broker"]
        Kafka[Apache Kafka]
        Topics[Topics]
    end
    subgraph Consumers["Consommateurs"]
        Analytics[Analytics Service]
        Notif[Notification Service]
        Storage[Storage Service]
        ML[ML Pipeline]
    end
    
    Web --> Kafka
    Mobile --> Kafka
    IoT --> Kafka
    
    Kafka --> Topics
    
    Topics --> Analytics
    Topics --> Notif
    Topics --> Storage
    Topics --> ML`
  }
};

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleCreateProject = () => {
    // Navigate to new project with template info
    navigate(`/projects/new?template=${selectedTemplate.id}`);
    setDialogOpen(false);
  };

  const handleViewDiagram = () => {
    // Store template diagram in sessionStorage and navigate
    const details = templateDetails[selectedTemplate.id];
    if (details?.diagram) {
      sessionStorage.setItem('templateDiagram', JSON.stringify({
        title: selectedTemplate.name,
        diagram: details.diagram,
        type: 'flowchart'
      }));
      toast.success(language === 'fr' ? 'Diagramme chargé! Créez un projet pour le visualiser.' : 'Diagram loaded! Create a project to view it.');
    }
    setDialogOpen(false);
    navigate('/projects/new');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const details = selectedTemplate ? templateDetails[selectedTemplate.id] : null;

  return (
    <div className="space-y-8 animate-fade-in" data-testid="templates-page">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2">
          {t.templates.title}
        </h1>
        <p className="text-slate-400">
          {t.templates.subtitle}
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => {
          const Icon = categoryIcons[template.category] || Layers;
          const colorClass = categoryColors[template.category] || "text-primary";
          const hasDetails = templateDetails[template.id];
          
          return (
            <Card 
              key={template.id}
              className={`card-tech group cursor-pointer hover:border-primary/30 transition-all ${hasDetails ? '' : 'opacity-75'}`}
              onClick={() => handleTemplateClick(template)}
              data-testid={`template-${template.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge className={complexityColors[template.complexity]}>
                    {template.complexity === "low" ? t.templates.simple : 
                     template.complexity === "medium" ? t.templates.moderate : t.templates.complex}
                  </Badge>
                </div>
                <CardTitle className="font-heading text-white mt-4 group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {template.category}
                  </Badge>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-white/10">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center`}>
                    {(() => {
                      const Icon = categoryIcons[selectedTemplate.category] || Layers;
                      return <Icon className="w-7 h-7 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl text-white font-heading">
                      {selectedTemplate.name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {selectedTemplate.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {details ? (
                  <>
                    {/* Full Description */}
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {language === 'fr' ? 'Description' : 'Description'}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {details.fullDescription}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-white font-medium mb-3">
                        {language === 'fr' ? 'Avantages' : 'Benefits'}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {details.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h3 className="text-white font-medium mb-3">
                        {language === 'fr' ? 'Cas d\'utilisation' : 'Use Cases'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.useCases.map((useCase, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Diagram Preview */}
                    <div>
                      <h3 className="text-white font-medium mb-3">
                        {language === 'fr' ? 'Aperçu du Diagramme' : 'Diagram Preview'}
                      </h3>
                      <div className="bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-cyan-400 text-xs font-mono whitespace-pre">
                          {details.diagram}
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">
                      {language === 'fr' 
                        ? 'Détails du template bientôt disponibles.' 
                        : 'Template details coming soon.'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={handleCreateProject}
                    className="btn-primary flex-1"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Créer un Projet' : 'Create Project'}
                  </Button>
                  {details?.diagram && (
                    <Button
                      onClick={handleViewDiagram}
                      variant="outline"
                      className="flex-1"
                    >
                      <GitBranch className="w-4 h-4 mr-2" />
                      {language === 'fr' ? 'Utiliser ce Diagramme' : 'Use this Diagram'}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* TOGAF Section */}
      <div className="mt-12">
        <h2 className="font-heading font-semibold text-2xl text-white mb-6">
          {t.templates.togafFramework}
        </h2>
        <Card className="card-tech">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Architecture Vision", phase: "Phase A", color: "bg-cyan-500" },
                { name: "Business Architecture", phase: "Phase B", color: "bg-indigo-500" },
                { name: "Information Systems", phase: "Phase C", color: "bg-emerald-500" },
                { name: "Technology Architecture", phase: "Phase D", color: "bg-amber-500" }
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${phase.color} mx-auto mb-3 flex items-center justify-center`}>
                    <span className="text-white font-heading font-bold text-xl">
                      {phase.phase.split(" ")[1]}
                    </span>
                  </div>
                  <p className="text-white font-medium">{phase.name}</p>
                  <p className="text-slate-500 text-sm">{phase.phase}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ArchiMate Section */}
      <div className="mt-12">
        <h2 className="font-heading font-semibold text-2xl text-white mb-6">
          {t.templates.archimateLayers || 'Couches ArchiMate'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Business Layer", description: language === 'fr' ? "Processus, services et fonctions métier" : "Business processes, services and functions", color: "border-amber-500/30 bg-amber-500/5" },
            { name: "Application Layer", description: language === 'fr' ? "Applications et composants logiciels" : "Applications and software components", color: "border-cyan-500/30 bg-cyan-500/5" },
            { name: "Technology Layer", description: language === 'fr' ? "Infrastructure et plateformes" : "Infrastructure and platforms", color: "border-emerald-500/30 bg-emerald-500/5" }
          ].map((layer, index) => (
            <Card key={index} className={`card-tech border ${layer.color}`}>
              <CardContent className="p-6">
                <h3 className="font-heading font-medium text-white mb-2">{layer.name}</h3>
                <p className="text-slate-400 text-sm">{layer.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="card-tech mt-12 tracing-border">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-heading font-semibold text-xl text-white mb-2">
                {t.templates.bestPractices}
              </h3>
              <p className="text-slate-400">
                {t.templates.bestPracticesDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
