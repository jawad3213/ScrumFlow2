<p align="center">
  <h1 align="center">🚀 growtrack</h1>
  <p align="center">
    <strong>AI-Powered Project Management & Financial Planning Platform</strong>
  </p>
  <p align="center">
    An intelligent, full-stack project management tool that leverages Google Gemini AI to automate staffing plans, generate product backlogs, recommend tech stacks, and provide financial ROI forecasts — all from a single PDF upload.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Laravel-12-red?logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/Python-3.12-green?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Compose-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-orange?logo=google" alt="Gemini AI">
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [AI System Deep-Dive](#-ai-system-deep-dive)
- [API Documentation](#-api-documentation)
- [Authentication & Security](#-authentication--security)
- [Frontend Architecture](#-frontend-architecture)
- [Getting Started](#-getting-started)
- [Docker Deployment](#-docker-deployment)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**growtrack** is a comprehensive project management platform designed for project managers (Chefs de Projet) and development teams. It uniquely integrates AI-powered analysis into the project lifecycle, transforming raw project requirement documents (PDFs — *Cahier des Charges*) into actionable staffing plans, detailed backlogs, technology recommendations, and financial forecasts.

### The Problem

Project managers spend significant time manually:
- Estimating project costs and staffing needs
- Breaking requirements into epics, user stories, and tasks
- Evaluating technology stacks for new projects
- Calculating ROI and financial projections

### The Solution

growtrack automates all of the above using **Google Gemini AI**, providing structured, data-driven outputs via an intuitive wizard-based interface that guides managers through the entire project genesis process.

---

## ✨ Key Features

### 🤖 AI-Powered Project Genesis
- **Staffing Analysis** — Upload a requirements PDF + employee pool → AI generates an optimized staffing plan with cost breakdowns (CAPEX/OPEX), KPIs, and 3-year ROI projections
- **Backlog Generation** — AI produces a full Agile backlog: Epics → User Stories → Technical Tasks, each with assigned roles, hours, and acceptance criteria
- **Tech Stack Recommendation** — AI analyzes backlog complexity and recommends primary + alternative technology stacks with architecture patterns, pros/cons, and synergy explanations

### 📊 Project Dashboard
- Global dashboard with project overview cards and key statistics
- Per-project dashboards with financial KPIs, risk analysis, and team composition
- Notification center for team updates

### 👥 Team & Employee Management
- Full CRUD for employees with specializations, roles, and engagement tracking
- Specialization management (categories of expertise)
- Bulk operations (delete, assign/unassign)
- Employee availability tracking for project assignment

### 📋 Strategic & Technical Blueprints
- **Strategic Blueprint** — High-level project KPIs, risk assessment, and ROI analysis summaries
- **Technical Blueprint** — Detailed Agile backlog visualization with Epics, User Stories, and Tasks in a navigable wizard interface

### 🏗️ Stack Choice Visualization
- Side-by-side comparison of recommended vs. alternative tech stacks
- Category-based breakdown (Frontend, Backend, Database, DevOps, AI/ML)
- Synergy explanations and risk assessments
- Junior developer tips per stack

### 🔐 Role-Based Access Control
- **Admin / Chef de Projet** — Full access: create projects, manage team, run AI analyses
- **Employee** — View assigned projects, project dashboards, and blueprints

### 📄 PDF Export & Reporting
- Export staffing plans and financial analyses to PDF
- HTML-to-PDF generation with `html2pdf.js`

---

## 🏛️ Architecture

growtrack follows a **microservices-inspired architecture** with three distinct services orchestrated via Docker Compose:

```
┌───────────────────────────────────────────────────────────────┐
│                        NGINX (Port 80)                        │
│                    Reverse Proxy & Static Files                │
├────────────┬─────────────────────────┬────────────────────────┤
│   /  (SPA) │    /api/* (REST API)    │    /ai/* (AI Engine)   │
│            │                         │                        │
│  React App │   Laravel Backend       │   FastAPI (Python)     │
│  (Static)  │   (PHP-FPM:9000)        │   (Uvicorn:8001)      │
│            │                         │                        │
│  Vite      │   Sanctum Auth          │   Google Gemini API    │
│  TailwindCSS│  PostgreSQL 15         │   Pydantic Schemas     │
│  React 19  │   Eloquent ORM          │   PyMuPDF (PDF Parse)  │
└────────────┴──────────┬──────────────┴────────────────────────┘
                        │
                 ┌──────┴──────┐
                 │ PostgreSQL  │
                 │   15-Alpine │
                 │  (Port 5432)│
                 └─────────────┘
```

### Service Communication

| Service | Internal Port | Protocol | Role |
|---------|:------------:|----------|------|
| **Frontend (Nginx)** | `80` | HTTP | Serves React SPA + reverse-proxies API & AI requests |
| **Backend (PHP-FPM)** | `9000` | FastCGI | Processes REST API requests from Nginx |
| **AI System (Uvicorn)** | `8001` | HTTP | Handles AI analysis requests via proxy |
| **Database (PostgreSQL)** | `5432` | TCP | Persistent data storage |

---

## 🧰 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI library with latest features (use hook, Server Components-ready) |
| **Vite** | 7.2 | Lightning-fast build tool and dev server |
| **TailwindCSS** | 4.1 | Utility-first CSS framework |
| **React Router DOM** | 7.12 | Client-side routing with nested layouts |
| **TanStack React Query** | 5.90 | Server state management with caching & auto-refetching |
| **TanStack React Table** | 8.21 | Headless table for data-heavy views |
| **Axios** | 1.13 | HTTP client with interceptors for auth token refresh |
| **Radix UI** | Latest | Accessible, unstyled UI primitives (Dialog, Select, Tabs, etc.) |
| **shadcn/ui** | Latest | Pre-built component library built on Radix UI |
| **Framer Motion** | 12.23 | Declarative animations |
| **GSAP** | 3.14 | Advanced scroll-based animations |
| **Chart.js + react-chartjs-2** | 4.5 / 5.3 | Data visualization charts |
| **Lucide React** | 0.561 | Icon library |
| **Sonner** | 2.0 | Toast notification system |
| **html2pdf.js** | 0.14 | Client-side PDF generation |
| **@react-pdf/renderer** | 4.3 | React-based PDF document generation |
| **Lenis** | 1.3 | Smooth scrolling library |
| **cmdk** | 1.1 | Command palette component |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 12.0 | PHP web framework (REST API) |
| **PHP** | 8.2+ | Server-side runtime |
| **Laravel Sanctum** | 4.2 | Token-based API authentication with HttpOnly cookies |
| **PostgreSQL** | 15 | Relational database |
| **Eloquent ORM** | — | Database abstraction with relationships and factories |
| **PHPUnit** | 11.5 | Unit & feature testing |
| **Faker** | 1.23 | Test data generation |

### AI System
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | Async Python web framework for AI endpoints |
| **Uvicorn** | Latest | ASGI server for FastAPI |
| **Google Generative AI** | Latest | Google Gemini LLM integration |
| **Instructor** | Latest | Structured output extraction from LLMs (Pydantic integration) |
| **Pydantic** | Latest | Data validation and schema definition |
| **PyMuPDF (fitz)** | Latest | PDF text extraction |
| **pytest** | Latest | Python testing framework |
| **httpx** | Latest | Async HTTP client for testing |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization for all 4 services |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy, static file serving, and routing |
| **GitHub Actions** | CI/CD (`.github/workflows/`) |

---

## 📂 Project Structure

```
growtrack/
├── 📁 frontend/                    # React SPA (Vite + TailwindCSS)
│   ├── 📁 nginx/
│   │   └── default.conf            # Nginx reverse proxy configuration
│   ├── 📁 public/                  # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 shared/          # Reusable components (DataTable, Modals, Cards)
│   │   │   └── 📁 ui/              # Base UI primitives (Button, Input, Dialog, etc.)
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx      # Authentication state management
│   │   │   └── ProjectContext.jsx   # Current project context tracking
│   │   ├── 📁 features/
│   │   │   ├── 📁 ai-analysis/     # AI-powered analysis components & API
│   │   │   │   ├── 📁 api/         # AI service API calls
│   │   │   │   └── 📁 components/  # Wizard, Resource Pool, Staffing, etc.
│   │   │   ├── 📁 auth/            # Authentication feature
│   │   │   │   ├── 📁 api/         # Login, Refresh, Logout API
│   │   │   │   ├── 📁 components/  # LoginForm, RoleGuard, ResetPassword, etc.
│   │   │   │   └── 📁 hooks/       # Auth-related custom hooks
│   │   │   ├── 📁 dashboard/       # Dashboard feature components
│   │   │   ├── 📁 projects/        # Project management feature
│   │   │   │   ├── 📁 api/         # Project CRUD API, TanStack Query hooks
│   │   │   │   └── 📁 components/  # Backlog, Blueprints, Stack Choice views
│   │   │   └── 📁 team/            # Team management feature
│   │   │       ├── 📁 api/         # Employee & Specialization APIs
│   │   │       └── 📁 components/  # Team/Specialization tables & modals
│   │   ├── 📁 layouts/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Sidebar.jsx          # Side navigation with project context
│   │   │   ├── PrivateLayout.jsx    # Authenticated route wrapper
│   │   │   └── ProjectLayout.jsx    # Project-scoped route wrapper
│   │   ├── 📁 lib/
│   │   │   └── axios.js             # Axios instance with auth interceptors
│   │   ├── 📁 pages/               # Page components (route endpoints)
│   │   │   ├── 📁 auth/            # Login, Forgot/Reset password pages
│   │   │   ├── 📁 dashboard/       # Global & Project dashboard pages
│   │   │   ├── 📁 NewProjectAnalysis/ # New project wizard & analysis pages
│   │   │   ├── 📁 project/         # Project detail pages
│   │   │   ├── 📁 settings/        # Settings page
│   │   │   └── 📁 team/            # Team management page
│   │   ├── 📁 utils/               # Utility modules
│   │   │   ├── api.js               # Base URL constants
│   │   │   ├── constants.js         # App-wide constants
│   │   │   ├── date.js              # Date formatting utilities
│   │   │   ├── storage.js           # localStorage wrapper service
│   │   │   └── validation.js        # Form validation helpers
│   │   ├── App.jsx                  # Root route configuration
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── Dockerfile                   # Multi-stage: Node build → Nginx serve
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vitest.config.js
│
├── 📁 backend/                     # Laravel 12 REST API
│   ├── 📁 app/
│   │   ├── 📁 Http/Controllers/
│   │   │   ├── AuthController.php          # Login, Logout, Refresh, Password Reset
│   │   │   ├── EmployeeController.php      # Employee CRUD + bulk operations
│   │   │   ├── ProfileController.php       # User profile & avatar management
│   │   │   ├── ProjectController.php       # Project CRUD + AI data persistence
│   │   │   ├── ProjectTeamController.php   # Team assignment/unassignment
│   │   │   └── SpecializationController.php # Specialization CRUD
│   │   ├── 📁 Mail/                # Email templates (password reset)
│   │   ├── 📁 Models/
│   │   │   ├── User.php                    # User model (roles: chef/employee)
│   │   │   ├── Project.php                 # Project model with AI attributes
│   │   │   ├── AssignedEngineer.php        # Engineer-to-Project assignment
│   │   │   ├── ProjectEpic.php             # Agile Epic model
│   │   │   ├── ProjectStory.php            # User Story model
│   │   │   ├── ProjectBlueprintTask.php    # Technical Task model
│   │   │   ├── ProjectKpi.php              # KPI tracking
│   │   │   ├── ProjectRisk.php             # Risk assessment
│   │   │   ├── EstimatedGain.php           # Financial gain projections
│   │   │   ├── InfrastructureCost.php      # Infrastructure cost tracking
│   │   │   ├── RoiProjection.php           # ROI yearly projections
│   │   │   ├── Specialization.php          # Employee specialization
│   │   │   └── RefreshToken.php            # Token refresh management
│   │   └── 📁 Providers/
│   ├── 📁 config/                  # Laravel configuration files
│   │   ├── cors.php                # CORS settings for SPA
│   │   ├── sanctum.php             # Sanctum auth configuration
│   │   └── ...
│   ├── 📁 database/
│   │   ├── 📁 factories/           # Model factories for testing
│   │   ├── 📁 migrations/          # 17 migration files
│   │   └── 📁 seeders/             # Data seeders (Users, Projects, Specializations)
│   ├── 📁 routes/
│   │   └── api.php                 # All API route definitions
│   ├── 📁 tests/
│   │   ├── 📁 Feature/             # Integration tests (8 test files)
│   │   └── 📁 Unit/                # Unit tests (6 test files)
│   ├── Dockerfile                  # Multi-stage: Composer build → PHP-FPM runtime
│   └── composer.json
│
├── 📁 Ai System/                   # Python AI Microservice
│   ├── 📁 schemas/                 # Pydantic data models
│   │   ├── staffing_schemas.py     # Financial plan & staffing schemas
│   │   ├── backlog_schemas.py      # Epic → Story → Task schemas
│   │   └── stackchoice_schemas.py  # Tech stack recommendation schemas
│   ├── 📁 services/               # AI business logic
│   │   ├── staffing_service.py     # Gemini staffing plan generation
│   │   ├── backlog_service.py      # Gemini backlog generation
│   │   └── stackchoice_service.py  # Gemini stack recommendation
│   ├── 📁 tests/                  # Pytest test suite
│   │   ├── conftest.py             # Test fixtures & configuration
│   │   ├── test_api.py             # API endpoint tests
│   │   ├── test_schemas.py         # Schema validation tests
│   │   └── test_services.py        # Service logic tests
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Python 3.12-slim + Uvicorn
│
├── 📁 .github/                    # GitHub Actions workflows
├── 📁 .docker/                    # Additional Docker configurations
├── docker-compose.yml             # Full-stack orchestration (4 services)
├── .dockerignore
└── .gitignore
```

---

## 🗄️ Database Schema

growtrack uses **PostgreSQL 15** with **17 migration files** defining the following entity relationships:

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────────┐
│  specializations │       │       users           │
├──────────────────┤       ├──────────────────────┤
│ id (PK)          │◄──────┤ id (PK)              │
│ name             │       │ first_name           │
│ description      │       │ last_name            │
│ created_at       │       │ email (UNIQUE)       │
│ updated_at       │       │ password (hashed)    │
└──────────────────┘       │ role (chef/employee) │
                           │ specialization_id(FK)│
                           │ avatar               │
                           │ is_engaged           │
                           │ remember_token       │
                           └───────┬──────────────┘
                                   │ 1:N
                                   ▼
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
                    │ ── AI Financial Attributes ── │
                    │ estimated_duration_months     │
                    │ total_capex                   │
                    │ total_opex                    │
                    │ total_project_cost            │
                    │ total_gain_value              │
                    │ annual_opex_value             │
                    │ roi_percentage                │
                    │ break_even_point_months       │
                    │ roi_analysis_summary          │
                    │ ── Stack Analysis (JSON) ──   │
                    │ stack_analysis_data           │
                    │ architecture_plan             │
                    │ recommended_stack             │
                    │ stack_name                    │
                    └──────┬───────────────────────┘
                           │ 1:N (multiple child tables)
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

### Key Database Features
- **Auto-calculated fields**: `planned_end_date` is automatically computed from `start_date` + `estimated_duration_months` via Eloquent model events
- **JSON columns**: `stack_analysis_data`, `architecture_plan`, and `recommended_stack` store full AI responses as JSON
- **Cascade deletes**: Deleting a project removes all related children (engineers, gains, KPIs, risks, epics)
- **Factory & Seeder support**: Pre-built factories and seeders for Users, Projects, Specializations, and AssignedEngineers

---

## 🤖 AI System Deep-Dive

The AI system is a **standalone Python microservice** powered by **Google Gemini** (via the `google-generativeai` SDK) and **Instructor** for structured output extraction.

### How It Works

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Requirements │     │   PyMuPDF (fitz) │     │   Google Gemini │
│   PDF File   │────▶│   Text Extraction│────▶│   + Instructor  │
│              │     │                  │     │  Structured LLM │
└──────────────┘     └──────────────────┘     └───────┬─────────┘
                                                      │
                                              ┌───────▼─────────┐
                                              │ Pydantic Schema │
                                              │   Validation    │
                                              └───────┬─────────┘
                                                      │
                                              ┌───────▼─────────┐
                                              │   JSON Response │
                                              │   to Frontend   │
                                              └─────────────────┘
```

### Three AI Endpoints

#### 1. `POST /analyze-staffing`
> **Input**: Requirements PDF + Employee Pool JSON + Gemini API Key
> **Output**: `ProjectFinancialPlan` (structured)

Generates a complete financial plan including:
- **Selected Engineers**: Role, specialization, level, monthly salary, months assigned, total cost
- **Licenses & APIs**: Required third-party services with costs
- **CAPEX Breakdown**: Development costs + contingency buffer (15-20%)
- **OPEX Breakdown**: Cloud subscriptions + maintenance engineers
- **KPIs**: Non-financial success metrics with measurement methods
- **Total Project Cost**: CAPEX + first-year OPEX
- **Estimated Gains**: Annual financial benefits
- **ROI Forecast**: 3-year projections (cumulative costs, gains, net cash flow, ROI %)
- **Break-Even Point**: Month when the project becomes profitable

#### 2. `POST /analyze-backlog`
> **Input**: Requirements PDF + Employee Pool JSON + Duration + Budget + API Key
> **Output**: `RapportAnalyseStaffing` (structured backlog)

Generates a full Agile backlog hierarchy:
- **Epics** (Level 1): Major features with IDs and descriptions
  - **User Stories** (Level 2): Functional requirements in "As a... I want... So that..." format
    - Story points (Fibonacci)
    - Acceptance criteria (binary pass/fail, happy path + edge cases)
    - **Tasks** (Level 3): Technical implementation actions
      - Assigned role (must exactly match employee pool)
      - Implementation instructions (stack, steps, security practices)
      - Hour estimates

#### 3. `POST /analyze-stack`
> **Input**: Backlog JSON + API Key
> **Output**: `ArchitectureAnalysisResponse` (structured)

Generates technology recommendations including:
- **Project Dimensions**: Type, complexity score (1-10), scalability need, constraints
- **Primary Recommendation**: Full stack with strategy name, architecture pattern, synergy explanation
- **Alternative Recommendation**: Viable alternative for comparison
- **Risk Assessment**: Technical risks and bottlenecks
- **Junior Developer Tips**: Implementation guidance for less experienced engineers

### Pydantic Schema Validation

All AI outputs are validated against strict Pydantic schemas using the `instructor` library, ensuring:
- Type-safe responses (no raw string parsing)
- Automatic retries on malformed outputs
- Field-level descriptions that serve as prompt engineering (guiding Gemini's output format)

---

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/login` | ❌ | Authenticate user, returns access token + sets HttpOnly refresh cookie |
| `POST` | `/api/forgot-password` | ❌ | Send password reset email |
| `POST` | `/api/reset-password` | ❌ | Reset password with token |
| `POST` | `/api/refresh-token` | 🍪 Cookie | Refresh access token using HttpOnly cookie |
| `POST` | `/api/logout` | ✅ Bearer | Invalidate session |
| `GET`  | `/api/me` | ✅ Bearer | Get authenticated user profile |

### Employee Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`    | `/api/employees` | ✅ | List all employees |
| `GET`    | `/api/employees/available` | ✅ | List available (unengaged) employees |
| `POST`   | `/api/employees` | ✅ | Create new employee |
| `PUT`    | `/api/employees/{id}` | ✅ | Update employee |
| `DELETE` | `/api/employees/{id}` | ✅ | Delete employee |
| `POST`   | `/api/employees/bulk-delete` | ✅ | Bulk delete employees |

### Specialization Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`    | `/api/specializations` | ✅ | List all specializations |
| `POST`   | `/api/specializations` | ✅ | Create specialization |
| `PUT`    | `/api/specializations/{id}` | ✅ | Update specialization |
| `DELETE` | `/api/specializations/{id}` | ✅ | Delete specialization |
| `POST`   | `/api/specializations/bulk-delete` | ✅ | Bulk delete specializations |

### Profile Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/profile` | ✅ | Get user profile |
| `POST` | `/api/profile` | ✅ | Update profile info |
| `POST` | `/api/profile/password` | ✅ | Change password |
| `POST` | `/api/profile/avatar` | ✅ | Upload avatar |

### Project Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`    | `/api/projects/dashboard` | ✅ | Get dashboard statistics |
| `GET`    | `/api/projects` | ✅ | List all projects |
| `POST`   | `/api/projects` | ✅ | Create project (with AI data) |
| `GET`    | `/api/projects/{id}` | ✅ | Get project details (with all relations) |
| `PUT`    | `/api/projects/{id}` | ✅ | Update project |
| `POST`   | `/api/projects/{id}/stack` | ✅ | Save stack analysis data |
| `DELETE` | `/api/projects/{id}` | ✅ | Delete project |

### Project Team
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/projects/{id}/team` | ✅ | Get project team members |
| `POST` | `/api/projects/{id}/team/assign` | ✅ | Assign employee to project |
| `POST` | `/api/projects/{id}/team/unassign` | ✅ | Remove employee from project |

### AI Analysis (Python Service)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/analyze-staffing` | API Key | Generate staffing & financial plan |
| `POST` | `/ai/analyze-backlog` | API Key | Generate Agile backlog |
| `POST` | `/ai/analyze-stack` | API Key | Generate tech stack recommendation |

---

## 🔐 Authentication & Security

growtrack implements a **dual-token authentication pattern** for maximum security:

### Token Architecture

```
┌─────────────┐    Login     ┌────────────────┐
│   Browser   │─────────────▶│  Laravel API   │
│             │◀─────────────│                │
│  Stores:    │  Response:   │  Generates:    │
│  - Access   │  {           │  - Access Token│
│    Token    │    access_   │    (short-lived│
│    (memory) │    token,    │     ~60 min)   │
│             │    user,     │  - Refresh     │
│  Cookie:    │    role      │    Token       │
│  - Refresh  │  }           │    (HttpOnly   │
│    Token    │  + Set-Cookie│     cookie)    │
│  (HttpOnly) │              │                │
└─────────────┘              └────────────────┘
```

### Security Features
1. **Memory-only Access Token**: The short-lived access token is stored in a JavaScript variable (never `localStorage`), preventing XSS token theft
2. **HttpOnly Refresh Cookie**: The refresh token is stored in an HttpOnly cookie, invisible to JavaScript
3. **Automatic Token Refresh**: Axios interceptor automatically refreshes expired access tokens using the cookie
4. **Request Queue**: During token refresh, subsequent 401 requests are queued and replayed after refresh succeeds
5. **CORS Whitelist**: Backend only accepts requests from configured frontend origins
6. **Sanctum Guard**: All API routes (except login/register) are protected by `auth:sanctum` middleware
7. **Role-Based Guards**: Frontend `RoleGuard` component restricts admin-only routes (`/projects/new`, `/team-global`)
8. **Password Hashing**: User passwords are automatically hashed via Laravel's `HashedCast`

---

## 🎨 Frontend Architecture

### Provider Hierarchy

```jsx
<StrictMode>
  <BrowserRouter>
    <AuthProvider>          // Authentication state (user, token, role)
      <QueryClientProvider>  // TanStack Query (server state cache)
        <ProjectProvider>    // Current project context
          <App />            // Route definitions
          <Toaster />        // Toast notifications (Sonner)
        </ProjectProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

### Feature-Based Architecture

The frontend follows a **feature-sliced design** pattern:

```
features/
├── ai-analysis/          # AI-powered project analysis
│   ├── api/              # API client functions
│   └── components/       # Feature-specific components
│       ├── ProjectGenesisWizard.jsx   # 4-step project creation wizard
│       ├── AIDashboard.jsx            # AI analysis results overview
│       ├── RequirementUpload.jsx      # PDF upload with drag & drop
│       ├── ResourcePool.jsx           # Employee pool configuration
│       ├── InternalResourcePool.jsx   # Internal team resource selection
│       ├── DynamicResourcePool.jsx    # Dynamic resource management
│       ├── StaffingStrategy.jsx       # Staffing configuration
│       └── GeminiAuth.jsx             # API key input component
├── auth/                 # Authentication feature
├── dashboard/            # Dashboard widgets
├── projects/             # Project management views
└── team/                 # Employee & specialization management
```

### Routing Architecture

```
/login                          → Public (LoginPage)
/forgot-password                → Public (ForgotPasswordPage)
/reset-password                 → Public (ResetPasswordPage)
/                               → Redirect → /dashboard

[PrivateLayout] (Auth required)
├── /dashboard                  → DashboardPage (global overview)
├── /notifications              → NotificationsPage
├── /profile                    → ProfilePage
├── /settings                   → SettingsPage
├── /projects/new-project               → [Admin] NewProjectPage (Genesis Wizard)
├── /team-global                → [Admin] TeamPage
│
└── [ProjectLayout] (Project context)
    └── /project/:id
        ├── /                   → ProjectDashboardPage (project overview)
        ├── /hub                → StrategicBlueprint (KPIs, risks, ROI)
        ├── /blueprint          → TechnicalBlueprintPage (Epics/Stories/Tasks)
        ├── /stack              → StackChoicePage (tech stack comparison)
        ├── /project-team       → ProjectTeamPage (team composition)
        ├── /analysis           → [Admin] AnalysisPage
        └── /team               → [Admin] TeamPage
```

### State Management Strategy

| Layer | Tool | Purpose |
|-------|------|---------|
| **Server State** | TanStack React Query | API data caching, auto-refetching, optimistic updates |
| **Auth State** | React Context | User session, token management, login/logout |
| **Project Context** | React Context | Currently selected project ID (from URL) |
| **UI State** | React `useState` | Form inputs, modal visibility, wizard steps |
| **Persistent State** | `StorageService` (localStorage) | Cached user data for fast restore on page reload |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **PHP** ≥ 8.2
- **Composer** ≥ 2.6
- **Python** ≥ 3.12
- **PostgreSQL** ≥ 15
- **Docker & Docker Compose** (for containerized deployment)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/growtrack.git
cd growtrack
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database (ensure PostgreSQL is running)
php artisan migrate
php artisan db:seed   # Optional: seed sample data

# Start the development server
php artisan serve     # Runs on http://localhost:8000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start the development server
npm run dev           # Runs on http://localhost:5173
```

#### 4. AI System Setup
```bash
cd "Ai System"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the AI server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

---

## 🐳 Docker Deployment

growtrack is fully containerized with Docker Compose for easy deployment.

### Quick Start
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services Architecture

| Service | Container Name | Image | Port |
|---------|---------------|-------|------|
| Database | `growtrack-db` | `postgres:15-alpine` | 5432 (internal) |
| Backend | `growtrack-backend` | Custom (PHP 8.2-FPM) | 9000 (internal) |
| Frontend | `growtrack-frontend` | Custom (Nginx) | **80** (exposed) |
| AI System | `growtrack-ai` | Custom (Python 3.12) | 8001 (internal) |

### Docker Build Stages

**Frontend** — Multi-stage build:
1. `node:20-alpine` → Builds React app with Vite (`npm run build`)
2. `nginx:alpine` → Serves static files + proxies `/api` and `/ai` routes

**Backend** — Multi-stage build:
1. `composer:2.6` → Installs PHP dependencies
2. `php:8.2-fpm-alpine` → Runtime with PostgreSQL, GD, ZIP extensions

**AI System** — Single-stage:
- `python:3.12-slim` → Installs PyMuPDF build tools + pip dependencies

### Networking

All services communicate on the `growtrack-network` Docker bridge network. The Nginx container acts as the single entry point (port 80), routing requests to:
- `/` → Static React SPA files
- `/api/*` → Laravel (FastCGI to backend:9000)
- `/ai/*` → FastAPI (HTTP proxy to ai-system:8001)

---

## 🧪 Testing

growtrack includes comprehensive test suites across all three services.

### Frontend Tests (Vitest + React Testing Library)
```bash
cd frontend
npm test              # Run all tests
npm test -- --watch   # Watch mode
```

**Test Coverage:**
- ✅ UI Component tests (51 files in `components/ui/`, each with `*.test.jsx`)
- ✅ Shared component tests (DataTable, Modals, Cards)
- ✅ Feature component tests (AI Analysis, Auth, Team, Projects, Dashboard)
- ✅ Utility function tests (constants, date, storage, validation)
- ✅ Context integration tests (AuthContext, ProjectContext)
- ✅ Layout integration tests (Navbar, Sidebar, PrivateLayout)

### Backend Tests (PHPUnit)
```bash
cd backend
php artisan test      # Run all tests
```

**Test Coverage:**
- ✅ Feature tests (8 test files) — API endpoint integration tests
- ✅ Unit tests (6 test files) — Model and business logic tests
- ✅ Model factories for test data generation

### AI System Tests (pytest)
```bash
cd "Ai System"
pytest                # Run all tests
pytest -v             # Verbose output
```

**Test Coverage:**
- ✅ API endpoint tests (`test_api.py`)
- ✅ Schema validation tests (`test_schemas.py`)
- ✅ Service logic tests (`test_services.py`)
- ✅ Shared fixtures via `conftest.py`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
# Application
APP_NAME=growtrack
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://your-server-ip

# Database
DB_CONNECTION=pgsql
DB_HOST=db                    # Docker service name
DB_PORT=5432
DB_DATABASE=growtrack_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Authentication
SESSION_DRIVER=database
BCRYPT_ROUNDS=12

# Queue & Cache
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mail (for password reset)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@growtrack.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### AI System
The AI system requires a **Google Gemini API key**, which is passed per-request from the frontend (not stored on the server).

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- **Frontend**: ESLint + React Hooks rules
- **Backend**: Laravel Pint (PSR-12)
- **AI System**: PEP 8

---

## 📄 License

This project is licensed under the MIT License.

---