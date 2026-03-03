import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectProgressStepper from './ProjectProgressStepper';

describe('ProjectProgressStepper Component', () => {
    it('affiche toutes les étapes de l\'analyse', () => {
        const mockProject = {};
        render(<ProjectProgressStepper project={mockProject} />);

        expect(screen.getByText('Financial Blueprint')).toBeInTheDocument();
        expect(screen.getByText('Scrum Master Blueprint')).toBeInTheDocument();
        expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    });

    it('marque "Financial Blueprint" comme complété si roi_analysis_summary existe', () => {
        const mockProject = { roi_analysis_summary: "Done" };
        const { container } = render(<ProjectProgressStepper project={mockProject} />);

        // On cherche l'icône Check de Lucide (souvent rendue par un SVG avec la classe lucide-check)
        const checkIcon = container.querySelector('.lucide-check');
        expect(checkIcon).toBeInTheDocument();

        // Vérifie que le label est en noir (texte complété)
        const label = screen.getByText('Financial Blueprint');
        expect(label).toHaveClass('text-neutral-900');
    });

    it('marque "Scrum Master Blueprint" comme complété si des epics sont présentes', () => {
        const mockProject = { epics: [{ id: 1 }] };
        render(<ProjectProgressStepper project={mockProject} />);

        // On vérifie que le texte "2" a disparu au profit de l'icône check
        expect(screen.queryByText('2')).not.toBeInTheDocument();
        const label = screen.getByText('Scrum Master Blueprint');
        expect(label).toHaveClass('text-neutral-900');
    });

    it('affiche l\'étape en cours avec l\'animation pulse', () => {
        // Si rien n'est fait, la première étape est "Next" (en cours)
        const mockProject = {};
        const { container } = render(<ProjectProgressStepper project={mockProject} />);

        const firstStepCircle = container.querySelector('.animate-pulse');
        expect(firstStepCircle).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('marque "Technology Stack" comme complété si stack_name est présent', () => {
        const mockProject = { stack_name: 'MERN' };
        render(<ProjectProgressStepper project={mockProject} />);

        const label = screen.getByText('Technology Stack');
        expect(label).toHaveClass('text-neutral-900');
    });
});