import React from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';

const ProjectTeamPage = () => {
    const { id } = useParams();

    return (
        <div className="space-y-6 animate-in fade-in duration-default ease-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-surface-border p-6 shadow-elevation">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-2">
                        <Users className="h-6 w-6 text-brand-primary-500" />
                        Project Team
                    </h1>
                    <p className="text-neutral-500 font-medium">Manage members assigned to this specific project.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-8 text-center shadow-subtle">
                <p className="text-neutral-500 font-medium">Project Team management content will go here.</p>
            </div>
        </div>
    );
};

export default ProjectTeamPage;
