const STORAGE_KEY = 'mock_db'

const defaultDosen = [
  {
    id: 1,
    user_id: 101,
    nidn: '0426018001',
    nama_lengkap: 'Dr. Budi Santoso, M.Kom.',
    jenis_kelamin: 'L',
    program_studi: 'Sistem Informasi',
    email: 'budi.santoso@stmikbandung.ac.id',
    no_hp: '081234567801',
    alamat: 'Jl. Setiabudi No. 12, Bandung',
  },
  {
    id: 2,
    user_id: 102,
    nidn: '0411028102',
    nama_lengkap: 'Rina Marlina, S.Kom., M.T.',
    jenis_kelamin: 'P',
    program_studi: 'D3 Manajemen Informatika',
    email: 'rina.marlina@stmikbandung.ac.id',
    no_hp: '081234567802',
    alamat: 'Jl. Dago No. 45, Bandung',
  },
  {
    id: 3,
    user_id: 103,
    nidn: '0407088303',
    nama_lengkap: 'Agus Setiawan, M.Kom.',
    jenis_kelamin: 'L',
    program_studi: 'D3 Komputerisasi Akuntansi',
    email: 'agus.setiawan@stmikbandung.ac.id',
    no_hp: '081234567803',
    alamat: 'Jl. Buah Batu No. 88, Bandung',
  },
]

const defaultMahasiswa = [
  {
    id: 1,
    user_id: 201,
    nim: '211102001',
    nama_lengkap: 'Andi Pratama',
    jenis_kelamin: 'L',
    program_studi: 'D3 Manajemen Informatika',
    angkatan: 2024,
    semester: 4,
    no_hp: '085678901001',
    alamat: 'Jl. Cibaduyut No. 3, Bandung',
    dosen_wali_id: 2,
  },
  {
    id: 2,
    user_id: 202,
    nim: '211102002',
    nama_lengkap: 'Siti Rahayu',
    jenis_kelamin: 'P',
    program_studi: 'D3 Manajemen Informatika',
    angkatan: 2024,
    semester: 4,
    no_hp: '085678901002',
    alamat: 'Jl. Antapani No. 7, Bandung',
    dosen_wali_id: 2,
  },
  {
    id: 3,
    user_id: 203,
    nim: '231101001',
    nama_lengkap: 'Budi Hartono',
    jenis_kelamin: 'L',
    program_studi: 'Sistem Informasi',
    angkatan: 2023,
    semester: 6,
    no_hp: '085678901003',
    alamat: 'Jl. Sukarno Hatta No. 21, Bandung',
    dosen_wali_id: 1,
  },
  {
    id: 4,
    user_id: 204,
    nim: '231203001',
    nama_lengkap: 'Dewi Lestari',
    jenis_kelamin: 'P',
    program_studi: 'D3 Komputerisasi Akuntansi',
    angkatan: 2023,
    semester: 6,
    no_hp: '085678901004',
    alamat: 'Jl. Kopo No. 15, Bandung',
    dosen_wali_id: 3,
  },
  {
    id: 5,
    user_id: 205,
    nim: '241102003',
    nama_lengkap: 'Rizky Ananda',
    jenis_kelamin: 'L',
    program_studi: 'D3 Manajemen Informatika',
    angkatan: 2024,
    semester: 4,
    no_hp: '085678901005',
    alamat: 'Jl. Soekarno-Hatta No. 210, Bandung',
    dosen_wali_id: null,
  },
]

const defaultPerwalian = [
  {
    id: 1,
    mahasiswa_id: 1,
    tahun_akademik: '2025/2026',
    semester: 'ganjil',
    uraian: 'Konsultasi rencana studi semester ganjil 2025/2026 dan kendala dalam mata kuliah Basis Data.',
    kendala: 'Kesulitan memahami materi normalisasi basis data dan praktikum SQL.',
    rencana_studi: 'Mengambil 20 SKS, termasuk matakuliah pemrograman web dan basis data.',
    komentar_dosen: 'Pertahankan semangat belajar. Fokuskan waktu untuk praktikum SQL dan konsultasikan secara berkala.',
    status: 'diverifikasi',
    created_at: '2025-09-02T09:15:00+07:00',
    updated_at: '2025-09-03T14:30:00+07:00',
    verified_at: '2025-09-03T14:30:00+07:00',
  },
  {
    id: 2,
    mahasiswa_id: 1,
    tahun_akademik: '2025/2026',
    semester: 'genap',
    uraian: 'Konsultasi rencana studi semester genap dan kendala menjelang UTS.',
    kendala: 'Kesulitan membagi waktu antara organisasi dan perkuliahan.',
    rencana_studi: 'Mengambil 21 SKS, termasuk tugas akhir semester 5.',
    komentar_dosen: null,
    status: 'menunggu_verifikasi',
    created_at: '2026-02-05T10:00:00+07:00',
    updated_at: '2026-02-05T10:00:00+07:00',
    verified_at: null,
  },
  {
    id: 3,
    mahasiswa_id: 2,
    tahun_akademik: '2025/2026',
    semester: 'genap',
    uraian: 'Konsultasi terkait rencana mengambil sidang kerja praktik.',
    kendala: 'Belum mendapatkan tempat kerja praktik yang sesuai.',
    rencana_studi: 'Kerja praktik di perusahaan teknologi informasi pada bulan Juni.',
    komentar_dosen: null,
    status: 'menunggu_verifikasi',
    created_at: '2026-02-06T09:00:00+07:00',
    updated_at: '2026-02-06T09:00:00+07:00',
    verified_at: null,
  },
  {
    id: 4,
    mahasiswa_id: 3,
    tahun_akademik: '2025/2026',
    semester: 'ganjil',
    uraian: 'Konsultasi persiapan judul skripsi dan pemilihan topik.',
    kendala: 'Masih bingung menentukan arah penelitian.',
    rencana_studi: 'Fokus pada penyusunan proposal skripsi bidang sistem informasi.',
    komentar_dosen: 'Judul proposal sudah cukup baik. Segera kumpulkan bab 1 dan bab 2 untuk direview.',
    status: 'selesai',
    created_at: '2025-09-10T08:00:00+07:00',
    updated_at: '2025-09-12T11:00:00+07:00',
    verified_at: '2025-09-12T11:00:00+07:00',
  },
  {
    id: 5,
    mahasiswa_id: 3,
    tahun_akademik: '2025/2026',
    semester: 'genap',
    uraian: 'Konsultasi progres skripsi dan rencana sidang.',
    kendala: 'Progress bab 4 belum selesai karena data penelitian belum lengkap.',
    rencana_studi: 'Menyelesaikan bab 4 dan bab 5 sebelum batas akhir.',
    komentar_dosen: 'Data penelitian harus dilengkapi. Hubungi pembimbing lapangan secepatnya.',
    status: 'diverifikasi',
    created_at: '2026-01-20T13:00:00+07:00',
    updated_at: '2026-01-22T15:45:00+07:00',
    verified_at: '2026-01-22T15:45:00+07:00',
  },
  {
    id: 6,
    mahasiswa_id: 4,
    tahun_akademik: '2025/2026',
    semester: 'genap',
    uraian: 'Konsultasi kendala mata kuliah perpajakan dan rencana studi.',
    kendala: 'Kesulitan memahami materi PPN dan PPh.',
    rencana_studi: 'Mengulang mata kuliah perpajakan dan menambah jam belajar.',
    komentar_dosen: null,
    status: 'menunggu_verifikasi',
    created_at: '2026-02-08T08:30:00+07:00',
    updated_at: '2026-02-08T08:30:00+07:00',
    verified_at: null,
  },
]

const defaultUsers = {
  admin: {
    id: 1,
    username: 'admin',
    name: 'Administrator',
    role: 'admin',
    password: 'admin123',
  },
  '0426018001': {
    id: 101,
    username: '0426018001',
    name: 'Dr. Budi Santoso, M.Kom.',
    role: 'dosen',
    password: 'dosen123',
    profile_id: 1,
  },
  '0411028102': {
    id: 102,
    username: '0411028102',
    name: 'Rina Marlina, S.Kom., M.T.',
    role: 'dosen',
    password: 'dosen123',
    profile_id: 2,
  },
  '0407088303': {
    id: 103,
    username: '0407088303',
    name: 'Agus Setiawan, M.Kom.',
    role: 'dosen',
    password: 'dosen123',
    profile_id: 3,
  },
  '211102001': {
    id: 201,
    username: '211102001',
    name: 'Andi Pratama',
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: 1,
  },
  '211102002': {
    id: 202,
    username: '211102002',
    name: 'Siti Rahayu',
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: 2,
  },
  '231101001': {
    id: 203,
    username: '231101001',
    name: 'Budi Hartono',
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: 3,
  },
  '231203001': {
    id: 204,
    username: '231203001',
    name: 'Dewi Lestari',
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: 4,
  },
  '241102003': {
    id: 205,
    username: '241102003',
    name: 'Rizky Ananda',
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: 5,
  },
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const loadedUsers = parsed.users || { ...defaultUsers }
      Object.entries(defaultUsers).forEach(([k, v]) => {
        if (!loadedUsers[k]) loadedUsers[k] = { ...v }
      })
      return {
        dosenList: parsed.dosenList || defaultDosen,
        mahasiswaList: parsed.mahasiswaList || defaultMahasiswa,
        perwalianList: parsed.perwalianList || defaultPerwalian,
        users: loadedUsers,
      }
    }
  } catch {}
  return null
}

const saved = loadDb()

export const dosenList = saved?.dosenList ?? defaultDosen
export const mahasiswaList = saved?.mahasiswaList ?? defaultMahasiswa
export const perwalianList = saved?.perwalianList ?? defaultPerwalian
export const users = saved?.users ?? defaultUsers

export const saveDb = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dosenList,
        mahasiswaList,
        perwalianList,
        users,
      })
    )
  } catch {}
}

export const resetDb = () => {
  localStorage.removeItem(STORAGE_KEY)
  dosenList.length = 0
  mahasiswaList.length = 0
  perwalianList.length = 0
  Object.keys(users).forEach((k) => {
    if (k !== 'admin') delete users[k]
  })
  defaultDosen.forEach((d) => dosenList.push({ ...d }))
  defaultMahasiswa.forEach((m) => mahasiswaList.push({ ...m }))
  defaultPerwalian.forEach((p) => perwalianList.push({ ...p }))
  Object.entries(defaultUsers).forEach(([k, v]) => {
    if (!users[k]) users[k] = { ...v }
  })
  saveDb()
}

export const getUserByUsername = (username) => users[username] || null
