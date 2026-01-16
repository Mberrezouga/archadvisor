import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import mermaid from "mermaid";
import { 
  GitBranch, 
  ArrowLeft,
  Loader2,
  Download,
  Copy,
  Check,
  Sparkles,
  Code,
  Image,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Initialize mermaid with better config
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#06b6d4",
    primaryTextColor: "#f8fafc",
    primaryBorderColor: "#334155",
    lineColor: "#64748b",
    secondaryColor: "#6366f1",
    tertiaryColor: "#1e293b",
    background: "#0f172a",
    mainBkg: "#1e293b",
    nodeBorder: "#334155",
    clusterBkg: "#1e293b",
    clusterBorder: "#334155",
    titleColor: "#f8fafc",
    edgeLabelBackground: "#1e293b"
  },
  flowchart: { 
    curve: 'basis',
    padding: 20
  },
  sequence: {
    actorMargin: 50,
    boxMargin: 10,
    mirrorActors: false
  }
});

const diagramTypes = [
  { id: "flowchart", label: "Flowchart", category: "Basique" },
  { id: "sequence", label: "Diagramme de Séquence", category: "Basique" },
  { id: "class", label: "Diagramme de Classes", category: "Basique" },
  { id: "state", label: "Diagramme d'États", category: "Basique" },
  { id: "er", label: "Entity Relationship (ERD)", category: "Données" },
  { id: "journey", label: "User Journey", category: "UX" },
  { id: "gantt", label: "Diagramme Gantt", category: "Projet" },
  { id: "pie", label: "Diagramme Circulaire", category: "Stats" },
  { id: "mindmap", label: "Mind Map", category: "Conception" },
  { id: "timeline", label: "Timeline", category: "Projet" },
  { id: "c4_context", label: "C4 - Context", category: "Architecture" },
  { id: "c4_container", label: "C4 - Container", category: "Architecture" },
  { id: "c4_component", label: "C4 - Component", category: "Architecture" },
  { id: "aws", label: "Architecture AWS", category: "Cloud" },
  { id: "azure", label: "Architecture Azure", category: "Cloud" },
  { id: "gcp", label: "Architecture GCP", category: "Cloud" },
  { id: "microservices", label: "Microservices", category: "Architecture" },
  { id: "network", label: "Réseau / Infrastructure", category: "Infrastructure" },
  { id: "deployment", label: "Déploiement CI/CD", category: "DevOps" }
];

const diagramTemplates = {
  flowchart: `flowchart TD
    A[Début] --> B{Validation?}
    B -->|Oui| C[Traitement]
    B -->|Non| D[Erreur]
    C --> E[(Base de données)]
    E --> F[Notification]
    F --> G[Fin]
    D --> H[Log Erreur]
    H --> G`,

  sequence: `sequenceDiagram
    participant U as Utilisateur
    participant W as Frontend
    participant A as API Gateway
    participant S as Service
    participant D as Database
    participant C as Cache
    
    U->>W: Requête
    W->>A: API Call (JWT)
    A->>A: Validation Token
    A->>C: Check Cache
    alt Cache Hit
        C-->>A: Données
    else Cache Miss
        A->>S: Process Request
        S->>D: Query
        D-->>S: Result
        S->>C: Update Cache
        S-->>A: Response
    end
    A-->>W: JSON Response
    W-->>U: UI Update`,

  class: `classDiagram
    class User {
        +String id
        +String email
        +String name
        +login()
        +logout()
    }
    class Project {
        +String id
        +String name
        +Date createdAt
        +analyze()
        +export()
    }
    class Analysis {
        +String id
        +String type
        +Object result
        +generate()
    }
    User "1" --> "*" Project : owns
    Project "1" --> "*" Analysis : contains`,

  state: `stateDiagram-v2
    [*] --> Draft
    Draft --> InReview : submit()
    InReview --> Approved : approve()
    InReview --> Rejected : reject()
    Rejected --> Draft : revise()
    Approved --> Published : publish()
    Published --> Archived : archive()
    Archived --> [*]
    
    state InReview {
        [*] --> TechnicalReview
        TechnicalReview --> SecurityReview
        SecurityReview --> FinalApproval
        FinalApproval --> [*]
    }`,

  er: `erDiagram
    USER ||--o{ PROJECT : creates
    USER {
        string id PK
        string email UK
        string name
        datetime created_at
    }
    PROJECT ||--|{ ANALYSIS : contains
    PROJECT {
        string id PK
        string name
        string description
        string user_id FK
        string status
    }
    ANALYSIS {
        string id PK
        string project_id FK
        string type
        json result
        datetime created_at
    }
    PROJECT ||--o{ DIAGRAM : has
    DIAGRAM {
        string id PK
        string project_id FK
        string type
        text mermaid_code
    }`,

  journey: `journey
    title Parcours Architecte - Nouveau Projet
    section Découverte
      Accès Dashboard: 5: Architecte
      Création Projet: 4: Architecte
      Définition Exigences: 3: Architecte
    section Analyse
      Choix Infrastructure: 4: Architecte, IA
      Comparaison Cloud: 5: Architecte, IA
      Estimation Coûts: 4: Architecte, IA
    section Documentation
      Génération Diagrammes: 5: Architecte
      Export Documents: 4: Architecte
      Révision Client: 3: Architecte, Client`,

  gantt: `gantt
    title Plan de Migration Cloud
    dateFormat  YYYY-MM-DD
    section Phase 1 - Préparation
    Audit Infrastructure     :a1, 2024-01-01, 30d
    Design Architecture      :a2, after a1, 20d
    Validation Sécurité      :a3, after a2, 15d
    section Phase 2 - Migration
    Setup Cloud Environment  :b1, after a3, 10d
    Migration Données        :b2, after b1, 25d
    Migration Applications   :b3, after b2, 30d
    section Phase 3 - Go Live
    Tests Performance        :c1, after b3, 15d
    Formation Équipes        :c2, after b3, 20d
    Go Live                  :milestone, after c1, 0d`,

  pie: `pie showData
    title Répartition Coûts Cloud
    "Compute (EC2/VMs)" : 45
    "Storage (S3/Blob)" : 20
    "Database (RDS)" : 15
    "Network Transfer" : 10
    "Autres Services" : 10`,

  mindmap: `mindmap
  root((Architecture Cloud))
    Infrastructure
      Compute
        VMs
        Containers
        Serverless
      Storage
        Object Storage
        Block Storage
        File Storage
      Network
        VPC
        Load Balancer
        CDN
    Sécurité
      IAM
      Encryption
      Firewall
      Monitoring
    Services
      Database
      Cache
      Queue
      API Gateway`,

  timeline: `timeline
    title Roadmap Architecture 2024-2025
    section Q1 2024
        Janvier : Audit Existant
                : Définition Vision
        Février : POC Cloud
        Mars : Validation Architecture
    section Q2 2024
        Avril : Phase 1 Migration
        Mai : Tests Intégration
        Juin : Go Live Phase 1
    section Q3 2024
        Juillet : Phase 2 Migration
        Août : Optimisation
        Septembre : Formation
    section Q4 2024
        Octobre : Phase 3
        Novembre : Documentation
        Décembre : Clôture Projet`,

  c4_context: `C4Context
    title Système ArchAdvisor - Context Diagram
    
    Person(architect, "Architecte TI", "Utilisateur principal du système")
    Person(client, "Client", "Destinataire des documents")
    
    System(archadvisor, "ArchAdvisor", "Système d'aide à la décision architecturale")
    
    System_Ext(openai, "OpenAI API", "Service IA pour recommandations")
    System_Ext(cloud, "Cloud Providers", "AWS, Azure, GCP APIs")
    
    Rel(architect, archadvisor, "Utilise", "HTTPS")
    Rel(archadvisor, openai, "Génère recommandations", "API")
    Rel(archadvisor, cloud, "Compare services", "API")
    Rel(architect, client, "Partage documents")`,

  c4_container: `C4Container
    title ArchAdvisor - Container Diagram
    
    Person(architect, "Architecte TI")
    
    Container_Boundary(app, "ArchAdvisor") {
        Container(web, "Application Web", "React", "Interface utilisateur")
        Container(api, "API Backend", "FastAPI", "Logique métier et IA")
        ContainerDb(db, "MongoDB", "Database", "Stockage projets et analyses")
        Container(cache, "Redis", "Cache", "Cache des résultats IA")
    }
    
    System_Ext(openai, "OpenAI", "GPT-5.2")
    
    Rel(architect, web, "Utilise", "HTTPS")
    Rel(web, api, "API Calls", "REST/JSON")
    Rel(api, db, "Lit/Écrit", "MongoDB Protocol")
    Rel(api, cache, "Cache", "Redis Protocol")
    Rel(api, openai, "Recommandations", "HTTPS")`,

  c4_component: `C4Component
    title API Backend - Component Diagram
    
    Container_Boundary(api, "API Backend") {
        Component(auth, "Auth Module", "JWT", "Authentification")
        Component(projects, "Projects Service", "CRUD", "Gestion projets")
        Component(analysis, "Analysis Engine", "AI", "Moteur d'analyse")
        Component(diagrams, "Diagram Generator", "Mermaid", "Génération diagrammes")
        Component(export, "Export Service", "PDF/DOCX", "Export documents")
        Component(data, "Data Access Layer", "Motor", "Accès MongoDB")
    }
    
    Rel(auth, projects, "Autorise")
    Rel(projects, analysis, "Déclenche")
    Rel(projects, diagrams, "Génère")
    Rel(projects, export, "Exporte")
    Rel(analysis, data, "Stocke")
    Rel(diagrams, data, "Stocke")`,

  aws: `flowchart TB
    subgraph Internet
        Users[fa:fa-users Utilisateurs]
        DNS[Route 53]
    end
    
    subgraph AWS["AWS Cloud"]
        subgraph Edge["Edge Services"]
            CF[CloudFront CDN]
            WAF[AWS WAF]
        end
        
        subgraph VPC["VPC - Production"]
            subgraph Public["Public Subnet"]
                ALB[Application Load Balancer]
                NAT[NAT Gateway]
            end
            
            subgraph Private["Private Subnet"]
                subgraph ECS["ECS Cluster"]
                    API[API Service]
                    Worker[Worker Service]
                end
                
                subgraph Data["Data Layer"]
                    RDS[(RDS PostgreSQL)]
                    Redis[(ElastiCache Redis)]
                    S3[(S3 Bucket)]
                end
            end
        end
        
        subgraph Monitoring["Monitoring"]
            CW[CloudWatch]
            XRay[X-Ray]
        end
    end
    
    Users --> DNS --> CF --> WAF --> ALB
    ALB --> API
    API --> RDS
    API --> Redis
    API --> S3
    Worker --> RDS
    API --> CW
    API --> XRay`,

  azure: `flowchart TB
    subgraph Internet
        Users[fa:fa-users Utilisateurs]
        DNS[Azure DNS]
    end
    
    subgraph Azure["Azure Cloud"]
        subgraph Edge["Front Door"]
            FD[Azure Front Door]
            WAF[Web Application Firewall]
        end
        
        subgraph VNet["Virtual Network"]
            subgraph AppSubnet["App Subnet"]
                AG[Application Gateway]
                subgraph AKS["AKS Cluster"]
                    API[API Pods]
                    Worker[Worker Pods]
                end
            end
            
            subgraph DataSubnet["Data Subnet"]
                SQL[(Azure SQL)]
                Redis[(Azure Cache for Redis)]
                Blob[(Blob Storage)]
            end
        end
        
        subgraph Services["Platform Services"]
            KV[Key Vault]
            AI[Azure OpenAI]
            Monitor[Azure Monitor]
        end
    end
    
    Users --> DNS --> FD --> WAF --> AG
    AG --> API
    API --> SQL
    API --> Redis
    API --> Blob
    API --> KV
    API --> AI
    API --> Monitor`,

  gcp: `flowchart TB
    subgraph Internet
        Users[fa:fa-users Utilisateurs]
        DNS[Cloud DNS]
    end
    
    subgraph GCP["Google Cloud Platform"]
        subgraph Edge["Global Load Balancing"]
            LB[Cloud Load Balancer]
            Armor[Cloud Armor]
            CDN[Cloud CDN]
        end
        
        subgraph VPC["VPC Network"]
            subgraph GKE["GKE Cluster"]
                API[API Deployment]
                Worker[Worker Deployment]
            end
            
            subgraph Data["Data Services"]
                SQL[(Cloud SQL)]
                Mem[(Memorystore Redis)]
                GCS[(Cloud Storage)]
            end
        end
        
        subgraph ML["AI/ML Services"]
            Vertex[Vertex AI]
            NLP[Natural Language API]
        end
        
        subgraph Ops["Operations"]
            Monitoring[Cloud Monitoring]
            Logging[Cloud Logging]
        end
    end
    
    Users --> DNS --> CDN --> LB --> Armor --> API
    API --> SQL
    API --> Mem
    API --> GCS
    API --> Vertex
    API --> Monitoring`,

  microservices: `flowchart TB
    subgraph Gateway["API Gateway Layer"]
        Kong[Kong Gateway]
        Auth[Auth Service]
    end
    
    subgraph Services["Microservices"]
        subgraph Core["Core Services"]
            ProjectSvc[Project Service]
            AnalysisSvc[Analysis Service]
            DiagramSvc[Diagram Service]
        end
        
        subgraph Support["Support Services"]
            ExportSvc[Export Service]
            NotifSvc[Notification Service]
            AuditSvc[Audit Service]
        end
    end
    
    subgraph Data["Data Layer"]
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
        S3[(Object Storage)]
    end
    
    subgraph Messaging["Event Bus"]
        Kafka[Apache Kafka]
    end
    
    Kong --> Auth
    Kong --> ProjectSvc
    Kong --> AnalysisSvc
    Kong --> DiagramSvc
    
    ProjectSvc --> MongoDB
    AnalysisSvc --> MongoDB
    AnalysisSvc --> Redis
    DiagramSvc --> S3
    
    ProjectSvc --> Kafka
    AnalysisSvc --> Kafka
    Kafka --> NotifSvc
    Kafka --> AuditSvc`,

  network: `flowchart TB
    subgraph External["Zone Externe"]
        Internet((Internet))
        Users[Utilisateurs]
    end
    
    subgraph DMZ["DMZ"]
        FW1[Firewall Externe]
        LB[Load Balancer]
        WAF[WAF]
        Reverse[Reverse Proxy]
    end
    
    subgraph Internal["Zone Interne"]
        FW2[Firewall Interne]
        
        subgraph AppZone["Zone Application"]
            Web[Serveurs Web]
            App[Serveurs Application]
        end
        
        subgraph DataZone["Zone Données"]
            DB[(Base de Données)]
            Cache[(Cache)]
            Storage[(Storage)]
        end
        
        subgraph MgmtZone["Zone Management"]
            Monitor[Monitoring]
            Log[Log Server]
            Backup[Backup Server]
        end
    end
    
    Users --> Internet --> FW1 --> WAF --> LB --> Reverse
    Reverse --> FW2 --> Web --> App
    App --> DB
    App --> Cache
    App --> Storage
    App --> Monitor
    Monitor --> Log`,

  deployment: `flowchart LR
    subgraph Dev["Development"]
        Code[Code Source]
        Git[GitHub]
    end
    
    subgraph CI["CI Pipeline"]
        Build[Build]
        Test[Tests]
        Scan[Security Scan]
        Docker[Docker Build]
    end
    
    subgraph Registry["Registry"]
        ECR[Container Registry]
    end
    
    subgraph CD["CD Pipeline"]
        ArgoCD[ArgoCD]
    end
    
    subgraph Envs["Environments"]
        Dev_Env[Dev]
        Staging[Staging]
        Prod[Production]
    end
    
    Code --> Git
    Git -->|Push| Build
    Build --> Test
    Test --> Scan
    Scan --> Docker
    Docker --> ECR
    ECR --> ArgoCD
    ArgoCD --> Dev_Env
    ArgoCD --> Staging
    ArgoCD -->|Manual Approval| Prod`
};

export default function DiagramGenerator() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [renderedDiagram, setRenderedDiagram] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [formData, setFormData] = useState({
    diagram_type: "flowchart",
    title: "",
    description: ""
  });

  const [currentDiagram, setCurrentDiagram] = useState(null);
  const [customCode, setCustomCode] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, diagramsRes] = await Promise.all([
        axios.get(`${API}/projects/${id}`),
        axios.get(`${API}/diagrams/${id}`)
      ]);
      setProject(projectRes.data);
      setDiagrams(diagramsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const renderMermaid = useCallback(async (code) => {
    try {
      const uniqueId = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(uniqueId, code);
      setRenderedDiagram(svg);
    } catch (error) {
      console.error("Mermaid render error:", error);
      setRenderedDiagram(`<div class="text-red-400 p-4 text-center">
        <p class="font-bold mb-2">Erreur de rendu</p>
        <p class="text-sm">${error.message}</p>
        <p class="text-xs mt-2 text-slate-500">Vérifiez la syntaxe Mermaid</p>
      </div>`);
    }
  }, []);

  useEffect(() => {
    if (currentDiagram?.mermaid_code) {
      renderMermaid(currentDiagram.mermaid_code);
    }
  }, [currentDiagram, renderMermaid]);

  const handleGenerateFromTemplate = () => {
    const template = diagramTemplates[formData.diagram_type];
    if (template) {
      const newDiagram = {
        id: `temp-${Date.now()}`,
        project_id: id,
        diagram_type: formData.diagram_type,
        title: formData.title || `Diagramme ${diagramTypes.find(t => t.id === formData.diagram_type)?.label}`,
        description: formData.description,
        mermaid_code: template,
        created_at: new Date().toISOString()
      };
      setCurrentDiagram(newDiagram);
      setCustomCode(template);
      toast.success("Template chargé! Modifiez le code si nécessaire.");
    }
  };

  const handleSaveDiagram = async () => {
    if (!currentDiagram) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/diagrams`, {
        project_id: id,
        diagram_type: currentDiagram.diagram_type,
        title: currentDiagram.title,
        description: currentDiagram.description || "",
        mermaid_code: customCode || currentDiagram.mermaid_code
      });
      
      setDiagrams(prev => [response.data, ...prev.filter(d => !d.id.startsWith('temp-'))]);
      setCurrentDiagram(response.data);
      toast.success("Diagramme sauvegardé!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Veuillez fournir un titre et une description");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/diagrams/ai-generate`, {
        project_id: id,
        ...formData
      });
      setCurrentDiagram(response.data);
      setCustomCode(response.data.mermaid_code);
      setDiagrams(prev => [response.data, ...prev]);
      toast.success("Diagramme généré par l'IA!");
    } catch (error) {
      console.error("Error generating:", error);
      toast.error("Erreur lors de la génération IA");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCustomCode(newCode);
    if (currentDiagram) {
      setCurrentDiagram(prev => ({ ...prev, mermaid_code: newCode }));
    }
  };

  const handleRefreshPreview = () => {
    if (customCode) {
      renderMermaid(customCode);
    }
  };

  const copyToClipboard = () => {
    const code = customCode || currentDiagram?.mermaid_code;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copié!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadSVG = () => {
    if (renderedDiagram) {
      const blob = new Blob([renderedDiagram], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentDiagram?.title || "diagram"}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("SVG téléchargé!");
    }
  };

  const downloadPNG = async () => {
    if (renderedDiagram) {
      const svgElement = document.createElement('div');
      svgElement.innerHTML = renderedDiagram;
      const svg = svgElement.querySelector('svg');
      
      if (svg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const a = document.createElement('a');
          a.download = `${currentDiagram?.title || "diagram"}.png`;
          a.href = canvas.toDataURL('image/png');
          a.click();
          toast.success("PNG téléchargé!");
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const groupedTypes = diagramTypes.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = [];
    acc[type.category].push(type);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in" data-testid="diagram-generator">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t.diagrams.title}
          </h1>
          <p className="text-slate-400">{project?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="card-tech">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-white flex items-center gap-2 text-lg">
                <GitBranch className="w-5 h-5 text-primary" />
                {t.diagrams.configuration}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Diagram Type Selector */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t.diagrams.diagramType}</Label>
                <Select 
                  value={formData.diagram_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, diagram_type: value }))}
                >
                  <SelectTrigger className="input-tech" data-testid="diagram-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {Object.entries(groupedTypes).map(([category, types]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase">
                          {category}
                        </div>
                        {types.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <Label className="text-slate-300">{t.diagrams.diagramTitle}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t.diagrams.diagramTitlePlaceholder}
                  className="input-tech"
                  data-testid="diagram-title-input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">{t.diagrams.diagramDescription}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t.diagrams.diagramDescPlaceholder}
                  className="input-tech min-h-[80px]"
                  data-testid="diagram-description-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateFromTemplate}
                  className="btn-secondary flex-1"
                  disabled={loading}
                  data-testid="generate-template-btn"
                >
                  <Code className="w-4 h-4 mr-2" />
                  {t.diagrams.template}
                </Button>
                <Button 
                  onClick={handleAIGenerate}
                  className="btn-primary flex-1"
                  disabled={loading}
                  data-testid="generate-ai-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t.diagrams.generateAI}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className="card-tech">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-white text-lg">
                {t.diagrams.mermaidCode}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefreshPreview}
                  className="h-8 w-8"
                  title={t.diagrams.refresh}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customCode || currentDiagram?.mermaid_code || ""}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={t.diagrams.selectDiagramPrompt}
                className="input-tech font-mono text-sm min-h-[200px] text-cyan-400"
                data-testid="mermaid-code-editor"
              />
              {currentDiagram && (
                <Button 
                  onClick={handleSaveDiagram}
                  className="btn-primary w-full mt-3"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.diagrams.save}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Previous Diagrams */}
          {diagrams.length > 0 && (
            <Card className="card-tech">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-white text-lg">
                  {t.diagrams.myDiagrams} ({diagrams.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {diagrams.filter(d => !d.id.startsWith('temp-')).map((diagram) => (
                    <div
                      key={diagram.id}
                      onClick={() => {
                        setCurrentDiagram(diagram);
                        setCustomCode(diagram.mermaid_code);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentDiagram?.id === diagram.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium text-white text-sm truncate">{diagram.title}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {diagramTypes.find(t => t.id === diagram.diagram_type)?.label || diagram.diagram_type}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-3">
          <Card className="card-tech h-full">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-3">
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                {t.diagrams.preview}
                {currentDiagram && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    - {currentDiagram.title}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 mr-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom(z => Math.max(25, z - 25))}
                    className="h-8 w-8"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-slate-400 w-12 text-center">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom(z => Math.min(200, z + 25))}
                    className="h-8 w-8"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Fullscreen */}
                <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full bg-background border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {currentDiagram?.title || "Diagramme"}
                      </DialogTitle>
                    </DialogHeader>
                    <div 
                      className="flex-1 overflow-auto bg-slate-900/50 rounded-lg p-4"
                      dangerouslySetInnerHTML={{ __html: renderedDiagram }}
                      style={{ minHeight: '70vh' }}
                    />
                  </DialogContent>
                </Dialog>

                {/* Download Buttons */}
                {currentDiagram && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadSVG}
                      className="h-8"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      SVG
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadPNG}
                      className="h-8"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PNG
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              {currentDiagram ? (
                <div 
                  className="w-full h-full overflow-auto bg-slate-900/30 p-6 flex items-center justify-center"
                  style={{ minHeight: '500px' }}
                >
                  <div 
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderedDiagram }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <GitBranch className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg mb-2">
                    {t.diagrams.noDiagramSelected}
                  </p>
                  <p className="text-slate-500 text-sm max-w-md">
                    {t.diagrams.selectDiagramPrompt}
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
