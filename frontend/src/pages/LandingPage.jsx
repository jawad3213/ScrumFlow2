import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { motion } from 'framer-motion';
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
    X,
    Code2
} from 'lucide-react';
import logo from '../assets/genralLogo.png';

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    // Auth-aware CTA: logged in → go to dashboard, logged out → go to login
    const ctaLink = isAuthenticated ? '/dashboard' : '/login';
    const ctaLabel = isAuthenticated ? 'Accéder à votre plateforme' : 'Se connecter';

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-surface-border shadow-subtle'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3"
                        >
                            <motion.img
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                src={logo}
                                alt="ScrumFlow Logo"
                                className="h-12 w-auto"
                            />
                        </motion.div>

                        {/* Desktop Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="hidden md:flex items-center gap-8"
                        >
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href="#features"
                                className="text-sm font-bold text-neutral-600 hover:text-brand-primary-500 transition-colors"
                            >
                                Fonctionnalités
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href="#ai-process"
                                className="text-sm font-bold text-neutral-600 hover:text-brand-primary-500 transition-colors"
                            >
                                Processus IA
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href="#how-it-works"
                                className="text-sm font-bold text-neutral-600 hover:text-brand-primary-500 transition-colors"
                            >
                                Comment ça marche
                            </motion.a>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={ctaLink}
                                    className="px-6 py-2.5 bg-brand-primary-500 text-white text-sm font-black rounded-xl hover:bg-brand-primary-600 transition-all duration-default shadow-subtle hover:shadow-dropdown"
                                >
                                    {ctaLabel}
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-surface-border shadow-dropdown"
                    >
                        <div className="px-6 py-4 space-y-3">
                            <a href="#features" className="block py-2 text-sm font-bold text-neutral-600 hover:text-brand-primary-500">
                                Fonctionnalités
                            </a>
                            <a href="#ai-process" className="block py-2 text-sm font-bold text-neutral-600 hover:text-brand-primary-500">
                                Processus IA
                            </a>
                            <a href="#how-it-works" className="block py-2 text-sm font-bold text-neutral-600 hover:text-brand-primary-500">
                                Comment ça marche
                            </a>
                            <Link to={ctaLink} className="block w-full px-6 py-2.5 bg-brand-primary-500 text-white text-sm font-black rounded-xl text-center">
                                {ctaLabel}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 -z-20 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                        linear-gradient(to bottom, #000 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                {/* Decorative Dots */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 right-20 w-32 h-32"
                    >
                        <div className="absolute inset-0 grid grid-cols-4 gap-3">
                            {[...Array(16)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                    className="w-2 h-2 rounded-full bg-brand-primary-500"
                                />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-32 left-20 w-24 h-24"
                    >
                        <div className="absolute inset-0 grid grid-cols-3 gap-3">
                            {[...Array(9)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0.5, 0.3]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        delay: i * 0.15
                                    }}
                                    className="w-2 h-2 rounded-full bg-purple-500"
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 50, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-20 left-10 w-72 h-72 bg-brand-primary-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -50, 0],
                            rotate: [0, -45, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 1],
                            y: [0, -50, 0],
                            x: [0, 30, 0]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-50 border border-brand-primary-200 rounded-full mb-8"
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-brand-primary-600" />
                            </motion.div>
                            <span className="text-xs font-black text-brand-primary-700 uppercase tracking-wide">
                                Gestion de Projet par IA
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl lg:text-7xl font-black text-neutral-900 tracking-tight mb-6 leading-tight relative"
                        >
                            {/* Decorative sparkles around headline */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -left-6 text-brand-primary-500"
                            >
                                <Sparkles className="w-6 h-6 opacity-40" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    y: [0, 10, 0],
                                    rotate: [360, 180, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -top-4 -right-8 text-purple-500"
                            >
                                <Sparkles className="w-5 h-5 opacity-40" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 180, 270, 360]
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -bottom-4 left-1/4 text-cyan-500"
                            >
                                <Zap className="w-5 h-5 opacity-30" />
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Transformez vos Idées en
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, type: "spring" }}
                                className="block bg-gradient-to-r from-brand-primary-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
                            >
                                Sprints Exécutables
                            </motion.span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="text-xl lg:text-2xl text-neutral-600 font-medium mb-12 leading-relaxed"
                        >
                            Téléchargez vos besoins de projet et laissez l'IA gérer l'analyse, l'estimation des coûts,
                            la planification technique et l'affectation de l'équipe automatiquement.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={ctaLink}
                                    className="group px-8 py-4 bg-brand-primary-500 text-white text-base font-black rounded-xl hover:bg-brand-primary-600 transition-all duration-default shadow-dropdown hover:shadow-xl flex items-center gap-2"
                                >
                                    {ctaLabel}
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                </Link>
                            </motion.div>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                href="#how-it-works"
                                className="px-8 py-4 bg-white border-2 border-surface-border text-neutral-900 text-base font-black rounded-xl hover:border-brand-primary-500 hover:bg-brand-primary-50 transition-all duration-default flex items-center gap-2"
                            >
                                Voir Comment Ça Marche
                                <ChevronRight className="w-5 h-5" />
                            </motion.a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto relative"
                        >
                            {/* Decorative shapes around stats */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-8 -left-8 w-16 h-16 border-4 border-brand-primary-200 rounded-lg opacity-20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-8 -right-8 w-12 h-12 border-4 border-purple-200 rounded-full opacity-20"
                            />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-0 right-1/4 w-6 h-6 bg-cyan-400 rounded-full opacity-20"
                            />

                            <motion.div
                                whileHover={{ scale: 1.1, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                                    className="text-3xl lg:text-4xl font-black text-brand-primary-500 mb-1"
                                >
                                    85%
                                </motion.div>
                                <div className="text-sm font-bold text-neutral-600">Plus Rapide</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                                    className="text-3xl lg:text-4xl font-black text-purple-500 mb-1"
                                >
                                    10x
                                </motion.div>
                                <div className="text-sm font-bold text-neutral-600">Plus Précis</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                                    className="text-3xl lg:text-4xl font-black text-cyan-500 mb-1"
                                >
                                    100%
                                </motion.div>
                                <div className="text-sm font-bold text-neutral-600">Automatisé</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-surface-background relative overflow-hidden">
                {/* Decorative floating elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-20 h-20 border-2 border-purple-300 rounded-lg opacity-10"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-20 w-16 h-16 border-2 border-cyan-300 rounded-full opacity-10"
                />

                {/* Gradient orbs */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tl from-cyan-200 to-transparent rounded-full blur-3xl opacity-20" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-6"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Zap className="w-4 h-4 text-purple-600" />
                            </motion.div>
                            <span className="text-xs font-black text-purple-700 uppercase tracking-wide">
                                Fonctionnalités Puissantes
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4"
                        >
                            Tout pour Livrer Plus Vite
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-neutral-600"
                        >
                            Des exigences à l'exécution, ScrumFlow gère chaque aspect de la planification de projet avec la précision de l'IA.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                        {/* Floating decorative badges */}
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-sm hidden lg:block"
                        />
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -5, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-10 left-1/3 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-sm hidden lg:block"
                        />

                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{
                                    y: -10,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                className="group p-8 bg-white border border-surface-border rounded-2xl hover:shadow-dropdown hover:border-brand-primary-200 transition-all duration-default relative overflow-hidden"
                            >
                                {/* Card corner decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />

                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className={`inline-flex p-3 ${feature.color} rounded-xl mb-6 relative z-10`}
                                >
                                    <feature.icon className="w-6 h-6 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-black text-neutral-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Analysis Phases Section */}
            <section id="ai-process" className="py-20 bg-white relative overflow-hidden">
                {/* Diagonal lines decoration */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent transform -rotate-12 origin-left" style={{ top: '20%' }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent transform -rotate-12 origin-left" style={{ top: '40%' }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent transform -rotate-12 origin-left" style={{ top: '60%' }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent transform -rotate-12 origin-left" style={{ top: '80%' }} />
                </div>

                {/* Decorative corner elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 right-10 w-24 h-24"
                >
                    <div className="absolute inset-0 border-t-4 border-r-4 border-blue-200 rounded-tr-3xl opacity-20" />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 left-10 w-32 h-32"
                >
                    <div className="absolute inset-0 border-b-4 border-l-4 border-purple-200 rounded-bl-3xl opacity-20" />
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Brain className="w-4 h-4 text-blue-600" />
                            </motion.div>
                            <span className="text-xs font-black text-blue-700 uppercase tracking-wide">
                                Processus d'Analyse Profond
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4"
                        >
                            3 Phases pour la Réussite
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-neutral-600"
                        >
                            Notre IA ne se contente pas de lire votre projet, elle le structure comme un CTO expert.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Phase 1: Analyse Stratégique */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="group relative bg-surface-background border border-surface-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                            <motion.div
                                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6"
                            >
                                <BarChart3 className="w-7 h-7 text-blue-600" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-neutral-900 mb-2">
                                01. Analyse Stratégique
                            </h3>
                            <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider mb-6">
                                Vision & Budget
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { text: "Calcul précis des coûts ", highlight: "CAPEX & OPEX" },
                                    { text: "Sélection des profils idéaux (Senior, Junior...)", highlight: null },
                                    { text: "Estimation de la durée de développement", highlight: null }
                                ].map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        </motion.div>
                                        <span className="text-neutral-700 font-medium">
                                            {item.text}
                                            {item.highlight && <span className="text-blue-600 font-bold">{item.highlight}</span>}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Phase 2: Plan Technique */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="group relative bg-surface-background border border-surface-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                            <motion.div
                                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            />
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6"
                            >
                                <Code2 className="w-7 h-7 text-purple-600" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-neutral-900 mb-2">
                                02. Plan Technique
                            </h3>
                            <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider mb-6">
                                Architecture & Risques
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { text: "Stack Choice : ", highlight: "1er & 2nd choix tech" },
                                    { text: "Analyse des risques & challenges techniques", highlight: null },
                                    { text: "Guides & Tips pour les devs juniors", highlight: null }
                                ].map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                        </motion.div>
                                        <span className="text-neutral-700 font-medium">
                                            {item.text}
                                            {item.highlight && <span className="text-purple-600 font-bold">{item.highlight}</span>}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Phase 3: Équipe Projet */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="group relative bg-surface-background border border-surface-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
                            <motion.div
                                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            />
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6"
                            >
                                <Users className="w-7 h-7 text-emerald-600" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-neutral-900 mb-2">
                                03. Équipe Projet
                            </h3>
                            <p className="text-neutral-500 font-bold text-sm uppercase tracking-wider mb-6">
                                Allocation & Action
                            </p>
                            <ul className="space-y-3">
                                {[
                                    { text: "Allocation manuelle des membres actifs", highlight: null },
                                    { text: "Répartition optimisée des tâches", highlight: null },
                                    { text: "Génération automatique des sprints", highlight: null }
                                ].map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        </motion.div>
                                        <span className="text-neutral-700 font-medium">{item.text}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 relative overflow-hidden">
                {/* Decorative circles pattern */}
                <div className="absolute inset-0 -z-10">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 left-10 w-40 h-40 rounded-full border-4 border-brand-primary-300"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.08, 0.05] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-1/2 right-20 w-32 h-32 rounded-full border-4 border-purple-300"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
                        transition={{ duration: 12, repeat: Infinity }}
                        className="absolute bottom-20 left-1/3 w-28 h-28 rounded-full border-4 border-cyan-300"
                    />
                </div>

                {/* Plus signs decoration */}
                <div className="absolute inset-0 -z-10 opacity-[0.03]">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                            className="absolute"
                            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 15}%` }}
                        >
                            <div className="text-4xl font-bold text-neutral-900">+</div>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-6"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Target className="w-4 h-4 text-cyan-600" />
                            </motion.div>
                            <span className="text-xs font-black text-cyan-700 uppercase tracking-wide">
                                Processus Simple
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4"
                        >
                            Commencez en 3 Étapes
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-neutral-600"
                        >
                            Du cahier des charges aux sprints prêts à l'exécution en quelques minutes, pas des semaines.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 100 }}
                                className="relative"
                            >
                                {index < steps.length - 1 && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                                        className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand-primary-500 to-purple-500 opacity-20 origin-left"
                                    />
                                )}

                                <motion.div
                                    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                                    className="relative bg-white border-2 border-surface-border rounded-2xl p-8 hover:border-brand-primary-500 hover:shadow-dropdown transition-all duration-default overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50/0 to-purple-50/0 hover:from-brand-primary-50/30 hover:to-purple-50/30 transition-all duration-500 rounded-2xl" />
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                                        className="absolute top-2 right-2 w-2 h-2 bg-brand-primary-400 rounded-full"
                                    />
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 200, delay: index * 0.2 + 0.3 }}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-purple-500 text-white text-2xl font-black rounded-2xl mb-6 shadow-lg"
                                    >
                                        {step.number}
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 + 0.4 }}
                                        className="text-2xl font-black text-neutral-900 mb-4"
                                    >
                                        {step.title}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 + 0.5 }}
                                        className="text-neutral-600 font-medium leading-relaxed"
                                    >
                                        {step.description}
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-primary-500 via-purple-500 to-cyan-500 relative overflow-hidden">
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }} />
                </div>

                {/* Animated lines */}
                <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-0 right-0 h-px bg-white opacity-20"
                />
                <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/3 left-0 right-0 h-px bg-white opacity-20"
                />

                {/* Animated Background Elements */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
                />

                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6"
                    >
                        Prêt à Transformer Votre Gestion de Projet ?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-white/90 mb-10 font-medium"
                    >
                        Rejoignez les équipes qui livrent déjà plus vite grâce à la planification par IA.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/login"
                                className="group px-8 py-4 bg-white text-brand-primary-600 text-base font-black rounded-xl hover:bg-neutral-50 transition-all duration-default shadow-xl hover:shadow-2xl flex items-center gap-2"
                            >
                                Se connecter
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center gap-8 mb-12"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                                <img src={logo} alt="Logo ScrumFlow" className="h-10 w-auto brightness-0 invert" />
                            </motion.div>
                            <p className="text-sm text-neutral-400 font-medium text-center">
                                Gestion de projet alimentée par l'IA pour les équipes modernes.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-sm text-neutral-400 font-medium">
                            © 2026 ScrumFlow. Tous droits réservés.
                        </p>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
