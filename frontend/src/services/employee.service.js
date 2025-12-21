import { getEmployees, getSpecializations } from '@/api';

/**
 * Service to handle complex employee data logic and transformations.
 */
export const EmployeeService = {
    /**
     * Fetches and prepares employee data with their associated specializations and formatted names.
     */
    async getTeamData() {
        try {
            const [employeesRaw, specializationsRaw] = await Promise.all([
                getEmployees(),
                getSpecializations()
            ]);

            const employees = Array.isArray(employeesRaw) ? employeesRaw : [];
            const specializations = Array.isArray(specializationsRaw) ? specializationsRaw : [];

            const formattedEmployees = employees.map(emp => ({
                ...emp,
                name: `${emp.first_name} ${emp.last_name}`,
                role: emp.specialization?.name || 'N/A',
                status: emp.status || 'active'
            }));

            return {
                employees: formattedEmployees,
                specializations
            };
        } catch (error) {
            console.error("EmployeeService.getTeamData error:", error);
            throw error;
        }
    }
};
