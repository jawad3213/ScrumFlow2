import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [currentProject, setCurrentProject] = useState('global');
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const projectMatch = path.match(/\/project\/([^/]+)/);
        if (projectMatch && projectMatch[1]) {
            setCurrentProject(projectMatch[1]);
        } else if (!path.includes('/project/')) {
            setCurrentProject('global');
        }
    }, [location]);

    return (
        <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
            {children}
        </ProjectContext.Provider>
    );
};


