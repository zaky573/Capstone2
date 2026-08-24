import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { getAdminPerwalianDetail, komentarAdminPerwalian } from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { SEMESTER_LABEL } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

function InfoItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
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

export default function AdminPerwalianDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [catatanAdmin, setCatatanAdmin] = useState('')
  const [savingCatatan, setSavingCatatan] = useState(false)

  useEffect(() => {
    getAdminPerwalianDetail(id)
      .then(({ data }) => {
        setData(data)
        setCatatanAdmin(data.catatan_admin || '')
      })
      .catch((err) => snackbar.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, snackbar])

  const handleSaveCatatan = async () => {
    setSavingCatatan(true)
    try {
      const res = await komentarAdminPerwalian(id, { catatan_admin: catatanAdmin })
      setData(res.data)
      snackbar.success(res.message)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setSavingCatatan(false)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      <PageHeader
        title="Detail Perwalian"
        subtitle={`Dibuat ${formatTanggalWaktu(data.created_at)} oleh ${data.mahasiswa?.nama_lengkap}`}
        actions={
          <Button variant="outlined" onClick={() => navigate('/admin/perwalian')}>
            Kembali
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
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

            {data.catatan_dosen && (
              <Card sx={{ borderLeft: '4px solid #F9C900' }}>
                <CardContent>
                  <Section label="Catatan Dosen Wali">{data.catatan_dosen}</Section>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
