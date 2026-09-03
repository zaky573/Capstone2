<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perwalian', function (Blueprint $table) {
            $table->string('tanggal_ketemu', 10)->nullable()->after('komentar_dosen');
            $table->string('jam_ketemu', 5)->nullable()->after('tanggal_ketemu');
            $table->string('lokasi_pertemuan', 255)->nullable()->after('jam_ketemu');
            $table->text('catatan_jadwal')->nullable()->after('lokasi_pertemuan');
        });
    }

    public function down(): void
    {
        Schema::table('perwalian', function (Blueprint $table) {
            $table->dropColumn(['tanggal_ketemu', 'jam_ketemu', 'lokasi_pertemuan', 'catatan_jadwal']);
        });
    }
};
