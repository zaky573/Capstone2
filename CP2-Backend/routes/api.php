<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\Admin\DosenController as AdminDosenController;
use App\Http\Controllers\Api\Admin\MahasiswaController as AdminMahasiswaController;
use App\Http\Controllers\Api\Admin\PenugasanController;
use App\Http\Controllers\Api\Admin\PerwalianController as AdminPerwalianController;
use App\Http\Controllers\Api\Admin\RekapController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Dosen\BimbinganController;
use App\Http\Controllers\Api\Dosen\PerwalianController as DosenPerwalianController;
use App\Http\Controllers\Api\Mahasiswa\DosenWaliController;
use App\Http\Controllers\Api\Mahasiswa\PerwalianController as MahasiswaPerwalianController;
use Illuminate\Support\Facades\Route;

Route::get('/login', fn () => response()->json(['message' => 'Unauthenticated'], 401))->name('login');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // ============ ADMIN ============
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminPerwalianController::class, 'dashboard']);

        Route::get('/mahasiswa', [AdminMahasiswaController::class, 'index']);
        Route::get('/mahasiswa/template', [AdminMahasiswaController::class, 'template']);
        Route::post('/mahasiswa', [AdminMahasiswaController::class, 'store']);
        Route::get('/mahasiswa/{mahasiswa}', [AdminMahasiswaController::class, 'show']);
        Route::put('/mahasiswa/{mahasiswa}', [AdminMahasiswaController::class, 'update']);
        Route::delete('/mahasiswa/{mahasiswa}', [AdminMahasiswaController::class, 'destroy']);
        Route::post('/mahasiswa/import', [AdminMahasiswaController::class, 'import']);
        Route::put('/mahasiswa/{mahasiswa}/dosen-wali', [AdminMahasiswaController::class, 'assignDosenWali']);

        Route::get('/dosen', [AdminDosenController::class, 'index']);
        Route::get('/dosen/template', [AdminDosenController::class, 'template']);
        Route::post('/dosen', [AdminDosenController::class, 'store']);
        Route::get('/dosen/{dosen}', [AdminDosenController::class, 'show']);
        Route::put('/dosen/{dosen}', [AdminDosenController::class, 'update']);
        Route::delete('/dosen/{dosen}', [AdminDosenController::class, 'destroy']);
        Route::post('/dosen/import', [AdminDosenController::class, 'import']);

        Route::get('/penugasan', [PenugasanController::class, 'index']);

        Route::get('/perwalian', [AdminPerwalianController::class, 'index']);
        Route::get('/perwalian/{perwalian}', [AdminPerwalianController::class, 'show']);
        Route::put('/perwalian/{perwalian}/komentar', [AdminPerwalianController::class, 'komentar']);
        Route::put('/perwalian/{perwalian}/status', [AdminPerwalianController::class, 'updateStatus']);

        Route::get('/rekap', [RekapController::class, 'index']);
        Route::get('/rekap/export', [RekapController::class, 'export']);

        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword']);
    });

    // ============ MAHASISWA ============
    Route::prefix('mahasiswa')->middleware('role:mahasiswa')->group(function () {
        Route::get('/dashboard', [MahasiswaPerwalianController::class, 'dashboard']);
        Route::get('/dosen-wali', [DosenWaliController::class, 'show']);
        Route::get('/perwalian', [MahasiswaPerwalianController::class, 'index']);
        Route::post('/perwalian', [MahasiswaPerwalianController::class, 'store']);
        Route::get('/perwalian/{perwalian}', [MahasiswaPerwalianController::class, 'show']);
        Route::put('/perwalian/{perwalian}', [MahasiswaPerwalianController::class, 'update']);
    });

    // ============ DOSEN ============
    Route::prefix('dosen')->middleware('role:dosen')->group(function () {
        Route::get('/dashboard', [BimbinganController::class, 'dashboard']);
        Route::get('/mahasiswa-bimbingan', [BimbinganController::class, 'index']);
        Route::get('/perwalian', [DosenPerwalianController::class, 'index']);
        Route::get('/perwalian/{perwalian}', [DosenPerwalianController::class, 'show']);
        Route::put('/perwalian/{perwalian}/komentar', [DosenPerwalianController::class, 'komentar']);
        Route::put('/perwalian/{perwalian}/status', [DosenPerwalianController::class, 'updateStatus']);
    });
});
