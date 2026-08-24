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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nim', 20)->unique();
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('program_studi');
            $table->unsignedSmallInteger('angkatan');
            $table->unsignedTinyInteger('semester');
            $table->string('status_akademik', 20)->default('Aktif');
            $table->string('no_hp', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->foreignId('dosen_wali_id')->nullable()->constrained('dosen')->nullOnDelete();
            $table->timestamps();

            $table->index('program_studi');
            $table->index('dosen_wali_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
