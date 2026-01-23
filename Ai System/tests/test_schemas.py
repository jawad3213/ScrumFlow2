from schemas.staffing_schemas import ProjectFinancialPlan
from schemas.backlog_schemas import RapportAnalyseStaffing
from schemas.stackchoice_schemas import ArchitectureAnalysisResponse
import json

def test_project_financial_plan_schema():
    data = {
        "estimated_duration_months": 6,
        "selected_engineers": [
            {
                "role": "Fullstack Developer",
                "specialization": "Web",
                "level": "Senior",
                "monthly_salary_mad": 25000,
                "months_assigned": 6,
                "total_cost_mad": 150000
            }
        ],
        "licenses_and_apis": [],
        "contingency_buffer_percentage": 15,
        "total_capex": 172500,
        "cloud_subscription": [],
        "maintenance_engineers": [],
        "total_opex": 0,
        "kpis": [],
        "total_project_cost": 172500,
        "estimated_gains": [],
        "annual_opex_value": 0,
        "roi_projections": {
            "year_1": {"year_number": 1, "cumulative_costs": 172500, "cumulative_gains": 200000, "net_cash_flow": 27500, "roi_percentage": 15.9},
            "year_2": {"year_number": 2, "cumulative_costs": 172500, "cumulative_gains": 450000, "net_cash_flow": 277500, "roi_percentage": 160.8},
            "year_3": {"year_number": 3, "cumulative_costs": 172500, "cumulative_gains": 800000, "net_cash_flow": 627500, "roi_percentage": 363.7},
            "break_even_point_months": 10.2
        },
        "roi_analysis_summary": "- High profitability\n- Low operational costs"
    }
    plan = ProjectFinancialPlan(**data)
    assert plan.estimated_duration_months == 6
    assert len(plan.selected_engineers) == 1
    assert plan.roi_projections.break_even_point_months == 10.2

def test_backlog_schema():
    data = {
        "backlog": [
            {
                "id": "EP-1",
                "title": "Core",
                "description": "Desc",
                "user_stories": [
                    {
                        "id": "US-1",
                        "title": "Story",
                        "story_points": 5,
                        "description": "As a user...",
                        "acceptance_criteria": ["Check"],
                        "tasks": [
                            {
                                "id": "T-1",
                                "role": "Fullstack Developer",
                                "level": "Senior",
                                "title": "Task",
                                "instructions": "Do it",
                                "hours": 10
                            }
                        ]
                    }
                ]
            }
        ]
    }
    report = RapportAnalyseStaffing(**data)
    assert len(report.backlog) == 1
    assert report.backlog[0].user_stories[0].tasks[0].hours == 10

def test_stack_choice_schema():
    data = {
        "analysis": {
            "project_type": "SaaS",
            "complexity_score": 5,
            "scalability_need": "High",
            "primary_constraints": ["Time"],
            "key_features_summary": ["Auth"]
        },
        "primary_recommendation": {
            "strategy_name": "T3 Stack",
            "frontend": [{"name": "Next.js", "category": "Frontend", "justification": "DX", "pros": ["SSR"], "cons": ["Vercel lock"]}],
            "backend": [],
            "database": [],
            "devops_infrastructure": [],
            "architecture_pattern": "Monolith",
            "synergy_explanation": "Next.js fits everything"
        },
        "alternative_recommendation": {
            "strategy_name": "Laravel",
            "frontend": [],
            "backend": [],
            "database": [],
            "devops_infrastructure": [],
            "architecture_pattern": "Monolith",
            "synergy_explanation": "Laravel is solid"
        },
        "risk_assessment": ["Small team"],
        "junior_developer_tips": ["Start slow"]
    }
    response = ArchitectureAnalysisResponse(**data)
    assert response.analysis.project_type == "SaaS"
    assert response.primary_recommendation.strategy_name == "T3 Stack"
