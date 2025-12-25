<?php

namespace App\Http\Controllers;

use App\Models\Specialization;
use Illuminate\Http\Request;

class SpecializationController extends Controller
{
    public function index()
    {
        return response()->json(Specialization::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'salary' => 'required|numeric',
        ]);

        $specialization = Specialization::create($request->all());

        return response()->json($specialization, 201);
    }

    public function update(Request $request, $id)
    {
        $specialization = Specialization::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|string|max:255',
            'salary' => 'sometimes|required|numeric',
        ]);

        $specialization->update($request->all());

        return response()->json($specialization);
    }

    public function destroy($id)
    {
        $specialization = Specialization::findOrFail($id);
        $specialization->delete();

        return response()->json(null, 204);
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:specializations,id'
        ])['ids'];

        Specialization::whereIn('id', $ids)->delete();

        return response()->json(null, 204);
    }
}
