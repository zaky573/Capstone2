<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function resetPassword(User $user): JsonResponse
    {
        $defaultPassword = $user->role->value === 'mahasiswa'
            ? AuthService::DEFAULT_PASSWORD_MAHASISWA
            : AuthService::DEFAULT_PASSWORD_DOSEN;

        $user->forceFill([
            'password' => $defaultPassword,
            'must_change_password' => true,
        ])->save();

        return response()->json([
            'message' => 'Password berhasil direset menjadi '.$defaultPassword,
            'data' => [
                'new_password' => $defaultPassword,
            ],
        ]);
    }
}
