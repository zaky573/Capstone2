<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = $this->mahasiswa ?? $this->dosen;

        $name = match (true) {
            $this->isAdmin() => 'Administrator',
            $profile !== null => $profile->nama_lengkap,
            default => $this->username,
        };

        return [
            'id' => $this->id,
            'username' => $this->username,
            'name' => $name,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),
            'email' => $this->email,
            'is_active' => $this->is_active,
            'must_change_password' => $this->must_change_password,
            'profile' => match (true) {
                $this->isMahasiswa() => new MahasiswaResource($this->whenLoaded('mahasiswa')),
                $this->isDosen() => new DosenResource($this->whenLoaded('dosen')),
                default => null,
            },
            'last_login_at' => $this->last_login_at?->toIso8601String(),
        ];
    }
}
