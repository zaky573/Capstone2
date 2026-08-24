<?php

namespace App\Services;

use App\Imports\DosenImport;
use App\Imports\MahasiswaImport;
use Maatwebsite\Excel\Facades\Excel;

class ImportService
{
    public function importMahasiswa($file): array
    {
        $import = new MahasiswaImport;

        Excel::import($import, $file);

        return $import->result();
    }

    public function importDosen($file): array
    {
        $import = new DosenImport;

        Excel::import($import, $file);

        return $import->result();
    }
}
