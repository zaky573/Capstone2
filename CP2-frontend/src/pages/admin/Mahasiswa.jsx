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

const onlyDigits = (e) => {
  e.target.value = e.target.value.replace(/\D/g, '')
}

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

  const isNumeric = (val) => /^\d+$/.test(val)

  const handleSave = async () => {
    if (!form.nim || !form.nama_lengkap || !form.program_studi || !form.angkatan || !form.semester) {
      setFormError('Kolom bertanda wajib harus diisi.')
      return
    }
    if (!isNumeric(form.nim)) {
      setFormError('Sistem tidak valid: NIM harus diisi angka.')
      return
    }
    if (form.no_hp && !isNumeric(form.no_hp)) {
      setFormError('Sistem tidak valid: No. HP harus diisi angka.')
      return
    }
    if (!isNumeric(form.angkatan)) {
      setFormError('Sistem tidak valid: Angkatan harus diisi angka.')
      return
    }
    if (!isNumeric(form.semester)) {
      setFormError('Sistem tidak valid: Semester harus diisi angka.')
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
    snackbar.info('Mengambil semua data mahasiswa untuk PDF...')

    let allRows = []
    try {
      let currentPage = 1
      let lastPage = 1
      do {
        const res = await getMahasiswa({
          search,
          prodi: filterProdi,
          angkatan: filterAngkatan,
          semester: filterSemester,
          page: currentPage,
          per_page: 100,
        })
        allRows = allRows.concat(res.data)
        lastPage = res.meta?.last_page || 1
        currentPage++
      } while (currentPage <= lastPage)
    } catch (err) {
      snackbar.error('Gagal mengambil data: ' + getErrorMessage(err))
      return
    }

    if (allRows.length === 0) {
      snackbar.error('Tidak ada data untuk di-export.')
      return
    }
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

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

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(18, 44, 78)
    doc.text('Data Mahasiswa STMIK Bandung', pageW / 2, 15, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100)
    const subtitle = `Tanggal cetak: ${tanggal}${filterInfo ? '  |  Filter: ' + filterInfo : ''}  |  Total: ${allRows.length} data`
    doc.text(subtitle, pageW / 2, 22, { align: 'center' })

    doc.setDrawColor(18, 44, 78)
    doc.setLineWidth(0.5)
    doc.line(14, 25, pageW - 14, 25)

    const head = [['No', 'NIM', 'Nama Lengkap', 'Email', 'L/P', 'Tempat, Tanggal Lahir', 'Program Studi', 'Angkatan', 'Semester', 'Dosen Wali', 'No. HP', 'Alamat']]

    const body = allRows.map((r, i) => [
      i + 1,
      r.nim || '-',
      r.nama_lengkap || '-',
      r.email || '-',
      r.jenis_kelamin === 'P' ? 'P' : 'L',
      ttl(r),
      r.program_studi || '-',
      r.angkatan || '-',
      r.semester || '-',
      r.dosen_wali?.nama_lengkap || '-',
      r.no_hp || '-',
      r.alamat || '-',
    ])

    autoTable(doc, {
      head,
      body,
      startY: 28,
      tableWidth: 'fill',
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 6.5,
        cellPadding: 1.5,
        overflow: 'linebreak',
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [18, 44, 78],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'center',
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [247, 249, 252],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: '3%' },
        1: { cellWidth: '8%' },
        2: { cellWidth: '13%' },
        3: { cellWidth: '12%' },
        4: { halign: 'center', cellWidth: '3%' },
        5: { cellWidth: '11%' },
        6: { cellWidth: '13%' },
        7: { halign: 'center', cellWidth: '6%' },
        8: { halign: 'center', cellWidth: '7%' },
        9: { cellWidth: '14%' },
        10: { cellWidth: '8%' },
      },
      didDrawPage: (data) => {
        const footerY = doc.internal.pageSize.getHeight() - 8
        doc.setFontSize(8)
        doc.setTextColor(170)
        doc.text('Dokumen ini dibuat oleh Sistem Perwalian STMIK Bandung', pageW / 2, footerY, { align: 'center' })

        doc.setFontSize(8)
        doc.setTextColor(170)
        const pageStr = `Halaman ${doc.internal.getCurrentPageInfo().pageNumber}`
        doc.text(pageStr, pageW - 14, footerY, { align: 'right' })
      },
    })

    doc.save(`data-mahasiswa-${new Date().toISOString().slice(0, 10)}.pdf`)
    snackbar.success(`PDF berhasil diunduh (${allRows.length} data).`)
  }

  return (
    <>
      <PageHeader
        title="Data Mahasiswa"
        subtitle={`Total ${meta.total} mahasiswa`}
        actions={
          <>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintPdf} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Export PDF
            </Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Import Excel
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Tambah
            </Button>
          </>
        }
      />

      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Cari NIM atau nama..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flex: 1, minWidth: 0 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="outlined" onClick={handleSearch} sx={{ minWidth: { xs: 'auto', sm: 80 } }}>
              Cari
            </Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              select
              size="small"
              label="Prodi"
              value={filterProdi}
              onChange={(e) => { setFilterProdi(e.target.value); setPage(0) }}
              sx={{ flex: 1, minWidth: 0 }}
            >
              <MenuItem value="">Semua</MenuItem>
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
              sx={{ flex: 1, minWidth: 0 }}
            >
              <MenuItem value="">Semua</MenuItem>
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
              sx={{ flex: 1, minWidth: 0 }}
            >
              <MenuItem value="">Semua</MenuItem>
              {filterOptions.semester.map((s) => (
                <MenuItem key={s} value={s}>Sem {s}</MenuItem>
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
            <Box className="table-responsive">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>NIM</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Kelamin</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Prodi</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Angkatan</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Semester</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Dosen Wali</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows.map((row) => (
                    <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => { setProfileDetail(row); setProfileOpen(true) }}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.nim}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.nama_lengkap}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{formatKelamin(row.jenis_kelamin)}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.program_studi}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{row.angkatan}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{row.semester}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.dosen_wali?.nama_lengkap || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEdit(row) }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row) }} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="warning" onClick={(e) => { e.stopPropagation(); setResetTarget(row) }} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                          <LockResetIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
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
              onInput={onlyDigits}
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
                onInput={onlyDigits}
                fullWidth
              />
              <TextField
                label="Semester *"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                onInput={onlyDigits}
                fullWidth
              />
            </Stack>
            <TextField
              label="No. HP"
              value={form.no_hp}
              onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              onInput={onlyDigits}
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
              <Stack direction="row" spacing={1.5} sx={{ mt: 1, alignItems: 'center' }}>
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
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
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
