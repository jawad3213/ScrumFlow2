import pytest
import json

@pytest.fixture
def sample_employee_pool():
    return json.dumps([
        {"id": 1, "first_name": "Hajar", "last_name": "El", "email": "hajar@example.com", "role": "Fullstack Developer", "level": "Senior", "salary": 25000},
        {"id": 2, "first_name": "Anas", "last_name": "Ben", "email": "anas@example.com", "role": "Frontend Developer", "level": "Junior", "salary": 12000},
        {"id": 3, "first_name": "Sara", "last_name": "Idrissi", "email": "sara@example.com", "role": "QA Tester", "level": "Intermediate", "salary": 15000}
    ])

@pytest.fixture
def sample_project_text():
    return "Nous avons besoin d'une plateforme SaaS pour la gestion des tâches avec un frontend React et un backend Laravel. Le projet doit être sécurisé et scalable."

@pytest.fixture
def sample_backlog_json():
    return json.dumps({
        "backlog": [
            {
                "id": "EP-1",
                "title": "Auth System",
                "description": "User authentication",
                "user_stories": [
                    {
                        "id": "US-1.1",
                        "title": "Login",
                        "story_points": 3,
                        "description": "As a user, I want to login",
                        "acceptance_criteria": ["Valid credentials allow entry"],
                        "tasks": [
                            {
                                "id": "T-1.1.1",
                                "role": "Fullstack Developer",
                                "level": "Senior",
                                "title": "Setup JWT",
                                "instructions": "Use standard JWT library",
                                "hours": 8
                            }
                        ]
                    }
                ]
            }
        ]
    })
