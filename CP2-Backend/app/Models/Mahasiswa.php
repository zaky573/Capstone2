<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mahasiswa extends Model
{
    protected $table = 'mahasiswa';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nim',
        'nama_lengkap',
        'jenis_kelamin',
        'program_studi',
        'angkatan',
        'semester',
        'no_hp',
        'alamat',
        'dosen_wali_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dosenWali(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_wali_id');
    }

    public function perwalian(): HasMany
    {
        return $this->hasMany(Perwalian::class);
    }
}
