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
            'level' => 'required|in:Junior,Mid-level (Confirmé),Senior,Lead / Architect',
            'salary' => 'required|numeric',
        ]);

        $specialization = Specialization::create($request->all());

        return response()->json($specialization, 201);
    }
}
