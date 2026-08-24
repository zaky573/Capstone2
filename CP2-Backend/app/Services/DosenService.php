<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Dosen;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class DosenService
{
    public function __construct(
        private readonly ImportService $importService,
    ) {}

    public function paginate(array $filters): LengthAwarePaginator
    {
        return Dosen::query()
            ->withCount('mahasiswaBimbingan')
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('nidn', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama_lengkap')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    public function store(array $data): Dosen
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['nidn'],
                'email' => $data['email'] ?? null,
                'password' => AuthService::DEFAULT_PASSWORD_DOSEN,
                'role' => UserRole::DOSEN,
                'is_active' => true,
                'must_change_password' => true,
            ]);

            return Dosen::create(array_merge($data, ['user_id' => $user->id]));
        });
    }

    public function update(Dosen $dosen, array $data): Dosen
    {
        return DB::transaction(function () use ($dosen, $data) {
            $dosen->fill($data)->save();

            $dosen->user->forceFill([
                'email' => $data['email'] ?? $dosen->user->email,
            ])->save();

            return $dosen->load('user');
        });
    }

    public function destroy(Dosen $dosen): void
    {
        DB::transaction(function () use ($dosen) {
            if ($dosen->mahasiswaBimbingan()->exists()) {
                throw ValidationException::withMessages([
                    'dosen' => 'Dosen masih memiliki mahasiswa bimbingan. Pindahkan dulu sebelum dihapus.',
                ]);
            }

            $dosen->user()->delete();
            $dosen->delete();
        });
    }

    public function import($file): array
    {
        try {
            return $this->importService->importDosen($file);
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'file' => 'Gagal memproses file: '.$e->getMessage(),
            ]);
        }
    }
}
