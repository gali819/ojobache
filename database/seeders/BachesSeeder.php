<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BachesSeeder extends Seeder
{
    /**
     * Genera 50 baches de prueba distribuidos en barrios reales de Tucumán.
     */
    public function run(): void
    {
        // Coordenadas base de barrios reales de Tucumán
        $barrios = [
            ['nombre' => 'Centro',             'lat' => -26.8241, 'lng' => -65.2226],
            ['nombre' => 'Yerba Buena',        'lat' => -26.8167, 'lng' => -65.2833],
            ['nombre' => 'Villa Urquiza',      'lat' => -26.8389, 'lng' => -65.2089],
            ['nombre' => 'Banda del Río Salí', 'lat' => -26.8333, 'lng' => -65.1667],
            ['nombre' => 'San Pablo',          'lat' => -26.8611, 'lng' => -65.2194],
            ['nombre' => 'Alberdi',            'lat' => -26.8111, 'lng' => -65.2389],
            ['nombre' => 'Villa 9 de Julio',   'lat' => -26.8056, 'lng' => -65.2167],
            ['nombre' => 'Las Talitas',        'lat' => -26.7833, 'lng' => -65.1944],
        ];

        // Descripciones posibles (null = sin descripción)
        $descripciones = [
            'Bache profundo, peligroso para motos',
            'Bache en la esquina, tapa de alcantarilla rota',
            'Varios baches seguidos, zona muy deteriorada',
            'Bache grande con agua estancada',
            'Hundimiento del asfalto, cuidado de noche',
            null,
        ];

        $baches = [];
        $ahora  = now();

        for ($i = 0; $i < 50; $i++) {
            // Seleccionar barrio al azar
            $barrio = $barrios[array_rand($barrios)];

            // Variación aleatoria de ±0.005 grados
            $lat = $barrio['lat'] + (rand(-50, 50) / 10000);
            $lng = $barrio['lng'] + (rand(-50, 50) / 10000);

            // Estado: 80% activo, 20% resuelto
            $estado = (rand(1, 100) <= 80) ? 'activo' : 'resuelto';

            // Fecha aleatoria en los últimos 6 meses
            $diasAtras   = rand(0, 180);
            $createdAt   = now()->subDays($diasAtras)->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            $baches[] = [
                'uuid'           => (string) Str::uuid(),
                'lat'            => $lat,
                'lng'            => $lng,
                'direccion'      => 'Av. Mate de Luna al ' . rand(100, 9999) . ', ' . $barrio['nombre'],
                'descripcion'    => $descripciones[array_rand($descripciones)],
                'estado'         => $estado,
                'reporter_uuid'  => (string) Str::uuid(),
                'votos_activo'   => rand(0, 15),
                'votos_resuelto' => rand(0, 8),
                'created_at'     => $createdAt,
                'updated_at'     => $createdAt,
            ];
        }

        // Inserción masiva para mayor rendimiento
        DB::table('baches')->insert($baches);
    }
}
