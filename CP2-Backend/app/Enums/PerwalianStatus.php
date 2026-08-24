<?php

namespace App\Enums;

enum PerwalianStatus: string
{
    case MENUNGGU_VERIFIKASI = 'menunggu_verifikasi';
    case DIVERIFIKASI = 'diverifikasi';
    case SELESAI = 'selesai';

    public function label(): string
    {
        return match ($this) {
            self::MENUNGGU_VERIFIKASI => 'Menunggu Verifikasi',
            self::DIVERIFIKASI => 'Diverifikasi',
            self::SELESAI => 'Selesai',
        };
    }
}
