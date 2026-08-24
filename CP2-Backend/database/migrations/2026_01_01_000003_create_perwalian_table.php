<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('perwalian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->string('tahun_akademik', 9);
            $table->enum('semester', ['ganjil', 'genap']);
            $table->text('uraian');
            $table->text('kendala')->nullable();
            $table->text('rencana_studi')->nullable();
            $table->text('komentar_dosen')->nullable();
            $table->enum('status', ['menunggu_verifikasi', 'diverifikasi', 'selesai'])
                ->default('menunggu_verifikasi');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('tahun_akademik');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perwalian');
    }
};
