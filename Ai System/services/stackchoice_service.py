import instructor
import google.generativeai as genai
from schemas.stackchoice_schemas import ArchitectureAnalysisResponse

def generate_stack_recommendation(backlog_json: str, api_key: str) -> ArchitectureAnalysisResponse:
    """
    Analyzes the project backlog (JSON content) and returns a structured
    ArchitectureAnalysisResponse containing stack recommendations.
    """
    print(">>> Generating Tech Stack Recommendation (Gemini)...")

    genai.configure(api_key=api_key)

    client = instructor.from_gemini(
        client=genai.GenerativeModel(model_name="gemini-2.5-flash"),
        mode=instructor.Mode.GEMINI_JSON,
    )

    system_prompt = """
### ROLE
Act as a pragmatic, highly experienced Senior Software Architect and CTO. Your goal is to analyze project requirements and design a robust, scalable, and maintainable technology stack. You value simplicity and developer experience (DX) but never compromise on security or core performance.

### ANALYSIS INSTRUCTIONS
Before selecting any tools, perform a deep mental analysis of the input backlog:
1.  **Identify the Core Domain:** Is this a data-heavy app? A real-time chat? An AI wrapper? A CRUD system?
2.  **Detect Hidden Constraints:** Look for clues about budget, team size (assume a small, agile team or solo developer unless stated otherwise), and deployment environment.
3.  **Assess Complexity:** Does the project *really* need Microservices, or is a Modular Monolith sufficient? Be critical.

### SELECTION GUIDELINES
When filling out the JSON schema, adhere to these principles:

1.  **The "Primary Recommendation" (The Sweet Spot):**
    * Choose the stack that balances *speed of development* with *future scalability*.
    * Prioritize technologies with excellent documentation and large ecosystems (e.g., if Python is needed for AI, suggest FastAPI/Django; if it's a standard web app, consider Next.js/Laravel based on the problem fit).
    * **Synergy is key:** Explain *why* the frontend plays nicely with the backend (e.g., "T3 Stack" or "Inertia.js with Laravel").

2.  **The "Alternative Recommendation" (The Contrast):**
    * If the Primary is "Speed," make the Alternative "Performance/Scale" (e.g., Rust/Go).
    * If the Primary is "Safe," make the Alternative "Cutting Edge."
    * Provide a genuine choice for the user.
"""

    # We inject the requirements text into the user message
    user_content = f"""
### INPUT DATA (Project Backlog)
Here is the structured project backlog provided by the user in JSON format. Use this to infer technical requirements and complexity.
---
{backlog_json}
---

### OUTPUT FORMAT
You must strictly output the response in the JSON structure defined by the `ArchitectureAnalysisResponse` schema.
"""

    analysis = client.messages.create(
        response_model=ArchitectureAnalysisResponse,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
    )

    return analysis
