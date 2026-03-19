from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from groq import Groq
import numpy as np
import os
import json

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────
# CONFIGURATION LLM (GROQ API)
# ─────────────────────────────────────────────

# Lire la clé
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

if not GROQ_API_KEY:
    if os.path.exists("groq_key.txt"):
        with open("groq_key.txt", "r") as f:
            GROQ_API_KEY = f.read().strip()
    else:
        print("ATTENTION : 'groq_key.txt' est manquant et GROQ_API_KEY n'est pas définie.")
        GROQ_API_KEY = "dummy_key_please_replace"

print(f"Clé Groq chargée : {'...' + GROQ_API_KEY[-4:] if GROQ_API_KEY and len(GROQ_API_KEY) > 4 else GROQ_API_KEY}")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile") 

try:
    groq_client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Erreur d'initialisation Groq : {e}")
    groq_client = None

# ─────────────────────────────────────────────
# CHARGEMENT MODÈLE EMBEDDING (BGE-M3)
# ─────────────────────────────────────────────

print("Chargement du modele BGE-M3...")
embedder = SentenceTransformer("BAAI/bge-m3")
print("Modele charge")

# ─────────────────────────────────────────────
# SYSTEM PROMPT MULTI-ACTEURS
# ─────────────────────────────────────────────

SYSTEM_PROMPT = """Tu es ARIA, l'assistant IA intelligent et officiel de la plateforme IA-Technology.
IA-Technology est une plateforme professionnelle de gestion et de diffusion des travaux scientifiques et publications de recherche en Intelligence Artificielle (NLP, Vision par ordinateur, Cybersécurité IA, et autres domaines émergents).

════════════════════════════════════════
ACTEURS ET LEURS DROITS D'ACCÈS
════════════════════════════════════════

🔴 ADMINISTRATEUR (role: ADMIN)
  Accès complet à toutes les fonctionnalités :
  - Gestion des chercheurs (ajouter, modifier, supprimer, consulter les profils)
  - Gestion des domaines scientifiques (créer, modifier, classifier)
  - Gestion des publications (ajouter, modifier, supprimer, uploader PDF/DOI)
  - Gestion des comptes utilisateurs (créer, supprimer, attribuer des rôles)
  - Accès aux statistiques et tableaux de bord

🟡 MODÉRATEUR (role: MODERATOR)
  Accès limité à la gestion du contenu éditorial :
  - Gestion de la page d'accueil (actualités, annonces, projets mis en avant)
  - Publication et modification des actualités
  - Mise en avant des projets récents
  ⚠️ PAS d'accès à : gestion des comptes, chercheurs, publications scientifiques

🟢 UTILISATEUR CONNECTÉ (role: USER)
  Accès aux fonctionnalités de recherche et consultation :
  - Inscription et gestion de son profil personnel
  - Recherche de publications (par domaine, nom de chercheur, mots-clés)
  - Consultation et TÉLÉCHARGEMENT des publications
  ⚠️ PAS d'accès à : fonctions d'administration ou de modération

⚪ VISITEUR (non connecté)
  Accès très limité :
  - Consultation de la page d'accueil uniquement
  - Consultation des publications sans téléchargement
  ⚠️ PAS d'accès à : recherche avancée, téléchargement, profil, administration

════════════════════════════════════════
FONCTIONNALITÉS DE L'APPLICATION
════════════════════════════════════════
- Centralisation des informations sur les chercheurs et publications scientifiques
- Recherche sémantique intelligente par domaine, chercheur, ou mots-clés
- Consultation et téléchargement de documents (PDF, DOI)
- Actualités et annonces sur les projets IA
- Interface responsive (desktop et mobile)
- Sécurité JWT avec gestion des rôles

════════════════════════════════════════
MODE QUESTIONNAIRE DE RECHERCHE PAR INTÉRÊTS
════════════════════════════════════════
Quand un utilisateur veut trouver des publications ou n'est pas précis dans sa demande,
tu dois l'interroger ÉTAPE PAR ÉTAPE comme un formulaire intelligent (une seule question à la fois) :

ÉTAPE 1 - Domaine scientifique :
  "Dans quel domaine souhaitez-vous chercher ?
   • 🤖 NLP / Traitement du Langage Naturel
   • 👁️ Vision par ordinateur
   • 🔒 Cybersécurité basée sur l'IA
   • 📊 Machine Learning / Deep Learning
   • 🌐 Autre domaine (précisez)"

ÉTAPE 2 - Type de contenu :
  "Quel type de travaux recherchez-vous ?
   • 📄 Articles scientifiques
   • 🎓 Thèses / Mémoires
   • 🔬 Projets de recherche
   • 📚 Tous types"

ÉTAPE 3 - Période :
  "Avez-vous une préférence sur la période ?
   • 📅 Récent (2023-2025)
   • 📅 Dernières 5 ans (2020-2025)
   • 📅 Sans restriction"

ÉTAPE 4 - Mot-clé spécifique (optionnel) :
  "Avez-vous un mot-clé ou un nom de chercheur spécifique ? (ou tapez 'Non' pour ignorer)"

Après avoir collecté les informations, LANCE la recherche sémantique.

════════════════════════════════════════
RÈGLES DE COMPORTEMENT
════════════════════════════════════════
- Réponds TOUJOURS en français.
- Réponds UNIQUEMENT avec un JSON valide, sans texte hors JSON.
- Ne fabrique JAMAIS de publications ou de chercheurs inexistants.
- Utilise UNIQUEMENT les publications fournies dans le contexte.
- Si un utilisateur demande une action pour laquelle il n'a pas les droits, explique-lui poliment qu'il doit se connecter ou contacter l'administrateur.
- Sois professionnel, chaleureux et précis.
- Si la question n'est pas liée à la plateforme, redirige poliment mais réponds brièvement.

════════════════════════════════════════
FORMAT DE RÉPONSE JSON STRICT
════════════════════════════════════════

1️⃣ Pour poser une question (questionnaire) :
{
  "action": "QUESTION",
  "step": <numéro_étape>,
  "reply": "Question posée à l'utilisateur pour préciser ses intérêts."
}

2️⃣ Pour lancer une recherche sémantique :
{
  "action": "SEARCH",
  "query": "mots-clés optimisés pour la recherche",
  "reply": "Message professionnel annonçant que la recherche est lancée."
}

3️⃣ Pour une réponse informative (guide, aide, navigation) :
{
  "action": "CHAT",
  "reply": "Réponse claire, structurée et utile."
}

4️⃣ Pour un accès refusé (rôle insuffisant) :
{
  "action": "ACCESS_DENIED",
  "reply": "Message poli expliquant que cette fonctionnalité nécessite un rôle spécifique (connectez-vous ou contactez l'admin)."
}
"""

# ─────────────────────────────────────────────
# RECHERCHE SÉMANTIQUE
# ─────────────────────────────────────────────

def cosine_similarity(vec, matrix):
    vec_norm = vec / (np.linalg.norm(vec) + 1e-10)
    norms = np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-10
    matrix_norm = matrix / norms
    return matrix_norm.dot(vec_norm)

def search_publications(query, publications, top_k=5):
    if not publications or not query:
        return []

    texts = [f"{p.get('titre', '')}. {p.get('resume', '')}" for p in publications]

    q_emb = embedder.encode(query)
    p_embs = embedder.encode(texts)

    scores = cosine_similarity(q_emb, p_embs)

    results = [{**pub, "score": float(scores[i])}
               for i, pub in enumerate(publications)]

    results = [r for r in results if r["score"] > 0.25]
    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:top_k]

def format_publications_for_prompt(publications):
    if not publications:
        return "Aucune publication disponible."

    lines = []
    for i, p in enumerate(publications[:30], 1):
        titre = p.get("titre", "Sans titre")
        resume = (p.get("resume") or "")[:180]
        annee = p.get("annee", "")
        lines.append(f"{i}. [{p.get('id')}] {titre} ({annee}) - {resume}")

    return "\n".join(lines)

# ─────────────────────────────────────────────
# APPEL GROQ API
# ─────────────────────────────────────────────

def call_groq(messages, system_with_context):
    full_messages = [{"role": "system", "content": system_with_context}] + messages

    try:
        if not GROQ_API_KEY or GROQ_API_KEY == "dummy_key_please_replace":
            return json.dumps({
                "action": "CHAT",
                "reply": "⚠️ La clé API Groq est manquante ou invalide. Veuillez configurer 'GROQ_API_KEY' ou créer le fichier 'groq_key.txt' pour activer ARIA."
            })

        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=full_messages,
            temperature=0.2,
            max_tokens=400
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Erreur Groq : {e}")
        return json.dumps({
            "action": "CHAT",
            "reply": f"Désolé, j'ai rencontré une erreur technique lors de la communication avec l'IA : {str(e)}"
        })

def parse_llm_response(raw):
    try:
        return json.loads(raw)
    except:
        try:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            return json.loads(raw[start:end])
        except:
            return {"action": "CHAT", "reply": "Erreur de format IA."}

# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    try:
        test = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=5
        )
        llm_ok = test.choices[0].message.content is not None
    except:
        llm_ok = False

    return jsonify({
        "status": "ok",
        "llm": "online" if llm_ok else "offline",
        "model": GROQ_MODEL,
        "embedding": "BAAI/bge-m3"
    })

@app.route("/api/ia/search-semantic", methods=["POST"])
def semantic_search():
    data = request.get_json()
    if not data or "query" not in data or "publications" not in data:
        return jsonify({"error": "Champs requis manquants"}), 400

    results = search_publications(
        data["query"].strip(),
        data["publications"],
        data.get("topK", 6)
    )

    return jsonify(results)

# ─────────────────────────────────────────────
# CLASSIFICATION AUTOMATIQUE DES PUBLICATIONS
# ─────────────────────────────────────────────

# Domaines avec descriptions enrichies (utilisées pour l'embedding)
DOMAINS_LABELS = {
    "NLP / Traitement du Langage Naturel": "natural language processing text classification sentiment analysis named entity recognition transformer BERT GPT language model machine translation",
    "Vision par ordinateur": "computer vision image recognition object detection convolutional neural network CNN image segmentation face recognition deep learning visual",
    "Cybersécurité basée sur l'IA": "cybersecurity intrusion detection anomaly detection malware network security threat intelligence adversarial attacks machine learning security",
    "Machine Learning / Deep Learning": "machine learning deep learning neural network supervised unsupervised reinforcement learning optimization gradient descent classification regression",
    "Traitement du signal": "signal processing audio speech recognition time series frequency domain feature extraction fourier transform",
    "Robotique et IA embarquée": "robotics autonomous systems embedded AI real-time control path planning reinforcement learning",
    "Systèmes de recommandation": "recommendation system collaborative filtering content-based filtering matrix factorization user behavior personalization",
    "Big Data et Analyse de données": "big data data analysis data mining clustering feature engineering dimensionality reduction statistical learning",
}

# Cache calculé une seule fois au premier appel
_domain_emb_cache = None

def get_cached_domain_embeddings():
    global _domain_emb_cache
    if _domain_emb_cache is None:
        print("Calcul des embeddings de domaines pour la classification...")
        labels = list(DOMAINS_LABELS.keys())
        descriptions = list(DOMAINS_LABELS.values())
        embs = embedder.encode(descriptions)
        _domain_emb_cache = list(zip(labels, embs))
        print(f"Embeddings calculés pour {len(labels)} domaines")
    return _domain_emb_cache


@app.route("/api/ia/classify", methods=["POST"])
def classify_publication():
    """
    Classification automatique d'une publication dans un domaine de recherche.

    Corps JSON attendu :
      { "titre": "...", "resume": "...", "topK": 3 }

    Réponse :
      {
        "domaine_principal": "NLP / Traitement du Langage Naturel",
        "score": 0.87,
        "top_k": [{"domaine": "...", "score": ...}, ...]
      }
    """
    data = request.get_json()
    if not data or "titre" not in data:
        return jsonify({"error": "Le champ 'titre' est requis"}), 400

    titre  = data.get("titre",  "").strip()
    resume = data.get("resume", "").strip()
    top_k  = int(data.get("topK", 3))

    text = f"{titre}. {resume}" if resume else titre

    pub_emb = embedder.encode(text)
    domain_embeddings = get_cached_domain_embeddings()

    scores = []
    for label, dom_emb in domain_embeddings:
        score = float(cosine_similarity(pub_emb, dom_emb.reshape(1, -1))[0])
        scores.append({"domaine": label, "score": round(score, 4)})

    scores.sort(key=lambda x: x["score"], reverse=True)
    top_results = scores[:top_k]
    best = top_results[0] if top_results else {"domaine": "Non classifiable", "score": 0.0}

    return jsonify({
        "domaine_principal": best["domaine"],
        "score": best["score"],
        "top_k": top_results,
        "texte_analyse": (text[:150] + "...") if len(text) > 150 else text
    })


@app.route("/api/ia/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message requis"}), 400

    user_message = data["message"].strip()
    print(f"--- Chat Request: {user_message} ---")
    history = data.get("history", [])
    publications = data.get("publications", [])
    user_role = data.get("userRole", "VISITOR")  # ADMIN, MODERATOR, USER, VISITOR

    # Mapping des rôles pour le prompt
    role_labels = {
        "ADMIN": "🔴 ADMINISTRATEUR — accès complet à toutes les fonctionnalités.",
        "MODERATOR": "🟡 MODÉRATEUR — accès à la gestion du contenu éditorial uniquement.",
        "USER": "🟢 UTILISATEUR CONNECTÉ — accès à la recherche et consultation des publications.",
        "VISITOR": "⚪ VISITEUR non connecté — accès à la page d'accueil uniquement, sans téléchargement ni recherche avancée."
    }
    role_info = role_labels.get(user_role.upper(), role_labels["VISITOR"])

    pubs_context = format_publications_for_prompt(publications)

    system_with_context = f"""{SYSTEM_PROMPT}

════════════════════════════════════════
CONTEXTE DE LA SESSION COURANTE
════════════════════════════════════════
Rôle de l'utilisateur actuel : {role_info}
Adapte tes réponses et les fonctionnalités proposées UNIQUEMENT à ce rôle.

Publications disponibles ({len(publications)}) :
{pubs_context}
"""

    llm_messages = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history
        if msg.get("role") in ("user", "assistant")
    ]

    llm_messages.append({"role": "user", "content": user_message})

    raw = call_groq(llm_messages, system_with_context)
    print(f"--- Raw LLM Response: {raw} ---")
    parsed = parse_llm_response(raw)

    action = parsed.get("action", "CHAT")
    reply = parsed.get("reply", "Je n'ai pas compris votre demande.")

    if action == "SEARCH":
        query = parsed.get("query", user_message)
        results = search_publications(query, publications, top_k=6)

        if not results:
            reply = f"Aucune publication trouvée pour « {query} ». Voulez-vous reformuler ?"

        return jsonify({
            "reply": reply,
            "results": results,
            "search_done": True,
            "action": "SEARCH",
            "query_used": query
        })

    if action == "QUESTION":
        return jsonify({
            "reply": reply,
            "results": [],
            "search_done": False,
            "action": "QUESTION",
            "step": parsed.get("step", 1)
        })

    if action == "ACCESS_DENIED":
        return jsonify({
            "reply": reply,
            "results": [],
            "search_done": False,
            "action": "ACCESS_DENIED"
        })

    # CHAT par défaut
    return jsonify({
        "reply": reply,
        "results": [],
        "search_done": False,
        "action": action
    })

# ─────────────────────────────────────────────


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)