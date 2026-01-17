import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Checkbox } from './checkbox';

describe('Checkbox Component', () => {
    it('renders correctly and is unchecked by default', () => {
        render(<Checkbox aria-label="accepter" />);
        const checkbox = screen.getByRole('checkbox');
        
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute('data-state', 'unchecked');
        expect(checkbox).toBeEnabled();
    });

    it('toggles state when clicked', async () => {
        const user = userEvent.setup();
        render(<Checkbox aria-label="accepter" />);
        const checkbox = screen.getByRole('checkbox');

        // Premier clic pour cocher
        await user.click(checkbox);
        expect(checkbox).toHaveAttribute('data-state', 'checked');
        expect(checkbox).toBeChecked(); // Fonctionne grâce aux attributs ARIA de Radix

        // Deuxième clic pour décocher
        await user.click(checkbox);
        expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('shows the check icon when checked', async () => {
        const user = userEvent.setup();
        const { container } = render(<Checkbox />);
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);

        // L'indicateur (l'icône Check) est rendu dans le DOM
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('lucide-check');
    });

    it('is disabled when the disabled prop is passed', () => {
        render(<Checkbox disabled />);
        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toHaveClass('disabled:opacity-50');
    });

    it('calls onCheckedChange when state changes', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        render(<Checkbox onCheckedChange={onCheckedChange} />);
        
        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(onCheckedChange).toHaveBeenCalledWith(true);
        
        await user.click(checkbox);
        expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it('maintains state correctly when used as a controlled component', async () => {
        const user = userEvent.setup();
        render(<Checkbox checked={true} readOnly />);
        
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('data-state', 'checked');
        
        // Un clic sur un composant contrôlé sans handler ne devrait pas changer l'état interne
        await user.click(checkbox);
        expect(checkbox).toHaveAttribute('data-state', 'checked');
    });
});