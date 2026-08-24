import { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import PrintIcon from '@mui/icons-material/Print'
import AddIcon from '@mui/icons-material/Add'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockResetIcon from '@mui/icons-material/LockReset'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import PageHeader from '../../components/common/PageHeader'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CredentialSuccessDialog from '../../components/common/CredentialSuccessDialog'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import {
  getMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
  importMahasiswa,
  downloadMahasiswaTemplate,
  getDosen,
  resetPassword,
} from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { PRODI_OPTIONS } from '../../utils/constants'
import { formatKelamin } from '../../utils/formatters'

const emptyForm = {
  nim: '',
  nama_lengkap: '',
  email: '',
  jenis_kelamin: 'L',
  program_studi: '',
  angkatan: '',
  semester: '',
  no_hp: '',
  alamat: '',
  dosen_wali_id: null,
  tempat_lahir: '',
  tanggal_lahir: '',
}

export default function AdminMahasiswa() {
  const snackbar = useSnackbar()

  const [dataRows, setDataRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterProdi, setFilterProdi] = useState('')
  const [filterAngkatan, setFilterAngkatan] = useState('')
  const [filterSemester, setFilterSemester] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)

  const [credentialData, setCredentialData] = useState(null)
  const [credentialOpen, setCredentialOpen] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [resetTarget, setResetTarget] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [filterOptions, setFilterOptions] = useState({ prodi: [], angkatan: [], semester: [] })
  const [dosenOptions, setDosenOptions] = useState([])
  const [profileDetail, setProfileDetail] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMahasiswa({ search, prodi: filterProdi, angkatan: filterAngkatan, semester: filterSemester, page: page + 1 })
      setDataRows(res.data)
      setMeta(res.meta)
      if (res.filter_options) setFilterOptions(res.filter_options)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, filterProdi, filterAngkatan, filterSemester, page, snackbar])

  const fetchDosenOptions = useCallback(async () => {
    try {
      const res = await getDosen({})
      setDosenOptions(res.data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchData()
    fetchDosenOptions()
  }, [fetchData, fetchDosenOptions])

  const handleSearch = () => setSearch(searchInput)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      nim: row.nim,
      nama_lengkap: row.nama_lengkap,
      email: row.email || '',
      jenis_kelamin: row.jenis_kelamin,
      program_studi: row.program_studi,
      angkatan: String(row.angkatan),
      semester: String(row.semester),
      no_hp: row.no_hp || '',
      alamat: row.alamat || '',
      dosen_wali_id: row.dosen_wali_id || null,
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir || '',
    })
    setFormError('')
    setDialogOpen(true)
  }

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true)
    try {
      await downloadMahasiswaTemplate()
      snackbar.success('Template Excel berhasil diunduh.')
    } catch (err) {
      snackbar.error('Gagal mengunduh template: ' + getErrorMessage(err))
    } finally {
      setDownloadingTemplate(false)
    }
  }

  const handleSave = async () => {
    if (!form.nim || !form.nama_lengkap || !form.program_studi || !form.angkatan || !form.semester) {
      setFormError('Kolom bertanda wajib harus diisi.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        angkatan: Number(form.angkatan),
        semester: Number(form.semester),
      }
      if (editingId) {
        const res = await updateMahasiswa(editingId, payload)
        snackbar.success(res.message)
        setDialogOpen(false)
      } else {
        const res = await storeMahasiswa(payload)
        setDialogOpen(false)
        setCredentialData({
          title: 'Mahasiswa Berhasil Ditambahkan!',
          nama: form.nama_lengkap,
          username: form.nim,
          password: 'mahasiswa123',
          role: 'Mahasiswa',
        })
        setCredentialOpen(true)
        snackbar.success('Data mahasiswa dan akun login berhasil dibuat!')
      }
      fetchData()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await deleteMahasiswa(deleteTarget.id)
      snackbar.success(res.message)
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleResetPassword = async () => {
    setResetting(true)
    try {
      const res = await resetPassword(resetTarget.user_id)
      snackbar.success(res.message)
      setResetTarget(null)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setResetting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      snackbar.error('Pilih file Excel terlebih dahulu.')
      return
    }
    setImporting(true)
    try {
      const res = await importMahasiswa(importFile)
      setImportResult(res.data)
      snackbar.success(res.message)
      fetchData()
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setImporting(false)
    }
  }

  const handlePrintPdf = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: html2canvas } = await import('html2canvas')

    const filterInfo = [
      filterProdi ? `Prodi: ${filterProdi}` : '',
      filterAngkatan ? `Angkatan: ${filterAngkatan}` : '',
      filterSemester ? `Semester ${filterSemester}` : '',
    ].filter(Boolean).join(' | ')
    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    const ttl = (r) => {
      const parts = [r.tempat_lahir, r.tanggal_lahir].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : '-'
    }

    const thS = 'background:#122C4E;color:#fff;padding:8px 10px;border:1px solid #0d1f38;text-align:left;'
    const thC = 'background:#122C4E;color:#fff;padding:8px 10px;border:1px solid #0d1f38;text-align:center;'

    const rows = dataRows.map((r, i) =>
      `<tr style="background:${i % 2 === 0 ? '#f7f9fc' : '#fff'}">
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;white-space:nowrap">${r.nim || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.nama_lengkap || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.email || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${r.jenis_kelamin === 'P' ? 'P' : 'L'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${ttl(r)}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.program_studi || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${r.angkatan || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${r.semester || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.dosen_wali?.nama_lengkap || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;white-space:nowrap">${r.no_hp || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${r.alamat || '-'}</td>
      </tr>`
    ).join('')

    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1250px;background:#fff;padding:30px;font-family:Arial,sans-serif;font-size:11px;color:#111;'

    container.innerHTML = `
      <div style="text-align:center;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #122C4E">
        <h1 style="margin:0;font-size:20px;color:#122C4E">Data Mahasiswa STMIK Bandung</h1>
        <p style="margin:4px 0 0;color:#666;font-size:12px">Tanggal cetak: ${tanggal}${filterInfo ? ' &bull; Filter: ' + filterInfo : ''}</p>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="${thC};width:30px">No</th>
            <th style="${thS};width:85px">NIM</th>
            <th style="${thS}">Nama Lengkap</th>
            <th style="${thS}">Email</th>
            <th style="${thC};width:35px">L/P</th>
            <th style="${thS};width:125px">Tempat, Tanggal Lahir</th>
            <th style="${thS};width:130px">Program Studi</th>
            <th style="${thC};width:55px">Angkatan</th>
            <th style="${thC};width:55px">Semester</th>
            <th style="${thS};width:130px">Dosen Wali</th>
            <th style="${thS};width:85px">No. HP</th>
            <th style="${thS}">Alamat</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="12" style="text-align:center;padding:12px;color:#999">Tidak ada data</td></tr>'}
        </tbody>
      </table>
      <p style="text-align:center;color:#aaa;font-size:10px;margin-top:20px">Dokumen ini dibuat oleh Sistem Perwalian STMIK Bandung</p>
    `

    document.body.appendChild(container)
    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#fff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      let posY = 0
      let remainH = imgH
      while (remainH > 0) {
        pdf.addImage(imgData, 'PNG', 0, -posY, pageW, imgH)
        remainH -= pageH
        posY += pageH
        if (remainH > 0) pdf.addPage()
      }
      pdf.save(`data-mahasiswa-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      document.body.removeChild(container)
    }
  }

  return (
    <>
      <PageHeader
        title="Data Mahasiswa"
        subtitle={`Total ${meta.total} mahasiswa`}
        actions={
          <>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintPdf}>
              Download PDF
            </Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>
              Import Excel
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Tambah Mahasiswa
            </Button>
          </>
        }
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Cari NIM atau nama..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" onClick={handleSearch}>
              Cari
            </Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              select
              size="small"
              label="Program Studi"
              value={filterProdi}
              onChange={(e) => { setFilterProdi(e.target.value); setPage(0) }}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">Semua Prodi</MenuItem>
              {filterOptions.prodi.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Angkatan"
              value={filterAngkatan}
              onChange={(e) => { setFilterAngkatan(e.target.value); setPage(0) }}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">Semua Angkatan</MenuItem>
              {filterOptions.angkatan.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Semester"
              value={filterSemester}
              onChange={(e) => { setFilterSemester(e.target.value); setPage(0) }}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">Semua Semester</MenuItem>
              {filterOptions.semester.map((s) => (
                <MenuItem key={s} value={s}>Semester {s}</MenuItem>
              ))}
            </TextField>
          </Stack>

          {loading ? (
            <Loading />
          ) : dataRows.length === 0 ? (
            <EmptyState
              icon={<PersonOffIcon sx={{ fontSize: 48 }} />}
              title="Tidak ada data mahasiswa"
              subtitle="Tambahkan mahasiswa baru atau impor dari Excel."
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NIM</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Jenis Kelamin</TableCell>
                  <TableCell>Prodi</TableCell>
                  <TableCell>Angkatan</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Dosen Wali</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataRows.map((row) => (
                  <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => { setProfileDetail(row); setProfileOpen(true) }}>
                    <TableCell>{row.nim}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.nama_lengkap}</TableCell>
                    <TableCell>{formatKelamin(row.jenis_kelamin)}</TableCell>
                    <TableCell>{row.program_studi}</TableCell>
                    <TableCell>{row.angkatan}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell>{row.dosen_wali?.nama_lengkap || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row) }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="warning" onClick={(e) => { e.stopPropagation(); setResetTarget(row) }}>
                        <LockResetIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <TablePagination
            component="div"
            count={meta.total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</DialogTitle>
        <DialogContent>
          {!editingId && (
            <Alert severity="info" variant="outlined" sx={{ mb: 2, mt: 1, py: 0.5 }}>
              Silakan lengkapi data mahasiswa di bawah ini. Akun login akan dibuatkan secara otomatis setelah data disimpan.
            </Alert>
          )}
          {formError && (
            <Typography color="error" sx={{ mb: 1, display: 'block' }}>
              {formError}
            </Typography>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="NIM *"
              value={form.nim}
              onChange={(e) => setForm({ ...form, nim: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nama Lengkap *"
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Jenis Kelamin"
                value={form.jenis_kelamin}
                onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                fullWidth
              >
                <MenuItem value="L">Laki-laki</MenuItem>
                <MenuItem value="P">Perempuan</MenuItem>
              </TextField>
              <TextField
                select
                label="Program Studi *"
                value={form.program_studi}
                onChange={(e) => setForm({ ...form, program_studi: e.target.value })}
                fullWidth
              >
                {PRODI_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Angkatan *"
                value={form.angkatan}
                onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                fullWidth
              />
              <TextField
                label="Semester *"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label="No. HP"
              value={form.no_hp}
              onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              fullWidth
            />
            <TextField
              label="Alamat"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Tempat Lahir"
                value={form.tempat_lahir}
                onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
                fullWidth
              />
              <TextField
                label="Tanggal Lahir"
                type="date"
                value={form.tanggal_lahir}
                onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Autocomplete
              options={dosenOptions}
              getOptionLabel={(opt) => opt.nama_lengkap || ''}
              isOptionEqualToValue={(opt, val) => opt.id === val}
              value={dosenOptions.find((d) => d.id === form.dosen_wali_id) || null}
              onChange={(_, newValue) => setForm({ ...form, dosen_wali_id: newValue?.id || null })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dosen Wali"
                  placeholder="Pilih dosen wali..."
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Typography variant="body2">{option.nama_lengkap}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({option.nidn})
                  </Typography>
                </li>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Batal
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Data Mahasiswa</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {/* Template Section */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Template Import Mahasiswa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Unduh file template Excel (.xlsx) ini untuk mengisi data mahasiswa yang akan diimport ke sistem.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
              >
                {downloadingTemplate ? 'Mengunduh...' : 'Unduh Template Excel (.xlsx)'}
              </Button>
            </Box>

            {/* Upload File Section */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                File Import
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                  Pilih File Excel (.xlsx)
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setImportFile(e.target.files[0])}
                  />
                </Button>
                {importFile && (
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {importFile.name}
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Credential Notice */}
            <Alert severity="info" variant="outlined" icon={<InfoOutlinedIcon fontSize="inherit" />}>
              <Typography variant="caption" display="block">
                <strong>Informasi Akun:</strong> Setiap mahasiswa yang diimport akan dibuatkan akun otomatis dengan <strong>Username = NIM</strong> dan <strong>Password Default = mahasiswa123</strong>.
              </Typography>
            </Alert>

            {importResult && (
              <Alert severity={importResult.imported > 0 ? 'success' : 'warning'}>
                Import selesai: <strong>{importResult.imported} data berhasil</strong>.
                {importResult.failed?.length > 0 && ` Gagal: ${importResult.failed.length} baris.`}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setImportOpen(false)} color="inherit">
            Tutup
          </Button>
          <Button variant="contained" onClick={handleImport} disabled={importing || !importFile}>
            {importing ? 'Mengimpor...' : 'Mulai Import'}
          </Button>
        </DialogActions>
      </Dialog>

      <CredentialSuccessDialog
        open={credentialOpen}
        onClose={() => setCredentialOpen(false)}
        data={credentialData}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Mahasiswa"
        message={`Yakin ingin menghapus ${deleteTarget?.nama_lengkap} (${deleteTarget?.nim})?`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <ConfirmDialog
        open={Boolean(resetTarget)}
        title="Reset Password"
        message={`Apakah Anda yakin akan mereset password ${resetTarget?.nama_lengkap} (${resetTarget?.nim})? Password akan direset menjadi mahasiswa123.`}
        confirmText="Reset"
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
        loading={resetting}
      />

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Profil Mahasiswa</DialogTitle>
        <DialogContent>
          {profileDetail && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 72, height: 72, bgcolor: '#4273B8', fontSize: 28 }}>
                  {profileDetail.foto ? (
                    <img src={profileDetail.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profileDetail.nama_lengkap?.charAt(0)?.toUpperCase()
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h6">{profileDetail.nama_lengkap}</Typography>
                  <Typography variant="body2" color="text.secondary">NIM: {profileDetail.nim}</Typography>
                </Box>
              </Stack>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">Program Studi</Typography>
                <Typography>{profileDetail.program_studi}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Jenis Kelamin</Typography>
                <Typography>{formatKelamin(profileDetail.jenis_kelamin)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Angkatan / Semester</Typography>
                <Typography>{profileDetail.angkatan} / {profileDetail.semester}</Typography>
              </Box>
              {profileDetail.tempat_lahir || profileDetail.tanggal_lahir ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">Tanggal Lahir</Typography>
                  <Typography>{[profileDetail.tempat_lahir, profileDetail.tanggal_lahir].filter(Boolean).join(', ') || '-'}</Typography>
                </Box>
              ) : null}
              <Box>
                <Typography variant="body2" color="text.secondary">No. HP</Typography>
                <Typography>{profileDetail.no_hp || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Alamat</Typography>
                <Typography>{profileDetail.alamat || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography>{profileDetail.email || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Dosen Wali</Typography>
                <Typography>{profileDetail.dosen_wali?.nama_lengkap || '-'}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileOpen(false)} color="inherit">Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
