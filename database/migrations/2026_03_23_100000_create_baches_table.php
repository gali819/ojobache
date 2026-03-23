<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    {
        Schema::create('baches', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->string('direccion')->nullable();
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['activo', 'resuelto'])->default('activo');
            $table->string('reporter_uuid', 36);
            $table->integer('votos_activo')->default(0);
            $table->integer('votos_resuelto')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('baches');
    }
};
