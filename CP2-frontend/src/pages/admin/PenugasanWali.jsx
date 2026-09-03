import { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getPenugasan } from '../../api/services/admin'
import { getDosen } from '../../api/services/admin'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Autocomplete from '@mui/material/Autocomplete'
import { getErrorMessage } from '../../api/client'

export default function AdminPenugasan() {
  const snackbar = useSnackbar()

  const [dosenList, setDosenList] = useState([])
  const [mahasiswaGrouped, setMahasiswaGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [selectedDosenForPrint, setSelectedDosenForPrint] = useState(null)

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [dosenRes, firstPageRes] = await Promise.all([
        getDosen({}),
        getPenugasan({ page: 1 }),
      ])

      setDosenList(dosenRes.data || [])

      const total = firstPageRes.meta?.total || 0
      const perPage = firstPageRes.data?.length || 10
      const lastPage = firstPageRes.meta?.last_page || 1

      let allMahasiswa = [...(firstPageRes.data || [])]

      if (lastPage > 1) {
        const remaining = []
        for (let p = 2; p <= lastPage; p++) {
          remaining.push(getPenugasan({ page: p }))
        }
        const results = await Promise.all(remaining)
        results.forEach((r) => {
          if (r.data) allMahasiswa = allMahasiswa.concat(r.data)
        })
      }

      const grouped = {}
      allMahasiswa.forEach((m) => {
        const key = m.dosen_wali_id
        if (key) {
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(m)
        }
      })
      setMahasiswaGrouped(grouped)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [snackbar])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleSearch = () => setSearch(searchInput)

  const toggleExpand = (dosenId) => {
    setExpandedId(expandedId === dosenId ? null : dosenId)
  }

  const filteredDosen = dosenList.filter((d) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      d.nama_lengkap?.toLowerCase().includes(q) ||
      d.nidn?.toLowerCase().includes(q) ||
      d.program_studi?.toLowerCase().includes(q)
    )
  })

  const handlePrintPdf = async () => {
    if (!selectedDosenForPrint) {
      snackbar.error('Pilih dosen terlebih dahulu')
      return
    }
    const dosen = selectedDosenForPrint
    const mahasiswaList = mahasiswaGrouped[dosen.id] || []
    if (mahasiswaList.length === 0) {
      snackbar.error('Tidak ada mahasiswa untuk dosen ini')
      return
    }
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(18, 44, 78)
    doc.text('Daftar Mahasiswa Bimbingan', pageW / 2, 15, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('Penugasan Dosen Wali STMIK Bandung', pageW / 2, 22, { align: 'center' })

    doc.setDrawColor(18, 44, 78)
    doc.setLineWidth(0.5)
    doc.line(14, 25, pageW - 14, 25)

    doc.setFontSize(10)
    doc.setTextColor(18, 44, 78)
    doc.setFont('helvetica', 'bold')
    doc.text(`Nama Dosen: ${dosen.nama_lengkap || '-'}`, 14, 32)
    doc.text(`NIDN: ${dosen.nidn || '-'}`, 14, 38)
    doc.text(`Jumlah Mahasiswa: ${mahasiswaList.length}`, 14, 44)
    doc.text(`Dicetak: ${tanggal}`, 14, 50)

    const head = [['No', 'NIM', 'Nama Lengkap', 'Program Studi', 'Angkatan', 'Semester']]

    const body = mahasiswaList.map((m, i) => [
      i + 1,
      m.nim || '-',
      m.nama_lengkap || '-',
      m.program_studi || '-',
      m.angkatan || '-',
      m.semester || '-',
    ])

    autoTable(doc, {
      head,
      body,
      startY: 55,
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [18, 44, 78],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [247, 249, 252],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 14 },
        1: { cellWidth: 28 },
        2: { cellWidth: 55 },
        3: { cellWidth: 45 },
        4: { halign: 'center', cellWidth: 22 },
        5: { halign: 'center', cellWidth: 22 },
      },
      didDrawPage: (data) => {
        const footerY = doc.internal.pageSize.getHeight() - 8
        doc.setFontSize(8)
        doc.setTextColor(170)
        doc.text('Dokumen ini dibuat secara otomatis oleh Sistem Perwalian STMIK Bandung', pageW / 2, footerY, { align: 'center' })
        doc.text(`Halaman ${doc.internal.getCurrentPageInfo().pageNumber}`, pageW - 14, footerY, { align: 'right' })
      },
    })

    const safeName = (dosen.nama_lengkap || 'dosen').replace(/[^a-zA-Z0-9]/g, '_')
    doc.save(`penugasan-wali-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`)
    setPrintDialogOpen(false)
    setSelectedDosenForPrint(null)
  }

  return (
    <>
      <PageHeader
        title="Penugasan Dosen Wali"
        subtitle="Melihat daftar mahasiswa bimbingan per dosen wali"
        actions={
          <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={() => setPrintDialogOpen(true)}>
            Export PDF
          </Button>
        }
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Cari nama, NIDN, atau prodi dosen..."
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
            <Button variant="outlined" onClick={handleSearch}>
              Cari
            </Button>
          </Stack>

          {loading ? (
            <Loading />
          ) : filteredDosen.length === 0 ? (
            <EmptyState
              icon={<SupervisorAccountIcon sx={{ fontSize: 48 }} />}
              title="Tidak ada dosen ditemukan"
              subtitle="Tidak ada data dosen wali yang sesuai dengan pencarian."
            />
          ) : (
            filteredDosen.map((dosen) => {
              const mahasiswaList = mahasiswaGrouped[dosen.id] || []
              const isExpanded = expandedId === dosen.id
              return (
                <Card key={dosen.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ pb: '12px !important' }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {dosen.nama_lengkap}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            <Chip label={`NIDN: ${dosen.nidn || '-'}`} size="small" variant="outlined" />
                            <Chip label={dosen.program_studi || '-'} size="small" color="primary" variant="outlined" />
                            <Chip label={`${mahasiswaList.length} mahasiswa`} size="small" color="success" />
                          </Stack>
                        </Box>
                      </Stack>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(dosen.id)}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Stack>

                    <Collapse in={isExpanded}>
                      <Box sx={{ mt: 2 }}>
                        {mahasiswaList.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            Belum ada mahasiswa yang ditugaskan.
                          </Typography>
                        ) : (
                          <Box className="table-responsive">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>No</TableCell>
                                  <TableCell>NIM</TableCell>
                                  <TableCell>Nama</TableCell>
                                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Prodi</TableCell>
                                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Angkatan</TableCell>
                                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Semester</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {mahasiswaList.map((m, idx) => (
                                  <TableRow key={m.id} hover>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{m.nim}</TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {m.nama_lengkap}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.program_studi}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.angkatan}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.semester}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={printDialogOpen} onClose={() => { setPrintDialogOpen(false); setSelectedDosenForPrint(null) }} maxWidth="sm" fullWidth>
        <DialogTitle>Export PDF Mahasiswa Bimbingan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pilih dosen wali untuk mengekspor PDF daftar mahasiswa bimbingan.
          </Typography>
          <Autocomplete
            options={dosenList}
            getOptionLabel={(opt) => opt.nama_lengkap || ''}
            isOptionEqualToValue={(opt, val) => opt.id === val?.id}
            value={selectedDosenForPrint}
            onChange={(_, newValue) => setSelectedDosenForPrint(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih Dosen Wali"
                placeholder="Ketik nama atau NIDN dosen..."
              />
            )}
            renderOption={(props, option) => {
              const count = (mahasiswaGrouped[option.id] || []).length
              return (
                <li {...props} key={option.id}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2">{option.nama_lengkap}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">NIDN: {option.nidn || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">|</Typography>
                      <Typography variant="caption" color="primary">{count} mahasiswa</Typography>
                    </Stack>
                  </Box>
                </li>
              )
            }}
          />
          {selectedDosenForPrint && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 1, borderLeft: '4px solid #122C4E' }}>
              <Typography variant="body2"><strong>Nama:</strong> {selectedDosenForPrint.nama_lengkap}</Typography>
              <Typography variant="body2"><strong>NIDN:</strong> {selectedDosenForPrint.nidn || '-'}</Typography>
              <Typography variant="body2"><strong>Jumlah Mahasiswa:</strong> {(mahasiswaGrouped[selectedDosenForPrint.id] || []).length}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setPrintDialogOpen(false); setSelectedDosenForPrint(null) }} color="inherit">
            Batal
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePrintPdf}
            disabled={!selectedDosenForPrint}
          >
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
