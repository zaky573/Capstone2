<?php

namespace App\Services;

use App\Enums\PerwalianStatus;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Perwalian;

class RekapService
{
    public function summary(array $filters): array
    {
        $tahunAkademik = $filters['tahun_akademik'] ?? null;
        $prodiFilter = $filters['prodi'] ?? null;
        $statusPengajuan = $filters['status_pengajuan'] ?? null;

        $allTa = Perwalian::query()
            ->select('tahun_akademik')
            ->distinct()
            ->pluck('tahun_akademik')
            ->filter()
            ->values()
            ->all();

        $currentYear = (int) date('Y');
        $generatedTa = [];
        for ($y = $currentYear; $y >= $currentYear - 5; $y--) {
            $generatedTa[] = sprintf('%d/%d', $y, $y + 1);
        }
        $allTa = array_values(array_unique(array_merge($allTa, $generatedTa)));
        rsort($allTa);

        $allProdis = Mahasiswa::query()
            ->select('program_studi')
            ->distinct()
            ->orderBy('program_studi')
            ->pluck('program_studi')
            ->filter()
            ->values()
            ->all();

        $prodis = $prodiFilter ? array_values(array_intersect($allProdis, [$prodiFilter])) : $allProdis;

        $summary = [];
        foreach ($prodis as $prodi) {
            $mhsIds = Mahasiswa::where('program_studi', $prodi)->pluck('id');

            $rows = Perwalian::query()
                ->whereIn('mahasiswa_id', $mhsIds)
                ->when($tahunAkademik, fn ($q) => $q->where('tahun_akademik', $tahunAkademik))
                ->get();

            $uniqueMhsInTa = $rows->pluck('mahasiswa_id')->unique();
            $mhsCount = $mhsIds->count();

            if ($statusPengajuan === 'terisi') {
                $filteredMhsCount = $uniqueMhsInTa->count();
            } elseif ($statusPengajuan === 'kosong') {
                $filteredMhsCount = $mhsCount - $uniqueMhsInTa->count();
            } else {
                $filteredMhsCount = $mhsCount;
            }

            $totalCount = $statusPengajuan === 'kosong' ? 0 : $rows->count();
            $selesaiCount = $statusPengajuan === 'kosong' ? 0 : $rows->where('status', PerwalianStatus::SELESAI)->count();
            $menungguCount = $statusPengajuan === 'kosong' ? 0 : $rows->where('status', PerwalianStatus::MENUNGGU_VERIFIKASI)->count();
            $diverifikasiCount = $statusPengajuan === 'kosong' ? 0 : $rows->where('status', PerwalianStatus::DIVERIFIKASI)->count();

            $summary[] = [
                'prodi' => $prodi,
                'jumlah_mahasiswa' => $filteredMhsCount,
                'total' => $totalCount,
                'menunggu_verifikasi' => $menungguCount,
                'diverifikasi' => $diverifikasiCount,
                'selesai' => $selesaiCount,
                'persentase_selesai' => $totalCount > 0 ? (int) round(($selesaiCount / $totalCount) * 100) : 0,
            ];
        }

        $totals = collect($summary)->reduce(
            fn ($carry, $s) => [
                'jumlah_mahasiswa' => $carry['jumlah_mahasiswa'] + $s['jumlah_mahasiswa'],
                'total' => $carry['total'] + $s['total'],
                'menunggu_verifikasi' => $carry['menunggu_verifikasi'] + $s['menunggu_verifikasi'],
                'diverifikasi' => $carry['diverifikasi'] + $s['diverifikasi'],
                'selesai' => $carry['selesai'] + $s['selesai'],
            ],
            ['jumlah_mahasiswa' => 0, 'total' => 0, 'menunggu_verifikasi' => 0, 'diverifikasi' => 0, 'selesai' => 0]
        );
        $totals['persentase_selesai'] = $totals['total'] > 0 ? (int) round(($totals['selesai'] / $totals['total']) * 100) : 0;

        // Detail Mahasiswa
        $mahasiswaQuery = Mahasiswa::query()
            ->with(['dosenWali', 'perwalian' => function ($q) use ($tahunAkademik) {
                $q->when($tahunAkademik, fn ($sq) => $sq->where('tahun_akademik', $tahunAkademik));
            }])
            ->when($prodiFilter, fn ($q) => $q->where('program_studi', $prodiFilter))
            ->when($statusPengajuan === 'terisi', function ($q) use ($tahunAkademik) {
                $q->whereHas('perwalian', function ($sq) use ($tahunAkademik) {
                    $sq->when($tahunAkademik, fn ($ssq) => $ssq->where('tahun_akademik', $tahunAkademik));
                });
            })
            ->when($statusPengajuan === 'kosong', function ($q) use ($tahunAkademik) {
                $q->whereDoesntHave('perwalian', function ($sq) use ($tahunAkademik) {
                    $sq->when($tahunAkademik, fn ($ssq) => $ssq->where('tahun_akademik', $tahunAkademik));
                });
            })
            ->get();

        $detail_mahasiswa = $mahasiswaQuery->map(function ($m) {
            $perwalians = $m->perwalian;
            return [
                'id' => $m->id,
                'nim' => $m->nim,
                'nama_lengkap' => $m->nama_lengkap,
                'program_studi' => $m->program_studi,
                'angkatan' => $m->angkatan,
                'semester' => $m->semester,
                'dosen_wali' => $m->dosenWali?->nama_lengkap ?? '-',
                'total_perwalian' => $perwalians->count(),
                'menunggu' => $perwalians->where('status', PerwalianStatus::MENUNGGU_VERIFIKASI)->count(),
                'diverifikasi' => $perwalians->where('status', PerwalianStatus::DIVERIFIKASI)->count(),
                'selesai' => $perwalians->where('status', PerwalianStatus::SELESAI)->count(),
            ];
        })->filter(function ($m) use ($statusPengajuan) {
            if ($statusPengajuan === 'terisi') {
                return $m['total_perwalian'] > 0;
            }
            if ($statusPengajuan === 'kosong') {
                return $m['total_perwalian'] === 0;
            }
            return true;
        })->values()->all();

        // Detail Dosen
        $dosenList = Dosen::with([
            'mahasiswaBimbingan' => function ($q) use ($prodiFilter, $statusPengajuan, $tahunAkademik) {
                $q->when($prodiFilter, fn ($sq) => $sq->where('program_studi', $prodiFilter))
                  ->when($statusPengajuan === 'terisi', function ($sq) use ($tahunAkademik) {
                      $sq->whereHas('perwalian', function ($ssq) use ($tahunAkademik) {
                          $ssq->when($tahunAkademik, fn ($sssq) => $sssq->where('tahun_akademik', $tahunAkademik));
                      });
                  })
                  ->when($statusPengajuan === 'kosong', function ($sq) use ($tahunAkademik) {
                      $sq->whereDoesntHave('perwalian', function ($ssq) use ($tahunAkademik) {
                          $ssq->when($tahunAkademik, fn ($sssq) => $sssq->where('tahun_akademik', $tahunAkademik));
                      });
                  });
            },
            'mahasiswaBimbingan.perwalian' => function ($q) use ($tahunAkademik) {
                $q->when($tahunAkademik, fn ($sq) => $sq->where('tahun_akademik', $tahunAkademik));
            },
        ])->get();

        $detail_dosen = $dosenList->map(function ($d) use ($statusPengajuan) {
            $allPerwalians = $d->mahasiswaBimbingan->flatMap->perwalian;
            $bimbinganCount = $d->mahasiswaBimbingan->count();

            return [
                'id' => $d->id,
                'nama_lengkap' => $d->nama_lengkap,
                'nidn' => $d->nidn,
                'jumlah_perwalian' => $bimbinganCount,
                'total_perwalian' => $statusPengajuan === 'kosong' ? 0 : $allPerwalians->count(),
                'menunggu' => $statusPengajuan === 'kosong' ? 0 : $allPerwalians->where('status', PerwalianStatus::MENUNGGU_VERIFIKASI)->count(),
                'selesai' => $statusPengajuan === 'kosong' ? 0 : $allPerwalians->where('status', PerwalianStatus::SELESAI)->count(),
            ];
        })->filter(function ($d) use ($statusPengajuan, $prodiFilter, $tahunAkademik) {
            if ($statusPengajuan === 'terisi') return $d['total_perwalian'] > 0;
            if ($statusPengajuan === 'kosong') return $d['jumlah_perwalian'] > 0 && $d['total_perwalian'] === 0;
            if ($prodiFilter || $tahunAkademik) return $d['total_perwalian'] > 0 || $d['jumlah_perwalian'] > 0;
            return true;
        })->values()->all();

        // Recent Perwalian
        $recent_perwalian = $statusPengajuan === 'kosong' ? [] : Perwalian::query()
            ->with(['mahasiswa.dosenWali'])
            ->when($tahunAkademik, fn ($q) => $q->where('tahun_akademik', $tahunAkademik))
            ->when($prodiFilter, fn ($q) => $q->whereHas('mahasiswa', fn ($mq) => $mq->where('program_studi', $prodiFilter)))
            ->latest()
            ->limit(10)
            ->get();

        return [
            'summary' => $summary,
            'totals' => $totals,
            'detail_mahasiswa' => $detail_mahasiswa,
            'detail_dosen' => $detail_dosen,
            'recent_perwalian' => $recent_perwalian,
            'filter_options' => [
                'tahun_akademik' => $allTa,
                'prodi' => $allProdis,
            ],
        ];
    }

    public function exportRows(array $filters): array
    {
        $data = $this->summary($filters);
        $rows = [];

        foreach ($data['summary'] as $s) {
            $rows[] = [
                'Program Studi' => $s['prodi'],
                'Jumlah Mahasiswa' => $s['jumlah_mahasiswa'],
                'Total Perwalian' => $s['total'],
                'Menunggu Verifikasi' => $s['menunggu_verifikasi'],
                'Diverifikasi' => $s['diverifikasi'],
                'Selesai' => $s['selesai'],
            ];
        }

        $rows[] = [
            'Program Studi' => 'TOTAL',
            'Jumlah Mahasiswa' => $data['totals']['jumlah_mahasiswa'],
            'Total Perwalian' => $data['totals']['total'],
            'Menunggu Verifikasi' => $data['totals']['menunggu_verifikasi'],
            'Diverifikasi' => $data['totals']['diverifikasi'],
            'Selesai' => $data['totals']['selesai'],
        ];

        return $rows;
    }
}
