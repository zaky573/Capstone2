<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Resources\DosenResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DosenWaliController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $dosenWali = $request->user()->mahasiswa?->dosenWali;

        return response()->json([
            'message' => 'OK',
            'data' => [
                'dosen_wali' => $dosenWali ? new DosenResource($dosenWali) : null,
            ],
        ]);
    }
}
