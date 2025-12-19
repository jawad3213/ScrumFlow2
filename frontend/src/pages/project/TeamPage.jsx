import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeamTable from '../../components/team/TeamTable';
import { Plus } from 'lucide-react';

const TeamPage = () => {
    const { id } = useParams();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
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
                        role: emp.job_title || 'N/A',
                        email: emp.email,
                        status: emp.status || 'Active',
                        rate: "$0/day" // Placeholder as rate is not in current migration
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
        };

        // Only fetch global team data if not in a specific project context (or distinct logic for project team)
        // For now, assuming "Team Global" (no id) fetches all employees.
        if (!id) {
            fetchEmployees();
        } else {
            // TODO: specific project team logic fetching
            setLoading(false);
        }
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{id ? `Project ${id} - Team Management` : 'Global Team Management'}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {id ? `Manage members, roles, and rates for Project ${id}.` : 'Manage all team members across the organization.'}
                    </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white hover:bg-brand-primary/90 h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </button>
            </div>

            {loading ? (
                <div>Loading team members...</div>
            ) : (
                <TeamTable data={teamMembers} />
            )}
        </div>
    );
};

export default TeamPage;
