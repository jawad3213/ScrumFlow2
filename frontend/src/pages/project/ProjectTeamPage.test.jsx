import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import ProjectTeamPage from './ProjectTeamPage';
import client from '@/lib/axios';

// --- CONFIGURATION DE L'ENVIRONNEMENT ---

// 1. Mock client axios
vi.mock('@/lib/axios', () => ({
    default: vi.fn(),
}));

// 2. Mock framer-motion (évite les avertissements et simplifie le rendu)
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// 3. Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
};

const mockTeam = [
    {
        id: 1,
        employee_id: 10,
        phase: 'development',
        months_assigned: 6,
        specialization: { name: 'Frontend Engineer', level: 'Senior' },
        employee: { id: 10, first_name: 'John', last_name: 'Doe' }
    },
    {
        id: 2,
        employee_id: null,
        phase: 'development',
        months_assigned: 3,
        specialization: { name: 'Backend Engineer', level: 'Mid-level' },
        employee: null
    }
];

const mockTalent = [
    {
        id: 20,
        first_name: 'Jane',
        last_name: 'Smith',
        specialization: { name: 'Backend Engineer', level: 'Mid-level' }
    }
];

describe('Integration Test: ProjectTeamPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock successful API responses
        client.mockImplementation((url) => {
            if (url === '/projects/3/team') {
                return Promise.resolve({ team: mockTeam });
            }
            if (url === '/employees/available') {
                return Promise.resolve(mockTalent);
            }
            return Promise.resolve({});
        });
    });

    const renderWithRouter = (projectId = '3') => {
        return render(
            <MemoryRouter initialEntries={[`/projects/${projectId}/team`]}>
                <Routes>
                    <Route path="/projects/:id/team" element={<ProjectTeamPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should render the team page and list requirement cards', async () => {
        renderWithRouter();

        // Check header
        expect(screen.getByText(/Project Team/i)).toBeInTheDocument();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
            expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
        });

        // Check filled requirement
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Deployed')).toBeInTheDocument();

        // Check empty requirement
        expect(screen.getByText('Critical Need')).toBeInTheDocument();
    });

    it('should show count of roles filled', async () => {
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('1 / 2')).toBeInTheDocument();
        });
    });

    it('should identify and assign talent to a requirement', async () => {
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
        });

        // Click "Identify Talent" on the Backend requirement
        const backendCard = screen.getByText('Backend Engineer').closest('.group');
        const identifyBtn = within(backendCard).getByRole('button', { name: /Identify Talent/i });
        fireEvent.click(identifyBtn);

        // Should show search and talent match
        expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();

        // Click on Jane Smith to assign
        fireEvent.click(screen.getByText('Jane Smith'));

        // Check if API was called correctly
        expect(client).toHaveBeenCalledWith('/projects/3/team/assign', expect.objectContaining({
            body: {
                assigned_engineer_id: 2,
                user_id: 20
            }
        }));
    });

    it('should unassign a team member', async () => {
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        // The unassign button is hidden by default (opacity-0 in JSX)
        // In JSDOM we can still find it and click it
        const frontendCard = screen.getByText('Frontend Engineer').closest('.group');

        // Since frontendCard is a DOM element in JSDOM
        const unassignBtn = frontendCard.querySelector('button');
        fireEvent.click(unassignBtn);

        // Check if API was called
        expect(client).toHaveBeenCalledWith('/projects/3/team/unassign', expect.objectContaining({
            body: { assigned_engineer_id: 1 }
        }));
    });
});
