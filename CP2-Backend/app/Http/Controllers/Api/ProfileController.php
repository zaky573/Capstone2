<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\ChangePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $user = $this->profileService->show($request->user());

        return response()->json([
            'message' => 'OK',
            'data' => [
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->profileService->update($request->user(), $request->validated());

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => [
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->profileService->changePassword(
            $request->user(),
            $request->input('password_lama'),
            $request->input('password_baru')
        );

        return response()->json([
            'message' => 'Password berhasil diganti',
            'data' => null,
        ]);
    }
}
