import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import GroupIcon from '@mui/icons-material/Group'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import VerifiedIcon from '@mui/icons-material/Verified'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getDashboard } from '../../api/services/dosen'
import { getErrorMessage } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { SEMESTER_LABEL } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

export default function DosenDashboard() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data))
      .catch((err) => snackbar.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [snackbar])

  if (loading) return <Loading />
  if (!data) return <EmptyState title="Data tidak ditemukan" subtitle="Silakan hubungi admin." />

  return (
    <>
      <PageHeader
        title="Dashboard Dosen"
        subtitle="Pantau perwalian mahasiswa bimbingan Anda"
      />

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Mahasiswa Bimbingan" value={data.jumlah_mahasiswa} icon={<GroupIcon />} color="primary" onClick={() => navigate('/dosen/mahasiswa-bimbingan')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Menunggu Verifikasi"
            value={data.menunggu_verifikasi}
            icon={<PendingActionsIcon />}
            color="warning"
            onClick={() => navigate('/dosen/perwalian', { state: { filterStatus: 'menunggu_verifikasi' } })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Diverifikasi" value={data.diverifikasi} icon={<VerifiedIcon />} color="success" onClick={() => navigate('/dosen/perwalian', { state: { filterStatus: 'diverifikasi' } })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Selesai" value={data.selesai} icon={<TaskAltIcon />} color="info" onClick={() => navigate('/dosen/perwalian', { state: { filterStatus: 'selesai' } })} />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 20, color: '#4273B8' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                    Perwalian Terbaru
                  </Typography>
                </Stack>
                {data.recent.length > 0 && (
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/dosen/perwalian')}
                    sx={{ fontSize: '0.8rem', textTransform: 'none' }}
                  >
                    Lihat Semua
                  </Button>
                )}
              </Stack>

              {data.recent.length === 0 ? (
                <Box sx={{ py: 4 }}>
                  <EmptyState
                    title="Belum ada perwalian"
                    subtitle="Perwalian dari mahasiswa bimbingan akan tampil di sini."
                    icon={<AssignmentIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />}
                  />
                </Box>
              ) : (
                <Stack spacing={0}>
                  {data.recent.map((p, idx) => (
                    <Box
                      key={p.id}
                      onClick={() => navigate(`/dosen/perwalian/${p.id}`)}
                      sx={{
                        py: 1.75,
                        px: 1.5,
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { bgcolor: '#F8FAFC' },
                        ...(idx < data.recent.length - 1 && { borderBottom: '1px solid #F1F5F9' }),
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#4273B8', color: '#fff' }}>
                              {(p.mahasiswa?.nama_lengkap || '?').charAt(0)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                              {p.mahasiswa?.nama_lengkap}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 4.5, display: 'block' }}>
                            {p.mahasiswa?.nim} · {p.tahun_akademik} ({SEMESTER_LABEL[p.semester]})
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <StatusBadge status={p.status} />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {formatTanggalWaktu(p.created_at)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 20, color: '#059669' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                    Mahasiswa Bimbingan
                  </Typography>
                </Stack>
                {data.mahasiswa.length > 0 && (
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/dosen/mahasiswa-bimbingan')}
                    sx={{ fontSize: '0.8rem', textTransform: 'none' }}
                  >
                    Lihat Semua
                  </Button>
                )}
              </Stack>

              {data.mahasiswa.length === 0 ? (
                <Box sx={{ py: 4 }}>
                  <EmptyState
                    title="Belum ada mahasiswa bimbingan"
                    subtitle="Mahasiswa akan muncul setelah ditugaskan oleh admin."
                    icon={<PeopleIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />}
                  />
                </Box>
              ) : (
                <Stack spacing={0}>
                  {data.mahasiswa.slice(0, 6).map((m, idx) => (
                    <Box
                      key={m.id}
                      sx={{
                        py: 1.5,
                        px: 1.5,
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { bgcolor: '#F8FAFC' },
                        ...(idx < Math.min(data.mahasiswa.length, 6) - 1 && { borderBottom: '1px solid #F1F5F9' }),
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}>
                          <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#E0E7FF', color: '#4273B8', fontWeight: 600 }}>
                            {(m.nama_lengkap || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.nama_lengkap}
                            </Typography>
                            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mt: 0.25 }}>
                              <Typography variant="caption" color="text.secondary">
                                {m.nim}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">·</Typography>
                              <Chip label={`Sem ${m.semester}`} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }} />
                            </Stack>
                          </Box>
                        </Stack>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate('/dosen/perwalian')}
                          sx={{ fontSize: '0.72rem', textTransform: 'none', minWidth: 0, px: 1.5, flexShrink: 0 }}
                        >
                          Perwalian
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
