import React from 'react';
import { useParams } from 'react-router-dom';

const MySpacePage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - My Space</h1>
            <p>Personal Kanban: tasks assigned specifically to you.</p>
        </div>
    );
};

export default MySpacePage;
