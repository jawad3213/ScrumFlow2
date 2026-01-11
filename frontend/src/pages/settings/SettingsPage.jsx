import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MagicCard } from '@/components/ui/magic-card'; // Reusing your existing component style

const SettingsPage = () => {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load key from localStorage on mount
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError("API Key cannot be empty");
            return;
        }

        try {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setIsSaved(true);
            setError(null);

            // Reset success message after 3 seconds
            setTimeout(() => setIsSaved(false), 3000);
        } catch (err) {
            setError("Failed to save to local storage");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Settings</h1>
                <p className="text-neutral-500 font-medium">Manage your application preferences and integrations.</p>
            </div>

            <MagicCard className="rounded-[32px] border border-neutral-100 shadow-subtle overflow-hidden bg-white">
                <div className="p-8 md:p-10 space-y-8">
                    <div className="flex items-start gap-5">
                        <div className="p-3 bg-brand-primary-50 rounded-2xl text-brand-primary-600 border border-brand-primary-100">
                            <Key size={32} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-neutral-900">AI Intelligence Engine</h2>
                            <p className="text-neutral-500 font-medium max-w-xl text-sm leading-relaxed">
                                Configure your Google Gemini API key to enable AI-powered features such as
                                Staffing Analysis, Backlog Generation, and Strategic Blueprints.
                            </p>
                        </div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 md:p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">
                                Google Gemini API Key
                            </label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Enter your API Key (starts with AIza...)"
                                    value={apiKey}
                                    onChange={(e) => {
                                        setApiKey(e.target.value);
                                        setIsSaved(false);
                                        setError(null);
                                    }}
                                    className="h-14 pl-12 pr-4 rounded-xl border-neutral-200 bg-white font-mono text-sm shadow-sm focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <Shield size={18} />
                                </div>
                            </div>
                            <p className="text-[11px] text-neutral-400 font-medium ml-1 flex items-center gap-1.5">
                                <AlertCircle size={12} />
                                Your key is stored locally in your browser and is never sent to our servers.
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-200/50">
                            <div className="flex items-center gap-2">
                                {isSaved && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
                                    >
                                        <CheckCircle2 size={14} />
                                        <span className="text-[11px] font-black uppercase tracking-wide">Configuration Saved</span>
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"
                                    >
                                        <AlertCircle size={14} />
                                        <span className="text-[11px] font-black uppercase tracking-wide">{error}</span>
                                    </motion.div>
                                )}
                            </div>

                            <Button
                                onClick={handleSave}
                                className="h-12 px-8 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-brand-primary-600/20 active:scale-95 transition-all"
                            >
                                <Save size={18} className="mr-2" />
                                Save Preferences
                            </Button>
                        </div>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
};

export default SettingsPage;
