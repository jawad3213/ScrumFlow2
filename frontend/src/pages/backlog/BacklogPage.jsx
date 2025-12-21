import React from 'react';
import { useParams } from 'react-router-dom';

const BacklogPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - Backlog</h1>
            <p>List of User Stories (Editable for Manager, Read-only for Employee).</p>
        </div>
    );
};

export default BacklogPage;
