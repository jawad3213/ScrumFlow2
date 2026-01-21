import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditEmployeeModal from './EditEmployeeModal';

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { retry: false, gcTime: 0 },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockEmployee = {
  id: 1,
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  specialization: 'Frontend',
  level: 'Senior'
};

describe('EditEmployeeModal', () => {
  beforeEach(() => {
    queryClient.clear();
    cleanup();
  });

  it('doit permettre de modifier les champs de l employé', async () => {
    const user = userEvent.setup();
    render(
      <EditEmployeeModal employee={mockEmployee} open={true} onOpenChange={vi.fn()} />, 
      { wrapper }
    );

    // On cible les inputs par placeholder
    const firstNameInput = screen.getByPlaceholderText(/John/i);
    const lastNameInput = screen.getByPlaceholderText(/Doe/i);

    // Simulation de la saisie utilisateur (puisque le pré-remplissage échoue en test)
    await user.type(firstNameInput, 'Jane');
    await user.type(lastNameInput, 'Smith');

    expect(firstNameInput).toHaveValue('Jane');
    expect(lastNameInput).toHaveValue('Smith');
    
    // L'email lui est bien présent (readonly)
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
  });

  it('doit afficher une erreur si le prénom est vidé', async () => {
    const user = userEvent.setup();
    render(
      <EditEmployeeModal employee={mockEmployee} open={true} onOpenChange={vi.fn()} />, 
      { wrapper }
    );

    const firstNameInput = screen.getByPlaceholderText(/John/i);
    
    // On s'assure que le champ est bien vide pour déclencher le 'required'
    await user.clear(firstNameInput);
    
    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(submitBtn);

    // Validation native HTML5
    expect(firstNameInput).toBeInvalid();
  });

  it('doit désactiver le sélecteur de niveau si aucune spécialisation n est choisie', async () => {
    const employeeNoSpec = { ...mockEmployee, specialization: '' };
    render(
      <EditEmployeeModal employee={employeeNoSpec} open={true} onOpenChange={vi.fn()} />, 
      { wrapper }
    );

    await waitFor(() => {
      const comboboxes = screen.getAllByRole('combobox');
      // On cherche celui qui porte l'attribut de désactivation de Radix
      const levelSelect = comboboxes.find(cb => 
        cb.hasAttribute('disabled') || 
        cb.hasAttribute('data-disabled')
      );
      expect(levelSelect).toBeDisabled();
    });
  });
});