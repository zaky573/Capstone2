import * as XLSX from 'xlsx'
import {
  dosenList,
  mahasiswaList,
  perwalianList,
  users,
  getUserByUsername,
  saveDb,
} from './db'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const getFiveYearsTa = () => {
  const currentYear = new Date().getFullYear()
  const list = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    list.push(`${i}/${i + 1}`)
  }
  return list
}

const paginate = (arr, page = 1, perPage = 10) => {
  const start = (page - 1) * perPage
  const rows = arr.slice(start, start + perPage)
  return {
    rows,
    meta: {
      total: arr.length,
      per_page: perPage,
      current_page: page,
      last_page: Math.max(1, Math.ceil(arr.length / perPage)),
    },
  }
}

const searchMahasiswa = (arr, q = '') => {
  const term = q.trim().toLowerCase()
  if (!term) return arr
  return arr.filter(
    (m) =>
      m.nim.toLowerCase().includes(term) ||
      m.nama_lengkap.toLowerCase().includes(term)
  )
}

const searchDosen = (arr, q = '') => {
  const term = q.trim().toLowerCase()
  if (!term) return arr
  return arr.filter(
    (d) =>
      d.nidn.toLowerCase().includes(term) ||
      d.nama_lengkap.toLowerCase().includes(term)
  )
}

const findMahasiswa = (id) => mahasiswaList.find((m) => m.id === Number(id))
const findDosen = (id) => {
  const d = dosenList.find((x) => x.id === Number(id))
  if (!d) return null
  const defaultEmail = d.email || `${d.nama_lengkap.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}@stmikbandung.ac.id`
  return {
    ...d,
    email: defaultEmail,
    no_hp: d.no_hp || '081234567890',
  }
}
const findPerwalian = (id) => perwalianList.find((p) => p.id === Number(id))

const mahasiswaFull = (m) => ({
  ...m,
  dosen_wali: m.dosen_wali_id ? findDosen(m.dosen_wali_id) || null : null,
})

const perwalianFull = (p) => {
  const m = findMahasiswa(p.mahasiswa_id)
  return {
    ...p,
    mahasiswa: m ? mahasiswaFull(m) : null,
  }
}

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('auth_user'))
  } catch {
    return null
  }
}

const buildUserDetail = (account) => {
  if (account.role === 'mahasiswa') {
    const m = mahasiswaList.find((x) => x.user_id === account.id)
    return { ...account, profile: m ? mahasiswaFull(m) : null }
  }
  if (account.role === 'dosen') {
    const d = dosenList.find((x) => x.user_id === account.id)
    return { ...account, profile: d || null }
  }
  return { ...account, profile: null }
}

export const login = async ({ username, password }) => {
  await delay(400)
  const account = getUserByUsername(username)
  if (!account || account.password !== password) {
    throw { response: { status: 422, data: { message: 'Username atau password salah.' } } }
  }
  const user = buildUserDetail(account)
  return {
    message: 'Login berhasil',
    data: { token: `mock-token-${account.role}-${account.id}`, user },
  }
}

export const me = async () => {
  await delay(200)
  const stored = getCurrentUser()
  if (!stored) throw { response: { status: 401, data: { message: 'Unauthenticated' } } }
  return { message: 'OK', data: { user: stored } }
}

export const logout = async () => {
  await delay(200)
  return { message: 'Logout berhasil', data: null }
}

export const getDashboard = async () => {
  await delay()
  return {
    message: 'OK',
    data: {
      total_mahasiswa: mahasiswaList.length,
      total_dosen: dosenList.length,
      mahasiswa_tanpa_wali: mahasiswaList.filter((m) => !m.dosen_wali_id).length,
      total_perwalian: perwalianList.length,
      perwalian_menunggu: perwalianList.filter((p) => p.status === 'menunggu_verifikasi').length,
      perwalian_diverifikasi: perwalianList.filter((p) => p.status === 'diverifikasi').length,
      perwalian_selesai: perwalianList.filter((p) => p.status === 'selesai').length,
      recent: perwalianList
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(perwalianFull),
    },
  }
}

export const getMahasiswa = async ({ search = '', prodi = '', angkatan = '', semester = '', page = 1 } = {}) => {
  await delay()
  let filtered = searchMahasiswa(mahasiswaList, search)
  if (prodi) filtered = filtered.filter((m) => m.program_studi === prodi)
  if (angkatan) filtered = filtered.filter((m) => String(m.angkatan) === String(angkatan))
  if (semester) filtered = filtered.filter((m) => String(m.semester) === String(semester))
  const { rows, meta } = paginate(filtered, page)
  const allProdis = [...new Set(mahasiswaList.map((m) => m.program_studi).filter(Boolean))].sort()
  const allAngkatan = [...new Set(mahasiswaList.map((m) => String(m.angkatan)).filter(Boolean))].sort().reverse()
  const allSemester = [...new Set(mahasiswaList.map((m) => String(m.semester)).filter(Boolean))].sort((a, b) => Number(a) - Number(b))
  return {
    message: 'OK',
    data: rows.map(mahasiswaFull),
    meta,
    filter_options: { prodi: allProdis, angkatan: allAngkatan, semester: allSemester },
  }
}

export const storeMahasiswa = async (payload) => {
  await delay()
  const id = Math.max(0, ...mahasiswaList.map((m) => m.id)) + 1
  const user_id = Math.max(0, ...mahasiswaList.map((m) => m.user_id), ...dosenList.map((d) => d.user_id), ...Object.values(users).map((u) => u.id)) + 1
  const created = { id, user_id, ...payload, dosen_wali_id: payload.dosen_wali_id || null }
  mahasiswaList.push(created)

  const uname = created.nim
  users[uname] = {
    id: user_id,
    username: uname,
    name: created.nama_lengkap,
    role: 'mahasiswa',
    password: 'mahasiswa123',
    profile_id: id,
  }
  saveDb()

  return { message: `Mahasiswa berhasil ditambahkan. Login: ${uname} / mahasiswa123`, data: mahasiswaFull(created) }
}

export const updateMahasiswa = async (id, payload) => {
  await delay()
  const idx = mahasiswaList.findIndex((m) => m.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Mahasiswa tidak ditemukan' } } }
  mahasiswaList[idx] = { ...mahasiswaList[idx], ...payload, id: Number(id) }
  saveDb()
  return { message: 'Mahasiswa berhasil diperbarui', data: mahasiswaFull(mahasiswaList[idx]) }
}

export const deleteMahasiswa = async (id) => {
  await delay()
  const idx = mahasiswaList.findIndex((m) => m.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Mahasiswa tidak ditemukan' } } }
  mahasiswaList.splice(idx, 1)
  saveDb()
  return { message: 'Mahasiswa berhasil dihapus', data: null }
}

export const importMahasiswa = async (file) => {
  await delay(800)
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)

  let imported = 0
  const failed = []

  rows.forEach((row, i) => {
    const nim = String(row.nim || '').trim()
    const nama = String(row.nama_lengkap || '').trim()
    if (!nim || !nama) {
      failed.push({ row: i + 2, reason: 'NIM atau nama lengkap kosong' })
      return
    }
    if (mahasiswaList.find((m) => m.nim === nim)) {
      failed.push({ row: i + 2, reason: `NIM ${nim} sudah ada` })
      return
    }

    const id = Math.max(0, ...mahasiswaList.map((m) => m.id)) + 1
    const user_id = Math.max(0, ...mahasiswaList.map((m) => m.user_id), ...dosenList.map((d) => d.id), ...Object.values(users).map((u) => u.id)) + 1

    const jk = row.jenis_kelamin ? String(row.jenis_kelamin).toUpperCase() : 'L'
    const angkatan = row.angkatan ? Number(row.angkatan) : 2024
    const semester = row.semester ? Number(row.semester) : 1
    const nidnWali = String(row.nidn_dosen_wali || '').trim()
    const dosenWali = nidnWali ? dosenList.find((d) => d.nidn === nidnWali) : null

    const mhs = {
      id,
      user_id,
      nim,
      nama_lengkap: nama,
      jenis_kelamin: jk === 'P' ? 'P' : 'L',
      program_studi: row.program_studi || '',
      angkatan,
      semester,
      no_hp: row.no_hp || '',
      alamat: row.alamat || '',
      dosen_wali_id: dosenWali ? dosenWali.id : null,
    }
    mahasiswaList.push(mhs)

    const uname = nim
    users[uname] = {
      id: user_id,
      username: uname,
      name: nama,
      role: 'mahasiswa',
      password: 'mahasiswa123',
      profile_id: id,
    }

    imported++
  })

  saveDb()

  return {
    message: `Import selesai: ${imported} berhasil, ${failed.length} gagal`,
    data: { imported, failed, failed_rows: failed },
  }
}

export const getDosen = async ({ search = '', prodi = '', page = 1 } = {}) => {
  await delay()
  let filtered = searchDosen(dosenList, search)
  if (prodi) filtered = filtered.filter((d) => d.program_studi === prodi)
  const { rows, meta } = paginate(filtered, page)
  const allProdis = [...new Set(dosenList.map((d) => d.program_studi).filter(Boolean))].sort()
  const enriched = rows.map((d) => ({
    ...d,
    jumlah_mahasiswa: mahasiswaList.filter((m) => m.dosen_wali_id === d.id).length,
  }))
  return {
    message: 'OK',
    data: enriched,
    meta,
    filter_options: { prodi: allProdis },
  }
}

export const storeDosen = async (payload) => {
  await delay()
  const id = Math.max(0, ...dosenList.map((d) => d.id)) + 1
  const user_id = Math.max(0, ...dosenList.map((d) => d.user_id), ...mahasiswaList.map((m) => m.user_id), ...Object.values(users).map((u) => u.id)) + 1
  const created = { id, user_id, ...payload }
  dosenList.push(created)

  const uname = created.nidn
  users[uname] = {
    id: user_id,
    username: uname,
    name: created.nama_lengkap,
    role: 'dosen',
    password: 'dosen123',
    profile_id: id,
  }
  saveDb()

  return { message: `Dosen berhasil ditambahkan. Login: ${uname} / dosen123`, data: created }
}

export const updateDosen = async (id, payload) => {
  await delay()
  const idx = dosenList.findIndex((d) => d.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Dosen tidak ditemukan' } } }
  dosenList[idx] = { ...dosenList[idx], ...payload, id: Number(id) }
  saveDb()
  return { message: 'Dosen berhasil diperbarui', data: dosenList[idx] }
}

export const deleteDosen = async (id) => {
  await delay()
  const idx = dosenList.findIndex((d) => d.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Dosen tidak ditemukan' } } }
  dosenList.splice(idx, 1)
  saveDb()
  return { message: 'Dosen berhasil dihapus', data: null }
}

export const importDosen = async (file) => {
  await delay(800)
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)

  let imported = 0
  const failed = []

  rows.forEach((row, i) => {
    const nidn = String(row.nidn || '').trim()
    const nama = String(row.nama_lengkap || '').trim()
    if (!nidn || !nama) {
      failed.push({ row: i + 2, reason: 'NIDN atau nama lengkap kosong' })
      return
    }
    if (dosenList.find((d) => d.nidn === nidn)) {
      failed.push({ row: i + 2, reason: `NIDN ${nidn} sudah ada` })
      return
    }

    const id = Math.max(0, ...dosenList.map((d) => d.id)) + 1
    const user_id = Math.max(0, ...dosenList.map((d) => d.user_id), ...mahasiswaList.map((m) => m.user_id), ...Object.values(users).map((u) => u.id)) + 1

    const jk = row.jenis_kelamin ? String(row.jenis_kelamin).toUpperCase() : 'L'

    const dsn = {
      id,
      user_id,
      nidn,
      nama_lengkap: nama,
      jenis_kelamin: jk === 'P' ? 'P' : 'L',
      program_studi: row.program_studi || '',
      no_hp: row.no_hp || '',
      alamat: row.alamat || '',
    }
    dosenList.push(dsn)

    const uname = nidn
    users[uname] = {
      id: user_id,
      username: uname,
      name: nama,
      role: 'dosen',
      password: 'dosen123',
      profile_id: id,
    }

    imported++
  })

  saveDb()

  return {
    message: `Import selesai: ${imported} berhasil, ${failed.length} gagal`,
    data: { imported, failed, failed_rows: failed },
  }
}

export const getPenugasan = async ({ search = '', page = 1 } = {}) => {
  await delay()
  const filtered = searchMahasiswa(mahasiswaList, search)
  const { rows, meta } = paginate(filtered, page)
  return { message: 'OK', data: rows.map(mahasiswaFull), meta }
}

export const assignWali = async (mahasiswaId, dosenId) => {
  await delay()
  const m = findMahasiswa(mahasiswaId)
  if (!m) throw { response: { status: 404, data: { message: 'Mahasiswa tidak ditemukan' } } }
  m.dosen_wali_id = dosenId || null
  saveDb()
  return { message: 'Dosen wali berhasil ditentukan', data: mahasiswaFull(m) }
}

export const getAdminPerwalian = async ({ search = '', status = '', tahun_akademik = '', page = 1 } = {}) => {
  await delay()
  let rows = perwalianList.slice()
  if (status) rows = rows.filter((p) => p.status === status)
  if (tahun_akademik) rows = rows.filter((p) => p.tahun_akademik === tahun_akademik)
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((p) => {
      const m = findMahasiswa(p.mahasiswa_id)
      return (
        m?.nim.toLowerCase().includes(term) || m?.nama_lengkap.toLowerCase().includes(term)
      )
    })
  }
  const { rows: pageRows, meta } = paginate(rows, page)
  const allTa = [...new Set([...perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()
  const allSemester = [...new Set(perwalianList.map((p) => String(p.semester)).filter(Boolean))].sort((a, b) => Number(a) - Number(b))
  return {
    message: 'OK',
    data: pageRows.map(perwalianFull),
    meta,
    filter_options: { tahun_akademik: allTa, semester: allSemester },
  }
}

export const getAdminPerwalianDetail = async (id) => {
  await delay()
  const p = findPerwalian(id)
  if (!p) throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  return { message: 'OK', data: perwalianFull(p) }
}

export const getRekap = async ({ tahun_akademik = '', prodi = '', status_pengajuan = '' } = {}) => {
  await delay()

  const allProdis = [...new Set(mahasiswaList.map((m) => m.program_studi).filter(Boolean))]
  const allTa = [...new Set([...perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()

  const byTa = (x) => !tahun_akademik || x.tahun_akademik === tahun_akademik

  const summary = allProdis
    .filter((p) => !prodi || p === prodi)
    .map((p) => {
      const mhs = mahasiswaList.filter((m) => m.program_studi === p)
      const ids = new Set(mhs.map((m) => m.id))
      const rows = perwalianList.filter((x) => ids.has(x.mahasiswa_id) && byTa(x))
      const uniqueMhsInTa = new Set(rows.map((x) => x.mahasiswa_id))

      let filteredMhsCount = mhs.length
      if (status_pengajuan === 'terisi') {
        filteredMhsCount = uniqueMhsInTa.size
      } else if (status_pengajuan === 'kosong') {
        filteredMhsCount = mhs.length - uniqueMhsInTa.size
      }

      const totalCount = status_pengajuan === 'kosong' ? 0 : rows.length
      const menungguCount = status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'menunggu_verifikasi').length
      const diverifikasiCount = status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'diverifikasi').length
      const selesaiCount = status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'selesai').length

      return {
        prodi: p,
        jumlah_mahasiswa: filteredMhsCount,
        total: totalCount,
        menunggu_verifikasi: menungguCount,
        diverifikasi: diverifikasiCount,
        selesai: selesaiCount,
        persentase_selesai: totalCount > 0
          ? Math.round((selesaiCount / totalCount) * 100)
          : 0,
      }
    })

  const totals = summary.reduce(
    (acc, s) => {
      acc.jumlah_mahasiswa += s.jumlah_mahasiswa
      acc.total += s.total
      acc.menunggu_verifikasi += s.menunggu_verifikasi
      acc.diverifikasi += s.diverifikasi
      acc.selesai += s.selesai
      return acc
    },
    { jumlah_mahasiswa: 0, total: 0, menunggu_verifikasi: 0, diverifikasi: 0, selesai: 0 }
  )
  totals.persentase_selesai = totals.total > 0
    ? Math.round((totals.selesai / totals.total) * 100)
    : 0

  const detailMahasiswa = mahasiswaList
    .filter((m) => {
      if (prodi && m.program_studi !== prodi) return false
      const mhsPerwalian = perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
      if (status_pengajuan === 'terisi') {
        return mhsPerwalian.length > 0
      }
      if (status_pengajuan === 'kosong') {
        return mhsPerwalian.length === 0
      }
      return true
    })
    .map((m) => {
      const mhsPerwalian = perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
      const dsn = dosenList.find((d) => d.id === m.dosen_wali_id)
      return {
        id: m.id,
        nim: m.nim,
        nama_lengkap: m.nama_lengkap,
        program_studi: m.program_studi,
        angkatan: m.angkatan,
        semester: m.semester,
        dosen_wali: dsn?.nama_lengkap || '-',
        total_perwalian: mhsPerwalian.length,
        menunggu: mhsPerwalian.filter((x) => x.status === 'menunggu_verifikasi').length,
        diverifikasi: mhsPerwalian.filter((x) => x.status === 'diverifikasi').length,
        selesai: mhsPerwalian.filter((x) => x.status === 'selesai').length,
      }
    })

  const detailDosen = dosenList
    .map((d) => {
      const bimbingan = mahasiswaList.filter((m) => {
        if (m.dosen_wali_id !== d.id) return false
        if (prodi && m.program_studi !== prodi) return false
        const mhsPerwalian = perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
        if (status_pengajuan === 'terisi') return mhsPerwalian.length > 0
        if (status_pengajuan === 'kosong') return mhsPerwalian.length === 0
        return true
      })
      const ids = new Set(bimbingan.map((m) => m.id))
      const rows = perwalianList.filter((p) => ids.has(p.mahasiswa_id) && byTa(p))

      return {
        id: d.id,
        nama_lengkap: d.nama_lengkap,
        nidn: d.nidn,
        jumlah_perwalian: bimbingan.length,
        total_perwalian: status_pengajuan === 'kosong' ? 0 : rows.length,
        menunggu: status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'menunggu_verifikasi').length,
        selesai: status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'selesai').length,
      }
    })
    .filter((d) => {
      if (status_pengajuan === 'terisi') return d.total_perwalian > 0 || d.jumlah_perwalian > 0
      if (status_pengajuan === 'kosong') return d.jumlah_perwalian > 0
      if (prodi || tahun_akademik) return d.total_perwalian > 0 || d.jumlah_perwalian > 0
      return true
    })

  const recentPerwalian = perwalianList
    .filter((p) => {
      if (status_pengajuan === 'kosong') return false
      const mhs = mahasiswaList.find((m) => m.id === p.mahasiswa_id)
      const byProdi = !prodi || (mhs && mhs.program_studi === prodi)
      return byTa(p) && byProdi
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
    .map(perwalianFull)

  return {
    message: 'OK',
    data: {
      summary,
      totals,
      detail_mahasiswa: detailMahasiswa,
      detail_dosen: detailDosen,
      recent_perwalian: recentPerwalian,
      filter_options: {
        tahun_akademik: allTa,
        prodi: allProdis,
      },
    },
  }
}

export const resetPassword = async (userId) => {
  await delay()
  const account = Object.values(users).find((u) => u.id === Number(userId))
  if (!account) {
    throw { response: { status: 404, data: { message: 'User tidak ditemukan' } } }
  }
  account.password = '12345678'
  saveDb()
  return { message: `Password berhasil direset menjadi 12345678`, data: { new_password: '12345678' } }
}

export const getMahasiswaDashboard = async () => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  const rows = perwalianList.filter((p) => p.mahasiswa_id === m.id)
  const last = rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
  return {
    message: 'OK',
    data: {
      mahasiswa: mahasiswaFull(m),
      dosen_wali: m.dosen_wali_id ? findDosen(m.dosen_wali_id) : null,
      total_perwalian: rows.length,
      menunggu_verifikasi: rows.filter((p) => p.status === 'menunggu_verifikasi').length,
      selesai: rows.filter((p) => p.status === 'selesai').length,
      perwalian_terakhir: last ? perwalianFull(last) : null,
    },
  }
}

export const getDosenWali = async () => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  return { message: 'OK', data: { dosen_wali: m.dosen_wali_id ? findDosen(m.dosen_wali_id) : null } }
}

export const getMyPerwalian = async ({ page = 1 } = {}) => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  const rows = perwalianList
    .filter((p) => p.mahasiswa_id === m.id)
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const { rows: pageRows, meta } = paginate(rows, page)
  return { message: 'OK', data: pageRows.map(perwalianFull), meta }
}

export const getMyPerwalianDetail = async (id) => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  const p = findPerwalian(id)
  if (!p || p.mahasiswa_id !== m.id) {
    throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  }
  return { message: 'OK', data: perwalianFull(p) }
}

export const storePerwalian = async (payload) => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  const id = Math.max(0, ...perwalianList.map((p) => p.id)) + 1
  const now = new Date().toISOString()
  const created = {
    id,
    mahasiswa_id: m.id,
    ...payload,
    komentar_dosen: null,
    status: 'menunggu_verifikasi',
    created_at: now,
    updated_at: now,
    verified_at: null,
  }
  perwalianList.push(created)
  saveDb()
  return { message: 'Pencatatan perwalian berhasil dibuat', data: perwalianFull(created) }
}

export const updatePerwalian = async (id, payload) => {
  await delay()
  const user = getCurrentUser()
  const m = mahasiswaList.find((x) => x.user_id === user?.id) || mahasiswaList[0]
  const idx = perwalianList.findIndex((p) => p.id === Number(id))
  if (idx === -1 || perwalianList[idx].mahasiswa_id !== m.id) {
    throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  }
  if (perwalianList[idx].status !== 'menunggu_verifikasi') {
    throw {
      response: { status: 422, data: { message: 'Perwalian sudah diverifikasi dan tidak dapat diubah.' } },
    }
  }
  perwalianList[idx] = { ...perwalianList[idx], ...payload, updated_at: new Date().toISOString() }
  saveDb()
  return { message: 'Pencatatan perwalian berhasil diperbarui', data: perwalianFull(perwalianList[idx]) }
}

export const getDosenDashboard = async () => {
  await delay()
  const user = getCurrentUser()
  const d = dosenList.find((x) => x.user_id === user?.id) || dosenList[0]
  const bimbingan = mahasiswaList.filter((m) => m.dosen_wali_id === d.id)
  const ids = new Set(bimbingan.map((m) => m.id))
  const rows = perwalianList.filter((p) => ids.has(p.mahasiswa_id))
  return {
    message: 'OK',
    data: {
      dosen: d,
      jumlah_mahasiswa: bimbingan.length,
      total_perwalian: rows.length,
      menunggu_verifikasi: rows.filter((p) => p.status === 'menunggu_verifikasi').length,
      diverifikasi: rows.filter((p) => p.status === 'diverifikasi').length,
      selesai: rows.filter((p) => p.status === 'selesai').length,
      mahasiswa: bimbingan.map(mahasiswaFull),
      recent: rows
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(perwalianFull),
    },
  }
}

export const getBimbingan = async ({ search = '', page = 1 } = {}) => {
  await delay()
  const user = getCurrentUser()
  const d = dosenList.find((x) => x.user_id === user?.id) || dosenList[0]
  let rows = mahasiswaList.filter((m) => m.dosen_wali_id === d.id)
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((m) => m.nim.toLowerCase().includes(term) || m.nama_lengkap.toLowerCase().includes(term))
  }
  const enriched = rows.map((m) => ({
    ...mahasiswaFull(m),
    jumlah_perwalian: perwalianList.filter((p) => p.mahasiswa_id === m.id).length,
    perwalian_menunggu: perwalianList.filter(
      (p) => p.mahasiswa_id === m.id && p.status === 'menunggu_verifikasi'
    ).length,
  }))
  const { rows: pageRows, meta } = paginate(enriched, page)
  return { message: 'OK', data: pageRows, meta }
}

export const getDosenPerwalian = async ({ status = '', search = '', nim = '', tahun_akademik = '', page = 1 } = {}) => {
  await delay()
  const user = getCurrentUser()
  const d = dosenList.find((x) => x.user_id === user?.id) || dosenList[0]
  const bimbingan = mahasiswaList.filter((m) => m.dosen_wali_id === d.id)
  const ids = new Set(bimbingan.map((m) => m.id))
  let rows = perwalianList.filter((p) => ids.has(p.mahasiswa_id))
  if (status) rows = rows.filter((p) => p.status === status)
  if (tahun_akademik) rows = rows.filter((p) => p.tahun_akademik === tahun_akademik)
  if (nim) {
    const filteredMhs = mahasiswaList.filter((m) => m.nim === nim)
    const filteredIds = new Set(filteredMhs.map((m) => m.id))
    rows = rows.filter((p) => filteredIds.has(p.mahasiswa_id))
  }
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((p) => {
      const m = findMahasiswa(p.mahasiswa_id)
      return m?.nim.toLowerCase().includes(term) || m?.nama_lengkap.toLowerCase().includes(term)
    })
  }
  rows = rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const { rows: pageRows, meta } = paginate(rows, page)
  const allTa = [...new Set([...perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()
  return { message: 'OK', data: pageRows.map(perwalianFull), meta, filter_options: { tahun_akademik: allTa } }
}

export const getDosenPerwalianDetail = async (id) => {
  await delay()
  const p = findPerwalian(id)
  if (!p) throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  return { message: 'OK', data: perwalianFull(p) }
}

export const komentarPerwalian = async (id, { komentar_dosen }) => {
  await delay()
  const idx = perwalianList.findIndex((p) => p.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  perwalianList[idx].komentar_dosen = komentar_dosen
  perwalianList[idx].updated_at = new Date().toISOString()
  saveDb()
  return { message: 'Komentar berhasil disimpan', data: perwalianFull(perwalianList[idx]) }
}

export const updatePerwalianStatus = async (id, { status }) => {
  await delay()
  const idx = perwalianList.findIndex((p) => p.id === Number(id))
  if (idx === -1) throw { response: { status: 404, data: { message: 'Perwalian tidak ditemukan' } } }
  if (status !== 'diverifikasi' && status !== 'selesai') {
    throw { response: { status: 422, data: { message: 'Status tidak valid' } } }
  }
  perwalianList[idx].status = status
  perwalianList[idx].verified_at = new Date().toISOString()
  perwalianList[idx].updated_at = new Date().toISOString()
  saveDb()
  return { message: `Status perwalian diubah menjadi ${status}`, data: perwalianFull(perwalianList[idx]) }
}

export const getProfile = async () => {
  await delay(200)
  const stored = getCurrentUser()
  if (!stored) throw { response: { status: 401, data: { message: 'Unauthenticated' } } }
  return { message: 'OK', data: { user: stored } }
}

export const updateProfile = async (payload) => {
  await delay()
  const stored = getCurrentUser()
  if (!stored) throw { response: { status: 401, data: { message: 'Unauthenticated' } } }
  const next = {
    ...stored,
    name: payload.name || stored.name,
    no_hp: payload.no_hp !== undefined ? payload.no_hp : stored.no_hp,
    alamat: payload.alamat !== undefined ? payload.alamat : stored.alamat,
    foto: payload.foto !== undefined ? payload.foto : stored.foto,
    profile: stored.profile ? { ...stored.profile, ...payload } : stored.profile,
  }
  localStorage.setItem('auth_user', JSON.stringify(next))
  return { message: 'Profil berhasil diperbarui', data: { user: next } }
}

export const changePassword = async ({ password_lama, password_baru }) => {
  await delay()
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw { response: { status: 401, data: { message: 'Tidak terautentikasi.' } } }
  }
  const account = getUserByUsername(currentUser.username)
  if (!account || account.password !== password_lama) {
    throw { response: { status: 422, data: { message: 'Password lama tidak sesuai.' } } }
  }
  if (password_baru.length < 8) {
    throw { response: { status: 422, data: { message: 'Password baru minimal 8 karakter.' } } }
  }
  if (password_lama === password_baru) {
    throw { response: { status: 422, data: { message: 'Password baru tidak boleh sama dengan password lama.' } } }
  }
  account.password = password_baru
  saveDb()
  return { message: 'Password berhasil diganti', data: null }
}
