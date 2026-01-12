import React from 'react';
import { Layers, Database, Globe, Cpu } from 'lucide-react';

const StackChoiceView = () => {
    return (
        <div className="h-full w-full bg-surface-background p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black tracking-tight text-neutral-900">Technology Stack</h1>
                    <p className="text-neutral-500 font-medium mt-2">
                        Select and configure the technological foundation for your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Frontend Card */}
                    <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-subtle hover:shadow-elevation transition-all duration-300 cursor-pointer group">
                        <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Frontend Framework</h3>
                        <p className="text-sm text-neutral-500">Choose your client-side framework (React, Vue, Swift, etc.)</p>
                    </div>

                    {/* Backend Card */}
                    <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-subtle hover:shadow-elevation transition-all duration-300 cursor-pointer group">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Database size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Backend & Database</h3>
                        <p className="text-sm text-neutral-500">Select server technologies and data storage solutions.</p>
                    </div>

                    {/* Infrastructure Card */}
                    <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-subtle hover:shadow-elevation transition-all duration-300 cursor-pointer group">
                        <div className="h-12 w-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Cpu size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Infrastructure</h3>
                        <p className="text-sm text-neutral-500">Configure hosting, CI/CD pipelines, and cloud services.</p>
                    </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 text-center">
                    <Layers className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Stack Configuration Wizard</h3>
                    <p className="text-neutral-500 max-w-md mx-auto mb-6">
                        Use our AI-assisted wizard to determine the optimal stack based on your project requirements and team skills.
                    </p>
                    <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-neutral-800 transition-colors shadow-lg">
                        Launch Wizard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StackChoiceView;
