/**
 * @vitest-environment jsdom
 */
/* eslint-disable no-undef */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// 1. Mock de Framer Motion (Hoisted pour éviter les erreurs d'initialisation)
const { motionMock } = vi.hoisted(() => {
    const Mock = (tag) => ({ children, ...props }) => React.createElement(tag, props, children);
    return {
        motionMock: {
            div: Mock('div'),
            tr: Mock('tr'),
            tbody: Mock('tbody'),
            table: Mock('table'),
        }
    };
});

Object.defineProperty(global, 'motion', { value: motionMock });

vi.mock('framer-motion', () => ({
    motion: motionMock,
    AnimatePresence: ({ children }) => children,
}));

// 2. Mocks des icônes et dépendances
vi.mock('lucide-react', () => ({
    Users: () => <div />, CheckCircle2: () => <div />, Search: () => <div />,
    Filter: () => <div />, Trash2: () => <div />, Plus: () => <div />,
    ChevronDown: () => <div />, Briefcase: () => <div />, DollarSign: () => <div />,
    Target: () => <div />, Layers: () => <div />,
}));

vi.mock('@/lib/axios', () => ({ default: vi.fn() }));

vi.mock('@/components/ui/LoadingAnimation', () => ({
    default: ({ message }) => <div>{message}</div>
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InternalResourcePool from './InternalResourcePool';
import client from '@/lib/axios';

describe('InternalResourcePool Component', () => {
    const mockEmployees = [
        {
            id: 'emp-1',
            specialization: { name: 'Frontend Developer', level: 'Senior', salary: '40000' }
        },
        {
            id: 'emp-2',
            specialization: { name: 'Backend Developer', level: 'Junior', salary: '30000' }
        }
    ];

    const mockOnSync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Simulation de la réponse API
        client.mockResolvedValue(mockEmployees);
    });

    it('doit charger les données et tout sélectionner par défaut', async () => {
        render(<InternalResourcePool onSync={mockOnSync} />);

        // 1. Vérifie l'appel API
        expect(client).toHaveBeenCalledWith('/employees/available');

        // 2. Attend que les données soient rendues
        await waitFor(() => {
            expect(screen.getByText('Frontend Developer')).toBeDefined();
        });

        // 3. Résolution du conflit des compteurs (Multiple elements with text "2")
        const allTwos = screen.getAllByText('2');
        
        // On cherche le compteur "Engaged" par sa classe CSS spécifique
        const engagedCount = allTwos.find(el => el.className.includes('text-brand-primary-600'));
        const poolSizeCount = allTwos.find(el => el.className.includes('text-neutral-900'));

        expect(engagedCount).toBeDefined();
        expect(poolSizeCount).toBeDefined();

        // 4. Vérifie que onSync a envoyé le pool complet au montage
        expect(mockOnSync).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ role: 'Frontend Developer', salary: 40000 }),
            expect.objectContaining({ role: 'Backend Developer', salary: 30000 })
        ]));
    });

    it('doit retirer un employé de la sélection au clic', async () => {
        render(<InternalResourcePool onSync={mockOnSync} />);

        await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeDefined());

        // Clic sur la ligne Frontend pour désélectionner
        const frontendRow = screen.getByText('Frontend Developer').closest('tr');
        fireEvent.click(frontendRow);

        // Le compteur Engaged doit passer à 1 (Le Pool Size reste à 2)
        expect(screen.getByText('1')).toBeDefined();
        
        // On vérifie que le texte "2" n'est présent qu'une seule fois maintenant (pour Pool Size)
        const allTwos = screen.queryAllByText('2');
        expect(allTwos.length).toBe(1);

        // Vérification de la synchronisation (ne contient plus que le backend)
        expect(mockOnSync).toHaveBeenLastCalledWith([
            { role: 'Backend Developer', level: 'Junior', salary: 30000 }
        ]);
    });

    it('doit afficher le message vide si aucun employé n’est retourné', async () => {
        client.mockResolvedValue([]);
        render(<InternalResourcePool onSync={mockOnSync} />);

        await waitFor(() => {
            expect(screen.getByText(/No internal resources found/i)).toBeDefined();
        });
    });
});