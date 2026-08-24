export const ROLES = {
  ADMIN: 'admin',
  DOSEN: 'dosen',
  MAHASISWA: 'mahasiswa',
}

export const ROLE_LABEL = {
  admin: 'Admin',
  dosen: 'Dosen',
  mahasiswa: 'Mahasiswa',
}

export const STATUS = {
  MENUNGGU: 'menunggu_verifikasi',
  DIVERIFIKASI: 'diverifikasi',
  SELESAI: 'selesai',
}

export const STATUS_LABEL = {
  menunggu_verifikasi: 'Menunggu Verifikasi',
  diverifikasi: 'Diverifikasi',
  selesai: 'Selesai',
}

export const STATUS_COLOR = {
  menunggu_verifikasi: 'warning',
  diverifikasi: 'success',
  selesai: 'info',
}

export const SEMESTER_OPTIONS = ['ganjil', 'genap']

export const SEMESTER_LABEL = {
  ganjil: 'Ganjil',
  genap: 'Genap',
  1: 'Ganjil',
  2: 'Genap',
  3: 'Ganjil',
  4: 'Genap',
  5: 'Ganjil',
  6: 'Genap',
  7: 'Ganjil',
  8: 'Genap',
}

export const PRODI_OPTIONS = [
  'Teknik Informatika',
  'Sistem Informasi',
]

export const generateTaOptions = (yearsBack = 5) => {
  const currentYear = new Date().getFullYear()
  const list = []
  for (let i = currentYear; i >= currentYear - yearsBack; i--) {
    list.push(`${i}/${i + 1}`)
  }
  return list
}

export const TA_OPTIONS = generateTaOptions(5)

export const SIDEBAR_BG = '#122C4E'

export const BRAND_GOLD = '#F9C900'

export const STATUS_PERWALIAN_FILTER = [
  { value: '', label: 'Semua Status' },
  { value: STATUS.MENUNGGU, label: STATUS_LABEL[STATUS.MENUNGGU] },
  { value: STATUS.DIVERIFIKASI, label: STATUS_LABEL[STATUS.DIVERIFIKASI] },
  { value: STATUS.SELESAI, label: STATUS_LABEL[STATUS.SELESAI] },
]
