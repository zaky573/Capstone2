import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import EditNoteIcon from '@mui/icons-material/EditNote'
import HistoryIcon from '@mui/icons-material/History'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import SchoolIcon from '@mui/icons-material/School'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BadgeIcon from '@mui/icons-material/Badge'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getDashboard } from '../../api/services/mahasiswa'
import { getErrorMessage } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { SEMESTER_LABEL } from '../../utils/constants'
import { formatTanggal } from '../../utils/formatters'

export default function MahasiswaDashboard() {
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

  const { mahasiswa, dosen_wali, perwalian_terakhir } = data
  const inisial = (mahasiswa.nama_lengkap || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const inisialDosen = dosen_wali?.nama_lengkap?.charAt(0)?.toUpperCase() || 'D'

  const completionRate = data.total_perwalian > 0
    ? Math.round(((data.total_perwalian - data.menunggu_verifikasi) / data.total_perwalian) * 100)
    : 0

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang di Sistem Pencatatan Perwalian STMIK Bandung"
        actions={
          <Button
            variant="contained"
            size="large"
            startIcon={<EditNoteIcon />}
            onClick={() => navigate('/mahasiswa/perwalian/baru')}
            sx={{ fontWeight: 700, px: 3, borderRadius: 2, boxShadow: '0 4px 14px rgba(25,118,210,0.35)' }}
          >
            Buat Perwalian Baru
          </Button>
        }
      />

      {/* Hero Profil Card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #122C4E 0%, #1e4a7a 50%, #2563a8 100%)',
          color: '#fff',
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: 60, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Avatar
              sx={{
                width: 88,
                height: 88,
                bgcolor: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.3)',
                fontSize: 32,
                fontWeight: 700,
                color: '#fff',
                backdropFilter: 'blur(10px)',
              }}
            >
              {mahasiswa.foto ? (
                <img src={mahasiswa.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : inisial}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                {mahasiswa.nama_lengkap}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                <Chip
                  icon={<BadgeIcon sx={{ color: 'rgba(255,255,255,0.8) !important', fontSize: '14px !important' }} />}
                  label={`NIM: ${mahasiswa.nim}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)' }}
                />
                <Chip
                  icon={<SchoolIcon sx={{ color: 'rgba(255,255,255,0.8) !important', fontSize: '14px !important' }} />}
                  label={mahasiswa.program_studi}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(10px)' }}
                />
                <Chip
                  icon={<CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.8) !important', fontSize: '14px !important' }} />}
                  label={`Angkatan ${mahasiswa.angkatan} · Semester ${mahasiswa.semester}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(10px)' }}
                />
              </Stack>

              {/* Progress Bar */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ flex: 1, maxWidth: 240 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                    Progress Perwalian
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': { bgcolor: '#4ade80', borderRadius: 3 },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 700, fontSize: '13px' }}>
                  {completionRate}%
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5, border: '1px solid #E8F0FE', background: 'linear-gradient(135deg, #EEF2FF 0%, #fff 100%)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Total Perwalian</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#4273B8', lineHeight: 1 }}>{data.total_perwalian}</Typography>
                </Box>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#4273B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HistoryIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                Seluruh riwayat perwalian
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5, border: '1px solid #FEF3C7', background: 'linear-gradient(135deg, #FFF8E1 0%, #fff 100%)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Menunggu Verifikasi</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#D97706', lineHeight: 1 }}>{data.menunggu_verifikasi}</Typography>
                </Box>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PendingActionsIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                Perlu tindak lanjut dosen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5, border: '1px solid #D1FAE5', background: 'linear-gradient(135deg, #ECFDF5 0%, #fff 100%)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Selesai</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                    {data.total_perwalian - data.menunggu_verifikasi}
                  </Typography>
                </Box>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircleIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                Sudah diproses dosen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5, border: '1px solid #EDE9FE', background: 'linear-gradient(135deg, #F5F3FF 0%, #fff 100%)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Semester Aktif</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#7C3AED', lineHeight: 1 }}>{mahasiswa.semester}</Typography>
                </Box>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AutoStoriesIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                Angkatan {mahasiswa.angkatan}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={2}>
        {/* Perwalian Terakhir */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HistoryIcon sx={{ fontSize: 20, color: '#4273B8' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#122C4E' }}>Perwalian Terakhir</Typography>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/mahasiswa/perwalian')}
                  sx={{ fontWeight: 600, ml: 'auto' }}
                >
                  Lihat Semua
                </Button>
              </Box>

              {perwalian_terakhir ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid #E2E8F0',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #fff 100%)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#4273B8', boxShadow: '0 2px 12px rgba(66,115,184,0.12)' },
                  }}
                  onClick={() => navigate(`/mahasiswa/perwalian/${perwalian_terakhir.id}`)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2, gap: 1 }}>
                    <Chip
                      label={`${perwalian_terakhir.tahun_akademik} · ${SEMESTER_LABEL[perwalian_terakhir.semester]}`}
                      size="small"
                      sx={{ bgcolor: '#EEF2FF', color: '#4273B8', fontWeight: 600 }}
                    />
                    <StatusBadge status={perwalian_terakhir.status} />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#374151',
                      lineHeight: 1.7,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1.5,
                    }}
                  >
                    {perwalian_terakhir.uraian}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatTanggal(perwalian_terakhir.created_at)}
                    </Typography>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                      Klik untuk detail →
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <EmptyState
                  title="Belum ada perwalian"
                  subtitle="Mulai pencatatan perwalian Anda dengan menekan tombol 'Buat Perwalian Baru'."
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profil Dosen Wali Anda */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 2.5, border: '1px solid #FEF3C7' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PersonIcon sx={{ fontSize: 20, color: '#D97706' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#122C4E' }}>Profil Dosen Wali Anda</Typography>
              </Stack>

              {dosen_wali ? (
                <Stack spacing={2.5}>
                  {/* Avatar + Nama */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #FFF8E1 0%, #FFFDE7 100%)',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: '#122C4E',
                          fontSize: 24,
                          fontWeight: 700,
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(18,44,78,0.25)',
                          flexShrink: 0,
                        }}
                      >
                        {dosen_wali.foto ? (
                          <img src={dosen_wali.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : inisialDosen}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#122C4E', lineHeight: 1.3 }}>
                          {dosen_wali.nama_lengkap}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                          <Chip
                            label={`NIDN: ${dosen_wali.nidn}`}
                            size="small"
                            sx={{ bgcolor: 'rgba(18,44,78,0.1)', color: '#122C4E', fontWeight: 600, fontSize: '0.75rem' }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Kontak Info */}
                  <Stack spacing={1.8} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    {/* Email */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <EmailIcon sx={{ fontSize: 17, color: '#4273B8' }} />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>Email Dosen</Typography>
                        <Typography
                          component="a"
                          href={`mailto:${dosen_wali.email || 'dosen@stmikbandung.ac.id'}`}
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#4273B8',
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {dosen_wali.email || 'dosen@stmikbandung.ac.id'}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* No Telepon / WA */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PhoneIcon sx={{ fontSize: 17, color: '#059669' }} />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>No. WhatsApp / Telepon</Typography>
                        <Typography
                          component="a"
                          href={`tel:${dosen_wali.no_hp || '081234567890'}`}
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#059669',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {dosen_wali.no_hp || '081234567890'}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Alamat / Ruangan */}
                    {dosen_wali.alamat && (
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#FFF8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.3 }}>
                          <LocationOnIcon sx={{ fontSize: 17, color: '#D97706' }} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>Alamat / Ruangan</Typography>
                          <Typography variant="body2" color="text.secondary">{dosen_wali.alamat}</Typography>
                        </Box>
                      </Stack>
                    )}
                  </Stack>

                  {/* Tombol Hubungi */}
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      component="a"
                      href={`mailto:${dosen_wali.email || 'dosen@stmikbandung.ac.id'}`}
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                      fullWidth
                      sx={{ borderRadius: 1.5, fontSize: '0.82rem', textTransform: 'none', py: 0.8 }}
                    >
                      Kirim Email
                    </Button>
                    {dosen_wali.no_hp && (
                      <Button
                        component="a"
                        href={`https://wa.me/${String(dosen_wali.no_hp).replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        startIcon={<PhoneIcon />}
                        fullWidth
                        sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, borderRadius: 1.5, fontSize: '0.82rem', textTransform: 'none', py: 0.8 }}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Typography color="text.secondary">Dosen wali belum ditugaskan. Hubungi admin untuk informasi lebih lanjut.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
