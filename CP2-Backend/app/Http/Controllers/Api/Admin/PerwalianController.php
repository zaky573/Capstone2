<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dosen\KomentarPerwalianRequest;
use App\Http\Requests\Dosen\UpdateStatusRequest;
use App\Http\Resources\PerwalianResource;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Perwalian;
use App\Services\PerwalianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerwalianController extends Controller
{
    public function __construct(
        private readonly PerwalianService $perwalianService,
    ) {}

    public function dashboard(): JsonResponse
    {
        $perwalian = Perwalian::query();
        $tahunAkademikList = Perwalian::query()
            ->select('tahun_akademik')
            ->distinct()
            ->orderByDesc('tahun_akademik')
            ->pluck('tahun_akademik');

        $data = [
            'total_mahasiswa' => Mahasiswa::count(),
            'total_dosen' => Dosen::count(),
            'mahasiswa_tanpa_wali' => Mahasiswa::whereNull('dosen_wali_id')->count(),
            'total_perwalian' => $perwalian->count(),
            'perwalian_menunggu' => (clone $perwalian)->where('status', 'menunggu_verifikasi')->count(),
            'perwalian_diverifikasi' => (clone $perwalian)->where('status', 'diverifikasi')->count(),
            'perwalian_selesai' => (clone $perwalian)->where('status', 'selesai')->count(),
            'tahun_akademik_list' => $tahunAkademikList,
            'recent' => PerwalianResource::collection(
                Perwalian::query()
                    ->with('mahasiswa.dosenWali')
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get()
            ),
        ];

        return response()->json([
            'message' => 'OK',
            'data' => $data,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->perwalianService->paginateForAdmin($request->all());

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

        $perwalian = $this->perwalianService->updateStatus($perwalian, $request->input('status'));

        return response()->json([
            'message' => 'Status perwalian diubah menjadi '.$perwalian->status->label(),
            'data' => new PerwalianResource($perwalian),
        ]);
    }
}
