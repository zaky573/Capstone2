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
    const { default: html2canvas } = await import('html2canvas')

    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const thS = 'background:#122C4E;color:#fff;padding:8px 10px;border:1px solid #0d1f38;text-align:left;'
    const thC = 'background:#122C4E;color:#fff;padding:8px 10px;border:1px solid #0d1f38;text-align:center;'

    const mhsRows = mahasiswaList.map((m, i) =>
      `<tr style="background:${i % 2 === 0 ? '#f7f9fc' : '#fff'}">
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;white-space:nowrap">${m.nim || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${m.nama_lengkap || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd">${m.program_studi || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${m.angkatan || '-'}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${m.semester || '-'}</td>
      </tr>`
    ).join('')

    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:900px;background:#fff;padding:30px;font-family:Arial,sans-serif;font-size:11px;color:#111;'

    container.innerHTML = `
      <div style="text-align:center;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #122C4E">
        <h1 style="margin:0;font-size:20px;color:#122C4E">Daftar Mahasiswa Bimbingan</h1>
        <p style="margin:4px 0 0;color:#666;font-size:12px">Penugasan Dosen Wali STMIK Bandung</p>
      </div>
      <div style="margin:16px 0;padding:12px 16px;background:#f5f7fa;border-left:4px solid #122C4E;font-size:12px;border-radius:0 6px 6px 0">
        <p style="margin:4px 0"><strong style="color:#122C4E;min-width:140px;display:inline-block">Nama Dosen:</strong> ${dosen.nama_lengkap || '-'}</p>
        <p style="margin:4px 0"><strong style="color:#122C4E;min-width:140px;display:inline-block">NIDN:</strong> ${dosen.nidn || '-'}</p>
        <p style="margin:4px 0"><strong style="color:#122C4E;min-width:140px;display:inline-block">Jumlah Mahasiswa:</strong> ${mahasiswaList.length}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:15px">
        <thead>
          <tr>
            <th style="${thC};width:35px">No</th>
            <th style="${thS};width:100px">NIM</th>
            <th style="${thS}">Nama Lengkap</th>
            <th style="${thS};width:160px">Program Studi</th>
            <th style="${thC};width:70px">Angkatan</th>
            <th style="${thC};width:65px">Semester</th>
          </tr>
        </thead>
        <tbody>${mhsRows}</tbody>
      </table>
      <p style="margin-top:25px;font-size:10px;color:#999;text-align:center">Dokumen ini dibuat secara otomatis oleh Sistem Perwalian STMIK Bandung &bull; Dicetak: ${tanggal}</p>
    `

    document.body.appendChild(container)
    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#fff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
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
      const safeName = (dosen.nama_lengkap || 'dosen').replace(/[^a-zA-Z0-9]/g, '_')
      pdf.save(`penugasan-wali-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      document.body.removeChild(container)
    }
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
            Download PDF
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
              sx={{ minWidth: 300 }}
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
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={2}>
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
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>NIM</TableCell>
                                <TableCell>Nama</TableCell>
                                <TableCell>Prodi</TableCell>
                                <TableCell>Angkatan</TableCell>
                                <TableCell>Semester</TableCell>
                                <TableCell>Status</TableCell>
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
                                  <TableCell>{m.program_studi}</TableCell>
                                  <TableCell>{m.angkatan}</TableCell>
                                  <TableCell>{m.semester}</TableCell>
                                  <TableCell>{m.status || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
        <DialogTitle>Download PDF Mahasiswa Bimbingan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pilih dosen wali untuk mengunduh PDF daftar mahasiswa bimbingan.
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
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
