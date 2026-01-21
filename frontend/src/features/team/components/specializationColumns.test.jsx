import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { specializationColumns } from './specializationColumns';

// Helper pour simuler le rendu d'une cellule spécifique
const renderCell = (columnId, rowData) => {
  const column = specializationColumns.find(c => (c.accessorKey === columnId || c.id === columnId));
  const row = {
    getValue: (key) => rowData[key],
    original: rowData,
    getIsSelected: vi.fn()
  };
  // On simule l'objet table pour les actions
  const table = {
    options: { meta: { onEdit: vi.fn(), onDelete: vi.fn() } }
  };
  
  const { container } = render(column.cell({ row, table }));
  return container;
};

describe('specializationColumns', () => {
  
  it('doit formater correctement le salaire en MAD', () => {
    renderCell('salary', { salary: 15000 });
    
    // On utilise une fonction matcher pour être flexible sur les séparateurs
    // car Intl.NumberFormat peut varier selon l'OS/Node version
    expect(screen.getByText((content) => {
      const normalizedContent = content.replace(/\u00a0/g, ' '); // Normalise les espaces insécables
      return normalizedContent.includes('15') && 
             normalizedContent.includes('000,00') && 
             normalizedContent.includes('MAD');
    })).toBeInTheDocument();
  });
  describe('Logique des badges de niveau', () => {
    const testBadgeColor = (level, expectedClass) => {
      const container = renderCell('level', { level });
      const badge = container.querySelector('span');
      expect(badge.className).toContain(expectedClass);
    };

    it('doit mettre en indigo les rôles Architect ou Principal', () => {
      testBadgeColor('Cloud Architect', 'text-indigo-700');
      testBadgeColor('Principal Engineer', 'text-indigo-700');
    });

    it('doit mettre en bleu et gras les rôles Senior', () => {
      testBadgeColor('Senior Developer', 'text-blue-700');
      testBadgeColor('Senior Developer', 'font-black');
    });

    it('doit mettre en ambre avec bordure les stagiaires (Intern)', () => {
      testBadgeColor('Software Intern', 'text-amber-600');
      testBadgeColor('Software Intern', 'border-amber-200');
    });

    it('doit utiliser une couleur neutre par défaut pour les niveaux inconnus', () => {
      testBadgeColor('Expert', 'text-neutral-500');
    });
  });

  it('doit contenir les boutons Edit et Delete dans les actions', () => {
    const container = renderCell('actions', { id: 1, name: 'Frontend' });
    const buttons = container.querySelectorAll('button');
    
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('Edit')).toBeInTheDocument(); // sr-only text
    expect(screen.getByText('Delete')).toBeInTheDocument(); // sr-only text
  });
});