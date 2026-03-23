<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bache;
use App\Models\Voto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VotoController extends Controller
{
    /**
     * POST /api/baches/{uuid}/votar
     * Registra un voto para un bache.
     */
    public function store(Request $request, string $uuid): JsonResponse
    {
        $validated = $request->validate([
            'tipo'       => 'required|in:activo,resuelto',
            'voter_uuid' => 'required|string|size:36',
        ]);

        $bache = Bache::where('uuid', $uuid)->first();

        if (! $bache) {
            return response()->json(['message' => 'Bache no encontrado.'], 404);
        }

        // Verificar si ya existe un voto de este voter_uuid para este bache
        $yaVoto = Voto::where('bache_id', $bache->id)
            ->where('voter_uuid', $validated['voter_uuid'])
            ->exists();

        if ($yaVoto) {
            return response()->json(['message' => 'Ya votaste en este bache.'], 409);
        }

        // Crear el voto
        Voto::create([
            'bache_id'   => $bache->id,
            'voter_uuid' => $validated['voter_uuid'],
            'voter_ip'   => $request->ip(),
            'tipo'       => $validated['tipo'],
        ]);

        // Actualizar contadores en el bache
        if ($validated['tipo'] === 'activo') {
            $bache->increment('votos_activo');
        } else {
            $bache->increment('votos_resuelto');
        }

        // Refrescar el modelo para tener los valores actualizados
        $bache->refresh();

        // Recalcular estado según reglas de negocio
        $bache->recalcularEstado();

        Cache::flush();

        return response()->json([
            'message'        => 'Voto registrado.',
            'votos_activo'   => $bache->votos_activo,
            'votos_resuelto' => $bache->votos_resuelto,
            'estado'         => $bache->estado,
        ]);
    }
}
