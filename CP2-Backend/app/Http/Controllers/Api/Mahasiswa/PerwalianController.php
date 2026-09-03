<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\StorePerwalianRequest;
use App\Http\Requests\Mahasiswa\UpdatePerwalianRequest;
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

    public function dashboard(Request $request): JsonResponse
    {
        $mahasiswa = $request->user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'message' => 'Data mahasiswa tidak ditemukan',
                'data' => null,
            ], 404);
        }

        $rows = $mahasiswa->perwalian()->get();
        $last = $rows->sortByDesc('created_at')->first();

        $dosenWali = $mahasiswa->dosenWali;
        if ($dosenWali) {
            $dosenWali->load('user');
        }

        $lastPerwalian = null;
        if ($last) {
            $last->load('mahasiswa');
            if ($last->mahasiswa?->dosenWali) {
                $last->mahasiswa->dosenWali->load('user');
            }
            $lastPerwalian = new PerwalianResource($last);
        }

        return response()->json([
            'message' => 'OK',
            'data' => [
                'mahasiswa' => $mahasiswa->load(['user', 'dosenWali.user']),
                'dosen_wali' => $dosenWali ? new \App\Http\Resources\DosenResource($dosenWali) : null,
                'total_perwalian' => $rows->count(),
                'menunggu_verifikasi' => $rows->where('status', 'menunggu_verifikasi')->count(),
                'selesai' => $rows->where('status', 'selesai')->count(),
                'perwalian_terakhir' => $lastPerwalian,
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->perwalianService->paginateForMahasiswa(
            $request->user()->mahasiswa,
            $request->all()
        );

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

    public function store(StorePerwalianRequest $request): JsonResponse
    {
        $perwalian = $this->perwalianService->createForMahasiswa(
            $request->user()->mahasiswa,
            $request->validated()
        );

        return response()->json([
            'message' => 'Pencatatan perwalian berhasil dibuat',
            'data' => new PerwalianResource($perwalian),
        ], 201);
    }

    public function show(Request $request, Perwalian $perwalian): JsonResponse
    {
        $this->authorize('view', $perwalian);

        return response()->json([
            'message' => 'OK',
            'data' => new PerwalianResource($perwalian->load('mahasiswa.dosenWali')),
        ]);
    }

    public function update(UpdatePerwalianRequest $request, Perwalian $perwalian): JsonResponse
    {
        $this->authorize('update', $perwalian);

        $perwalian = $this->perwalianService->updateForMahasiswa($perwalian, $request->validated());

        return response()->json([
            'message' => 'Pencatatan perwalian berhasil diperbarui',
            'data' => new PerwalianResource($perwalian),
        ]);
    }
}
