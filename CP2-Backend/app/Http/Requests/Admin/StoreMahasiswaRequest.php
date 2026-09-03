<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nim' => ['required', 'string', 'max:20', 'unique:mahasiswa,nim'],
            'nama_lengkap' => ['required', 'string', 'max:150'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'program_studi' => ['required', 'string', 'max:100'],
            'angkatan' => ['required', 'integer', 'min:2000', 'max:2100'],
            'semester' => ['required', 'integer', 'min:1', 'max:14'],
            'no_hp' => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:150'],
            'dosen_wali_id' => ['nullable', 'exists:dosen,id'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
        ];
    }
}
