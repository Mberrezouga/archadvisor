# 🚀 GUIDE DE DÉPLOIEMENT COMPLET - ÉTAPE PAR ÉTAPE

## 📋 CE QUE VOUS ALLEZ FAIRE

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Créer compte Groq (IA gratuite)     ⏱️ 2 minutes           │
│  2. Créer compte GitHub                  ⏱️ 3 minutes           │
│  3. Uploader le code sur GitHub          ⏱️ 5 minutes           │
│  4. Créer compte Render                  ⏱️ 2 minutes           │
│  5. Déployer avec Blueprint              ⏱️ 10 minutes          │
│  6. Configurer la clé Groq               ⏱️ 2 minutes           │
│                                                                  │
│  TOTAL: ~25 minutes | COÛT: 0$ (100% gratuit)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

# ÉTAPE 1: CRÉER UN COMPTE GROQ (IA GRATUITE)

## Pourquoi Groq?
- ✅ **100% GRATUIT** (pas de carte bancaire)
- ✅ Très rapide (inférence optimisée)
- ✅ Modèle Llama 3.3 70B (très performant)
- ✅ Limite généreuse: ~100 requêtes/minute

## Instructions

### 1.1 Aller sur le site Groq
```
🌐 Ouvrez: https://console.groq.com
```

### 1.2 Créer un compte
```
1. Cliquez sur "Sign Up" (ou "Start Building")
2. Choisissez une méthode:
   - 📧 Email + mot de passe
   - 🔵 Google
   - 🐙 GitHub
3. Vérifiez votre email si nécessaire
```

### 1.3 Créer une API Key
```
1. Une fois connecté, vous êtes sur le Dashboard
2. Dans le menu gauche, cliquez "API Keys"
3. Cliquez le bouton "Create API Key"
4. Donnez un nom: "ArchAdvisor"
5. Cliquez "Create"
6. ⚠️ IMPORTANT: Copiez la clé IMMÉDIATEMENT!
   Elle ressemble à: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
7. Sauvegardez-la dans un fichier temporaire
```

### 1.4 Vérifier que ça marche (optionnel)
```
Sur le Dashboard Groq, vous pouvez tester dans "Playground"
```

---

# ÉTAPE 2: CRÉER UN COMPTE GITHUB

## Si vous avez déjà un compte GitHub
➡️ Passez directement à l'ÉTAPE 3

## Sinon, créez un compte

### 2.1 Aller sur GitHub
```
🌐 Ouvrez: https://github.com
```

### 2.2 S'inscrire
```
1. Cliquez "Sign up"
2. Entrez votre email
3. Créez un mot de passe
4. Choisissez un username (ex: malek-berrezouga)
5. Résolvez le puzzle de vérification
6. Cliquez "Create account"
7. Vérifiez votre email (code à 6 chiffres)
8. Répondez aux questions (ou cliquez "Skip")
9. Choisissez le plan "Free" (gratuit)
```

---

# ÉTAPE 3: UPLOADER LE CODE SUR GITHUB

## 3.1 Créer un nouveau repository

### Dans GitHub:
```
1. Cliquez le "+" en haut à droite
2. Cliquez "New repository"
3. Remplissez:
   - Repository name: archadvisor
   - Description: Application d'aide à la décision architecte TI
   - Visibilité: Public (pour Render gratuit)
   - ❌ NE PAS cocher "Add a README file"
4. Cliquez "Create repository"
```

### Vous verrez une page avec des instructions - GARDEZ CETTE PAGE OUVERTE

## 3.2 Préparer le code localement

### Option A: Si vous avez téléchargé le ZIP

```bash
# 1. Extraire le ZIP
unzip ArchAdvisor_App.zip -d archadvisor
cd archadvisor

# 2. Initialiser Git
git init

# 3. Ajouter tous les fichiers
git add .

# 4. Créer le premier commit
git commit -m "Initial commit - ArchAdvisor"

# 5. Connecter à GitHub (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/archadvisor.git

# 6. Envoyer le code
git branch -M main
git push -u origin main
```

### Option B: Via l'interface GitHub (plus simple)

```
1. Sur la page du repository vide, cliquez "uploading an existing file"
2. Glissez-déposez TOUS les fichiers extraits du ZIP
3. En bas, écrivez "Initial commit"
4. Cliquez "Commit changes"

⚠️ IMPORTANT: Vérifiez que la structure est correcte:
   archadvisor/
   ├── backend/
   ├── frontend/
   ├── render.yaml
   └── ... autres fichiers
```

## 3.3 Vérifier que le code est bien uploadé
```
1. Allez sur https://github.com/VOTRE_USERNAME/archadvisor
2. Vous devez voir:
   - 📁 backend/
   - 📁 frontend/
   - 📄 render.yaml
   - 📄 GUIDE_DEPLOIEMENT.md
   - etc.
```

---

# ÉTAPE 4: CRÉER UN COMPTE RENDER

## 4.1 Aller sur Render
```
🌐 Ouvrez: https://render.com
```

## 4.2 S'inscrire
```
1. Cliquez "Get Started for Free"
2. Choisissez "GitHub" pour vous connecter
3. Autorisez Render à accéder à votre GitHub
4. Complétez votre profil si demandé
```

---

# ÉTAPE 5: DÉPLOYER AVEC BLUEPRINT

## 5.1 Créer un nouveau Blueprint

```
1. Sur le Dashboard Render, cliquez "New +"
2. Sélectionnez "Blueprint"
```

## 5.2 Connecter votre repository

```
1. Vous verrez la liste de vos repos GitHub
2. Si vous ne voyez pas "archadvisor":
   - Cliquez "Configure account"
   - Autorisez l'accès au repo archadvisor
   - Revenez sur Render
3. Cliquez sur "archadvisor"
```

## 5.3 Render détecte le Blueprint

```
Render va lire le fichier render.yaml et proposer de créer:

┌─────────────────────────────────────────────────────────────┐
│  📦 archadvisor-db        Database (MongoDB)    Free        │
│  🖥️ archadvisor-api       Web Service (Python)  Free        │
│  🌐 archadvisor-frontend  Static Site           Free        │
└─────────────────────────────────────────────────────────────┘

✅ Cliquez "Apply" pour créer tout
```

## 5.4 Attendre le déploiement

```
⏳ Le déploiement prend environ 5-10 minutes

Vous verrez:
1. archadvisor-db       → "Available" ✅
2. archadvisor-api      → "Building..." → "Live" ✅
3. archadvisor-frontend → "Building..." → "Live" ✅

⚠️ Si un service échoue, cliquez dessus pour voir les logs
```

---

# ÉTAPE 6: CONFIGURER LA CLÉ GROQ

## 6.1 Aller dans les paramètres du backend

```
1. Dans le Dashboard Render
2. Cliquez sur "archadvisor-api"
3. Dans le menu gauche, cliquez "Environment"
```

## 6.2 Ajouter la clé Groq

```
1. Cliquez "Add Environment Variable"
2. Remplissez:
   - Key: GROQ_API_KEY
   - Value: gsk_xxxxxxxxx (votre clé de l'étape 1)
3. Cliquez "Save Changes"
```

## 6.3 Le service redémarre automatiquement

```
⏳ Attendez ~1 minute que le service redémarre
Le statut passera de "Deploying" à "Live" ✅
```

---

# ÉTAPE 7: TESTER L'APPLICATION

## 7.1 Obtenir l'URL du frontend

```
1. Dans le Dashboard Render
2. Cliquez sur "archadvisor-frontend"
3. En haut, vous verrez l'URL:
   https://archadvisor-frontend.onrender.com
4. Cliquez sur l'URL pour ouvrir l'application
```

## 7.2 Tester les fonctionnalités

```
1. ✅ La page d'accueil s'affiche
2. ✅ Créer un projet
3. ✅ Lancer une analyse IA (devrait fonctionner avec Groq)
4. ✅ Générer un diagramme
5. ✅ Exporter un document
```

---

# 🎉 FÉLICITATIONS!

Votre application est maintenant déployée et accessible au monde entier!

## URLs de votre application:
```
Frontend: https://archadvisor-frontend.onrender.com
Backend:  https://archadvisor-api.onrender.com/api/
```

---

# 🔧 RÉSOLUTION DE PROBLÈMES

## Problème: "AI recommendation failed"

```
CAUSE: Clé Groq non configurée ou invalide

SOLUTION:
1. Vérifiez que GROQ_API_KEY est bien dans Environment
2. Vérifiez que la clé est correcte (commence par gsk_)
3. Créez une nouvelle clé sur console.groq.com si nécessaire
```

## Problème: Le frontend affiche une page blanche

```
CAUSE: Erreur de build ou REACT_APP_BACKEND_URL incorrect

SOLUTION:
1. Allez dans archadvisor-frontend → Logs
2. Cherchez les erreurs en rouge
3. Vérifiez que REACT_APP_BACKEND_URL pointe vers archadvisor-api
```

## Problème: "Cannot connect to database"

```
CAUSE: MongoDB n'est pas prêt

SOLUTION:
1. Vérifiez que archadvisor-db est "Available"
2. Vérifiez que MONGO_URL est connecté dans Environment
3. Redémarrez archadvisor-api (Manual Deploy → Deploy)
```

## Problème: Le site est lent (spin up)

```
CAUSE: Render Free met les services en veille après 15min d'inactivité

SOLUTION:
1. C'est normal - le premier chargement prend ~30 secondes
2. Les requêtes suivantes sont rapides
3. Pour éviter: passer au plan Starter ($7/mois)
```

---

# 📊 RÉSUMÉ DES SERVICES CRÉÉS

| Service | Type | Plan | Coût |
|---------|------|------|------|
| archadvisor-db | MongoDB | Free | $0 |
| archadvisor-api | Python/FastAPI | Free | $0 |
| archadvisor-frontend | Static React | Free | $0 |
| Groq AI | LLM API | Free | $0 |
| **TOTAL** | | | **$0** |

---

# 🔄 COMMENT METTRE À JOUR L'APPLICATION

## Après avoir modifié le code:

```bash
# 1. Dans le dossier du projet
git add .
git commit -m "Description de la modification"
git push

# 2. Render détecte automatiquement le push
# 3. Le déploiement se lance automatiquement
# 4. Attendez ~5 minutes
```

---

*Guide créé par ArchAdvisor - © 2025 Malek Berrezouga*
