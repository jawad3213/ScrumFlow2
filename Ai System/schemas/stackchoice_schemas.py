from pydantic import BaseModel, Field
from typing import List, Optional, Literal

# --- 1. Basic Building Blocks ---

class TechChoice(BaseModel):
    """Represents a specific technology selection with justification."""
    name: str = Field(..., description="Name of the technology (e.g., 'Next.js', 'PostgreSQL', 'Docker').")
    category: Literal['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Tooling'] = Field(..., description="The category this tool belongs to.")
    justification: str = Field(..., description="Specific reason why this tool fits THIS project's requirements.")
    pros: List[str] = Field(..., description="Key benefits for this specific use case.")
    cons: List[str] = Field(..., description="Potential downsides or trade-offs to be aware of.")

# --- 2. The Analysis Layer ---

class ProjectDimensions(BaseModel):
    """AI's analysis of the project scope and constraints based on the requirements file."""
    project_type: Literal['MVP', 'Enterprise', 'SaaS', 'E-commerce', 'Internal Tool', 'Mobile App', 'Other']
    complexity_score: int = Field(..., description="Estimated complexity from 1 (Simple) to 10 (Very Complex).", ge=1, le=10)
    scalability_need: Literal['Low', 'Medium', 'High', 'Extreme']
    primary_constraints: List[str] = Field(..., description="Identified constraints (e.g., 'Low budget', 'Fast time-to-market', 'High security').")
    key_features_summary: List[str] = Field(..., description="A distilled list of the critical features extracted from the text.")

# --- 3. The Architecture Layer ---

class FullStackRecommendation(BaseModel):
    """A complete technology stack strategy."""
    strategy_name: str = Field(..., description="A creative name for this stack (e.g., 'The Rapid MVP Stack', 'The Enterprise Scalability Stack').")
    frontend: List[TechChoice]
    backend: List[TechChoice]
    database: List[TechChoice]
    devops_infrastructure: List[TechChoice]
    architecture_pattern: Literal['Monolith', 'Microservices', 'Serverless', 'Event-Driven', 'Modular Monolith'] = Field(..., description="The recommended architectural pattern.")
    
    # The "Why" for the whole combination
    synergy_explanation: str = Field(..., description="Explain why these specific tools work well TOGETHER (e.g., 'Next.js and Vercel provide zero-config CI/CD').")

# --- 4. The Root Model (Pass this to Gemini) ---

class ArchitectureAnalysisResponse(BaseModel):
    """The root response object for the Gemini interaction."""
    analysis: ProjectDimensions
    primary_recommendation: FullStackRecommendation = Field(..., description="The best recommended stack for the project.")
    alternative_recommendation: FullStackRecommendation = Field(..., description="A viable alternative stack (e.g., simpler or more scalable) for comparison.")
    
    risk_assessment: List[str] = Field(..., description="Potential technical risks or bottlenecks based on the requirements.")
    junior_developer_tips: List[str] = Field(..., description="Specific advice for a junior developer implementing this specific stack.")