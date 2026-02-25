import { vi, expect, it, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamPage from './TeamPage';

// --- MOCKS DES HOOKS API ---
vi.mock('@/features/team/api/useEmployeesQuery', () => ({
    useEmployees: vi.fn(),
}));
vi.mock('@/features/team/api/useSpecializationsQuery', () => ({
    useSpecializations: vi.fn(),
}));

import { useEmployees } from '@/features/team/api/useEmployeesQuery';
import { useSpecializations } from '@/features/team/api/useSpecializationsQuery';

// --- MOCKS DES COMPOSANTS ENFANTS ---
vi.mock('@/features/team/components/TeamTable', () => ({
    default: React.forwardRef(({ data, onSelectionChange }, ref) => {
        React.useImperativeHandle(ref, () => ({ triggerBulkDelete: vi.fn() }));
        return (
            <div data-testid="team-table">
                Employees: {data.length}
                <button onClick={() => onSelectionChange([{ id: 1 }])}>Select Item</button>
            </div>
        );
    }),
}));

vi.mock('@/features/team/components/SpecializationTable', () => ({
    default: React.forwardRef(({ data }, ref) => (
        <div data-testid="spec-table">Specializations: {data.length}</div>
    )),
}));

vi.mock('@/features/team/components/AddEmployeeModal', () => ({
    default: () => <button>Add Employee Button</button>,
}));

vi.mock('@/features/team/components/AddSpecializationModal', () => ({
    default: () => <button>Add Specialization Button</button>,
}));

vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => <div>{message}</div>,
}));

describe('TeamPage Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup par défaut
        useEmployees.mockReturnValue({ data: [], isLoading: false, refetch: vi.fn() });
        useSpecializations.mockReturnValue({ data: [], isLoading: false, refetch: vi.fn() });
    });

    it('doit afficher l\'état de chargement initial', () => {
        useEmployees.mockReturnValue({ isLoading: true });
        useSpecializations.mockReturnValue({ isLoading: true });
        
        render(<TeamPage />);
        expect(screen.getByText(/Setting up your team view/i)).toBeInTheDocument();
    });

    it('doit afficher la table des employés par défaut', () => {
        useEmployees.mockReturnValue({ data: [{ id: 1 }], isLoading: false });
        
        render(<TeamPage />);
        expect(screen.getByTestId('team-table')).toHaveTextContent('Employees: 1');
        expect(screen.getByText('Add Employee Button')).toBeInTheDocument();
    });

    it('doit basculer entre les onglets Employees et Specializations', async () => {
        useSpecializations.mockReturnValue({ 
            data: [{ id: 10 }], 
            isLoading: false 
        });

        render(<TeamPage />);

        // Clic sur l'onglet Specializations
        const specTabTrigger = screen.getByRole('tab', { name: /Specializations/i });
        await user.click(specTabTrigger);

        // Attente de la mise à jour du DOM par Radix
        await waitFor(() => {
            expect(screen.getByTestId('spec-table')).toBeInTheDocument();
        });

        expect(screen.getByText('Specializations: 1')).toBeInTheDocument();
        expect(screen.getByText('Add Specialization Button')).toBeInTheDocument();
    });

    it('doit afficher la barre de suppression lors de la sélection d\'un employé', async () => {
        useEmployees.mockReturnValue({ data: [{ id: 1 }], isLoading: false });

        render(<TeamPage />);

        // Simuler la sélection
        const selectBtn = screen.getByText('Select Item');
        await user.click(selectBtn);

        expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete Selected/i })).toBeInTheDocument();
    });
});