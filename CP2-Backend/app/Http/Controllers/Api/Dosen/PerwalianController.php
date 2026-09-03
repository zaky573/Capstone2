<?php

namespace App\Http\Controllers\Api\Dosen;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dosen\KomentarPerwalianRequest;
use App\Http\Requests\Dosen\UpdateStatusRequest;
use App\Http\Resources\PerwalianResource;
use App\Models\Perwalian;
use App\Services\PerwalianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerwalianController extends Controller
{
    public function __construct(
        private readonly PerwalianService $perwalianService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->perwalianService->paginateForDosen($request->user(), $request->all());

        return response()->json([
            'message' => 'OK',
            'data' => PerwalianResource::collection($items),
            'meta' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
            ],
        ]);
    }

    public function show(Request $request, Perwalian $perwalian): JsonResponse
    {
        $this->authorize('view', $perwalian);

        return response()->json([
            'message' => 'OK',
            'data' => new PerwalianResource($perwalian->load('mahasiswa.dosenWali')),
        ]);
    }

    public function komentar(KomentarPerwalianRequest $request, Perwalian $perwalian): JsonResponse
    {
        $this->authorize('verify', $perwalian);

        $perwalian = $this->perwalianService->komentar($perwalian, $request->input('komentar_dosen'));

        return response()->json([
            'message' => 'Komentar berhasil disimpan',
            'data' => new PerwalianResource($perwalian),
        ]);
    }

    public function updateStatus(UpdateStatusRequest $request, Perwalian $perwalian): JsonResponse
    {
        $this->authorize('verify', $perwalian);

        $perwalian = $this->perwalianService->updateStatus(
            $perwalian,
            $request->input('status'),
            $request->only(['tanggal_ketemu', 'jam_ketemu', 'lokasi_pertemuan', 'catatan_jadwal'])
        );

        return response()->json([
            'message' => 'Status perwalian diubah menjadi '.$perwalian->status->label(),
            'data' => new PerwalianResource($perwalian),
        ]);
    }
}
