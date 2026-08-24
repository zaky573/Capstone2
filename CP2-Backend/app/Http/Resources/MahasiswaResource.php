<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'nim' => $this->nim,
            'nama_lengkap' => $this->nama_lengkap,
            'jenis_kelamin' => $this->jenis_kelamin,
            'program_studi' => $this->program_studi,
            'angkatan' => $this->angkatan,
            'semester' => $this->semester,
            'no_hp' => $this->no_hp,
            'alamat' => $this->alamat,
            'email' => $this->whenLoaded('user', $this->user?->email),
            'dosen_wali_id' => $this->dosen_wali_id,
            'dosen_wali' => new DosenResource($this->whenLoaded('dosenWali')),
            'jumlah_perwalian' => $this->whenCounted('perwalian'),
            'perwalian_menunggu' => $this->perwalian_menunggu ?? 0,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
