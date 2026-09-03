<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MahasiswaTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function array(): array
    {
        return [
            [
                '221102001',
                'Ahmad Pratama',
                '',
                'L',
                'Teknik Informatika',
                '2024',
                '1',
                '081234567890',
                'Jl. Merdeka No. 1, Bandung',
                'Bandung',
                '2004-05-15',
                '0412345601',
            ],
            [
                '221102002',
                'Siti Nurhaliza',
                '',
                'P',
                'Sistem Informasi',
                '2024',
                '1',
                '081234567891',
                'Jl. Sudirman No. 10, Bandung',
                'Jakarta',
                '2004-08-20',
                '',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'NIM',
            'Nama Lengkap',
            'Email',
            'Jenis Kelamin',
            'Program Studi',
            'Angkatan',
            'Semester',
            'No HP',
            'Alamat',
            'Tempat Lahir',
            'Tanggal Lahir',
            'NIDN Dosen Wali',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $lastCol = 'L';
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
