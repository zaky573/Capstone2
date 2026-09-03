<?php

namespace App\Services;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public const DEFAULT_PASSWORD_MAHASISWA = 'mahasiswa123';
    public const DEFAULT_PASSWORD_DOSEN = 'dosen123';
    public const DEFAULT_PASSWORD_ADMIN = 'admin123';

    public function login(string $identifier, string $password): array
    {
        $user = $this->findByIdentifier($identifier);

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        if ($user->isMahasiswa() && ! $user->mahasiswa) {
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        if ($user->isDosen() && ! $user->dosen) {
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return [$user, $user->createToken('auth-token')->plainTextToken];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function findByIdentifier(string $identifier): ?User
    {
        $user = User::where('username', $identifier)->first();
        if ($user) {
            return $user;
        }

        $mahasiswa = Mahasiswa::where('nim', $identifier)->first();
        if ($mahasiswa) {
            return $mahasiswa->user;
        }

        $dosen = Dosen::where('nidn', $identifier)->first();

        return $dosen?->user;
    }
}
