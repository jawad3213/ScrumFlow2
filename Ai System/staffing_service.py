
import instructor
import google.generativeai as genai
from staffing_schemas import ProjectFinancialPlan

def generer_plan_staffing(project_text: str, employee_pool: str, api_key: str) -> ProjectFinancialPlan:
    print(">>> Generation du plan de staffing et financier (Gemini)...")
    
    genai.configure(api_key=api_key)
    
    client = instructor.from_gemini(
        client=genai.GenerativeModel(model_name="gemini-2.5-flash"),
        mode=instructor.Mode.GEMINI_JSON,
    )
    
    analysis = client.messages.create(
        response_model=ProjectFinancialPlan,
        messages=[
            {
                "role": "system", 
                "content": (
                    "Tu es un Engineering Manager et Expert en Finance IT. "
                    "Analyse la description du projet fournie (Cahier des charges) et le pool d'employés pour recommander une équipe et un plan financier complet. "
                    "CRITIQUE : Tu dois utiliser UNIQUEMENT les employés présents dans le 'Pool d'Employés' fourni. Il est STRICTEMENT INTERDIT d'inventer des noms, des rôles ou des salaires qui ne sont pas dans la liste. Si aucun profil ne correspond, signale-le, mais n'invente rien."
                    "Tu dois impérativement générer :\n"
                    "1. CAPEX : Salaires de l'équipe de développement + Licences/APIs. Applique un 'contingency_buffer_percentage' (ex: 15-20%) et calcule 'total_capex' comme (Salaires + Licences) * (1 + buffer/100).\n"
                    "2. OPEX : Coûts Cloud + Equipe de maintenance.\n"
                    "3. SUCCÈS : Définis des 'kpis' (indicateurs de performance) mesurables pour le projet.\n"
                    "5. ROI : Analyse temporelle sur 3 ans (YearlyProjection) incluant les coûts et gains cumulés. CALCULE IMPÉRATIVEMENT le 'break_even_point_months' (le mois où les gains cumulés dépassent les coûts cumulés).\n"
                    "6. FORMULES : Pour chaque FinancialItem, fournis une 'formule' textuelle expliquant le calcul.\n"
                    "7. RÉSUMÉ ROI : Pour 'roi_analysis_summary', utilise des tirets (-) pour lister les points clés.\n"
                    "Utilise la devise MAD (Dirham Marocain). "
                    "Assure-toi que les calculs de ROI sont réalistes pour l'écosystème marocain."
                )
            },
            {
                "role": "user", 
                "content": f"Pool d'Employés et Spécifications : {employee_pool}\n\nLe Projet (Cahier des charges) : {project_text}"
            }
        ],
    )
    
    return analysis
