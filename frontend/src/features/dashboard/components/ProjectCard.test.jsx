import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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

    it('renders project name and chef correctly', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('ScrumFlow AI')).toBeInTheDocument();
        expect(screen.getByText('Super Chef')).toBeInTheDocument();
    });

    it('displays analysis progress stepper', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('Analysis Progress')).toBeInTheDocument();
        expect(screen.getByText('Strategic')).toBeInTheDocument();
        expect(screen.getByText('Technical')).toBeInTheDocument();
        expect(screen.getByText('Stack')).toBeInTheDocument();
    });

    it('displays financial metrics correctly', () => {
        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        expect(screen.getByText('Project Cost')).toBeInTheDocument();
        expect(screen.getByText('Proj. ROI')).toBeInTheDocument();
        expect(screen.getByText('74.81%')).toBeInTheDocument();
    });

    it('displays project steps when expanded', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProjectCard project={mockProject} />
            </MemoryRouter>
        );

        const expandButton = screen.getByText('Project Steps');
        await user.click(expandButton);

        expect(screen.getByText('Vues Alternatives')).toBeInTheDocument();
    });

    it('renders incomplete analysis stages correctly', () => {
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

        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});
