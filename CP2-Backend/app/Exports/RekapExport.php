<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RekapExport implements FromArray, WithHeadings
{
    /**
     * @param array<int, array<string, mixed>> $rows
     */
    public function __construct(
        private readonly array $rows,
    ) {}

    public function array(): array
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'Program Studi',
            'Jumlah Mahasiswa',
            'Total Perwalian',
            'Menunggu Verifikasi',
            'Diverifikasi',
            'Selesai',
        ];
    }
}
