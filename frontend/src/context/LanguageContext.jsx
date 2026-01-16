import React, { createContext, useContext, useState, useEffect } from 'react';

// Traductions
const translations = {
  fr: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      newProject: "Nouveau Projet",
      cloudComparison: "Comparaison Cloud",
      templates: "Templates"
    },
    
    // Landing Page
    landing: {
      title: "ArchAdvisor",
      subtitle: "L'Assistant Intelligent de l'Architecte de Solutions TI",
      description: "Prenez des décisions d'architecture éclairées. Générez des diagrammes professionnels. Exportez des documents conformes aux standards de l'industrie.",
      getStarted: "Commencer Maintenant",
      compareCloud: "Comparer les Clouds",
      features: "Fonctionnalités Principales",
      featuresSubtitle: "Tout ce dont un architecte de solutions a besoin pour exceller",
      feature1Title: "Choix d'Architecture",
      feature1Desc: "Cloud, On-Premise ou Hybride - Recommandations basées sur vos besoins",
      feature2Title: "Comparaison Tech",
      feature2Desc: "AWS vs Azure vs GCP - Analyse comparative détaillée",
      feature3Title: "Estimation des Coûts",
      feature3Desc: "TCO précis avec optimisations et alternatives",
      feature4Title: "Analyse de Risques",
      feature4Desc: "Sécurité, conformité et mitigation des risques",
      feature5Title: "Génération de Diagrammes",
      feature5Desc: "C4, AWS, Azure - Mermaid et PlantUML",
      feature6Title: "Documents d'Architecture",
      feature6Desc: "Templates TOGAF et ArchiMate professionnels",
      whyTitle: "Pourquoi ArchAdvisor?",
      why1: "Recommandations IA en temps réel",
      why2: "Analyse de sécurité intégrée",
      why3: "Documents conformes aux standards",
      readyTitle: "Prêt à Architecturer?",
      readyDesc: "Commencez votre premier projet d'architecture dès maintenant",
      createProject: "Créer un Projet",
      diagramTypes: "Types de Diagrammes",
      cloudProviders: "Cloud Providers",
      aiRecommendations: "Recommandations"
    },
    
    // Dashboard
    dashboard: {
      title: "Dashboard",
      subtitle: "Vue d'ensemble de vos projets d'architecture",
      recentProjects: "Projets Récents",
      noProjects: "Aucun projet pour le moment",
      createFirst: "Créer votre premier projet",
      quickActions: "Actions Rapides",
      projects: "Projets",
      analyses: "Analyses",
      diagrams: "Diagrammes",
      documents: "Documents",
      needHelp: "Besoin d'aide pour démarrer?",
      helpDesc: "Utilisez nos templates TOGAF et ArchiMate pour structurer vos projets d'architecture.",
      viewTemplates: "Voir les Templates"
    },
    
    // New Project
    newProject: {
      title: "Nouveau Projet",
      subtitle: "Définissez les paramètres de votre projet d'architecture",
      basicInfo: "Informations de Base",
      projectName: "Nom du Projet",
      projectNamePlaceholder: "Ex: Migration Cloud Plateforme Banking",
      description: "Description",
      descriptionPlaceholder: "Décrivez les objectifs et le contexte du projet...",
      clientName: "Nom du Client",
      clientPlaceholder: "Ex: Banque Nationale",
      industry: "Industrie",
      selectOption: "Sélectionner...",
      projectParams: "Paramètres du Projet",
      budget: "Budget Estimé",
      timeline: "Échéancier",
      currentInfra: "Infrastructure Actuelle",
      requirements: "Exigences Clés",
      requirementPlaceholder: "Ex: Haute disponibilité 99.9%",
      addBtn: "Ajouter",
      cancel: "Annuler",
      create: "Créer le Projet",
      creating: "Création..."
    },
    
    // Project Detail
    project: {
      info: "Informations du Projet",
      client: "Client",
      industry: "Industrie",
      budget: "Budget",
      timeline: "Échéancier",
      requirements: "Exigences",
      actions: "Actions",
      archAnalysis: "Analyse d'Architecture",
      archAnalysisDesc: "Obtenez des recommandations IA",
      costEstimation: "Estimation des Coûts",
      costEstimationDesc: "Calculez le TCO",
      riskAnalysis: "Analyse de Risques",
      riskAnalysisDesc: "Sécurité et conformité",
      generateDiagrams: "Générer Diagrammes",
      generateDiagramsDesc: "C4, AWS, Azure...",
      exportDocs: "Exporter Documents",
      exportDocsDesc: "PDF, Word, Markdown"
    },
    
    // Analysis
    analysis: {
      title: "Analyse d'Architecture",
      type: "Type d'Analyse",
      infraChoice: "Choix d'Infrastructure",
      infraChoiceDesc: "Cloud Public, On-Premise ou Hybride",
      techComparison: "Comparaison Technologique",
      techComparisonDesc: "Comparer différentes options techniques",
      fullRecommendation: "Recommandation Complète",
      fullRecommendationDesc: "Architecture complète avec stack technique",
      projectContext: "Contexte du Projet",
      contextLabel: "Description / Contexte",
      contextPlaceholder: "Décrivez le contexte, les objectifs et les besoins...",
      techRequirements: "Exigences Techniques",
      techRequirementsPlaceholder: "Haute disponibilité, scalabilité, performance...",
      constraints: "Contraintes",
      constraintsPlaceholder: "Budget limité, équipe réduite, délai court...",
      analyzeWithAI: "Analyser avec l'IA",
      analyzing: "Analyse en cours...",
      aiRecommendation: "Recommandation IA",
      generatingRecommendation: "Génération de la recommandation...",
      analysisComplete: "Analyse terminée",
      fillFormPrompt: "Remplissez le formulaire et lancez l'analyse pour obtenir des recommandations"
    },
    
    // Cloud Comparison
    cloud: {
      title: "Comparaison Cloud Providers",
      subtitle: "AWS vs Azure vs GCP - Analyse comparative détaillée",
      strengths: "Points Forts",
      weaknesses: "Points Faibles",
      idealFor: "Idéal Pour",
      regions: "Régions",
      services: "Services",
      detailedComparison: "Comparaison Détaillée par Service",
      decisionGuide: "Guide de Décision",
      chooseAWSIf: "Choisissez AWS si...",
      chooseAzureIf: "Choisissez Azure si...",
      chooseGCPIf: "Choisissez GCP si..."
    },
    
    // Cost Estimation
    cost: {
      title: "Estimation des Coûts",
      infraParams: "Paramètres d'Infrastructure",
      cloudProvider: "Cloud Provider",
      computeInstances: "Instances Compute",
      storageTB: "Stockage (TB)",
      databaseType: "Type de Base de Données",
      monthlyUsers: "Utilisateurs Mensuels",
      dataTransfer: "Transfert de Données (GB/mois)",
      estimateWithAI: "Estimer avec l'IA",
      calculating: "Calcul en cours...",
      costEstimation: "Estimation des Coûts",
      monthlyEstimate: "Coût Mensuel Est.",
      tco3Years: "TCO 3 ans",
      configurePrompt: "Configurez vos paramètres et lancez l'estimation"
    },
    
    // Risk Analysis
    risk: {
      title: "Analyse de Risques & Sécurité",
      archDescription: "Description de l'Architecture",
      archDescPlaceholder: "Décrivez l'architecture à analyser (composants, flux de données, intégrations...)",
      complianceFrameworks: "Cadres de Conformité",
      securityPoints: "Points de Sécurité à Évaluer",
      dataEncryption: "Chiffrement des données",
      accessControl: "Contrôle d'accès (IAM)",
      monitoring: "Monitoring et logging",
      networkSecurity: "Sécurité réseau",
      analyzeRisks: "Analyser les Risques",
      riskReport: "Rapport de Risques",
      evaluatingRisks: "Évaluation des risques...",
      critical: "Critique",
      moderate: "Modéré",
      low: "Faible",
      configureRiskPrompt: "Configurez les paramètres et lancez l'analyse de risques"
    },
    
    // Diagrams
    diagrams: {
      title: "Générateur de Diagrammes",
      configuration: "Configuration",
      diagramType: "Type de Diagramme",
      diagramTitle: "Titre",
      diagramTitlePlaceholder: "Ex: Architecture Microservices",
      diagramDescription: "Description (pour génération IA)",
      diagramDescPlaceholder: "Décrivez les composants et relations...",
      template: "Template",
      generateAI: "IA",
      mermaidCode: "Code Mermaid",
      refresh: "Rafraîchir",
      save: "Sauvegarder",
      myDiagrams: "Mes Diagrammes",
      preview: "Prévisualisation",
      noDiagramSelected: "Aucun diagramme sélectionné",
      selectDiagramPrompt: "Choisissez un type de diagramme et cliquez sur \"Template\" pour charger un modèle, ou utilisez \"IA\" pour générer automatiquement."
    },
    
    // Documents
    docs: {
      title: "Export de Documents",
      chooseTemplate: "Choisir un Template",
      generateTemplate: "Template",
      generateAI: "Générer IA",
      generatedDoc: "Document Généré",
      selectTemplatePrompt: "Sélectionnez un template et générez un document",
      export: "Exporter",
      previousDocs: "Documents Précédents"
    },
    
    // Templates
    templates: {
      title: "Templates d'Architecture",
      subtitle: "Modèles prêts à l'emploi pour vos projets d'architecture",
      simple: "Simple",
      moderate: "Modéré",
      complex: "Complexe",
      togafFramework: "Framework TOGAF",
      archimateeLayers: "Couches ArchiMate",
      bestPractices: "Bonnes Pratiques d'Architecture",
      bestPracticesDesc: "Utilisez ces templates comme point de départ et adaptez-les à votre contexte. Combinez TOGAF pour la méthodologie et ArchiMate pour la modélisation."
    },
    
    // Common
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      save: "Sauvegarder",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      back: "Retour",
      next: "Suivant",
      download: "Télécharger",
      copy: "Copier",
      copied: "Copié!",
      language: "Langue",
      french: "Français",
      english: "English"
    },
    
    // Footer
    footer: {
      copyright: "All rights reserved by"
    },
    
    // Industries
    industries: [
      "Finance & Banque",
      "Santé",
      "Retail & E-commerce",
      "Technologie",
      "Manufacturier",
      "Gouvernement",
      "Éducation",
      "Autre"
    ],
    
    // Budget ranges
    budgetRanges: [
      "< 50 000 $",
      "50 000 $ - 200 000 $",
      "200 000 $ - 500 000 $",
      "500 000 $ - 1 M$",
      "> 1 M$"
    ],
    
    // Timelines
    timelines: [
      "< 3 mois",
      "3-6 mois",
      "6-12 mois",
      "> 12 mois"
    ],
    
    // Infrastructures
    infrastructures: [
      "On-Premise (100%)",
      "Cloud Public",
      "Hybride",
      "Multi-Cloud",
      "Aucune (Nouveau projet)"
    ]
  },
  
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      newProject: "New Project",
      cloudComparison: "Cloud Comparison",
      templates: "Templates"
    },
    
    // Landing Page
    landing: {
      title: "ArchAdvisor",
      subtitle: "The Intelligent IT Solutions Architect Assistant",
      description: "Make informed architecture decisions. Generate professional diagrams. Export industry-standard compliant documents.",
      getStarted: "Get Started",
      compareCloud: "Compare Clouds",
      features: "Main Features",
      featuresSubtitle: "Everything a solutions architect needs to excel",
      feature1Title: "Architecture Choice",
      feature1Desc: "Cloud, On-Premise or Hybrid - Recommendations based on your needs",
      feature2Title: "Tech Comparison",
      feature2Desc: "AWS vs Azure vs GCP - Detailed comparative analysis",
      feature3Title: "Cost Estimation",
      feature3Desc: "Accurate TCO with optimizations and alternatives",
      feature4Title: "Risk Analysis",
      feature4Desc: "Security, compliance and risk mitigation",
      feature5Title: "Diagram Generation",
      feature5Desc: "C4, AWS, Azure - Mermaid and PlantUML",
      feature6Title: "Architecture Documents",
      feature6Desc: "Professional TOGAF and ArchiMate templates",
      whyTitle: "Why ArchAdvisor?",
      why1: "Real-time AI recommendations",
      why2: "Built-in security analysis",
      why3: "Standards-compliant documents",
      readyTitle: "Ready to Architect?",
      readyDesc: "Start your first architecture project now",
      createProject: "Create Project",
      diagramTypes: "Diagram Types",
      cloudProviders: "Cloud Providers",
      aiRecommendations: "Recommendations"
    },
    
    // Dashboard
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your architecture projects",
      recentProjects: "Recent Projects",
      noProjects: "No projects yet",
      createFirst: "Create your first project",
      quickActions: "Quick Actions",
      projects: "Projects",
      analyses: "Analyses",
      diagrams: "Diagrams",
      documents: "Documents",
      needHelp: "Need help getting started?",
      helpDesc: "Use our TOGAF and ArchiMate templates to structure your architecture projects.",
      viewTemplates: "View Templates"
    },
    
    // New Project
    newProject: {
      title: "New Project",
      subtitle: "Define your architecture project parameters",
      basicInfo: "Basic Information",
      projectName: "Project Name",
      projectNamePlaceholder: "Ex: Banking Platform Cloud Migration",
      description: "Description",
      descriptionPlaceholder: "Describe the objectives and context of the project...",
      clientName: "Client Name",
      clientPlaceholder: "Ex: Banque Nationale",
      industry: "Industry",
      selectOption: "Select...",
      projectParams: "Project Parameters",
      budget: "Estimated Budget",
      timeline: "Timeline",
      currentInfra: "Current Infrastructure",
      requirements: "Key Requirements",
      requirementPlaceholder: "Ex: 99.9% high availability",
      addBtn: "Add",
      cancel: "Cancel",
      create: "Create Project",
      creating: "Creating..."
    },
    
    // Project Detail
    project: {
      info: "Project Information",
      client: "Client",
      industry: "Industry",
      budget: "Budget",
      timeline: "Timeline",
      requirements: "Requirements",
      actions: "Actions",
      archAnalysis: "Architecture Analysis",
      archAnalysisDesc: "Get AI recommendations",
      costEstimation: "Cost Estimation",
      costEstimationDesc: "Calculate TCO",
      riskAnalysis: "Risk Analysis",
      riskAnalysisDesc: "Security and compliance",
      generateDiagrams: "Generate Diagrams",
      generateDiagramsDesc: "C4, AWS, Azure...",
      exportDocs: "Export Documents",
      exportDocsDesc: "PDF, Word, Markdown"
    },
    
    // Analysis
    analysis: {
      title: "Architecture Analysis",
      type: "Analysis Type",
      infraChoice: "Infrastructure Choice",
      infraChoiceDesc: "Public Cloud, On-Premise or Hybrid",
      techComparison: "Technology Comparison",
      techComparisonDesc: "Compare different technical options",
      fullRecommendation: "Full Recommendation",
      fullRecommendationDesc: "Complete architecture with tech stack",
      projectContext: "Project Context",
      contextLabel: "Description / Context",
      contextPlaceholder: "Describe the context, objectives and needs...",
      techRequirements: "Technical Requirements",
      techRequirementsPlaceholder: "High availability, scalability, performance...",
      constraints: "Constraints",
      constraintsPlaceholder: "Limited budget, small team, tight deadline...",
      analyzeWithAI: "Analyze with AI",
      analyzing: "Analyzing...",
      aiRecommendation: "AI Recommendation",
      generatingRecommendation: "Generating recommendation...",
      analysisComplete: "Analysis complete",
      fillFormPrompt: "Fill in the form and run the analysis to get recommendations"
    },
    
    // Cloud Comparison
    cloud: {
      title: "Cloud Providers Comparison",
      subtitle: "AWS vs Azure vs GCP - Detailed comparative analysis",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      idealFor: "Ideal For",
      regions: "Regions",
      services: "Services",
      detailedComparison: "Detailed Service Comparison",
      decisionGuide: "Decision Guide",
      chooseAWSIf: "Choose AWS if...",
      chooseAzureIf: "Choose Azure if...",
      chooseGCPIf: "Choose GCP if..."
    },
    
    // Cost Estimation
    cost: {
      title: "Cost Estimation",
      infraParams: "Infrastructure Parameters",
      cloudProvider: "Cloud Provider",
      computeInstances: "Compute Instances",
      storageTB: "Storage (TB)",
      databaseType: "Database Type",
      monthlyUsers: "Monthly Users",
      dataTransfer: "Data Transfer (GB/month)",
      estimateWithAI: "Estimate with AI",
      calculating: "Calculating...",
      costEstimation: "Cost Estimation",
      monthlyEstimate: "Monthly Est. Cost",
      tco3Years: "3-Year TCO",
      configurePrompt: "Configure your parameters and run the estimation"
    },
    
    // Risk Analysis
    risk: {
      title: "Risk & Security Analysis",
      archDescription: "Architecture Description",
      archDescPlaceholder: "Describe the architecture to analyze (components, data flows, integrations...)",
      complianceFrameworks: "Compliance Frameworks",
      securityPoints: "Security Points to Evaluate",
      dataEncryption: "Data encryption",
      accessControl: "Access control (IAM)",
      monitoring: "Monitoring and logging",
      networkSecurity: "Network security",
      analyzeRisks: "Analyze Risks",
      riskReport: "Risk Report",
      evaluatingRisks: "Evaluating risks...",
      critical: "Critical",
      moderate: "Moderate",
      low: "Low",
      configureRiskPrompt: "Configure parameters and run the risk analysis"
    },
    
    // Diagrams
    diagrams: {
      title: "Diagram Generator",
      configuration: "Configuration",
      diagramType: "Diagram Type",
      diagramTitle: "Title",
      diagramTitlePlaceholder: "Ex: Microservices Architecture",
      diagramDescription: "Description (for AI generation)",
      diagramDescPlaceholder: "Describe components and relationships...",
      template: "Template",
      generateAI: "AI",
      mermaidCode: "Mermaid Code",
      refresh: "Refresh",
      save: "Save",
      myDiagrams: "My Diagrams",
      preview: "Preview",
      noDiagramSelected: "No diagram selected",
      selectDiagramPrompt: "Choose a diagram type and click \"Template\" to load a model, or use \"AI\" to generate automatically."
    },
    
    // Documents
    docs: {
      title: "Document Export",
      chooseTemplate: "Choose a Template",
      generateTemplate: "Template",
      generateAI: "Generate AI",
      generatedDoc: "Generated Document",
      selectTemplatePrompt: "Select a template and generate a document",
      export: "Export",
      previousDocs: "Previous Documents"
    },
    
    // Templates
    templates: {
      title: "Architecture Templates",
      subtitle: "Ready-to-use models for your architecture projects",
      simple: "Simple",
      moderate: "Moderate",
      complex: "Complex",
      togafFramework: "TOGAF Framework",
      archimateLayers: "ArchiMate Layers",
      bestPractices: "Architecture Best Practices",
      bestPracticesDesc: "Use these templates as a starting point and adapt them to your context. Combine TOGAF for methodology and ArchiMate for modeling."
    },
    
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      download: "Download",
      copy: "Copy",
      copied: "Copied!",
      language: "Language",
      french: "Français",
      english: "English"
    },
    
    // Footer
    footer: {
      copyright: "All rights reserved by"
    },
    
    // Industries
    industries: [
      "Finance & Banking",
      "Healthcare",
      "Retail & E-commerce",
      "Technology",
      "Manufacturing",
      "Government",
      "Education",
      "Other"
    ],
    
    // Budget ranges
    budgetRanges: [
      "< $50,000",
      "$50,000 - $200,000",
      "$200,000 - $500,000",
      "$500,000 - $1M",
      "> $1M"
    ],
    
    // Timelines
    timelines: [
      "< 3 months",
      "3-6 months",
      "6-12 months",
      "> 12 months"
    ],
    
    // Infrastructures
    infrastructures: [
      "On-Premise (100%)",
      "Public Cloud",
      "Hybrid",
      "Multi-Cloud",
      "None (New project)"
    ]
  }
};

// Context
const LanguageContext = createContext();

// Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, default to French
    const saved = localStorage.getItem('archadvisor_lang');
    return saved || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('archadvisor_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to French if key not found
        let fallback = translations['fr'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found
          }
        }
        return fallback;
      }
    }
    return value;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // Return both the function t and the current translation object for convenience
  const { language, setLanguage, toggleLanguage, t, translations } = context;
  return { 
    language, 
    setLanguage, 
    toggleLanguage, 
    t: translations[language], // Return the translations object directly for easier access
    translate: t // Keep the function available as 'translate'
  };
};

export default LanguageProvider;
