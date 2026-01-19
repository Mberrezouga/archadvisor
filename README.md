# ArchAdvisor

Application d'aide à la décision pour architectes de solutions TI.

## Déploiement Rapide

### Option 1 : Render.com

1. Créez un compte sur [render.com](https://render.com)
2. **New** → **Web Service** → Connectez GitHub
3. **Backend** : Root = `backend`, Start = `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Frontend** : Root = `frontend`, Build = `yarn install && yarn build`, Publish = `build`

**Variables Backend :**
```
MONGO_URL = votre_url_mongodb_atlas
DB_NAME = archadvisor
```

**Variable Frontend :**
```
REACT_APP_BACKEND_URL = https://votre-backend.onrender.com
```

### Option 2 : Vercel + Railway

**Frontend sur Vercel :**
1. [vercel.com](https://vercel.com) → Import GitHub → Root = `frontend`

**Backend sur Railway :**
1. [railway.app](https://railway.app) → New Project → GitHub → Root = `backend`

## Fonctionnalités

- Dashboard avec statistiques
- Création et gestion de projets
- Analyse d'architecture (IA Groq)
- Génération de diagrammes
- Comparaison Cloud (AWS/Azure/GCP)
- Templates TOGAF/ArchiMate
- Support FR/EN

## Technologies

- **Frontend** : React, TailwindCSS, Shadcn/UI
- **Backend** : FastAPI, Python
- **Database** : MongoDB Atlas

---

© 2026 Malek Berrezouga
