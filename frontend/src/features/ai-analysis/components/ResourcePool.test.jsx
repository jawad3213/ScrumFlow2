import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResourcePool from './ResourcePool';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('ResourcePool', () => {
  let mockSetPool;
  const initialPool = [
    {
      role: 'Frontend Developer',
      level: 'Senior',
      specialization: 'General',
      salary: 45000
    }
  ];

  beforeEach(() => {
    cleanup();
    mockSetPool = vi.fn();
  });

  it('affiche le rôle initial dans le premier select', () => {
    render(<ResourcePool pool={initialPool} setPool={mockSetPool} />);
    
    // On récupère spécifiquement les selects de la ligne de données
    const selects = screen.getAllByRole('combobox');
    // selects[0] = Functional Role, selects[1] = Expertise Seniority
    expect(selects[0].value).toBe('Frontend Developer');
  });

  it('appelle setPool avec un tableau vide lors du clic sur la poubelle', () => {
    render(<ResourcePool pool={initialPool} setPool={mockSetPool} />);
    
    // On cible uniquement les lignes du corps du tableau pour ne pas cliquer sur le header
    const rows = screen.getAllByRole('row');
    const dataRow = rows[1]; // rows[0] est le thead
    
    // On cherche le bouton à l'intérieur de cette ligne spécifique
    const deleteButton = within(dataRow).getAllByRole('button')[0];
    
    fireEvent.click(deleteButton);

    expect(mockSetPool).toHaveBeenCalledWith([]);
  });

  it('met à jour le salaire via l\'input number', () => {
    render(<ResourcePool pool={initialPool} setPool={mockSetPool} />);
    
    const salaryInput = screen.getByRole('spinbutton');
    fireEvent.change(salaryInput, { target: { value: '50000' } });

    expect(mockSetPool).toHaveBeenCalledWith([
      { ...initialPool[0], salary: 50000 }
    ]);
  });

  it('ajoute un nouveau spécialiste via le bouton principal', () => {
    render(<ResourcePool pool={initialPool} setPool={mockSetPool} />);
    
    // On cherche le bouton qui contient le texte "Add Specialist"
    const addButton = screen.getByRole('button', { name: /Add Specialist/i });
    fireEvent.click(addButton);

    expect(mockSetPool).toHaveBeenCalledWith([
      ...initialPool,
      {
        role: 'Backend Developer',
        level: 'Mid-level',
        specialization: "General",
        salary: 20000
      }
    ]);
  });

  it('affiche les bonnes options de niveau pour le rôle sélectionné', () => {
    render(<ResourcePool pool={initialPool} setPool={mockSetPool} />);
    
    const selects = screen.getAllByRole('combobox');
    const levelSelect = selects[1];
    
    const options = within(levelSelect).getAllByRole('option');
    const values = options.map(opt => opt.value);
    
    // Vérifie que les niveaux de Frontend Developer sont présents
    expect(values).toContain('Staff Engineer');
    expect(values).toContain('Software Architect');
  });
});