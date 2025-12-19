import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TeamTable from '../../components/team/TeamTable';
import AddEmployeeModal from '../../components/team/AddEmployeeModal';
import { Plus } from 'lucide-react';

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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="bg-white rounded-[40px] border border-neutral-100 p-10 shadow-subtle shadow-custom">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FFEDD5]">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#feaa09]" />
                            <span className="text-[#feaa09] text-xs font-bold uppercase tracking-widest">
                                ORGANIZATION TEAM
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-[42px] font-black tracking-tight text-[#000000]">
                                Team Management
                            </h1>
                            <p className="text-[16px] text-neutral-500 max-w-2xl font-medium leading-relaxed">
                                Manage your entire workforce in one place. Add new employees, update details, and monitor their status.
                            </p>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <AddEmployeeModal onEmployeeAdded={fetchEmployees} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-150 px-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-neutral-200 shadow-sm border-dashed">
                        <div className="h-10 w-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
                        <p className="text-neutral-500 font-medium animate-pulse">Loading team members...</p>
                    </div>
                ) : (
                    <TeamTable data={teamMembers} />
                )}
            </div>
        </div>
    );
};

export default TeamPage;
