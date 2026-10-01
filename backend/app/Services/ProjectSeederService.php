<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
use App\Models\ProjectBlueprintTask;
use App\Models\EstimatedGain;
use App\Models\InfrastructureCost;
use App\Models\RoiProjection;
use App\Models\ProjectKpi;
use App\Models\ProjectRisk;
use App\Models\User;
use Carbon\Carbon;

class ProjectSeederService
{
    /**
     * Create a fully pre-analyzed demo project for a given user.
     * This project uses the "test" analysis data provided by the user.
     */
    public static function seedForUser(User $user): Project
    {
        $project = Project::create([
            'name' => 'test',
            'description' => 'A strategic task management platform designed to optimize project lifecycle for Moroccan enterprises through digitalization of task workflows, employee management, and real-time monitoring.',
            'user_id' => $user->id,
            'start_date' => Carbon::now()->toDateString(),
            'estimated_duration_months' => 7,
            'total_capex' => 1336300,
            'total_opex' => 183000,
            'total_project_cost' => 1519300,
            'total_gain_value' => 518000,
            'annual_opex_value' => 183000,
            'roi_percentage' => -17.57,
            'break_even_point_months' => 48,
            'roi_analysis_summary' => "- L'investissement initial (CAPEX) est significatif en raison de la constitution d'une équipe de développement robuste et d'un budget de contingence.\n- Les coûts opérationnels annuels (OPEX) sont gérables et prévisibles après la phase de développement.\n- Le projet ne devrait pas atteindre son point d'équilibre financier (break-even point) avant le 48ème mois (4 ans), ce qui est au-delà de la projection de 3 ans.\n- Le Retour sur Investissement (ROI) reste négatif sur l'ensemble de la période de projection de 3 ans, indiquant que ce projet est un investissement stratégique à long terme plutôt qu'un générateur de profit rapide.\n- Les bénéfices financiers proviennent principalement de l'amélioration de l'efficacité interne et de la productivité des employés, plutôt que de la génération directe de revenus.\n- Il est crucial de considérer les avantages non-monétaires tels que l'amélioration de la visibilité des tâches, la meilleure collaboration et la réduction du stress lié à la gestion manuelle, qui sont essentiels pour la croissance et le bon fonctionnement de l'entreprise dans l'écosystème marocain.",
            'stack_name' => 'The Laravel-React Azure Powerhouse',
            'stack_analysis_data' => self::getStackAnalysisData(),
        ]);

        // =====================================================================
        // ASSIGNED ENGINEERS (CAPEX - Development Team)
        // =====================================================================
        $devTeam = [
            ['role' => 'Backend Developer',   'level' => 'Senior',    'salary' => 30000, 'months' => 7],
            ['role' => 'UI/UX Designer',      'level' => 'Senior',    'salary' => 23000, 'months' => 7],
            ['role' => 'DevOps Engineer',      'level' => 'Senior',    'salary' => 35500, 'months' => 7],
            ['role' => 'QA Engineer',          'level' => 'Junior',    'salary' => 10500, 'months' => 7],
            ['role' => 'Project Manager',      'level' => 'Senior PM', 'salary' => 35000, 'months' => 7],
            ['role' => 'Fullstack Developer',  'level' => 'Senior',    'salary' => 31000, 'months' => 7],
        ];

        foreach ($devTeam as $eng) {
            $spec = \App\Models\Specialization::firstOrCreate(
                ['name' => $eng['role'], 'level' => $eng['level']],
                ['salary' => $eng['salary']]
            );

            \App\Models\AssignedEngineer::create([
                'project_id' => $project->id,
                'specialization_id' => $spec->id,
                'phase' => 'development',
                'months_assigned' => $eng['months'],
            ]);
        }

        // =====================================================================
        // SETUP & INFRASTRUCTURE (CAPEX - Fixed Costs)
        // =====================================================================
        $setupCosts = [
            [
                'name' => 'Licence Service Email API',
                'cost' => 2000,
                'desc' => "Coût d'intégration et d'abonnement initial pour un service d'envoi d'emails (ex: SendGrid) pour les notifications et réinitialisations de mot de passe.",
                'formule' => "Coût fixe unique pour l'intégration et la configuration des services d'envoi d'emails.",
            ],
            [
                'name' => 'Licences Outils de Développement et Assets',
                'cost' => 5000,
                'desc' => "Licences pour des outils de développement premium, des bibliothèques de composants UI/UX, ou des assets graphiques utilisés pendant la phase de développement.",
                'formule' => "Coût fixe unique pour l'acquisition de licences logicielles et d'assets.",
            ],
            [
                'name' => 'Contingency Buffer (15%)',
                'cost' => 174300,
                'desc' => "Marge de sécurité pour couvrir les imprévus et les dépassements de coûts éventuels.",
                'formule' => "15% du Base Investment (1,162,000 MAD)",
            ],
        ];

        foreach ($setupCosts as $s) {
            InfrastructureCost::create([
                'project_id'  => $project->id,
                'type'        => 'capex',
                'item_name'   => $s['name'],
                'cost_mad'    => $s['cost'],
                'formule'     => $s['formule'],
                'description' => $s['desc'],
            ]);
        }

        // =====================================================================
        // OPEX - Support & Maintenance Engineers
        // =====================================================================
        $opexEngineers = [
            ['role' => 'Backend Developer',  'level' => 'Mid-level', 'salary' => 16000, 'months' => 12],
            ['role' => 'Frontend Developer', 'level' => 'Junior',    'salary' => 8500,  'months' => 12],
        ];

        foreach ($opexEngineers as $eng) {
            $spec = \App\Models\Specialization::firstOrCreate(
                ['name' => $eng['role'], 'level' => $eng['level']],
                ['salary' => $eng['salary']]
            );

            \App\Models\AssignedEngineer::create([
                'project_id' => $project->id,
                'specialization_id' => $spec->id,
                'phase' => 'maintenance',
                'months_assigned' => $eng['months'],
            ]);
        }

        // =====================================================================
        // OPEX - Cloud Services
        // =====================================================================
        InfrastructureCost::create([
            'project_id'  => $project->id,
            'type'        => 'opex',
            'item_name'   => 'Microsoft Azure Hosting',
            'cost_mad'    => 36000,
            'formule'     => '3000 MAD/mois * 12 mois',
            'description' => "Coût annuel estimé pour l'hébergement de l'application (App Service, Azure Database for PostgreSQL, monitoring) sur Microsoft Azure.",
        ]);

        // =====================================================================
        // ESTIMATED GAINS
        // =====================================================================
        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name'  => "Gains d'efficacité administrative",
            'cost_mad'   => 208000,
            'description' => "Économies réalisées grâce à la digitalisation des processus et à la réduction du temps passé par les managers sur la gestion manuelle des tâches.",
        ]);

        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name'  => "Augmentation de la productivité des employés",
            'cost_mad'   => 260000,
            'description' => "Gains de productivité résultant d'une meilleure clarté des tâches et d'une réduction des interruptions et des erreurs pour les employés.",
        ]);

        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name'  => "Réduction des erreurs et amélioration des délais",
            'cost_mad'   => 50000,
            'description' => "Économies indirectes liées à la diminution des erreurs, des retards, des coûts de reprise et une meilleure prise de décision grâce à un suivi en temps réel.",
        ]);

        // =====================================================================
        // ROI PROJECTIONS (3 Years)
        // =====================================================================
        $projections = [
            ['year' => 1, 'costs' => 1519300, 'gains' => 518000,  'roi' => -65.9],
            ['year' => 2, 'costs' => 1702300, 'gains' => 1036000, 'roi' => -39.1],
            ['year' => 3, 'costs' => 1885300, 'gains' => 1554000, 'roi' => -17.6],
        ];

        foreach ($projections as $p) {
            RoiProjection::create([
                'project_id'       => $project->id,
                'year_number'      => $p['year'],
                'cumulative_costs' => $p['costs'],
                'cumulative_gains' => $p['gains'],
                'net_cash_flow'    => $p['gains'] - $p['costs'],
                'roi_percentage'   => $p['roi'],
            ]);
        }

        // =====================================================================
        // KPIs (Non-Financial)
        // =====================================================================
        $kpis = [
            [
                'name'   => "Taux d'adoption des utilisateurs",
                'target' => "80% des employés actifs",
                'method' => "Suivi des connexions et de l'activité utilisateur via le tableau de bord administrateur",
            ],
            [
                'name'   => "Taux d'achèvement des tâches",
                'target' => "90% des tâches assignées complétées à temps",
                'method' => "Rapports de tâches complétées dans le système, comparés aux deadlines",
            ],
            [
                'name'   => "Réduction du temps de gestion des tâches pour les chefs",
                'target' => "20% de temps économisé par chef",
                'method' => "Enquêtes auprès des managers et analyse du temps passé sur les anciennes méthodes vs. le nouveau système",
            ],
            [
                'name'   => "Satisfaction des utilisateurs",
                'target' => "Score de satisfaction moyen de 4/5",
                'method' => "Sondages internes et collecte de feedback utilisateur réguliers",
            ],
        ];

        foreach ($kpis as $k) {
            ProjectKpi::create([
                'project_id'         => $project->id,
                'metric_name'        => $k['name'],
                'target_value'       => $k['target'],
                'measurement_method' => $k['method'],
            ]);
        }

        // =====================================================================
        // RISKS
        // =====================================================================
        $risks = [
            [
                'name'       => "Résistance au changement des utilisateurs",
                'impact'     => "high",
                'probability'=> "medium",
                'mitigation' => "Former les utilisateurs tôt, communiquer clairement les bénéfices et impliquer les parties prenantes clés dès la phase de conception.",
            ],
            [
                'name'       => "Dépassement du budget CAPEX",
                'impact'     => "high",
                'probability'=> "medium",
                'mitigation' => "Utiliser le buffer de contingence de 15%, suivre les dépenses de près et prioriser les fonctionnalités essentielles.",
            ],
            [
                'name'       => "Complexité de l'intégration Azure",
                'impact'     => "medium",
                'probability'=> "medium",
                'mitigation' => "Prévoir une phase de spike technique en début de projet pour valider l'architecture cloud et former l'équipe DevOps.",
            ],
            [
                'name'       => "Délais de livraison",
                'impact'     => "high",
                'probability'=> "low",
                'mitigation' => "Utiliser la méthodologie Scrum avec des sprints de 2 semaines, des rétrospectives régulières et un backlog bien priorisé.",
            ],
            [
                'name'       => "Sécurité des données sensibles",
                'impact'     => "critical",
                'probability'=> "low",
                'mitigation' => "Implémenter Laravel Sanctum, Azure Key Vault pour les secrets, chiffrement des mots de passe et audits de sécurité réguliers.",
            ],
            [
                'name'       => "Courbe d'apprentissage pour les développeurs juniors",
                'impact'     => "low",
                'probability'=> "high",
                'mitigation' => "Pair programming, code reviews systématiques, documentation interne et accès aux ressources React/Laravel.",
            ],
        ];

        foreach ($risks as $r) {
            ProjectRisk::create([
                'project_id'          => $project->id,
                'risk_name'           => $r['name'],
                'impact'              => $r['impact'],
                'probability'         => $r['probability'],
                'mitigation_strategy' => $r['mitigation'],
            ]);
        }

        // =====================================================================
        // BACKLOG: EPICS, USER STORIES & TECHNICAL TASKS
        // =====================================================================

        // EP-1: Authentification et Sécurité
        $ep1 = ProjectEpic::create([
            'project_id'  => $project->id,
            'title'       => 'Authentification et Sécurité',
            'description' => "Bloc fonctionnel transversal pour la connexion sécurisée, la réinitialisation de mot de passe et la génération automatique de credentials pour les nouveaux comptes.",
        ]);

        // US-1.1: Connexion Utilisateur
        $us11 = ProjectStory::create([
            'project_epic_id'    => $ep1->id,
            'title'              => 'Connexion Utilisateur',
            'description'        => "En tant qu'utilisateur, je veux me connecter de manière sécurisée avec mon email et mot de passe, afin d'accéder à l'application.",
            'story_points'       => 8,
            'acceptance_criteria'=> [
                'Quand je saisis un email et mot de passe valides et clique sur "Connexion", alors je suis redirigé vers mon tableau de bord et un token d\'authentification est généré.',
                'Quand je saisis des identifiants invalides, alors un message d\'erreur clair "Email ou mot de passe incorrect" est affiché.',
                'Quand je laisse des champs vides, alors un message de validation est affiché pour chaque champ manquant.',
                'Le mot de passe doit être haché et salé côté serveur (bcrypt).',
                "L'authentification doit utiliser un mécanisme comme JWT/Sanctum pour l'API RESTful.",
            ],
            'external_id' => 'US-1.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us11->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Implémenter l'API de connexion Backend",
            'instructions'     => "Utiliser Laravel avec Sanctum pour gérer l'authentification basée sur les tokens. Créer un endpoint POST /api/login qui accepte email et mot de passe. Valider les entrées, vérifier les identifiants avec Hash::check, et générer un token Sanctum. Retourner le token en cas de succès, ou une erreur 401 en cas d'échec. Assurer la protection CSRF pour la session web si pertinent, sinon se concentrer sur l'API token-based.",
            'hours'            => 16,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us11->id,
            'role'             => 'Frontend Developer',
            'level'            => 'Junior',
            'title'            => "Développer l'interface de connexion Frontend",
            'instructions'     => "Créer une page de connexion React.js avec des champs email et mot de passe. Intégrer la validation des formulaires côté client. Appeler l'API /api/login et stocker le token JWT dans le localStorage ou un contexte applicatif. Rediriger l'utilisateur vers /dashboard en cas de succès. Gérer l'affichage des messages d'erreur de l'API. Utiliser Axios pour les appels HTTP.",
            'hours'            => 12,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us11->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Créer les tests unitaires et d'intégration pour l'authentification Backend",
            'instructions'     => "Écrire des tests PHPUnit pour l'endpoint /api/login. Tester les cas de succès (login valide), d'échec (email invalide, mot de passe incorrect) et de validation (champs manquants). Assurer une couverture de code minimale de 80% pour ce module critique.",
            'hours'            => 8,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us11->id,
            'role'             => 'QA Engineer',
            'level'            => 'Junior',
            'title'            => "Créer les tests unitaires et E2E pour l'interface de connexion",
            'instructions'     => "Écrire des tests Vitest pour les composants React de la page de connexion (validation front-end, gestion d'état). Utiliser Cypress pour des tests end-to-end : simuler la saisie d'identifiants valides/invalides, vérifier la redirection en cas de succès et l'affichage des messages d'erreur après interaction avec l'API.",
            'hours'            => 10,
        ]);

        // US-1.2: Réinitialisation de Mot de Passe
        $us12 = ProjectStory::create([
            'project_epic_id'    => $ep1->id,
            'title'              => 'Réinitialisation de Mot de Passe',
            'description'        => "En tant qu'utilisateur, je veux pouvoir réinitialiser mon mot de passe si je l'ai oublié, afin de retrouver l'accès à mon compte.",
            'story_points'       => 13,
            'acceptance_criteria'=> [
                'Quand je clique sur "Mot de passe oublié" et saisis mon email, alors un email contenant un lien de réinitialisation sécurisé est envoyé.',
                'Quand je clique sur le lien de réinitialisation, alors je suis dirigé vers une page où je peux définir un nouveau mot de passe.',
                'Le lien de réinitialisation doit expirer après un délai (ex: 60 minutes) et être à usage unique.',
                'Le nouveau mot de passe doit respecter des règles de complexité (min 8 caractères, majuscules, minuscules, chiffres, caractères spéciaux).',
                "Après une réinitialisation réussie, je suis redirigé vers la page de connexion et reçois un email de confirmation.",
            ],
            'external_id' => 'US-1.2',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us12->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Implémenter l'API de demande de réinitialisation",
            'instructions'     => "Utiliser les fonctionnalités intégrées de Laravel pour la réinitialisation de mot de passe (notifications, tokens). Créer un endpoint POST /api/forgot-password qui envoie un email avec un token de réinitialisation sécurisé (validité 60min, usage unique) à l'email fourni. Gérer les cas où l'email n'existe pas sans révéler cette information pour des raisons de sécurité.",
            'hours'            => 16,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us12->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Implémenter l'API de réinitialisation effective du mot de passe",
            'instructions'     => "Créer un endpoint POST /api/reset-password qui prend le token, l'email et le nouveau mot de passe. Valider le token et les règles de complexité du mot de passe. Hacher le nouveau mot de passe avec bcrypt et le stocker. Envoyer un email de confirmation de réinitialisation à l'utilisateur. S'assurer que le token est invalidé après utilisation.",
            'hours'            => 12,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us12->id,
            'role'             => 'Frontend Developer',
            'level'            => 'Junior',
            'title'            => "Développer les interfaces de 'Mot de passe oublié' et 'Définir nouveau mot de passe'",
            'instructions'     => "Créer les pages React.js correspondantes. La page 'Mot de passe oublié' doit avoir un champ email. La page 'Définir nouveau mot de passe' doit avoir deux champs pour le nouveau mot de passe et sa confirmation, et récupérer le token de l'URL. Gérer les appels API et les validations client pour la complexité des mots de passe. Afficher les messages de succès/erreur de manière appropriée.",
            'hours'            => 14,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us12->id,
            'role'             => 'DevOps Engineer',
            'level'            => 'Senior',
            'title'            => "Mettre en place un service d'envoi d'emails transactionnels",
            'instructions'     => "Configurer un service SMTP (ex: Mailgun, SendGrid ou Azure Communication Services) dans l'environnement de développement et de production pour l'envoi des emails de réinitialisation et de bienvenue. S'assurer de la conformité avec la configuration Laravel (.env) et tester l'envoi d'emails depuis l'application via les environnements de développement et de staging.",
            'hours'            => 8,
        ]);

        // US-1.3: Génération et Envoi de Credentials
        $us13 = ProjectStory::create([
            'project_epic_id'    => $ep1->id,
            'title'              => 'Génération et Envoi de Credentials',
            'description'        => "En tant que Chef, lorsque je crée un compte employé, le système génère un mot de passe provisoire et l'envoie automatiquement par email à l'utilisateur.",
            'story_points'       => 5,
            'acceptance_criteria'=> [
                "Quand un compte employé est créé par un Chef, alors un mot de passe provisoire est généré automatiquement.",
                "Le mot de passe provisoire doit être fort (alphanumérique, symboles, longueur min 10 caractères) et haché avant stockage.",
                "Un email de bienvenue contenant le mot de passe provisoire et les identifiants de connexion est envoyé à l'adresse email de l'employé.",
                "L'employé est invité à changer son mot de passe lors de sa première connexion (optionnel mais recommandé pour la sécurité).",
            ],
            'external_id' => 'US-1.3',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us13->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Implémenter la logique de génération de mot de passe provisoire et envoi d'email",
            'instructions'     => "Modifier la logique de création d'utilisateur dans Laravel. Générer un mot de passe provisoire fort (ex: Str::random(12)). Hacher ce mot de passe avec bcrypt. Envoyer un email de bienvenue à l'utilisateur avec son email et le mot de passe provisoire via le service SMTP configuré. Assurer une gestion sécurisée du mot de passe provisoire (ne pas le stocker en clair) et idéalement, inciter au changement à la première connexion.",
            'hours'            => 12,
        ]);

        // EP-2: Gestion des Utilisateurs (Espace Chef)
        $ep2 = ProjectEpic::create([
            'project_id'  => $project->id,
            'title'       => 'Gestion des Utilisateurs (Espace Chef)',
            'description' => "Gestion des comptes employés par le Chef, incluant les opérations CRUD (Créer, Lire, Mettre à jour, Désactiver) et la gestion d'état.",
        ]);

        // US-2.1: CRUD Employé
        $us21 = ProjectStory::create([
            'project_epic_id'    => $ep2->id,
            'title'              => 'CRUD Employé',
            'description'        => "En tant que Chef, je veux pouvoir Créer, Lire, Mettre à jour les informations et désactiver un compte employé, afin de gérer mon équipe.",
            'story_points'       => 13,
            'acceptance_criteria'=> [
                "Quand je suis sur la page de gestion des employés, alors je vois une liste paginée de tous les employés avec leurs informations (Nom, Email, Statut).",
                'Quand je clique sur "Créer un employé", alors un formulaire s\'affiche pour saisir les informations de base (Nom, Prénom, Email).',
                "Quand je saisis des informations valides et valide le formulaire de création, alors un nouvel employé est créé avec un mot de passe provisoire et un email de bienvenue est envoyé (voir US-1.3).",
                'Quand je clique sur "Modifier" un employé, alors un formulaire pré-rempli s\'affiche et je peux mettre à jour ses informations (Nom, Prénom, Email).',
                "Quand je mets à jour les informations et valide, alors les informations de l'employé sont modifiées.",
                'Quand je clique sur "Désactiver", alors le statut de l\'employé passe à "Inactif" et il ne peut plus se connecter.',
                "Quand j'essaie de créer un employé avec un email déjà existant, alors un message d'erreur est affiché.",
            ],
            'external_id' => 'US-2.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us21->id,
            'role'             => 'Backend Developer',
            'level'            => 'Senior',
            'title'            => "Créer les modèles, migrations et API RESTful pour la gestion des employés",
            'instructions'     => "Créer le modèle Employee avec les champs name, email, password, status (défaut 'active'). Générer la migration pour PostgreSQL. Implémenter un contrôleur EmployeeController avec les méthodes index (liste paginée), store (création), show (détail), update (modification et gestion de statut), destroy (logique de désactivation, pas de suppression physique). Protéger ces routes avec le middleware d'authentification et d'autorisation pour le rôle 'Chef'.",
            'hours'            => 24,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us21->id,
            'role'             => 'Frontend Developer',
            'level'            => 'Junior',
            'title'            => "Développer les composants Frontend pour l'affichage de la liste des employés",
            'instructions'     => "Créer un composant React pour afficher une table paginée des employés. Utiliser l'API /api/employees pour récupérer les données. Implémenter des fonctionnalités de tri et de recherche basiques si nécessaire. Afficher les boutons d'action 'Modifier' et 'Désactiver/Activer'.",
            'hours'            => 16,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us21->id,
            'role'             => 'Frontend Developer',
            'level'            => 'Junior',
            'title'            => "Développer les formulaires Frontend pour la création et la modification d'employés",
            'instructions'     => "Créer un composant React pour le formulaire de création/modification d'employé. Gérer les états des champs, la validation côté client et l'appel aux API POST et PUT/PATCH /api/employees/{id}. Intégrer un toggle ou bouton pour changer le statut 'Actif/Inactif' lors de la modification.",
            'hours'            => 20,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us21->id,
            'role'             => 'Backend Developer',
            'level'            => 'Mid-level',
            'title'            => "Mettre en place les tests pour les API CRUD employés",
            'instructions'     => "Écrire des tests PHPUnit pour les endpoints CRUD des employés. Tester la création avec des données valides/invalides, la lecture, la mise à jour et la désactivation. Vérifier les autorisations d'accès (seul le Chef doit y avoir accès).",
            'hours'            => 12,
        ]);

        // US-2.2: Gestion d'état Employé
        $us22 = ProjectStory::create([
            'project_epic_id'    => $ep2->id,
            'title'              => "Gestion d'état Employé (Actif/Inactif)",
            'description'        => "En tant que Chef, je veux pouvoir changer le statut d'un employé entre Actif et Inactif, afin de gérer les accès temporaires sans supprimer l'historique des tâches.",
            'story_points'       => 5,
            'acceptance_criteria'=> [
                'Quand je change le statut d\'un employé à "Inactif", alors cet employé ne peut plus se connecter à l\'application.',
                'Quand je change le statut d\'un employé à "Actif", alors cet employé peut de nouveau se connecter (avec ses identifiants existants).',
                "L'historique des tâches d'un employé inactif reste consultable par le Chef.",
            ],
            'external_id' => 'US-2.2',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us22->id,
            'role'             => 'Backend Developer',
            'level'            => 'Mid-level',
            'title'            => "Implémenter la logique de changement de statut dans le Backend",
            'instructions'     => "Modifier le contrôleur EmployeeController pour inclure une logique spécifique dans la méthode update ou un endpoint PATCH dédié pour gérer le changement de statut (active -> inactive, inactive -> active). Assurer que la logique d'authentification lors de la connexion vérifie le statut is_active de l'utilisateur.",
            'hours'            => 8,
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $us22->id,
            'role'             => 'Frontend Developer',
            'level'            => 'Junior',
            'title'            => "Ajouter l'interface de changement de statut Frontend",
            'instructions'     => "Ajouter un bouton ou un toggle dans la liste des employés et dans le formulaire d'édition pour modifier le statut Actif/Inactif d'un employé. Mettre à jour l'UI en fonction de la réponse de l'API et des messages de confirmation.",
            'hours'            => 6,
        ]);

        // EP-3: Gestion des Tâches (Espace Chef)
        ProjectEpic::create([
            'project_id'  => $project->id,
            'title'       => 'Gestion des Tâches (Espace Chef)',
            'description' => "Le Chef pilote l'activité globale via la création, l'assignation et le suivi des tâches.",
        ]);

        // EP-4: Exécution des Tâches (Espace Employé)
        ProjectEpic::create([
            'project_id'  => $project->id,
            'title'       => 'Exécution des Tâches (Espace Employé)',
            'description' => "L'interface de l'employé est focalisée sur la réalisation et la mise à jour de ses propres tâches.",
        ]);

        // EP-5: Infrastructure, CI/CD et UI/UX Générale
        ProjectEpic::create([
            'project_id'  => $project->id,
            'title'       => 'Infrastructure, CI/CD et UI/UX Générale',
            'description' => "Fonctionnalités transversales essentielles pour la fondation technique du projet, incluant Docker, GitHub Actions, déploiement Azure et design system.",
        ]);

        return $project;
    }

    /**
     * Returns the full stack_analysis_data JSON structure
     * matching the frontend StackChoiceView expectations.
     */
    private static function getStackAnalysisData(): array
    {
        return [
            'analysis' => [
                'project_type'         => 'Enterprise Task Management Platform',
                'complexity_score'     => 7,
                'key_features_summary' => [
                    'Authentification JWT/Sanctum',
                    'CRUD Employés avec gestion de statut',
                    'Réinitialisation de mot de passe',
                    'Gestion des tâches multi-rôle',
                    'Tableau de bord Chef/Employé',
                    'Emails transactionnels',
                    'CI/CD avec GitHub Actions',
                    'Déploiement Azure',
                ],
                'primary_constraints' => [
                    'Laravel et React.js sont explicitement requis',
                    'PostgreSQL comme base de données relationnelle',
                    'Déploiement sur Microsoft Azure obligatoire',
                    'Docker requis pour la containerisation',
                    'GitHub Actions pour le CI/CD',
                    'Sécurité renforcée (Sanctum, Key Vault)',
                    'Équipe mixte (Seniors + Juniors)',
                    'Budget CAPEX de ~1.3M MAD',
                ],
            ],
            'primary_recommendation' => [
                'strategy_name'        => 'The Laravel-React Azure Powerhouse',
                'synergy_explanation'  => "This stack leverages Laravel's robust backend capabilities for API development, authentication, and database management, perfectly complementing React's strength in building dynamic UIs. They communicate via RESTful APIs, providing a clear separation of concerns. Docker ensures environmental consistency, while GitHub Actions automates testing and deployment to Azure's scalable managed services (App Services/Container Apps, PostgreSQL, Key Vault). The explicit requirement for Laravel and React, combined with the comprehensive Azure DevOps needs, makes this a highly synergistic and pragmatic choice. Juniors benefit from React's vast resources, and Seniors can leverage Laravel's full power for rapid backend feature delivery.",
                'frontend' => [
                    [
                        'name'          => 'React.js',
                        'category'      => 'Frontend',
                        'justification' => "Explicitly requested in the backlog, React is highly capable for building rich, interactive user interfaces for both Chef and Employee dashboards. Its component-based architecture promotes reusability and maintainability.",
                        'pros'          => [
                            'Strong ecosystem and community support',
                            'Excellent for complex UI development',
                            'Component reusability accelerates development',
                            'Good performance for client-side rendering',
                        ],
                        'cons' => [
                            'Can have a steeper learning curve for absolute beginners',
                            'Requires careful state management for larger applications',
                            'Bundle size can be larger compared to leaner frameworks',
                        ],
                    ],
                    [
                        'name'          => 'Vite',
                        'category'      => 'Tooling',
                        'justification' => "Modern, fast build tool for React projects, improving developer experience with quick refresh times and optimized builds, aligning with the project's development speed needs.",
                        'pros'          => [
                            'Extremely fast development server',
                            'Quick build times for production',
                            'Easy to configure and use',
                            'Supports TypeScript out of the box',
                        ],
                        'cons' => [
                            'Newer than Webpack, ecosystem still growing (though robust for React)',
                            'Less mature plugin ecosystem than Webpack, for highly niche needs',
                        ],
                    ],
                    [
                        'name'          => 'Tailwind CSS',
                        'category'      => 'Frontend',
                        'justification' => "Utility-first CSS framework for rapid and consistent UI development, allowing frontend developers (including juniors) to quickly build responsive designs directly in markup.",
                        'pros'          => [
                            'Rapid UI development',
                            'Highly customizable without writing custom CSS',
                            'Ensures visual consistency across the application',
                            'Excellent for responsive design',
                        ],
                        'cons' => [
                            'Can lead to verbose HTML/JSX for complex components',
                            'Initial learning curve for utility-first approach',
                            'Less opinionated on design compared to component libraries',
                        ],
                    ],
                ],
                'backend' => [
                    [
                        'name'          => 'Laravel (PHP)',
                        'category'      => 'Backend',
                        'justification' => "Explicitly requested for the backend, Laravel is a robust, developer-friendly PHP framework ideal for building RESTful APIs. It offers built-in features for authentication (Sanctum), database migrations, ORM, queues, and email, directly addressing backlog requirements.",
                        'pros'          => [
                            'Strong framework for rapid API development',
                            'Integrated security features (Sanctum for API tokens, hashing)',
                            'Eloquent ORM simplifies database interactions',
                            'Excellent documentation and large community',
                            'Built-in support for mailers and queues',
                        ],
                        'cons' => [
                            'PHP execution speed can be slower than compiled languages (though often negligible for typical CRUD)',
                            'Can be memory-intensive for very high concurrency if not optimized',
                            'Requires a PHP runtime environment',
                        ],
                    ],
                    [
                        'name'          => 'Laravel Sanctum',
                        'category'      => 'Backend',
                        'justification' => "Specifically mentioned for API authentication, Sanctum provides a lightweight token-based authentication system perfect for SPAs and mobile applications, ensuring secure API access.",
                        'pros'          => [
                            'Simple token-based authentication for APIs',
                            'Seamless integration with Laravel',
                            'Supports both API tokens and session-based authentication',
                            'Low overhead for setup and maintenance',
                        ],
                        'cons' => [
                            'Less feature-rich than full OAuth2 providers',
                            'Token management needs careful handling on the client side',
                        ],
                    ],
                ],
                'database' => [
                    [
                        'name'          => 'PostgreSQL',
                        'category'      => 'Database',
                        'justification' => "Explicitly requested and a strong choice for relational data. PostgreSQL is highly reliable, feature-rich, and performs well for the structured data and query complexity expected (users, employees, tasks, filtering, pagination).",
                        'pros'          => [
                            'Robust and highly reliable',
                            'Excellent support for complex queries and data types',
                            'Strong ACID compliance',
                            'Good performance and scalability for relational workloads',
                            'Well-supported by Azure Flexible Server',
                        ],
                        'cons' => [
                            'Can be more resource-intensive than simpler databases for very small projects',
                            'Requires careful indexing and query optimization for extreme scale',
                        ],
                    ],
                ],
                'devops' => [
                    ['name' => 'Docker & Docker Compose'],
                    ['name' => 'GitHub Actions'],
                    ['name' => 'Microsoft Azure (App Services/Container Apps)'],
                    ['name' => 'Azure Container Registry'],
                    ['name' => 'Azure Key Vault'],
                    ['name' => 'SendGrid / Mailgun'],
                    ['name' => 'Azure Monitor & Application Insights'],
                ],
                'devops_infrastructure' => [
                    [
                        'name'          => 'Docker & Docker Compose',
                        'category'      => 'DevOps',
                        'justification' => "Explicitly required for consistent development and production environments. Docker ensures portability and reproducibility across local machines and Azure deployments.",
                        'pros'          => [
                            'Consistent environments for development, staging, production',
                            'Simplifies onboarding for new developers',
                            'Enables efficient CI/CD pipelines',
                            'Improves scalability and resource isolation',
                        ],
                        'cons' => [
                            'Adds a layer of complexity for initial setup',
                            'Resource overhead for local development (memory, CPU)',
                            'Debugging inside containers can sometimes be trickier',
                        ],
                    ],
                    [
                        'name'          => 'GitHub Actions',
                        'category'      => 'DevOps',
                        'justification' => "Explicitly required for CI/CD. It integrates seamlessly with GitHub repositories, allowing for automated testing, building Docker images, and deploying to Azure.",
                        'pros'          => [
                            'Native integration with GitHub',
                            'Extensive marketplace for pre-built actions',
                            'Free tier available for public and private repositories',
                            'Highly customizable workflows',
                        ],
                        'cons' => [
                            'YAML syntax can be verbose for complex workflows',
                            'Debugging failed actions can sometimes be challenging',
                            'Vendor lock-in to GitHub ecosystem for CI/CD',
                        ],
                    ],
                    [
                        'name'          => 'Microsoft Azure (App Services/Container Apps)',
                        'category'      => 'DevOps',
                        'justification' => "Explicitly the target cloud provider. Azure App Services or Container Apps are ideal for hosting Dockerized web applications, offering managed infrastructure, scalability, and easy integration with other Azure services.",
                        'pros'          => [
                            'Fully managed hosting environment',
                            'Scalability features (auto-scaling)',
                            'Seamless integration with Azure Container Registry and Key Vault',
                            'Strong enterprise-grade security features',
                        ],
                        'cons' => [
                            'Can be more expensive than IaaS for smaller applications',
                            'Learning curve for Azure-specific configurations',
                            'Potential vendor lock-in to Azure ecosystem',
                        ],
                    ],
                    [
                        'name'          => 'Azure Key Vault',
                        'category'      => 'DevOps',
                        'justification' => "Explicitly mentioned for secure secrets management. It provides a centralized, secure store for application secrets, API keys, and database credentials, crucial for security compliance.",
                        'pros'          => [
                            'Centralized and secure management of secrets',
                            'Reduces risk of exposing sensitive data in code/configs',
                            'Easy integration with Azure services and applications',
                            'Auditing and access control features',
                        ],
                        'cons' => [
                            'Adds a dependency and retrieval overhead for secrets',
                            'Requires careful access policy management',
                            'Potential for increased latency for frequent secret retrieval (though usually negligible)',
                        ],
                    ],
                ],
            ],
            'alternative_recommendation' => [
                'strategy_name'        => 'The Next.js Fullstack Cloud Sync',
                'synergy_explanation'  => "Next.js combines frontend and backend in a single framework with SSR support, paired with Prisma for type-safe database access. This reduces the technology surface area but moves away from the explicit Laravel requirement.",
                'frontend' => [
                    ['name' => 'Next.js', 'category' => 'Frontend'],
                ],
                'backend' => [
                    ['name' => 'Next.js API Routes', 'category' => 'Backend'],
                    ['name' => 'Prisma ORM', 'category' => 'Backend'],
                ],
                'database' => [
                    ['name' => 'PostgreSQL', 'category' => 'Database'],
                ],
                'devops_infrastructure' => [
                    ['name' => 'Vercel / Azure Static Web Apps', 'category' => 'DevOps'],
                    ['name' => 'GitHub Actions', 'category' => 'DevOps'],
                ],
            ],
            'risk_assessment' => [
                "Résistance au changement: Les utilisateurs habitués aux méthodes manuelles (Excel, papier) peuvent résister à l'adoption d'un nouvel outil numérique.",
                "Dépassement budgétaire: Le CAPEX élevé avec une équipe de 6 ingénieurs sur 7 mois laisse peu de marge malgré le buffer de 15%.",
                "Complexité Azure: L'intégration avec Azure Key Vault, Container Registry et App Services demande une expertise DevOps solide.",
                "ROI négatif à 3 ans: Le projet ne sera pas rentable avant 4 ans, nécessitant un engagement stratégique à long terme de la direction.",
                "Sécurité des données: La gestion des mots de passe provisoires et des tokens Sanctum doit être irréprochable pour éviter les failles.",
                "Dépendance aux Seniors: La majorité des tâches critiques reposent sur des profils Senior, créant un risque si un membre clé quitte le projet.",
            ],
            'junior_developer_tips' => [
                "Commencez par maîtriser les hooks React (useState, useEffect) avant de toucher au contexte global ou Redux.",
                "Utilisez Postman ou Insomnia pour tester les endpoints Laravel avant de les intégrer côté frontend.",
                "Familiarisez-vous avec Docker Compose en lançant le projet localement avant de comprendre le déploiement Azure.",
                "Lisez la documentation officielle de Laravel Sanctum pour comprendre le flux d'authentification token-based.",
                "Utilisez les devtools React et l'onglet Network du navigateur pour déboguer les appels API.",
                "Écrivez des tests unitaires pour vos composants React avec Vitest dès le début, pas en fin de sprint.",
            ],
        ];
    }
}
