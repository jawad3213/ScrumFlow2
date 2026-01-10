import instructor
import google.generativeai as genai
from backlog_schemas import RapportAnalyseStaffing

def analyser_cahier_des_charges_staffing(
    text_content: str, 
    employee_pool: str, 
    dev_duration_months: float,
    total_budget: float,
    api_key: str
) -> RapportAnalyseStaffing:
    print("⏳ Analyse du Backlog avec Staffing (Gemini)...")
    
    genai.configure(api_key=api_key)
    
    # Configuration du client Instructor avec Gemini
    client = instructor.from_gemini(
        client=genai.GenerativeModel(model_name="gemini-2.0-flash-exp"),
        mode=instructor.Mode.GEMINI_JSON,
    )
    
    analysis = client.messages.create(
        response_model=RapportAnalyseStaffing,
        messages=[
            {
                "role": "system", 
                "content": (
                    "Tu es un Lead Tech et Project Manager expert. "
                    "Ton objectif est de transformer un cahier des charges (PDF) en un Backlog Scrum détaillé, "
                    "ET d'assigner immédiatement chaque tâche à un profil technique spécifique disponible dans le pool fourni.\n\n"
                    
                    "RÈGLES D'ASSIGNATION STRICTES (CHAMP 'TASK'):\n"
                    "1. 'role' : Doit être COPIÉ STRICTEMENT (copier-coller) depuis le champ 'role' du JSON 'pool_employes'. Interdiction d'inventer ou de traduire.\n"
                    "2. 'level' : Doit être COPIÉ STRICTEMENT depuis le champ 'level' du JSON 'pool_employes' pour le rôle choisi.\n"
                    "3. 'instructions' : Rédige des directives techniques précises (stack, algo, sécu) pour le développeur.\n"
                    "4. 'hours' : Estime le temps de manière réaliste.\n\n"
                    
                    "CONTRAINTES GLOBALES :\n"
                    f"- Durée max du projet : {dev_duration_months} mois.\n"
                    f"- Budget max : {total_budget} MAD.\n"
                    "- Assure-toi que la somme des heures et des coûts reste dans ces limites.\n\n"
                    
                    "STRUCTURE ATTENDUE :\n"
                    "- Epics -> User Stories -> Tasks (avec assignation précise)."
                )
            },
            {
                "role": "user", 
                "content": (
                    f"CONTRAINTES PROJET :\n- Durée Max: {dev_duration_months} mois\n- Budget Max: {total_budget} MAD\n\n"
                    f"POOL EMPLOYÉS DISPONIBLE (Source unique pour 'role' et 'level') :\n{employee_pool}\n\n"
                    f"CONTENU DU CAHIER DES CHARGES :\n{text_content}"
                )
            }
        ],
    )
    
    return analysis
