/**
 * @vitest-environment jsdom
 */
/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// 1. Utilisation de vi.hoisted pour préparer le terrain sans erreurs
const { motionMock } = vi.hoisted(() => {
    // On définit explicitement les tags pour que le DOM soit correct (tr, table, etc.)
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

// Injection propre dans le global
Object.defineProperty(global, 'motion', { value: motionMock });

vi.mock('framer-motion', () => ({
    motion: motionMock,
    AnimatePresence: ({ children }) => children,
}));

// 2. Mocks des autres dépendances
vi.mock('lucide-react', () => ({
    Users: () => <div />, CheckCircle2: () => <div />, DollarSign: () => <div />,
    Target: () => <div />, Layers: () => <div />, User: () => <div />,
}));

vi.mock('@/lib/axios', () => ({ default: vi.fn() }));

vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => <div>{message}</div>
}));

// 3. Imports après les mocks pour éviter les conflits
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicResourcePool from './DynamicResourcePool';
import client from '@/lib/axios';

describe('DynamicResourcePool Component', () => {
    const mockEmployees = [
        {
            id: 1,
            first_name: 'Karim',
            last_name: 'Alami',
            specialization: { name: 'React Dev', level: 'Senior', salary: '45000' }
        }
    ];

    const mockOnSync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // On simule une promesse résolue pour Axios
        client.mockResolvedValue(mockEmployees);
    });

    it('doit synchroniser les données quand on sélectionne un employé', async () => {
        render(<DynamicResourcePool onSync={mockOnSync} />);

        // findByText attend que l'élément apparaisse (gère l'asynchrone de l'API)
        const nameElement = await screen.findByText(/Karim Alami/i);
        const row = nameElement.closest('tr');
        
        if (row) {
            fireEvent.click(row);
        }

        expect(mockOnSync).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                role: 'React Dev',
                salary: 45000
            })
        ]));
    });
});