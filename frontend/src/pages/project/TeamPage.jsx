import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TeamTable from '../../components/team/TeamTable';
import AddEmployeeModal from '../../components/team/AddEmployeeModal';
import { Plus } from 'lucide-react';
import LoadingAnimation from '../../components/ui/LoadingAnimation';

const TeamPage = () => {
    const { id } = useParams();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://localhost:8000/api/employees', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Transform API data to match Table columns
                const formattedData = data.map(emp => ({
                    id: emp.id,
                    name: `${emp.first_name} ${emp.last_name}`,
                    role: emp.specialization?.name || 'N/A',
                    email: emp.email,
                    status: emp.status || 'Active',
                    rate: emp.specialization ? `$${emp.specialization.salary}/day` : "$0/day"
                }));

                setTeamMembers(formattedData);
            } else {
                console.error("Failed to fetch employees");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch global team data if not in a specific project context (or distinct logic for project team)
        // For now, assuming "Team Global" (no id) fetches all employees.
        if (!id) {
            fetchEmployees();
        } else {
            // TODO: specific project team logic fetching
            setLoading(false);
        }
    }, [id, fetchEmployees]);

    return (
        <div className="space-y-6 animate-in fade-in duration-default ease-soft">
            {/* Simplified Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-surface-border p-6 shadow-elevation">
                <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                    Team Management
                </h1>
                <div className="flex-shrink-0">
                    <AddEmployeeModal onEmployeeAdded={fetchEmployees} variant="default" />
                </div>
            </div>

            {/* Table Section */}
            <div className="animate-in slide-in-from-bottom-4 duration-default delay-150 px-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-surface-border shadow-subtle">
                        <LoadingAnimation className="w-64 h-64" />
                    </div>
                ) : (
                    <TeamTable data={teamMembers} />
                )}
            </div>
        </div>
    );
};

export default TeamPage;
