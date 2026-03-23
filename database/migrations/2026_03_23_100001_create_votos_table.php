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
        Schema::create('votos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bache_id')->constrained()->onDelete('cascade');
            $table->string('voter_uuid', 36);
            $table->string('voter_ip', 45)->nullable();
            $table->enum('tipo', ['activo', 'resuelto']);
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['bache_id', 'voter_uuid']);
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('votos');
    }
};
