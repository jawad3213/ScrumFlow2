import React from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';

import ProjectTeamManager from '@/features/projects/components/ProjectTeam/ProjectTeamManager';

const ProjectTeamPage = () => {
    const { id } = useParams();

    return (
        <div className="space-y-10 animate-in fade-in duration-default ease-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white rounded-[32px] border border-neutral-100 p-8 shadow-elevation">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary-500 flex items-center justify-center text-white shadow-xl shadow-brand-primary-500/20">
                        <Users className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-neutral-900 uppercase">
                            Project Team
                        </h1>
                        <p className="text-neutral-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">Personnel Deployment & Role Management</p>
                    </div>
                </div>
            </div>

            <ProjectTeamManager projectId={id} />
        </div>
    );
};

export default ProjectTeamPage;
