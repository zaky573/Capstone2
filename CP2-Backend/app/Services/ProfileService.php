<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    public function show(User $user): User
    {
        return $user->loadMissing(['mahasiswa.dosenWali', 'dosen']);
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['email'])) {
            $user->email = $data['email'];
            $user->save();
        }

        $profile = $user->mahasiswa ?? $user->dosen;
        if ($profile) {
            $profile->fill([
                'nama_lengkap' => $data['name'] ?? $profile->nama_lengkap,
                'no_hp' => $data['no_hp'] ?? $profile->no_hp,
                'alamat' => $data['alamat'] ?? $profile->alamat,
            ])->save();
        }

        return $this->show($user);
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'password_lama' => 'Password lama tidak sesuai.',
            ]);
        }

        $user->forceFill([
            'password' => $newPassword,
            'must_change_password' => false,
        ])->save();
    }
}
