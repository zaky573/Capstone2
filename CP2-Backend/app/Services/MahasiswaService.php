<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class MahasiswaService
{
    public function __construct(
        private readonly ImportService $importService,
    ) {}

    public function paginate(array $filters): LengthAwarePaginator
    {
        return Mahasiswa::query()
            ->with(['user', 'dosenWali'])
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            })
            ->when($filters['prodi'] ?? null, fn ($q, $prodi) => $q->where('program_studi', $prodi))
            ->when($filters['angkatan'] ?? null, fn ($q, $angkatan) => $q->where('angkatan', $angkatan))
            ->when($filters['semester'] ?? null, fn ($q, $semester) => $q->where('semester', $semester))
            ->when($filters['dosen_wali_id'] ?? null, fn ($q, $id) => $q->where('dosen_wali_id', $id))
            ->when(($filters['tanpa_wali'] ?? false), fn ($q) => $q->whereNull('dosen_wali_id'))
            ->orderByDesc('angkatan')
            ->orderBy('nim')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function store(array $data): Mahasiswa
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['nim'],
                'email' => $data['email'] ?? null,
                'password' => AuthService::DEFAULT_PASSWORD_MAHASISWA,
                'role' => UserRole::MAHASISWA,
                'is_active' => true,
                'must_change_password' => true,
            ]);

            return Mahasiswa::create(array_merge($data, [
                'user_id' => $user->id,
            ]));
        });
    }

    public function update(Mahasiswa $mahasiswa, array $data): Mahasiswa
    {
        return DB::transaction(function () use ($mahasiswa, $data) {
            $mahasiswa->fill($data)->save();

            $mahasiswa->user->forceFill([
                'email' => $data['email'] ?? $mahasiswa->user->email,
            ])->save();

            return $mahasiswa->load(['user', 'dosenWali']);
        });
    }

    public function destroy(Mahasiswa $mahasiswa): void
    {
        DB::transaction(function () use ($mahasiswa) {
            $mahasiswa->perwalian()->delete();
            $mahasiswa->user()->delete();
            $mahasiswa->delete();
        });
    }

    public function assignDosenWali(Mahasiswa $mahasiswa, ?int $dosenId): Mahasiswa
    {
        if ($dosenId !== null && ! Dosen::whereKey($dosenId)->exists()) {
            throw ValidationException::withMessages([
                'dosen_id' => 'Dosen tidak ditemukan.',
            ]);
        }

        $mahasiswa->forceFill(['dosen_wali_id' => $dosenId])->save();

        return $mahasiswa->load('dosenWali');
    }

    public function import($file): array
    {
        try {
            return $this->importService->importMahasiswa($file);
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'file' => 'Gagal memproses file: '.$e->getMessage(),
            ]);
        }
    }
}
