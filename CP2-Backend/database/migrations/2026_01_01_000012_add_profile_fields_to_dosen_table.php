<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->string('tempat_lahir', 100)->nullable()->after('alamat');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->string('pendidikan_jurusan', 150)->nullable()->after('tanggal_lahir');
            $table->string('pendidikan_universitas', 200)->nullable()->after('pendidikan_jurusan');
        });
    }

    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn(['tempat_lahir', 'tanggal_lahir', 'pendidikan_jurusan', 'pendidikan_universitas']);
        });
    }
};
