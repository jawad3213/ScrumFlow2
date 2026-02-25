import client from '@/lib/axios';

/**
 * Fetch the dashboard summary data including stats and projects.
 * @returns {Promise<{ stats: object, projects: array }>}
 */
export const fetchDashboardData = async () => {
    const response = await client('/projects/dashboard');
    return response;
};
