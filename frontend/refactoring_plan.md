# Architecture Refactoring Plan: Bulletproof React (Feature-Based)

## 1. Directory Structure Analysis

### Current Structure
```
src/
├── api/ (to be dissolved)
├── assets/
├── components/
│   ├── shared/ (mix of domain and generic)
│   └── ui/ (generic)
├── context/ (global state)
├── features/ (partially implemented)
│   ├── ai-analysis/ (currently in pages)
│   ├── auth/ (exists)
│   ├── dashboard/ (exists)
│   └── team/ (exists)
├── hooks/
├── pages/ (thick pages)
├── services/ (to be dissolved)
└── utils/
```

### Target Domains (Features)
Based on the current codebase, we will organize into the following features:

1.  **Auth** (`src/features/auth`)
    *   Exists, need to consolidate API and routes.
2.  **Team** (`src/features/team`)
    *   Manage Employees and Specializations.
3.  **Projects** (`src/features/projects`)
    *   Project logic, creation (Wizard), list.
4.  **Dashboard** (`src/features/dashboard`)
    *   Main dashboard stats and overview.
5.  **AI Analysis** (`src/features/ai-analysis`)
    *   Currently `src/pages/ai-analysis`. Heavy logic to move.

## 2. Refactoring Steps

### Step 1: Foundation Setup
*   Create `src/lib` and move `src/api/client.js` to `src/lib/axios.js`.
*   Establish top-level folders if missing: `layouts`, `features` (ensure all domains exist).

### Step 2: Dissolve `src/api` and `src/services`
*   Move `src/api/auth.js` -> `src/features/auth/api/`
*   Move `src/api/projects.js` -> `src/features/projects/api/`
*   Move `src/api/employees.js`, `specializations.js` -> `src/features/team/api/`
*   Move `src/api/ai.js` -> `src/features/ai-analysis/api/`
*   Move generic React Query hooks from `src/hooks` to their respective feature `api` or `hooks` folder?
    *   *Decision*: Move specialized hooks (`useProjectsQuery`) to `src/features/projects/api/queries.js` or similar. Keeping them near the feature is best.

### Step 3: Refactor Pages (Thinning)
*   **AI Analysis**:
    *   Move `src/pages/ai-analysis/components/*` -> `src/features/ai-analysis/components/`
    *   Move `src/pages/ai-analysis/AnalysisPage.jsx` logic -> `src/features/ai-analysis/components/AnalysisLayout.jsx` or main feature component.
    *   `src/pages/ai-analysis/index.jsx` should only render the feature component.
*   **Team**:
    *   Ensure `TeamPage` imports from `features/team`.
*   **Projects**:
    *   Move `NewProjectPage` logic -> `features/projects`.

### Step 4: Component Classification
*   `src/components/shared/` audit:
    *   `DataTable`, `FinancialCard` -> Keep if truly shared, or move to feature if specific?
    *   *Rule*: `FinancialCard` seems generic enough visually, but if only used in AI Dashboard, maybe feature spec? Let's keep in `shared` for now as requested for "dumb UI".

## 3. Detailed Execution Plan

1.  **Lib Setup**:
    *   `mkdir src/lib`
    *   Move `src/api/client.js` -> `src/lib/axios.js` (update imports).
    *   Update `src/main.jsx` and others to import from `lib`.

2.  **Feature: Auth**:
    *   Ensure `src/features/auth/api` exists.
    *   Move `src/api/auth.js` content there.
    *   Move `src/hooks/useAuth.js` -> `src/features/auth/hooks/useAuth.js` (or keep in hooks if widely used? Bulletproof suggests feature hooks).

3.  **Feature: Team**:
    *   `mkdir -p src/features/team/api`
    *   Move `src/api/employees.js`, `src/api/specializations.js` content to `src/features/team/api`.
    *   Move `src/hooks/useEmployeesQuery.js`, `useSpecializationsQuery.js` -> `src/features/team/api/queries.js`.

4.  **Feature: Projects**:
    *   `mkdir -p src/features/projects/api`
    *   `mkdir -p src/features/projects/components`
    *   Move `src/api/projects.js` -> `src/features/projects/api`.
    *   Move `src/hooks/useProjectsQuery.js` -> `src/features/projects/api/queries.js`.

5.  **Feature: AI Analysis**:
    *   `mkdir -p src/features/ai-analysis/api`
    *   `mkdir -p src/features/ai-analysis/components`
    *   Move `src/api/ai.js` -> `src/features/ai-analysis/api`.
    *   Move `src/pages/ai-analysis/components/*` -> `src/features/ai-analysis/components`.

6.  **Cleanup & Fix Imports**:
    *   Global search and replace for moved files.
