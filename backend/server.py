from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import uuid
from datetime import datetime, timezone
import certifi

# ============== APP SETUP ==============
app = FastAPI(title="ArchAdvisor API")

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== DATABASE ==============
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'archadvisor')

# MongoDB connection with SSL fix
client = AsyncIOMotorClient(
    MONGO_URL,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000
)
db = client[DB_NAME]

# ============== MODELS ==============
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    client_name: Optional[str] = None
    industry: Optional[str] = None
    budget_range: Optional[str] = None
    status: str = "draft"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectCreate(BaseModel):
    name: str
    description: str
    client_name: Optional[str] = None
    industry: Optional[str] = None
    budget_range: Optional[str] = None

# ============== ROUTES ==============
@app.get("/api/")
async def root():
    return {"message": "ArchAdvisor API", "status": "running"}

@app.get("/api/health")
async def health():
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

@app.get("/api/stats")
async def get_stats():
    projects = await db.projects.count_documents({})
    analyses = await db.analyses.count_documents({})
    diagrams = await db.diagrams.count_documents({})
    return {
        "total_projects": projects,
        "total_analyses": analyses,
        "total_diagrams": diagrams,
        "total_documents": 0
    }

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    await db.projects.insert_one(doc)
    return project_obj

@app.get("/api/projects")
async def get_projects():
    projects = await db.projects.find({}, {"_id": 0}).to_list(100)
    return projects

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# ============== AI ANALYSIS ==============
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

GROQ_API_KEY = os.environ.get('GROQ_API_KEY')

async def get_ai_response(prompt: str) -> str:
    if GROQ_API_KEY and GROQ_AVAILABLE:
        try:
            client_ai = Groq(api_key=GROQ_API_KEY)
            response = client_ai.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Erreur IA: {str(e)}"
    return "IA non configurée. Ajoutez GROQ_API_KEY."

class AnalysisRequest(BaseModel):
    project_id: str
    analysis_type: str
    input_data: Dict[str, Any]

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    prompt = f"Analysez cette architecture: {request.input_data}"
    ai_response = await get_ai_response(prompt)
    
    analysis = {
        "id": str(uuid.uuid4()),
        "project_id": request.project_id,
        "analysis_type": request.analysis_type,
        "input_data": request.input_data,
        "ai_recommendation": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.analyses.insert_one(analysis)
    return {k: v for k, v in analysis.items() if k != "_id"}

@app.get("/api/analyses/{project_id}")
async def get_analyses(project_id: str):
    analyses = await db.analyses.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    return analyses

# ============== DIAGRAMS ==============
class DiagramRequest(BaseModel):
    project_id: str
    diagram_type: str
    title: str
    description: str

@app.post("/api/diagrams")
async def create_diagram(request: DiagramRequest):
    mermaid_code = f"""flowchart TD
    A[{request.title}] --> B{{Process}}
    B --> C[Result]"""
    
    diagram = {
        "id": str(uuid.uuid4()),
        "project_id": request.project_id,
        "diagram_type": request.diagram_type,
        "title": request.title,
        "description": request.description,
        "mermaid_code": mermaid_code,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.diagrams.insert_one(diagram)
    return {k: v for k, v in diagram.items() if k != "_id"}

@app.get("/api/diagrams/{project_id}")
async def get_diagrams(project_id: str):
    diagrams = await db.diagrams.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    return diagrams

# ============== TEMPLATES ==============
@app.get("/api/templates")
async def get_templates():
    return {
        "frameworks": [
            {"id": "togaf", "name": "TOGAF ADM", "description": "Framework d'architecture d'entreprise"},
            {"id": "archimate", "name": "ArchiMate", "description": "Langage de modélisation"}
        ],
        "patterns": [
            {"id": "microservices", "name": "Microservices", "description": "Architecture distribuée"},
            {"id": "serverless", "name": "Serverless", "description": "Architecture sans serveur"}
        ]
    }

@app.get("/api/cloud-comparison")
async def cloud_comparison():
    return {
        "providers": [
            {"name": "AWS", "compute": "EC2", "storage": "S3", "database": "RDS"},
            {"name": "Azure", "compute": "VMs", "storage": "Blob", "database": "SQL"},
            {"name": "GCP", "compute": "GCE", "storage": "GCS", "database": "Cloud SQL"}
        ]
    }
