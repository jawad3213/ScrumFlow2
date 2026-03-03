import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getProject } from '@/features/projects/api/projects';
import AIDashboard from '@/features/ai-analysis/components/AIDashboard';
import LoadingAnimation from '@/components/ui/loading-animation';

const FinancialBlueprintView = () => {
    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const apiData = await getProject(id);

                console.log("Raw Project Data:", apiData);

                // Helper to safely get array property (checks snake_case and camelCase)
                const getList = (base, keySnake, keyCamel) => {
                    const val = base[keySnake] || base[keyCamel];
                    return Array.isArray(val) ? val : [];
                };

                const roiProjections = getList(apiData, 'roi_projections', 'roiProjections');
                const assignedEngineers = getList(apiData, 'assigned_engineers', 'assignedEngineers');
                const infrastructureCosts = getList(apiData, 'infrastructure_costs', 'infrastructureCosts');
                const estimatedGains = getList(apiData, 'estimated_gains', 'estimatedGains');
                const kpis = getList(apiData, 'kpis', 'kpis');

                // Transformation Logic
                const roiMap = {};
                roiProjections.forEach(p => {
                    roiMap[`year_${p.year_number}`] = {
                        cumulative_costs: p.cumulative_costs || 0,
                        cumulative_gains: p.cumulative_gains || 0,
                        net_cash_flow: p.net_cash_flow || 0,
                        roi_percentage: p.roi_percentage || 0
                    };
                });

                const filterByPhase = (items, phase) => items.filter(e => e.phase === phase).map(e => ({
                    role: e.specialization?.name || e.role || 'Unknown Role',
                    level: e.specialization?.level || e.level || 'Mid-level',
                    months_assigned: e.months_assigned || 0,
                    total_cost_mad: ((e.specialization?.salary || 0) * (e.months_assigned || 0)) || e.total_cost_mad || 0,
                    monthly_salary_mad: e.specialization?.salary || 0
                }));

                const devEngineers = filterByPhase(assignedEngineers, 'development');
                const maintEngineers = filterByPhase(assignedEngineers, 'maintenance');

                const capexInfra = infrastructureCosts.filter(i => i.type === 'capex');
                const opexInfra = infrastructureCosts.filter(i => i.type === 'opex');

                const defaultYear = { cumulative_costs: 0, cumulative_gains: 0, net_cash_flow: 0, roi_percentage: 0 };

                const transformedData = {
                    ...apiData,
                    roi_projections: {
                        year_1: roiMap.year_1 || defaultYear,
                        year_2: roiMap.year_2 || defaultYear,
                        year_3: roiMap.year_3 || defaultYear,
                        break_even_point_months: apiData.break_even_point_months || 0
                    },
                    selected_engineers: devEngineers,
                    maintenance_engineers: maintEngineers,
                    licenses_and_apis: capexInfra,
                    cloud_subscription: opexInfra,
                    estimated_gains: estimatedGains,
                    kpis: kpis,
                    roi_analysis_summary: apiData.roi_analysis_summary || apiData.roiAnalysisSummary || "No strategic analysis summary available."
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
                    message="Retrieving financial blueprint..."
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
        <div className="h-full w-full bg-surface-background p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black tracking-tight text-neutral-900">Financial Blueprint</h1>
                    <p className="text-neutral-500 font-medium mt-2">
                        Verified architectural analysis and financial projections for <span className="font-bold text-neutral-900">{projectData?.name}</span>.
                    </p>
                </div>

                <div className="w-full">
                    <AIDashboard data={projectData} />
                </div>
            </div>
        </div>
    );
};

export default FinancialBlueprintView;
