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
  const data = [
    {
      nim: '221102001',
      nama_lengkap: 'Ahmad Fauzi',
      email: 'ahmad@example.com',
      jenis_kelamin: 'L',
      program_studi: 'Teknik Informatika',
      angkatan: 2024,
      semester: 1,
      no_hp: '081234567890',
      alamat: 'Jl. Merdeka No. 1, Bandung',
      nidn_dosen_wali: '0412345601',
    },
    {
      nim: '221102002',
      nama_lengkap: 'Siti Nurhaliza',
      email: 'siti@example.com',
      jenis_kelamin: 'P',
      program_studi: 'Sistem Informasi',
      angkatan: 2024,
      semester: 1,
      no_hp: '081234567891',
      alamat: 'Jl. Sudirman No. 10, Bandung',
      nidn_dosen_wali: '',
    },
  ]
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Mahasiswa')
  XLSX.writeFile(workbook, 'template_import_mahasiswa.xlsx')
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
  const data = [
    {
      nidn: '0412345601',
      nama_lengkap: 'Dr. Budi Santoso, M.Kom.',
      email: 'budi@stmik-bandung.ac.id',
      jenis_kelamin: 'L',
      no_hp: '081234567899',
      alamat: 'Jl. Dago No. 100, Bandung',
    },
    {
      nidn: '0412345602',
      nama_lengkap: 'Rina Marlina, S.Kom., M.T.',
      email: 'rina@stmik-bandung.ac.id',
      jenis_kelamin: 'P',
      no_hp: '081234567898',
      alamat: 'Jl. Riau No. 45, Bandung',
    },
  ]
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Dosen')
  XLSX.writeFile(workbook, 'template_import_dosen.xlsx')
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
