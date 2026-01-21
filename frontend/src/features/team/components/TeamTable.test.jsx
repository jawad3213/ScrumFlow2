import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import TeamTable from './TeamTable';
import { deleteEmployee } from '@/features/team/api/employees';

// Mocks des APIs
vi.mock('@/features/team/api/employees', () => ({
  deleteEmployee: vi.fn(),
  bulkDeleteEmployees: vi.fn(),
}));

// Mock de DataTable pour isoler le test du parent
vi.mock('@/components/shared/DataTable', () => ({
  DataTable: ({ data, meta }) => (
    <div data-testid="mock-data-table">
      {data.map(emp => (
        <div key={emp.id} data-testid={`row-${emp.id}`}>
          <span>{emp.first_name} {emp.last_name}</span>
          <button onClick={() => meta.onDelete(emp)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

const mockData = [
  { id: '1', first_name: 'John', last_name: 'Doe', specialization: { name: 'Frontend' } },
  { id: '2', first_name: 'Jane', last_name: 'Smith', specialization: { name: 'Backend' } },
];

const mockSpecs = [
  { id: 's1', name: 'Frontend' },
  { id: 's2', name: 'Backend' },
];

describe('TeamTable', () => {
  const onRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit filtrer la liste par le terme de recherche', async () => {
    render(<TeamTable data={mockData} specializations={mockSpecs} onRefresh={onRefresh} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    await userEvent.type(searchInput, 'Jane');

    const table = screen.getByTestId('mock-data-table');
    expect(within(table).getByText('Jane Smith')).toBeInTheDocument();
    expect(within(table).queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('doit filtrer par spécialisation lors du clic sur un badge', async () => {
    render(<TeamTable data={mockData} specializations={mockSpecs} onRefresh={onRefresh} />);
    
    // On cible le bouton de filtre "Frontend"
    const filterBtn = screen.getByRole('button', { name: /^frontend$/i });
    await userEvent.click(filterBtn);

    const table = screen.getByTestId('mock-data-table');
    expect(within(table).getByText('John Doe')).toBeInTheDocument();
    expect(within(table).queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('doit ouvrir la modale de confirmation et supprimer un membre', async () => {
    deleteEmployee.mockResolvedValueOnce({});
    render(<TeamTable data={mockData} specializations={mockSpecs} onRefresh={onRefresh} />);
    
    // 1. Cliquer sur Delete dans la ligne de John
    const row = screen.getByTestId('row-1');
    await userEvent.click(within(row).getByText('Delete'));

    // 2. Vérifier que la modale est ouverte
    expect(screen.getByText(/Delete Member\?/i)).toBeInTheDocument();

    // 3. Confirmer la suppression
    const confirmBtn = screen.getByRole('button', { name: /Confirm Deletion/i });
    await userEvent.click(confirmBtn);

    expect(deleteEmployee).toHaveBeenCalledWith('1');
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
  });

  it('ne doit pas afficher les rôles exclus (Software Architect, etc.)', () => {
    const specsWithExcluded = [
      ...mockSpecs,
      { id: 's3', name: 'Software Architect' }
    ];
    render(<TeamTable data={mockData} specializations={specsWithExcluded} onRefresh={onRefresh} />);
    
    expect(screen.queryByRole('button', { name: /Software Architect/i })).not.toBeInTheDocument();
  });
});