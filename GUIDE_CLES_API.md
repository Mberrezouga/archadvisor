# 🔑 Guide Complet des Clés API - ArchAdvisor

## Table des Matières
1. [Comprendre les Clés API](#comprendre-les-clés-api)
2. [Option 1: Clé Emergent (Actuelle)](#option-1-clé-emergent-actuelle)
3. [Option 2: Clé OpenAI (Alternative)](#option-2-clé-openai-alternative)
4. [Où Placer les Clés](#où-placer-les-clés)
5. [Comment Mettre à Jour les Clés](#comment-mettre-à-jour-les-clés)
6. [Mode Gratuit / Free Tier](#mode-gratuit--free-tier)
7. [Troubleshooting](#troubleshooting)

---

## Comprendre les Clés API

L'application utilise l'**Intelligence Artificielle** pour:
- Générer des recommandations d'architecture
- Analyser les risques de sécurité
- Estimer les coûts cloud
- Créer des diagrammes automatiquement
- Générer des documents complets

Pour cela, elle a besoin d'une **clé API** pour communiquer avec un service IA (OpenAI GPT).

---

## Option 1: Clé Emergent (Actuelle)

### Qu'est-ce que c'est?
La **Clé Emergent LLM** est une clé universelle qui donne accès à:
- OpenAI GPT-5.2, GPT-4
- Claude Sonnet
- Gemini

### Clé Actuelle dans l'Application
```
EMERGENT_LLM_KEY=sk-emergent-2436bD408A550E8640
```

### Si la Clé ne Fonctionne Plus

**Symptômes:**
- Message d'erreur "AI recommendation failed"
- Les analyses ne retournent rien
- Erreur "Invalid API key" ou "Insufficient balance"

**Solutions:**

#### Solution A: Recharger le Solde Emergent
1. Aller sur la **plateforme Emergent** où vous avez créé l'app
2. Cliquer sur **Profile** (icône utilisateur)
3. Aller dans **Universal Key**
4. Cliquer **Add Balance**
5. Ajouter $5 ou plus
6. Activer **Auto Top-Up** pour éviter les interruptions

#### Solution B: Passer à OpenAI (voir Option 2)

---

## Option 2: Clé OpenAI (Alternative)

### Étape 1: Créer un Compte OpenAI

1. Aller sur **https://platform.openai.com**
2. Cliquer **Sign Up** (ou **Log In** si vous avez déjà un compte)
3. Vérifier votre email
4. Ajouter un numéro de téléphone (requis)

### Étape 2: Ajouter du Crédit

1. Aller dans **Settings** → **Billing**
2. Cliquer **Add payment method**
3. Ajouter une carte de crédit
4. Cliquer **Add to credit balance**
5. Ajouter **$5 minimum** (suffisant pour ~500 analyses)

### Étape 3: Créer une Clé API

1. Aller sur **https://platform.openai.com/api-keys**
2. Cliquer **+ Create new secret key**
3. Donner un nom: "ArchAdvisor"
4. **COPIER IMMÉDIATEMENT** la clé (elle ne sera plus visible après!)
5. La clé ressemble à: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Coûts OpenAI (Approximatifs)

| Modèle | Coût/1000 tokens | Analyses/5$ |
|--------|------------------|-------------|
| GPT-4o | $0.005 | ~1000 |
| GPT-4 | $0.03 | ~150 |
| GPT-3.5-turbo | $0.001 | ~5000 |

---

## Où Placer les Clés

### En Développement Local

**Fichier:** `/app/backend/.env`

```env
# MongoDB (ne pas modifier)
MONGO_URL=mongodb://localhost:27017
DB_NAME=archadvisor

# CORS
CORS_ORIGINS=*

# ========== CLÉS API - CHOISIR UNE OPTION ==========

# OPTION 1: Clé Emergent (par défaut)
EMERGENT_LLM_KEY=sk-emergent-2436bD408A550E8640

# OPTION 2: Clé OpenAI (décommenter si Emergent ne marche pas)
# OPENAI_API_KEY=sk-proj-votre-cle-openai-ici
```

### Sur Render (Production)

1. Aller sur **https://dashboard.render.com**
2. Sélectionner votre service **archadvisor-api**
3. Aller dans **Environment** (menu gauche)
4. Trouver ou ajouter la variable:
   - **Key:** `EMERGENT_LLM_KEY` ou `OPENAI_API_KEY`
   - **Value:** Votre clé
5. Cliquer **Save Changes**
6. Le service redémarre automatiquement

### Sur Railway

1. Aller sur **https://railway.app/dashboard**
2. Sélectionner votre projet
3. Cliquer sur le service backend
4. Onglet **Variables**
5. Ajouter/modifier la variable
6. Cliquer **Deploy**

---

## Comment Mettre à Jour les Clés

### Scénario 1: Changer de Clé Emergent à OpenAI

**1. Modifier le fichier backend/server.py**

Trouver cette section (autour de la ligne 50):

```python
async def get_ai_recommendation(prompt: str, context: str = "") -> str:
    """Get AI recommendation using Emergent LLM"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            ...
```

**Remplacer par:**

```python
import openai

async def get_ai_recommendation(prompt: str, context: str = "") -> str:
    """Get AI recommendation using OpenAI"""
    try:
        client = openai.AsyncOpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        
        response = await client.chat.completions.create(
            model="gpt-4o",  # ou "gpt-3.5-turbo" pour moins cher
            messages=[
                {
                    "role": "system",
                    "content": """Vous êtes un architecte de solutions TI expert avec 15+ ans d'expérience. 
                    Vous fournissez des recommandations précises, structurées et actionnables en français.
                    Vos réponses sont professionnelles et orientées business."""
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"AI recommendation error: {e}")
        return f"Erreur lors de la génération: {str(e)}"
```

**2. Ajouter openai dans requirements.txt:**

```
openai>=1.0.0
```

**3. Ajouter la variable d'environnement:**

```env
OPENAI_API_KEY=sk-proj-votre-cle
```

**4. Redémarrer le backend:**

```bash
# Local
sudo supervisorctl restart backend

# Render/Railway: Automatique après push
git add .
git commit -m "Switch to OpenAI API"
git push
```

---

## Mode Gratuit / Free Tier

### OpenAI Free Credits (Nouveaux Comptes)
- **$5 de crédit gratuit** pour les nouveaux comptes
- Expire après **3 mois**
- Suffisant pour ~500-1000 analyses

### Alternatives Gratuites

#### 1. Groq (Gratuit et Rapide)
- URL: https://console.groq.com
- Modèles: Llama 3, Mixtral
- **Gratuit** avec rate limits généreux
- Très rapide (inférence matérielle optimisée)

#### 2. Google AI Studio (Gemini)
- URL: https://makersuite.google.com
- Modèle: Gemini Pro
- **Gratuit** jusqu'à 60 requêtes/minute

#### 3. Together.ai
- URL: https://together.ai
- Modèles: Llama, Mistral, etc.
- **$25 de crédit** à l'inscription

---

## Troubleshooting

### Erreur: "Invalid API key"

```
Cause: La clé est incorrecte ou expirée
Solution: 
1. Vérifier que la clé est complète (pas de caractères manquants)
2. Créer une nouvelle clé sur OpenAI
3. Mettre à jour dans .env et redémarrer
```

### Erreur: "Insufficient balance"

```
Cause: Plus de crédit sur le compte
Solution:
1. Emergent: Profile → Universal Key → Add Balance
2. OpenAI: Settings → Billing → Add to credit balance
```

### Erreur: "Rate limit exceeded"

```
Cause: Trop de requêtes en peu de temps
Solution:
1. Attendre quelques secondes entre les requêtes
2. Passer à un plan payant supérieur
3. Implémenter un cache Redis pour les réponses
```

### L'IA répond en anglais au lieu du français

```
Cause: Le system prompt n'est pas en français
Solution: Vérifier que le system_message contient:
"Vous fournissez des recommandations... en français."
```

### Les analyses sont très lentes

```
Cause: Modèle trop lourd ou serveur surchargé
Solution:
1. Utiliser gpt-3.5-turbo au lieu de gpt-4
2. Réduire max_tokens de 2000 à 1000
3. Utiliser Groq pour une inférence plus rapide
```

---

## Résumé Rapide

| Situation | Action |
|-----------|--------|
| Clé Emergent ne marche plus | Recharger sur Profile → Universal Key |
| Veut utiliser OpenAI | Créer clé sur platform.openai.com |
| Veut gratuit | Utiliser Groq ou Google AI Studio |
| Erreur après déploiement | Vérifier variables d'env sur Render |

---

## Contact Support

Si vous avez des problèmes:
1. Vérifier les logs: `tail -f /var/log/supervisor/backend.err.log`
2. Tester l'API: `curl http://localhost:8001/api/`
3. Vérifier la connexion MongoDB: `curl http://localhost:8001/api/stats`

---

*Guide créé par ArchAdvisor - © 2025 Malek Berrezouga*
