import { useState, useEffect, useCallback } from "react";
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
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
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

// Diagram examples for the flip book
const diagramExamples = [
  {
    id: 1,
    title: { fr: "Architecture Microservices", en: "Microservices Architecture" },
    type: "C4 Container",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- API Gateway -->
        <rect x="140" y="20" width="120" height="50" rx="8" fill="#06b6d4" opacity="0.9"/>
        <text x="200" y="50" text-anchor="middle" fill="white" font-size="12" font-weight="bold">API Gateway</text>
        <!-- Services -->
        <rect x="20" y="120" width="90" height="60" rx="6" fill="#6366f1" opacity="0.9"/>
        <text x="65" y="145" text-anchor="middle" fill="white" font-size="10">User</text>
        <text x="65" y="160" text-anchor="middle" fill="white" font-size="10">Service</text>
        
        <rect x="130" y="120" width="90" height="60" rx="6" fill="#6366f1" opacity="0.9"/>
        <text x="175" y="145" text-anchor="middle" fill="white" font-size="10">Order</text>
        <text x="175" y="160" text-anchor="middle" fill="white" font-size="10">Service</text>
        
        <rect x="240" y="120" width="90" height="60" rx="6" fill="#6366f1" opacity="0.9"/>
        <text x="285" y="145" text-anchor="middle" fill="white" font-size="10">Payment</text>
        <text x="285" y="160" text-anchor="middle" fill="white" font-size="10">Service</text>
        
        <rect x="350" y="120" width="40" height="60" rx="6" fill="#6366f1" opacity="0.9"/>
        <text x="370" y="155" text-anchor="middle" fill="white" font-size="8">...</text>
        
        <!-- Databases -->
        <ellipse cx="65" cy="240" rx="35" ry="20" fill="#10b981" opacity="0.9"/>
        <text x="65" y="245" text-anchor="middle" fill="white" font-size="9">Users DB</text>
        
        <ellipse cx="175" cy="240" rx="35" ry="20" fill="#10b981" opacity="0.9"/>
        <text x="175" y="245" text-anchor="middle" fill="white" font-size="9">Orders DB</text>
        
        <ellipse cx="285" cy="240" rx="35" ry="20" fill="#10b981" opacity="0.9"/>
        <text x="285" y="245" text-anchor="middle" fill="white" font-size="9">Pay DB</text>
        
        <!-- Arrows -->
        <line x1="200" y1="70" x2="65" y2="120" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>
        <line x1="200" y1="70" x2="175" y2="120" stroke="#64748b" stroke-width="2"/>
        <line x1="200" y1="70" x2="285" y2="120" stroke="#64748b" stroke-width="2"/>
        <line x1="65" y1="180" x2="65" y2="220" stroke="#64748b" stroke-width="2"/>
        <line x1="175" y1="180" x2="175" y2="220" stroke="#64748b" stroke-width="2"/>
        <line x1="285" y1="180" x2="285" y2="220" stroke="#64748b" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 2,
    title: { fr: "Flux de Données", en: "Data Flow" },
    type: "Flowchart",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Start -->
        <circle cx="50" cy="150" r="25" fill="#06b6d4"/>
        <text x="50" y="155" text-anchor="middle" fill="white" font-size="10">Start</text>
        
        <!-- Process boxes -->
        <rect x="100" y="130" width="70" height="40" rx="4" fill="#6366f1"/>
        <text x="135" y="155" text-anchor="middle" fill="white" font-size="10">Ingestion</text>
        
        <!-- Decision diamond -->
        <polygon points="230,110 270,150 230,190 190,150" fill="#f59e0b"/>
        <text x="230" y="155" text-anchor="middle" fill="white" font-size="9">Valid?</text>
        
        <!-- Process -->
        <rect x="300" y="130" width="70" height="40" rx="4" fill="#10b981"/>
        <text x="335" y="155" text-anchor="middle" fill="white" font-size="10">Process</text>
        
        <!-- Error handling -->
        <rect x="190" y="220" width="80" height="40" rx="4" fill="#ef4444"/>
        <text x="230" y="245" text-anchor="middle" fill="white" font-size="10">Error Log</text>
        
        <!-- End -->
        <circle cx="335" cy="250" r="20" fill="#06b6d4"/>
        <text x="335" y="255" text-anchor="middle" fill="white" font-size="9">End</text>
        
        <!-- Arrows -->
        <line x1="75" y1="150" x2="100" y2="150" stroke="#64748b" stroke-width="2"/>
        <line x1="170" y1="150" x2="190" y2="150" stroke="#64748b" stroke-width="2"/>
        <line x1="270" y1="150" x2="300" y2="150" stroke="#64748b" stroke-width="2"/>
        <text x="285" y="145" fill="#10b981" font-size="9">Yes</text>
        <line x1="230" y1="190" x2="230" y2="220" stroke="#64748b" stroke-width="2"/>
        <text x="240" y="210" fill="#ef4444" font-size="9">No</text>
        <line x1="335" y1="170" x2="335" y2="230" stroke="#64748b" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 3,
    title: { fr: "Architecture Cloud AWS", en: "AWS Cloud Architecture" },
    type: "AWS Diagram",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- VPC -->
        <rect x="40" y="40" width="320" height="220" rx="10" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="55" y="60" fill="#f59e0b" font-size="11" font-weight="bold">VPC</text>
        
        <!-- Public Subnet -->
        <rect x="60" y="80" width="130" height="80" rx="6" fill="#10b981" opacity="0.2" stroke="#10b981"/>
        <text x="75" y="100" fill="#10b981" font-size="9">Public Subnet</text>
        
        <!-- EC2 -->
        <rect x="80" y="110" width="50" height="35" rx="4" fill="#f59e0b"/>
        <text x="105" y="132" text-anchor="middle" fill="white" font-size="9">EC2</text>
        
        <!-- ALB -->
        <rect x="140" y="110" width="40" height="35" rx="4" fill="#8b5cf6"/>
        <text x="160" y="132" text-anchor="middle" fill="white" font-size="8">ALB</text>
        
        <!-- Private Subnet -->
        <rect x="210" y="80" width="130" height="160" rx="6" fill="#6366f1" opacity="0.2" stroke="#6366f1"/>
        <text x="225" y="100" fill="#6366f1" font-size="9">Private Subnet</text>
        
        <!-- Lambda -->
        <rect x="230" y="110" width="45" height="30" rx="4" fill="#f59e0b"/>
        <text x="252" y="130" text-anchor="middle" fill="white" font-size="8">Lambda</text>
        
        <!-- RDS -->
        <ellipse cx="300" cy="125" rx="30" ry="18" fill="#3b82f6"/>
        <text x="300" y="130" text-anchor="middle" fill="white" font-size="9">RDS</text>
        
        <!-- S3 -->
        <rect x="230" y="160" width="45" height="30" rx="4" fill="#ef4444"/>
        <text x="252" y="180" text-anchor="middle" fill="white" font-size="9">S3</text>
        
        <!-- DynamoDB -->
        <rect x="285" y="160" width="45" height="30" rx="4" fill="#06b6d4"/>
        <text x="307" y="180" text-anchor="middle" fill="white" font-size="7">DynamoDB</text>
        
        <!-- CloudFront -->
        <rect x="155" y="10" width="90" height="25" rx="4" fill="#8b5cf6"/>
        <text x="200" y="27" text-anchor="middle" fill="white" font-size="9">CloudFront CDN</text>
        
        <!-- Arrows -->
        <line x1="200" y1="35" x2="160" y2="110" stroke="#64748b" stroke-width="1.5"/>
        <line x1="180" y1="127" x2="230" y2="125" stroke="#64748b" stroke-width="1.5"/>
        <line x1="275" y1="125" x2="270" y2="125" stroke="#64748b" stroke-width="1.5"/>
      </svg>
    `
  },
  {
    id: 4,
    title: { fr: "Diagramme de Séquence", en: "Sequence Diagram" },
    type: "Sequence",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Actors -->
        <rect x="30" y="20" width="60" height="30" rx="4" fill="#06b6d4"/>
        <text x="60" y="40" text-anchor="middle" fill="white" font-size="10">Client</text>
        <line x1="60" y1="50" x2="60" y2="280" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4"/>
        
        <rect x="130" y="20" width="60" height="30" rx="4" fill="#6366f1"/>
        <text x="160" y="40" text-anchor="middle" fill="white" font-size="10">API</text>
        <line x1="160" y1="50" x2="160" y2="280" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4"/>
        
        <rect x="230" y="20" width="60" height="30" rx="4" fill="#10b981"/>
        <text x="260" y="40" text-anchor="middle" fill="white" font-size="10">Service</text>
        <line x1="260" y1="50" x2="260" y2="280" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4"/>
        
        <rect x="330" y="20" width="50" height="30" rx="4" fill="#f59e0b"/>
        <text x="355" y="40" text-anchor="middle" fill="white" font-size="10">DB</text>
        <line x1="355" y1="50" x2="355" y2="280" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4"/>
        
        <!-- Messages -->
        <line x1="60" y1="80" x2="160" y2="80" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="110" y="75" text-anchor="middle" fill="#94a3b8" font-size="8">1. Request</text>
        
        <line x1="160" y1="110" x2="260" y2="110" stroke="#6366f1" stroke-width="2"/>
        <text x="210" y="105" text-anchor="middle" fill="#94a3b8" font-size="8">2. Validate</text>
        
        <line x1="260" y1="140" x2="355" y2="140" stroke="#10b981" stroke-width="2"/>
        <text x="307" y="135" text-anchor="middle" fill="#94a3b8" font-size="8">3. Query</text>
        
        <line x1="355" y1="170" x2="260" y2="170" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="307" y="165" text-anchor="middle" fill="#94a3b8" font-size="8">4. Data</text>
        
        <line x1="260" y1="200" x2="160" y2="200" stroke="#10b981" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="210" y="195" text-anchor="middle" fill="#94a3b8" font-size="8">5. Process</text>
        
        <line x1="160" y1="230" x2="60" y2="230" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="110" y="225" text-anchor="middle" fill="#94a3b8" font-size="8">6. Response</text>
      </svg>
    `
  },
  {
    id: 5,
    title: { fr: "Modèle de Données", en: "Data Model" },
    type: "ER Diagram",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- User Entity -->
        <rect x="20" y="40" width="100" height="100" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
        <rect x="20" y="40" width="100" height="25" rx="6" fill="#06b6d4"/>
        <text x="70" y="57" text-anchor="middle" fill="white" font-size="10" font-weight="bold">User</text>
        <text x="30" y="80" fill="#94a3b8" font-size="9">🔑 id: UUID</text>
        <text x="30" y="95" fill="#94a3b8" font-size="9">name: String</text>
        <text x="30" y="110" fill="#94a3b8" font-size="9">email: String</text>
        <text x="30" y="125" fill="#94a3b8" font-size="9">created: Date</text>
        
        <!-- Order Entity -->
        <rect x="150" y="40" width="100" height="110" rx="6" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
        <rect x="150" y="40" width="100" height="25" rx="6" fill="#6366f1"/>
        <text x="200" y="57" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Order</text>
        <text x="160" y="80" fill="#94a3b8" font-size="9">🔑 id: UUID</text>
        <text x="160" y="95" fill="#94a3b8" font-size="9">🔗 user_id: FK</text>
        <text x="160" y="110" fill="#94a3b8" font-size="9">total: Decimal</text>
        <text x="160" y="125" fill="#94a3b8" font-size="9">status: Enum</text>
        <text x="160" y="140" fill="#94a3b8" font-size="9">created: Date</text>
        
        <!-- Product Entity -->
        <rect x="280" y="40" width="100" height="100" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
        <rect x="280" y="40" width="100" height="25" rx="6" fill="#10b981"/>
        <text x="330" y="57" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Product</text>
        <text x="290" y="80" fill="#94a3b8" font-size="9">🔑 id: UUID</text>
        <text x="290" y="95" fill="#94a3b8" font-size="9">name: String</text>
        <text x="290" y="110" fill="#94a3b8" font-size="9">price: Decimal</text>
        <text x="290" y="125" fill="#94a3b8" font-size="9">stock: Int</text>
        
        <!-- OrderItem Entity -->
        <rect x="150" y="180" width="100" height="90" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <rect x="150" y="180" width="100" height="25" rx="6" fill="#f59e0b"/>
        <text x="200" y="197" text-anchor="middle" fill="white" font-size="10" font-weight="bold">OrderItem</text>
        <text x="160" y="220" fill="#94a3b8" font-size="9">🔗 order_id: FK</text>
        <text x="160" y="235" fill="#94a3b8" font-size="9">🔗 product_id: FK</text>
        <text x="160" y="250" fill="#94a3b8" font-size="9">quantity: Int</text>
        
        <!-- Relations -->
        <line x1="120" y1="90" x2="150" y2="90" stroke="#64748b" stroke-width="2"/>
        <text x="135" y="85" fill="#64748b" font-size="8">1:N</text>
        
        <line x1="200" y1="150" x2="200" y2="180" stroke="#64748b" stroke-width="2"/>
        <text x="210" y="170" fill="#64748b" font-size="8">1:N</text>
        
        <line x1="250" y1="225" x2="280" y2="90" stroke="#64748b" stroke-width="2"/>
        <text x="275" y="160" fill="#64748b" font-size="8">N:1</text>
      </svg>
    `
  },
  {
    id: 6,
    title: { fr: "Architecture Hexagonale", en: "Hexagonal Architecture" },
    type: "Architecture Pattern",
    svg: `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Core Hexagon -->
        <polygon points="200,50 280,90 280,170 200,210 120,170 120,90" fill="#1e293b" stroke="#06b6d4" stroke-width="3"/>
        <text x="200" y="120" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="bold">Domain</text>
        <text x="200" y="140" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="bold">Core</text>
        <text x="200" y="160" text-anchor="middle" fill="#94a3b8" font-size="9">Business Logic</text>
        
        <!-- Left Ports (Driving) -->
        <rect x="20" y="70" width="70" height="35" rx="4" fill="#10b981"/>
        <text x="55" y="92" text-anchor="middle" fill="white" font-size="9">REST API</text>
        
        <rect x="20" y="120" width="70" height="35" rx="4" fill="#10b981"/>
        <text x="55" y="142" text-anchor="middle" fill="white" font-size="9">GraphQL</text>
        
        <rect x="20" y="170" width="70" height="35" rx="4" fill="#10b981"/>
        <text x="55" y="192" text-anchor="middle" fill="white" font-size="9">CLI</text>
        
        <!-- Right Ports (Driven) -->
        <rect x="310" y="70" width="70" height="35" rx="4" fill="#6366f1"/>
        <text x="345" y="92" text-anchor="middle" fill="white" font-size="9">Database</text>
        
        <rect x="310" y="120" width="70" height="35" rx="4" fill="#6366f1"/>
        <text x="345" y="142" text-anchor="middle" fill="white" font-size="9">Cache</text>
        
        <rect x="310" y="170" width="70" height="35" rx="4" fill="#6366f1"/>
        <text x="345" y="192" text-anchor="middle" fill="white" font-size="9">External API</text>
        
        <!-- Labels -->
        <text x="55" y="55" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">Driving</text>
        <text x="55" y="67" text-anchor="middle" fill="#10b981" font-size="8">(Primary)</text>
        
        <text x="345" y="55" text-anchor="middle" fill="#6366f1" font-size="10" font-weight="bold">Driven</text>
        <text x="345" y="67" text-anchor="middle" fill="#6366f1" font-size="8">(Secondary)</text>
        
        <!-- Arrows -->
        <line x1="90" y1="87" x2="120" y2="100" stroke="#10b981" stroke-width="2"/>
        <line x1="90" y1="137" x2="120" y2="130" stroke="#10b981" stroke-width="2"/>
        <line x1="90" y1="187" x2="120" y2="160" stroke="#10b981" stroke-width="2"/>
        
        <line x1="280" y1="100" x2="310" y2="87" stroke="#6366f1" stroke-width="2"/>
        <line x1="280" y1="130" x2="310" y2="137" stroke="#6366f1" stroke-width="2"/>
        <line x1="280" y1="160" x2="310" y2="187" stroke="#6366f1" stroke-width="2"/>
        
        <!-- Bottom text -->
        <text x="200" y="250" text-anchor="middle" fill="#64748b" font-size="10">Ports & Adapters Pattern</text>
        <text x="200" y="270" text-anchor="middle" fill="#94a3b8" font-size="9">Clean Architecture / DDD</text>
      </svg>
    `
  }
];

// FlipBook Component with smooth page flip animation
const DiagramFlipBook = ({ language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-flip every 5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, currentPage]);

  const goToNext = () => {
    if (isFlipping) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % diagramExamples.length);
      setIsFlipping(false);
    }, 600);
  };

  const goToPrev = () => {
    if (isFlipping) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + diagramExamples.length) % diagramExamples.length);
      setIsFlipping(false);
    }, 600);
  };

  const goToPage = (index) => {
    if (isFlipping || index === currentPage) return;
    setFlipDirection(index > currentPage ? 'next' : 'prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(index);
      setIsFlipping(false);
    }, 600);
  };

  const currentDiagram = diagramExamples[currentPage];

  return (
    <Card className="card-tech overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Book Container */}
          <div className="flex-1 relative" style={{ perspective: '2000px' }}>
            {/* Book */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 min-h-[400px] overflow-hidden">
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-950 to-transparent z-10" />
              
              {/* Page flip container */}
              <div 
                className={`relative transition-all duration-600 ease-in-out ${
                  isFlipping 
                    ? flipDirection === 'next' 
                      ? 'animate-flip-out-right' 
                      : 'animate-flip-out-left'
                    : 'animate-flip-in'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipping 
                    ? flipDirection === 'next'
                      ? 'rotateY(-90deg)'
                      : 'rotateY(90deg)'
                    : 'rotateY(0deg)',
                  transition: 'transform 0.6s ease-in-out'
                }}
              >
                {/* Page content */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10 backdrop-blur-sm">
                  {/* Page header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                        {currentDiagram.type}
                      </Badge>
                      <h3 className="font-heading font-semibold text-xl text-white">
                        {currentDiagram.title[language] || currentDiagram.title.en}
                      </h3>
                    </div>
                    <div className="text-slate-500 text-sm font-mono">
                      {currentPage + 1} / {diagramExamples.length}
                    </div>
                  </div>
                  
                  {/* SVG Diagram */}
                  <div 
                    className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-center min-h-[280px]"
                    dangerouslySetInnerHTML={{ __html: currentDiagram.svg }}
                  />
                </div>
              </div>
              
              {/* Page curl effect */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-slate-700/50 to-transparent rounded-tl-full pointer-events-none" />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:w-64 bg-slate-900/50 p-6 border-t lg:border-t-0 lg:border-l border-white/10">
            {/* Navigation buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="icon"
                onClick={goToPrev}
                disabled={isFlipping}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`rounded-full ${isAutoPlay ? 'bg-primary/20 border-primary' : ''}`}
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={goToNext}
                disabled={isFlipping}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mb-6">
              <p className="text-xs text-slate-500">
                {isAutoPlay 
                  ? (language === 'fr' ? 'Défilement auto: 5s' : 'Auto-scroll: 5s')
                  : (language === 'fr' ? 'En pause' : 'Paused')
                }
              </p>
            </div>

            {/* Page indicators */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                {language === 'fr' ? 'Exemples' : 'Examples'}
              </p>
              {diagramExamples.map((diagram, index) => (
                <button
                  key={diagram.id}
                  onClick={() => goToPage(index)}
                  className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                    index === currentPage
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-xs mr-2">{index + 1}.</span>
                  {diagram.title[language] || diagram.title.en}
                </button>
              ))}
            </div>

            {/* Progress bar */}
            {isAutoPlay && (
              <div className="mt-6">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
                    style={{
                      width: '100%',
                      animation: 'progress 5s linear infinite'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </Card>
  );
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

      {/* Architecture Examples - Book Flip Effect */}
      <div className="mt-12">
        <h2 className="font-heading font-semibold text-2xl text-white mb-6">
          {language === 'fr' ? 'Exemples de Diagrammes' : 'Diagram Examples'}
        </h2>
        <DiagramFlipBook language={language} />
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
