import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/genralLogo.png';

const AuthLayout = ({
    children,
    illustration,
    illustrationAlt = "Illustration",
    title,
    subtitle,
    logoPath = "/login",
    illustrationContent
}) => {
    return (
        <div className="min-h-screen flex bg-surface-background relative">
            {/* Back to Home Arrow */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-500 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-all duration-200 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold hidden sm:inline">Accueil</span>
            </Link>

            {/* Left Column: Form Container */}
            <div className="w-full lg:w-[480px] bg-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 shadow-elevation z-10 overflow-y-auto">
                <div className="mb-10 flex flex-col items-center">
                    <Link to={logoPath}>
                        <img src={logo} alt="growtrack Logo" className="h-20 w-auto mb-6 object-contain hover:scale-105 transition-transform" />
                    </Link>
                    {title && <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{title}</h1>}
                    {subtitle && <p className="text-sm text-neutral-500 font-medium mt-1.5 text-center">{subtitle}</p>}
                </div>
                {children}
            </div>

            {/* Right Column: Illustration */}
            <div className="hidden lg:flex flex-1 bg-surface-background items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-secondary-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-[550px] w-full transform hover:scale-105 transition-transform duration-default ease-soft relative z-10">
                    {illustrationContent ? illustrationContent : (
                        <img
                            src={illustration}
                            alt={illustrationAlt}
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
