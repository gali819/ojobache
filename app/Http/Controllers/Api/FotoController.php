<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bache;
use App\Models\Foto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class FotoController extends Controller
{
    /**
     * POST /api/baches/{uuid}/fotos
     * Sube una foto y la asocia al bache indicado.
     */
    public function store(Request $request, string $uuid): JsonResponse
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,webp|max:5120',
        ]);

        $bache = Bache::where('uuid', $uuid)->first();

        if (! $bache) {
            return response()->json(['message' => 'Bache no encontrado.'], 404);
        }

        // Máximo 3 fotos por bache
        if ($bache->fotos()->count() >= 3) {
            return response()->json([
                'message' => 'Este bache ya tiene el máximo de 3 fotos.',
            ], 422);
        }

        // Procesar imagen con Intervention Image
        $imagen = Image::read($request->file('foto'));

        // Redimensionar a máximo 1200px de ancho manteniendo proporción
        $imagen->scaleDown(width: 1200);

        // Convertir a webp con calidad 80 (sin metadata EXIF)
        $contenido = $imagen->toWebp(80)->toString();

        // Nombre de archivo: timestamp + random + .webp
        $nombreArchivo = time() . '_' . Str::random(8) . '.webp';
        $rutaRelativa  = 'public/fotos/' . $uuid . '/' . $nombreArchivo;

        Storage::put($rutaRelativa, $contenido);

        $foto = Foto::create([
            'bache_id' => $bache->id,
            'path'     => $rutaRelativa,
        ]);

        Cache::flush();

        return response()->json([
            'url' => $foto->url,
            'id'  => $foto->id,
        ], 201);
    }

    /**
     * DELETE /api/admin/fotos/{id}
     * Elimina una foto (solo admin).
     */
    public function destroy(int $id): JsonResponse
    {
        $foto = Foto::find($id);

        if (! $foto) {
            return response()->json(['message' => 'Foto no encontrada.'], 404);
        }

        // Eliminar archivo físico
        try {
            Storage::delete($foto->path);
        } catch (\Throwable $e) {
            // Continuar aunque falle la eliminación del archivo
        }

        $foto->delete();

        Cache::flush();

        return response()->json(['message' => 'Foto eliminada.']);
    }
}
