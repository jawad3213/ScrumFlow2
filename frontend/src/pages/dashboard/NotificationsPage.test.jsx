import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationsPage from './NotificationsPage';
import { TEST_STACK_DATA } from '../../data/testStackData';
import "@testing-library/jest-dom/vitest";

vi.mock('framer-motion', () => ({
    motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('NotificationsPage Integration', () => {

    it('affiche le header et la stratégie primaire par défaut', () => {
        render(<NotificationsPage />);

        // 1. Vérifie le titre principal
        expect(screen.getByText(/Stack Strategy Ready/i)).toBeInTheDocument();

        // 2. Cible spécifiquement le TITRE de la stratégie (h3)
        // Cela évite de matcher le texte à l'intérieur de l'explication
        const strategyTitle = TEST_STACK_DATA.primary_recommendation.strategy_name;
        expect(screen.getByRole('heading', { level: 3, name: strategyTitle })).toBeInTheDocument();

        // 3. Vérifie l'explication en utilisant un sélecteur de conteneur
        // On cherche le texte spécifiquement dans le bloc italique
        const explanation = TEST_STACK_DATA.primary_recommendation.synergy_explanation;
        // On utilise une fonction de recherche plus flexible pour ignorer les guillemets ajoutés
        expect(screen.getByText((content) => content.includes(explanation.substring(0, 30)))).toBeInTheDocument();
    });

    it('affiche correctement les cartes technologiques sans conflit', () => {
        render(<NotificationsPage />);

        // 1. Cible le titre de la carte (h4) avec une fonction de matching
        // Cela permet d'ignorer les icônes à l'intérieur du h4
        const techHeading = screen.getByRole('heading', { 
            level: 4, 
            name: (content) => content.includes("Next.js") 
        });
        expect(techHeading).toBeInTheDocument();

        // 2. Cible spécifiquement le titre de la catégorie "Frontend Layer"
        // On utilise getByRole('heading') pour ne pas matcher le texte dans le paragraphe d'explication
        const categoryTitle = screen.getByRole('heading', { 
            level: 4, 
            name: /Frontend Layer/i 
        });
        expect(categoryTitle).toBeInTheDocument();
    });
    it('ouvre et ferme les sections accordéon au clic', async () => {
        render(<NotificationsPage />);
        const projectType = TEST_STACK_DATA.analysis.project_type;
        
        expect(screen.queryByText(projectType)).not.toBeInTheDocument();

        const analysisButton = screen.getByRole('button', { name: /Project Analysis/i });
        fireEvent.click(analysisButton);

        expect(screen.getByText(projectType)).toBeInTheDocument();
        
        // On vérifie le score de complexité qui est unique (ex: "7/10")
        const scoreDisplay = `${TEST_STACK_DATA.analysis.complexity_score}/10`;
        expect(screen.getByText(scoreDisplay)).toBeInTheDocument();
    });
});