import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectDashboardPage from './ProjectDashboardPage'

// 🔹 Mock du composant intégré
vi.mock('@/features/projects/components/ProjectOverview/OverviewDashboard', () => ({
  default: () => <div data-testid="overview-dashboard">Overview Dashboard</div>,
}))

describe('ProjectDashboardPage (integration)', () => {
  it('renders OverviewDashboard component', () => {
    render(<ProjectDashboardPage />)

    expect(screen.getByTestId('overview-dashboard')).toBeTruthy()
    expect(screen.getByText('Overview Dashboard')).toBeTruthy()
  })
})
