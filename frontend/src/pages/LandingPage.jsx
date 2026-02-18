import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Sparkles,
    Zap,
    Target,
    Users,
    TrendingUp,
    CheckCircle2,
    Brain,
    Clock,
    BarChart3,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import logo from '../assets/genralLogo.png';

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Brain,
            title: "Analyse IA",
            description: "Téléchargez les spécifications de votre projet et laissez notre IA analyser les besoins, estimer les coûts et suggérer des solutions techniques optimales.",
            color: "bg-brand-primary-500"
        },
        {
            icon: Target,
            title: "Planification en 3 Phases",
            description: "Obtenez des répartitions complètes couvrant l'analyse des besoins, les exigences techniques et la planification de sprint automatiquement.",
            color: "bg-purple-500"
        },
        {
            icon: Users,
            title: "Affectation Intelligente",
            description: "L'IA assigne intelligemment les tâches aux membres de l'équipe en fonction des compétences, de la disponibilité et des exigences du projet.",
            color: "bg-cyan-500"
        },
        {
            icon: TrendingUp,
            title: "Optimisation de Sprint",
            description: "Générez des plannings de sprint optimisés avec des délais réalistes et une allocation des ressources.",
            color: "bg-emerald-500"
        },
        {
            icon: Clock,
            title: "Suivi en Temps Réel",
            description: "Surveillez la progression du projet avec des mises à jour en direct et des prédictions de progression intelligentes.",
            color: "bg-orange-500"
        },
        {
            icon: BarChart3,
            title: "Gestion de Portefeuille",
            description: "Gérez plusieurs projets avec des budgets consolidés, une matrice de talents et un suivi de l'engagement.",
            color: "bg-pink-500"
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Télécharger le Brief Projet",
            description: "Téléchargez simplement vos exigences de projet, spécifications ou description d'idée au format PDF."
        },
        {
            number: "02",
            title: "Analyse IA",
            description: "Notre IA traite vos exigences et génère une analyse complète à travers toutes les phases du projet."
        },
        {
            number: "03",
            title: "Réviser & Exécuter",
            description: "Révisez la répartition automatisée, assignez les équipes et commencez à exécuter avec des sprints optimisés."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-xl border-b border-surface-border shadow-subtle'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="ScrumFlow Logo" className="h-12 w-auto" />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-bold text-neutral-600 hover:text-brand-primary-500 transition-colors">
                                Fonctionnalités
                            </a>
                            <a href="#how-it-works" className="text-sm font-bold text-neutral-600 hover:text-brand-primary-500 transition-colors">
                                Comment ça marche
                            </a>
                            <Link
                                to="/login"
                                className="px-6 py-2.5 bg-brand-primary-500 text-white text-sm font-black rounded-xl hover:bg-brand-primary-600 transition-all duration-default shadow-subtle hover:shadow-dropdown"
                            >
                                Se connecter
                            </Link>

                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-surface-border shadow-dropdown">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#features" className="block py-2 text-sm font-bold text-neutral-600 hover:text-brand-primary-500">
                                Fonctionnalités
                            </a>
                            <a href="#how-it-works" className="block py-2 text-sm font-bold text-neutral-600 hover:text-brand-primary-500">
                                Comment ça marche
                            </a>
                            <Link to="/login" className="block w-full px-6 py-2.5 bg-brand-primary-500 text-white text-sm font-black rounded-xl text-center">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-50 border border-brand-primary-200 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-brand-primary-600" />
                            <span className="text-xs font-black text-brand-primary-700 uppercase tracking-wide">
                                Gestion de Projet par IA
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-black text-neutral-900 tracking-tight mb-6 leading-tight">
                            Transformez vos Idées en
                            <span className="block bg-gradient-to-r from-brand-primary-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                Sprints Exécutables
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl lg:text-2xl text-neutral-600 font-medium mb-12 leading-relaxed">
                            Téléchargez vos besoins de projet et laissez l'IA gérer l'analyse, l'estimation des coûts,
                            la planification technique et l'affectation de l'équipe automatiquement.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/login"
                                className="group px-8 py-4 bg-brand-primary-500 text-white text-base font-black rounded-xl hover:bg-brand-primary-600 transition-all duration-default shadow-dropdown hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                Se connecter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="px-8 py-4 bg-white border-2 border-surface-border text-neutral-900 text-base font-black rounded-xl hover:border-brand-primary-500 hover:bg-brand-primary-50 transition-all duration-default flex items-center gap-2"
                            >
                                Voir Comment Ça Marche
                                <ChevronRight className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div>
                                <div className="text-3xl lg:text-4xl font-black text-brand-primary-500 mb-1">85%</div>
                                <div className="text-sm font-bold text-neutral-600">Plus Rapide</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-black text-purple-500 mb-1">10x</div>
                                <div className="text-sm font-bold text-neutral-600">Plus Précis</div>
                            </div>
                            <div>
                                <div className="text-3xl lg:text-4xl font-black text-cyan-500 mb-1">100%</div>
                                <div className="text-sm font-bold text-neutral-600">Automatisé</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-surface-background">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-6">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-black text-purple-700 uppercase tracking-wide">
                                Fonctionnalités Puissantes
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4">
                            Tout pour Livrer Plus Vite
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Des exigences à l'exécution, ScrumFlow gère chaque aspect de la planification de projet avec la précision de l'IA.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-white border border-surface-border rounded-2xl hover:shadow-dropdown hover:border-brand-primary-200 transition-all duration-default"
                            >
                                <div className={`inline-flex p-3 ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-6">
                            <Target className="w-4 h-4 text-cyan-600" />
                            <span className="text-xs font-black text-cyan-700 uppercase tracking-wide">
                                Processus Simple
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4">
                            Commencez en 3 Étapes
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Du cahier des charges aux sprints prêts à l'exécution en quelques minutes, pas des semaines.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand-primary-500 to-purple-500 opacity-20" />
                                )}

                                <div className="relative bg-white border-2 border-surface-border rounded-2xl p-8 hover:border-brand-primary-500 hover:shadow-dropdown transition-all duration-default">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-purple-500 text-white text-2xl font-black rounded-2xl mb-6 shadow-lg">
                                        {step.number}
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-neutral-600 font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-primary-500 via-purple-500 to-cyan-500">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
                        Prêt à Transformer Votre Gestion de Projet ?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 font-medium">
                        Rejoignez les équipes qui livrent déjà plus vite grâce à la planification par IA.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="group px-8 py-4 bg-white text-brand-primary-600 text-base font-black rounded-xl hover:bg-neutral-50 transition-all duration-default shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Se connecter
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center gap-8 mb-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="Logo ScrumFlow" className="h-10 w-auto brightness-0 invert" />
                            </div>
                            <p className="text-sm text-neutral-400 font-medium text-center">
                                Gestion de projet alimentée par l'IA pour les équipes modernes.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-neutral-400 font-medium">
                            © 2026 ScrumFlow. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
