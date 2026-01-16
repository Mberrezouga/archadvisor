# 🏗️ ArchAdvisor

<div align="center">

![ArchAdvisor Logo](frontend/public/logo.svg)

**L'Assistant Intelligent de l'Architecte de Solutions TI**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[🇫🇷 Français](#-fonctionnalités) | [🇬🇧 English](#-features)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Déploiement](#-déploiement)
- [API Documentation](#-api-documentation)
- [Auteur](#-auteur)

---

## 🎯 À Propos

**ArchAdvisor** est une application web complète d'aide à la décision pour les architectes de solutions TI. Elle combine l'intelligence artificielle avec des frameworks d'architecture reconnus (TOGAF, ArchiMate) pour vous aider à :

- 🎯 Prendre des décisions d'architecture éclairées
- 📊 Générer des diagrammes professionnels
- 📄 Exporter des documents conformes aux standards
- 💰 Estimer les coûts avec précision
- 🔒 Analyser les risques de sécurité

---

## ✨ Fonctionnalités

### 🏛️ Analyse d'Architecture
- **Choix d'Infrastructure** : Cloud Public, On-Premise ou Hybride
- **Comparaison Technologique** : AWS vs Azure vs GCP
- **Recommandations IA** : Suggestions personnalisées basées sur vos besoins

### 💵 Estimation des Coûts
- Calcul du **TCO** (Total Cost of Ownership)
- Comparaison multi-cloud
- Optimisations et alternatives suggérées

### 🛡️ Analyse de Risques
- Évaluation de sécurité (OWASP, conformité)
- Matrice des risques (probabilité × impact)
- Plan de mitigation

### 📐 Génération de Diagrammes
- **19+ types** de diagrammes supportés
- C4 Model (Context, Container, Component)
- Diagrammes AWS, Azure, GCP
- Séquences, Flowcharts, ER, Classes
- **Zoom/Pan interactif** et export PNG

### 📑 Export de Documents
- Templates **TOGAF** et **ArchiMate**
- Export PDF, Word, Markdown
- Génération IA du contenu

### 🌍 Internationalisation
- Interface **Français** (défaut) et **Anglais**
- Changement de langue instantané

---

## 🛠️ Technologies

### Frontend
| Technologie | Usage |
|-------------|-------|
| React 18 | Framework UI |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icônes |
| Shadcn/UI | Composants |
| Mermaid.js | Rendu diagrammes |

### Backend
| Technologie | Usage |
|-------------|-------|
| FastAPI | API REST |
| Pydantic | Validation |
| Motor | MongoDB async |
| Groq API | IA (gratuit) |

### Base de Données
| Technologie | Usage |
|-------------|-------|
| MongoDB | Stockage documents |
| MongoDB Atlas | Cloud DB (gratuit) |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- Python 3.9+
- MongoDB (local ou Atlas)
- Clé API Groq (gratuite)

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-username/archadvisor.git
cd archadvisor
```

### 2. Configuration Backend
```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés
```

**Variables d'environnement Backend** (`.env`):
```env
MONGO_URL=mongodb://localhost:27017/archadvisor
DB_NAME=archadvisor
GROQ_API_KEY=votre_cle_groq
```

### 3. Configuration Frontend
```bash
cd frontend

# Installer les dépendances
yarn install

# Configurer les variables d'environnement
cp .env.example .env
```

**Variables d'environnement Frontend** (`.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 4. Lancer l'Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

L'application sera accessible à: `http://localhost:3000`

---

## ☁️ Déploiement Gratuit

### Option 1: Railway (Recommandé)
$5 de crédits gratuits par mois.

📖 Voir [GUIDE_DEPLOIEMENT_RAILWAY.md](GUIDE_DEPLOIEMENT_RAILWAY.md)

### Option 2: Vercel + Railway
Meilleure performance avec CDN Vercel.

📖 Voir [GUIDE_DEPLOIEMENT_VERCEL_RAILWAY.md](GUIDE_DEPLOIEMENT_VERCEL_RAILWAY.md)

### Option 3: Render
Blueprint automatisé inclus.

📖 Voir [GUIDE_DEPLOIEMENT_DETAILLE.md](GUIDE_DEPLOIEMENT_DETAILLE.md)

---

## 📚 API Documentation

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/` | Health check |
| `POST` | `/api/projects` | Créer un projet |
| `GET` | `/api/projects` | Lister les projets |
| `GET` | `/api/projects/{id}` | Détails d'un projet |
| `POST` | `/api/analyze` | Analyse d'architecture IA |
| `POST` | `/api/diagrams` | Générer un diagramme |
| `POST` | `/api/documents` | Générer un document |
| `GET` | `/api/templates` | Lister les templates |

### Documentation Interactive
Une fois le serveur lancé:
- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

---

## 🔑 Obtenir une Clé API Groq (Gratuit)

1. Créez un compte sur [console.groq.com](https://console.groq.com)
2. Allez dans "API Keys"
3. Créez une nouvelle clé
4. Copiez-la dans votre fichier `.env`

📖 Voir [GUIDE_CLES_API.md](GUIDE_CLES_API.md) pour plus de détails.

---

## 📁 Structure du Projet

```
archadvisor/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── requirements.txt   # Dépendances Python
│   ├── Procfile          # Config déploiement
│   └── .env              # Variables d'environnement
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── pages/        # Pages de l'application
│   │   ├── context/      # Contextes (i18n, etc.)
│   │   └── hooks/        # Custom hooks
│   ├── public/           # Assets statiques
│   └── vercel.json       # Config Vercel
├── cv_analysis/          # Documents CV
├── GUIDE_*.md            # Guides de déploiement
├── render.yaml           # Blueprint Render
└── README.md             # Ce fichier
```

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👤 Auteur

<div align="center">

**Malek Berrezouga**

---

<sub>© 2026 All rights reserved by **Malek Berrezouga**</sub>

</div>

---

## 🙏 Remerciements

- [Groq](https://groq.com) pour l'API IA gratuite
- [Shadcn/UI](https://ui.shadcn.com) pour les composants
- [Mermaid.js](https://mermaid.js.org) pour le rendu des diagrammes
- [TOGAF](https://www.opengroup.org/togaf) pour le framework d'architecture

---

<div align="center">

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !**

</div>
