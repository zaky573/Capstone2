<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\DosenTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportRequest;
use App\Http\Requests\Admin\StoreDosenRequest;
use App\Http\Requests\Admin\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;
use App\Services\DosenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class DosenController extends Controller
{
    public function __construct(
        private readonly DosenService $dosenService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->dosenService->paginate($request->all());

        return response()->json([
            'message' => 'OK',
            'data' => DosenResource::collection($items),
            'meta' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
            ],
            'filter_options' => [
                'prodi' => [],
            ],
        ]);
    }

    public function store(StoreDosenRequest $request): JsonResponse
    {
        $dosen = $this->dosenService->store($request->validated());

        return response()->json([
            'message' => 'Dosen berhasil ditambahkan',
            'data' => new DosenResource($dosen->load('user')),
        ], 201);
    }

    public function show(Dosen $dosen): JsonResponse
    {
        return response()->json([
            'message' => 'OK',
            'data' => new DosenResource($dosen->load(['user', 'mahasiswaBimbingan'])),
        ]);
    }

    public function update(UpdateDosenRequest $request, Dosen $dosen): JsonResponse
    {
        $dosen = $this->dosenService->update($dosen, $request->validated());

        return response()->json([
            'message' => 'Dosen berhasil diperbarui',
            'data' => new DosenResource($dosen->load('user')),
        ]);
    }

    public function destroy(Dosen $dosen): JsonResponse
    {
        $this->dosenService->destroy($dosen);

        return response()->json([
            'message' => 'Dosen berhasil dihapus',
            'data' => null,
        ]);
    }

    public function import(ImportRequest $request): JsonResponse
    {
        $result = $this->dosenService->import($request->file('file'));

        return response()->json([
            'message' => 'Import selesai',
            'data' => $result,
        ]);
    }

    public function template()
    {
        return Excel::download(new DosenTemplateExport, 'template_import_dosen.xlsx');
    }
}
