<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Crea el usuario administrador del sistema.
     */
    public function run(): void
    {
        User::create([
            'name'     => 'Admin OjoBache',
            'email'    => env('ADMIN_EMAIL', 'admin@ojobache.com'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'ojobache2024')),
            'is_admin' => true,
        ]);
    }
}
