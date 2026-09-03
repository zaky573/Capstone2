<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dosen extends Model
{
    protected $table = 'dosen';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'nidn',
        'nama_lengkap',
        'jenis_kelamin',
        'no_hp',
        'alamat',
        'tempat_lahir',
        'tanggal_lahir',
        'pendidikan_jurusan',
        'pendidikan_universitas',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mahasiswaBimbingan(): HasMany
    {
        return $this->hasMany(Mahasiswa::class, 'dosen_wali_id');
    }
}
