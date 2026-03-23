<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bache;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    /**
     * GET /api/estadisticas
     * Retorna estadísticas públicas de los baches, cacheadas por 5 minutos.
     */
    public function index(): JsonResponse
    {
        $data = Cache::remember('estadisticas_publicas', 300, function () {
            $totalBaches      = Bache::count();
            $bachesActivos    = Bache::where('estado', 'activo')->count();
            $bachesResueltos  = Bache::where('estado', 'resuelto')->count();
            $bachesEstaSemana = Bache::where('created_at', '>=', now()->startOfWeek())->count();
            $bachesEsteMes    = Bache::where('created_at', '>=', now()->startOfMonth())->count();

            // Agrupar por los primeros 30 chars del campo direccion
            $barrios = DB::table('baches')
                ->selectRaw('SUBSTRING(direccion, 1, 30) as zona, COUNT(*) as total')
                ->whereNotNull('direccion')
                ->groupBy('zona')
                ->orderByDesc('total')
                ->limit(10)
                ->get();

            // Baches de los últimos 30 días agrupados por fecha
            $porDia = DB::table('baches')
                ->selectRaw('DATE(created_at) as fecha, COUNT(*) as total')
                ->where('created_at', '>=', now()->subDays(30)->startOfDay())
                ->groupBy('fecha')
                ->orderBy('fecha')
                ->get();

            return [
                'total_baches'       => $totalBaches,
                'baches_activos'     => $bachesActivos,
                'baches_resueltos'   => $bachesResueltos,
                'baches_esta_semana' => $bachesEstaSemana,
                'baches_este_mes'    => $bachesEsteMes,
                'barrios'            => $barrios,
                'por_dia'            => $porDia,
            ];
        });

        return response()->json($data);
    }
}
