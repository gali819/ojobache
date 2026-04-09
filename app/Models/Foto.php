<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Foto extends Model
{
    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'bache_id',
        'path',
    ];

    /**
     * Solo se maneja created_at; no existe columna updated_at.
     */
    const UPDATED_AT = null;

    /**
     * Atributos calculados que se agregan a la serialización.
     */
    protected $appends = ['url'];

    // -------------------------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------------------------

    /**
     * Una foto pertenece a un bache.
     */
    public function bache(): BelongsTo
    {
        return $this->belongsTo(Bache::class);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Retorna la URL pública del archivo almacenado.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
