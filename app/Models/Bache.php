<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Bache extends Model
{
    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'uuid',
        'lat',
        'lng',
        'direccion',
        'descripcion',
        'estado',
        'reporter_uuid',
        'votos_activo',
        'votos_resuelto',
    ];

    /**
     * Conversión de tipos de atributos.
     */
    protected $casts = [
        'lat'        => 'float',
        'lng'        => 'float',
        'created_at' => 'datetime',
    ];

    /**
     * Lógica ejecutada al arrancar el modelo.
     * Genera automáticamente el UUID al crear un nuevo bache.
     */
    protected static function booted(): void
    {
        static::creating(function (Bache $bache) {
            if (empty($bache->uuid)) {
                $bache->uuid = (string) Str::uuid();
            }
        });
    }

    // -------------------------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------------------------

    /**
     * Un bache tiene muchas fotos.
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(Foto::class);
    }

    /**
     * Un bache tiene muchos votos.
     */
    public function votos(): HasMany
    {
        return $this->hasMany(Voto::class);
    }

    // -------------------------------------------------------------------------
    // Scopes locales
    // -------------------------------------------------------------------------

    /**
     * Filtra los baches con estado 'activo'.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    // -------------------------------------------------------------------------
    // Métodos de negocio
    // -------------------------------------------------------------------------

    /**
     * Recalcula el estado del bache según los votos acumulados.
     * - Si votos_resuelto >= 5 Y votos_resuelto > votos_activo → estado = 'resuelto'
     * - Si estado es 'resuelto' Y votos_activo >= 3 → estado = 'activo'
     */
    public function recalcularEstado(): void
    {
        if ($this->votos_resuelto >= 5 && $this->votos_resuelto > $this->votos_activo) {
            $this->estado = 'resuelto';
        } elseif ($this->estado === 'resuelto' && $this->votos_activo >= 3) {
            $this->estado = 'activo';
        }

        $this->save();
    }
}
