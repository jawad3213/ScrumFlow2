import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import EditSpecializationModal from './EditSpecializationModal';
import { updateSpecialization } from '@/features/team/api/specializations';

// Mock de l'API
vi.mock('@/features/team/api/specializations', () => ({
  updateSpecialization: vi.fn(),
}));

// Mock des constantes (ajuste selon tes besoins)
vi.mock('@/utils/constants', () => ({
  ALL_ROLES: ['Frontend', 'Backend'],
  ROLE_LEVELS: {
    'Frontend': ['Junior', 'Senior'],
    'Backend': ['Lead']
  }
}));

const mockSpec = {
  id: '123',
  name: 'Frontend',
  level: 'Senior',
  salary: '25000'
};

describe('EditSpecializationModal', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

 it('doit pré-remplir les champs avec les données de la spécialisation', async () => {
  render(
    <EditSpecializationModal 
      specialization={mockSpec} 
      open={true} 
      onOpenChange={vi.fn()} 
      onSpecializationUpdated={vi.fn()}
    />
  );

  await waitFor(() => {
    // On cible spécifiquement les boutons de type combobox (les SelectTrigger)
    const comboboxes = screen.getAllByRole('combobox');
    
    // On vérifie que les textes attendus sont bien présents dans ces boutons
    // .some() permet de vérifier qu'au moins un des selects contient la valeur
    const hasFrontend = comboboxes.some(cb => cb.textContent.includes('Frontend'));
    const hasSenior = comboboxes.some(cb => cb.textContent.includes('Senior'));

    expect(hasFrontend).toBe(true);
    expect(hasSenior).toBe(true);
  });

  // Pour le salaire, placeholder="0.00" est unique, donc pas de conflit
  const salaryInput = screen.getByPlaceholderText('0.00');
  expect(salaryInput).toHaveValue(25000);
});

  it('doit afficher une erreur si le salaire est invalide au submit', async () => {
    const user = userEvent.setup();
    render(
      <EditSpecializationModal 
        specialization={mockSpec} 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    );

    const salaryInput = screen.getByPlaceholderText('0.00');
    await user.clear(salaryInput);
    await user.type(salaryInput, '0');

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveBtn);

    // On vérifie le message d'erreur personnalisé dans le composant
    expect(await screen.findByText(/Please enter a valid salary amount/i)).toBeInTheDocument();
  });

  it('doit appeler l API et fermer la modale en cas de succès', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onUpdate = vi.fn();
    
    updateSpecialization.mockResolvedValueOnce({});

    render(
      <EditSpecializationModal 
        specialization={mockSpec} 
        open={true} 
        onOpenChange={onOpenChange}
        onSpecializationUpdated={onUpdate}
      />
    );

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(updateSpecialization).toHaveBeenCalledWith('123', expect.objectContaining({
        name: 'Frontend',
        salary: '25000'
      }));
      expect(onUpdate).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});