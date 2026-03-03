import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectCard from './ProjectCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('ProjectCard Component', () => {
    const mockProject = {
        id: 1,
        name: 'ScrumFlow AI',
        chef: 'Super Chef',
        cost: 563600,
        roi: 74.81,
        has_strategic: true,
        has_technical: true,
        has_stack: true,
        steps: [
            {
                title: 'Vues Alternatives',
                stories: ['Vue Liste des Tâches', 'Vue Calendrier']
            }
        ]
    };

    it('renders project name correctly', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('ScrumFlow AI')).toBeInTheDocument();
    });

    it('displays roadmap and progress section labels', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('Financial Roadmap Preview')).toBeInTheDocument();
        expect(screen.getByText('Execution Progress')).toBeInTheDocument();
    });

    it('displays financial metrics correctly', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('Budget')).toBeInTheDocument();
        expect(screen.getByText('ROI Potential')).toBeInTheDocument();
        expect(screen.getByText('74.81%')).toBeInTheDocument();
    });

    it('renders progress correctly based on phases', () => {
        const incompleteProject = {
            ...mockProject,
            has_strategic: true,
            has_technical: false,
            has_stack: false
        };

        render(
            <MemoryRouter>
                <ProjectCard project={incompleteProject} />
            </MemoryRouter>
        );

        // One out of three phases is complete => 33% progress
        expect(screen.getByText('33%')).toBeInTheDocument();
    });
});
