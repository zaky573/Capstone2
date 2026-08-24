<?php

namespace App\Models;

use App\Enums\PerwalianStatus;
use App\Enums\Semester;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Perwalian extends Model
{
    protected $table = 'perwalian';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'mahasiswa_id',
        'tahun_akademik',
        'semester',
        'uraian',
        'kendala',
        'rencana_studi',
        'komentar_dosen',
        'status',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'semester' => Semester::class,
            'status' => PerwalianStatus::class,
            'verified_at' => 'datetime',
        ];
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}
