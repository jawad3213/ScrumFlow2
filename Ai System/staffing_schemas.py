from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class FinancialItem(BaseModel):
    item_name: str
    cost_mad: float
    description: str
    formule: str = Field(..., description="formule de calcul du coût par duree du projet et pou les benifices en termes d'une seule année")

class AssignedEngineer(BaseModel):
    role: str
    specialization: str
    level: str
    monthly_salary_mad: float
    months_assigned: float
    total_cost_mad: float = Field(..., description="Calculé par monthly_salary * months_assigned")


class SuccessMetric(BaseModel):
    metric_name: str = Field(..., description="e.g., 'Adoption Rate', 'Accuracy Improvement'")
    target_value: str = Field(..., description="e.g., '80%', '20 hours/week'")
    measurement_method: str = Field(..., description="Comment cette donnée sera collectée")


class YearlyProjection(BaseModel):
    year_number: int = Field(..., ge=1, le=3)
    cumulative_costs: float = Field(..., description="Total CAPEX + (OPEX annuel * année_n)")
    cumulative_gains: float = Field(..., description="Somme des gains accumulés jusqu'à cette année")
    net_cash_flow: float = Field(..., description="Gains cumulés - Coûts cumulés")
    roi_percentage: float = Field(..., description="Calculé comme: (Net Cash Flow / Coûts cumulés) * 100")

class ROIForecast(BaseModel):
    year_1: YearlyProjection
    year_2: YearlyProjection
    year_3: YearlyProjection
    break_even_point_months: float = Field(..., description="Estimation du mois où le projet devient rentable")

class ProjectFinancialPlan(BaseModel): 
    estimated_duration_months: float = Field(..., description="Temps total pour compléter le projet")
    
    # CAPEX (Capital Expenditure)
    selected_engineers: List[AssignedEngineer] = Field(..., description="Équipe de développement choisie")
    licenses_and_apis: List[FinancialItem] = Field(..., description="Licences et APIs nécessaires (ex: OpenAI, Azure)")
    contingency_buffer_percentage: float = Field(15.0, description="Pourcentage de réserve pour imprévus (recommandé 15-20%)")
    total_capex: float = Field(0, description="Somme (salaires + licences) * (1 + contingency_buffer/100)")

    # OPEX (Operating Expenditure)
    cloud_subscription: List[FinancialItem] = Field(..., description="Abonnements Cloud")
    maintenance_engineers: List[AssignedEngineer] = Field(..., description="Support après déploiement")
    total_opex: float = Field(0, description="Somme maintenance + cloud")

    # Roadmap & Success

    kpis: List[SuccessMetric] = Field(..., description="Indicateurs de performance non-financiers")


    # Final Totals & Analysis
    total_project_cost: float = Field(..., description="Somme de CAPEX + OPEX pour la première année")
    estimated_gains: List[FinancialItem] = Field(..., description="Gains financiers annuels prévus")
    annual_opex_value: float = Field(..., description="Coût de maintenance et cloud pour 12 mois")
    
    roi_projections: ROIForecast = Field(..., description="Détail du ROI sur un horizon de 3 ans")
    roi_analysis_summary: str = Field(..., description="Analyse qualitative de la rentabilité. Utilise impérativement des tirets (-) pour lister les points clés pour une meilleure lisibilité en retournant au ligne apres chaque point.")
