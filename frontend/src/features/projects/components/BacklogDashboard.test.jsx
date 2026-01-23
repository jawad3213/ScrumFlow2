import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BacklogDashboard from './BacklogDashboard';

// Mock du composant MagicCard s'il utilise des props complexes ou Framer Motion
vi.mock('@/components/ui/magic-card', () => ({
    MagicCard: ({ children, className }) => <div className={className}>{children}</div>,
}));

const mockData = {
    backlog: [
        {
            id: 'epic-1',
            title: 'Epic Title 1',
            description: 'Epic Description 1',
            external_id: 'E-101',
            user_stories: [
                {
                    id: 'us-1',
                    title: 'Story Title 1',
                    description: 'Story Description 1',
                    story_points: 5,
                    acceptance_criteria: ['AC 1', 'AC 2'],
                    tasks: [
                        {
                            id: 't-1',
                            title: 'Task Title 1',
                            role: 'Frontend',
                            hours: 4,
                            instructions: 'Code with `React`'
                        }
                    ]
                }
            ]
        }
    ]
};

describe('BacklogDashboard Component', () => {
    
    it('affiche un message d\'état vide quand il n\'y a pas de données', () => {
        render(<BacklogDashboard data={null} />);
        expect(screen.getByText(/No backlog data available/i)).toBeInTheDocument();
    });

    it('affiche les titres des Épiques au chargement', () => {
        render(<BacklogDashboard data={mockData} />);
        expect(screen.getByText('Epic Title 1')).toBeInTheDocument();
        expect(screen.getByText('E-101')).toBeInTheDocument();
    });

    it('déplie l\'Épique et affiche la User Story lors du clic', async () => {
        render(<BacklogDashboard data={mockData} />);
        
        const epicHeader = screen.getByText('Epic Title 1');
        fireEvent.click(epicHeader);

        // Vérifie que la story est maintenant visible
        expect(screen.getByText('Story Title 1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Story points
    });

    it('déplie une User Story pour afficher les critères d\'acceptation et les tâches', () => {
        render(<BacklogDashboard data={mockData} />);
        
        // 1. Ouvrir l'épique
        fireEvent.click(screen.getByText('Epic Title 1'));
        
        // 2. Ouvrir la story
        fireEvent.click(screen.getByText('Story Title 1'));

        // 3. Vérifier les critères d'acceptation
        expect(screen.getByText('Acceptance Criteria')).toBeInTheDocument();
        expect(screen.getByText('AC 1')).toBeInTheDocument();

        // 4. Vérifier les détails de la tâche technique
        expect(screen.getByText('Technical Tasks')).toBeInTheDocument();
        expect(screen.getByText('Task Title 1')).toBeInTheDocument();
        expect(screen.getByText('4h')).toBeInTheDocument();
    });

    it('formate correctement les instructions avec des balises code (backticks)', () => {
        render(<BacklogDashboard data={mockData} />);
        
        fireEvent.click(screen.getByText('Epic Title 1'));
        fireEvent.click(screen.getByText('Story Title 1'));

        // Vérifie que le mot "React" (entre backticks dans le mock) est rendu
        const codeElement = screen.getByText('React');
        expect(codeElement.tagName).toBe('SPAN');
        expect(codeElement.className).toContain('font-black');
    });

    it('ne propage pas le clic des tâches techniques vers la story', () => {
        render(<BacklogDashboard data={mockData} />);
        
        fireEvent.click(screen.getByText('Epic Title 1'));
        fireEvent.click(screen.getByText('Story Title 1'));

        const taskElement = screen.getByText('Task Title 1');
        
        // Cliquer sur la tâche ne devrait pas déclencher le toggle de la story (via stopPropagation)
        fireEvent.click(taskElement);
        
        // La story devrait toujours être dépliée (les critères d'acceptation sont toujours là)
        expect(screen.getByText('AC 1')).toBeInTheDocument();
    });
});