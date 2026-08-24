<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\MahasiswaTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignDosenWaliRequest;
use App\Http\Requests\Admin\ImportRequest;
use App\Http\Requests\Admin\StoreMahasiswaRequest;
use App\Http\Requests\Admin\UpdateMahasiswaRequest;
use App\Http\Resources\MahasiswaResource;
use App\Models\Mahasiswa;
use App\Services\MahasiswaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class MahasiswaController extends Controller
{
    public function __construct(
        private readonly MahasiswaService $mahasiswaService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->mahasiswaService->paginate($request->all());

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

    public function store(StoreMahasiswaRequest $request): JsonResponse
    {
        $mahasiswa = $this->mahasiswaService->store($request->validated());

        return response()->json([
            'message' => 'Mahasiswa berhasil ditambahkan',
            'data' => new MahasiswaResource($mahasiswa->load(['user', 'dosenWali'])),
        ], 201);
    }

    public function show(Mahasiswa $mahasiswa): JsonResponse
    {
        return response()->json([
            'message' => 'OK',
            'data' => new MahasiswaResource($mahasiswa->load(['user', 'dosenWali'])),
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa): JsonResponse
    {
        $mahasiswa = $this->mahasiswaService->update($mahasiswa, $request->validated());

        return response()->json([
            'message' => 'Mahasiswa berhasil diperbarui',
            'data' => new MahasiswaResource($mahasiswa->load(['user', 'dosenWali'])),
        ]);
    }

    public function destroy(Mahasiswa $mahasiswa): JsonResponse
    {
        $this->mahasiswaService->destroy($mahasiswa);

        return response()->json([
            'message' => 'Mahasiswa berhasil dihapus',
            'data' => null,
        ]);
    }

    public function import(ImportRequest $request): JsonResponse
    {
        $result = $this->mahasiswaService->import($request->file('file'));

        return response()->json([
            'message' => 'Import selesai',
            'data' => $result,
        ]);
    }

    public function template()
    {
        return Excel::download(new MahasiswaTemplateExport, 'template_import_mahasiswa.xlsx');
    }

    public function assignDosenWali(AssignDosenWaliRequest $request, Mahasiswa $mahasiswa): JsonResponse
    {
        $mahasiswa = $this->mahasiswaService->assignDosenWali($mahasiswa, $request->input('dosen_id'));

        return response()->json([
            'message' => 'Dosen wali berhasil ditentukan',
            'data' => new MahasiswaResource($mahasiswa->load(['user', 'dosenWali'])),
        ]);
    }
}
