<?php

namespace Database\Seeders;

use App\Enums\PerwalianStatus;
use App\Enums\Semester;
use App\Enums\UserRole;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Perwalian;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'username' => 'admin',
            'email' => 'admin@stmik-bandung.ac.id',
            'password' => Hash::make('admin123'),
            'role' => UserRole::ADMIN,
            'is_active' => true,
            'must_change_password' => false,
        ]);

        $dosenData = [
            [
                'nidn' => '0426018001',
                'nama_lengkap' => 'Dr. Budi Santoso, M.Kom.',
                'jenis_kelamin' => 'L',
                'no_hp' => '081234560001',
                'alamat' => 'Jl. Dago Asri No. 12, Bandung',
            ],
            [
                'nidn' => '0417048202',
                'nama_lengkap' => 'Siti Rahmawati, M.T.',
                'jenis_kelamin' => 'P',
                'no_hp' => '081234560002',
                'alamat' => 'Jl. Buah Batu No. 88, Bandung',
            ],
            [
                'nidn' => '0401057803',
                'nama_lengkap' => 'Asep Saepudin, S.Kom., M.Kom.',
                'jenis_kelamin' => 'L',
                'no_hp' => '081234560003',
                'alamat' => 'Jl. Setiabudi No. 21, Bandung',
            ],
        ];

        $dosenModels = [];
        foreach ($dosenData as $i => $d) {
            $user = User::create([
                'username' => $d['nidn'],
                'email' => strtolower(str_replace([' ', '.'], '', $d['nama_lengkap'])).'@stmik-bandung.ac.id',
                'password' => Hash::make('dosen123'),
                'role' => UserRole::DOSEN,
                'is_active' => true,
                'must_change_password' => false,
            ]);
            $dosenModels[] = Dosen::create(array_merge($d, ['user_id' => $user->id]));
        }

        $mahasiswaData = [
            ['nim' => '211102001', 'nama_lengkap' => 'Andi Pratama', 'jk' => 'L', 'prodi' => 'Teknik Informatika', 'angkatan' => 2021, 'semester' => 9, 'wali' => 0],
            ['nim' => '211102002', 'nama_lengkap' => 'Bella Anggraini', 'jk' => 'P', 'prodi' => 'Teknik Informatika', 'angkatan' => 2021, 'semester' => 9, 'wali' => 0],
            ['nim' => '221103001', 'nama_lengkap' => 'Citra Lestari', 'jk' => 'P', 'prodi' => 'Sistem Informasi', 'angkatan' => 2022, 'semester' => 7, 'wali' => 1],
            ['nim' => '221103002', 'nama_lengkap' => 'Deni Firmansyah', 'jk' => 'L', 'prodi' => 'Sistem Informasi', 'angkatan' => 2022, 'semester' => 7, 'wali' => 1],
            ['nim' => '231101001', 'nama_lengkap' => 'Eka Wulandari', 'jk' => 'P', 'prodi' => 'D3 Manajemen Informatika', 'angkatan' => 2023, 'semester' => 5, 'wali' => 2],
            ['nim' => '231101002', 'nama_lengkap' => 'Fajar Nugroho', 'jk' => 'L', 'prodi' => 'D3 Manajemen Informatika', 'angkatan' => 2023, 'semester' => 5, 'wali' => 2],
        ];

        $mahasiswaModels = [];
        foreach ($mahasiswaData as $m) {
            $user = User::create([
                'username' => $m['nim'],
                'email' => strtolower(str_replace(' ', '', $m['nama_lengkap'])).'@student.stmik-bandung.ac.id',
                'password' => Hash::make('mahasiswa123'),
                'role' => UserRole::MAHASISWA,
                'is_active' => true,
                'must_change_password' => false,
            ]);
            $mahasiswaModels[] = Mahasiswa::create([
                'user_id' => $user->id,
                'nim' => $m['nim'],
                'nama_lengkap' => $m['nama_lengkap'],
                'jenis_kelamin' => $m['jk'],
                'program_studi' => $m['prodi'],
                'angkatan' => $m['angkatan'],
                'semester' => $m['semester'],
                'status_akademik' => 'Aktif',
                'no_hp' => '08'.rand(1000000000, 9999999999),
                'alamat' => 'Jl. Contoh No. '.rand(1, 99).', Bandung',
                'dosen_wali_id' => $dosenModels[$m['wali']]->id,
            ]);
        }

        $sejarah = [
            ['mhs' => 0, 'ta' => '2024/2025', 'sem' => Semester::GENAP, 'status' => PerwalianStatus::SELESAI],
            ['mhs' => 0, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::DIVERIFIKASI],
            ['mhs' => 1, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::MENUNGGU_VERIFIKASI],
            ['mhs' => 2, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::SELESAI],
            ['mhs' => 3, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::DIVERIFIKASI],
            ['mhs' => 4, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::MENUNGGU_VERIFIKASI],
            ['mhs' => 5, 'ta' => '2025/2026', 'sem' => Semester::GANJIL, 'status' => PerwalianStatus::SELESAI],
        ];

        foreach ($sejarah as $i => $s) {
            $isDone = in_array($s['status'], [PerwalianStatus::SELESAI, PerwalianStatus::DIVERIFIKASI], true);

            $createdAt = now()->subDays(rand(2, 60));
            $p = new Perwalian();
            $p->forceFill([
                'mahasiswa_id' => $mahasiswaModels[$s['mhs']]->id,
                'tahun_akademik' => $s['ta'],
                'semester' => $s['sem'],
                'uraian' => 'Konsultasi perwalian semester '.$s['sem']->label().' TA '.$s['ta'].' membahas rencana studi dan perkembangan akademik.',
                'kendala' => $i % 2 === 0 ? 'Kendala pada pemahaman mata kuliah praktikum dan pembagian waktu belajar.' : null,
                'rencana_studi' => 'Menambah jam belajar dan mengikuti program bimbingan akademik kampus.',
                'komentar_dosen' => $isDone ? 'Saran: tingkatkan kedisiplinan dan segera konsultasikan kendala berikutnya.' : null,
                'status' => $s['status'],
                'verified_at' => $isDone ? now()->subDays(rand(1, 30)) : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt->copy()->addSeconds(rand(0, 86400)),
            ])->save();
        }
    }
}
