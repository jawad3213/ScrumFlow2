import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, FileUp, Files, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';
import { EmptyState } from '@/components/ui/empty-state';

const cascadeContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const cascadeItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

const RequirementUpload = ({ onFileSelected, isLoading, error }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        console.log("File Selected:", selectedFile.name, selectedFile.type);

        const isPDF = selectedFile.type === 'application/pdf' ||
            selectedFile.type === 'application/x-pdf' ||
            selectedFile.name.toLowerCase().endsWith('.pdf');

        if (!isPDF) {
            alert("Please upload a PDF file");
            return;
        }
        setFile(selectedFile);
    };

    const triggerAnalysis = () => {
        if (file) {
            onFileSelected(file);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="w-full space-y-8 flex flex-col items-center py-8"
        >
            <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
            />

            <AnimatePresence>
                {!file ? (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={cn(
                            "w-full flex justify-center",
                            isDragging && "scale-[1.02] transition-transform"
                        )}
                    >
                        <EmptyState
                            title="Project Scoping"
                            description="Upload your PRD or Project Specifications PDF.\nGemini will decompose it into a technical blueprint."
                            icons={[FileText, FileUp, Files]}
                            action={{
                                label: isLoading ? "Analyzing..." : "Select PDF Document",
                                onClick: () => {
                                    console.log("Triggering file selection...");
                                    fileInputRef.current?.click();
                                }
                            }}
                            className={cn(
                                isDragging && "border-brand-primary-500 bg-brand-primary-50/20"
                            )}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="selected-file"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-[620px] bg-white border-2 border-emerald-500/20 rounded-[40px] p-10 flex flex-col items-center gap-6 relative shadow-2xl shadow-emerald-500/5 group"
                    >
                        <button
                            onClick={clearFile}
                            className="absolute top-6 right-6 p-2.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 -z-10"></div>
                            <FileText size={40} />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg"
                            >
                                <CheckSquare className="text-emerald-500" size={16} />
                            </motion.div>
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Scoping Document Validated</h3>
                            <p className="text-sm font-bold text-neutral-500 truncate max-w-[400px] bg-neutral-50 px-4 py-1.5 rounded-full border border-neutral-100 italic">{file.name}</p>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-2">Ready for Intelligence Extraction</p>
                        </div>

                        <motion.button
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                console.log("Launching Analysis for:", file.name);
                                triggerAnalysis();
                            }}
                            disabled={isLoading}
                            className="w-full mt-6 h-14 bg-neutral-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Synthesizing Blueprint...
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={20} className="text-brand-primary-400" />
                                    Launch AI Analysis
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[620px] bg-red-50 border-2 border-red-100/50 rounded-[48px] overflow-hidden shadow-2xl shadow-red-500/10"
                >
                    {/* Error Header */}
                    <div className="px-10 py-8 border-b border-red-100/50 bg-red-100/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-xl">
                                <AlertCircle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-red-900 uppercase tracking-widest leading-none mb-1">
                                    {typeof error === 'object' ? error.title : 'Intelligence Engine Error'}
                                </h3>
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest italic opacity-70">
                                    Synthesis Aborted
                                </p>
                            </div>
                        </div>
                        {typeof error === 'object' && error.type === 'AUTH' && (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        )}
                    </div>

                    {/* Error Content */}
                    <div className="p-10 space-y-8">
                        <div className="space-y-4">
                            <p className="text-[15px] font-bold text-neutral-800 leading-relaxed">
                                {typeof error === 'object' ? error.message : error}
                            </p>

                            {typeof error === 'object' && error.tip && (
                                <div className="p-4 bg-white/60 border border-white rounded-2xl flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                                    <p className="text-[11px] text-neutral-500 font-medium italic">
                                        <span className="font-black text-neutral-700 not-italic uppercase tracking-tighter mr-2">Guidance:</span>
                                        {error.tip}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {typeof error === 'object' && error.onAction && (
                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={error.onAction}
                                className="w-full h-14 bg-white border-2 border-red-100 hover:border-red-200 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all flex items-center justify-center gap-3"
                            >
                                {error.actionLabel}
                                <ChevronRight size={16} />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RequirementUpload;
