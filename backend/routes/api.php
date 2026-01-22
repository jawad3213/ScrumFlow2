<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EmployeeController;
use Illuminate\Http\Request;

// Route publique (pas besoin d'être connecté pour se logger)
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

// Groupe de routes protégées (nécessite un token valide)
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Employee Routes
    Route::get('/employees/available', [EmployeeController::class, 'available']);
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::post('/employees/bulk-delete', [EmployeeController::class, 'bulkDelete']);

    // Specialization Routes
    Route::get('/specializations', [\App\Http\Controllers\SpecializationController::class, 'index']);
    Route::post('/specializations', [\App\Http\Controllers\SpecializationController::class, 'store']);
    Route::put('/specializations/{id}', [\App\Http\Controllers\SpecializationController::class, 'update']);
    Route::delete('/specializations/{id}', [\App\Http\Controllers\SpecializationController::class, 'destroy']);
    Route::post('/specializations/bulk-delete', [\App\Http\Controllers\SpecializationController::class, 'bulkDestroy']);

    // Profile Routes
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index']);
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/profile/password', [\App\Http\Controllers\ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [\App\Http\Controllers\ProfileController::class, 'updateAvatar']);

    // Project Routes
    Route::get('/projects', [\App\Http\Controllers\ProjectController::class, 'index']);
    Route::post('/projects', [\App\Http\Controllers\ProjectController::class, 'store']);
    Route::get('/projects/{id}', [\App\Http\Controllers\ProjectController::class, 'show']);
    Route::put('/projects/{id}', [\App\Http\Controllers\ProjectController::class, 'update']);
    Route::post('/projects/{id}/stack', [\App\Http\Controllers\ProjectController::class, 'saveStack']);
    Route::delete('/projects/{id}', [\App\Http\Controllers\ProjectController::class, 'destroy']);

    // Juste pour tester que le token fonctionne
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
});