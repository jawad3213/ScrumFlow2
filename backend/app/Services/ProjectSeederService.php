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
use App\Models\User;
use Carbon\Carbon;

class ProjectSeederService
{
    /**
     * Create a fully pre-analyzed demo project for a given user.
     */
    public static function seedForUser(User $user): Project
    {
        $project = Project::create([
            'name' => 'ScrumFlow AI - ' . $user->first_name . ' ' . $user->last_name,
            'description' => 'A strategic AI-driven platform designed to optimize project lifecycle management through advanced LLM reasoning and automated resource mapping.',
            'user_id' => $user->id,
            'start_date' => Carbon::now()->toDateString(),
            'estimated_duration_months' => 8,
            'total_capex' => 376000,
            'total_opex' => 98400,
            'total_project_cost' => 474400,
            'total_gain_value' => 960000,
            'annual_opex_value' => 98400,
            'roi_percentage' => 62.35,
            'break_even_point_months' => 22,
            'roi_analysis_summary' => "- Le projet 'ScrumFlow' représente un investissement stratégique visant à optimiser la gestion de projet interne via l'IA.\n- Le CAPEX de 376 000 MAD couvre 8 mois de développement avec une équipe de 3 ingénieurs (salaires marché marocain : Senior ~20 000 MAD/mois, Confirmé ~15 000 MAD/mois, Junior ~10 000 MAD/mois).\n- Les coûts cloud annuels (OPEX) s'élèvent à 98 400 MAD, alignés sur les tarifs AWS région eu-west (utilisée par les entreprises marocaines).\n- Le break-even est projeté à 22 mois, avec un ROI de 62.35% en Année 3.",
            'stack_name' => 'Artificial Intelligence & Cloud Platform',
        ]);

        // Licenses
        $licenses = [
            ['name' => 'Gemini API Subscription', 'cost' => 6000, 'desc' => 'Abonnement API Gemini Pro (~500 MAD/mois, usage modéré ~1M tokens/mois).'],
            ['name' => 'GitHub Team Plan', 'cost' => 1900, 'desc' => 'Plan Team à 4$/user/mois pour 4 devs (~160 MAD/mois).'],
            ['name' => 'Domaine .ma + SSL', 'cost' => 350, 'desc' => 'Nom de domaine .ma (~250 MAD/an) + certificat SSL (~100 MAD/an).'],
        ];

        foreach ($licenses as $lic) {
            InfrastructureCost::create([
                'project_id' => $project->id,
                'type' => 'license_api',
                'item_name' => $lic['name'],
                'cost_mad' => $lic['cost'],
                'description' => $lic['desc'],
            ]);
        }

        // Cloud
        $cloud = [
            ['name' => 'AWS EC2 (t3.medium)', 'cost' => 14400, 'desc' => 'Instance t3.medium eu-west (~1 200 MAD/mois, suffisant pour app Laravel + workers).'],
            ['name' => 'AWS RDS PostgreSQL (db.t3.micro)', 'cost' => 7200, 'desc' => 'Base de données managée db.t3.micro (~600 MAD/mois).'],
            ['name' => 'AWS S3 Storage', 'cost' => 600, 'desc' => 'Stockage objets (~50 MAD/mois pour ~50 Go de PDFs et avatars).'],
            ['name' => 'AWS CloudFront CDN', 'cost' => 1200, 'desc' => 'Distribution CDN pour assets statiques (~100 MAD/mois).'],
        ];

        foreach ($cloud as $c) {
            InfrastructureCost::create([
                'project_id' => $project->id,
                'type' => 'cloud_subscription',
                'item_name' => $c['name'],
                'cost_mad' => $c['cost'],
                'description' => $c['desc'],
            ]);
        }

        // Estimated Gains
        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => "Gains d'efficacité opérationnelle",
            'cost_mad' => 120000,
            'description' => "Réduction de 60% du temps de Setup projet (équivalent ~2 ingénieurs à 10 000 MAD/mois économisés sur la gestion manuelle).",
        ]);

        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => "Réduction des erreurs et retravail",
            'cost_mad' => 72000,
            'description' => "Standardisation des User Stories et blueprints réduisant le retravail de 40% (~6 000 MAD/mois d'économies).",
        ]);

        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => "Accélération Time-to-Market",
            'cost_mad' => 48000,
            'description' => "Livraison 25% plus rapide grâce à l'automatisation, permettant de facturer plus tôt (~4 000 MAD/mois de revenus anticipés).",
        ]);

        // ROI Projections
        $projections = [
            ['year' => 1, 'costs' => 474400, 'gains' => 80000, 'roi' => -83.13],
            ['year' => 2, 'costs' => 572800, 'gains' => 320000, 'roi' => -44.13],
            ['year' => 3, 'costs' => 671200, 'gains' => 960000, 'roi' => 43.03],
        ];

        foreach ($projections as $p) {
            RoiProjection::create([
                'project_id' => $project->id,
                'year_number' => $p['year'],
                'cumulative_costs' => $p['costs'],
                'cumulative_gains' => $p['gains'],
                'net_cash_flow' => $p['gains'] - $p['costs'],
                'roi_percentage' => $p['roi'],
            ]);
        }

        // KPIs
        $kpis = [
            ['name' => "Taux d'adoption PM", 'target' => "Min 80% des PM actifs", 'method' => "Logs système"],
            ['name' => "Réduction Setup Time", 'target' => "Réduction de 75%", 'method' => "Analyse logs"],
            ['name' => "Sprint Completion", 'target' => "Minimum 90%", 'method' => "Reporting module"],
        ];

        foreach ($kpis as $k) {
            ProjectKpi::create([
                'project_id' => $project->id,
                'metric_name' => $k['name'],
                'target_value' => $k['target'],
                'measurement_method' => $k['method'],
            ]);
        }

        // Backlog
        $epicVues = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Vues Alternatives du Travail',
            'description' => 'Visualisation multicritères (Liste, Calendrier).',
        ]);

        $storyList = ProjectStory::create([
            'project_epic_id' => $epicVues->id,
            'title' => 'Vue Liste des Tâches',
            'description' => 'Visualisation tabulaire pour tri et édition en masse.',
            'story_points' => 8,
            'acceptance_criteria' => ['Tableau triable', 'Filtres avancés', 'Édition en masse'],
            'external_id' => 'US-7.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $storyList->id,
            'role' => 'Backend Developer',
            'level' => 'Senior',
            'title' => 'API pour vue liste',
            'instructions' => 'Créer endpoint GET /api/tasks avec tri et filtres.',
            'hours' => 40,
        ]);

        $epicImpediments = ProjectEpic::create([
            'project_id' => $project->id,
            'title' => 'Gestion des Obstacles',
            'description' => 'Signalement et résolution des blocages.',
        ]);

        $storyReport = ProjectStory::create([
            'project_epic_id' => $epicImpediments->id,
            'title' => "Signalement d'un obstacle",
            'description' => "Permettre de signaler un blocage au Scrum Master.",
            'story_points' => 3,
            'acceptance_criteria' => ['Bouton persistant', 'Formulaire détaillé', 'Notification immédiate'],
            'external_id' => 'US-8.1',
        ]);

        ProjectBlueprintTask::create([
            'project_story_id' => $storyReport->id,
            'role' => 'Frontend Developer',
            'level' => 'Junior',
            'title' => 'Composant de signalement',
            'instructions' => 'Créer modal de formulaire accessible globalement.',
            'hours' => 24,
        ]);

        return $project;
    }
}
