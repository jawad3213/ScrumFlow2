import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Plus fiable que fireEvent
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { DataTable } from './DataTable';

describe('DataTable Component', () => {
    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'role',
            header: 'Role',
        },
    ];

    const data = [
        { id: 1, name: 'Alice Johnson', role: 'Developer' },
        { id: 2, name: 'Bob Smith', role: 'Designer' },
    ];

    it('renders the table headers and data correctly', () => {
        render(<DataTable columns={columns} data={data} />);

        // Vérification des headers
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();

        // Vérification des données
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    it('shows the empty state when no data is provided', () => {
        render(<DataTable columns={columns} data={[]} />);

        // Vérifie que le composant EmptyState (ou le texte par défaut) est affiché
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
        expect(screen.getByText(/Try adjusting your filters/i)).toBeInTheDocument();
    });

    it('displays the correct number of selected rows', () => {
        // Pour tester la sélection, il faut généralement avoir des colonnes de checkbox
        // Mais on peut déjà vérifier le texte du résumé de pagination
        render(<DataTable columns={columns} data={data} />);
        
        expect(screen.getByText(/0/)).toBeInTheDocument(); // 0 selected
        expect(screen.getByText(/2/)).toBeInTheDocument(); // of 2 employee(s)
    });

    it('handles pagination button states', () => {
        render(<DataTable columns={columns} data={data} />);
        
        const prevButton = screen.getAllByRole('button').find(btn => 
            btn.querySelector('.lucide-chevron-left')
        );
        const nextButton = screen.getAllByRole('button').find(btn => 
            btn.querySelector('.lucide-chevron-right')
        );

        // Avec seulement 2 lignes, il n'y a probablement qu'une page
        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('calls onSelectionChange when rows are selected', async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();
        
        const columnsWithSelect = [
            {
                id: 'select',
                header: ({ table }) => (
                    <input 
                        type="checkbox" 
                        aria-label="select-all"
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <input 
                        type="checkbox" 
                        aria-label={`select-row-${row.id}`}
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
            },
            { accessorKey: 'name', header: 'Name' }
        ];

        render(<DataTable columns={columnsWithSelect} data={data} onSelectionChange={onSelectionChange} />);

        // On récupère la checkbox
        const checkbox = screen.getByLabelText('select-row-1');
        
        // On simule un vrai clic utilisateur
        await user.click(checkbox);

        // On attend que le mock soit appelé au moins une fois
        await waitFor(() => {
            expect(onSelectionChange).toHaveBeenCalled();
        }, { timeout: 1000 });

        // Vérification du contenu du premier appel
        const callArgs = onSelectionChange.mock.calls[onSelectionChange.mock.calls.length - 1][0];
        expect(callArgs.length).toBe(1);
    });
});