<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voto extends Model
{
    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'bache_id',
        'voter_uuid',
        'voter_ip',
        'tipo',
    ];

    /**
     * Solo se maneja created_at; no existe columna updated_at.
     */
    const UPDATED_AT = null;

    // -------------------------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------------------------

    /**
     * Un voto pertenece a un bache.
     */
    public function bache(): BelongsTo
    {
        return $this->belongsTo(Bache::class);
    }
}
