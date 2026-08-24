<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        [$user, $token] = $this->authService->login(
            $request->input('username'),
            $request->input('password')
        );

        $user->loadMissing(['mahasiswa.dosenWali', 'dosen']);

        return response()->json([
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logout berhasil',
            'data' => null,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing(['mahasiswa.dosenWali', 'dosen']);

        return response()->json([
            'message' => 'OK',
            'data' => [
                'user' => new UserResource($user),
            ],
        ]);
    }
}
