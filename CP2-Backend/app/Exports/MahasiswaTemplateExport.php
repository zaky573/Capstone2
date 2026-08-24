<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MahasiswaTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            [
                '221102001',
                'Ahmad Pratama',
                'ahmad@example.com',
                'L',
                'Teknik Informatika',
                '2024',
                '1',
                '081234567890',
                'Jl. Merdeka No. 1, Bandung',
                '0412345601',
            ],
            [
                '221102002',
                'Siti Nurhaliza',
                'siti@example.com',
                'P',
                'Sistem Informasi',
                '2024',
                '1',
                '081234567891',
                'Jl. Sudirman No. 10, Bandung',
                '',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'nim',
            'nama_lengkap',
            'email',
            'jenis_kelamin',
            'program_studi',
            'angkatan',
            'semester',
            'no_hp',
            'alamat',
            'nidn_dosen_wali',
        ];
    }
}
