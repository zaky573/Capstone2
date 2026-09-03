<?php

namespace App\Imports;

use App\Enums\UserRole;
use App\Models\Dosen;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class DosenImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsOnError
{
    use Importable;

    private int $imported = 0;

    /** @var array<int, array{row:int, reason:string}> */
    private array $failed = [];

    /** @var array<int, Failure> */
    private array $failures = [];

    public function model(array $row)
    {
        $nidn = trim((string) ($row['nidn'] ?? ''));
        if ($nidn === '') {
            return null;
        }

        $existingDosen = Dosen::where('nidn', $nidn)->first();
        if ($existingDosen) {
            return null;
        }

        return DB::transaction(function () use ($row, $nidn) {
            $user = User::where('username', $nidn)->first();

            if (!$user) {
                $user = User::create([
                    'username' => $nidn,
                    'email' => ($row['email'] ?? null) ?: null,
                    'password' => AuthService::DEFAULT_PASSWORD_DOSEN,
                    'role' => UserRole::DOSEN,
                    'is_active' => true,
                    'must_change_password' => true,
                ]);
            } elseif (($row['email'] ?? null) && $user->email !== $row['email']) {
                $user->update(['email' => $row['email']]);
            }

            $this->imported++;

            return new Dosen([
                'user_id' => $user->id,
                'nidn' => $nidn,
                'nama_lengkap' => $row['nama_lengkap'] ?? null,
                'jenis_kelamin' => ($row['jenis_kelamin'] ?? null) ? strtoupper($row['jenis_kelamin']) : 'L',
                'no_hp' => $row['no_hp'] ?? null,
                'alamat' => $row['alamat'] ?? null,
                'tempat_lahir' => $row['tempat_lahir'] ?? null,
                'tanggal_lahir' => $row['tanggal_lahir'] ?? null,
                'pendidikan_jurusan' => $row['pendidikan_jurusan'] ?? null,
                'pendidikan_universitas' => $row['pendidikan_universitas'] ?? null,
            ]);
        });
    }

    public function rules(): array
    {
        return [
            'nidn' => 'required',
            'nama_lengkap' => 'required',
        ];
    }

    public function onFailure(Failure ...$failures): void
    {
        $this->failures = array_merge($this->failures, $failures);
    }

    public function onError(Throwable $e): void
    {
        $this->failed[] = [
            'row' => 0,
            'reason' => $e->getMessage(),
        ];
    }

    public function result(): array
    {
        foreach ($this->failures as $failure) {
            $this->failed[] = [
                'row' => $failure->row(),
                'reason' => $failure->errors()[0] ?? 'Data tidak valid',
            ];
        }

        return [
            'imported' => $this->imported,
            'failed' => $this->failed,
            'failed_rows' => $this->failed,
        ];
    }
}
