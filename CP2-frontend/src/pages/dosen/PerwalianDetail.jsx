import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import SaveIcon from '@mui/icons-material/Save'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
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
import { getPerwalianDetail, komentarPerwalian, updateStatus } from '../../api/services/dosen'
import { getErrorMessage } from '../../api/client'
import { SEMESTER_LABEL } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

function InfoItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value || '-'}</Typography>
      </Box>
    </Stack>
  )
}

function Section({ label, children }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
        {children || '-'}
      </Typography>
    </Box>
  )
}

export default function DosenPerwalianDetail() {
  const { id } = useParams()
  const snackbar = useSnackbar()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [catatanDosen, setCatatanDosen] = useState('')
  const [savingCatatan, setSavingCatatan] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyForm, setVerifyForm] = useState({ tanggal_ketemu: '', jam_ketemu: '', catatan_jadwal: '', lokasi_pertemuan: '' })
  const [savingVerify, setSavingVerify] = useState(false)

  useEffect(() => {
    getPerwalianDetail(id)
      .then(({ data }) => {
        setData(data)
        setCatatanDosen(data.komentar_dosen || '')
      })
      .catch((err) => snackbar.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, snackbar])

  const handleSaveCatatan = async () => {
    setSavingCatatan(true)
    try {
      const res = await komentarPerwalian(id, { komentar_dosen: catatanDosen })
      setData(res.data)
      snackbar.success(res.message)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setSavingCatatan(false)
    }
  }

  const handleStatus = async (newStatus, payload = {}) => {
    try {
      const res = await updateStatus(id, { status: newStatus, ...payload })
      setData(res.data)
      snackbar.success(res.message)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    }
  }

  const handleVerifySubmit = async () => {
    setSavingVerify(true)
    try {
      await handleStatus('diverifikasi', verifyForm)
      setVerifyOpen(false)
      setVerifyForm({ tanggal_ketemu: '', jam_ketemu: '' })
    } finally {
      setSavingVerify(false)
    }
  }

  const openVerifyDialog = () => {
    setVerifyForm({ tanggal_ketemu: '', jam_ketemu: '', catatan_jadwal: '', lokasi_pertemuan: '' })
    setVerifyOpen(true)
  }

  if (loading) return <Loading />

  return (
    <>
      <PageHeader
        title="Detail Perwalian"
        subtitle={`Dibuat ${formatTanggalWaktu(data.created_at)} oleh ${data.mahasiswa?.nama_lengkap}`}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }} gap={2}>
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
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <InfoItem icon={<CalendarMonthIcon fontSize="small" color="primary" />} label="Periode" value={`${data.tahun_akademik} ${SEMESTER_LABEL[data.semester]}`} />
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
                <Section label="Uraian Konsultasi">{data.uraian}</Section>
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
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                        <PlaceIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2">{data.lokasi_pertemuan}</Typography>
                      </Stack>
                    )}
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <CalendarMonthIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                      <Typography variant="body2">{data.tanggal_ketemu}</Typography>
                    </Stack>
                    {data.jam_ketemu && (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                        <AccessTimeIcon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2">{data.jam_ketemu}</Typography>
                      </Stack>
                    )}
                    {data.catatan_jadwal && (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                        <StickyNote2Icon fontSize="small" sx={{ color: '#8B6914', mt: 0.25 }} />
                        <Typography variant="body2" color="text.secondary">{data.catatan_jadwal}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {data.catatan_admin && (
              <Card sx={{ borderLeft: '4px solid #4273B8' }}>
                <CardContent>
                  <Section label="Catatan Admin">{data.catatan_admin}</Section>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Status Perwalian
                </Typography>
                <StatusBadge status={data.status} />
                {data.status === 'menunggu_verifikasi' && (
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={openVerifyDialog}>
                    Verifikasi
                  </Button>
                )}
                {data.status === 'diverifikasi' && (
                  <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={() => handleStatus('selesai')}>
                    Tandai Selesai
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Catatan Dosen
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Tulis catatan..."
                  value={catatanDosen}
                  onChange={(e) => setCatatanDosen(e.target.value)}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSaveCatatan}
                  disabled={savingCatatan}
                >
                  {savingCatatan ? 'Menyimpan...' : 'Simpan Catatan'}
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={verifyOpen} onClose={() => setVerifyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Verifikasi Perwalian</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Isi jadwal pertemuan dengan mahasiswa. Jika belum menentukan jadwal, klik Batalkan.
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Lokasi Pertemuan"
              placeholder="Contoh: Ruang Dosen 301, Kantin, dll."
              value={verifyForm.lokasi_pertemuan}
              onChange={(e) => setVerifyForm({ ...verifyForm, lokasi_pertemuan: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tanggal Pertemuan"
              type="date"
              value={verifyForm.tanggal_ketemu}
              onChange={(e) => setVerifyForm({ ...verifyForm, tanggal_ketemu: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Jam Pertemuan"
              type="time"
              value={verifyForm.jam_ketemu}
              onChange={(e) => setVerifyForm({ ...verifyForm, jam_ketemu: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Catatan (Opsional)"
              placeholder="Contoh: Bertemu di ruang dosen, atau pesan untuk mahasiswa..."
              value={verifyForm.catatan_jadwal}
              onChange={(e) => setVerifyForm({ ...verifyForm, catatan_jadwal: e.target.value })}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setVerifyOpen(false)}>Batalkan</Button>
          <Button variant="contained" onClick={handleVerifySubmit} disabled={savingVerify}>
            {savingVerify ? 'Menyimpan...' : 'Verifikasi'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
