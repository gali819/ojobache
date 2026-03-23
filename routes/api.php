<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BacheController;
use App\Http\Controllers\Api\EstadisticasController;
use App\Http\Controllers\Api\FotoController;
use App\Http\Controllers\Api\VotoController;
use Illuminate\Support\Facades\Route;

// -------------------------------------------------------------------------
// Rutas públicas
// -------------------------------------------------------------------------
Route::get('/baches', [BacheController::class, 'index']);
Route::get('/baches/{uuid}', [BacheController::class, 'show']);

Route::middleware('throttle:publicPOST')->group(function () {
    Route::post('/baches', [BacheController::class, 'store']);
    Route::post('/baches/{uuid}/fotos', [FotoController::class, 'store']);
    Route::post('/baches/{uuid}/votar', [VotoController::class, 'store']);
});

Route::get('/estadisticas', [EstadisticasController::class, 'index']);

// Login admin (público)
Route::post('/admin/login', [AdminController::class, 'login']);

// -------------------------------------------------------------------------
// Rutas protegidas con Sanctum + admin
// -------------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/logout', [AdminController::class, 'logout']);
    Route::get('/admin/baches', [AdminController::class, 'index']);
    Route::get('/admin/estadisticas', [AdminController::class, 'estadisticas']);
    Route::delete('/admin/baches/{uuid}', [BacheController::class, 'destroy']);
    Route::patch('/admin/baches/{uuid}', [BacheController::class, 'update']);
    Route::delete('/admin/fotos/{id}', [FotoController::class, 'destroy']);
});
