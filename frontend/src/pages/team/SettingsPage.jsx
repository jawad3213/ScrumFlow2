import React from 'react';
import { useParams } from 'react-router-dom';

const SettingsPage = () => {
    const { id } = useParams();
    return (
        <div className="page-container">
            <h1>Project {id} - Settings</h1>
            <p>Name, sprint dates, archiving.</p>
        </div>
    );
};

export default SettingsPage;
