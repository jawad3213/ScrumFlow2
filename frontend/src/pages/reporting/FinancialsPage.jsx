import React from 'react';
import { useParams } from 'react-router-dom';

const FinancialsPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - Financial Reports</h1>
            <p>Budget tracking vs IA predictions.</p>
        </div>
    );
};

export default FinancialsPage;
