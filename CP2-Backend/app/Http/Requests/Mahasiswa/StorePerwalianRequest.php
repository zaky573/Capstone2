<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerwalianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tahun_akademik' => ['required', 'string', 'max:20', 'regex:/^\d{4}\/\d{4}$/'],
            'semester' => ['required', Rule::in(['ganjil', 'genap'])],
            'uraian' => ['required', 'string', 'max:2000'],
            'kendala' => ['nullable', 'string', 'max:2000'],
            'rencana_studi' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'tahun_akademik.regex' => 'Tahun akademik harus dalam format contoh: 2025/2026.',
        ];
    }
}
