<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bache;
use App\Models\Foto;
use App\Models\User;
use App\Models\Voto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * POST /api/admin/login
     * Autentica un usuario administrador y retorna un token Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $usuario = User::where('email', $request->email)->first();

        if (! $usuario || ! Hash::check($request->password, $usuario->password) || ! $usuario->is_admin) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 401);
        }

        $token = $usuario->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => [
                'name'  => $usuario->name,
                'email' => $usuario->email,
            ],
        ]);
    }

    /**
     * POST /api/admin/logout
     * Revoca el token actual del usuario autenticado.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    /**
     * GET /api/admin/baches
     * Retorna todos los baches (activos y resueltos) con filtros y paginación.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Bache::with(['fotos']);

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->query('estado'));
        }

        // Filtro por rango de fechas
        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->query('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->query('fecha_hasta'));
        }

        $baches = $query->orderBy('created_at', 'desc')->paginate(25);

        return response()->json($baches);
    }

    /**
     * GET /api/admin/estadisticas
     * Retorna estadísticas completas solo para administradores.
     */
    public function estadisticas(): JsonResponse
    {
        $data = Cache::remember('estadisticas_admin', 300, function () {
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

            // Datos adicionales exclusivos para admin
            $totalVotos = Voto::count();

            $reportesPorUuid = DB::table('baches')
                ->selectRaw('reporter_uuid, COUNT(*) as total')
                ->groupBy('reporter_uuid')
                ->orderByDesc('total')
                ->limit(5)
                ->get();

            $bachesSinFoto = Bache::doesntHave('fotos')->count();

            return [
                'total_baches'        => $totalBaches,
                'baches_activos'      => $bachesActivos,
                'baches_resueltos'    => $bachesResueltos,
                'baches_esta_semana'  => $bachesEstaSemana,
                'baches_este_mes'     => $bachesEsteMes,
                'barrios'             => $barrios,
                'por_dia'             => $porDia,
                'total_votos'         => $totalVotos,
                'reportes_por_uuid'   => $reportesPorUuid,
                'baches_sin_foto'     => $bachesSinFoto,
            ];
        });

        return response()->json($data);
    }
}
