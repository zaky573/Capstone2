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
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PrintIcon from '@mui/icons-material/Print'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LockResetIcon from '@mui/icons-material/LockReset'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import PageHeader from '../../components/common/PageHeader'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CredentialSuccessDialog from '../../components/common/CredentialSuccessDialog'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import {
  getDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
  importDosen,
  downloadDosenTemplate,
  resetPassword,
} from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { PRODI_OPTIONS } from '../../utils/constants'
import { formatKelamin } from '../../utils/formatters'

const onlyDigits = (e) => {
  e.target.value = e.target.value.replace(/\D/g, '')
}

const emptyForm = {
  nidn: '',
  nama_lengkap: '',
  email: '',
  jenis_kelamin: 'L',
  no_hp: '',
  alamat: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  pendidikan_jurusan: '',
  pendidikan_universitas: '',
}

export default function AdminDosen() {
  const snackbar = useSnackbar()

  const [dataRows, setDataRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

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
  const [profileDetail, setProfileDetail] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getDosen({ search, page: page + 1 })
      setDataRows(res.data)
      setMeta(res.meta)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, page, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
      nidn: row.nidn,
      nama_lengkap: row.nama_lengkap,
      email: row.email || '',
      jenis_kelamin: row.jenis_kelamin,
      no_hp: row.no_hp || '',
      alamat: row.alamat || '',
      tempat_lahir: row.tempat_lahir || '',
      tanggal_lahir: row.tanggal_lahir || '',
      pendidikan_jurusan: row.pendidikan_jurusan || '',
      pendidikan_universitas: row.pendidikan_universitas || '',
    })
    setFormError('')
    setDialogOpen(true)
  }

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true)
    try {
      await downloadDosenTemplate()
      snackbar.success('Template Excel berhasil diunduh.')
    } catch (err) {
      snackbar.error('Gagal mengunduh template: ' + getErrorMessage(err))
    } finally {
      setDownloadingTemplate(false)
    }
  }

  const isNumeric = (val) => /^\d+$/.test(val)

  const handleSave = async () => {
    if (!form.nidn || !form.nama_lengkap) {
      setFormError('Kolom bertanda wajib (*) harus diisi.')
      return
    }
    if (!isNumeric(form.nidn)) {
      setFormError('Sistem tidak valid: NIDN harus diisi angka.')
      return
    }
    if (form.no_hp && !isNumeric(form.no_hp)) {
      setFormError('Sistem tidak valid: No. HP harus diisi angka.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        const res = await updateDosen(editingId, form)
        snackbar.success(res.message)
        setDialogOpen(false)
      } else {
        const res = await storeDosen(form)
        setDialogOpen(false)
        setCredentialData({
          title: 'Dosen Berhasil Ditambahkan!',
          nama: form.nama_lengkap,
          username: form.nidn,
          password: 'dosen123',
          role: 'Dosen',
        })
        setCredentialOpen(true)
        snackbar.success('Data dosen dan akun login berhasil dibuat!')
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
      const res = await deleteDosen(deleteTarget.id)
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
    } else {
      setImporting(true)
      try {
        const res = await importDosen(importFile)
        setImportResult(res.data)
        snackbar.success(res.message)
        fetchData()
      } catch (err) {
        snackbar.error(getErrorMessage(err))
      } finally {
        setImporting(false)
      }
    }
  }

  const handlePrintPdf = async () => {
    snackbar.info('Mengambil semua data dosen untuk PDF...')

    let allRows = []
    try {
      let currentPage = 1
      let lastPage = 1
      do {
        const res = await getDosen({ search, page: currentPage, per_page: 100 })
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
    doc.text('Data Dosen STMIK Bandung', pageW / 2, 15, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Tanggal cetak: ${tanggal}  |  Total: ${allRows.length} data`, pageW / 2, 22, { align: 'center' })

    doc.setDrawColor(18, 44, 78)
    doc.setLineWidth(0.5)
    doc.line(14, 25, pageW - 14, 25)

    const head = [['No', 'NIDN', 'Nama Lengkap', 'Email', 'L/P', 'Tempat, Tanggal Lahir', 'Jurusan', 'Universitas', 'No. HP', 'Alamat']]

    const body = allRows.map((r, i) => [
      i + 1,
      r.nidn || '-',
      r.nama_lengkap || '-',
      r.email || '-',
      r.jenis_kelamin === 'P' ? 'P' : 'L',
      ttl(r),
      r.pendidikan_jurusan || '-',
      r.pendidikan_universitas || '-',
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
        0: { halign: 'center', cellWidth: '4%' },
        1: { cellWidth: '10%' },
        2: { cellWidth: '16%' },
        3: { cellWidth: '14%' },
        4: { halign: 'center', cellWidth: '4%' },
        5: { cellWidth: '14%' },
        6: { cellWidth: '14%' },
        7: { cellWidth: '14%' },
        8: { cellWidth: '8%' },
      },
      didDrawPage: (data) => {
        const footerY = doc.internal.pageSize.getHeight() - 8
        doc.setFontSize(8)
        doc.setTextColor(170)
        doc.text('Dokumen ini dibuat oleh Sistem Perwalian STMIK Bandung', pageW / 2, footerY, { align: 'center' })
        doc.text(`Halaman ${doc.internal.getCurrentPageInfo().pageNumber}`, pageW - 14, footerY, { align: 'right' })
      },
    })

    doc.save(`data-dosen-${new Date().toISOString().slice(0, 10)}.pdf`)
    snackbar.success(`PDF berhasil diunduh (${allRows.length} data).`)
  }

  return (
    <>
      <PageHeader
        title="Data Dosen"
        subtitle={`Total ${meta.total} dosen`}
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
              placeholder="Cari NIDN atau nama..."
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

          {loading ? (
            <Loading />
          ) : dataRows.length === 0 ? (
            <EmptyState
              icon={<PersonOffIcon sx={{ fontSize: 48 }} />}
              title="Tidak ada data dosen"
              subtitle="Tambahkan dosen baru atau impor dari Excel."
            />
          ) : (
            <Box className="table-responsive">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>NIDN</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Kelamin</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>No. HP</TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Bimbingan</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows.map((row) => (
                    <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => { setProfileDetail(row); setProfileOpen(true) }}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.nidn}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.nama_lengkap}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{formatKelamin(row.jenis_kelamin)}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.no_hp || '-'}</TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.jumlah_mahasiswa ?? 0}</TableCell>
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
        <DialogTitle>{editingId ? 'Edit Dosen' : 'Tambah Dosen'}</DialogTitle>
        <DialogContent>
          {!editingId && (
            <Alert severity="info" variant="outlined" sx={{ mb: 2, mt: 1, py: 0.5 }}>
              Silakan lengkapi data dosen di bawah ini. Akun login akan dibuatkan secara otomatis setelah data disimpan.
            </Alert>
          )}
          {formError && (
            <Typography color="error" sx={{ mb: 1, display: 'block' }}>
              {formError}
            </Typography>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="NIDN *"
              value={form.nidn}
              onChange={(e) => setForm({ ...form, nidn: e.target.value })}
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
                label="No. HP"
                value={form.no_hp}
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                onInput={onlyDigits}
                fullWidth
              />
            </Stack>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Jurusan (Pendidikan Terakhir)"
                value={form.pendidikan_jurusan}
                onChange={(e) => setForm({ ...form, pendidikan_jurusan: e.target.value })}
                fullWidth
                placeholder="Contoh: Teknik Informatika"
              />
              <TextField
                label="Universitas (Pendidikan Terakhir)"
                value={form.pendidikan_universitas}
                onChange={(e) => setForm({ ...form, pendidikan_universitas: e.target.value })}
                fullWidth
                placeholder="Contoh: Universitas Indonesia"
              />
            </Stack>
            <TextField
              label="Alamat"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              fullWidth
              multiline
              rows={2}
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
        <DialogTitle>Import Data Dosen</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {/* Template Section */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Template Import Dosen
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Unduh file template Excel (.xlsx) ini untuk mengisi data dosen yang akan diimport ke sistem.
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
                <strong>Informasi Akun:</strong> Setiap dosen yang diimport akan dibuatkan akun otomatis dengan <strong>Username = NIDN</strong> dan <strong>Password Default = dosen123</strong>.
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
        title="Hapus Dosen"
        message={`Yakin ingin menghapus ${deleteTarget?.nama_lengkap} (${deleteTarget?.nidn})?`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <ConfirmDialog
        open={Boolean(resetTarget)}
        title="Reset Password"
        message={`Apakah Anda yakin akan mereset password ${resetTarget?.nama_lengkap} (${resetTarget?.nidn})? Password akan direset menjadi dosen123.`}
        confirmText="Reset"
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
        loading={resetting}
      />

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Profil Dosen</DialogTitle>
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
                  <Typography variant="body2" color="text.secondary">NIDN: {profileDetail.nidn}</Typography>
                </Box>
              </Stack>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">Jenis Kelamin</Typography>
                <Typography>{formatKelamin(profileDetail.jenis_kelamin)}</Typography>
              </Box>
              {profileDetail.tempat_lahir || profileDetail.tanggal_lahir ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">Tanggal Lahir</Typography>
                  <Typography>{[profileDetail.tempat_lahir, profileDetail.tanggal_lahir].filter(Boolean).join(', ') || '-'}</Typography>
                </Box>
              ) : null}
              {profileDetail.pendidikan_jurusan || profileDetail.pendidikan_universitas ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">Pendidikan Terakhir</Typography>
                  <Typography>{[profileDetail.pendidikan_jurusan, profileDetail.pendidikan_universitas].filter(Boolean).join(' - ') || '-'}</Typography>
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
                <Typography variant="body2" color="text.secondary">Jumlah Mahasiswa Bimbingan</Typography>
                <Typography>{profileDetail.jumlah_mahasiswa ?? 0}</Typography>
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
