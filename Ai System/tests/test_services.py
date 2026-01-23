import pytest
from unittest.mock import MagicMock, patch
from services.staffing_service import generer_plan_staffing
from services.backlog_service import analyser_cahier_des_charges_staffing
from services.stackchoice_service import generate_stack_recommendation
from schemas.staffing_schemas import ProjectFinancialPlan
from schemas.backlog_schemas import RapportAnalyseStaffing
from schemas.stackchoice_schemas import ArchitectureAnalysisResponse

@patch('instructor.from_gemini')
@patch('google.generativeai.configure')
def test_generer_plan_staffing_service(mock_configure, mock_from_gemini, sample_project_text, sample_employee_pool):
    # Mock the instructor client
    mock_client = MagicMock()
    mock_from_gemini.return_value = mock_client
    
    # Mock the return value of client.messages.create
    mock_plan = MagicMock(spec=ProjectFinancialPlan)
    mock_client.messages.create.return_value = mock_plan
    
    result = generer_plan_staffing(sample_project_text, sample_employee_pool, "fake-api-key")
    
    assert result == mock_plan
    mock_configure.assert_called_once_with(api_key="fake-api-key")
    mock_client.messages.create.assert_called_once()

@patch('instructor.from_gemini')
@patch('google.generativeai.configure')
def test_analyser_backlog_service(mock_configure, mock_from_gemini, sample_project_text, sample_employee_pool):
    mock_client = MagicMock()
    mock_from_gemini.return_value = mock_client
    
    mock_report = MagicMock(spec=RapportAnalyseStaffing)
    mock_client.messages.create.return_value = mock_report
    
    result = analyser_cahier_des_charges_staffing(
        sample_project_text, sample_employee_pool, 6, 100000, "fake-api-key"
    )
    
    assert result == mock_report
    mock_client.messages.create.assert_called_once()

@patch('instructor.from_gemini')
@patch('google.generativeai.configure')
def test_generate_stack_service(mock_configure, mock_from_gemini, sample_backlog_json):
    mock_client = MagicMock()
    mock_from_gemini.return_value = mock_client
    
    mock_stack = MagicMock(spec=ArchitectureAnalysisResponse)
    mock_client.messages.create.return_value = mock_stack
    
    result = generate_stack_recommendation(sample_backlog_json, "fake-api-key")
    
    assert result == mock_stack
    mock_client.messages.create.assert_called_once()
