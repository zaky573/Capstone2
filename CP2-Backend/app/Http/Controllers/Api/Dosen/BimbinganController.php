<?php

namespace App\Http\Controllers\Api\Dosen;

use App\Http\Controllers\Controller;
use App\Http\Resources\MahasiswaResource;
use App\Http\Resources\PerwalianResource;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Perwalian;
use App\Services\PerwalianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BimbinganController extends Controller
{
    public function __construct(
        private readonly PerwalianService $perwalianService,
    ) {}

    public function dashboard(Request $request): JsonResponse
    {
        $dosen = $request->user()->dosen;
        $bimbingan = $dosen->mahasiswaBimbingan()->get();
        $ids = $bimbingan->pluck('id');

        $rows = Perwalian::whereIn('mahasiswa_id', $ids)->get();

        return response()->json([
            'message' => 'OK',
            'data' => [
                'dosen' => $dosen,
                'jumlah_mahasiswa' => $bimbingan->count(),
                'total_perwalian' => $rows->count(),
                'menunggu_verifikasi' => $rows->where('status', 'menunggu_verifikasi')->count(),
                'diverifikasi' => $rows->where('status', 'diverifikasi')->count(),
                'selesai' => $rows->where('status', 'selesai')->count(),
                'mahasiswa' => MahasiswaResource::collection(
                    $bimbingan->load(['user', 'dosenWali'])
                ),
                'recent' => PerwalianResource::collection(
                    Perwalian::whereIn('mahasiswa_id', $ids)
                        ->with('mahasiswa.dosenWali')
                        ->orderByDesc('created_at')
                        ->limit(5)
                        ->get()
                ),
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $dosen = $request->user()->dosen;

        $items = $dosen->mahasiswaBimbingan()
            ->with(['user', 'dosenWali'])
            ->withCount('perwalian')
            ->when($request->input('search'), function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            })
            ->orderBy('nim')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $items->each(function (Mahasiswa $m) {
            $m->perwalian_menunggu = $m->perwalian()
                ->where('status', 'menunggu_verifikasi')
                ->count();
        });

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
