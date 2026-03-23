<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BacheController extends Controller
{
    /**
     * GET /api/baches
     * Retorna todos los baches activos, con soporte de filtro geográfico y caché.
     */
    public function index(Request $request): JsonResponse
    {
        $lat   = $request->query('lat');
        $lng   = $request->query('lng');
        $radio = $request->query('radio', 10);

        // Clave de caché dinámica según parámetros recibidos
        $cacheKey = 'baches_' . md5("lat={$lat}&lng={$lng}&radio={$radio}");

        $data = Cache::remember($cacheKey, 60, function () use ($lat, $lng, $radio) {
            $query = Bache::with(['fotos:id,bache_id,path'])
                ->where('estado', 'activo')
                ->withCount([
                    'votos as votos_activo'   => fn ($q) => $q->where('tipo', 'activo'),
                    'votos as votos_resuelto' => fn ($q) => $q->where('tipo', 'resuelto'),
                ]);

            // Filtro geográfico con fórmula de Haversine
            if ($lat !== null && $lng !== null) {
                $lat   = (float) $lat;
                $lng   = (float) $lng;
                $radio = (float) $radio;

                $query->whereRaw(
                    '(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?',
                    [$lat, $lng, $lat, $radio]
                );
            }

            $baches = $query->orderBy('created_at', 'desc')->get();

            return [
                'data'  => $baches,
                'total' => $baches->count(),
            ];
        });

        return response()->json($data);
    }

    /**
     * GET /api/baches/{uuid}
     * Retorna un bache específico buscando por uuid.
     */
    public function show(string $uuid): JsonResponse
    {
        $bache = Bache::with('fotos')->where('uuid', $uuid)->first();

        if (! $bache) {
            return response()->json(['message' => 'Bache no encontrado.'], 404);
        }

        return response()->json($bache);
    }

    /**
     * POST /api/baches
     * Crea un nuevo bache.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat'           => 'required|numeric|between:-90,90',
            'lng'           => 'required|numeric|between:-180,180',
            'descripcion'   => 'nullable|string|max:500',
            'reporter_uuid' => 'required|string|size:36',
            'direccion'     => 'nullable|string|max:255',
        ]);

        // Sanitizar descripcion
        if (isset($validated['descripcion'])) {
            $validated['descripcion'] = strip_tags($validated['descripcion']);
        }

        // Verificar que no exista un bache del mismo reporter_uuid a menos de 20 metros
        $existeCercano = Bache::where('reporter_uuid', $validated['reporter_uuid'])
            ->whereRaw(
                '(6371000 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= 20',
                [$validated['lat'], $validated['lng'], $validated['lat']]
            )
            ->exists();

        if ($existeCercano) {
            return response()->json([
                'message' => 'Ya reportaste un bache muy cerca de este punto.',
            ], 409);
        }

        $bache = Bache::create($validated);

        // Limpiar caché de baches
        Cache::flush();

        return response()->json($bache, 201);
    }

    /**
     * DELETE /api/admin/baches/{uuid}
     * Elimina un bache junto con sus fotos y votos (solo admin).
     */
    public function destroy(string $uuid): JsonResponse
    {
        $bache = Bache::with('fotos')->where('uuid', $uuid)->first();

        if (! $bache) {
            return response()->json(['message' => 'Bache no encontrado.'], 404);
        }

        // Eliminar archivos físicos de las fotos
        foreach ($bache->fotos as $foto) {
            try {
                Storage::delete($foto->path);
            } catch (\Throwable $e) {
                // Continuar aunque falle la eliminación del archivo
            }
        }

        // Eliminar en cascada (votos y fotos se eliminan por DB o manualmente)
        $bache->votos()->delete();
        $bache->fotos()->delete();
        $bache->delete();

        Cache::flush();

        return response()->json(['message' => 'Bache eliminado correctamente.']);
    }

    /**
     * PATCH /api/admin/baches/{uuid}
     * Actualiza campos de un bache (solo admin).
     */
    public function update(Request $request, string $uuid): JsonResponse
    {
        $bache = Bache::where('uuid', $uuid)->first();

        if (! $bache) {
            return response()->json(['message' => 'Bache no encontrado.'], 404);
        }

        $validated = $request->validate([
            'descripcion' => 'nullable|string|max:500',
            'estado'      => 'nullable|in:activo,resuelto',
            'direccion'   => 'nullable|string|max:255',
        ]);

        // Sanitizar descripcion
        if (isset($validated['descripcion'])) {
            $validated['descripcion'] = strip_tags($validated['descripcion']);
        }

        $bache->update($validated);

        Cache::flush();

        return response()->json($bache);
    }
}
