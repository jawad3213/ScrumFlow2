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
  <img src="https://img.shields.io/badge/Spring_Boot-4.1-green?logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21">
  <img src="https://img.shields.io/badge/Python-3.12-green?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Compose-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/Terraform-AWS-purple?logo=terraform" alt="Terraform">
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?logo=githubactions" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/IA-Google%20Gemini-orange?logo=google" alt="Gemini AI">
</p>

---

## 📋 Table des Matières

- [Aperçu](#-aperçu)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Architecture Système](#-architecture-système)
- [Architecture Backend Spring Boot & Ce qui a changé](#-architecture-backend-spring-boot--ce-qui-a-changé)
- [Stack Technologique](#-stack-technologique)
- [Structure du Projet](#-structure-du-projet)
- [Schéma de Base de Données](#-schéma-de-base-de-données)
- [Système IA en Détail](#-système-ia-en-détail)
- [Documentation API](#-documentation-api)
- [Authentification & Sécurité](#-authentification--sécurité)
- [Architecture Frontend](#-architecture-frontend)
- [Démarrage Rapide](#-démarrage-rapide)
- [Déploiement Docker](#-déploiement-docker)
- [Déploiement AWS (Terraform + CI/CD)](#-déploiement-aws-terraform--cicd)
- [Supervision (Prometheus + Grafana)](#-supervision-prometheus--grafana)
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

## 🏛️ Architecture Système

GrowTrack suit une **architecture conteneurisée inspirée des microservices**, articulée autour de 5 conteneurs orchestrés avec Docker Compose et supervisés en production :

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   NGINX (Port 80 prod / 8080 dev)                      │
│                           Reverse Proxy & Fichiers Statiques (Gateway)                 │
├────────────────────┬─────────────────────────────────┬─────────────────────────────────┤
│     /  (SPA)       │        /api/* & /storage/*      │        /ai/* (Moteur IA)        │
│                    │                                 │                                 │
│    Frontend React  │       Backend Spring Boot       │       FastAPI (Python 3.12)     │
│    (Nginx / Vite)  │      (Java 21, HTTP:8000)       │          (Uvicorn:8001)         │
│                    │                                 │                                 │
│   • Vite / React 19│   • Spring Security 7 (JWT)     │   • Google Gemini 2.5 Flash     │
│   • TailwindCSS 4  │   • Spring Data JPA / Hibernate │   • Pydantic + Instructor       │
│   • TanStack Query │   • HikariCP Pool               │   • PyMuPDF (Extraction PDF)    │
│                    │   • Actuator (:8081 interne)    │                                 │
└────────────────────┴────────────────┬────────────────┴─────────────────────────────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │     PostgreSQL 15-Alpine    │
                       │     (Port 5432 persistant)  │
                       │    Migrations Flyway V1/V2  │
                       └──────────────┬──────────────┘
                                      │ Métriques & Santé (:8081)
                       ┌──────────────┴──────────────┐
                       │    Supervision & Métriques  │
                       │    Prometheus (Scrape 8081) │
                       │    Grafana (Dashboard dédié)│
                       └─────────────────────────────┘
```

### Communication entre Services

| Service | Port Interne | Protocole | Rôle & Visibilité |
|---------|:------------:|:---------:|-------------------|
| **Gateway Nginx** | `80` (prod) / `8080` (dev) | HTTP | Point d'entrée unique : reverse proxy vers frontend, backend, IA et Grafana (`/grafana/`) |
| **Frontend (Nginx)** | `80` (prod) / `5173` (dev) | HTTP | Sert les fichiers statiques de la SPA React 19 (ou dev server Vite avec HMR) |
| **Backend (Spring Boot)** | `8000` | HTTP | Traite les requêtes API REST (`/api/*`) et sert les avatars (`/storage/*`) |
| **Backend Actuator (Spring)** | `8081` | HTTP | Métriques Prometheus (`/actuator/prometheus`) et santé (`/actuator/health`), réseau Docker uniquement |
| **Système IA (Uvicorn)** | `8001` | HTTP | Microservice Python FastAPI pour les pipelines d'analyse LLM Gemini |
| **Base de Données (PostgreSQL)** | `5432` | TCP | Persistance des données relationnelles, schéma versionné par Flyway |
| **Prometheus** | `9090` | HTTP | Collecteur de métriques temps réel (JVM, HikariCP, latences HTTP, OS) |
| **Grafana** | `3000` | HTTP | Visualisation unifiée via le dashboard *ScrumFlow Platform* routé sous `/grafana/` |

---

## ☕ Architecture Backend Spring Boot & Ce qui a changé

Le backend de GrowTrack (ScrumFlow) a fait l'objet d'une **refonte architecturale majeure**, passant d'une pile monolithique **PHP / Laravel** à une architecture d'entreprise moderne propulsée par **Java 21**, **Spring Boot 4.1**, **Spring Security 7**, **Spring Data JPA (Hibernate 7)** et **Flyway 12**.

### 🎯 Pourquoi cette Refonte ?

1. **Performances & Gestion de la Concurrence** : Remplacement de l'exécution séquentielle par processus PHP-FPM par le modèle multi-threadé natif de la JVM Java 21, offrant un débit considérablement supérieur et une latence réduite lors des pics de charge.
2. **Typage Fort & Fiabilité à la Compilation** : Élimination des erreurs à l'exécution courantes dans le monde PHP grâce au typage statique de Java, à la validation déclarative (`jakarta.validation`), et aux entités JPA rigoureusement structurées.
3. **Observabilité Native de Classe Entreprise** : Intégration de Spring Boot Actuator et Micrometer exportant en direct les métriques JVM, HikariCP et percentiles de latence vers Prometheus et Grafana.
4. **Standardisation & Sécurité Renforcée** : Chaîne de filtres Spring Security 7 centralisée, validation cryptographique des jetons Firebase Google OAuth via `spring-security-oauth2-jose`, et tokens JWT courts avec cookies sécurisés HttpOnly.
5. **Gestion Déclarative du Schéma BDD** : Abandon des migrations procédurales Laravel au profit de scripts SQL versionnés et déterministes pilotés par **Flyway**.

---

### 🔄 Matrice Comparative : Ancien Backend (Laravel) vs Nouveau Backend (Spring Boot)

Ce tableau synthétise l'ensemble des transformations techniques apportées au backend :

| Domaine | Ancien Backend (Laravel / PHP) | Nouveau Backend (Spring Boot 4 / Java 21) | Ce qui a changé & Bénéfices |
|---|---|---|---|
| **Langage & Runtime** | PHP 8.x (Interprété, processus FPM) | **Java 21 LTS** (Compilé, JVM, JIT compiler C2) | Exécution binaire optimisée, faible consommation par requête sous forte charge. |
| **Framework Principal** | Laravel 11.x | **Spring Boot 4.1** (Spring Web MVC) | Architecture d'entreprise, composants découplés par injection de dépendances. |
| **Modèle de Concurrence** | 1 processus FPM = 1 requête bloquante | **Pool de Threads JVM** géré de manière asynchrone | Concurrence native, gestion efficace de centaines de requêtes simultanées. |
| **Accès aux Données (ORM)** | Eloquent ORM (Active Record, typage dynamique) | **Spring Data JPA & Hibernate 7** (Data Mapper) | Découplage strict entre entités métier et requêtes SQL, requêtes typées et sécurisées. |
| **Pool de Connexions BDD** | Reconnexion TCP fréquente via PHP-FPM | **HikariCP** (Pool persistant ultra-performant) | Connexions BDD pré-allouées et réutilisées, élimination de la latence de handshake. |
| **Évolution du Schéma BDD** | Migrations Laravel PHP (`2024_*.php`, 20 fichiers) | **Flyway 12** (`V1__...sql`, `V2__...sql`) | Schéma SQL pur versionné, migrations idempotentes, zéro dépendance applicative. |
| **Sécurité & Filtrage** | Middlewares Laravel & sessions PHP | **Spring Security 7 (`SecurityFilterChain`)** | Chaîne de sécurité déclarative et centralisée protégeant chaque point d'entrée REST. |
| **Authentification & Sessions** | Laravel Sanctum | **Double Token Stateless** (JWT HS256 + Refresh Cookie) | Token d'accès en mémoire JS (15 min) + Refresh token HttpOnly, résistant aux attaques XSS. |
| **Authentification Google** | Vérification manuelle côté contrôleur | **`spring-security-oauth2-jose`** (Firebase JWKS) | Validation cryptographique standardisée des clés publiques Firebase/Google. |
| **Hachage des Mots de Passe** | BCrypt `$2y$` (coût 12) | **BCryptPasswordEncoder** Spring Security (`$2y$`, coût 12) | **100% rétrocompatible** : les utilisateurs de l'ancien système se connectent sans friction. |
| **Initialisation & Seeding** | `php artisan db:seed` (DatabaseSeeder PHP) | **DatabaseSeeder Spring** basé sur JSON (`seed/*.json`) | Seeding déterministe activable via variables d'environnement (`SEED_DATABASE=true`). |
| **Gestion des Erreurs** | Exceptions Handler Laravel (`render()`) | **`@RestControllerAdvice`** (`GlobalExceptionHandler`) | Réponses d'erreur JSON uniformes respectant exactement les codes HTTP et formats attendus. |
| **Supervision & Santé** | Nécessitait des packages tiers complexes | **Spring Boot Actuator + Micrometer** (:8081) | Endpoints `/actuator/health` et `/actuator/prometheus` natifs avec métriques p50/p95/p99. |
| **Tests Automatisés** | PHPUnit / Pest | **JUnit 5 + AssertJ + Spring Boot Test** | Tests d'intégration exécutés sur une vraie base PostgreSQL (`growtrack_testing`). |
| **Build & Conteneurisation** | Image Nginx + PHP-FPM multi-processus | **Multi-stage Dockerfile** (Maven Build → JRE 21 Temurin) | Conteneur unique, allégé, sans composant serveur web intermédiaire dans le conteneur. |

---

### 🛡️ Garantie de Zéro Rupture (Zero Breaking Changes)

Bien que l'architecture interne ait été réécrite de fond en comble, **aucune rupture n'a été introduite** pour le reste de l'écosystème :

1. **Contrat d'API REST 100% Préservé** :
   - Tous les endpoints `/api/**` (authentification, projets, employés, spécialisations, profil, assignations) conservent les mêmes routes, méthodes HTTP, paramètres et formats JSON de réponse.
   - Le frontend React 19 communique avec le backend sans la moindre modification de code.
2. **Transition de Base de Données sans Perte** :
   - La migration Flyway `V1__baseline_laravel_schema.sql` reproduit fidèlement la structure de tables héritée de Laravel (`users`, `employees`, `projects`, `project_epics`, `project_stories`, etc.).
   - Avec l'option `baseline-on-migrate: true`, Flyway adopte une base PostgreSQL existante sans toucher aux données déjà présentes.
   - Les tables résiduelles de Laravel (`migrations`, `sessions`, `cache`) restent inoffensives et le schéma continue d'évoluer via `V2__...sql`.
3. **Pérennité des Comptes & Sessions** :
   - Les mots de passe stockés au format BCrypt `$2y$` sont reconnus et validés directement par Spring Security.
   - La table `personal_access_tokens` est conservée pour garantir la continuité des sessions actives.

---

### 🏗️ Architecture Interne en Couches (Clean Layered Architecture)

Le code Java de `backend/src/main/java/com/scrumflow/backend/` est découpé selon les règles de l'architecture hexagonale / en couches :

```
com.scrumflow.backend/
│
├── 🌐 web/                  # Couche Présentation REST
│   ├── AuthController.java            # Connexion, Inscription, Refresh, Logout, OAuth Google
│   ├── ProjectController.java         # CRUD projets, blueprint IA, export architecture
│   ├── EmployeeController.java        # CRUD employés du chef de projet, suppressions en masse
│   ├── SpecializationController.java  # Gestion du catalogue des compétences
│   ├── ProfileController.java         # Gestion compte, changement mot de passe, avatar
│   ├── ProjectTeamController.java     # Assignation & désassignation d'ingénieurs
│   └── GlobalExceptionHandler.java    # Traduction unifiée des exceptions en JSON (401, 404, 422, 500)
│
├── 🔒 security/             # Couche Sécurité & Jetons
│   ├── BearerTokenAuthenticationFilter.java  # Extraction et validation des tokens JWT Bearer
│   ├── JwtService.java                       # Signature et vérification HMAC-SHA256
│   ├── RefreshTokenService.java              # Rotation sécurisée du cookie HttpOnly
│   └── FirebaseAuthenticationProvider.java   # Validation des JWT ID Google/Firebase
│
├── ⚙️ config/               # Configuration Spring & Sécurité
│   ├── SecurityConfig.java            # Filtres Spring Security 7, politiques CORS, CSRF désactivé
│   ├── WebMvcConfig.java              # Mappage des fichiers statiques d'avatars (/storage/**)
│   └── AppProperties.java             # Propriétés typées injectées depuis backend/.env
│
├── 💼 service/              # Couche Logique Métier
│   ├── ProjectService.java            # Calcul automatique des dates de fin, règles projet
│   ├── DashboardService.java          # Agrégation des KPIs et statistiques pour le chef de projet
│   ├── AiBlueprintImportService.java  # Import atomique des plans de staffing/backlog IA
│   ├── EmailService.java              # Envoi d'e-mails HTML (Thymeleaf) pour reset de mot de passe
│   └── Views.java                     # Sérialisation et formatage JSON optimisé
│
├── 📦 domain/               # Entités Métier JPA (PostgreSQL)
│   ├── User.java                      # Compte Chef de Projet (relation 1:N vers Projects et Employees)
│   ├── Project.java                   # Entité principale avec calcul planned_end_date
│   ├── Employee.java                  # Ressource gérée par un chef de projet (is_engaged)
│   ├── AssignedEngineer.java          # Association ingénieur-projet avec coût et rôle
│   ├── ProjectEpic.java / Story / Task# Arborescence Scrum hiérarchique
│   └── Specialization.java            # Métiers et compétences disponibles
│
├── 🗄️ repository/           # Couche Persistance (Spring Data JPA)
│   ├── UserRepository.java            # Requêtes dérivées et par email
│   ├── ProjectRepository.java         # Filtrage des projets par chef de projet
│   ├── EmployeeRepository.java        # Recherche d'employés disponibles
│   └── SpecializationRepository.java
│
├── 🛠️ support/              # Utilitaires & Validation
│   ├── InputNormalizer.java           # Trimming automatique et nettoyage des entrées
│   ├── ValidationErrorResponse.java   # Structure d'erreur 422 standardisée
│   └── DateUtils.java
│
└── 🌱 seed/                 # Amorçage des Données
    └── DatabaseSeeder.java            # Chargement JSON (spécialisations, admin, démo)
```

---

### 📊 Observabilité Intégrée : Actuator & Prometheus

Le backend intègre un serveur de management dédié sur le port interne **8081** (non exposé vers Internet par Nginx) :

- **`/actuator/health`** : Contrôle l'état de la connexion PostgreSQL et la disponibilité du service.
- **`/actuator/prometheus`** : Expose les métriques format OpenMetrics scrapées toutes les 15 secondes par le conteneur Prometheus :
  - **JVM** : Utilisation de la mémoire Heap/Non-Heap, Garbage Collection (G1GC), nombre de threads actifs.
  - **HikariCP** : Connexions actives, idle, en attente et temps moyen d'acquisition de connexion PostgreSQL.
  - **Requêtes HTTP** : Débit par endpoint, codes de réponse (2xx, 4xx, 5xx), et distribution des latences aux percentiles **p50, p95 et p99**.
  - Ces données alimentent directement le tableau de bord Grafana **ScrumFlow Platform**.

---

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
| **Spring Boot** | 4.1 | Framework web Java (API REST) |
| **Java** | 21 | Runtime côté serveur |
| **Spring Security** | 7.1 | Filtre d'authentification par token Bearer, BCrypt, CORS |
| **PostgreSQL** | 15 | Base de données relationnelle |
| **Spring Data JPA / Hibernate** | 7.4 | Accès à la BDD |
| **Flyway** | 12 | Migrations de schéma versionnées |
| **JUnit 5 + AssertJ** | — | Tests unitaires & d'intégration (sur PostgreSQL) |

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
| **Docker** | Conteneurisation des 5 services (gateway Nginx, frontend, backend, IA, PostgreSQL) |
| **Docker Compose** | Orchestration multi-conteneurs (dev & prod) |
| **Nginx** | Gateway reverse proxy (`frontend/nginx/`) + service des fichiers statiques |
| **GitHub Actions** | CI (`ci.yml`) et déploiement continu (`cd.yml`) |
| **Terraform** | Infrastructure AWS as Code (`terraform/`) |
| **Docker Hub** | Registre des images de production (`scrumflow-*`) |
| **AWS** | EC2, Elastic IP, SSM Parameter Store, IAM (OIDC GitHub) |
| **Prometheus + Grafana** | Supervision sur la même instance EC2 (`monitoring/`), tableau de bord « ScrumFlow Platform » |

---

## 📂 Structure du Projet

```
growtrack/
├── 📁 frontend/                    # SPA React (Vite + TailwindCSS)
│   ├── 📁 nginx/                   # Gateway Nginx (image scrumflow-nginx)
│   │   ├── Dockerfile              # Image de la gateway Nginx
│   │   ├── default.conf            # Routage prod : / → frontend, /api → backend, /ai → IA
│   │   └── dev.conf                # Routage dev (Vite 5173, Spring Boot 8000, hot reload)
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
│   ├── nginx.conf                   # Config Nginx de l'image frontend (sert la SPA)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vitest.config.js
│
├── 📁 backend/                     # API REST Spring Boot 4 (Java 21)
│   ├── 📁 src/main/java/com/scrumflow/backend/
│   │   ├── 📁 web/                 # Contrôleurs REST : Auth, Employee, Profile, Project, ProjectTeam, Specialization
│   │   ├── 📁 domain/              # Entités JPA (User, Employee, Project, AssignedEngineer, Epic/Story/Task, KPI, Risk…)
│   │   ├── 📁 repository/          # Repositories Spring Data JPA
│   │   ├── 📁 service/             # Blueprint IA, dashboard, rendu JSON, données de démo, e-mails
│   │   ├── 📁 security/            # Tokens d'accès/refresh et filtre Spring Security
│   │   ├── 📁 config/              # Spring Security, CORS, propriétés, MVC
│   │   ├── 📁 support/             # Validation, normalisation des entrées, erreurs JSON
│   │   └── 📁 seed/                # Seeder (spécialisations, admin, démo)
│   ├── 📁 src/main/resources/
│   │   ├── application.yml         # Configuration (mêmes variables d'environnement qu'avant)
│   │   ├── 📁 db/migration/        # Migrations Flyway (V1 = schéma hérité de Laravel)
│   │   ├── 📁 seed/                # Données de démonstration (JSON)
│   │   └── 📁 templates/emails/    # Modèle d'e-mail de réinitialisation (Thymeleaf)
│   ├── 📁 src/test/                # Tests JUnit (intégration sur PostgreSQL + unitaires)
│   ├── Dockerfile                  # Multi-stage : Build Maven → Runtime JRE 21
│   └── pom.xml
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
├── 📁 terraform/                  # Infrastructure AWS (Terraform), voir terraform/README.md
│   ├── main.tf                     # Assemble les 4 modules
│   ├── moved.tf                    # Anciennes adresses -> modules (aucune ressource recréée)
│   ├── variables.tf · outputs.tf · versions.tf · providers.tf
│   ├── 📁 modules/
│   │   ├── network/                # VPC par défaut, Security Group (80/443, 22 optionnel)
│   │   ├── compute/                # EC2, Elastic IP, rôle IAM de l'instance, user_data.sh
│   │   ├── config/                 # .env -> SSM Parameter Store (SecureString)
│   │   └── github-oidc/            # Rôle IAM assumé par GitHub Actions (OIDC)
│   ├── 📁 scripts/
│   │   └── deploy.sh               # Exécuté sur l'EC2 à chaque déploiement (via SSM)
│   ├── 📁 env/                     # .env de production (ignorés par Git, *.example versionnés)
│   └── terraform.tfvars.example    # Exemple de configuration
│
├── 📁 .github/workflows/
│   ├── ci.yml                      # Tests, vérification des .env / compose / nginx, build des images
│   └── cd.yml                      # Build & push vers Docker Hub puis déploiement sur EC2
├── docker-compose.yml             # Configuration de base (5 services)
├── docker-compose.override.yml    # Surcharges de développement (appliquées par défaut)
├── docker-compose.prod.yml        # Configuration de production (utilisée sur l'EC2)
├── .env.production.example        # Exemple du .env racine de production
└── .gitignore
```

---

## 🗄️ Schéma de Base de Données

GrowTrack utilise **PostgreSQL 15** avec un schéma géré et versionné par **Flyway 12** (migration baseline `V1__baseline_laravel_schema.sql` adoptant le schéma historique sans perte de données, puis évolutions versionnées comme `V2__users_is_admin.sql`), définissant les relations suivantes :

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
- **Champs auto-calculés** — `planned_end_date` est automatiquement calculée à partir de `start_date` + `estimated_duration_months` à chaque enregistrement du projet (`Project.computePlannedEndDate()`)
- **Colonnes JSON** — `stack_analysis_data`, `architecture_plan` et `recommended_stack` stockent les réponses complètes de l'IA en JSON
- **Support Google OAuth** — Champ `google_id` sur les utilisateurs pour la connexion Google
- **Suppression en cascade** — La suppression d'un projet supprime tous les enfants associés (ingénieurs, gains, KPIs, risques, epics)
- **Seeder Automatisé via JSON** — Chargement déterministe des spécialisations (`specializations.json`), du compte administrateur et d'un projet de démonstration complet avec employés (`demo-project.json`) géré par le composant `DatabaseSeeder` via la variable `SEED_DATABASE=true`
- **Gestionnaire de Schéma Flyway** — Contrôle de version SQL strict évitant les dérives entre environnements (dev, CI, prod AWS)

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
│  Navigateur │───────────────▶│   API Spring   │
│             │◀───────────────│   (Java 21)    │
│  Stocke :   │   Réponse :    │  Génère :      │
│  - Token    │   {            │  - Token       │
│    d'accès  │    access_     │    d'accès     │
│   (mémoire) │    token,      │    (JWT HS256, │
│             │    user        │     ~15 min)   │
│  Cookie :   │   }            │  - Token de    │
│  - Token de │  + Set-Cookie  │    refresh     │
│    refresh  │                │   (cookie      │
│  (HttpOnly) │                │    HttpOnly)   │
└─────────────┘                └────────────────┘
```

### Mesures de Sécurité
1. **Token d'accès en mémoire** — Le token JWT de courte durée (15 min) est signé en HMAC-SHA256 (`JWT_SECRET`) et stocké uniquement dans une variable JavaScript en mémoire (jamais dans `localStorage`), immunisant l'application contre le vol de jetons par vulnérabilité XSS.
2. **Cookie HttpOnly de refresh** — Le token de rafraîchissement est isolé dans un cookie `HttpOnly` avec attribut `SameSite=Lax` (et `Secure` activé en production), invisible aux scripts client.
3. **Rafraîchissement automatique** — Un intercepteur Axios détecte les expirations (401), sollicite silencieusement `/api/refresh-token` et rejoue la requête originale.
4. **File d'attente de requêtes** — En cas de requêtes concurrentes pendant le refresh, les appels suivants sont automatiquement mis en file d'attente et débloqués dès l'obtention du nouveau token.
5. **Google OAuth via Spring Security JOSE** — Intégration Firebase OAuth sans état via `spring-security-oauth2-jose`, assurant la vérification cryptographique locale des clés de signature Google (JWKS).
6. **Politique CORS Dynamique** — Le backend n'autorise que les origines déclarées dans la variable `CORS_ALLOWED_ORIGINS`.
7. **Chaîne de Sécurité Spring Security 7** — Toutes les routes `/api/**` (hormis login, register, oauth google, forgot/reset password et refresh) exigent un token Bearer valide validé par le filtre `BearerTokenAuthenticationFilter`.
8. **Hachage BCrypt Rétrocompatible** — BCrypt (coût 12, préfixe `$2y$`), garantissant une compatibilité totale et transparente avec les mots de passe de l'ancien backend Laravel.

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
- **Java** 21 (JDK)
- **Maven** ≥ 3.9
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

# Configurer la base de données (PostgreSQL doit être en cours d'exécution)
export DB_HOST=localhost DB_DATABASE=growtrack_db DB_USERNAME=postgres DB_PASSWORD=...

# Démarrer le serveur (les migrations Flyway s'appliquent au démarrage)
mvn spring-boot:run   # Accessible sur http://localhost:8000

# Optionnel : insérer les spécialisations, le compte admin et les données exemple
SEED_DATABASE=true SEED_ADMIN_PASSWORD=... mvn spring-boot:run
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

Modifiez `backend/.env` et personnalisez les valeurs selon vos besoins :

| Variable | Modification | Exemple / Recommandation |
|----------|-------------|--------------------------|
| `DB_PASSWORD` | Définir un mot de passe de base de données **fort** | `MonMotDePasseFort!` |
| `FRONTEND_URL` | URL de base du frontend (liens de réinitialisation e-mail) | `http://localhost:8080` (Docker) ou `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées pour les requêtes du navigateur | `http://localhost:8080,http://localhost:5173` |
| `JWT_SECRET` | Clé secrète HMAC-SHA256 (vide = générée au démarrage) | `openssl rand -base64 48` (min. 32 caractères en prod) |
| `COOKIE_SECURE` | Activer `true` uniquement en production HTTPS | `false` en dev, `true` en prod |

> ⚠️ **Important** : En développement Docker, `docker-compose.override.yml` configure automatiquement `DB_HOST=db` et `STORAGE_PATH=/app/storage`.

#### Étape 3 : Synchroniser le Mot de Passe BDD

Le mot de passe dans `backend/.env` **doit correspondre** à celui dans `docker-compose.yml`. Soit :
- Modifiez `docker-compose.yml` ligne 12 pour correspondre à votre `.env`
- Soit gardez la valeur par défaut dans les deux fichiers (déconseillé en production)

#### Étape 4 : Construire & Démarrer les Conteneurs
```bash
docker-compose up --build -d
```

Cela va : télécharger l'image PostgreSQL, construire les images Gateway Nginx, Backend, Frontend et Système IA, puis démarrer les 5 conteneurs en arrière-plan.

> ℹ️ `docker-compose.override.yml` est appliqué automatiquement : il active le mode développement (Vite avec hot reload, backend exposé sur le port 8000, volumes montés) et utilise `frontend/nginx/dev.conf` comme configuration de la gateway.

#### Étape 5 : Initialiser le Backend

Les migrations de base de données (Flyway) s'exécutent automatiquement au démarrage du backend. Pour insérer les données de départ **une seule fois** (spécialisations, compte admin, projet et employés de démonstration), ajoutez dans `backend/.env` :

```bash
SEED_DATABASE=true
SEED_ADMIN_PASSWORD=un_mot_de_passe_solide
```

puis redémarrez le backend (`docker-compose up -d backend`) et remettez `SEED_DATABASE=false`.

#### Étape 6 : Accéder à l'Application

| Service | URL |
|---------|-----|
| 🌐 **Application** | `http://localhost:8080` |
| 🔌 **API Backend** | `http://localhost:8080/api/...` |
| 🤖 **Système IA** | `http://localhost:8080/ai/...` |

Tout est routé via la gateway Nginx — vous n'avez besoin que d'une seule URL. En développement elle est exposée sur le **port 8080** ; en production (`docker-compose.prod.yml`) sur le **port 80**.

#### Étape 7 : Obtenir une Clé API Gemini (pour les fonctionnalités IA)

Les fonctionnalités IA nécessitent une **clé API Google Gemini** :
1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/apikey)
2. Créez une clé API gratuite
3. Saisissez-la dans l'application quand demandé (envoyée par requête, jamais stockée côté serveur)

### Aperçu des Services

| Service | Nom du Conteneur | Image | Port |
|---------|-----------------|-------|------|
| Gateway Nginx | `scrumflow-nginx` | Custom (`frontend/nginx/`) | **8080** dev / **80** prod (exposé) |
| Base de données | `scrumflow-db` | `postgres:15-alpine` | 5432 (exposé en dev) |
| Backend Spring Boot | `scrumflow-backend` | Custom (Java 21, Spring Boot 4) | 8000 (API, exposé en dev) / 8081 (Actuator) |
| Frontend | `scrumflow-frontend` | Custom (Nginx) | 80 (interne) / 5173 en dev |
| Système IA | `scrumflow-ai` | Custom (Python 3.12) | 8001 (interne) |

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

Tous les services communiquent sur le réseau bridge Docker `scrumflow-network`. Le conteneur `scrumflow-nginx` sert de point d'entrée unique et route les requêtes selon `frontend/nginx/default.conf` (prod) :
- `/` → conteneur frontend (fichiers statiques de la SPA React, `frontend:80`)
- `/api/*` et `/storage/*` → Spring Boot (proxy HTTP vers `backend:8000`)
- `/ai/*` → FastAPI (proxy HTTP vers `ai-system:8001`)

En développement, `frontend/nginx/dev.conf` route vers le serveur Vite (`frontend:5173`, avec WebSocket pour le hot reload) et vers le backend Spring Boot (`backend:8000`).

---

## ☁️ Déploiement AWS (Terraform + CI/CD)

La production tourne sur une instance **EC2** unique qui exécute `docker-compose.prod.yml` avec les images publiées sur **Docker Hub**. L'infrastructure est décrite avec **Terraform** dans `terraform/`, et le déploiement est automatisé par **GitHub Actions**.

```
 push sur main ──► CI (ci.yml) ──► CD (cd.yml)
                                    │
                                    ├─ 1. Build & push des 4 images vers Docker Hub
                                    │      <utilisateur>/scrumflow-{nginx,backend,frontend,ai}
                                    │      tags : SHA du commit + latest
                                    │
                                    └─ 2. SSM send-command vers l'EC2
                                            │
                                            ▼
                               /opt/scrumflow/deploy.sh (terraform/scripts/deploy.sh)
                                 ├─ récupère les .env depuis SSM Parameter Store
                                 ├─ docker compose pull (depuis Docker Hub) && up -d
                                 ├─ attend /up (migrations Flyway au démarrage du backend)
                                 └─ nettoyage des anciennes images
```

### Ressources créées par Terraform

| Module | Ressources |
|--------|------------|
| `modules/network` | Security Group (ports 80/443, 22 optionnel) dans le VPC par défaut |
| `modules/compute` | Instance EC2 Ubuntu (`t3.small` par défaut), Elastic IP, rôle IAM de l'instance (SSM + lecture des paramètres) ; `user_data.sh` installe Docker, le plugin Compose, l'AWS CLI et un swap de 2 Go au premier démarrage |
| `modules/config` | Paramètres SSM chiffrés (`SecureString`) créés à partir des fichiers `terraform/env/*.env` + token Docker Hub optionnel |
| `modules/github-oidc` | Fournisseur OIDC GitHub + rôle IAM assumé par GitHub Actions pour lancer le déploiement (**aucune clé AWS stockée dans GitHub**) |

### Étape 1 : Préparer les fichiers .env de production

Les variables d'environnement de l'EC2 sont placées dans `terraform/env/` (dossier ignoré par Git, seuls les `*.example` sont versionnés) :

```bash
cd terraform
cp env/root.env.example     env/root.env       # DB_DATABASE, DB_USERNAME, DB_PASSWORD
cp env/backend.env.example  env/backend.env    # configuration Spring Boot de production (FRONTEND_URL, mail…)
cp env/frontend.env.example env/frontend.env   # optionnel
```

| Fichier local | Paramètre SSM | Fichier créé sur l'EC2 | Obligatoire |
|---------------|---------------|------------------------|:-----------:|
| `terraform/env/root.env` | `/scrumflow/prod/root.env` | `/opt/scrumflow/.env` | ✅ |
| `terraform/env/backend.env` | `/scrumflow/prod/backend.env` | `/opt/scrumflow/backend.env` | ✅ |
| `terraform/env/frontend.env` | `/scrumflow/prod/frontend.env` | `/opt/scrumflow/frontend.env` | ❌ |

> ⚠️ Les valeurs sont aussi enregistrées dans le state Terraform (`terraform.tfstate`) : ne le partagez pas et ne le commitez pas.

### Étape 2 : Créer l'infrastructure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # puis adaptez les valeurs
terraform init
terraform apply
```

`terraform apply` crée l'EC2 **et** envoie les fichiers `.env` dans SSM Parameter Store. Après une modification d'un `.env`, relancez `terraform apply` puis un déploiement.

> ⚠️ Si un fournisseur OIDC GitHub existe déjà dans le compte AWS, mettez `create_github_oidc_provider = false`.
>
> 🔒 Si vos dépôts Docker Hub sont **privés**, ajoutez `dockerhub_token = "dckr_pat_..."` (token en lecture seule) dans `terraform.tfvars` pour que l'EC2 puisse se connecter à Docker Hub.

### Étape 3 : Configurer GitHub

Dans **Settings → Secrets and variables → Actions** :

| Type | Nom | Valeur |
|------|-----|--------|
| Secret | `DOCKERHUB_USERNAME` | Votre nom d'utilisateur Docker Hub (ex. `jaouad3243`) |
| Secret | `DOCKERHUB_TOKEN` | Token d'accès Docker Hub (*Account Settings → Personal access tokens*, droits **Read & Write**) |
| Variable | `AWS_REGION` | output `aws_region` |
| Variable | `AWS_ROLE_ARN` | output `github_actions_role_arn` |
| Variable | `EC2_INSTANCE_ID` | output `instance_id` |

Créez aussi un **environment** GitHub nommé `production`.

### Étape 4 : Déployer

- **Automatique** : chaque push sur `main` lance la CI ; si elle réussit, le workflow CD construit les images, les pousse sur Docker Hub puis exécute `terraform/scripts/deploy.sh` sur l'EC2 via SSM.
- **Manuel** : onglet **Actions → CD → Run workflow**.

L'application est ensuite accessible sur `http://<public_ip>` (output `app_url`).

### Accès au serveur

```bash
# Shell sur l'instance sans SSH (commande donnée par l'output ssm_session_command)
aws ssm start-session --target <instance_id> --region <aws_region>

# Sur le serveur
cd /opt/scrumflow
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## 📈 Supervision (Prometheus + Grafana)

Prometheus et Grafana tournent sur **la même instance EC2** que l'application, démarrés par `docker-compose.prod.yml`. Grafana s'ouvre sur le tableau de bord **ScrumFlow Platform**, qui regroupe tout l'essentiel :

| Section | Contenu |
|---------|---------|
| Vue d'ensemble | État UP/DOWN de chaque composant, trafic, taux d'erreur et latence p95 de l'API, analyses IA en cours, CPU / mémoire / disque de l'EC2, alertes actives |
| API Backend | Requêtes par statut, latences p50/p95/p99, endpoints les plus sollicités, les plus lents et en erreur, connexions, erreurs de log |
| JVM & pool BDD | Heap, GC, CPU, threads, connexions HikariCP |
| Service IA | Analyses par minute, durée par endpoint (appels Gemini), appels en cours |
| Gateway nginx | Requêtes et connexions |
| PostgreSQL | Connexions, transactions, lignes, taux de cache, taille, deadlocks |
| Hôte EC2 | CPU, charge, mémoire, swap, disques, réseau |
| Conteneurs | CPU, mémoire, réseau et uptime par conteneur |

- **Accès** : `https://VOTRE_DOMAINE/grafana/` (ou `http://IP_ELASTIQUE/grafana/`), utilisateur `admin`, mot de passe `GRAFANA_ADMIN_PASSWORD` de `terraform/env/root.env`. Aucun port de supervision n'est exposé : Grafana passe par la gateway nginx (connexion limitée en débit), Prometheus n'est joignable que depuis Grafana.
- **Alertes** : règles dans `monitoring/prometheus/alerts.yml` (composant arrêté, erreurs/lenteur API, heap JVM, pool BDD, CPU/mémoire/disque…), visibles dans le panneau « Firing alerts ».
- **Ressources** : rétention de 15 jours (2 Go max), environ 1 Go de RAM au total pour la supervision. Une instance `t3.medium` est recommandée (`instance_type` dans `terraform/terraform.tfvars`).
- **En local** : `docker compose --profile monitoring up -d`, puis `http://localhost:8080/grafana/`.

Détails : [`monitoring/README.md`](monitoring/README.md).

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

### Tests Backend (JUnit 5 + Spring Boot Test)
```bash
cd backend
# PostgreSQL requis : localhost:5432/growtrack_testing (postgres / 12345), défini dans src/test/resources/test.env
mvn verify
```

**Couverture des tests :**
- ✅ **Tests d'intégration HTTP** (`AuthApiTest`, `ProjectApiTest`) — validation de l'ensemble des flux (login, refresh, logout, reset password, gestion des projets et équipes) via Spring Security
- ✅ **Tests des métriques & Actuator** (`MetricsApiTest`) — validation de l'exposition correcte des compteurs et histogrammes sur `/actuator/prometheus`
- ✅ **Tests de validation OAuth** (`FirebaseTokenVerifierTest`) — simulation et vérification cryptographique des tokens Google Firebase ID
- ✅ **Tests unitaires** (`UnitTests`) — normalisation des entrées, validations métier, calcul automatique de `planned_end_date`
- ✅ **Base de données de test PostgreSQL dédiée** (`growtrack_testing`) pour garantir des tests fidèles à l'environnement de production

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

Le backend Spring Boot est configuré via `backend/.env` (modèle dans `backend/.env.example`). L'application exige la présence de ces variables (sans guillemets) au démarrage :

```env
# Connexion PostgreSQL
DB_HOST=localhost             # En Docker Compose dev : db
DB_PORT=5432
DB_DATABASE=growtrack_db
DB_USERNAME=postgres
DB_PASSWORD=your_db_password

# Ports HTTP & Management
PORT=8000                     # Port d'écoute de l'API REST
MANAGEMENT_PORT=8081          # Port interne Actuator & Prometheus (non exposé)

# Frontend & Sécurité CORS
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080
COOKIE_SECURE=false           # Passer à true en production avec certificat SSL/TLS

# Sécurité & Tokens
JWT_SECRET=                   # Clé HMAC-SHA256 (min. 32 caractères ; vide = clé aléatoire par exécution)
FIREBASE_PROJECT_ID=scrumflow-af1fd  # Projet Firebase vérifiant les tokens Google OAuth

# Stockage statique des avatars (/storage/...)
STORAGE_PATH=storage          # En conteneur Docker : /app/storage

# E-mails (réinitialisation de mot de passe)
MAIL_MAILER=log               # "log" (console de dev) ou "smtp" (envoi réel)
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_SCHEME=null              # "smtps" pour TLS implicite (port 465), sinon STARTTLS
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME=ScrumFlow

# Amorçage des données (équivalent db:seed)
SEED_DATABASE=false           # Mettre à true pour charger le catalogue, l'admin et le projet démo
SEED_EXIT=false               # Mettre à true si l'on souhaite arrêter le conteneur après le seed
SEED_ADMIN_EMAIL=aelhail71@gmail.com
SEED_ADMIN_PASSWORD=          # Renseigner pour créer le chef de projet administrateur
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### Système IA
Le système IA nécessite une **clé API Google Gemini**, qui est transmise par requête depuis le frontend (non stockée sur le serveur).

### Production (EC2)

En production, les fichiers `.env` ne sont **jamais** copiés à la main sur le serveur ni commités :

1. Ils sont écrits dans `terraform/env/` (`root.env`, `backend.env`, `frontend.env`) à partir des fichiers `*.example`.
2. `terraform apply` les envoie chiffrés dans **SSM Parameter Store** sous `/scrumflow/prod/`.
3. À chaque déploiement, `terraform/scripts/deploy.sh` les télécharge dans `/opt/scrumflow/` sur l'EC2.

| Fichier | Contenu |
|---------|---------|
| `root.env` | `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (partagés par PostgreSQL et le backend) |
| `backend.env` | Configuration Spring Boot de production (`FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, mail…) |
| `frontend.env` | Optionnel (les variables `VITE_*` sont intégrées au moment du build) |

Voir [Déploiement AWS](#-déploiement-aws-terraform--cicd) pour le détail.

---

## 🤝 Contribution

1. **Forkez** le dépôt
2. **Créez** une branche fonctionnalité (`git checkout -b feature/fonctionnalite-geniale`)
3. **Commitez** vos modifications (`git commit -m 'Ajout fonctionnalité géniale'`)
4. **Poussez** vers la branche (`git push origin feature/fonctionnalite-geniale`)
5. **Ouvrez** une Pull Request

### Style de Code
- **Frontend** : ESLint + règles React Hooks
- **Backend** : conventions Java standard (Spring)
- **Système IA** : PEP 8

---

## 📄 Licence

Ce projet est distribué sous la licence MIT.

---