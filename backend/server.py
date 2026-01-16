from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

# Import AI libraries
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    EMERGENT_AVAILABLE = True
except ImportError:
    EMERGENT_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'archadvisor')]

# LLM Configuration - Priority: Groq (free) > Emergent > None
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Determine which AI provider to use
AI_PROVIDER = None
if GROQ_API_KEY and GROQ_AVAILABLE:
    AI_PROVIDER = "groq"
elif EMERGENT_LLM_KEY and EMERGENT_AVAILABLE:
    AI_PROVIDER = "emergent"

logging.info(f"AI Provider configured: {AI_PROVIDER or 'None (AI features disabled)'}")

app = FastAPI(title="ArchAdvisor API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    client_name: Optional[str] = None
    industry: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    current_infrastructure: Optional[str] = None
    requirements: Optional[List[str]] = []
    status: str = "draft"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectCreate(BaseModel):
    name: str
    description: str
    client_name: Optional[str] = None
    industry: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    current_infrastructure: Optional[str] = None
    requirements: Optional[List[str]] = []

class ArchitectureAnalysis(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    analysis_type: str  # cloud_choice, tech_comparison, cost_estimation, risk_analysis, recommendation
    input_data: Dict[str, Any]
    result: Dict[str, Any]
    ai_recommendation: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AnalysisRequest(BaseModel):
    project_id: str
    analysis_type: str
    input_data: Dict[str, Any]

class DiagramRequest(BaseModel):
    project_id: str
    diagram_type: str  # c4_context, c4_container, c4_component, aws, azure, sequence, flowchart
    title: str
    description: str
    components: Optional[List[Dict[str, Any]]] = []

class Diagram(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    diagram_type: str
    title: str
    description: str
    mermaid_code: str
    plantuml_code: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DocumentRequest(BaseModel):
    project_id: str
    template_type: str  # togaf, archimate, custom
    sections: Optional[List[str]] = []

class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    template_type: str
    title: str
    content: Dict[str, Any]
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# New model for configurable prompts
class AIPromptConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    analysis_type: str
    name: str
    prompt_template: str
    language: str = "both"  # fr, en, both
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AIPromptCreate(BaseModel):
    analysis_type: str
    name: str
    prompt_template: str
    language: str = "both"

# ============== AI HELPER ==============

SYSTEM_PROMPT = """Vous êtes un architecte de solutions TI expert avec 15+ ans d'expérience. 
Vous fournissez des recommandations précises, structurées et actionnables.
Vos réponses sont professionnelles et orientées business.
Répondez dans la même langue que la question (français ou anglais)."""

async def get_ai_recommendation(prompt: str, context: str = "") -> str:
    """Get AI recommendation using available AI provider (Groq free or Emergent)"""
    full_prompt = f"{context}\n\n{prompt}" if context else prompt
    
    # Try Groq first (FREE)
    if AI_PROVIDER == "groq" and GROQ_API_KEY:
        try:
            client = Groq(api_key=GROQ_API_KEY)
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": full_prompt}
                ],
                model="llama-3.3-70b-versatile",  # Free and powerful
                temperature=0.7,
                max_tokens=2000
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logging.error(f"Groq AI error: {e}")
            # Fall through to try Emergent
    
    # Try Emergent as fallback
    if AI_PROVIDER == "emergent" or (EMERGENT_LLM_KEY and EMERGENT_AVAILABLE):
        try:
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=str(uuid.uuid4()),
                system_message=SYSTEM_PROMPT
            ).with_model("openai", "gpt-4o")
            
            user_message = UserMessage(text=full_prompt)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            logging.error(f"Emergent AI error: {e}")
    
    # No AI available - return helpful message
    return """⚠️ Service IA non configuré.

Pour activer les recommandations IA, configurez une des options suivantes:

**Option 1 - Groq (GRATUIT):**
1. Créez un compte sur https://console.groq.com
2. Créez une API key
3. Ajoutez GROQ_API_KEY dans vos variables d'environnement

**Option 2 - Emergent:**
1. Ajoutez du crédit sur Profile → Universal Key
2. Configurez EMERGENT_LLM_KEY

Consultez le fichier GUIDE_CLES_API.md pour plus de détails."""

# ============== PROJECT ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "ArchAdvisor API - Votre assistant architecte de solutions TI"}

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    await db.projects.insert_one(doc)
    return project_obj

@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).to_list(100)
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate):
    existing = await db.projects.find_one({"id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    
    updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
    return updated

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# ============== ANALYSIS ROUTES ==============

@api_router.post("/analyze", response_model=ArchitectureAnalysis)
async def analyze_architecture(request: AnalysisRequest):
    """Perform architecture analysis with AI recommendations"""
    
    analysis_prompts = {
        "cloud_choice": """Analysez les besoins suivants et recommandez le meilleur choix d'infrastructure:
        - Cloud Public (AWS, Azure, GCP)
        - On-Premise
        - Hybride
        
        Données du projet: {input_data}
        
        Fournissez:
        1. Recommandation principale avec justification
        2. Avantages et inconvénients
        3. Facteurs de décision clés
        4. Estimation de coûts approximative
        5. Risques à considérer""",
        
        "tech_comparison": """Comparez les options technologiques suivantes pour ce projet:
        
        Données: {input_data}
        
        Fournissez une analyse comparative incluant:
        1. Tableau comparatif (fonctionnalités, coûts, scalabilité, support)
        2. Recommandation avec score pondéré
        3. Use cases optimaux pour chaque option
        4. Courbe d'apprentissage et ressources requises
        5. Roadmap de migration si applicable""",
        
        "cost_estimation": """Estimez les coûts d'architecture pour:
        
        Données: {input_data}
        
        Fournissez:
        1. Coûts initiaux (setup, licences, infrastructure)
        2. Coûts récurrents mensuels/annuels
        3. Coûts cachés potentiels
        4. TCO sur 3 ans
        5. Optimisations possibles
        6. Comparaison avec alternatives""",
        
        "risk_analysis": """Analysez les risques de sécurité et techniques pour:
        
        Données: {input_data}
        
        Fournissez:
        1. Matrice des risques (probabilité x impact)
        2. Risques de sécurité (OWASP Top 10, conformité)
        3. Risques techniques (scalabilité, disponibilité)
        4. Risques business (vendor lock-in, coûts)
        5. Plan de mitigation pour chaque risque majeur
        6. Recommandations de conformité (PCI-DSS, GDPR, SOC2)""",
        
        "recommendation": """Générez une recommandation d'architecture complète pour:
        
        Données: {input_data}
        
        Fournissez:
        1. Architecture recommandée (haute disponibilité, scalable)
        2. Stack technologique détaillée
        3. Patterns d'architecture (microservices, event-driven, etc.)
        4. Diagramme conceptuel (description textuelle)
        5. Phases d'implémentation
        6. KPIs de succès""",
        
        "scoring": """Évaluez l'architecture suivante et attribuez un score sur 100 pour chaque catégorie:
        
        Description de l'architecture: {input_data}
        
        Catégories à évaluer (avec leur pondération):
        - Scalabilité (20%): Capacité à supporter la croissance
        - Sécurité (25%): Protection des données et conformité
        - Coût-efficacité (15%): Optimisation des ressources
        - Performance (20%): Temps de réponse et throughput
        - Maintenabilité (10%): Facilité de maintenance et évolution
        - Fiabilité (10%): Disponibilité et tolérance aux pannes
        
        Pour chaque catégorie, fournissez:
        1. Score /100
        2. Points forts
        3. Points à améliorer
        4. Recommandations concrètes
        
        Terminez par un score global pondéré et une conclusion."""
    }
    
    # Check for custom prompts in database
    custom_prompt = await db.ai_prompts.find_one({
        "analysis_type": request.analysis_type,
        "is_active": True
    }, {"_id": 0})
    
    if custom_prompt:
        prompt_template = custom_prompt["prompt_template"]
    else:
        prompt_template = analysis_prompts.get(request.analysis_type, analysis_prompts["recommendation"])
    
    prompt = prompt_template.format(input_data=str(request.input_data))
    
    ai_recommendation = await get_ai_recommendation(prompt)
    
    result = {
        "analysis_type": request.analysis_type,
        "input_summary": request.input_data,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    analysis = ArchitectureAnalysis(
        project_id=request.project_id,
        analysis_type=request.analysis_type,
        input_data=request.input_data,
        result=result,
        ai_recommendation=ai_recommendation
    )
    
    doc = analysis.model_dump()
    await db.analyses.insert_one(doc)
    
    return analysis

@api_router.get("/analyses/{project_id}", response_model=List[ArchitectureAnalysis])
async def get_project_analyses(project_id: str):
    analyses = await db.analyses.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    return analyses

# ============== DIAGRAM ROUTES ==============

@api_router.post("/diagrams", response_model=Diagram)
async def generate_diagram(request: DiagramRequest):
    """Generate architecture diagram in Mermaid and PlantUML formats"""
    
    # Use provided mermaid_code if available, otherwise use template
    if hasattr(request, 'mermaid_code') and request.mermaid_code:
        mermaid_code = request.mermaid_code
    else:
        diagram_templates = {
            "flowchart": """flowchart TD
    A[Début] --> B{Validation}
    B -->|Valide| C[Traitement]
    B -->|Invalide| D[Erreur]
    C --> E[Stockage]
    E --> F[Notification]
    F --> G[Fin]
    D --> G""",
            "sequence": """sequenceDiagram
    participant U as Utilisateur
    participant W as Web App
    participant A as API Gateway
    participant S as Service
    participant D as Database
    U->>W: Requête
    W->>A: API Call
    A->>S: Process
    S->>D: Query
    D-->>S: Response
    S-->>A: Result
    A-->>W: JSON
    W-->>U: UI Update""",
            "class": """classDiagram
    class User {
        +String id
        +String email
        +login()
    }
    class Project {
        +String id
        +String name
        +analyze()
    }
    User --> Project""",
            "state": """stateDiagram-v2
    [*] --> Draft
    Draft --> Review
    Review --> Approved
    Review --> Rejected
    Approved --> Published
    Published --> [*]""",
            "er": """erDiagram
    USER ||--o{ PROJECT : creates
    PROJECT ||--|{ ANALYSIS : contains
    USER {
        string id
        string email
    }
    PROJECT {
        string id
        string name
    }""",
            "journey": """journey
    title User Journey
    section Discovery
      Visit Site: 5: User
      Create Account: 3: User
    section Usage
      Create Project: 4: User
      Analyze: 5: User""",
            "gantt": """gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Task 1: a1, 2024-01-01, 30d
    Task 2: after a1, 20d""",
            "pie": """pie showData
    title Distribution
    "Category A": 45
    "Category B": 30
    "Category C": 25""",
            "mindmap": """mindmap
    root((Main Topic))
        Branch 1
            Sub 1
            Sub 2
        Branch 2
            Sub 3""",
            "timeline": """timeline
    title Timeline
    section 2024
        Q1: Task 1
        Q2: Task 2""",
            "c4_context": """C4Context
    title {title}
    Person(user, "User", "System user")
    System(system, "{title}", "{description}")
    System_Ext(ext, "External", "External services")
    Rel(user, system, "Uses")
    Rel(system, ext, "Integrates")""",
            "c4_container": """C4Container
    title {title}
    Container(web, "Web App", "React", "UI")
    Container(api, "API", "FastAPI", "Backend")
    ContainerDb(db, "Database", "MongoDB", "Storage")
    Rel(web, api, "HTTPS")
    Rel(api, db, "Reads/Writes")""",
            "c4_component": """C4Component
    title {title}
    Component(auth, "Auth", "Authentication")
    Component(logic, "Business", "Logic")
    Component(data, "Data", "Access")
    Rel(auth, logic, "Authorizes")
    Rel(logic, data, "Uses")""",
            "aws": """flowchart TB
    subgraph AWS
        CF[CloudFront] --> ALB[Load Balancer]
        ALB --> ECS[ECS Cluster]
        ECS --> RDS[(RDS)]
        ECS --> S3[(S3)]
    end
    Users --> CF""",
            "azure": """flowchart TB
    subgraph Azure
        CDN[Azure CDN] --> AG[App Gateway]
        AG --> AKS[AKS Cluster]
        AKS --> SQL[(Azure SQL)]
        AKS --> Blob[(Blob Storage)]
    end
    Users --> CDN""",
            "gcp": """flowchart TB
    subgraph GCP
        CDN[Cloud CDN] --> LB[Load Balancer]
        LB --> GKE[GKE Cluster]
        GKE --> SQL[(Cloud SQL)]
        GKE --> GCS[(Cloud Storage)]
    end
    Users --> CDN""",
            "microservices": """flowchart TB
    Gateway[API Gateway] --> Auth[Auth Service]
    Gateway --> Svc1[Service 1]
    Gateway --> Svc2[Service 2]
    Svc1 --> DB1[(Database)]
    Svc2 --> DB2[(Database)]
    Svc1 --> Queue[Message Queue]
    Queue --> Svc2""",
            "network": """flowchart TB
    Internet --> FW[Firewall]
    FW --> LB[Load Balancer]
    LB --> Web[Web Servers]
    Web --> App[App Servers]
    App --> DB[(Database)]""",
            "deployment": """flowchart LR
    Code[Source] --> Build[CI Build]
    Build --> Test[Tests]
    Test --> Registry[Container Registry]
    Registry --> Deploy[CD Deploy]
    Deploy --> Env[Environment]"""
        }
        
        mermaid_template = diagram_templates.get(request.diagram_type, diagram_templates["flowchart"])
        mermaid_code = mermaid_template.format(
            title=request.title,
            description=request.description
        )
    
    diagram = Diagram(
        project_id=request.project_id,
        diagram_type=request.diagram_type,
        title=request.title,
        description=request.description,
        mermaid_code=mermaid_code
    )
    
    doc = diagram.model_dump()
    await db.diagrams.insert_one(doc)
    
    return diagram

@api_router.get("/diagrams/{project_id}", response_model=List[Diagram])
async def get_project_diagrams(project_id: str):
    diagrams = await db.diagrams.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    return diagrams

@api_router.post("/diagrams/ai-generate")
async def ai_generate_diagram(request: DiagramRequest):
    """Generate diagram using AI based on description"""
    
    # Check if AI is available
    if not AI_PROVIDER:
        # Return a default template instead of error message
        default_templates = {
            "flowchart": f"""flowchart TD
    A[{request.title}] --> B{{Validation}}
    B -->|OK| C[Traitement]
    B -->|Erreur| D[Gestion Erreur]
    C --> E[(Stockage)]
    E --> F[Résultat]
    D --> F""",
            "sequence": f"""sequenceDiagram
    participant U as Utilisateur
    participant S as Système
    participant D as Database
    U->>S: Requête
    S->>D: Query
    D-->>S: Données
    S-->>U: Réponse""",
            "c4_context": f"""C4Context
    title {request.title}
    Person(user, "Utilisateur")
    System(sys, "{request.title}", "{request.description}")
    Rel(user, sys, "Utilise")""",
        }
        
        mermaid_code = default_templates.get(request.diagram_type, default_templates["flowchart"])
        
        diagram = Diagram(
            project_id=request.project_id,
            diagram_type=request.diagram_type,
            title=request.title + " (Template)",
            description=request.description + " - IA non configurée, template par défaut utilisé",
            mermaid_code=mermaid_code
        )
        
        doc = diagram.model_dump()
        await db.diagrams.insert_one(doc)
        return diagram
    
    prompt = f"""Générez un diagramme Mermaid pour:
    Titre: {request.title}
    Description: {request.description}
    Type: {request.diagram_type}
    
    Retournez UNIQUEMENT le code Mermaid valide, sans explications."""
    
    mermaid_code = await get_ai_recommendation(prompt)
    
    # Clean up the response - check if it's valid Mermaid
    if "```mermaid" in mermaid_code:
        mermaid_code = mermaid_code.split("```mermaid")[1].split("```")[0].strip()
    elif "```" in mermaid_code:
        mermaid_code = mermaid_code.split("```")[1].split("```")[0].strip()
    
    # If response doesn't look like valid Mermaid, use template
    valid_starts = ["flowchart", "sequenceDiagram", "classDiagram", "stateDiagram", 
                    "erDiagram", "journey", "gantt", "pie", "mindmap", "timeline",
                    "C4Context", "C4Container", "C4Component", "graph"]
    
    is_valid = any(mermaid_code.strip().startswith(start) for start in valid_starts)
    
    if not is_valid:
        # Fallback to template
        mermaid_code = f"""flowchart TD
    A[{request.title}] --> B{{Process}}
    B --> C[Résultat]"""
    
    diagram = Diagram(
        project_id=request.project_id,
        diagram_type=request.diagram_type,
        title=request.title,
        description=request.description,
        mermaid_code=mermaid_code
    )
    
    doc = diagram.model_dump()
    await db.diagrams.insert_one(doc)
    
    return diagram

# ============== DOCUMENT ROUTES ==============

@api_router.post("/documents", response_model=Document)
async def generate_document(request: DocumentRequest):
    """Generate architecture document from template"""
    
    templates = {
        "togaf": {
            "title": "Document d'Architecture TOGAF",
            "sections": {
                "vision": {
                    "title": "1. Vision d'Architecture",
                    "content": "Définition de la vision et des objectifs stratégiques"
                },
                "business": {
                    "title": "2. Architecture Métier",
                    "content": "Processus métier et capacités organisationnelles"
                },
                "data": {
                    "title": "3. Architecture de Données",
                    "content": "Modèle de données et flux d'information"
                },
                "application": {
                    "title": "4. Architecture Applicative",
                    "content": "Applications et interfaces"
                },
                "technology": {
                    "title": "5. Architecture Technique",
                    "content": "Infrastructure et plateformes"
                },
                "migration": {
                    "title": "6. Plan de Migration",
                    "content": "Roadmap et phases d'implémentation"
                },
                "governance": {
                    "title": "7. Gouvernance",
                    "content": "Principes et standards"
                }
            }
        },
        "archimate": {
            "title": "Document ArchiMate",
            "sections": {
                "motivation": {
                    "title": "1. Couche Motivation",
                    "content": "Stakeholders, drivers, goals, requirements"
                },
                "strategy": {
                    "title": "2. Couche Stratégie",
                    "content": "Ressources, capacités, cours d'action"
                },
                "business": {
                    "title": "3. Couche Métier",
                    "content": "Processus, fonctions, services métier"
                },
                "application": {
                    "title": "4. Couche Application",
                    "content": "Composants, services, interfaces applicatifs"
                },
                "technology": {
                    "title": "5. Couche Technologie",
                    "content": "Nœuds, dispositifs, réseaux"
                },
                "implementation": {
                    "title": "6. Implémentation & Migration",
                    "content": "Work packages, livrables, plateaux"
                }
            }
        },
        "custom": {
            "title": "Document d'Architecture Personnalisé",
            "sections": {
                "overview": {
                    "title": "1. Vue d'Ensemble",
                    "content": "Contexte et objectifs du projet"
                },
                "requirements": {
                    "title": "2. Exigences",
                    "content": "Fonctionnelles et non-fonctionnelles"
                },
                "architecture": {
                    "title": "3. Architecture Proposée",
                    "content": "Design et composants"
                },
                "security": {
                    "title": "4. Sécurité",
                    "content": "Contrôles et conformité"
                },
                "deployment": {
                    "title": "5. Déploiement",
                    "content": "Infrastructure et CI/CD"
                },
                "operations": {
                    "title": "6. Opérations",
                    "content": "Monitoring et maintenance"
                }
            }
        }
    }
    
    template = templates.get(request.template_type, templates["custom"])
    
    document = Document(
        project_id=request.project_id,
        template_type=request.template_type,
        title=template["title"],
        content=template
    )
    
    doc = document.model_dump()
    await db.documents.insert_one(doc)
    
    return document

@api_router.get("/documents/{project_id}", response_model=List[Document])
async def get_project_documents(project_id: str):
    documents = await db.documents.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    return documents

@api_router.post("/documents/ai-generate")
async def ai_generate_document(request: DocumentRequest):
    """Generate full document content using AI"""
    
    project = await db.projects.find_one({"id": request.project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    prompt = f"""Générez un document d'architecture complet de type {request.template_type} pour le projet suivant:
    
    Nom: {project.get('name')}
    Description: {project.get('description')}
    Industrie: {project.get('industry', 'Non spécifié')}
    Infrastructure actuelle: {project.get('current_infrastructure', 'Non spécifié')}
    Exigences: {project.get('requirements', [])}
    
    Générez le contenu pour chaque section du template {request.template_type.upper()}.
    Format: Markdown structuré avec titres, sous-titres, listes et tableaux."""
    
    ai_content = await get_ai_recommendation(prompt)
    
    document = Document(
        project_id=request.project_id,
        template_type=request.template_type,
        title=f"Document {request.template_type.upper()} - {project.get('name')}",
        content={
            "generated": True,
            "ai_content": ai_content,
            "project_info": {
                "name": project.get('name'),
                "description": project.get('description')
            }
        }
    )
    
    doc = document.model_dump()
    await db.documents.insert_one(doc)
    
    return document

# ============== CLOUD COMPARISON ==============

@api_router.get("/cloud-comparison")
async def get_cloud_comparison():
    """Get static cloud provider comparison data"""
    return {
        "providers": [
            {
                "name": "AWS",
                "logo": "aws",
                "strengths": ["Leader du marché", "Services matures", "Grande communauté"],
                "weaknesses": ["Tarification complexe", "Courbe d'apprentissage"],
                "best_for": ["Startups", "Enterprise", "Big Data"],
                "pricing_model": "Pay-as-you-go",
                "regions": 31,
                "services": 200
            },
            {
                "name": "Azure",
                "logo": "azure",
                "strengths": ["Intégration Microsoft", "Hybride excellent", "Enterprise ready"],
                "weaknesses": ["Documentation parfois confuse", "Portail complexe"],
                "best_for": ["Entreprises Microsoft", "Hybride", "Secteur public"],
                "pricing_model": "Pay-as-you-go + Reserved",
                "regions": 60,
                "services": 150
            },
            {
                "name": "GCP",
                "logo": "gcp",
                "strengths": ["ML/AI leader", "Kubernetes natif", "Réseau performant"],
                "weaknesses": ["Moins de services", "Support limité"],
                "best_for": ["Data Analytics", "ML/AI", "Containerisation"],
                "pricing_model": "Pay-as-you-go + Committed",
                "regions": 35,
                "services": 100
            }
        ],
        "comparison_criteria": [
            "compute", "storage", "database", "networking", 
            "security", "ml_ai", "serverless", "pricing"
        ]
    }

# ============== TEMPLATES ==============

@api_router.get("/templates")
async def get_templates():
    """Get available architecture templates"""
    return {
        "templates": [
            {
                "id": "microservices",
                "name": "Architecture Microservices",
                "description": "Pattern microservices avec API Gateway, Service Mesh, et Event-Driven",
                "category": "application",
                "complexity": "high"
            },
            {
                "id": "serverless",
                "name": "Architecture Serverless",
                "description": "Functions as a Service avec event triggers",
                "category": "application",
                "complexity": "medium"
            },
            {
                "id": "data-lake",
                "name": "Data Lake Architecture",
                "description": "Architecture de données pour analytics et ML",
                "category": "data",
                "complexity": "high"
            },
            {
                "id": "hybrid-cloud",
                "name": "Hybrid Cloud",
                "description": "Architecture hybride On-Prem + Cloud",
                "category": "infrastructure",
                "complexity": "high"
            },
            {
                "id": "zero-trust",
                "name": "Zero Trust Security",
                "description": "Architecture de sécurité Zero Trust",
                "category": "security",
                "complexity": "high"
            },
            {
                "id": "event-driven",
                "name": "Event-Driven Architecture",
                "description": "Architecture basée sur les événements avec message brokers",
                "category": "application",
                "complexity": "medium"
            }
        ]
    }

# ============== STATS ==============

@api_router.get("/stats")
async def get_stats():
    """Get dashboard statistics"""
    projects_count = await db.projects.count_documents({})
    analyses_count = await db.analyses.count_documents({})
    diagrams_count = await db.diagrams.count_documents({})
    documents_count = await db.documents.count_documents({})
    
    return {
        "total_projects": projects_count,
        "total_analyses": analyses_count,
        "total_diagrams": diagrams_count,
        "total_documents": documents_count,
        "recent_activity": {
            "projects_this_week": projects_count,
            "analyses_this_week": analyses_count
        }
    }

# ============== AI PROMPTS CONFIGURATION ==============

@api_router.get("/ai-prompts")
async def get_ai_prompts():
    """Get all configurable AI prompts"""
    prompts = await db.ai_prompts.find({}, {"_id": 0}).to_list(100)
    
    # Also return default prompts info
    default_types = [
        {"type": "cloud_choice", "name": "Choix Cloud", "description": "Analyse Cloud/On-Prem/Hybride"},
        {"type": "tech_comparison", "name": "Comparaison Tech", "description": "Comparaison de technologies"},
        {"type": "cost_estimation", "name": "Estimation Coûts", "description": "Analyse TCO et coûts"},
        {"type": "risk_analysis", "name": "Analyse Risques", "description": "Risques sécurité et business"},
        {"type": "recommendation", "name": "Recommandation", "description": "Recommandation d'architecture complète"},
        {"type": "scoring", "name": "Scoring Architecture", "description": "Évaluation et notation d'architecture"}
    ]
    
    return {
        "custom_prompts": prompts,
        "default_types": default_types
    }

@api_router.post("/ai-prompts", response_model=AIPromptConfig)
async def create_ai_prompt(prompt: AIPromptCreate):
    """Create a custom AI prompt"""
    prompt_obj = AIPromptConfig(**prompt.model_dump())
    doc = prompt_obj.model_dump()
    await db.ai_prompts.insert_one(doc)
    return prompt_obj

@api_router.put("/ai-prompts/{prompt_id}")
async def update_ai_prompt(prompt_id: str, prompt: AIPromptCreate):
    """Update a custom AI prompt"""
    existing = await db.ai_prompts.find_one({"id": prompt_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    update_data = prompt.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.ai_prompts.update_one({"id": prompt_id}, {"$set": update_data})
    
    updated = await db.ai_prompts.find_one({"id": prompt_id}, {"_id": 0})
    return updated

@api_router.delete("/ai-prompts/{prompt_id}")
async def delete_ai_prompt(prompt_id: str):
    """Delete a custom AI prompt"""
    result = await db.ai_prompts.delete_one({"id": prompt_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"message": "Prompt deleted successfully"}

@api_router.post("/ai-prompts/{prompt_id}/toggle")
async def toggle_ai_prompt(prompt_id: str):
    """Toggle active status of a prompt"""
    existing = await db.ai_prompts.find_one({"id": prompt_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    new_status = not existing.get("is_active", True)
    await db.ai_prompts.update_one(
        {"id": prompt_id}, 
        {"$set": {"is_active": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"is_active": new_status}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
