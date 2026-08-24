<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case DOSEN = 'dosen';
    case MAHASISWA = 'mahasiswa';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::DOSEN => 'Dosen',
            self::MAHASISWA => 'Mahasiswa',
        };
    }
}
