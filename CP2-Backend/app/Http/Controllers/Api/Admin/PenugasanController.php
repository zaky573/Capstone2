<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MahasiswaResource;
use App\Services\MahasiswaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PenugasanController extends Controller
{
    public function __construct(
        private readonly MahasiswaService $mahasiswaService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->mahasiswaService->paginate([
            ...$request->all(),
            'tanpa_wali' => false,
        ]);

        return response()->json([
            'message' => 'OK',
            'data' => MahasiswaResource::collection($items),
            'meta' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
            ],
        ]);
    }
}
