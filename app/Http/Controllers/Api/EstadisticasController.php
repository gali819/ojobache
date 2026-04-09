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

            $zonasConocidas = [
                'Yerba Buena', 'Tafí Viejo', 'Las Talitas',
                'Banda del Río Salí', 'San Pablo', 'Alberdi',
                'Villa Urquiza', 'San Miguel', 'Lomas de Tafí',
                'Famailla', 'Villa 9 de Julio', 'El Manantial',
                'Cebil Redondo', 'Los Pocitos', 'Villa Carmela',
                'Barrio Norte', 'Barrio Sur', 'Centro',
            ];

            $baches = Bache::where('estado', 'activo')
                ->whereNotNull('direccion')
                ->pluck('direccion');

            $conteoZonas = [];
            foreach ($baches as $direccion) {
                $zonaEncontrada = 'Otras zonas';
                foreach ($zonasConocidas as $zona) {
                    if (stripos($direccion, $zona) !== false) {
                        $zonaEncontrada = $zona;
                        break;
                    }
                }
                $conteoZonas[$zonaEncontrada] = ($conteoZonas[$zonaEncontrada] ?? 0) + 1;
            }

            arsort($conteoZonas);
            $barrios = array_slice(
                array_map(
                    fn($zona, $total) => ['zona' => $zona, 'total' => $total],
                    array_keys($conteoZonas),
                    array_values($conteoZonas)
                ),
                0, 10
            );

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
