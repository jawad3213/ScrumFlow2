import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AddEmployeeModal from './AddEmployeeModal';

// Mock des APIs pour éviter le "Network Error"
vi.mock('@/features/team/api/specializations', () => ({
    getSpecializations: vi.fn(() => Promise.resolve([{ name: 'Frontend', level: 'Junior' }]))
}));

describe('AddEmployeeModal', () => {
    it('doit afficher une erreur si les champs sont vides', async () => {
        const user = userEvent.setup();
        
        // On rend le composant
        render(<AddEmployeeModal showTrigger={true} />);

        // 1. Ouvrir la modal
        const trigger = screen.getByRole('button', { name: /Add Member/i });
        await user.click(trigger);

        // 2. IMPORTANT : On désactive la validation HTML5 native juste pour le test
        // Cela permet de forcer l'exécution de ton handleSubmit
        const form = screen.getByRole('dialog').querySelector('form');
        form.setAttribute('noValidate', 'true');

        // 3. Cliquer sur soumettre
        const submitBtn = screen.getByRole('button', { name: /Create Employee/i });
        await user.click(submitBtn);

        // 4. Vérifier l'erreur avec une regex flexible
        // On utilise findByText car l'affichage du state peut prendre quelques millisecondes
        const errorMessage = await screen.findByText(/required/i);
        
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(/First and last name are required/i);
    });
});