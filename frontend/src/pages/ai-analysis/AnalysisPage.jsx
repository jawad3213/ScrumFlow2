import React from 'react';
import { useParams } from 'react-router-dom';

const AnalysisPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - AI Analysis</h1>
            <p>Configure IA, re-upload PDF, adjust estimations.</p>
        </div>
    );
};

export default AnalysisPage;
