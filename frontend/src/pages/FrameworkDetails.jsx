import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ChevronRight,
  Layers,
  Target,
  Users,
  Building2,
  Database,
  Server,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  ArrowRight,
  Download,
  Maximize2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useLanguage } from "../context/LanguageContext";

// TOGAF ADM Phases with detailed content
const togafPhases = [
  {
    id: "preliminary",
    phase: "Preliminary",
    color: "#64748b",
    icon: Target,
    title: { fr: "Phase Préliminaire", en: "Preliminary Phase" },
    description: { 
      fr: "Préparation et initiation des activités d'architecture", 
      en: "Preparation and initiation of architecture activities" 
    },
    objectives: {
      fr: [
        "Définir le cadre d'architecture de l'entreprise",
        "Identifier les parties prenantes clés",
        "Établir les principes d'architecture",
        "Mettre en place l'équipe d'architecture"
      ],
      en: [
        "Define the enterprise architecture framework",
        "Identify key stakeholders",
        "Establish architecture principles",
        "Set up the architecture team"
      ]
    },
    deliverables: {
      fr: ["Cadre d'architecture", "Principes d'architecture", "Modèle organisationnel"],
      en: ["Architecture framework", "Architecture principles", "Organizational model"]
    },
    inputs: ["Business strategy", "IT strategy", "Organizational structure"],
    outputs: ["Architecture principles", "Tailored framework", "Initial Architecture Repository"]
  },
  {
    id: "A",
    phase: "Phase A",
    color: "#06b6d4",
    icon: Target,
    title: { fr: "Vision de l'Architecture", en: "Architecture Vision" },
    description: { 
      fr: "Établir une vision de haut niveau des capacités et valeur métier", 
      en: "Establish a high-level vision of capabilities and business value" 
    },
    objectives: {
      fr: [
        "Valider le contexte métier et créer la demande d'architecture",
        "Obtenir l'approbation de la déclaration de travail",
        "Définir la portée et les contraintes",
        "Créer la vision de l'architecture"
      ],
      en: [
        "Validate business context and create architecture statement of work",
        "Obtain approval for statement of work",
        "Define scope and constraints",
        "Create the architecture vision"
      ]
    },
    deliverables: {
      fr: ["Demande de travail d'architecture", "Vision d'architecture", "Plan de communication"],
      en: ["Architecture statement of work", "Architecture vision", "Communications plan"]
    },
    inputs: ["Architecture request", "Business principles", "Architecture principles"],
    outputs: ["Architecture Vision", "Draft Architecture Definition Document", "Communications Plan"]
  },
  {
    id: "B",
    phase: "Phase B",
    color: "#6366f1",
    icon: Building2,
    title: { fr: "Architecture Métier", en: "Business Architecture" },
    description: { 
      fr: "Développer l'architecture métier cible et analyser les écarts", 
      en: "Develop target business architecture and analyze gaps" 
    },
    objectives: {
      fr: [
        "Sélectionner les modèles de référence et points de vue",
        "Développer la description de l'architecture métier de base",
        "Développer la description de l'architecture métier cible",
        "Effectuer l'analyse des écarts"
      ],
      en: [
        "Select reference models and viewpoints",
        "Develop baseline business architecture description",
        "Develop target business architecture description",
        "Perform gap analysis"
      ]
    },
    deliverables: {
      fr: ["Architecture métier de base", "Architecture métier cible", "Analyse des écarts"],
      en: ["Baseline business architecture", "Target business architecture", "Gap analysis"]
    },
    inputs: ["Architecture Vision", "Business principles", "Reference models"],
    outputs: ["Business Architecture Document", "Gap Analysis", "Updated Architecture Definition"]
  },
  {
    id: "C",
    phase: "Phase C",
    color: "#10b981",
    icon: Database,
    title: { fr: "Architecture des SI", en: "Information Systems Architecture" },
    description: { 
      fr: "Développer les architectures de données et d'applications cibles", 
      en: "Develop target data and application architectures" 
    },
    objectives: {
      fr: [
        "Développer l'architecture de données cible",
        "Développer l'architecture applicative cible",
        "Effectuer l'analyse des écarts pour les données et applications"
      ],
      en: [
        "Develop target data architecture",
        "Develop target application architecture",
        "Perform gap analysis for data and applications"
      ]
    },
    deliverables: {
      fr: ["Architecture de données", "Architecture applicative", "Matrice d'interaction"],
      en: ["Data architecture", "Application architecture", "Interaction matrix"]
    },
    inputs: ["Business Architecture", "Architecture Vision", "Data principles"],
    outputs: ["Data Architecture Document", "Application Architecture Document", "Gap Analysis"]
  },
  {
    id: "D",
    phase: "Phase D",
    color: "#f59e0b",
    icon: Server,
    title: { fr: "Architecture Technologique", en: "Technology Architecture" },
    description: { 
      fr: "Développer l'architecture technologique cible pour supporter les SI", 
      en: "Develop target technology architecture to support information systems" 
    },
    objectives: {
      fr: [
        "Développer l'architecture technologique cible",
        "Effectuer l'analyse des écarts technologiques",
        "Définir les composants de la feuille de route"
      ],
      en: [
        "Develop target technology architecture",
        "Perform technology gap analysis",
        "Define roadmap components"
      ]
    },
    deliverables: {
      fr: ["Architecture technologique cible", "Normes technologiques", "Plan de migration"],
      en: ["Target technology architecture", "Technology standards", "Migration plan"]
    },
    inputs: ["IS Architecture", "Technology principles", "Standards"],
    outputs: ["Technology Architecture Document", "Architecture Definition Document", "Transition Architectures"]
  },
  {
    id: "E",
    phase: "Phase E",
    color: "#ec4899",
    icon: Layers,
    title: { fr: "Opportunités & Solutions", en: "Opportunities & Solutions" },
    description: { 
      fr: "Planification de la mise en œuvre initiale et identification des véhicules de livraison", 
      en: "Initial implementation planning and identification of delivery vehicles" 
    },
    objectives: {
      fr: [
        "Évaluer et sélectionner les options de mise en œuvre",
        "Identifier les projets stratégiques",
        "Consolider la feuille de route d'architecture"
      ],
      en: [
        "Evaluate and select implementation options",
        "Identify strategic projects",
        "Consolidate architecture roadmap"
      ]
    },
    deliverables: {
      fr: ["Feuille de route d'architecture", "Plan de mise en œuvre", "Projets identifiés"],
      en: ["Architecture roadmap", "Implementation plan", "Identified projects"]
    },
    inputs: ["Gap Analysis results", "Architecture Definition", "Business goals"],
    outputs: ["Implementation and Migration Plan", "Architecture Roadmap", "Work Packages"]
  },
  {
    id: "F",
    phase: "Phase F",
    color: "#8b5cf6",
    icon: FileText,
    title: { fr: "Planification de la Migration", en: "Migration Planning" },
    description: { 
      fr: "Finaliser le plan de migration détaillé et les architectures de transition", 
      en: "Finalize detailed migration plan and transition architectures" 
    },
    objectives: {
      fr: [
        "Finaliser le plan de migration",
        "Définir l'architecture de transition",
        "Créer le contrat d'architecture"
      ],
      en: [
        "Finalize migration plan",
        "Define transition architecture",
        "Create architecture contract"
      ]
    },
    deliverables: {
      fr: ["Plan de migration finalisé", "Contrat d'architecture", "Architectures de transition"],
      en: ["Finalized migration plan", "Architecture contract", "Transition architectures"]
    },
    inputs: ["Implementation Plan", "Architecture Roadmap", "Work packages"],
    outputs: ["Detailed Migration Plan", "Architecture Contract", "Implementation Governance Model"]
  },
  {
    id: "G",
    phase: "Phase G",
    color: "#ef4444",
    icon: Zap,
    title: { fr: "Gouvernance de l'Implantation", en: "Implementation Governance" },
    description: { 
      fr: "Assurer la conformité de l'implémentation avec l'architecture définie", 
      en: "Ensure implementation conforms to defined architecture" 
    },
    objectives: {
      fr: [
        "Superviser les projets de mise en œuvre",
        "Effectuer les revues de conformité",
        "Gérer les demandes de changement"
      ],
      en: [
        "Supervise implementation projects",
        "Perform conformance reviews",
        "Manage change requests"
      ]
    },
    deliverables: {
      fr: ["Revues de conformité", "Recommandations", "Mises à jour du référentiel"],
      en: ["Conformance reviews", "Recommendations", "Repository updates"]
    },
    inputs: ["Architecture Contract", "Implementation Plan", "Project deliverables"],
    outputs: ["Conformance Assessment", "Change Requests", "Architecture-compliant Solutions"]
  },
  {
    id: "H",
    phase: "Phase H",
    color: "#14b8a6",
    icon: Shield,
    title: { fr: "Gestion du Changement", en: "Architecture Change Management" },
    description: { 
      fr: "Gérer les changements à l'architecture de manière continue", 
      en: "Manage changes to architecture on an ongoing basis" 
    },
    objectives: {
      fr: [
        "Surveiller l'environnement technologique et métier",
        "Gérer les demandes de changement",
        "Évaluer la performance de l'architecture"
      ],
      en: [
        "Monitor technology and business environment",
        "Manage change requests",
        "Assess architecture performance"
      ]
    },
    deliverables: {
      fr: ["Évaluations de changement", "Mises à jour d'architecture", "Nouvelles demandes ADM"],
      en: ["Change assessments", "Architecture updates", "New ADM requests"]
    },
    inputs: ["Change requests", "Performance metrics", "Technology trends"],
    outputs: ["Architecture Updates", "New Architecture Work Request", "Dispensations"]
  }
];

// ArchiMate layers and elements
const archimateElements = {
  motivation: {
    title: { fr: "Couche Motivation", en: "Motivation Layer" },
    color: "#8b5cf6",
    description: { 
      fr: "Modélise les motivations et intentions qui guident la conception", 
      en: "Models the motivations and intentions guiding the design" 
    },
    elements: [
      { name: "Stakeholder", icon: Users, desc: { fr: "Partie prenante", en: "Individual or group" } },
      { name: "Driver", icon: Zap, desc: { fr: "Facteur de changement", en: "Change driver" } },
      { name: "Goal", icon: Target, desc: { fr: "Objectif à atteindre", en: "Goal to achieve" } },
      { name: "Requirement", icon: CheckCircle2, desc: { fr: "Exigence", en: "Requirement" } },
      { name: "Principle", icon: Shield, desc: { fr: "Principe directeur", en: "Guiding principle" } }
    ]
  },
  strategy: {
    title: { fr: "Couche Stratégie", en: "Strategy Layer" },
    color: "#f59e0b",
    description: { 
      fr: "Modélise la direction stratégique et les capacités de l'entreprise", 
      en: "Models strategic direction and enterprise capabilities" 
    },
    elements: [
      { name: "Resource", icon: Database, desc: { fr: "Ressource", en: "Asset or resource" } },
      { name: "Capability", icon: Zap, desc: { fr: "Capacité métier", en: "Business capability" } },
      { name: "Course of Action", icon: ArrowRight, desc: { fr: "Plan d'action", en: "Action plan" } },
      { name: "Value Stream", icon: Layers, desc: { fr: "Chaîne de valeur", en: "Value stream" } }
    ]
  },
  business: {
    title: { fr: "Couche Métier", en: "Business Layer" },
    color: "#f59e0b",
    description: { 
      fr: "Modélise les processus, fonctions et services métier", 
      en: "Models business processes, functions and services" 
    },
    elements: [
      { name: "Business Actor", icon: Users, desc: { fr: "Acteur métier", en: "Business actor" } },
      { name: "Business Role", icon: Users, desc: { fr: "Rôle métier", en: "Business role" } },
      { name: "Business Process", icon: Layers, desc: { fr: "Processus métier", en: "Business process" } },
      { name: "Business Function", icon: Zap, desc: { fr: "Fonction métier", en: "Business function" } },
      { name: "Business Service", icon: Server, desc: { fr: "Service métier", en: "Business service" } },
      { name: "Business Object", icon: Database, desc: { fr: "Objet métier", en: "Business object" } }
    ]
  },
  application: {
    title: { fr: "Couche Application", en: "Application Layer" },
    color: "#06b6d4",
    description: { 
      fr: "Modélise les applications et composants logiciels", 
      en: "Models applications and software components" 
    },
    elements: [
      { name: "Application Component", icon: Layers, desc: { fr: "Composant applicatif", en: "App component" } },
      { name: "Application Interface", icon: ArrowRight, desc: { fr: "Interface applicative", en: "App interface" } },
      { name: "Application Function", icon: Zap, desc: { fr: "Fonction applicative", en: "App function" } },
      { name: "Application Service", icon: Server, desc: { fr: "Service applicatif", en: "App service" } },
      { name: "Data Object", icon: Database, desc: { fr: "Objet de données", en: "Data object" } }
    ]
  },
  technology: {
    title: { fr: "Couche Technologie", en: "Technology Layer" },
    color: "#10b981",
    description: { 
      fr: "Modélise l'infrastructure et les plateformes techniques", 
      en: "Models infrastructure and technical platforms" 
    },
    elements: [
      { name: "Node", icon: Server, desc: { fr: "Nœud/Serveur", en: "Node/Server" } },
      { name: "Device", icon: Server, desc: { fr: "Équipement", en: "Device" } },
      { name: "System Software", icon: Layers, desc: { fr: "Logiciel système", en: "System software" } },
      { name: "Technology Interface", icon: ArrowRight, desc: { fr: "Interface technique", en: "Tech interface" } },
      { name: "Technology Service", icon: Zap, desc: { fr: "Service technique", en: "Tech service" } },
      { name: "Artifact", icon: FileText, desc: { fr: "Artefact", en: "Artifact" } }
    ]
  },
  implementation: {
    title: { fr: "Couche Implémentation", en: "Implementation Layer" },
    color: "#ec4899",
    description: { 
      fr: "Modélise les projets et livrables de mise en œuvre", 
      en: "Models implementation projects and deliverables" 
    },
    elements: [
      { name: "Work Package", icon: Layers, desc: { fr: "Lot de travail", en: "Work package" } },
      { name: "Deliverable", icon: FileText, desc: { fr: "Livrable", en: "Deliverable" } },
      { name: "Plateau", icon: Target, desc: { fr: "Plateau/Jalon", en: "Plateau/Milestone" } },
      { name: "Gap", icon: ArrowRight, desc: { fr: "Écart à combler", en: "Gap to fill" } }
    ]
  }
};

export default function FrameworkDetails() {
  const { t, language } = useLanguage();
  const [selectedPhase, setSelectedPhase] = useState(togafPhases[1]);
  const [activeTab, setActiveTab] = useState("togaf");

  return (
    <div className="space-y-8 animate-fade-in" data-testid="framework-details">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/templates">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {language === 'fr' ? 'Frameworks d\'Architecture' : 'Architecture Frameworks'}
          </h1>
          <p className="text-slate-400">
            TOGAF ADM & ArchiMate 3.1
          </p>
        </div>
      </div>

      {/* Framework Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="togaf" className="data-[state=active]:bg-primary">
            TOGAF ADM
          </TabsTrigger>
          <TabsTrigger value="archimate" className="data-[state=active]:bg-primary">
            ArchiMate
          </TabsTrigger>
        </TabsList>

        {/* TOGAF Content */}
        <TabsContent value="togaf" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ADM Cycle Visualization */}
            <Card className="card-tech lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {language === 'fr' ? 'Cycle ADM' : 'ADM Cycle'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* ADM Wheel */}
                <div className="relative w-full aspect-square max-w-xs mx-auto">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Center circle - Requirements Management */}
                    <circle cx="150" cy="150" r="40" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
                    <text x="150" y="145" textAnchor="middle" fill="#94a3b8" fontSize="8">Requirements</text>
                    <text x="150" y="158" textAnchor="middle" fill="#94a3b8" fontSize="8">Management</text>
                    
                    {/* Phase segments */}
                    {togafPhases.map((phase, index) => {
                      const angle = (index * 40) - 90;
                      const x = 150 + 95 * Math.cos((angle * Math.PI) / 180);
                      const y = 150 + 95 * Math.sin((angle * Math.PI) / 180);
                      const isSelected = selectedPhase.id === phase.id;
                      
                      return (
                        <g key={phase.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPhase(phase)}>
                          <circle 
                            cx={x} 
                            cy={y} 
                            r={isSelected ? 28 : 24}
                            fill={isSelected ? phase.color : '#1e293b'}
                            stroke={phase.color}
                            strokeWidth={isSelected ? 3 : 2}
                            className="transition-all duration-300"
                          />
                          <text 
                            x={x} 
                            y={y + 4} 
                            textAnchor="middle" 
                            fill={isSelected ? 'white' : phase.color}
                            fontSize={isSelected ? 12 : 10}
                            fontWeight={isSelected ? 'bold' : 'normal'}
                          >
                            {phase.phase.replace('Phase ', '')}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Arrows between phases */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Phase list */}
                <div className="mt-4 space-y-1 max-h-[300px] overflow-y-auto">
                  {togafPhases.map((phase) => (
                    <button
                      key={phase.id}
                      onClick={() => setSelectedPhase(phase)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-2 ${
                        selectedPhase.id === phase.id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: phase.color }}
                      />
                      <span className={`text-sm ${selectedPhase.id === phase.id ? 'text-white' : 'text-slate-400'}`}>
                        {phase.title[language] || phase.title.en}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Phase Details */}
            <Card className="card-tech lg:col-span-2">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedPhase.color}20`, border: `2px solid ${selectedPhase.color}` }}
                  >
                    <selectedPhase.icon className="w-6 h-6" style={{ color: selectedPhase.color }} />
                  </div>
                  <div>
                    <Badge style={{ backgroundColor: `${selectedPhase.color}30`, color: selectedPhase.color }}>
                      {selectedPhase.phase}
                    </Badge>
                    <CardTitle className="text-white text-xl mt-1">
                      {selectedPhase.title[language] || selectedPhase.title.en}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="text-slate-300">
                  {selectedPhase.description[language] || selectedPhase.description.en}
                </p>

                {/* Objectives */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    {language === 'fr' ? 'Objectifs' : 'Objectives'}
                  </h4>
                  <ul className="space-y-2">
                    {(selectedPhase.objectives[language] || selectedPhase.objectives.en).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {language === 'fr' ? 'Livrables' : 'Deliverables'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedPhase.deliverables[language] || selectedPhase.deliverables.en).map((del, i) => (
                      <Badge key={i} variant="outline" className="text-slate-300">
                        {del}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Inputs & Outputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                    <h5 className="text-sm font-medium text-slate-400 mb-2">
                      {language === 'fr' ? 'Entrées' : 'Inputs'}
                    </h5>
                    <ul className="space-y-1">
                      {selectedPhase.inputs.map((input, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                    <h5 className="text-sm font-medium text-slate-400 mb-2">
                      {language === 'fr' ? 'Sorties' : 'Outputs'}
                    </h5>
                    <ul className="space-y-1">
                      {selectedPhase.outputs.map((output, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 text-primary" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ArchiMate Content */}
        <TabsContent value="archimate" className="mt-6">
          <div className="space-y-6">
            {/* ArchiMate Overview */}
            <Card className="card-tech">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-xl text-white mb-2">
                      ArchiMate 3.1 Specification
                    </h3>
                    <p className="text-slate-400">
                      {language === 'fr' 
                        ? 'ArchiMate est un langage de modélisation d\'architecture d\'entreprise indépendant qui fournit des instruments pour décrire, analyser et visualiser les architectures.'
                        : 'ArchiMate is an independent enterprise architecture modeling language that provides instruments to describe, analyze and visualize architectures.'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-primary/20 text-primary">Open Group Standard</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-400">v3.1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ArchiMate Layers */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(archimateElements).map(([key, layer]) => (
                <Card key={key} className="card-tech overflow-hidden">
                  <CardHeader className="pb-2" style={{ borderBottom: `2px solid ${layer.color}` }}>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-white">
                        {layer.title[language] || layer.title.en}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 mb-3">
                      {layer.description[language] || layer.description.en}
                    </p>
                    <div className="space-y-2">
                      {layer.elements.map((element, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                        >
                          <element.icon className="w-4 h-4" style={{ color: layer.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{element.name}</p>
                            <p className="text-xs text-slate-500 truncate">
                              {element.desc[language] || element.desc.en}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ArchiMate Relationships */}
            <Card className="card-tech">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'fr' ? 'Relations ArchiMate' : 'ArchiMate Relationships'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <h4 className="font-medium text-white mb-2">
                      {language === 'fr' ? 'Structurelles' : 'Structural'}
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• Composition</li>
                      <li>• Aggregation</li>
                      <li>• Assignment</li>
                      <li>• Realization</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <h4 className="font-medium text-white mb-2">
                      {language === 'fr' ? 'Dépendances' : 'Dependency'}
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• Serving</li>
                      <li>• Access</li>
                      <li>• Influence</li>
                      <li>• Association</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <h4 className="font-medium text-white mb-2">
                      {language === 'fr' ? 'Dynamiques' : 'Dynamic'}
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• Triggering</li>
                      <li>• Flow</li>
                      <li>• Specialization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
