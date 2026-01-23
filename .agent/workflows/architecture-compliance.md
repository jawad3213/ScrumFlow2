---
description: Ensure strict architectural compliance and proper logic placement
---

# Architecture Compliance Workflow

Follow these steps to ensure every change respects the project's folder structure and logic placement:

1. **Verify Target Path**: Before creating or modifying a file, analyze the existing project structure. 
   - Components go to `src/components` (shared) or `src/pages/[page-name]/components` (page-specific).
   - API calls go to `src/api/`.
   - Custom hooks go to `src/hooks/`.
   - Context providers go to `src/context/`.
   - Utils go to `src/utils/`.

2. **Check Naming Conventions**: Ensure file names match the established casing (e.g., PascalCase for components, camelCase for utils/hooks).

3. **Validate Logic Placement**:
   - Business logic should be in services/api or dedicated hooks.
   - UI logic stays within components.
   - Global state remains in Context/Store.

4. **Review Context**: Always check if a similar component or logic already exists to avoid duplication and maintain the "proper place" for everything.
