<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DosenTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function array(): array
    {
        return [
            [
                '0412345601',
                'Dr. Budi Santoso, M.Kom.',
                '',
                'L',
                '081234567899',
                'Jl. Dago No. 100, Bandung',
                'Bandung',
                '1985-03-10',
                'Teknik Informatika',
                'Universitas Indonesia',
            ],
            [
                '0412345602',
                'Rina Marlina, S.Kom., M.T.',
                '',
                'P',
                '081234567898',
                'Jl. Riau No. 45, Bandung',
                'Jakarta',
                '1990-07-22',
                'Sistem Informasi',
                'Institut Teknologi Bandung',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'NIDN',
            'Nama Lengkap',
            'Email',
            'Jenis Kelamin',
            'No HP',
            'Alamat',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Pendidikan Jurusan',
            'Pendidikan Universitas',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $lastCol = 'J';
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '122C4E']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center', 'wrapText' => true],
            ],
            'A1:' . $lastCol . '1' => [
                'font' => ['bold' => true, 'size' => 11],
            ],
        ];
    }
}
