import { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import GroupIcon from '@mui/icons-material/Group'
import BadgeIcon from '@mui/icons-material/Badge'
import EventNoteIcon from '@mui/icons-material/EventNote'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import VerifiedIcon from '@mui/icons-material/Verified'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getRekap } from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { SEMESTER_LABEL, TA_OPTIONS } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'


function ProgressRing({ value, size = 60, color = '#4273B8' }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color }}>{value}%</Typography>
      </Box>
    </Box>
  )
}

export default function AdminRekap() {
  const snackbar = useSnackbar()

  const [tahunAkademik, setTahunAkademik] = useState('')
  const [prodi, setProdi] = useState('')
  const [statusPengajuan, setStatusPengajuan] = useState('terisi')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getRekap({ tahun_akademik: tahunAkademik, prodi, status_pengajuan: statusPengajuan })
      setData(res.data)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [tahunAkademik, prodi, statusPengajuan, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const taOptions = Array.from(new Set([...(data?.filter_options?.tahun_akademik || []), ...TA_OPTIONS])).sort().reverse()
  const prodiOptions = data?.filter_options?.prodi || []

  const displayMahasiswa = (data?.detail_mahasiswa || []).filter((m) => {
    if (statusPengajuan === 'terisi') return Number(m.total_perwalian) > 0
    if (statusPengajuan === 'kosong') return Number(m.total_perwalian) === 0
    return true
  })

  const displayDosen = (data?.detail_dosen || []).filter((d) => {
    if (statusPengajuan === 'terisi') return Number(d.total_perwalian) > 0
    if (statusPengajuan === 'kosong') return Number(d.jumlah_perwalian) > 0 && Number(d.total_perwalian) === 0
    if (prodi || tahunAkademik) return Number(d.total_perwalian) > 0 || Number(d.jumlah_perwalian) > 0
    return true
  })

  const downloadPdf = async () => {
    if (!data) return
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const taLabel = tahunAkademik ? `TA ${tahunAkademik}` : 'Semua Tahun Akademik'
    const prodiLabel = prodi || 'Semua Program Studi'
    const statusPengajuanLabel = statusPengajuan === 'terisi'
      ? 'Data Terisi (Sudah Perwalian)'
      : statusPengajuan === 'kosong'
      ? 'Data Kosong (Belum Perwalian)'
      : 'Semua Mahasiswa'

    let startY = 16

    // Judul Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(18, 44, 78)
    doc.text('REKAP DATA PERWALIAN MAHASISWA', pageWidth / 2, startY, { align: 'center' })

    startY += 5.5
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text('STMIK BANDUNG', pageWidth / 2, startY, { align: 'center' })

    startY += 3.5
    doc.setDrawColor(18, 44, 78)
    doc.setLineWidth(0.6)
    doc.line(14, startY, pageWidth - 14, startY)

    startY += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(51, 65, 85)
    const filterInfo = `${taLabel}   |   ${prodiLabel}   |   Filter: ${statusPengajuanLabel}   |   Dicetak: ${tanggal}`
    doc.text(filterInfo, pageWidth / 2, startY, { align: 'center' })

    startY += 10

    // Section 1: Ringkasan per Program Studi
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(18, 44, 78)
    doc.text('1. RINGKASAN PER PROGRAM STUDI', 14, startY)
    startY += 3.5

    const summaryRows = (data.summary || []).map((s) => [
      s.prodi,
      s.jumlah_mahasiswa,
      s.total,
      s.menunggu_verifikasi,
      s.diverifikasi,
      s.selesai,
      `${s.persentase_selesai}%`,
    ])

    const totalRow = [
      'TOTAL',
      data.totals?.jumlah_mahasiswa || 0,
      data.totals?.total || 0,
      data.totals?.menunggu_verifikasi || 0,
      data.totals?.diverifikasi || 0,
      data.totals?.selesai || 0,
      `${data.totals?.persentase_selesai || 0}%`,
    ]

    const summaryBody = summaryRows.length > 0 ? [...summaryRows, totalRow] : [['Tidak ada data', '', '', '', '', '', '']]

    autoTable(doc, {
      startY: startY,
      margin: { left: 14, right: 14 },
      head: [['Program Studi', 'Mhs', 'Total Perwalian', 'Menunggu', 'Diverifikasi', 'Selesai', '% Selesai']],
      body: summaryBody,
      theme: 'grid',
      styles: {
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.2,
      },
      headStyles: {
        fillColor: [18, 44, 78],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8.5,
        cellPadding: 2.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center', fontStyle: 'bold' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center', fontStyle: 'bold' },
        6: { halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'body' && summaryRows.length > 0 && hookData.row.index === summaryRows.length) {
          hookData.cell.styles.fillColor = [232, 237, 245]
          hookData.cell.styles.fontStyle = 'bold'
          hookData.cell.styles.textColor = [18, 44, 78]
        }
      },
    })

    startY = doc.lastAutoTable.finalY + 12

    // Check space before Section 2
    if (startY > pageHeight - 45) {
      doc.addPage()
      startY = 16
    }

    // Section 2: Detail per Mahasiswa
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(18, 44, 78)
    doc.text(`2. DETAIL PER MAHASISWA (${displayMahasiswa.length} Mahasiswa)`, 14, startY)
    startY += 3.5

    const mhsRows = displayMahasiswa.map((m, i) => [
      i + 1,
      m.nim,
      m.nama_lengkap,
      m.program_studi,
      m.angkatan,
      m.semester,
      m.dosen_wali || '-',
      m.total_perwalian,
      m.selesai,
    ])

    autoTable(doc, {
      startY: startY,
      margin: { left: 14, right: 14 },
      head: [['No', 'NIM', 'Nama Mahasiswa', 'Program Studi', 'Angkatan', 'Smstr', 'Dosen Wali', 'Total', 'Selesai']],
      body: mhsRows.length > 0 ? mhsRows : [['-', '-', 'Tidak ada data mahasiswa', '-', '-', '-', '-', '-', '-']],
      showHead: 'everyPage',
      theme: 'grid',
      styles: {
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [18, 44, 78],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8,
        cellPadding: 2.2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 9 },
        1: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
        2: { halign: 'left' },
        3: { halign: 'left', cellWidth: 32 },
        4: { halign: 'center', cellWidth: 17 },
        5: { halign: 'center', cellWidth: 13 },
        6: { halign: 'left', cellWidth: 34 },
        7: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
        8: { halign: 'center', cellWidth: 14 },
      },
    })

    startY = doc.lastAutoTable.finalY + 12

    // Check space before Section 3
    if (startY > pageHeight - 45) {
      doc.addPage()
      startY = 16
    }

    // Section 3: Rekap Dosen Wali
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(18, 44, 78)
    doc.text(`3. REKAP DOSEN WALI (${displayDosen.length} Dosen)`, 14, startY)
    startY += 3.5

    const dosenRows = displayDosen.map((d, i) => [
      i + 1,
      d.nama_lengkap,
      d.nidn || '-',
      d.jumlah_perwalian,
      d.total_perwalian,
      d.menunggu,
      d.selesai,
    ])

    autoTable(doc, {
      startY: startY,
      margin: { left: 14, right: 14 },
      head: [['No', 'Nama Dosen', 'NIDN', 'Mhs Bimbingan', 'Total Perwalian', 'Menunggu', 'Selesai']],
      body: dosenRows.length > 0 ? dosenRows : [['-', 'Tidak ada data dosen', '-', '-', '-', '-', '-']],
      showHead: 'everyPage',
      theme: 'grid',
      styles: {
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [18, 44, 78],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8,
        cellPadding: 2.2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 9 },
        1: { halign: 'left' },
        2: { halign: 'center', cellWidth: 26 },
        3: { halign: 'center', cellWidth: 26 },
        4: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 20 },
      },
    })

    // Footer on all pages
    const totalPages = doc.internal.getNumberOfPages()
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Dokumen ini dibuat secara otomatis oleh Sistem Perwalian STMIK Bandung pada ${tanggal}`,
        14,
        pageHeight - 8
      )
      doc.text(
        `Halaman ${p} dari ${totalPages}`,
        pageWidth - 14,
        pageHeight - 8,
        { align: 'right' }
      )
    }

    const safeTa = tahunAkademik ? tahunAkademik.replace('/', '-') : 'semua-ta'
    doc.save(`rekap-perwalian-${safeTa}-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <>
      <PageHeader
        title="Rekap Data"
        subtitle="Ringkasan dan detail data perwalian mahasiswa"
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={downloadPdf} disabled={!data}>
              Export PDF
            </Button>
          </Stack>
        }
      />

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
            <Select size="small" displayEmpty value={tahunAkademik} onChange={(e) => setTahunAkademik(e.target.value)} sx={{ minWidth: 180 }}>
              <MenuItem value=""><em>Semua Tahun Akademik</em></MenuItem>
              {taOptions.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
            <Select size="small" displayEmpty value={prodi} onChange={(e) => setProdi(e.target.value)} sx={{ minWidth: 260 }}>
              <MenuItem value=""><em>Semua Prodi</em></MenuItem>
              {prodiOptions.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
            <Select size="small" displayEmpty value={statusPengajuan} onChange={(e) => setStatusPengajuan(e.target.value)} sx={{ minWidth: 240 }}>
              <MenuItem value=""><em>Semua Mahasiswa</em></MenuItem>
              <MenuItem value="terisi">Data Terisi (Sudah Perwalian)</MenuItem>
              <MenuItem value="kosong">Data Kosong (Belum Perwalian)</MenuItem>
            </Select>
          </Stack>
        </CardContent>
      </Card>

      {loading || !data ? (
        <Loading />
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Mahasiswa</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#122C4E' }}>{data.totals.jumlah_mahasiswa}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#EEF2FF', color: '#4273B8' }}><GroupIcon /></Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Perwalian</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#122C4E' }}>{data.totals.total}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F0FDF4', color: '#16A34A' }}><EventNoteIcon /></Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Selesai</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#16A34A' }}>{data.totals.selesai}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F0FDF4', color: '#16A34A' }}><CheckCircleIcon /></Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Tingkat Selesai</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#122C4E' }}>{data.totals.persentase_selesai}%</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FAF5FF', color: '#9333EA' }}><TrendingUpIcon /></Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Navigation Tabs */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                <Tab label="Ringkasan Prodi" />
                <Tab label={`Detail Mahasiswa (${displayMahasiswa.length})`} />
                <Tab label={`Dosen Wali (${displayDosen.length})`} />
                <Tab label="Perwalian Terbaru" />
              </Tabs>
            </CardContent>
          </Card>

          {/* Tab 0: Summary per Prodi */}
          {tab === 0 && (
            <Card>
              <CardContent>
                {data.summary.length === 0 ? (
                  <EmptyState title="Tidak ada data rekap" />
                ) : (
                  <Box className="table-responsive">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Program Studi</TableCell>
                        <TableCell align="center">Mahasiswa</TableCell>
                        <TableCell align="center">Jumlah Record Perwalian</TableCell>
                        <TableCell align="center">Menunggu Verifikasi</TableCell>
                        <TableCell align="center">Sudah di Verifikasi</TableCell>
                        <TableCell align="center">Selesai Perwalian</TableCell>
                        <TableCell align="center">% Selesai Perwalian</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.summary.map((s) => (
                        <TableRow key={s.prodi} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.prodi}</Typography>
                          </TableCell>
                          <TableCell align="center">{s.jumlah_mahasiswa}</TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 700 }}>{s.total}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            {s.menunggu_verifikasi > 0 ? (
                              <Chip label={s.menunggu_verifikasi} size="small" color="warning" variant="outlined" />
                            ) : '0'}
                          </TableCell>
                          <TableCell align="center">{s.diverifikasi}</TableCell>
                          <TableCell align="center">{s.selesai}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                              <ProgressRing value={s.persentase_selesai} size={44} color={s.persentase_selesai >= 50 ? '#059669' : '#D97706'} />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell><Typography sx={{ fontWeight: 700 }}>TOTAL</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.jumlah_mahasiswa}</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.total}</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.menunggu_verifikasi}</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.diverifikasi}</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.selesai}</Typography></TableCell>
                        <TableCell align="center"><Typography sx={{ fontWeight: 700 }}>{data.totals.persentase_selesai}%</Typography></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tab 1: Detail Mahasiswa */}
          {tab === 1 && (
            <Card>
              <CardContent>
                {displayMahasiswa.length === 0 ? (
                  <EmptyState title="Tidak ada data mahasiswa" />
                ) : (
                  <Box className="table-responsive">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>NIM</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Prodi</TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Angkatan</TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Semester</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Dosen Wali</TableCell>
                        <TableCell align="center">Jumlah Perwalian</TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Menunggu Verifikasi</TableCell>
                        <TableCell align="center">Selesai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayMahasiswa.map((m) => (
                        <TableRow key={m.id} hover>
                          <TableCell>{m.nim}</TableCell>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{m.nama_lengkap}</Typography></TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.program_studi}</TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.angkatan}</TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{m.semester}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{m.dosen_wali}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: m.total_perwalian > 0 ? 700 : 400 }}>{m.total_perwalian}</TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {m.menunggu > 0 ? <Chip label={m.menunggu} size="small" color="warning" variant="outlined" /> : '0'}
                          </TableCell>
                          <TableCell align="center">{m.selesai}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tab 2: Detail Dosen */}
          {tab === 2 && (
            <Card>
              <CardContent>
                {displayDosen.length === 0 ? (
                  <EmptyState title="Tidak ada data dosen" />
                ) : (
                  <Box className="table-responsive">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Dosen</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>NIDN</TableCell>
                        <TableCell align="center">Jumlah Mahasiswa Bimbingan</TableCell>
                        <TableCell align="center">Total Perwalian</TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Menunggu Verifikasi</TableCell>
                        <TableCell align="center">Sudah Selesai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayDosen.map((d) => (
                        <TableRow key={d.id} hover>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{d.nama_lengkap}</Typography></TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{d.nidn || '-'}</TableCell>
                          <TableCell align="center">{d.jumlah_perwalian}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: d.total_perwalian > 0 ? 700 : 400 }}>{d.total_perwalian}</TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {d.menunggu > 0 ? <Chip label={d.menunggu} size="small" color="warning" variant="outlined" /> : '0'}
                          </TableCell>
                          <TableCell align="center">{d.selesai}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tab 3: Recent Perwalian */}
          {tab === 3 && (
            <Card>
              <CardContent>
                {data.recent_perwalian.length === 0 ? (
                  <EmptyState title="Tidak ada data perwalian" />
                ) : (
                  <Box className="table-responsive">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Mahasiswa</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>NIM</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Periode</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Uraian</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recent_perwalian.map((p) => (
                        <TableRow key={p.id} hover>
                          <TableCell>{formatTanggalWaktu(p.created_at)}</TableCell>
                          <TableCell>{p.mahasiswa?.nama_lengkap}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{p.mahasiswa?.nim}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{p.tahun_akademik} ({SEMESTER_LABEL[p.semester]})</TableCell>
                          <TableCell sx={{ maxWidth: 250, display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.uraian}
                            </Typography>
                          </TableCell>
                          <TableCell><StatusBadge status={p.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  )
}
