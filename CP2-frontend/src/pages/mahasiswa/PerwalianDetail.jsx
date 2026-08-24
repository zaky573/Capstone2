import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SchoolIcon from '@mui/icons-material/School'
import BadgeIcon from '@mui/icons-material/Badge'
import PlaceIcon from '@mui/icons-material/Place'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getMyPerwalianDetail } from '../../api/services/mahasiswa'
import { getErrorMessage } from '../../api/client'
import { SEMESTER_LABEL, STATUS_LABEL } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

function InfoItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value || '-'}</Typography>
      </Box>
    </Stack>
  )
}

export default function MahasiswaPerwalianDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPerwalianDetail(id)
      .then(({ data }) => setData(data))
      .catch((err) => snackbar.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, snackbar])

  const handlePrint = () => {
    if (!data) return
    const html = `<!DOCTYPE html>
<html><head><title>Bukti Perwalian - ${data.mahasiswa?.nim}</title>
<style>
  @page{margin:20mm}
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',sans-serif;padding:40px;color:#333}
  .header{text-align:center;margin-bottom:30px;border-bottom:3px solid #122C4E;padding-bottom:20px}
  .header h1{font-size:22px;margin:0;color:#122C4E}
  .header h2{font-size:14px;margin:5px 0 0;color:#666;font-weight:normal}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin:16px 0}
  .info-row{display:flex;justify-content:space-between;padding:4px 0}
  .info-label{font-weight:600;min-width:160px;color:#555}
  .divider{margin:20px 0;border:none;border-top:1px solid #ddd}
  .section{margin:16px 0;padding:14px;background:#f9f9f9;border-radius:8px;border-left:4px solid #4273B8}
  .section h3{margin:0 0 6px;font-size:13px;color:#4273B8;text-transform:uppercase;letter-spacing:0.5px}
  .section p{margin:0;white-space:pre-wrap;line-height:1.5}
  .jadwal{border-left-color:#F9C900;background:#FFFBF0}
  .jadwal h3{color:#8B6914}
  .catatan-dosen{border-left-color:#F9C900}
  .catatan-admin{border-left-color:#4273B8}
  .footer{margin-top:40px;text-align:center;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:15px}
  .status{display:inline-block;padding:4px 12px;border-radius:4px;font-weight:600;font-size:12px}
  .status-menunggu{background:#FFF3E0;color:#E65100}
  .status-diverifikasi{background:#E8F5E9;color:#2E7D32}
  .status-selesai{background:#E3F2FD;color:#1565C0}
  @media print{body{padding:20px}}
</style></head><body>
  <div class="header">
    <h1>STMIK Bandung</h1>
    <h2>Bukti Pencatatan Perwalian Mahasiswa</h2>
  </div>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Nama Mahasiswa</span><span>${data.mahasiswa?.nama_lengkap || '-'}</span></div>
    <div class="info-row"><span class="info-label">NIM</span><span>${data.mahasiswa?.nim || '-'}</span></div>
    <div class="info-row"><span class="info-label">Program Studi</span><span>${data.mahasiswa?.program_studi || '-'}</span></div>
    <div class="info-row"><span class="info-label">Semester</span><span>${data.mahasiswa?.semester || '-'}</span></div>
    <div class="info-row"><span class="info-label">Dosen Wali</span><span>${data.mahasiswa?.dosen_wali?.nama_lengkap || '-'}</span></div>
  </div>
  <hr class="divider"/>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Tahun Akademik</span><span>${data.tahun_akademik} ${SEMESTER_LABEL[data.semester] || ''}</span></div>
    <div class="info-row"><span class="info-label">Status</span><span class="status status-${data.status}">${STATUS_LABEL[data.status] || data.status}</span></div>
  </div>
  <div class="section"><h3>Uraian Konsultasi</h3><p>${data.uraian || '-'}</p></div>
  ${data.tanggal_ketemu ? `<div class="section jadwal"><h3>Jadwal Pertemuan</h3><p>${data.lokasi_pertemuan ? 'Lokasi: ' + data.lokasi_pertemuan + '<br/>' : ''}Tanggal: ${data.tanggal_ketemu}${data.jam_ketemu ? '<br/>Jam: ' + data.jam_ketemu : ''}${data.catatan_jadwal ? '<br/>Catatan: ' + data.catatan_jadwal : ''}</p></div>` : ''}
  ${data.catatan_dosen ? `<div class="section catatan-dosen"><h3>Catatan Dosen Wali</h3><p>${data.catatan_dosen}</p></div>` : ''}
  ${data.catatan_admin ? `<div class="section catatan-admin"><h3>Catatan Admin</h3><p>${data.catatan_admin}</p></div>` : ''}
  ${!data.catatan_dosen && data.komentar_dosen ? `<div class="section catatan-dosen"><h3>Komentar Dosen Wali</h3><p>${data.komentar_dosen}</p></div>` : ''}
  <div class="footer">Dokumen ini dicetak secara otomatis oleh Sistem Pencatatan Perwalian STMIK Bandung<br/>Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
</body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;'
    iframe.src = url
    document.body.appendChild(iframe)
    iframe.onload = () => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
        URL.revokeObjectURL(url)
      }, 1000)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      <PageHeader
        title="Detail Perwalian"
        subtitle={`Dibuat ${formatTanggalWaktu(data.created_at)}`}
        actions={
          <Stack direction="row" spacing={1}>
            {data.status === 'menunggu_verifikasi' && (
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/mahasiswa/perwalian/${data.id}/edit`)}>
                Edit
              </Button>
            )}
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
              Cetak
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2.5}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {data.mahasiswa?.nama_lengkap}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {data.mahasiswa?.nim} · {data.mahasiswa?.program_studi}
                    </Typography>
                  </Box>
                  <StatusBadge status={data.status} />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <InfoItem icon={<CalendarMonthIcon fontSize="small" color="primary" />} label="Periode" value={`${data.tahun_akademik} ${SEMESTER_LABEL[data.semester] || ''}`} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <InfoItem icon={<SchoolIcon fontSize="small" color="primary" />} label="Semester" value={data.mahasiswa?.semester} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <InfoItem icon={<BadgeIcon fontSize="small" color="primary" />} label="Dosen Wali" value={data.mahasiswa?.dosen_wali?.nama_lengkap} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <InfoItem icon={<CalendarMonthIcon fontSize="small" color="primary" />} label="Diverifikasi" value={data.verified_at ? formatTanggalWaktu(data.verified_at) : '-'} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                  Uraian Konsultasi
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{data.uraian || '-'}</Typography>
              </CardContent>
            </Card>

            {data.tanggal_ketemu && (
              <Card sx={{ borderLeft: '4px solid #F9C900', bgcolor: '#FFFBF0' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: '#8B6914' }}>
                    Jadwal Pertemuan
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {data.lokasi_pertemuan && (
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <PlaceIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2">{data.lokasi_pertemuan}</Typography>
                      </Stack>
                    )}
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <CalendarMonthIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                      <Typography variant="body2">{data.tanggal_ketemu}</Typography>
                    </Stack>
                    {data.jam_ketemu && (
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <AccessTimeIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2">{data.jam_ketemu}</Typography>
                      </Stack>
                    )}
                    {data.catatan_jadwal && (
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <StickyNote2Icon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2" color="text.secondary">{data.catatan_jadwal}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {(data.catatan_dosen || data.komentar_dosen) && (
              <Card sx={{ borderLeft: '4px solid #F9C900' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                    Catatan Dosen Wali
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{data.catatan_dosen || data.komentar_dosen}</Typography>
                </CardContent>
              </Card>
            )}

            {data.catatan_admin && (
              <Card sx={{ borderLeft: '4px solid #4273B8' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                    Catatan Admin
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>{data.catatan_admin}</Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Status</Typography>
              <StatusBadge status={data.status} />
              {data.status !== 'menunggu_verifikasi' && (
                <Chip label="Tidak dapat diedit" size="small" variant="outlined" sx={{ ml: 1 }} />
              )}
              {data.verified_at && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Terakhir diubah {formatTanggalWaktu(data.verified_at)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
