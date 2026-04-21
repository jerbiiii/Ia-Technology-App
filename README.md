# IA-Technology - Plateforme de Recherche Scientifique 🔬

## 📝 Contexte et Objectifs
Dans le cadre de la structuration et de la valorisation des activités de recherche et développement au sein de l'entreprise **IA-Technology**, ce projet vise à concevoir et développer une application web professionnelle dédiée à la gestion et à la diffusion des travaux scientifiques.

La plateforme permet de :
- Centraliser les informations relatives aux chercheurs et aux publications.
- Valoriser les projets en **Intelligence Artificielle** :
  - Traitement Automatique du Langage Naturel (NLP)
  - Vision par ordinateur
  - Cybersécurité basée sur l'IA
  - Autres domaines émergents
- Fournir un environnement interactif, sécurisé et évolutif.

## 🏗 Architecture Technique
L'application adopte une architecture client-serveur moderne :

### Backend
- **Framework** : Spring Boot (Java)
- **API** : REST sécurisée
- **ORM** : JPA / Hibernate
- **Base de données** : MySQL ou PostgreSQL

### Frontend
- **Framework** : React
- **Architecture** : Modulaire, Interface responsive (desktop et mobile)
- **Communication** : via services REST

### Sécurité
- Authentification via **JWT** (JSON Web Token)
- Gestion des rôles : **Admin**, **Modérateur**, **Utilisateur**
- Protection contre CSRF, XSS et autres vulnérabilités

## ⚙️ Fonctionnalités Principales

### 👑 Espace Administrateur
- Gestion des chercheurs (Ajout, modification, suppression, recherche).
- Gestion des domaines (Création, classification).
- Gestion des publications (Ajout, upload PDF/DOI, association aux chercheurs).
- Gestion des comptes et attribution des rôles.

### 🛡️ Espace Modérateur
- Gestion du contenu de la page d'accueil.
- Publication d'actualités et d'annonces.
- Mise en avant des projets récents.

### 👤 Espace Utilisateur
- Gestion de compte (Inscription, authentification, profil).
- Recherche et consultation (Par domaine, chercheur, mots-clés).
- Accès libre pour la consultation de la page d'accueil.

## 🧠 Module IA (Avancé)
Un module d'Intelligence Artificielle intégré via une API dédiée, offrant des fonctionnalités telles que :
- Classification automatique des publications
- Extraction automatique de mots-clés
- Système de recommandation
- Recherche sémantique intelligente

## 🚀 Installation & Lancement
.\mvnw spring-boot:run

npm run dev 

python app.py

**Module :** Développement Web Avancé - Mini Projet  
**Année Universitaire :** 2025-2026
