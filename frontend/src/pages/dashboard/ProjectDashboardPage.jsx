import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDashboardPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - Dashboard</h1>
            <p>Project overview, progress, and burndown chart.</p>
        </div>
    );
};

export default ProjectDashboardPage;
