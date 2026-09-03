<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerwalianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mahasiswa_id' => $this->mahasiswa_id,
            'tahun_akademik' => $this->tahun_akademik,
            'semester' => $this->semester->value,
            'semester_label' => $this->semester->label(),
            'uraian' => $this->uraian,
            'kendala' => $this->kendala,
            'rencana_studi' => $this->rencana_studi,
            'komentar_dosen' => $this->komentar_dosen,
            'tanggal_ketemu' => $this->tanggal_ketemu,
            'jam_ketemu' => $this->jam_ketemu,
            'lokasi_pertemuan' => $this->lokasi_pertemuan,
            'catatan_jadwal' => $this->catatan_jadwal,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'verified_at' => $this->verified_at?->toIso8601String(),
            'mahasiswa' => new MahasiswaResource($this->whenLoaded('mahasiswa')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
