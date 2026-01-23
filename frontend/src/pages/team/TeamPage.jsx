import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TeamTable from '@/features/team/components/TeamTable';
import SpecializationTable from '@/features/team/components/SpecializationTable';
import AddEmployeeModal from '@/features/team/components/AddEmployeeModal';
import AddSpecializationModal from '@/features/team/components/AddSpecializationModal';
import { Trash2 } from 'lucide-react';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useEmployees } from '@/features/team/api/useEmployeesQuery';
import { useSpecializations } from '@/features/team/api/useSpecializationsQuery';

const TeamPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("employees");
    const [selectedCount, setSelectedCount] = useState(0);

    const teamTableRef = useRef();
    const specializationTableRef = useRef();

    const { data: teamMembers = [], isLoading: loadingEmployees, refetch: refetchEmployees } = useEmployees();
    const { data: specializations = [], isLoading: loadingSpecs, refetch: refetchSpecializations } = useSpecializations();

    const loading = loadingEmployees || loadingSpecs;

    const handleSelectionChange = useCallback((rows) => setSelectedCount(rows.length), []);

    const handleEmployeeAdded = () => refetchEmployees();
    const handleSpecializationAdded = () => refetchSpecializations();

    return (
        <div className="space-y-6 animate-in fade-in duration-default ease-soft">
            {/* Simplified Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-surface-border p-6 shadow-elevation">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                        Team Management
                    </h1>
                    <p className="text-neutral-500 font-medium">Manage your team members and roles.</p>
                </div>
                <div className="flex-shrink-0">
                    {activeTab === 'employees' ? (
                        <AddEmployeeModal onEmployeeAdded={handleEmployeeAdded} variant="default" />
                    ) : (
                        <AddSpecializationModal onSpecializationAdded={handleSpecializationAdded} variant="default" />
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className="animate-in slide-in-from-bottom-4 duration-default delay-150 px-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-surface-border shadow-subtle">
                        <LoadingAnimation
                            className="w-64"
                            message="Setting up your team view... Just a moment"
                        />
                    </div>
                ) : (
                    <Tabs defaultValue="employees" className="w-full" onValueChange={setActiveTab}>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                            <TabsList className="bg-surface-muted/50 p-1 border border-surface-border rounded-xl">
                                <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-brand-primary-600 data-[state=active]:shadow-sm font-bold text-neutral-500 w-[150px]">
                                    Employees
                                </TabsTrigger>
                                <TabsTrigger value="specializations" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-brand-primary-600 data-[state=active]:shadow-sm font-bold text-neutral-500 w-[150px]">
                                    Specializations
                                </TabsTrigger>
                            </TabsList>

                            {selectedCount > 0 && (
                                <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-300 bg-danger-lighter/30 px-4 py-1.5 rounded-2xl border border-danger-default/10">
                                    <span className="text-sm font-bold text-danger-darker">
                                        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                                    </span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => (activeTab === 'employees' ? teamTableRef : specializationTableRef).current?.triggerBulkDelete()}
                                        className="bg-danger-default hover:bg-danger-darker text-white font-bold rounded-xl px-4 h-9 shadow-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Selected</span>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <TabsContent value="employees">
                            <TeamTable
                                ref={teamTableRef}
                                data={teamMembers}
                                specializations={specializations}
                                onRefresh={refetchEmployees}
                                onSelectionChange={handleSelectionChange}
                            />
                        </TabsContent>

                        <TabsContent value="specializations">
                            <SpecializationTable
                                ref={specializationTableRef}
                                data={specializations}
                                onRefresh={refetchSpecializations}
                                onSelectionChange={handleSelectionChange}
                            />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
};

export default TeamPage;
