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

# Lire la clé depuis le fichier
with open("groq_key.txt", "r") as f:
    GROQ_API_KEY = f.read().strip()  # retire les espaces ou sauts de ligne

print("Clé Groq chargée avec succès !")  # juste pour vérifier
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile") 

groq_client = Groq(api_key=GROQ_API_KEY)

# ─────────────────────────────────────────────
# CHARGEMENT MODÈLE EMBEDDING (BGE-M3)
# ─────────────────────────────────────────────

print("Chargement du modèle BGE-M3...")
embedder = SentenceTransformer("BAAI/bge-m3")
print("Modèle chargé ✅")

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
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=full_messages,
            temperature=0.2,
            max_tokens=400
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Erreur Groq : {e}")
        return "{}"

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

@app.route("/api/ia/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message requis"}), 400

    user_message = data["message"].strip()
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