<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectEpic;
use App\Models\ProjectStory;
use App\Models\ProjectBlueprintTask;
use App\Models\EstimatedGain;
use App\Models\InfrastructureCost;
use App\Models\RoiProjection;
use App\Models\AssignedEngineer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProjectDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get or Create a Chef User
        $chef = User::where('role', 'chef')->first() ?? User::factory()->create(['role' => 'chef', 'email' => 'chef@taskflow.com', 'first_name' => 'Super', 'last_name' => 'Chef']);

        // 2. Create the Main Project: ScrumFlow
        $project = Project::create([
            'name' => 'ScrumFlow AI',
            'description' => 'A strategic AI-driven platform designed to optimize project lifecycle management through advanced LLM reasoning and automated resource mapping.',
            'user_id' => $chef->id,
            'start_date' => Carbon::now()->toDateString(),
            'estimated_duration_months' => 8,
            'total_capex' => 508800,
            'total_opex' => 164400,
            'total_project_cost' => 563600,
            'total_gain_value' => 1560000,
            'annual_opex_value' => 164400,
            'roi_percentage' => 74.81,
            'break_even_point_months' => 25,
            'roi_analysis_summary' => "- Le projet 'ScrumFlow' représente un investissement stratégique majeur visant à optimiser la gestion de projet interne via l'intégration de l'Intelligence Artificielle.\n- Le coût initial (CAPEX) est substantiel (508 800 MAD) et couvre une phase de développement intensive de 8 mois.\n- La rentabilité du projet est projetée pour être atteinte au bout de 25 mois.\n- En Année 3, 'ScrumFlow' démontre sa pleine valeur, générant un ROI positif de 74.81%.",
            'stack_name' => 'Artificial Intelligence & Cloud Platform',
        ]);

        // 3. Financials (Infrastructure & Licenses)
        $licenses = [
            ['name' => 'Gemini API Subscription', 'cost' => 16000, 'desc' => 'Coût utilisation API pour analyse IA.'],
            ['name' => 'GitHub Actions Pro', 'cost' => 4000, 'desc' => 'Plan payant pour la CI/CD.'],
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

        $cloud = [
            ['name' => 'AWS EC2 Instances', 'cost' => 48000, 'desc' => 'Hébergement conteneurs Docker.'],
            ['name' => 'AWS RDS PostgreSQL', 'cost' => 24000, 'desc' => 'Base de données managée.'],
            ['name' => 'AWS S3 Storage', 'cost' => 2400, 'desc' => 'Stockage PDF et avatars.'],
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

        // 5. Estimated Gains
        EstimatedGain::create([
            'project_id' => $project->id,
            'item_name' => "Gains d'efficacité et Optimisation",
            'cost_mad' => 180000,
            'description' => "Réduction du temps de Setup et standardisation des User Stories.",
        ]);

        // 6. ROI Projections (3 Years)
        $projections = [
            ['year' => 1, 'costs' => 563600, 'gains' => 120000, 'roi' => -78.71],
            ['year' => 2, 'costs' => 728000, 'gains' => 720000, 'roi' => -1.1],
            ['year' => 3, 'costs' => 892400, 'gains' => 1560000, 'roi' => 74.81],
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

        // 7. KPIs
        $kpis = [
            ['name' => "Taux d'adoption PM", 'target' => "Min 80% des PM actifs", 'method' => "Logs système"],
            ['name' => "Réduction Setup Time", 'target' => "Réduction de 75%", 'method' => "Analyse logs"],
            ['name' => "Sprint Completion", 'target' => "Minimum 90%", 'method' => "Reporting module"],
        ];

        foreach ($kpis as $k) {
            \App\Models\ProjectKpi::create([
                'project_id' => $project->id,
                'metric_name' => $k['name'],
                'target_value' => $k['target'],
                'measurement_method' => $k['method'],
            ]);
        }

        // 8. Backlog Update (Expanded)
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

        $this->command->info('Project Data seeded successfully with ScrumFlow content!');
    }
}
