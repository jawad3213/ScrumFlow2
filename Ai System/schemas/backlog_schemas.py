from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class Task(BaseModel):
    """
    Tâche Technique (Niveau 3) : Action unitaire assignée à un profil spécifique.
    """
    id: str = Field(..., description="Identifiant unique de la tâche (ex: T-1.1.1).")
# Updated description for maximum strictness
    role: str = Field( ..., description="Le rôle EXACT requis. Doit être COPIÉ STRICTEMENT depuis le champ 'role' du JSON pool_employes fourni. Aucune hallucination ou synonyme n'est autorisé.")
    level: str = Field(..., description="Le niveau (level) EXACT de l'employé. Doit être COPIÉ STRICTEMENT depuis le champ 'level' du JSON pool_employes fourni pour le profil sélectionné.")
    title: str = Field(..., description="Titre court (verbe d'action) décrivant l'action technique.")
    instructions: str = Field(
        ..., 
        description=(
            "Guide d'implémentation technique détaillé pour le développeur assigné. "
            "Doit inclure : "
            "1. La stack technologique recommandée (ex: React, Laravel, AWS). "
            "2. Les étapes clés du développement (pseudocode ou logique). "
            "3. Les bonnes pratiques de sécurité ou de performance à respecter. "
            "4. Le ton doit être impératif et direct."
        )
    )
    hours: int = Field(..., description="Estimation du temps de développement en heures.")

class UserStory(BaseModel):
    """
    User Story (Niveau 2) : Fonctionnalité transverse.
    """
    id: str = Field(..., description="Identifiant unique de l'User Story (ex: US-1.1).")
    title: str = Field(..., description="Titre fonctionnel.")
    story_points: int = Field(..., description="Complexité (Fibonacci).")
    description: str = Field(..., description="Format : 'En tant que..., je veux..., afin de...'.")
    acceptance_criteria: List[str] = Field(
        ..., 
        description=(
            "Liste exhaustive et vérifiable des conditions de réussite (Definition of Done). "
            "Chaque critère doit être : "
            "1. Binaire (Pass/Fail) : Un testeur QA doit pouvoir dire oui ou non sans ambiguïté. "
            "2. Couvrir le 'Happy Path' (cas nominal) ET les 'Edge Cases' (cas d'erreur, champs vides, etc.). "
            "3. Précis sur l'UI/UX (ex: 'Le bouton devient gris après le clic'). "
            "4. Mesurable (ex: 'Temps de réponse < 200ms' au lieu de 'Rapide')."
        )
    )
    tasks: List[Task] = Field(..., description="Liste des tâches techniques assignées à des employés spécifiques.")

class Epic(BaseModel):
    """
    Epic (Niveau 1) : Fonctionnalité majeure.
    """
    id: str = Field(..., description="Identifiant unique de l'Epic.")
    title: str = Field(..., description="Titre de la fonctionnalité majeure.")
    description: str = Field(..., description="Résumé de l'objectif métier.")
    user_stories: List[UserStory] = Field(..., description="Liste des User Stories.")
    

class RapportAnalyseStaffing(BaseModel):
    """
    Final Output: Backlog with Staffing Assignment
    """
    backlog: List[Epic]
