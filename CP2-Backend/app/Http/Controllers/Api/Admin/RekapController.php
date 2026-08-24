<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\RekapExport;
use App\Http\Controllers\Controller;
use App\Services\RekapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class RekapController extends Controller
{
    public function __construct(
        private readonly RekapService $rekapService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'OK',
            'data' => $this->rekapService->summary($request->only([
                'tahun_akademik', 'prodi', 'status_pengajuan',
            ])),
        ]);
    }

    public function export(Request $request)
    {
        $rows = $this->rekapService->exportRows($request->only([
            'tahun_akademik', 'prodi', 'status_pengajuan',
        ]));

        return Excel::download(new RekapExport($rows), 'rekap-perwalian.xlsx');
    }
}
