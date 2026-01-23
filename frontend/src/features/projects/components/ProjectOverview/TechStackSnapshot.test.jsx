import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechStackSnapshot from './TechStackSnapshot';

describe('TechStackSnapshot Component', () => {
    const mockProjectWithData = {
        stack_name: 'MERN Stack',
        stack_analysis_data: {
            primary_recommendation: {
                frontend: ['React', 'Tailwind'],
                backend: ['Node.js'],
                database: ['MongoDB'],
                devops: ['Docker']
            }
        }
    };

    it('affiche le nom de la stack et les badges technologiques', () => {
        render(<TechStackSnapshot project={mockProjectWithData} />);
        
        expect(screen.getByText('MERN Stack')).toBeInTheDocument();
        
        // On cherche le texte tel qu'il est dans la donnée (React), pas en majuscules
        // L'option { exact: false } ou une RegEx /react/i est plus robuste
        expect(screen.getByText(/React/i)).toBeInTheDocument();
        expect(screen.getByText(/Node\.js/i)).toBeInTheDocument();
        expect(screen.getByText(/MongoDB/i)).toBeInTheDocument();
    });

    it('gère les listes de technologies mixtes (objets et strings)', () => {
        const mixedProject = {
            stack_analysis_data: {
                primary_recommendation: {
                    frontend: [{ name: 'Vue' }, 'Svelte']
                }
            }
        };
        render(<TechStackSnapshot project={mixedProject} />);
        
        expect(screen.getByText(/Vue/i)).toBeInTheDocument();
        expect(screen.getByText(/Svelte/i)).toBeInTheDocument();
    });

    it('limite l\'affichage selon les quotas définis (slice)', () => {
        const overcrowdedProject = {
            stack_analysis_data: {
                primary_recommendation: {
                    frontend: ['T1', 'T2', 'T3', 'T4']
                }
            }
        };
        render(<TechStackSnapshot project={overcrowdedProject} />);
        
        expect(screen.getByText('T1')).toBeInTheDocument();
        expect(screen.getByText('T2')).toBeInTheDocument();
        expect(screen.getByText('T3')).toBeInTheDocument();
        // T4 ne doit pas être là (slice(0,3))
        expect(screen.queryByText('T4')).not.toBeInTheDocument();
    });
});