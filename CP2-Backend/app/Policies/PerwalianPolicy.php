<?php

namespace App\Policies;

use App\Enums\PerwalianStatus;
use App\Models\Perwalian;
use App\Models\User;

class PerwalianPolicy
{
    public function view(User $user, Perwalian $perwalian): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isMahasiswa()) {
            return $user->mahasiswa?->id === $perwalian->mahasiswa_id;
        }

        if ($user->isDosen()) {
            return $user->dosen?->id === $perwalian->mahasiswa?->dosen_wali_id;
        }

        return false;
    }

    public function update(User $user, Perwalian $perwalian): bool
    {
        return $this->view($user, $perwalian)
            && $perwalian->status === PerwalianStatus::MENUNGGU_VERIFIKASI;
    }

    public function verify(User $user, Perwalian $perwalian): bool
    {
        return $user->isAdmin()
            || ($user->isDosen() && $user->dosen?->id === $perwalian->mahasiswa?->dosen_wali_id);
    }
}
