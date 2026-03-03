<p align="center">
  <h1 align="center">🚀 GrowTrack</h1>
  <p align="center">
    <strong>Plateforme de Gestion de Projets & Planification Financière propulsée par l'IA</strong>
  </p>
  <p align="center">
    Un outil full-stack intelligent qui exploite Google Gemini AI pour automatiser les plans de staffing, générer des backlogs produit, recommander des stacks technologiques et fournir des prévisions financières ROI — le tout à partir d'un simple PDF.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Laravel-12-red?logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/Python-3.12-green?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Compose-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/IA-Google%20Gemini-orange?logo=google" alt="Gemini AI">
</p>

---

## 📋 Table des Matières

- [Aperçu](#-aperçu)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Architecture](#-architecture)
- [Stack Technologique](#-stack-technologique)
- [Structure du Projet](#-structure-du-projet)
- [Schéma de Base de Données](#-schéma-de-base-de-données)
- [Système IA en Détail](#-système-ia-en-détail)
- [Documentation API](#-documentation-api)
- [Authentification & Sécurité](#-authentification--sécurité)
- [Architecture Frontend](#-architecture-frontend)
- [Démarrage Rapide](#-démarrage-rapide)
- [Déploiement Docker](#-déploiement-docker)
- [Tests](#-tests)
- [Variables d'Environnement](#-variables-denvironnement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🌟 Aperçu

**GrowTrack** est une plateforme complète de gestion de projets destinée aux **Chefs de Projet**. Elle intègre de manière unique une analyse propulsée par l'IA dans le cycle de vie du projet, transformant les documents d'exigences bruts (PDFs — *Cahier des Charges*) en plans de staffing actionnables, backlogs détaillés, recommandations technologiques et prévisions financières.

### Le Problème

Les chefs de projet passent un temps considérable à :
- Estimer les coûts et les besoins en personnel d'un projet
- Décomposer les exigences en epics, user stories et tâches
- Évaluer les stacks technologiques adaptés aux nouveaux projets
- Calculer le ROI et les projections financières

### La Solution

GrowTrack automatise tout cela grâce à **Google Gemini AI**, fournissant des résultats structurés et basés sur les données via une interface de type wizard qui guide le chef de projet à travers l'ensemble du processus de création de projet.

---

## ✨ Fonctionnalités Clés

### 🤖 Genèse de Projet par IA (Wizard)

Un assistant guidé en plusieurs étapes qui transforme un PDF d'exigences brut en un projet entièrement planifié :

| Étape | Nom | Ce qui se passe |
|:-----:|-----|----------------|
| 1 | **Upload du Cahier des Charges** | Glissez-déposez un PDF d'exigences. L'IA extrait et comprend la portée complète du projet. |
| 2 | **Configuration du Pool de Ressources** | Choisissez votre stratégie de staffing : sélectionnez des ingénieurs depuis votre **Pool Interne** (employés pré-enregistrés) ou définissez un **Pool Dynamique** avec des rôles, niveaux et salaires personnalisés. |
| 3 | **Clé API Gemini** | Saisissez votre clé API Google Gemini (utilisée par requête, jamais stockée côté serveur). |
| 4 | **Analyse IA & Résultats** | L'IA exécute trois analyses séquentielles et présente un plan de projet complet prêt à être sauvegardé. |

**Résultats des Analyses IA :**

- **📊 Plan de Staffing & Financier** — Composition d'équipe optimisée avec ventilation des coûts par ingénieur, répartition CAPEX/OPEX, projections ROI sur 3 ans avec point de rentabilité, KPIs, évaluation des risques et estimation des coûts d'infrastructure.
- **📋 Backlog Agile** — Backlog Scrum complet : Epics → User Stories (avec story points, critères d'acceptation au format happy-path + cas limites) → Tâches Techniques (avec rôles assignés, estimations horaires et instructions d'implémentation étape par étape).
- **🛠️ Recommandation Tech Stack** — Recommandation principale + alternative avec patterns d'architecture, découpage par catégorie (Frontend, Backend, Base de données, DevOps, IA/ML), explications de synergie, évaluation des risques et conseils pour développeurs juniors.

---

### 📊 Système de Tableaux de Bord

#### Tableau de Bord Global
- **Cartes résumé de projets** — Visualisation de tous vos projets avec métriques clés (coût, durée, statut)
- **Statistiques rapides** — Nombre total de projets, d'employés, d'investissement et de projets actifs
- **Actions rapides** — Accès en un clic pour créer des projets ou gérer les équipes

#### Tableau de Bord Projet
- **Cartes KPI financiers** — CAPEX total, OPEX, coût du projet, ROI % et point de rentabilité affichés sous forme de cartes interactives
- **Aperçu de l'équipe** — Visualisation des ingénieurs assignés avec rôles, niveaux et coûts mensuels
- **Analyse des risques** — Indicateurs visuels de sévérité avec descriptions
- **Chronologie du projet** — Date de début, date de fin prévue et durée estimée

---

### 💰 Blueprint Financier

Une vue d'analyse financière complète pour chaque projet :

- **Résumé de l'Équipe Assignée** — Tableau de tous les ingénieurs avec rôle, spécialisation, niveau, salaire mensuel, mois assignés et coût total
- **Coûts Licences & API** — Services tiers nécessaires avec ventilation des coûts
- **Ventilation CAPEX** — Tous les coûts de développement incluant le buffer de contingence (15-20%)
- **Ventilation OPEX** — Coûts récurrents : abonnements cloud, ingénieurs maintenance, totaux annuels
- **Tableau de Bord KPI** — Métriques de succès non financières avec valeurs cibles et méthodes de mesure
- **Évaluation des Risques** — Risques projet avec niveaux de sévérité et stratégies de mitigation
- **Gains Estimés** — Bénéfices financiers annuels projetés avec formules
- **Projections ROI** — Tableau de prévision sur 3 ans : coûts cumulés, gains cumulés, flux de trésorerie net et pourcentage ROI par année
- **📄 Export PDF** — Export en un clic de l'analyse financière complète via `html2pdf.js`

---

### 📋 Blueprint Scrum Master

Un visualiseur interactif de backlog Agile présenté sous forme de wizard navigable :

- **Navigation par Epic** — Parcourez les epics du projet avec descriptions et nombres de stories
- **User Stories** — Pour chaque epic, visualisez les stories au format « En tant que... Je veux... Afin de... » avec :
  - Story points (échelle Fibonacci)
  - Critères d'acceptation (binaire réussi/échoué, couvrant happy path + cas limites)
- **Tâches Techniques** — Pour chaque story, visualisez les tâches d'implémentation avec :
  - Rôle et niveau assignés (correspondant au plan de staffing)
  - Estimations horaires
  - Instructions d'implémentation étape par étape (stack, sécurité, bonnes pratiques)
- **Navigation en profondeur** — Cliquez à travers Epics → Stories → Tâches dans une interface hiérarchique claire

---

### 🛠️ Visualisation du Choix de Stack

- **Comparaison côte à côte** — Stack recommandée vs. alternative affichées en parallèle
- **Découpage par catégorie** — Technologies groupées par couche : Frontend, Backend, Base de données, DevOps, IA/ML
- **Stratégie & Architecture** — Stratégie nommée (ex. « Modern Fullstack ») avec explication du pattern d'architecture
- **Analyse de synergie** — Comment les technologies choisies se complètent
- **Évaluation des risques** — Risques techniques et goulots d'étranglement potentiels
- **Conseils juniors** — Guide d'accessibilité pour les ingénieurs moins expérimentés par technologie

---

### 👥 Gestion d'Équipe & Employés

> **Note :** Seul le **Chef de Projet** possède un compte utilisateur. Les employés sont des ressources gérées par le chef de projet — ils n'ont pas de compte et ne se connectent pas à la plateforme.

#### Gestion des Employés
- **CRUD complet** — Créer, lire, modifier et supprimer des employés avec : prénom, nom, email et spécialisation
- **Assignation de spécialisation** — Lier les employés à des spécialisations prédéfinies (ex. Développeur Backend Senior, DevOps Junior)
- **Suivi d'engagement** — Suivre si un employé est actuellement assigné à un projet (indicateur `is_engaged`)
- **Opérations en masse** — Sélectionner plusieurs employés pour suppression par lot
- **Table de données** — Tableau triable, recherchable et paginé avec actions en ligne

#### Gestion des Spécialisations
- **CRUD complet** — Créer et gérer les catégories de spécialisation (nom + description)
- **Suppression en masse** — Gestion par lot des spécialisations
- **Utilisation** — Les spécialisations sont liées aux employés et aux ingénieurs assignés

#### Gestion d'Équipe Projet
- **Assigner des employés** — Ajouter des employés du pool à un projet spécifique
- **Désassigner des employés** — Retirer des membres d'équipe d'un projet
- **Voir la composition d'équipe** — Visualiser tous les ingénieurs assignés avec leurs rôles et coûts

---

### 🔐 Authentification

- **Connexion / Déconnexion** — Authentification par email + mot de passe avec sessions basées sur des tokens
- **Inscription** — Création de compte utilisateur pour les chefs de projet
- **Google OAuth** — Connexion en un clic via Google (intégration Firebase Authentication)
- **Mot de passe oublié** — Flux de réinitialisation par email avec liens tokenisés
- **Gestion du profil** — Mise à jour des informations personnelles, changement de mot de passe, upload d'avatar

---

### 🌐 Page d'Accueil

- **Section héro animée** — Première impression engageante avec animations GSAP basées sur le scroll
- **Vitrine des fonctionnalités** — Sections interactives mettant en valeur les capacités IA, la planification financière et la gestion d'équipe
- **Prévisions Financières** — Section dédiée avec KPIs animés (CAPEX, OPEX, ROI, Break-even), tableau de projection ROI sur 3 ans et équipe recommandée par l'IA
- **Appels à l'action** — Liens directs pour s'inscrire ou se connecter
- **Design responsive** — Entièrement optimisé pour desktop, tablette et mobile

---

### 🔔 Fonctionnalités Additionnelles

- **Centre de notifications** — Notifications in-app pour les mises à jour d'équipe et de projet
- **Page de paramètres** — Préférences et configuration de l'application
- **Gestion d'erreurs** — Traitement gracieux des erreurs avec pages conviviales
- **Bannière hors-ligne** — Indicateur visuel en cas de perte de connexion internet
- **Défilement fluide** — Expérience de scroll fluide via Lenis
- **Palette de commandes** — Barre de commandes rapide (`cmdk`) pour utilisateurs avancés
- **Notifications toast** — Retours non intrusifs via le système de toast Sonner

---

## 🏛️ Architecture

GrowTrack suit une **architecture inspirée des microservices** avec trois services distincts orchestrés via Docker Compose :

```
┌───────────────────────────────────────────────────────────────┐
│                        NGINX (Port 80)                        │
│                    Reverse Proxy & Fichiers Statiques          │
├────────────┬─────────────────────────┬────────────────────────┤
│   /  (SPA) │    /api/* (API REST)    │    /ai/* (Moteur IA)   │
│            │                         │                        │
│  React App │   Backend Laravel       │   FastAPI (Python)     │
│  (Statique)│   (PHP-FPM:9000)        │   (Uvicorn:8001)      │
│            │                         │                        │
│  Vite      │   Sanctum Auth          │   Google Gemini API    │
│ TailwindCSS│   PostgreSQL 15         │   Schémas Pydantic     │
│  React 19  │   Eloquent ORM          │   PyMuPDF (Parse PDF)  │
└────────────┴──────────┬──────────────┴────────────────────────┘
                        │
                 ┌──────┴──────┐
                 │ PostgreSQL  │
                 │   15-Alpine │
                 │  (Port 5432)│
                 └─────────────┘
```

### Communication entre Services

| Service | Port Interne | Protocole | Rôle |
|---------|:------------:|-----------|------|
| **Frontend (Nginx)** | `80` | HTTP | Sert la SPA React + reverse-proxy API & IA |
| **Backend (PHP-FPM)** | `9000` | FastCGI | Traite les requêtes API REST depuis Nginx |
| **Système IA (Uvicorn)** | `8001` | HTTP | Gère les requêtes d'analyse IA via proxy |
| **Base de Données (PostgreSQL)** | `5432` | TCP | Stockage persistant des données |

---

## 🧰 Stack Technologique

### Frontend
| Technologie | Version | Utilité |
|-------------|---------|---------|
| **React** | 19.2 | Bibliothèque UI avec les dernières fonctionnalités |
| **Vite** | 7.2 | Outil de build ultra-rapide et serveur de développement |
| **TailwindCSS** | 4.1 | Framework CSS utility-first |
| **React Router DOM** | 7.12 | Routage côté client avec layouts imbriqués |
| **TanStack React Query** | 5.90 | Gestion de l'état serveur avec cache et auto-refetch |
| **TanStack React Table** | 8.21 | Table headless pour les vues riches en données |
| **Axios** | 1.13 | Client HTTP avec intercepteurs pour refresh de tokens |
| **Radix UI** | Latest | Primitives UI accessibles et non-stylisées |
| **shadcn/ui** | Latest | Bibliothèque de composants basée sur Radix UI |
| **Framer Motion** | 12.23 | Animations déclaratives |
| **GSAP** | 3.14 | Animations avancées basées sur le scroll |
| **Chart.js + react-chartjs-2** | 4.5 / 5.3 | Graphiques de visualisation de données |
| **Lucide React** | 0.561 | Bibliothèque d'icônes |
| **Sonner** | 2.0 | Système de notifications toast |
| **html2pdf.js** | 0.14 | Génération de PDF côté client |
| **@react-pdf/renderer** | 4.3 | Génération de documents PDF avec React |
| **Lenis** | 1.3 | Bibliothèque de défilement fluide |
| **cmdk** | 1.1 | Composant palette de commandes |
| **Firebase** | Latest | Authentification Google OAuth |

### Backend
| Technologie | Version | Utilité |
|-------------|---------|---------|
| **Laravel** | 12.0 | Framework web PHP (API REST) |
| **PHP** | 8.2+ | Runtime côté serveur |
| **Laravel Sanctum** | 4.2 | Authentification par tokens avec cookies HttpOnly |
| **PostgreSQL** | 15 | Base de données relationnelle |
| **Eloquent ORM** | — | Abstraction de la BDD avec relations et factories |
| **PHPUnit** | 11.5 | Tests unitaires & fonctionnels |
| **Faker** | 1.23 | Génération de données de test |

### Système IA
| Technologie | Version | Utilité |
|-------------|---------|---------|
| **FastAPI** | Latest | Framework web Python asynchrone pour les endpoints IA |
| **Uvicorn** | Latest | Serveur ASGI pour FastAPI |
| **Google Generative AI** | Latest | Intégration LLM Google Gemini (Gemini 2.5 Flash) |
| **Instructor** | Latest | Extraction structurée des sorties LLM (intégration Pydantic) |
| **Pydantic** | Latest | Validation de données et définition de schémas |
| **PyMuPDF (fitz)** | Latest | Extraction de texte depuis les PDFs |
| **pytest** | Latest | Framework de test Python |
| **httpx** | Latest | Client HTTP asynchrone pour les tests |

### DevOps & Infrastructure
| Technologie | Utilité |
|-------------|---------|
| **Docker** | Conteneurisation des 4 services |
| **Docker Compose** | Orchestration multi-conteneurs |
| **Nginx** | Reverse proxy, fichiers statiques et routage |
| **GitHub Actions** | CI/CD (`.github/workflows/`) |

---

## 📂 Structure du Projet

```
growtrack/
├── 📁 frontend/                    # SPA React (Vite + TailwindCSS)
│   ├── 📁 nginx/
│   │   └── default.conf            # Configuration reverse proxy Nginx
│   ├── 📁 public/                  # Assets statiques
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 shared/          # Composants réutilisables (DataTable, Modals, Cards)
│   │   │   └── 📁 ui/              # Primitives UI (Button, Input, Dialog, etc.)
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx      # Gestion de l'état d'authentification
│   │   │   └── ProjectContext.jsx   # Suivi du contexte projet courant
│   │   ├── 📁 features/
│   │   │   ├── 📁 ai-analysis/     # Composants & API d'analyse IA
│   │   │   ├── 📁 auth/            # Fonctionnalité d'authentification
│   │   │   ├── 📁 dashboard/       # Composants tableau de bord
│   │   │   ├── 📁 projects/        # Gestion des projets
│   │   │   └── 📁 team/            # Gestion d'équipe
│   │   ├── 📁 layouts/
│   │   │   ├── Navbar.jsx           # Barre de navigation supérieure
│   │   │   ├── Sidebar.jsx          # Navigation latérale avec contexte projet
│   │   │   ├── PrivateLayout.jsx    # Wrapper de routes authentifiées
│   │   │   └── ProjectLayout.jsx    # Wrapper de routes à portée projet
│   │   ├── 📁 lib/
│   │   │   ├── axios.js             # Instance Axios avec intercepteurs d'auth
│   │   │   └── firebase.js          # Configuration Firebase/Google OAuth
│   │   ├── 📁 pages/               # Composants de pages
│   │   ├── 📁 utils/               # Modules utilitaires
│   │   ├── App.jsx                  # Configuration des routes
│   │   ├── LandingPage.jsx          # Page d'accueil publique
│   │   ├── main.jsx                 # Point d'entrée de l'application
│   │   └── index.css                # Styles globaux
│   ├── Dockerfile                   # Multi-stage : Build Node → Nginx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vitest.config.js
│
├── 📁 backend/                     # API REST Laravel 12
│   ├── 📁 app/
│   │   ├── 📁 Http/Controllers/
│   │   │   ├── AuthController.php          # Connexion, Déconnexion, Refresh, Reset
│   │   │   ├── EmployeeController.php      # CRUD employés + opérations en masse
│   │   │   ├── ProfileController.php       # Profil utilisateur & avatar
│   │   │   ├── ProjectController.php       # CRUD projets + persistance données IA
│   │   │   ├── ProjectTeamController.php   # Assignation/désassignation d'équipe
│   │   │   └── SpecializationController.php # CRUD spécialisations
│   │   ├── 📁 Models/
│   │   │   ├── User.php                    # Modèle utilisateur (Chef de Projet)
│   │   │   ├── Employee.php                # Modèle employé (ressource gérée)
│   │   │   ├── Project.php                 # Modèle projet avec attributs IA
│   │   │   ├── AssignedEngineer.php        # Assignation ingénieur-projet
│   │   │   ├── ProjectEpic.php             # Modèle Epic Agile
│   │   │   ├── ProjectStory.php            # Modèle User Story
│   │   │   ├── ProjectBlueprintTask.php    # Modèle Tâche Technique
│   │   │   ├── ProjectKpi.php              # Suivi des KPIs
│   │   │   ├── ProjectRisk.php             # Évaluation des risques
│   │   │   ├── EstimatedGain.php           # Projections de gains financiers
│   │   │   ├── InfrastructureCost.php      # Suivi des coûts d'infrastructure
│   │   │   ├── RoiProjection.php           # Projections ROI annuelles
│   │   │   ├── Specialization.php          # Spécialisation employé
│   │   │   └── RefreshToken.php            # Gestion du rafraîchissement de tokens
│   │   ├── 📁 Services/
│   │   │   └── ProjectSeederService.php    # Initialisation de données exemple
│   │   └── 📁 Providers/
│   ├── 📁 database/
│   │   ├── 📁 factories/           # Factories pour les tests
│   │   ├── 📁 migrations/          # 20 fichiers de migration
│   │   └── 📁 seeders/             # Seeders (Users, Projects, Specializations)
│   ├── 📁 routes/
│   │   └── api.php                 # Définitions de routes API
│   ├── 📁 tests/
│   │   ├── 📁 Feature/             # Tests d'intégration (8 fichiers)
│   │   └── 📁 Unit/                # Tests unitaires (6 fichiers)
│   ├── Dockerfile                  # Multi-stage : Build Composer → Runtime PHP-FPM
│   └── composer.json
│
├── 📁 Ai System/                   # Microservice IA Python
│   ├── 📁 schemas/                 # Modèles de données Pydantic
│   │   ├── staffing_schemas.py     # Schémas plan financier & staffing
│   │   ├── backlog_schemas.py      # Schémas Epic → Story → Task
│   │   └── stackchoice_schemas.py  # Schémas recommandation tech stack
│   ├── 📁 services/               # Logique métier IA
│   │   ├── staffing_service.py     # Génération plan staffing via Gemini
│   │   ├── backlog_service.py      # Génération backlog via Gemini
│   │   └── stackchoice_service.py  # Recommandation stack via Gemini
│   ├── 📁 tests/                  # Suite de tests Pytest
│   ├── main.py                     # Point d'entrée FastAPI
│   ├── requirements.txt            # Dépendances Python
│   └── Dockerfile                  # Python 3.12-slim + Uvicorn
│
├── 📁 .github/                    # Workflows GitHub Actions
├── docker-compose.yml             # Orchestration full-stack (4 services)
└── .gitignore
```

---

## 🗄️ Schéma de Base de Données

GrowTrack utilise **PostgreSQL 15** avec **20 fichiers de migration** définissant les relations suivantes :

> **Modèle de rôles :** Seul le **Chef de Projet** (table `users`) possède un compte et peut se connecter. Les **Employés** (table `employees`) sont des ressources gérées par le chef de projet — ils n'ont pas de compte utilisateur et ne se connectent pas à la plateforme. Le chef de projet crée, modifie et supprime ses propres employés.

### Diagramme Entité-Relation

```
┌──────────────────┐       ┌──────────────────────┐
│  specializations │       │       users           │
├──────────────────┤       │   (Chef de Projet)    │
│ id (PK)          │       ├──────────────────────┤
│ name             │       │ id (PK)              │
│ description      │       │ first_name           │
│ created_at       │       │ last_name            │
│ updated_at       │       │ email (UNIQUE)       │
└──────────────────┘       │ password (hashé)     │
        ▲                  │ google_id (nullable) │
        │                  │ avatar               │
        │ FK               │ remember_token       │
        │                  └───────┬──────────────┘
        │                          │ 1:N (possède)
        │                          ▼
        │               ┌──────────────────────┐
        │               │      employees       │
        │               │  (Ressources gérées) │
        │               ├──────────────────────┤
        ├───────────────┤ id (PK)              │
                        │ user_id (FK → users)  │  ← Propriétaire (Chef)
                        │ first_name           │
                        │ last_name            │
                        │ email                │
                        │ specialization_id(FK)│
                        │ is_engaged           │
                        └──────────────────────┘

                     ┌──────────────────────────────┐
                     │          projects             │
                     ├──────────────────────────────┤
                     │ id (PK)                      │
                     │ name                          │
                     │ user_id (FK → users)          │
                     │ description                   │
                     │ start_date                    │
                     │ planned_end_date (auto-calc)  │
                     │ actual_end_date               │
                     │ ── Attributs Financiers IA ── │
                     │ estimated_duration_months     │
                     │ total_capex                   │
                     │ total_opex                    │
                     │ total_project_cost            │
                     │ total_gain_value              │
                     │ annual_opex_value             │
                     │ roi_percentage                │
                     │ break_even_point_months       │
                     │ roi_analysis_summary          │
                     │ ── Analyse Stack (JSON) ──    │
                     │ stack_analysis_data           │
                     │ architecture_plan             │
                     │ recommended_stack             │
                     │ stack_name                    │
                     └──────┬───────────────────────┘
                            │ 1:N (tables enfants multiples)
             ┌──────────────┼──────────────┬─────────────┐
             ▼              ▼              ▼             ▼
    ┌────────────┐  ┌──────────────┐ ┌──────────┐ ┌────────────┐
    │ assigned   │  │ estimated    │ │ project  │ │ project    │
    │ _engineers │  │ _gains       │ │ _kpis    │ │ _risks     │
    ├────────────┤  ├──────────────┤ ├──────────┤ ├────────────┤
    │ role       │  │ item_name    │ │ name     │ │ name       │
    │ level      │  │ cost_mad     │ │ value    │ │ severity   │
    │ specializ. │  │ description  │ │          │ │ description│
    │ salary     │  │ formule      │ └──────────┘ └────────────┘
    │ months     │  └──────────────┘
    │ total_cost │
    │ employee_id│ ← FK vers employees
    └────────────┘
             ┌──────────────┬───────────────┐
             ▼              ▼               ▼
    ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐
    │ infrastructure │  │    roi       │  │   project_epics   │
    │ _costs         │  │ _projections │  ├───────────────────┤
    ├────────────────┤  ├──────────────┤  │ id, project_id    │
    │ item_name      │  │ year_number  │  │ title, description│
    │ cost_mad       │  │ cumul_costs  │  └────────┬──────────┘
    │ description    │  │ cumul_gains  │           │ 1:N
    │ formule        │  │ net_cashflow │           ▼
    └────────────────┘  │ roi_percent  │  ┌───────────────────┐
                        └──────────────┘  │  project_stories  │
                                          ├───────────────────┤
                                          │ id, epic_id       │
                                          │ title, description│
                                          │ story_points      │
                                          │ acceptance_criteria│
                                          └────────┬──────────┘
                                                   │ 1:N
                                                   ▼
                                          ┌────────────────────────┐
                                          │ project_blueprint_tasks│
                                          ├────────────────────────┤
                                          │ id, story_id           │
                                          │ title, instructions    │
                                          │ role, level            │
                                          │ hours                  │
                                          └────────────────────────┘
```

### Caractéristiques Clés de la BDD
- **Table Employés séparée** — Les employés sont gérés indépendamment des comptes utilisateurs. Le Chef de Projet crée et gère son propre pool d'employés ; les employés ne possèdent pas de compte et ne se connectent pas.
- **Champs auto-calculés** — `planned_end_date` est automatiquement calculée à partir de `start_date` + `estimated_duration_months` via les événements du modèle Eloquent
- **Colonnes JSON** — `stack_analysis_data`, `architecture_plan` et `recommended_stack` stockent les réponses complètes de l'IA en JSON
- **Support Google OAuth** — Champ `google_id` sur les utilisateurs pour la connexion Google
- **Suppression en cascade** — La suppression d'un projet supprime tous les enfants associés (ingénieurs, gains, KPIs, risques, epics)
- **Support Factories & Seeders** — Factories et seeders pré-construits pour Users, Projects, Specializations et AssignedEngineers

---

## 🤖 Système IA en Détail

Le système IA est un **microservice Python autonome** propulsé par **Google Gemini 2.5 Flash** (via le SDK `google-generativeai`) et **Instructor** pour l'extraction structurée des sorties.

### Fonctionnement

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Cahier     │     │   PyMuPDF (fitz) │     │   Google Gemini │
│ des Charges  │────▶│  Extraction de   │────▶│   + Instructor  │
│   (PDF)      │     │     texte        │     │  LLM Structuré  │
└──────────────┘     └──────────────────┘     └───────┬─────────┘
                                                      │
                                              ┌───────▼─────────┐
                                              │ Validation via  │
                                              │ Schémas Pydantic│
                                              └───────┬─────────┘
                                                      │
                                              ┌───────▼─────────┐
                                              │  Réponse JSON   │
                                              │  au Frontend    │
                                              └─────────────────┘
```

### Trois Endpoints IA

#### 1. `POST /analyze-staffing`
> **Entrée** : PDF d'exigences + Pool d'employés JSON + Clé API Gemini
> **Sortie** : `ProjectFinancialPlan` (structuré)

Génère un plan financier complet incluant :
- **Ingénieurs sélectionnés** : Rôle, spécialisation, niveau, salaire mensuel, mois assignés, coût total
- **Licences & APIs** : Services tiers nécessaires avec coûts
- **Ventilation CAPEX** : Coûts de développement + buffer de contingence (15-20%)
- **Ventilation OPEX** : Abonnements cloud + ingénieurs maintenance
- **KPIs** : Métriques de succès non financières avec méthodes de mesure
- **Coût Total du Projet** : CAPEX + OPEX première année
- **Gains Estimés** : Bénéfices financiers annuels
- **Prévision ROI** : Projections sur 3 ans (coûts cumulés, gains, flux de trésorerie net, ROI %)
- **Point de Rentabilité** : Mois où le projet devient rentable

#### 2. `POST /analyze-backlog`
> **Entrée** : PDF d'exigences + Pool d'employés JSON + Durée + Budget + Clé API
> **Sortie** : `RapportAnalyseStaffing` (backlog structuré)

Génère une hiérarchie complète de backlog Agile :
- **Epics** (Niveau 1) : Fonctionnalités majeures avec IDs et descriptions
  - **User Stories** (Niveau 2) : Exigences fonctionnelles au format « En tant que... Je veux... Afin de... »
    - Story points (Fibonacci)
    - Critères d'acceptation (binaire réussi/échoué, happy path + cas limites)
    - **Tâches** (Niveau 3) : Actions d'implémentation technique
      - Rôle assigné (doit correspondre exactement au pool d'employés)
      - Instructions d'implémentation (stack, étapes, pratiques sécuritaires)
      - Estimations horaires

#### 3. `POST /analyze-stack`
> **Entrée** : Backlog JSON + Clé API
> **Sortie** : `ArchitectureAnalysisResponse` (structuré)

Génère des recommandations technologiques incluant :
- **Dimensions du Projet** : Type, score de complexité (1-10), besoin de scalabilité, contraintes
- **Recommandation Principale** : Stack complète avec nom de stratégie, pattern d'architecture, explication de synergie
- **Recommandation Alternative** : Alternative viable pour comparaison
- **Évaluation des Risques** : Risques techniques et goulots d'étranglement
- **Conseils Juniors** : Guide d'implémentation pour les ingénieurs moins expérimentés

### Validation par Schémas Pydantic

Toutes les sorties IA sont validées contre des schémas Pydantic stricts via la bibliothèque `instructor`, garantissant :
- Réponses typées (pas de parsing de chaînes brutes)
- Retentatives automatiques sur les sorties malformées
- Descriptions au niveau des champs servant d'ingénierie de prompt (guidant le format de sortie de Gemini)

---

## 📡 Documentation API

### Endpoints d'Authentification
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `POST` | `/api/login` | ❌ | Authentifier l'utilisateur, retourne un token + cookie HttpOnly de refresh |
| `POST` | `/api/register` | ❌ | Créer un nouveau compte chef de projet |
| `POST` | `/api/forgot-password` | ❌ | Envoyer un email de réinitialisation |
| `POST` | `/api/reset-password` | ❌ | Réinitialiser le mot de passe avec token |
| `POST` | `/api/refresh-token` | 🍪 Cookie | Rafraîchir le token d'accès via cookie HttpOnly |
| `POST` | `/api/logout` | ✅ Bearer | Invalider la session |
| `GET`  | `/api/me` | ✅ Bearer | Obtenir le profil de l'utilisateur authentifié |

### Gestion des Employés
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET`    | `/api/employees` | ✅ | Lister tous les employés du chef de projet |
| `GET`    | `/api/employees/available` | ✅ | Lister les employés disponibles (non engagés) |
| `POST`   | `/api/employees` | ✅ | Créer un nouvel employé |
| `PUT`    | `/api/employees/{id}` | ✅ | Modifier un employé |
| `DELETE` | `/api/employees/{id}` | ✅ | Supprimer un employé |
| `POST`   | `/api/employees/bulk-delete` | ✅ | Suppression en masse |

### Gestion des Spécialisations
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET`    | `/api/specializations` | ✅ | Lister toutes les spécialisations |
| `POST`   | `/api/specializations` | ✅ | Créer une spécialisation |
| `PUT`    | `/api/specializations/{id}` | ✅ | Modifier une spécialisation |
| `DELETE` | `/api/specializations/{id}` | ✅ | Supprimer une spécialisation |
| `POST`   | `/api/specializations/bulk-delete` | ✅ | Suppression en masse |

### Gestion du Profil
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET`  | `/api/profile` | ✅ | Obtenir le profil utilisateur |
| `POST` | `/api/profile` | ✅ | Mettre à jour les informations du profil |
| `POST` | `/api/profile/password` | ✅ | Changer le mot de passe |
| `POST` | `/api/profile/avatar` | ✅ | Uploader un avatar |

### Gestion des Projets
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET`    | `/api/projects/dashboard` | ✅ | Obtenir les statistiques du tableau de bord |
| `GET`    | `/api/projects` | ✅ | Lister tous les projets |
| `POST`   | `/api/projects` | ✅ | Créer un projet (avec données IA) |
| `GET`    | `/api/projects/{id}` | ✅ | Obtenir les détails d'un projet (avec toutes les relations) |
| `PUT`    | `/api/projects/{id}` | ✅ | Modifier un projet |
| `POST`   | `/api/projects/{id}/stack` | ✅ | Sauvegarder les données d'analyse stack |
| `DELETE` | `/api/projects/{id}` | ✅ | Supprimer un projet |

### Équipe Projet
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `GET`  | `/api/projects/{id}/team` | ✅ | Obtenir les membres de l'équipe projet |
| `POST` | `/api/projects/{id}/team/assign` | ✅ | Assigner un employé au projet |
| `POST` | `/api/projects/{id}/team/unassign` | ✅ | Retirer un employé du projet |

### Analyse IA (Service Python)
| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| `POST` | `/ai/analyze-staffing` | Clé API | Générer le plan de staffing & financier |
| `POST` | `/ai/analyze-backlog` | Clé API | Générer le backlog Agile |
| `POST` | `/ai/analyze-stack` | Clé API | Générer la recommandation tech stack |

---

## 🔐 Authentification & Sécurité

GrowTrack implémente un **pattern d'authentification par double token** avec support Google OAuth pour une sécurité maximale :

### Architecture des Tokens

```
┌─────────────┐   Connexion   ┌────────────────┐
│  Navigateur │───────────────▶│   API Laravel  │
│             │◀───────────────│                │
│  Stocke :   │   Réponse :    │  Génère :      │
│  - Token    │   {            │  - Token       │
│    d'accès  │    access_     │    d'accès     │
│   (mémoire) │    token,      │   (courte durée│
│             │    user        │    ~60 min)    │
│  Cookie :   │   }            │  - Token de    │
│  - Token de │  + Set-Cookie  │    refresh     │
│    refresh  │                │   (cookie      │
│  (HttpOnly) │                │    HttpOnly)   │
└─────────────┘                └────────────────┘
```

### Mesures de Sécurité
1. **Token d'accès en mémoire** — Le token de courte durée est stocké dans une variable JavaScript (jamais dans `localStorage`), empêchant le vol de token par XSS
2. **Cookie HttpOnly de refresh** — Le token de refresh est stocké dans un cookie HttpOnly, invisible au JavaScript
3. **Rafraîchissement automatique** — Un intercepteur Axios rafraîchit automatiquement les tokens d'accès expirés via le cookie
4. **File d'attente de requêtes** — Pendant le rafraîchissement, les requêtes 401 suivantes sont mises en file d'attente et rejouées après succès
5. **Google OAuth** — Connexion Google stateless via Firebase comme alternative à l'email/mot de passe
6. **Liste blanche CORS** — Le backend n'accepte que les requêtes des origines frontend configurées
7. **Guard Sanctum** — Toutes les routes API (sauf connexion/inscription) sont protégées par le middleware `auth:sanctum`
8. **Hachage des mots de passe** — Les mots de passe sont automatiquement hachés via le `HashedCast` de Laravel

---

## 🎨 Architecture Frontend

### Hiérarchie des Providers

```jsx
<StrictMode>
  <BrowserRouter>
    <AuthProvider>          // État d'authentification (utilisateur, token)
      <QueryClientProvider>  // TanStack Query (cache état serveur)
        <ProjectProvider>    // Contexte du projet courant
          <App />            // Définitions des routes
          <Toaster />        // Notifications toast (Sonner)
        </ProjectProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

### Architecture par Fonctionnalité

Le frontend suit un pattern de **conception par découpage fonctionnel** :

```
features/
├── ai-analysis/          # Analyse de projet propulsée par l'IA
│   ├── api/              # Fonctions client API
│   └── components/       # Composants spécifiques à la fonctionnalité
│       ├── ProjectGenesisWizard.jsx   # Wizard de création en 4 étapes
│       ├── AIDashboard.jsx            # Vue d'ensemble des résultats IA
│       ├── RequirementUpload.jsx      # Upload PDF avec glisser-déposer
│       ├── ResourcePool.jsx           # Configuration du pool d'employés
│       ├── InternalResourcePool.jsx   # Sélection des ressources internes
│       ├── DynamicResourcePool.jsx    # Gestion des ressources dynamiques
│       ├── StaffingStrategy.jsx       # Configuration du staffing
│       └── GeminiAuth.jsx             # Composant de saisie de clé API
├── auth/                 # Fonctionnalité d'authentification
│   ├── api/              # API Connexion, Inscription, Google OAuth, Profil
│   ├── components/       # LoginForm, SignupForm, GoogleAuthButton, etc.
│   └── hooks/            # Hook personnalisé useAuth
├── dashboard/            # Widgets du tableau de bord
├── projects/             # Vues de gestion de projets
└── team/                 # Gestion employés & spécialisations
```

### Architecture de Routage

```
/                               → Public (Page d'Accueil — héro animé)
/login                          → Public (Page de Connexion)
/signup                         → Public (Page d'Inscription)
/forgot-password                → Public (Mot de passe oublié)
/reset-password                 → Public (Réinitialisation)

[PrivateLayout] (Authentification requise)
├── /dashboard                  → Tableau de bord (vue globale)
├── /notifications              → Page de notifications
├── /profile                    → Page de profil
├── /settings                   → Page de paramètres
├── /projects/new-project       → Nouveau Projet (Wizard GenèseIA)
├── /team-global                → Gestion d'équipe globale
│
└── [ProjectLayout] (Contexte projet)
    └── /project/:id
        ├── /                           → Tableau de bord projet
        ├── /financial-blueprint        → Blueprint Financier (KPIs, coûts, ROI)
        ├── /scrum-master-blueprint     → Blueprint Scrum Master (Epics/Stories/Tâches)
        ├── /stack-choice               → Choix de Stack (comparaison tech)
        ├── /project-team               → Équipe du projet
        ├── /analysis                   → Page d'analyse
        └── /team                       → Gestion d'équipe
```

### Stratégie de Gestion d'État

| Couche | Outil | Utilité |
|--------|-------|---------|
| **État Serveur** | TanStack React Query | Cache des données API, auto-refetch, mises à jour optimistes |
| **État Auth** | React Context | Session utilisateur, gestion des tokens, connexion/déconnexion |
| **Contexte Projet** | React Context | ID du projet actuellement sélectionné (depuis l'URL) |
| **État UI** | React `useState` | Entrées formulaire, visibilité des modals, étapes du wizard |
| **État Persistant** | `StorageService` (localStorage) | Données utilisateur en cache pour restauration rapide au rechargement |

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 20.x
- **PHP** ≥ 8.2
- **Composer** ≥ 2.6
- **Python** ≥ 3.12
- **PostgreSQL** ≥ 15
- **Docker & Docker Compose** (pour le déploiement conteneurisé)

### Installation en Local

#### 1. Cloner le Dépôt
```bash
git clone https://github.com/kh-hajar/TaskFlow.git
cd TaskFlow
```

#### 2. Configuration du Backend
```bash
cd backend

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Configurer la base de données (PostgreSQL doit être en cours d'exécution)
php artisan migrate
php artisan db:seed   # Optionnel : insérer des données exemple

# Démarrer le serveur de développement
php artisan serve     # Accessible sur http://localhost:8000
```

#### 3. Configuration du Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'environnement
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Démarrer le serveur de développement
npm run dev           # Accessible sur http://localhost:5173
```

#### 4. Configuration du Système IA
```bash
cd "Ai System"

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate   # Windows

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur IA
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### 5. Lancer Tous les Services en Parallèle (Alternative)
```bash
# Depuis le répertoire racine
npm install           # Installer concurrently
npm run all           # Démarre frontend + backend + système IA en parallèle
```

---

## 🐳 Déploiement Docker

GrowTrack est entièrement conteneurisé avec Docker Compose pour un déploiement facile.

### Prérequis

1. **Docker Desktop** — [Télécharger ici](https://www.docker.com/products/docker-desktop/)
2. **Git** — Pour cloner le dépôt

### Déploiement Étape par Étape

#### Étape 1 : Cloner le Dépôt
```bash
git clone https://github.com/kh-hajar/TaskFlow.git
cd TaskFlow
```

#### Étape 2 : Configurer l'Environnement Backend
```bash
cp backend/.env.example backend/.env
```

Modifiez `backend/.env` et mettez à jour ces valeurs :

| Variable | Modification | Exemple |
|----------|-------------|---------|
| `APP_URL` | IP ou domaine de votre serveur | `http://localhost` |
| `DB_PASSWORD` | Définir un mot de passe **fort** | `MonMotDePasse!` |

> ⚠️ **Important** : Gardez `DB_HOST=db` — cela fait référence au nom du conteneur Docker.

#### Étape 3 : Synchroniser le Mot de Passe BDD

Le mot de passe dans `backend/.env` **doit correspondre** à celui dans `docker-compose.yml`. Soit :
- Modifiez `docker-compose.yml` ligne 12 pour correspondre à votre `.env`
- Soit gardez la valeur par défaut dans les deux fichiers (déconseillé en production)

#### Étape 4 : Construire & Démarrer les Conteneurs
```bash
docker-compose up --build -d
```

Cela va : télécharger l'image PostgreSQL, construire les images Backend, Frontend et Système IA, puis démarrer les 4 conteneurs en arrière-plan.

#### Étape 5 : Initialiser le Backend Laravel

Exécutez ces commandes **une seule fois** après la première construction :

```bash
# Générer la clé de l'application Laravel
docker exec growtrack-backend php artisan key:generate

# Exécuter les migrations de base de données
docker exec growtrack-backend php artisan migrate

# (Optionnel) Insérer des données exemple
docker exec growtrack-backend php artisan db:seed
```

#### Étape 6 : Accéder à l'Application

| Service | URL |
|---------|-----|
| 🌐 **Application** | `http://localhost` (port 80) |
| 🔌 **API Backend** | `http://localhost/api/...` |
| 🤖 **Système IA** | `http://localhost/ai/...` |

Tout est routé via Nginx sur le **port 80** — vous n'avez besoin que d'une seule URL.

#### Étape 7 : Obtenir une Clé API Gemini (pour les fonctionnalités IA)

Les fonctionnalités IA nécessitent une **clé API Google Gemini** :
1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/apikey)
2. Créez une clé API gratuite
3. Saisissez-la dans l'application quand demandé (envoyée par requête, jamais stockée côté serveur)

### Aperçu des Services

| Service | Nom du Conteneur | Image | Port |
|---------|-----------------|-------|------|
| Base de données | `growtrack-db` | `postgres:15-alpine` | 5432 (interne) |
| Backend | `growtrack-backend` | Custom (PHP 8.2-FPM) | 9000 (interne) |
| Frontend | `growtrack-frontend` | Custom (Nginx) | **80** (exposé) |
| Système IA | `growtrack-ai` | Custom (Python 3.12) | 8001 (interne) |

### Commandes Docker Utiles

```bash
# Voir les logs de tous les conteneurs
docker-compose logs -f

# Voir les logs d'un conteneur spécifique
docker-compose logs -f backend

# Arrêter tous les conteneurs
docker-compose down

# Arrêter & supprimer toutes les données (y compris la BDD !)
docker-compose down -v

# Reconstruire après modifications du code
docker-compose up --build -d
```

### Réseau

Tous les services communiquent sur le réseau bridge Docker `growtrack-network`. Le conteneur Nginx sert de point d'entrée unique (port 80), routant les requêtes vers :
- `/` → Fichiers statiques de la SPA React
- `/api/*` → Laravel (FastCGI vers backend:9000)
- `/ai/*` → FastAPI (proxy HTTP vers ai-system:8001)

---

## 🧪 Tests

GrowTrack inclut des suites de tests complètes sur les trois services.

### Tests Frontend (Vitest + React Testing Library)
```bash
cd frontend
npm test              # Exécuter tous les tests
npm test -- --watch   # Mode surveillance
```

**Couverture des tests :**
- ✅ Tests de composants UI (51 fichiers dans `components/ui/`, chacun avec `*.test.jsx`)
- ✅ Tests de composants partagés (DataTable, Modals, Cards)
- ✅ Tests de composants fonctionnels (Analyse IA, Auth, Équipe, Projets, Tableau de bord)
- ✅ Tests de fonctions utilitaires (constants, date, storage, validation)
- ✅ Tests d'intégration des contextes (AuthContext, ProjectContext)
- ✅ Tests d'intégration des layouts (Navbar, Sidebar, PrivateLayout)

### Tests Backend (PHPUnit)
```bash
cd backend
php artisan test      # Exécuter tous les tests
```

**Couverture des tests :**
- ✅ Tests fonctionnels (8 fichiers) — Tests d'intégration des endpoints API
- ✅ Tests unitaires (6 fichiers) — Tests des modèles et logique métier
- ✅ Factories de modèles pour la génération de données de test
- ✅ Base de données de test PostgreSQL dédiée (`growtrack_testing`)

### Tests Système IA (pytest)
```bash
cd "Ai System"
pytest                # Exécuter tous les tests
pytest -v             # Sortie détaillée
```

**Couverture des tests :**
- ✅ Tests des endpoints API (`test_api.py`)
- ✅ Tests de validation des schémas (`test_schemas.py`)
- ✅ Tests de logique des services (`test_services.py`)
- ✅ Fixtures partagées via `conftest.py`

---

## ⚙️ Variables d'Environnement

### Backend (`backend/.env`)
```env
# Application
APP_NAME=GrowTrack
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=http://votre-ip-serveur

# Base de données
DB_CONNECTION=pgsql
DB_HOST=db                    # Nom du service Docker
DB_PORT=5432
DB_DATABASE=growtrack_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# Authentification
SESSION_DRIVER=database
BCRYPT_ROUNDS=12

# File d'attente & Cache
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mail (pour réinitialisation de mot de passe)
MAIL_MAILER=smtp
MAIL_HOST=votre-serveur-smtp
MAIL_PORT=587
MAIL_USERNAME=votre-email
MAIL_PASSWORD=votre-mot-de-passe
MAIL_FROM_ADDRESS=noreply@growtrack.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### Système IA
Le système IA nécessite une **clé API Google Gemini**, qui est transmise par requête depuis le frontend (non stockée sur le serveur).

---

## 🤝 Contribution

1. **Forkez** le dépôt
2. **Créez** une branche fonctionnalité (`git checkout -b feature/fonctionnalite-geniale`)
3. **Commitez** vos modifications (`git commit -m 'Ajout fonctionnalité géniale'`)
4. **Poussez** vers la branche (`git push origin feature/fonctionnalite-geniale`)
5. **Ouvrez** une Pull Request

### Style de Code
- **Frontend** : ESLint + règles React Hooks
- **Backend** : Laravel Pint (PSR-12)
- **Système IA** : PEP 8

---

## 📄 Licence

Ce projet est distribué sous la licence MIT.

---