<?php

namespace App\Http\Requests\Dosen;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['diverifikasi', 'selesai'])],
            'tanggal_ketemu' => ['nullable', 'string', 'max:10'],
            'jam_ketemu' => ['nullable', 'string', 'max:5'],
            'lokasi_pertemuan' => ['nullable', 'string', 'max:255'],
            'catatan_jadwal' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
