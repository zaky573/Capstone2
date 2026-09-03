import client, { USE_MOCK } from '../client'
import * as mock from '../mock'
import * as XLSX from 'xlsx'

export const getDashboard = async () => {
  if (USE_MOCK) return mock.getDashboard()
  const { data } = await client.get('/admin/dashboard')
  return data
}

export const getMahasiswa = async (params) => {
  if (USE_MOCK) return mock.getMahasiswa(params)
  const { data } = await client.get('/admin/mahasiswa', { params })
  return data
}

export const storeMahasiswa = async (payload) => {
  if (USE_MOCK) return mock.storeMahasiswa(payload)
  const { data } = await client.post('/admin/mahasiswa', payload)
  return data
}

export const updateMahasiswa = async (id, payload) => {
  if (USE_MOCK) return mock.updateMahasiswa(id, payload)
  const { data } = await client.put(`/admin/mahasiswa/${id}`, payload)
  return data
}

export const deleteMahasiswa = async (id) => {
  if (USE_MOCK) return mock.deleteMahasiswa(id)
  const { data } = await client.delete(`/admin/mahasiswa/${id}`)
  return data
}

export const importMahasiswa = async (file) => {
  if (USE_MOCK) return mock.importMahasiswa(file)
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post('/admin/mahasiswa/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const downloadMahasiswaTemplate = async () => {
  const headers = [
    'NIM', 'Nama Lengkap', 'Email', 'Jenis Kelamin', 'Program Studi',
    'Angkatan', 'Semester', 'No HP', 'Alamat', 'Tempat Lahir',
    'Tanggal Lahir', 'NIDN Dosen Wali',
  ]
  const data = [
    ['221102001', 'Ahmad Pratama', '', 'L', 'Teknik Informatika', '2024', '1', '081234567890', 'Jl. Merdeka No. 1, Bandung', 'Bandung', '2004-05-15', '0412345601'],
    ['221102002', 'Siti Nurhaliza', '', 'P', 'Sistem Informasi', '2024', '1', '081234567891', 'Jl. Sudirman No. 10, Bandung', 'Jakarta', '2004-08-20', ''],
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
  ws['!cols'] = [
    { wch: 14 }, { wch: 25 }, { wch: 28 }, { wch: 18 }, { wch: 22 },
    { wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 30 }, { wch: 16 },
    { wch: 22 }, { wch: 24 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Mahasiswa')
  XLSX.writeFile(wb, 'template_import_mahasiswa.xlsx')
}

export const getDosen = async (params) => {
  if (USE_MOCK) return mock.getDosen(params)
  const { data } = await client.get('/admin/dosen', { params })
  return data
}

export const storeDosen = async (payload) => {
  if (USE_MOCK) return mock.storeDosen(payload)
  const { data } = await client.post('/admin/dosen', payload)
  return data
}

export const updateDosen = async (id, payload) => {
  if (USE_MOCK) return mock.updateDosen(id, payload)
  const { data } = await client.put(`/admin/dosen/${id}`, payload)
  return data
}

export const deleteDosen = async (id) => {
  if (USE_MOCK) return mock.deleteDosen(id)
  const { data } = await client.delete(`/admin/dosen/${id}`)
  return data
}

export const importDosen = async (file) => {
  if (USE_MOCK) return mock.importDosen(file)
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post('/admin/dosen/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const downloadDosenTemplate = async () => {
  const headers = [
    'NIDN', 'Nama Lengkap', 'Email', 'Jenis Kelamin', 'No HP', 'Alamat',
    'Tempat Lahir', 'Tanggal Lahir', 'Pendidikan Jurusan',
    'Pendidikan Universitas',
  ]
  const data = [
    ['0412345601', 'Dr. Budi Santoso, M.Kom.', '', 'L', '081234567899', 'Jl. Dago No. 100, Bandung', 'Bandung', '1985-03-10', 'Teknik Informatika', 'Universitas Indonesia'],
    ['0412345602', 'Rina Marlina, S.Kom., M.T.', '', 'P', '081234567898', 'Jl. Riau No. 45, Bandung', 'Jakarta', '1990-07-22', 'Sistem Informasi', 'Institut Teknologi Bandung'],
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
  ws['!cols'] = [
    { wch: 14 }, { wch: 30 }, { wch: 30 }, { wch: 18 }, { wch: 16 }, { wch: 30 },
    { wch: 16 }, { wch: 22 }, { wch: 28 }, { wch: 30 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Dosen')
  XLSX.writeFile(wb, 'template_import_dosen.xlsx')
}

export const getPenugasan = async (params) => {
  if (USE_MOCK) return mock.getPenugasan(params)
  const { data } = await client.get('/admin/penugasan', { params })
  return data
}

export const assignWali = async (mahasiswaId, dosenId) => {
  if (USE_MOCK) return mock.assignWali(mahasiswaId, dosenId)
  const { data } = await client.put(`/admin/mahasiswa/${mahasiswaId}/dosen-wali`, {
    dosen_id: dosenId,
  })
  return data
}

export const getAdminPerwalian = async (params) => {
  if (USE_MOCK) return mock.getAdminPerwalian(params)
  const { data } = await client.get('/admin/perwalian', { params })
  return data
}

export const getAdminPerwalianDetail = async (id) => {
  if (USE_MOCK) return mock.getAdminPerwalianDetail(id)
  const { data } = await client.get(`/admin/perwalian/${id}`)
  return data
}

export const komentarAdminPerwalian = async (id, payload) => {
  if (USE_MOCK) return mock.komentarPerwalian(id, payload)
  const { data } = await client.put(`/admin/perwalian/${id}/komentar`, payload)
  return data
}

export const updateAdminPerwalianStatus = async (id, payload) => {
  if (USE_MOCK) return mock.updatePerwalianStatus(id, payload)
  const { data } = await client.put(`/admin/perwalian/${id}/status`, payload)
  return data
}

export const getRekap = async (params) => {
  if (USE_MOCK) return mock.getRekap(params)
  const { data } = await client.get('/admin/rekap', { params })
  return data
}

export const resetPassword = async (userId) => {
  if (USE_MOCK) return mock.resetPassword(userId)
  const { data } = await client.post(`/admin/users/${userId}/reset-password`)
  return data
}
