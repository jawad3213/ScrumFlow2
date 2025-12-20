<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\WelcomeEmployeeMail;
use App\Models\Specialization;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Select specific fields if needed, or all. 
        // Based on user request "table de migration des employee", we assume users table.
        // We filter by role 'employee' if that's the intention, or return all for "Team Global".
        // Assuming "Team Global" might want all members or just employees. Let's return all for now or filter.
        // Usually "Team" implies everyone or at least employees.
        // Let's return users where role is 'employee'.
        $employees = User::where('role', 'employee')->with('specialization')->get();
        return response()->json($employees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validation des données
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'specialization_name' => 'required|string|exists:specializations,name',
            'level' => 'required|string|exists:specializations,level',
        ]);

        // Find the specialization ID based on name and level
        $specialization = Specialization::where('name', $request->specialization_name)
                                        ->where('level', $request->level)
                                        ->firstOrFail();

        // 2. Générer un mot de passe aléatoire
        $generatedPassword = Str::random(10); // Mot de passe de 10 caractères

        // 3. Créer l'utilisateur
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'specialization_id' => $specialization->id,
            'role' => 'employee', // Rôle forcé à 'employee'
            'password' => Hash::make($generatedPassword),
            'status' => 'active', // Par défaut actif
        ]);

         //Envoyer l'email de bienvenue (Commenté pour découpler du template Blade comme demandé)
         try {
             Mail::to($user->email)->send(new WelcomeEmployeeMail($user, $generatedPassword));
         } catch (\Exception $e) {
            Log::error('Erreur envoi email bienvenue : ' . $e->getMessage());
         }

        // 5. Retourner la réponse avec le mot de passe généré pour l'affichage côté React
        return response()->json([
            'message' => 'Employé créé avec succès.',
            'user' => $user,
            'password' => $generatedPassword, // Plain text password for the admin to see/copy
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'specialization_name' => 'sometimes|required|string|exists:specializations,name',
            'level' => 'sometimes|required|string|exists:specializations,level',
            'status' => 'sometimes|required|in:active,banned',
            // Allow specialization_id to be optional or calculated
        ]);

        $data = $request->only(['first_name', 'last_name', 'status']);

        if ($request->has('specialization_name') && $request->has('level')) {
             $specialization = Specialization::where('name', $request->specialization_name)
                                            ->where('level', $request->level)
                                            ->firstOrFail();
             $data['specialization_id'] = $specialization->id;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Employé mis à jour avec succès.',
            'user' => $user->load('specialization')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Laravel gère la cascade si les migrations sont bien faites (ON DELETE CASCADE)
        // Sinon, il faudrait supprimer manuellement les relations ici.
        // Vu les migrations :
        // - tasks.assigned_to -> set null
        // - ai_analyses -> cascade
        // - projects/sprints -> cascade (si l'employé est owner, ce qui est rare pour un simple employé)
        
        $user->delete();

        return response()->json([
            'message' => 'Employé supprimé avec succès.'
        ]);
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        User::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'Employés supprimés avec succès.'
        ]);
    }
}
