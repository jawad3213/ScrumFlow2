import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import "@testing-library/jest-dom/vitest";

// Mock the API client
vi.mock('@/lib/axios', () => ({
    default: vi.fn()
}));

// Mock ProjectCard component to simplify testing
vi.mock('@/features/dashboard/components/ProjectCard', () => ({
    default: ({ project }) => (
        <div data-testid={`project-card-${project.id}`}>
            <h3>{project.name}</h3>
            <span>{project.chef}</span>
        </div>
    )
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}));

import client from '@/lib/axios';

describe('DashboardPage Integration Tests', () => {
    const mockDashboardData = {
        stats: {
            total_projects: 1,
            total_budget: 563600,
            total_gains: 1560000,
            average_roi: 74.81,
            engineer_count: 0,
            talent_utilization: 0
        },
        projects: [
            {
                id: 1,
                name: 'ScrumFlow AI',
                chef: 'Super Chef',
                cost: 563600,
                roi: 74.81,
                has_strategic: true,
                has_technical: true,
                has_stack: true,
                steps: []
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays loading animation while fetching data', () => {
        client.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        // Check for the loading animation message
        expect(screen.getByText(/Accessing portfolio analytics/i)).toBeInTheDocument();
        expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('renders dashboard header with correct title', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Portfolio Command')).toBeInTheDocument();
        });

        expect(screen.getByText('System Intelligence')).toBeInTheDocument();
    });

    it('displays all three stat widgets with correct data', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Portfolio Balance
            expect(screen.getByText('Portfolio Balance')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Financial Engagements')).toBeInTheDocument();

            // Portfolio Budget
            expect(screen.getByText('Portfolio Budget')).toBeInTheDocument();
            expect(screen.getByText(/563.*600/)).toBeInTheDocument();
            expect(screen.getByText(/Avg\. ROI: 74\.81%/)).toBeInTheDocument();

            // Talent Matrix
            expect(screen.getByText('Talent Matrix')).toBeInTheDocument();
            expect(screen.getByText(/0% utilization/)).toBeInTheDocument();
        });
    });

    it('renders project cards for all projects', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
            expect(screen.getByText('ScrumFlow AI')).toBeInTheDocument();
            expect(screen.getByText('Super Chef')).toBeInTheDocument();
        });
    });

    it('displays "Active Engagements" section header', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Active Engagements')).toBeInTheDocument();
            expect(screen.getByText(/Real-time execution status/)).toBeInTheDocument();
        });
    });

    it('shows empty state message when no projects exist', async () => {
        const emptyData = {
            ...mockDashboardData,
            projects: []
        };

        client.mockResolvedValueOnce(emptyData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No active projects found')).toBeInTheDocument();
        });
    });

    it('uses correct grid layout for stat widgets', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        const { container } = render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const statsGrid = container.querySelector('.grid.gap-6');
            expect(statsGrid).toHaveClass('md:grid-cols-2');
            expect(statsGrid).toHaveClass('lg:grid-cols-3');
        });
    });

    it('fetches dashboard data from correct API endpoint', async () => {
        client.mockResolvedValueOnce(mockDashboardData);

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(client).toHaveBeenCalledWith('/projects/dashboard');
        });
    });

    it('handles API errors gracefully', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
        client.mockRejectedValueOnce(new Error('Network error'));

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith(
                'Dashboard fetch error:',
                expect.any(Error)
            );
        });

        consoleError.mockRestore();
    });
});