import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Cloud, 
  Check, 
  X,
  Globe,
  Cpu,
  Database,
  Shield,
  DollarSign,
  Zap,
  Server,
  HardDrive,
  Network,
  Bot,
  Lock,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Detailed comparison data with both languages
const getComparisonData = (lang) => ({
  compute: {
    title: lang === 'fr' ? "Compute" : "Compute",
    icon: Cpu,
    description: lang === 'fr' ? "Services de calcul et machines virtuelles" : "Computing services and virtual machines",
    aws: { 
      services: ["EC2", "Lambda", "ECS", "EKS", "Fargate", "Batch"],
      rating: 5,
      pricing: lang === 'fr' ? "À partir de $0.0116/h (t3.micro)" : "From $0.0116/h (t3.micro)",
      highlight: lang === 'fr' ? "Plus large choix d'instances" : "Widest instance selection"
    },
    azure: { 
      services: ["Virtual Machines", "Functions", "AKS", "Container Apps", "Batch"],
      rating: 5,
      pricing: lang === 'fr' ? "À partir de $0.0104/h (B1s)" : "From $0.0104/h (B1s)",
      highlight: lang === 'fr' ? "Hybrid Benefit pour licences" : "Hybrid Benefit for licenses"
    },
    gcp: { 
      services: ["Compute Engine", "Cloud Run", "GKE", "Cloud Functions", "Batch"],
      rating: 5,
      pricing: lang === 'fr' ? "À partir de $0.0100/h (e2-micro)" : "From $0.0100/h (e2-micro)",
      highlight: lang === 'fr' ? "Facturation à la seconde" : "Per-second billing"
    }
  },
  storage: {
    title: lang === 'fr' ? "Stockage" : "Storage",
    icon: HardDrive,
    description: lang === 'fr' ? "Stockage objet, bloc et fichiers" : "Object, block and file storage",
    aws: { 
      services: ["S3", "EBS", "EFS", "Glacier", "Storage Gateway"],
      rating: 5,
      pricing: lang === 'fr' ? "S3: $0.023/GB/mois" : "S3: $0.023/GB/month",
      highlight: lang === 'fr' ? "11 nines de durabilité" : "11 nines durability"
    },
    azure: { 
      services: ["Blob Storage", "Disk Storage", "Files", "Archive", "Data Lake"],
      rating: 4,
      pricing: lang === 'fr' ? "Blob: $0.018/GB/mois" : "Blob: $0.018/GB/month",
      highlight: lang === 'fr' ? "Tiering automatique" : "Automatic tiering"
    },
    gcp: { 
      services: ["Cloud Storage", "Persistent Disk", "Filestore", "Archive"],
      rating: 4,
      pricing: lang === 'fr' ? "Standard: $0.020/GB/mois" : "Standard: $0.020/GB/month",
      highlight: lang === 'fr' ? "Egress gratuit vers autres services GCP" : "Free egress to other GCP services"
    }
  },
  database: {
    title: lang === 'fr' ? "Base de données" : "Database",
    icon: Database,
    description: lang === 'fr' ? "Bases de données relationnelles et NoSQL" : "Relational and NoSQL databases",
    aws: { 
      services: ["RDS", "Aurora", "DynamoDB", "ElastiCache", "DocumentDB", "Neptune"],
      rating: 5,
      pricing: lang === 'fr' ? "RDS: à partir de $0.017/h" : "RDS: from $0.017/h",
      highlight: lang === 'fr' ? "Aurora 5x plus rapide que MySQL" : "Aurora 5x faster than MySQL"
    },
    azure: { 
      services: ["SQL Database", "Cosmos DB", "PostgreSQL", "MySQL", "Redis Cache"],
      rating: 5,
      pricing: lang === 'fr' ? "SQL: à partir de $0.015/h" : "SQL: from $0.015/h",
      highlight: lang === 'fr' ? "Cosmos DB multi-modèle" : "Cosmos DB multi-model"
    },
    gcp: { 
      services: ["Cloud SQL", "Cloud Spanner", "Firestore", "Bigtable", "Memorystore"],
      rating: 4,
      pricing: lang === 'fr' ? "Cloud SQL: à partir de $0.015/h" : "Cloud SQL: from $0.015/h",
      highlight: lang === 'fr' ? "Spanner = SQL + NoSQL scale" : "Spanner = SQL + NoSQL scale"
    }
  },
  networking: {
    title: lang === 'fr' ? "Réseau" : "Networking",
    icon: Network,
    description: lang === 'fr' ? "CDN, DNS, Load Balancing, VPN" : "CDN, DNS, Load Balancing, VPN",
    aws: { 
      services: ["VPC", "CloudFront", "Route 53", "ELB", "Direct Connect", "Transit Gateway"],
      rating: 5,
      pricing: lang === 'fr' ? "Egress: $0.09/GB" : "Egress: $0.09/GB",
      highlight: lang === 'fr' ? "Réseau global mature" : "Mature global network"
    },
    azure: { 
      services: ["VNet", "Azure CDN", "Traffic Manager", "Load Balancer", "ExpressRoute"],
      rating: 4,
      pricing: lang === 'fr' ? "Egress: $0.087/GB" : "Egress: $0.087/GB",
      highlight: lang === 'fr' ? "ExpressRoute jusqu'à 100 Gbps" : "ExpressRoute up to 100 Gbps"
    },
    gcp: { 
      services: ["VPC", "Cloud CDN", "Cloud DNS", "Cloud Load Balancing", "Cloud Interconnect"],
      rating: 5,
      pricing: lang === 'fr' ? "Egress: $0.085/GB" : "Egress: $0.085/GB",
      highlight: lang === 'fr' ? "Réseau premium Google" : "Google's premium network"
    }
  },
  security: {
    title: lang === 'fr' ? "Sécurité" : "Security",
    icon: Shield,
    description: lang === 'fr' ? "IAM, chiffrement, conformité" : "IAM, encryption, compliance",
    aws: { 
      services: ["IAM", "KMS", "WAF", "Shield", "GuardDuty", "Security Hub", "Macie"],
      rating: 5,
      pricing: lang === 'fr' ? "IAM gratuit, WAF: $5/règle/mois" : "IAM free, WAF: $5/rule/month",
      highlight: lang === 'fr' ? "143 certifications conformité" : "143 compliance certifications"
    },
    azure: { 
      services: ["Azure AD", "Key Vault", "Sentinel", "DDoS Protection", "Defender"],
      rating: 5,
      pricing: lang === 'fr' ? "AD gratuit, Sentinel: $2.46/GB" : "AD free, Sentinel: $2.46/GB",
      highlight: lang === 'fr' ? "Intégration AD native" : "Native AD integration"
    },
    gcp: { 
      services: ["Cloud IAM", "Cloud KMS", "Security Command Center", "Cloud Armor"],
      rating: 4,
      pricing: lang === 'fr' ? "IAM gratuit, Armor: $5/politique" : "IAM free, Armor: $5/policy",
      highlight: lang === 'fr' ? "BeyondCorp Zero Trust" : "BeyondCorp Zero Trust"
    }
  },
  ml_ai: {
    title: "ML/AI",
    icon: Bot,
    description: lang === 'fr' ? "Machine Learning et Intelligence Artificielle" : "Machine Learning and Artificial Intelligence",
    aws: { 
      services: ["SageMaker", "Rekognition", "Comprehend", "Lex", "Polly", "Bedrock"],
      rating: 4,
      pricing: lang === 'fr' ? "SageMaker: $0.05/h (ml.t3.medium)" : "SageMaker: $0.05/h (ml.t3.medium)",
      highlight: lang === 'fr' ? "Bedrock pour LLMs" : "Bedrock for LLMs"
    },
    azure: { 
      services: ["Azure ML", "Cognitive Services", "OpenAI Service", "Bot Service"],
      rating: 4,
      pricing: lang === 'fr' ? "Azure ML: $0.05/h" : "Azure ML: $0.05/h",
      highlight: lang === 'fr' ? "Partenariat exclusif OpenAI" : "Exclusive OpenAI partnership"
    },
    gcp: { 
      services: ["Vertex AI", "AutoML", "Cloud Vision", "Cloud NLP", "Gemini API"],
      rating: 5,
      pricing: lang === 'fr' ? "Vertex AI: à partir de $0.04/h" : "Vertex AI: from $0.04/h",
      highlight: lang === 'fr' ? "Leader ML avec TensorFlow" : "ML leader with TensorFlow"
    }
  },
  serverless: {
    title: "Serverless",
    icon: Zap,
    description: lang === 'fr' ? "Functions as a Service et événements" : "Functions as a Service and events",
    aws: { 
      services: ["Lambda", "API Gateway", "Step Functions", "EventBridge", "AppSync"],
      rating: 5,
      pricing: lang === 'fr' ? "Lambda: $0.20/million requêtes" : "Lambda: $0.20/million requests",
      highlight: lang === 'fr' ? "Écosystème serverless le plus mature" : "Most mature serverless ecosystem"
    },
    azure: { 
      services: ["Functions", "Logic Apps", "Event Grid", "Durable Functions"],
      rating: 4,
      pricing: lang === 'fr' ? "Functions: $0.20/million exécutions" : "Functions: $0.20/million executions",
      highlight: lang === 'fr' ? "Logic Apps low-code" : "Logic Apps low-code"
    },
    gcp: { 
      services: ["Cloud Functions", "Cloud Run", "Eventarc", "Workflows"],
      rating: 5,
      pricing: lang === 'fr' ? "Cloud Run: pay-per-use exact" : "Cloud Run: exact pay-per-use",
      highlight: lang === 'fr' ? "Cloud Run = containers serverless" : "Cloud Run = serverless containers"
    }
  },
  pricing: {
    title: lang === 'fr' ? "Tarification" : "Pricing",
    icon: DollarSign,
    description: lang === 'fr' ? "Modèles de facturation et remises" : "Billing models and discounts",
    aws: { 
      services: ["Pay-as-you-go", "Reserved Instances", "Savings Plans", "Spot Instances"],
      rating: 3,
      pricing: lang === 'fr' ? "Complexe mais flexible" : "Complex but flexible",
      highlight: lang === 'fr' ? "Spot jusqu'à -90%" : "Spot up to -90%"
    },
    azure: { 
      services: ["Pay-as-you-go", "Reserved", "Azure Hybrid Benefit", "Spot VMs"],
      rating: 4,
      pricing: lang === 'fr' ? "Hybrid Benefit = économies licences" : "Hybrid Benefit = license savings",
      highlight: lang === 'fr' ? "Hybrid Benefit jusqu'à -40%" : "Hybrid Benefit up to -40%"
    },
    gcp: { 
      services: ["Pay-as-you-go", "Committed Use", "Sustained Use", "Preemptible VMs"],
      rating: 4,
      pricing: lang === 'fr' ? "Remises automatiques" : "Automatic discounts",
      highlight: lang === 'fr' ? "Sustained Use automatique -30%" : "Auto Sustained Use -30%"
    }
  }
});

const getProviderData = (lang) => [
  {
    name: "AWS",
    logo: "aws",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    strengths: lang === 'fr' 
      ? ["Leader du marché (32%)", "200+ services", "Documentation extensive", "Communauté massive"]
      : ["Market leader (32%)", "200+ services", "Extensive documentation", "Massive community"],
    weaknesses: lang === 'fr'
      ? ["Tarification complexe", "Courbe d'apprentissage"]
      : ["Complex pricing", "Learning curve"],
    best_for: lang === 'fr'
      ? ["Startups", "Enterprise", "Big Data", "IoT"]
      : ["Startups", "Enterprise", "Big Data", "IoT"],
    regions: 33,
    services: 200
  },
  {
    name: "Azure",
    logo: "azure", 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    strengths: lang === 'fr'
      ? ["Intégration Microsoft", "Hybride excellent", "Enterprise ready", "AI/OpenAI"]
      : ["Microsoft integration", "Excellent hybrid", "Enterprise ready", "AI/OpenAI"],
    weaknesses: lang === 'fr'
      ? ["Documentation confuse", "Portail complexe"]
      : ["Confusing documentation", "Complex portal"],
    best_for: lang === 'fr'
      ? ["Entreprises Microsoft", "Hybride", "Secteur public", ".NET"]
      : ["Microsoft shops", "Hybrid", "Public sector", ".NET"],
    regions: 60,
    services: 150
  },
  {
    name: "GCP",
    logo: "gcp",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    strengths: lang === 'fr'
      ? ["ML/AI leader", "Kubernetes natif", "Réseau performant", "BigQuery"]
      : ["ML/AI leader", "Native Kubernetes", "Premium network", "BigQuery"],
    weaknesses: lang === 'fr'
      ? ["Moins de services", "Support limité"]
      : ["Fewer services", "Limited support"],
    best_for: lang === 'fr'
      ? ["Data Analytics", "ML/AI", "Containers", "Startups tech"]
      : ["Data Analytics", "ML/AI", "Containers", "Tech startups"],
    regions: 37,
    services: 100
  }
];

export default function CloudComparison() {
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();
  
  const providers = getProviderData(language);
  const comparisonData = getComparisonData(language);

  const renderRating = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-2.5 h-2.5 rounded-full ${
              star <= rating ? "bg-primary" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in" data-testid="cloud-comparison">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2">
          {language === 'fr' ? 'Comparaison Cloud Providers' : 'Cloud Providers Comparison'}
        </h1>
        <p className="text-slate-400">
          {language === 'fr' 
            ? 'AWS vs Azure vs GCP - Analyse comparative détaillée' 
            : 'AWS vs Azure vs GCP - Detailed comparative analysis'}
        </p>
      </div>

      {/* Provider Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card 
            key={provider.name} 
            className="card-tech"
            data-testid={`provider-${provider.name.toLowerCase()}`}
          >
            <CardHeader className="text-center border-b border-white/5">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-xl ${provider.bgColor} flex items-center justify-center p-3`}>
                  <Cloud className={`w-8 h-8 ${provider.color}`} />
                </div>
              </div>
              <CardTitle className="font-heading text-white text-2xl">
                {provider.name}
              </CardTitle>
              <div className="flex justify-center gap-4 mt-2 text-sm text-slate-400">
                <span>{provider.regions} {language === 'fr' ? 'Régions' : 'Regions'}</span>
                <span>{provider.services}+ Services</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'fr' ? 'Points Forts' : 'Strengths'}
                </p>
                <div className="space-y-2">
                  {provider.strengths.map((strength, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'fr' ? 'Points Faibles' : 'Weaknesses'}
                </p>
                <div className="space-y-2">
                  {provider.weaknesses.map((weakness, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-slate-300">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'fr' ? 'Idéal Pour' : 'Best For'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {provider.best_for.map((use, i) => (
                    <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison */}
      <Card className="card-tech">
        <CardHeader>
          <CardTitle className="font-heading text-white">
            {language === 'fr' ? 'Comparaison Détaillée par Service' : 'Detailed Service Comparison'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compute" className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent h-auto p-0 mb-6">
              {Object.entries(comparisonData).map(([key, data]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg py-2 px-3 text-xs"
                >
                  <data.icon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{data.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(comparisonData).map(([key, data]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                {/* Service Description */}
                <p className="text-slate-400 text-sm mb-4">{data.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {["aws", "azure", "gcp"].map((provider) => (
                    <div 
                      key={provider} 
                      className="p-5 rounded-lg bg-muted/30 border border-white/5 space-y-4"
                    >
                      {/* Provider Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-medium text-white uppercase">
                          {provider.toUpperCase()}
                        </span>
                        {renderRating(data[provider].rating)}
                      </div>
                      
                      {/* Services List */}
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          {language === 'fr' ? 'Services:' : 'Services:'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {data[provider].services.map((service, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Pricing */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          {language === 'fr' ? 'Tarif:' : 'Pricing:'}
                        </p>
                        <p className="text-sm text-emerald-400 font-mono">
                          {data[provider].pricing}
                        </p>
                      </div>
                      
                      {/* Highlight */}
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-primary flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {data[provider].highlight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Decision Matrix */}
      <Card className="card-tech">
        <CardHeader>
          <CardTitle className="font-heading text-white">
            {language === 'fr' ? 'Guide de Décision' : 'Decision Guide'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h3 className="font-heading font-medium text-amber-400 mb-3">
                {language === 'fr' ? 'Choisissez AWS si...' : 'Choose AWS if...'}
              </h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• {language === 'fr' ? "Vous avez besoin du plus large choix de services" : "You need the widest service selection"}</li>
                <li>• {language === 'fr' ? "Vous démarrez une startup tech" : "You're starting a tech startup"}</li>
                <li>• {language === 'fr' ? "Big Data et Analytics sont prioritaires" : "Big Data and Analytics are priorities"}</li>
                <li>• {language === 'fr' ? "Vous voulez la meilleure documentation" : "You want the best documentation"}</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h3 className="font-heading font-medium text-blue-400 mb-3">
                {language === 'fr' ? 'Choisissez Azure si...' : 'Choose Azure if...'}
              </h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• {language === 'fr' ? "Vous êtes dans l'écosystème Microsoft" : "You're in the Microsoft ecosystem"}</li>
                <li>• {language === 'fr' ? "Vous avez besoin d'hybride cloud" : "You need hybrid cloud"}</li>
                <li>• {language === 'fr' ? "Conformité secteur public/santé requise" : "Public sector/healthcare compliance needed"}</li>
                <li>• {language === 'fr' ? "Vous voulez accès à OpenAI/GPT-4" : "You want access to OpenAI/GPT-4"}</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h3 className="font-heading font-medium text-red-400 mb-3">
                {language === 'fr' ? 'Choisissez GCP si...' : 'Choose GCP if...'}
              </h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• {language === 'fr' ? "ML/AI est votre priorité #1" : "ML/AI is your #1 priority"}</li>
                <li>• {language === 'fr' ? "Kubernetes est central à votre stack" : "Kubernetes is central to your stack"}</li>
                <li>• {language === 'fr' ? "Vous cherchez le meilleur rapport qualité/prix" : "You're looking for the best value"}</li>
                <li>• {language === 'fr' ? "BigQuery pour data analytics" : "BigQuery for data analytics"}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Comparison Table */}
      <Card className="card-tech">
        <CardHeader>
          <CardTitle className="font-heading text-white">
            {language === 'fr' ? 'Tableau Comparatif Rapide' : 'Quick Comparison Table'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    {language === 'fr' ? 'Critère' : 'Criteria'}
                  </th>
                  <th className="text-center py-3 px-4 text-amber-400 font-medium">AWS</th>
                  <th className="text-center py-3 px-4 text-blue-400 font-medium">Azure</th>
                  <th className="text-center py-3 px-4 text-red-400 font-medium">GCP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { criteria: language === 'fr' ? "Part de marché" : "Market Share", aws: "32%", azure: "23%", gcp: "10%" },
                  { criteria: language === 'fr' ? "Nombre de services" : "Number of Services", aws: "200+", azure: "150+", gcp: "100+" },
                  { criteria: language === 'fr' ? "Régions mondiales" : "Global Regions", aws: "33", azure: "60+", gcp: "37" },
                  { criteria: language === 'fr' ? "Free tier" : "Free Tier", aws: "12 mois", azure: "12 mois", gcp: language === 'fr' ? "Toujours gratuit" : "Always free" },
                  { criteria: "Kubernetes", aws: "EKS", azure: "AKS", gcp: "GKE ⭐" },
                  { criteria: "Serverless", aws: "Lambda ⭐", azure: "Functions", gcp: "Cloud Run" },
                  { criteria: "ML/AI", aws: "SageMaker", azure: "Azure ML", gcp: "Vertex AI ⭐" },
                  { criteria: language === 'fr' ? "Support Enterprise" : "Enterprise Support", aws: "⭐⭐⭐⭐⭐", azure: "⭐⭐⭐⭐⭐", gcp: "⭐⭐⭐⭐" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-slate-300">{row.criteria}</td>
                    <td className="py-3 px-4 text-center text-white">{row.aws}</td>
                    <td className="py-3 px-4 text-center text-white">{row.azure}</td>
                    <td className="py-3 px-4 text-center text-white">{row.gcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
