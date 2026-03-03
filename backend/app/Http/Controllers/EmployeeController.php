<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Specialization;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the authenticated user's employees.
     */
    public function index()
    {
        $employees = Employee::where('user_id', auth()->id())
            ->with('specialization')
            ->get();

        return response()->json($employees);
    }

    /**
     * Display a listing of available (unengaged) employees for the authenticated user.
     */
    public function available()
    {
        $employees = Employee::where('user_id', auth()->id())
            ->where('is_engaged', false)
            ->with('specialization')
            ->get();

        return response()->json($employees);
    }

    /**
     * Store a newly created employee for the authenticated user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'specialization_name' => 'required|string|exists:specializations,name',
            'level' => 'required|string|exists:specializations,level',
        ]);

        $specialization = Specialization::where('name', $request->specialization_name)
            ->where('level', $request->level)
            ->firstOrFail();

        $employee = Employee::create([
            'user_id' => auth()->id(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'specialization_id' => $specialization->id,
        ]);

        return response()->json([
            'message' => 'Employé créé avec succès.',
            'user' => $employee->load('specialization'),
        ], 201);
    }

    /**
     * Update the specified employee (owned by the authenticated user).
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::where('user_id', auth()->id())->findOrFail($id);

        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'specialization_name' => 'sometimes|required|string|exists:specializations,name',
            'level' => 'sometimes|required|string|exists:specializations,level',
            'is_engaged' => 'sometimes|boolean',
        ]);

        $data = $request->only(['first_name', 'last_name', 'is_engaged']);

        if ($request->has('specialization_name') && $request->has('level')) {
            $specialization = Specialization::where('name', $request->specialization_name)
                ->where('level', $request->level)
                ->firstOrFail();
            $data['specialization_id'] = $specialization->id;
        }

        $employee->update($data);

        return response()->json([
            'message' => 'Employé mis à jour avec succès.',
            'user' => $employee->load('specialization'),
        ]);
    }

    /**
     * Remove the specified employee (owned by the authenticated user).
     */
    public function destroy($id)
    {
        $employee = Employee::where('user_id', auth()->id())->findOrFail($id);
        $employee->delete();

        return response()->json([
            'message' => 'Employé supprimé avec succès.'
        ]);
    }

    /**
     * Remove multiple employees (owned by the authenticated user).
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:employees,id'
        ]);

        Employee::where('user_id', auth()->id())
            ->whereIn('id', $request->ids)
            ->delete();

        return response()->json([
            'message' => 'Employés supprimés avec succès.'
        ]);
    }
}
