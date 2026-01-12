import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '@/features/projects/api/projects';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import BacklogDashboard from '@/features/projects/components/BacklogDashboard';
import TechnicalBlueprintWizard from '@/features/projects/components/TechnicalBlueprintWizard';

const TechnicalBlueprintPage = () => {
    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                // Transform API response
                const transformedData = {
                    project_name: data.name,
                    estimated_duration_months: data.estimated_duration_months,
                    total_project_cost: data.total_project_cost,
                    total_capex: data.total_capex,
                    total_opex: data.total_opex,
                    roi_analysis_summary: data.roi_analysis_summary,
                    // Map assigned engineers for the pool
                    assigned_engineers: (data.assigned_engineers || []).map(e => ({
                        role: e.specialization?.name || e.role || 'Developer',
                        level: e.specialization?.level || e.level || 'Mid-level',
                        salary: e.specialization?.salary || e.monthly_salary_mad || 0,
                        count: 1 // Default to 1 if not specified
                    })),
                    backlog: data.epics ? data.epics.map(epic => ({
                        id: epic.id,
                        title: epic.title,
                        description: epic.description,
                        external_id: epic.external_id,
                        user_stories: epic.stories.map(story => ({
                            id: story.id,
                            title: story.title,
                            description: story.description,
                            story_points: story.story_points,
                            external_id: story.external_id,
                            acceptance_criteria: story.acceptance_criteria,
                            tasks: story.tasks.map(task => ({
                                id: task.id,
                                title: task.title,
                                role: task.role,
                                level: task.level,
                                hours: task.hours,
                                instructions: task.instructions,
                                external_id: task.external_id
                            }))
                        }))
                    })) : []
                };

                setProjectData(transformedData);
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-background">
                <LoadingAnimation
                    className="w-64"
                    message="Retrieving technical specifications..."
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-background">
                <div className="text-center">
                    <p className="text-danger-default font-bold mb-2">Error loading project</p>
                    <p className="text-neutral-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface-background p-8 overflow-y-auto">
            {projectData?.backlog && projectData.backlog.length > 0 && (
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black tracking-tight text-neutral-900">Technical Blueprint</h1>
                    <p className="text-neutral-500 font-medium mt-2">
                        Systematic breakdown and verified technical specifications for <span className="font-bold text-neutral-900">{projectData?.project_name}</span>.
                    </p>
                </div>
            )}

            <div className="w-full flex-1 flex flex-col space-y-8">
                <div className="block animate-in fade-in zoom-in-95 duration-200">
                    {projectData?.backlog && projectData.backlog.length > 0 ? (
                        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm mt-4">
                            <BacklogDashboard data={projectData} />
                        </div>
                    ) : (
                        <TechnicalBlueprintWizard initialData={projectData} projectId={id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalBlueprintPage;
