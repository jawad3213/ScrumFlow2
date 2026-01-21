import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { columns } from './columns';

// Mock de BASE_URL pour éviter les erreurs d'import
vi.mock('@/utils/api', () => ({
    BASE_URL: 'http://localhost:8000'
}));

describe('Team Columns Definition', () => {
    // Helper pour simuler le rendu d'une cellule spécifique
    const renderCell = (columnId, rowData) => {
        const column = columns.find(col => col.id === columnId || col.accessorKey === columnId);
        const row = {
            original: rowData,
            getValue: (id) => {
                if (column.accessorFn) return column.accessorFn(rowData);
                return rowData[id];
            }
        };
        // Simulation sommaire de l'objet table pour les actions/checkbox
        const table = { options: { meta: { onEdit: vi.fn(), onDelete: vi.fn() } } };
        
        return render(column.cell({ row, table }));
    };

    it('doit combiner le prénom et le nom dans la colonne Employee', () => {
        const mockMember = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            avatar: null
        };

        renderCell('name', mockMember);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('doit afficher les initiales quand aucun avatar n est présent', () => {
        const mockMember = {
            first_name: 'Alice',
            last_name: 'Smith',
            avatar: null
        };

        renderCell('name', mockMember);

        const initials = screen.getByText('AS');
        expect(initials).toBeInTheDocument();
        
        // On remonte au conteneur direct des initiales qui a les classes de style
        const circleContainer = initials.closest('div');
        expect(circleContainer).toHaveClass('rounded-full');
        expect(circleContainer).toHaveClass('border');
    });

    it('doit afficher l image de l avatar quand elle est fournie', () => {
        const mockMember = {
            first_name: 'John',
            avatar: 'avatars/john.jpg'
        };

        renderCell('name', mockMember);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'http://localhost:8000/storage/avatars/john.jpg');
    });

    it('doit afficher le badge correct pour le niveau Senior', () => {
        const mockMember = {
            specialization: { level: 'Senior' }
        };

        renderCell('level', mockMember);

        const badge = screen.getByText('Senior');
        expect(badge).toBeInTheDocument();
        // Vérifie la couleur violette spécifique au Senior dans votre code
        expect(badge).toHaveClass('bg-purple-100');
    });

    it('doit afficher "Available" quand is_engaged est faux', () => {
        const mockMember = { is_engaged: false };

        renderCell('is_engaged', mockMember);

        // Utilisation d'une regex /i pour ignorer la casse (Available vs AVAILABLE)
        expect(screen.getByText(/Available/i)).toBeInTheDocument();
        
        // Vérifie la couleur grise (neutral) pour l'état disponible
        const statusBadge = screen.getByText(/Available/i).closest('div');
        expect(statusBadge).toHaveClass('bg-neutral-50');
    });
});