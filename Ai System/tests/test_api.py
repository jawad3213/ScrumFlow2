import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock
import json
import io

client = TestClient(app)

@patch('main.generer_plan_staffing')
def test_analyze_staffing_endpoint(mock_service, sample_employee_pool):
    # Mock service return
    mock_result = MagicMock()
    mock_result.model_dump.return_value = {"status": "success", "data": "mocked"}
    mock_service.return_value = mock_result
    
    # Create a dummy PDF file
    pdf_content = b"%PDF-1.4 dummy content"
    files = {'file': ('test.pdf', io.BytesIO(pdf_content), 'application/pdf')}
    data = {
        'pool_employes': sample_employee_pool,
        'api_key': 'fake-key'
    }
    
    # We need to mock 'fitz.open' as well because it's called in the endpoint to extract text
    with patch('fitz.open') as mock_fitz:
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_page.get_text.return_value = "Extracted project text"
        mock_doc.__iter__.return_value = [mock_page]
        mock_fitz.return_value = mock_doc
        
        response = client.post("/analyze-staffing", files=files, data=data)
    
    assert response.status_code == 200
    assert response.json() == {"status": "success", "data": "mocked"}
    mock_service.assert_called_once()

@patch('main.analyser_cahier_des_charges_staffing')
def test_analyze_backlog_endpoint(mock_service, sample_employee_pool):
    mock_result = MagicMock()
    mock_result.model_dump.return_value = {"backlog": "mocked"}
    mock_service.return_value = mock_result
    
    pdf_content = b"%PDF-1.4 dummy content"
    files = {'file': ('test.pdf', io.BytesIO(pdf_content), 'application/pdf')}
    data = {
        'pool_employes': sample_employee_pool,
        'dev_duration_months': 6,
        'total_budget': 100000,
        'api_key': 'fake-key'
    }
    
    with patch('fitz.open') as mock_fitz:
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_page.get_text.return_value = "Extracted backlog requirement"
        mock_doc.__iter__.return_value = [mock_page]
        mock_fitz.return_value = mock_doc
        
        response = client.post("/analyze-backlog", files=files, data=data)
    
    assert response.status_code == 200
    assert response.json() == {"backlog": "mocked"}

@patch('main.generate_stack_recommendation')
def test_analyze_stack_endpoint(mock_service, sample_backlog_json):
    mock_result = MagicMock()
    mock_result.model_dump.return_value = {"recommendations": "mocked"}
    mock_service.return_value = mock_result
    
    # Backlog as a JSON file
    backlog_file = io.BytesIO(sample_backlog_json.encode('utf-8'))
    files = {'file': ('backlog.json', backlog_file, 'application/json')}
    data = {
        'api_key': 'fake-key'
    }
    
    response = client.post("/analyze-stack", files=files, data=data)
    
    assert response.status_code == 200
    assert response.json() == {"recommendations": "mocked"}

def test_analyze_staffing_no_api_key():
    files = {'file': ('test.pdf', io.BytesIO(b"content"), 'application/pdf')}
    data = {'pool_employes': '[]', 'api_key': ''}
    response = client.post("/analyze-staffing", files=files, data=data)
    assert response.status_code == 400
    assert "API Key is required" in response.json()['detail']
