<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DosenTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            [
                '0412345601',
                'Dr. Budi Santoso, M.Kom.',
                'budi@stmik-bandung.ac.id',
                'L',
                '081234567899',
                'Jl. Dago No. 100, Bandung',
            ],
            [
                '0412345602',
                'Rina Marlina, S.Kom., M.T.',
                'rina@stmik-bandung.ac.id',
                'P',
                '081234567898',
                'Jl. Riau No. 45, Bandung',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'nidn',
            'nama_lengkap',
            'email',
            'jenis_kelamin',
            'no_hp',
            'alamat',
        ];
    }
}
