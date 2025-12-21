import React from 'react';
import { useParams } from 'react-router-dom';

const SprintBoardPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - Sprint Board</h1>
            <p>Kanban: To Do, In Progress, Done.</p>
        </div>
    );
};

export default SprintBoardPage;
