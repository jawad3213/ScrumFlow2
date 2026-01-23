import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import SpecializationTable from './SpecializationTable';
import { deleteSpecialization, bulkDeleteSpecializations } from '@/features/team/api/specializations';
// Mocks
vi.mock('@/features/team/api/specializations', () => ({
  deleteSpecialization: vi.fn(),
  bulkDeleteSpecializations: vi.fn(),
}));

// On mocke la DataTable pour simplifier le test du parent
vi.mock('@/components/shared/DataTable', () => ({
  DataTable: ({ data, meta }) => (
    <div data-testid="mock-data-table">
      {data.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => meta.onEdit(item)}>Edit {item.id}</button>
          <button onClick={() => meta.onDelete(item)}>Delete {item.id}</button>
        </div>
      ))}
    </div>
  ),
}));

const mockData = [
  { id: '1', name: 'Frontend', level: 'Senior', salary: 25000 },
  { id: '2', name: 'Backend', level: 'Junior', salary: 15000 },
];

describe('SpecializationTable', () => {
  const onRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

 it('doit afficher les boutons de filtrage et filtrer les données', async () => {
    render(<SpecializationTable data={mockData} onRefresh={onRefresh} />);
    
    // 1. On cible spécifiquement les boutons de filtre par leur rôle ARIA
    // Cela évite la confusion avec le texte présent dans la DataTable
    const filterAll = screen.getByRole('button', { name: /all/i });
    const filterFrontend = screen.getByRole('button', { name: /^frontend$/i });
    const filterBackend = screen.getByRole('button', { name: /^backend$/i });

    expect(filterAll).toBeInTheDocument();
    expect(filterFrontend).toBeInTheDocument();
    expect(filterBackend).toBeInTheDocument();

    // 2. Clic sur le bouton de filtre "Backend"
    await userEvent.click(filterBackend);
    
    // 3. Vérification du filtrage dans la zone de la table
    // On cherche l'élément dans le conteneur de la table uniquement
    const tableContainer = screen.getByTestId('mock-data-table');
    
    // Dans la table filtrée, Frontend ne doit plus être là
    expect(within(tableContainer).queryByText('Frontend')).not.toBeInTheDocument();
    // Backend doit toujours être là
    expect(within(tableContainer).getByText('Backend')).toBeInTheDocument();
  });

  it('doit ouvrir la modale d édition au clic sur le bouton Edit', async () => {
    render(<SpecializationTable data={mockData} onRefresh={onRefresh} />);
    
    const editBtn = screen.getByText('Edit 1');
    await userEvent.click(editBtn);

    // Vérifie que la modale (ou son titre) est visible
    expect(screen.getByText(/Edit Role/i)).toBeInTheDocument();
  });

  it('doit appeler deleteSpecialization lors de la confirmation de suppression', async () => {
    deleteSpecialization.mockResolvedValueOnce({});
    render(<SpecializationTable data={mockData} onRefresh={onRefresh} />);
    
    // Ouvrir modale delete
    await userEvent.click(screen.getByText('Delete 1'));
    
    // Cliquer sur le bouton de confirmation dans la modale
    const confirmBtn = screen.getByText(/Confirm Deletion/i);
    await userEvent.click(confirmBtn);

    expect(deleteSpecialization).toHaveBeenCalledWith('1');
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
  });

  it('doit déclencher la suppression groupée via ref (useImperativeHandle)', async () => {
    const tableRef = React.createRef();
    // On simule une sélection de ligne en passant manuellement l'état au composant si possible
    // ou en testant l'appel à triggerBulkDelete
    render(<SpecializationTable ref={tableRef} data={mockData} onRefresh={onRefresh} />);

    // Simuler une sélection (interne au composant normalement via onSelectionChange de DataTable)
    // Pour ce test, on vérifie que la méthode existe sur la ref
    expect(tableRef.current.triggerBulkDelete).toBeDefined();
    
    // Note: Le test complet de sélection nécessite que DataTable ne soit pas mocké 
    // ou que le mock appelle onSelectionChange
  });
});