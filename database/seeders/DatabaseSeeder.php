<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Poblar la base de datos de la aplicación.
     */
    public function run(): void
    {
        // 1. Crear usuario administrador
        $this->call(AdminSeeder::class);

        // 2. Crear baches de ejemplo
        $this->call(BachesSeeder::class);
    }
}
