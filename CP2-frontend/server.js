import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import * as XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'db.json')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json({ limit: '10mb' }))
const upload = multer({ storage: multer.memoryStorage() })

// ═══════════════════════════════════════
// Database
// ═══════════════════════════════════════

let db

function loadDb() {
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } catch {
    db = { dosenList: [], mahasiswaList: [], perwalianList: [], users: {} }
    saveDb()
  }
  if (!db.dosenList) db.dosenList = []
  if (!db.mahasiswaList) db.mahasiswaList = []
  if (!db.perwalianList) db.perwalianList = []
  if (!db.users) db.users = {}
}

function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

loadDb()

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

const paginate = (arr, page = 1, perPage = 10) => {
  const p = Number(page) || 1
  const start = (p - 1) * perPage
  const rows = arr.slice(start, start + perPage)
  return {
    rows,
    meta: { total: arr.length, per_page: perPage, current_page: p, last_page: Math.max(1, Math.ceil(arr.length / perPage)) },
  }
}

const getFiveYearsTa = () => {
  const currentYear = new Date().getFullYear()
  const list = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    list.push(`${i}/${i + 1}`)
  }
  return list
}

const searchMahasiswa = (arr, q = '') => {
  const t = q.trim().toLowerCase()
  if (!t) return arr
  return arr.filter((m) => m.nim.toLowerCase().includes(t) || m.nama_lengkap.toLowerCase().includes(t))
}

const searchDosen = (arr, q = '') => {
  const t = q.trim().toLowerCase()
  if (!t) return arr
  return arr.filter((d) => d.nidn.toLowerCase().includes(t) || d.nama_lengkap.toLowerCase().includes(t))
}

const findMahasiswa = (id) => db.mahasiswaList.find((m) => m.id === Number(id))
const findDosen = (id) => db.dosenList.find((d) => d.id === Number(id))
const findPerwalian = (id) => db.perwalianList.find((p) => p.id === Number(id))

const mahasiswaFull = (m) => {
  const account = Object.values(db.users).find((u) => u.username === String(m.nim) && u.role === 'mahasiswa')
  return { ...m, email: account?.email || '', dosen_wali: m.dosen_wali_id ? findDosen(m.dosen_wali_id) || null : null }
}

const perwalianFull = (p) => {
  const m = findMahasiswa(p.mahasiswa_id)
  return { ...p, mahasiswa: m ? mahasiswaFull(m) : null }
}

// ═══════════════════════════════════════
// Auth
// ═══════════════════════════════════════

function parseToken(token) {
  const match = token?.match(/^mock-token-(\w+)-(\d+)$/)
  return match ? { role: match[1], id: Number(match[2]) } : null
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const parsed = parseToken(token)
  if (!parsed) return res.status(401).json({ message: 'Unauthenticated' })
  const account = Object.values(db.users).find((u) => u.id === parsed.id)
  if (!account) return res.status(401).json({ message: 'Unauthenticated' })
  req.user = account
  next()
}

function buildUserDetail(account) {
  if (account.role === 'mahasiswa') {
    const m = db.mahasiswaList.find((x) => x.user_id === account.id)
    return { ...account, profile: m ? mahasiswaFull(m) : null }
  }
  if (account.role === 'dosen') {
    const d = db.dosenList.find((x) => x.user_id === account.id)
    return { ...account, profile: d || null }
  }
  return { ...account, profile: { no_hp: account.no_hp || '', alamat: account.alamat || '', foto: account.foto || null } }
}

// ═══════════════════════════════════════
// Auth Routes
// ═══════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const account = Object.values(db.users).find((u) => u.username === username)
  if (!account || account.password !== password) {
    return res.status(422).json({ message: 'Username atau password salah.' })
  }
  const user = buildUserDetail(account)
  res.json({ message: 'Login berhasil', data: { token: `mock-token-${account.role}-${account.id}`, user } })
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ message: 'OK', data: { user: buildUserDetail(req.user) } })
})

app.post('/api/auth/logout', (_req, res) => {
  res.json({ message: 'Logout berhasil', data: null })
})

// ═══════════════════════════════════════
// Admin Dashboard
// ═══════════════════════════════════════

app.get('/api/admin/dashboard', authMiddleware, (_req, res) => {
  const recent = db.perwalianList
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(perwalianFull)

  res.json({
    message: 'OK',
    data: {
      total_mahasiswa: db.mahasiswaList.length,
      total_dosen: db.dosenList.length,
      mahasiswa_tanpa_wali: db.mahasiswaList.filter((m) => !m.dosen_wali_id).length,
      total_perwalian: db.perwalianList.length,
      perwalian_menunggu: db.perwalianList.filter((p) => p.status === 'menunggu_verifikasi').length,
      perwalian_diverifikasi: db.perwalianList.filter((p) => p.status === 'diverifikasi').length,
      perwalian_selesai: db.perwalianList.filter((p) => p.status === 'selesai').length,
      recent,
    },
  })
})

// ═══════════════════════════════════════
// Admin Mahasiswa
// ═══════════════════════════════════════

app.get('/api/admin/mahasiswa', authMiddleware, (req, res) => {
  const { search = '', prodi = '', angkatan = '', semester = '', page = 1 } = req.query
  let filtered = searchMahasiswa(db.mahasiswaList, search)
  if (prodi) filtered = filtered.filter((m) => m.program_studi === prodi)
  if (angkatan) filtered = filtered.filter((m) => String(m.angkatan) === String(angkatan))
  if (semester) filtered = filtered.filter((m) => String(m.semester) === String(semester))
  const { rows, meta } = paginate(filtered, page)
  const allProdis = [...new Set(db.mahasiswaList.map((m) => m.program_studi).filter(Boolean))].sort()
  const allAngkatan = [...new Set(db.mahasiswaList.map((m) => String(m.angkatan)).filter(Boolean))].sort().reverse()
  const allSemester = [...new Set(db.mahasiswaList.map((m) => String(m.semester)).filter(Boolean))].sort((a, b) => Number(a) - Number(b))
  res.json({ message: 'OK', data: rows.map(mahasiswaFull), meta, filter_options: { prodi: allProdis, angkatan: allAngkatan, semester: allSemester } })
})

app.post('/api/admin/mahasiswa', authMiddleware, (req, res) => {
  const id = Math.max(0, ...db.mahasiswaList.map((m) => m.id)) + 1
  const user_id = Math.max(0, ...db.mahasiswaList.map((m) => m.user_id), ...db.dosenList.map((d) => d.user_id), ...Object.values(db.users).map((u) => u.id)) + 1
  const created = { id, user_id, ...req.body, dosen_wali_id: req.body.dosen_wali_id || null }
  db.mahasiswaList.push(created)
  db.users[created.nim] = { id: user_id, username: created.nim, name: created.nama_lengkap, role: 'mahasiswa', password: 'mahasiswa123', profile_id: id, email: req.body.email || '' }
  saveDb()
  res.json({ message: `Mahasiswa berhasil ditambahkan. Login: ${created.nim} / mahasiswa123`, data: mahasiswaFull(created) })
})

app.put('/api/admin/mahasiswa/:id', authMiddleware, (req, res) => {
  const idx = db.mahasiswaList.findIndex((m) => m.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' })
  db.mahasiswaList[idx] = { ...db.mahasiswaList[idx], ...req.body, id: Number(req.params.id) }
  if (req.body.email !== undefined) {
    const account = Object.values(db.users).find((u) => u.username === String(db.mahasiswaList[idx].nim) && u.role === 'mahasiswa')
    if (account) { account.email = req.body.email; if (req.body.nama_lengkap) account.name = req.body.nama_lengkap }
  }
  saveDb()
  res.json({ message: 'Mahasiswa berhasil diperbarui', data: mahasiswaFull(db.mahasiswaList[idx]) })
})

app.delete('/api/admin/mahasiswa/:id', authMiddleware, (req, res) => {
  const idx = db.mahasiswaList.findIndex((m) => m.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' })
  db.mahasiswaList.splice(idx, 1)
  saveDb()
  res.json({ message: 'Mahasiswa berhasil dihapus', data: null })
})

app.post('/api/admin/mahasiswa/import', authMiddleware, upload.single('file'), (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)
    let imported = 0
    const failed = []

    rows.forEach((row, i) => {
      const nim = String(row.nim || '').trim()
      const nama = String(row.nama_lengkap || '').trim()
      if (!nim || !nama) { failed.push({ row: i + 2, reason: 'NIM atau nama lengkap kosong' }); return }
      if (db.mahasiswaList.find((m) => m.nim === nim)) { failed.push({ row: i + 2, reason: `NIM ${nim} sudah ada` }); return }

      const id = Math.max(0, ...db.mahasiswaList.map((m) => m.id)) + 1
      const user_id = Math.max(0, ...db.mahasiswaList.map((m) => m.user_id), ...db.dosenList.map((d) => d.id), ...Object.values(db.users).map((u) => u.id)) + 1
      const jk = row.jenis_kelamin ? String(row.jenis_kelamin).toUpperCase() : 'L'
      const angkatan = row.angkatan ? Number(row.angkatan) : 2024
      const semester = row.semester ? Number(row.semester) : 1
      const nidnWali = String(row.nidn_dosen_wali || '').trim()
      const dosenWali = nidnWali ? db.dosenList.find((d) => d.nidn === nidnWali) : null

      const mhs = { id, user_id, nim, nama_lengkap: nama, jenis_kelamin: jk === 'P' ? 'P' : 'L', program_studi: row.program_studi || '', angkatan, semester, status_akademik: row.status_akademik || 'Aktif', no_hp: row.no_hp || '', alamat: row.alamat || '', dosen_wali_id: dosenWali ? dosenWali.id : null }
      db.mahasiswaList.push(mhs)
      db.users[nim] = { id: user_id, username: nim, name: nama, role: 'mahasiswa', password: 'mahasiswa123', profile_id: id }
      imported++
    })

    saveDb()
    res.json({ message: `Import selesai: ${imported} berhasil, ${failed.length} gagal`, data: { imported, failed, failed_rows: failed } })
  } catch (err) {
    res.status(500).json({ message: 'Gagal import: ' + err.message })
  }
})

app.get('/api/admin/mahasiswa/template', authMiddleware, (_req, res) => {
  const data = [
    {
      nim: '221102001',
      nama_lengkap: 'Ahmad Pratama',
      email: 'ahmad@example.com',
      jenis_kelamin: 'L',
      program_studi: 'Teknik Informatika',
      angkatan: 2024,
      semester: 1,
      status_akademik: 'Aktif',
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
      status_akademik: 'Aktif',
      no_hp: '081234567891',
      alamat: 'Jl. Sudirman No. 10, Bandung',
      nidn_dosen_wali: '',
    },
  ]
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Mahasiswa')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Disposition', 'attachment; filename="template_import_mahasiswa.xlsx"')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.send(buffer)
})

app.put('/api/admin/mahasiswa/:id/dosen-wali', authMiddleware, (req, res) => {
  const m = findMahasiswa(req.params.id)
  if (!m) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' })
  m.dosen_wali_id = req.body.dosen_id || null
  saveDb()
  res.json({ message: 'Dosen wali berhasil ditentukan', data: mahasiswaFull(m) })
})

// ═══════════════════════════════════════
// Admin Dosen
// ═══════════════════════════════════════

app.get('/api/admin/dosen', authMiddleware, (req, res) => {
  const { search = '', page = 1 } = req.query
  let filtered = searchDosen(db.dosenList, search)
  const { rows, meta } = paginate(filtered, page)
  const enriched = rows.map((d) => {
    const account = Object.values(db.users).find((u) => u.username === String(d.nidn) && u.role === 'dosen')
    return { ...d, email: account?.email || '', jumlah_mahasiswa: db.mahasiswaList.filter((m) => m.dosen_wali_id === d.id).length }
  })
  res.json({ message: 'OK', data: enriched, meta })
})

app.post('/api/admin/dosen', authMiddleware, (req, res) => {
  const id = Math.max(0, ...db.dosenList.map((d) => d.id)) + 1
  const user_id = Math.max(0, ...db.dosenList.map((d) => d.user_id), ...db.mahasiswaList.map((m) => m.user_id), ...Object.values(db.users).map((u) => u.id)) + 1
  const created = { id, user_id, ...req.body }
  db.dosenList.push(created)
  db.users[created.nidn] = { id: user_id, username: created.nidn, name: created.nama_lengkap, role: 'dosen', password: 'dosen123', profile_id: id, email: req.body.email || '' }
  saveDb()
  res.json({ message: `Dosen berhasil ditambahkan. Login: ${created.nidn} / dosen123`, data: created })
})

app.put('/api/admin/dosen/:id', authMiddleware, (req, res) => {
  const idx = db.dosenList.findIndex((d) => d.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Dosen tidak ditemukan' })
  db.dosenList[idx] = { ...db.dosenList[idx], ...req.body, id: Number(req.params.id) }
  if (req.body.email !== undefined) {
    const account = Object.values(db.users).find((u) => u.username === String(db.dosenList[idx].nidn) && u.role === 'dosen')
    if (account) { account.email = req.body.email; if (req.body.nama_lengkap) account.name = req.body.nama_lengkap }
  }
  saveDb()
  res.json({ message: 'Dosen berhasil diperbarui', data: db.dosenList[idx] })
})

app.delete('/api/admin/dosen/:id', authMiddleware, (req, res) => {
  const idx = db.dosenList.findIndex((d) => d.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Dosen tidak ditemukan' })
  db.dosenList.splice(idx, 1)
  saveDb()
  res.json({ message: 'Dosen berhasil dihapus', data: null })
})

app.post('/api/admin/dosen/import', authMiddleware, upload.single('file'), (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)
    let imported = 0
    const failed = []

    rows.forEach((row, i) => {
      const nidn = String(row.nidn || '').trim()
      const nama = String(row.nama_lengkap || '').trim()
      if (!nidn || !nama) { failed.push({ row: i + 2, reason: 'NIDN atau nama lengkap kosong' }); return }
      if (db.dosenList.find((d) => d.nidn === nidn)) { failed.push({ row: i + 2, reason: `NIDN ${nidn} sudah ada` }); return }

      const id = Math.max(0, ...db.dosenList.map((d) => d.id)) + 1
      const user_id = Math.max(0, ...db.dosenList.map((d) => d.user_id), ...db.mahasiswaList.map((m) => m.user_id), ...Object.values(db.users).map((u) => u.id)) + 1
      const jk = row.jenis_kelamin ? String(row.jenis_kelamin).toUpperCase() : 'L'
      const dsn = { id, user_id, nidn, nama_lengkap: nama, jenis_kelamin: jk === 'P' ? 'P' : 'L', no_hp: row.no_hp || '', alamat: row.alamat || '', tempat_lahir: row.tempat_lahir || '', tanggal_lahir: row.tanggal_lahir || '', pendidikan_jurusan: row.pendidikan_jurusan || '', pendidikan_universitas: row.pendidikan_universitas || '' }
      db.dosenList.push(dsn)
      db.users[nidn] = { id: user_id, username: nidn, name: nama, role: 'dosen', password: 'dosen123', profile_id: id }
      imported++
    })

    saveDb()
    res.json({ message: `Import selesai: ${imported} berhasil, ${failed.length} gagal`, data: { imported, failed, failed_rows: failed } })
  } catch (err) {
    res.status(500).json({ message: 'Gagal import: ' + err.message })
  }
})

app.get('/api/admin/dosen/template', authMiddleware, (_req, res) => {
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
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Dosen')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Disposition', 'attachment; filename="template_import_dosen.xlsx"')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.send(buffer)
})

// ═══════════════════════════════════════
// Admin Penugasan
// ═══════════════════════════════════════

app.get('/api/admin/penugasan', authMiddleware, (req, res) => {
  const { search = '', page = 1 } = req.query
  const filtered = searchMahasiswa(db.mahasiswaList, search)
  const { rows, meta } = paginate(filtered, page)
  res.json({ message: 'OK', data: rows.map(mahasiswaFull), meta })
})

// ═══════════════════════════════════════
// Admin Perwalian
// ═══════════════════════════════════════

app.get('/api/admin/perwalian', authMiddleware, (req, res) => {
  const { search = '', status = '', tahun_akademik = '', page = 1 } = req.query
  let rows = db.perwalianList.slice()
  if (status) rows = rows.filter((p) => p.status === status)
  if (tahun_akademik) rows = rows.filter((p) => p.tahun_akademik === tahun_akademik)
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((p) => { const m = findMahasiswa(p.mahasiswa_id); return m?.nim.toLowerCase().includes(term) || m?.nama_lengkap.toLowerCase().includes(term) })
  }
  const { rows: pageRows, meta } = paginate(rows, page)
  const allTa = [...new Set([...db.perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()
  const allSemester = [...new Set(db.perwalianList.map((p) => String(p.semester)).filter(Boolean))].sort((a, b) => Number(a) - Number(b))
  res.json({ message: 'OK', data: pageRows.map(perwalianFull), meta, filter_options: { tahun_akademik: allTa, semester: allSemester } })
})

app.get('/api/admin/perwalian/:id', authMiddleware, (req, res) => {
  const p = findPerwalian(req.params.id)
  if (!p) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  res.json({ message: 'OK', data: perwalianFull(p) })
})

app.put('/api/admin/perwalian/:id/komentar', authMiddleware, (req, res) => {
  const idx = db.perwalianList.findIndex((p) => p.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  db.perwalianList[idx].catatan_admin = req.body.catatan_admin
  db.perwalianList[idx].updated_at = new Date().toISOString()
  saveDb()
  res.json({ message: 'Catatan berhasil disimpan', data: perwalianFull(db.perwalianList[idx]) })
})

// ═══════════════════════════════════════
// Admin Rekap
// ═══════════════════════════════════════

app.get('/api/admin/rekap', authMiddleware, (req, res) => {
  const { tahun_akademik = '', prodi = '', status_pengajuan = '' } = req.query
  const allProdis = [...new Set(db.mahasiswaList.map((m) => m.program_studi).filter(Boolean))]
  const allTa = [...new Set([...db.perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()
  const byTa = (x) => !tahun_akademik || x.tahun_akademik === tahun_akademik

  const summary = allProdis.filter((p) => !prodi || p === prodi).map((p) => {
    const mhs = db.mahasiswaList.filter((m) => m.program_studi === p)
    const ids = new Set(mhs.map((m) => m.id))
    const rows = db.perwalianList.filter((x) => ids.has(x.mahasiswa_id) && byTa(x))
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
      prodi: p, jumlah_mahasiswa: filteredMhsCount, total: totalCount,
      menunggu_verifikasi: menungguCount,
      diverifikasi: diverifikasiCount,
      selesai: selesaiCount,
      persentase_selesai: totalCount > 0 ? Math.round((selesaiCount / totalCount) * 100) : 0,
    }
  })

  const totals = summary.reduce((acc, s) => {
    acc.jumlah_mahasiswa += s.jumlah_mahasiswa; acc.total += s.total
    acc.menunggu_verifikasi += s.menunggu_verifikasi; acc.diverifikasi += s.diverifikasi; acc.selesai += s.selesai
    return acc
  }, { jumlah_mahasiswa: 0, total: 0, menunggu_verifikasi: 0, diverifikasi: 0, selesai: 0 })
  totals.persentase_selesai = totals.total > 0 ? Math.round((totals.selesai / totals.total) * 100) : 0

  const detail_mahasiswa = db.mahasiswaList.filter((m) => {
    if (prodi && m.program_studi !== prodi) return false
    const mhsPerwalian = db.perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
    if (status_pengajuan === 'terisi') {
      return mhsPerwalian.length > 0
    }
    if (status_pengajuan === 'kosong') {
      return mhsPerwalian.length === 0
    }
    return true
  }).map((m) => {
    const mhsPerwalian = db.perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
    const dsn = db.dosenList.find((d) => d.id === m.dosen_wali_id)
    return {
      id: m.id, nim: m.nim, nama_lengkap: m.nama_lengkap, program_studi: m.program_studi,
      angkatan: m.angkatan, semester: m.semester, dosen_wali: dsn?.nama_lengkap || '-',
      total_perwalian: mhsPerwalian.length,
      menunggu: mhsPerwalian.filter((x) => x.status === 'menunggu_verifikasi').length,
      diverifikasi: mhsPerwalian.filter((x) => x.status === 'diverifikasi').length,
      selesai: mhsPerwalian.filter((x) => x.status === 'selesai').length,
    }
  })

  const detail_dosen = db.dosenList.map((d) => {
    const bimbingan = db.mahasiswaList.filter((m) => {
      if (m.dosen_wali_id !== d.id) return false
      if (prodi && m.program_studi !== prodi) return false
      const mhsPerwalian = db.perwalianList.filter((p) => p.mahasiswa_id === m.id && byTa(p))
      if (status_pengajuan === 'terisi') return mhsPerwalian.length > 0
      if (status_pengajuan === 'kosong') return mhsPerwalian.length === 0
      return true
    })
    const ids = new Set(bimbingan.map((m) => m.id))
    const rows = db.perwalianList.filter((p) => ids.has(p.mahasiswa_id) && byTa(p))

    return {
      id: d.id, nama_lengkap: d.nama_lengkap, nidn: d.nidn, jumlah_perwalian: bimbingan.length,
      total_perwalian: status_pengajuan === 'kosong' ? 0 : rows.length,
      menunggu: status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'menunggu_verifikasi').length,
      selesai: status_pengajuan === 'kosong' ? 0 : rows.filter((x) => x.status === 'selesai').length,
    }
  }).filter((d) => {
    if (status_pengajuan === 'terisi') return d.total_perwalian > 0 || d.jumlah_perwalian > 0
    if (status_pengajuan === 'kosong') return d.jumlah_perwalian > 0
    if (prodi || tahun_akademik) return d.total_perwalian > 0 || d.jumlah_perwalian > 0
    return true
  })

  const recent_perwalian = db.perwalianList.filter((p) => {
    if (status_pengajuan === 'kosong') return false
    const mhs = db.mahasiswaList.find((m) => m.id === p.mahasiswa_id)
    const byProdi = !prodi || (mhs && mhs.program_studi === prodi)
    return byTa(p) && byProdi
  })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10).map(perwalianFull)

  res.json({ message: 'OK', data: { summary, totals, detail_mahasiswa, detail_dosen, recent_perwalian, filter_options: { tahun_akademik: allTa, prodi: allProdis } } })
})

// ═══════════════════════════════════════
// Admin Reset Password
// ═══════════════════════════════════════

app.post('/api/admin/users/:id/reset-password', authMiddleware, (req, res) => {
  const account = Object.values(db.users).find((u) => u.id === Number(req.params.id))
  if (!account) return res.status(404).json({ message: 'User tidak ditemukan' })
  const defaultPassword = account.role === 'dosen' ? 'dosen123' : 'mahasiswa123'
  account.password = defaultPassword
  saveDb()
  res.json({ message: `Password berhasil direset menjadi ${defaultPassword}`, data: { new_password: defaultPassword } })
})

// ═══════════════════════════════════════
// Mahasiswa Dashboard
// ═══════════════════════════════════════

app.get('/api/mahasiswa/dashboard', authMiddleware, (req, res) => {
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  if (!m) return res.json({ message: 'OK', data: { mahasiswa: null, dosen_wali: null, total_perwalian: 0, menunggu_verifikasi: 0, perwalian_terakhir: null } })
  const rows = db.perwalianList.filter((p) => p.mahasiswa_id === m.id)
  const last = rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
  res.json({
    message: 'OK',
    data: {
      mahasiswa: mahasiswaFull(m),
      dosen_wali: m.dosen_wali_id ? findDosen(m.dosen_wali_id) : null,
      total_perwalian: rows.length,
      menunggu_verifikasi: rows.filter((p) => p.status === 'menunggu_verifikasi').length,
      perwalian_terakhir: last ? perwalianFull(last) : null,
    },
  })
})

app.get('/api/mahasiswa/dosen-wali', authMiddleware, (req, res) => {
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  res.json({ message: 'OK', data: { dosen_wali: m?.dosen_wali_id ? findDosen(m.dosen_wali_id) : null } })
})

// ═══════════════════════════════════════
// Mahasiswa Perwalian
// ═══════════════════════════════════════

app.get('/api/mahasiswa/perwalian', authMiddleware, (req, res) => {
  const { page = 1 } = req.query
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  const rows = db.perwalianList.filter((p) => p.mahasiswa_id === m?.id).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const { rows: pageRows, meta } = paginate(rows, page)
  res.json({ message: 'OK', data: pageRows.map(perwalianFull), meta })
})

app.get('/api/mahasiswa/perwalian/:id', authMiddleware, (req, res) => {
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  const p = findPerwalian(req.params.id)
  if (!p || p.mahasiswa_id !== m?.id) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  res.json({ message: 'OK', data: perwalianFull(p) })
})

app.post('/api/mahasiswa/perwalian', authMiddleware, (req, res) => {
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  const id = Math.max(0, ...db.perwalianList.map((p) => p.id)) + 1
  const now = new Date().toISOString()
  const created = { id, mahasiswa_id: m.id, ...req.body, komentar_dosen: null, status: 'menunggu_verifikasi', created_at: now, updated_at: now, verified_at: null }
  db.perwalianList.push(created)
  saveDb()
  res.json({ message: 'Pencatatan perwalian berhasil dibuat', data: perwalianFull(created) })
})

app.put('/api/mahasiswa/perwalian/:id', authMiddleware, (req, res) => {
  const m = db.mahasiswaList.find((x) => x.user_id === req.user.id) || db.mahasiswaList[0]
  const idx = db.perwalianList.findIndex((p) => p.id === Number(req.params.id))
  if (idx === -1 || db.perwalianList[idx].mahasiswa_id !== m?.id) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  if (db.perwalianList[idx].status !== 'menunggu_verifikasi') return res.status(422).json({ message: 'Perwalian sudah diverifikasi dan tidak dapat diubah.' })
  db.perwalianList[idx] = { ...db.perwalianList[idx], ...req.body, updated_at: new Date().toISOString() }
  saveDb()
  res.json({ message: 'Pencatatan perwalian berhasil diperbarui', data: perwalianFull(db.perwalianList[idx]) })
})

// ═══════════════════════════════════════
// Dosen Dashboard
// ═══════════════════════════════════════

app.get('/api/dosen/dashboard', authMiddleware, (req, res) => {
  const d = db.dosenList.find((x) => x.user_id === req.user.id) || db.dosenList[0]
  if (!d) return res.json({ message: 'OK', data: { dosen: null, jumlah_mahasiswa: 0, total_perwalian: 0, menunggu_verifikasi: 0, diverifikasi: 0, selesai: 0, mahasiswa: [], recent: [] } })
  const bimbingan = db.mahasiswaList.filter((m) => m.dosen_wali_id === d.id)
  const ids = new Set(bimbingan.map((m) => m.id))
  const rows = db.perwalianList.filter((p) => ids.has(p.mahasiswa_id))
  res.json({
    message: 'OK',
    data: {
      dosen: d,
      jumlah_mahasiswa: bimbingan.length,
      total_perwalian: rows.length,
      menunggu_verifikasi: rows.filter((p) => p.status === 'menunggu_verifikasi').length,
      diverifikasi: rows.filter((p) => p.status === 'diverifikasi').length,
      selesai: rows.filter((p) => p.status === 'selesai').length,
      mahasiswa: bimbingan.map(mahasiswaFull),
      recent: rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map(perwalianFull),
    },
  })
})

app.get('/api/dosen/mahasiswa-bimbingan', authMiddleware, (req, res) => {
  const { search = '', page = 1 } = req.query
  const d = db.dosenList.find((x) => x.user_id === req.user.id) || db.dosenList[0]
  let rows = db.mahasiswaList.filter((m) => m.dosen_wali_id === d?.id)
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((m) => m.nim.toLowerCase().includes(term) || m.nama_lengkap.toLowerCase().includes(term))
  }
  const enriched = rows.map((m) => ({
    ...mahasiswaFull(m),
    jumlah_perwalian: db.perwalianList.filter((p) => p.mahasiswa_id === m.id).length,
    perwalian_menunggu: db.perwalianList.filter((p) => p.mahasiswa_id === m.id && p.status === 'menunggu_verifikasi').length,
  }))
  const { rows: pageRows, meta } = paginate(enriched, page)
  res.json({ message: 'OK', data: pageRows, meta })
})

// ═══════════════════════════════════════
// Dosen Perwalian
// ═══════════════════════════════════════

app.get('/api/dosen/perwalian', authMiddleware, (req, res) => {
  const { status = '', search = '', nim = '', tahun_akademik = '', page = 1 } = req.query
  const d = db.dosenList.find((x) => x.user_id === req.user.id) || db.dosenList[0]
  const bimbingan = db.mahasiswaList.filter((m) => m.dosen_wali_id === d?.id)
  const ids = new Set(bimbingan.map((m) => m.id))
  let rows = db.perwalianList.filter((p) => ids.has(p.mahasiswa_id))
  if (status) rows = rows.filter((p) => p.status === status)
  if (tahun_akademik) rows = rows.filter((p) => p.tahun_akademik === tahun_akademik)
  if (search) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((p) => { const m = findMahasiswa(p.mahasiswa_id); return m?.nim.toLowerCase().includes(term) || m?.nama_lengkap.toLowerCase().includes(term) })
  }
  if (nim) {
    const filteredMhs = db.mahasiswaList.filter((m) => m.nim === nim)
    const filteredIds = new Set(filteredMhs.map((m) => m.id))
    rows = rows.filter((p) => filteredIds.has(p.mahasiswa_id))
  }
  rows = rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const { rows: pageRows, meta } = paginate(rows, page)
  const allTa = [...new Set([...db.perwalianList.map((p) => p.tahun_akademik).filter(Boolean), ...getFiveYearsTa()])].sort().reverse()
  res.json({ message: 'OK', data: pageRows.map(perwalianFull), meta, filter_options: { tahun_akademik: allTa } })
})

app.get('/api/dosen/perwalian/:id', authMiddleware, (req, res) => {
  const p = findPerwalian(req.params.id)
  if (!p) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  res.json({ message: 'OK', data: perwalianFull(p) })
})

app.put('/api/dosen/perwalian/:id/komentar', authMiddleware, (req, res) => {
  const idx = db.perwalianList.findIndex((p) => p.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  db.perwalianList[idx].catatan_dosen = req.body.catatan_dosen
  db.perwalianList[idx].updated_at = new Date().toISOString()
  saveDb()
  res.json({ message: 'Catatan berhasil disimpan', data: perwalianFull(db.perwalianList[idx]) })
})

app.put('/api/dosen/perwalian/:id/status', authMiddleware, (req, res) => {
  const idx = db.perwalianList.findIndex((p) => p.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Perwalian tidak ditemukan' })
  const { status, tanggal_ketemu, jam_ketemu, catatan_jadwal, lokasi_pertemuan } = req.body
  if (status !== 'diverifikasi' && status !== 'selesai') return res.status(422).json({ message: 'Status tidak valid' })
  db.perwalianList[idx].status = status
  db.perwalianList[idx].verified_at = new Date().toISOString()
  db.perwalianList[idx].updated_at = new Date().toISOString()
  if (status === 'diverifikasi') {
    db.perwalianList[idx].lokasi_pertemuan = lokasi_pertemuan || null
    db.perwalianList[idx].tanggal_ketemu = tanggal_ketemu || null
    db.perwalianList[idx].jam_ketemu = jam_ketemu || null
    db.perwalianList[idx].catatan_jadwal = catatan_jadwal || null
  }
  saveDb()
  res.json({ message: `Status perwalian diubah menjadi ${status}`, data: perwalianFull(db.perwalianList[idx]) })
})

// ═══════════════════════════════════════
// Profile
// ═══════════════════════════════════════

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ message: 'OK', data: { user: buildUserDetail(req.user) } })
})

app.put('/api/profile', authMiddleware, (req, res) => {
  const next = {
    ...req.user,
    name: req.body.name || req.user.name,
    profile: req.user.profile ? { ...req.user.profile, ...req.body } : req.user.profile,
  }
  if (req.body.name !== undefined) req.user.name = req.body.name
  if (req.body.email !== undefined) req.user.email = req.body.email
  if (req.user.role === 'mahasiswa') {
    const m = db.mahasiswaList.find((x) => x.user_id === req.user.id)
    if (m) { m.nama_lengkap = req.body.name || m.nama_lengkap; if (req.body.no_hp !== undefined) m.no_hp = req.body.no_hp; if (req.body.alamat !== undefined) m.alamat = req.body.alamat; if (req.body.foto !== undefined) m.foto = req.body.foto }
  } else if (req.user.role === 'dosen') {
    const d = db.dosenList.find((x) => x.user_id === req.user.id)
    if (d) { d.nama_lengkap = req.body.name || d.nama_lengkap; if (req.body.no_hp !== undefined) d.no_hp = req.body.no_hp; if (req.body.alamat !== undefined) d.alamat = req.body.alamat; if (req.body.foto !== undefined) d.foto = req.body.foto }
  } else if (req.user.role === 'admin') {
    if (req.body.no_hp !== undefined) req.user.no_hp = req.body.no_hp
    if (req.body.alamat !== undefined) req.user.alamat = req.body.alamat
    if (req.body.foto !== undefined) req.user.foto = req.body.foto
  }
  saveDb()
  res.json({ message: 'Profil berhasil diperbarui', data: { user: buildUserDetail(req.user) } })
})

app.put('/api/profile/password', authMiddleware, (req, res) => {
  const { password_lama, password_baru } = req.body
  if (!password_lama || !password_baru) return res.status(422).json({ message: 'Semua kolom wajib diisi.' })
  if (req.user.password !== password_lama) return res.status(422).json({ message: 'Password lama tidak sesuai.' })
  if (password_baru.length < 8) return res.status(422).json({ message: 'Password baru minimal 8 karakter.' })
  if (password_lama === password_baru) return res.status(422).json({ message: 'Password baru tidak boleh sama dengan password lama.' })
  req.user.password = password_baru
  saveDb()
  res.json({ message: 'Password berhasil diganti', data: null })
})

// ═══════════════════════════════════════
// Start
// ═══════════════════════════════════════

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`)
  console.log(`Database: ${DB_PATH}`)
})
