import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('[ErrorBoundary] Caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return <ErrorFallback
                error={this.state.error}
                onRetry={this.handleRetry}
                onReload={this.handleReload}
                onGoHome={this.handleGoHome}
            />;
        }
        return this.props.children;
    }
}

const ErrorFallback = ({ error, onRetry, onReload, onGoHome }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <div className="min-h-screen bg-surface-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto mb-8 relative"
                >
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full scale-150" />
                    <div className="relative w-20 h-20 mx-auto rounded-3xl bg-white border border-red-100 shadow-elevation flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-3xl font-black tracking-tight text-neutral-900 mb-3"
                >
                    Something went wrong
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-sm font-medium text-neutral-500 leading-relaxed max-w-sm mx-auto mb-10"
                >
                    An unexpected error occurred while rendering this page.
                    Don't worry — your data is safe. Try one of the options below.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
                >
                    {/* Primary: Try Again */}
                    <button
                        onClick={onRetry}
                        className="group flex items-center gap-2.5 h-12 px-8 rounded-2xl bg-neutral-900 text-white font-bold text-sm tracking-tight shadow-xl shadow-black/10 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                    >
                        <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                        Try Again
                    </button>

                    {/* Secondary: Back to Dashboard */}
                    <button
                        onClick={onGoHome}
                        className="group flex items-center gap-2.5 h-12 px-8 rounded-2xl bg-white text-neutral-700 font-bold text-sm tracking-tight border border-surface-border shadow-subtle hover:border-brand-primary-200 hover:text-brand-primary-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>

                    {/* Tertiary: Reload */}
                    <button
                        onClick={onReload}
                        className="flex items-center gap-2 h-12 px-6 rounded-2xl text-neutral-400 font-semibold text-sm hover:text-neutral-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </motion.div>

                {/* Error Details (collapsible) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors"
                    >
                        <Bug className="w-3.5 h-3.5" />
                        {showDetails ? 'Hide' : 'Show'} Error Details
                    </button>

                    {showDetails && error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-4 rounded-2xl bg-red-50/50 border border-red-100 text-left overflow-auto max-h-48"
                        >
                            <p className="text-xs font-bold text-red-600 mb-1">{error.name}: {error.message}</p>
                            <pre className="text-[10px] text-red-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
                                {error.stack?.split('\n').slice(1, 6).join('\n')}
                            </pre>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ErrorBoundary;
