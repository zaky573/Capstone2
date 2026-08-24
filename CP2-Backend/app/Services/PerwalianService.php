<?php

namespace App\Services;

use App\Enums\PerwalianStatus;
use App\Models\Mahasiswa;
use App\Models\Perwalian;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class PerwalianService
{
    public function paginateForMahasiswa(Mahasiswa $mahasiswa, array $filters): LengthAwarePaginator
    {
        return Perwalian::query()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->with('mahasiswa.dosenWali')
            ->when($filters['tahun_akademik'] ?? null, fn ($q, $ta) => $q->where('tahun_akademik', $ta))
            ->when($filters['semester'] ?? null, fn ($q, $sem) => $q->where('semester', $sem))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function createForMahasiswa(Mahasiswa $mahasiswa, array $data): Perwalian
    {
        $exists = Perwalian::query()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->where('tahun_akademik', $data['tahun_akademik'])
            ->where('semester', $data['semester'])
            ->whereIn('status', [PerwalianStatus::DIVERIFIKASI, PerwalianStatus::SELESAI])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'perwalian' => 'Anda sudah memiliki perwalian yang diverifikasi/diselesaikan pada semester ini.',
            ]);
        }

        return Perwalian::create(array_merge($data, [
            'mahasiswa_id' => $mahasiswa->id,
            'status' => PerwalianStatus::MENUNGGU_VERIFIKASI,
        ]))->load('mahasiswa.dosenWali');
    }

    public function updateForMahasiswa(Perwalian $perwalian, array $data): Perwalian
    {
        if ($perwalian->status !== PerwalianStatus::MENUNGGU_VERIFIKASI) {
            throw ValidationException::withMessages([
                'perwalian' => 'Perwalian sudah diverifikasi dan tidak dapat diubah.',
            ]);
        }

        $perwalian->fill($data)->save();

        return $perwalian->load('mahasiswa.dosenWali');
    }

    public function paginateForDosen(User $dosenUser, array $filters): LengthAwarePaginator
    {
        return Perwalian::query()
            ->whereHas('mahasiswa', fn (Builder $q) => $q->where('dosen_wali_id', $dosenUser->dosen->id))
            ->with('mahasiswa.dosenWali')
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['tahun_akademik'] ?? null, fn ($q, $ta) => $q->where('tahun_akademik', $ta))
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->whereHas('mahasiswa', function (Builder $sub) use ($search) {
                    $sub->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function paginateForAdmin(array $filters): LengthAwarePaginator
    {
        return Perwalian::query()
            ->with('mahasiswa.dosenWali')
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['tahun_akademik'] ?? null, fn ($q, $ta) => $q->where('tahun_akademik', $ta))
            ->when($filters['prodi'] ?? null, function ($q, $prodi) {
                $q->whereHas('mahasiswa', fn (Builder $sub) => $sub->where('program_studi', $prodi));
            })
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->whereHas('mahasiswa', function (Builder $sub) use ($search) {
                    $sub->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function komentar(Perwalian $perwalian, string $komentar): Perwalian
    {
        $perwalian->forceFill(['komentar_dosen' => $komentar])->save();

        return $perwalian->load('mahasiswa.dosenWali');
    }

    public function updateStatus(Perwalian $perwalian, string $status): Perwalian
    {
        if (! in_array($status, [PerwalianStatus::DIVERIFIKASI->value, PerwalianStatus::SELESAI->value], true)) {
            throw ValidationException::withMessages([
                'status' => 'Status tidak valid.',
            ]);
        }

        $perwalian->forceFill([
            'status' => $status,
            'verified_at' => now(),
        ])->save();

        return $perwalian->load('mahasiswa.dosenWali');
    }
}
