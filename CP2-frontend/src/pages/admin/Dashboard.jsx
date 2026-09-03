import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import GroupIcon from '@mui/icons-material/Group'
import BadgeIcon from '@mui/icons-material/Badge'
import EventNoteIcon from '@mui/icons-material/EventNote'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { getDashboard, getAdminPerwalianDetail } from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { formatTanggalWaktu } from '../../utils/formatters'
import { SEMESTER_LABEL } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [detail, setDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  const openDetail = async (id) => {
    setDetailOpen(true)
    setDetail(null)
    setDetailLoading(true)
    try {
      const res = await getAdminPerwalianDetail(id)
      setDetail(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      <PageHeader title="Dashboard Admin" subtitle="Ringkasan data sistem perwalian" />

      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <StatCard title="Total Mahasiswa" value={data.total_mahasiswa} icon={<GroupIcon />} color="primary" onClick={() => navigate('/admin/mahasiswa')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <StatCard title="Total Dosen" value={data.total_dosen} icon={<BadgeIcon />} color="secondary" onClick={() => navigate('/admin/dosen')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <StatCard title="Total Perwalian" value={data.total_perwalian} icon={<EventNoteIcon />} color="success" onClick={() => navigate('/admin/perwalian')} />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Perwalian Terbaru
          </Typography>
          {data.recent.length === 0 ? (
            <EmptyState title="Belum ada perwalian" />
          ) : (
            <Box className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
                <thead>
                  <tr>
                    {['Tanggal', 'Mahasiswa', 'NIM', 'Semester', 'Dosen Wali', 'Status'].map((h) => (
                      <th
                        key={h}
                        style={{
                          background: '#F4F6FA',
                          fontWeight: 700,
                          color: '#4B5563',
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '0.8rem',
                          borderBottom: '1px solid #EAEEF4',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((p) => (
                    <tr
                      key={p.id}
                      style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                      onClick={() => openDetail(p.id)}
                    >
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {formatTanggalWaktu(p.created_at)}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem' }}>
                        {p.mahasiswa?.nama_lengkap}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {p.mahasiswa?.nim}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {p.tahun_akademik} ({SEMESTER_LABEL[p.semester]})
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem' }}>
                        {p.mahasiswa?.dosen_wali?.nama_lengkap || '-'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem' }}>
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog Detail Perwalian */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1.5, borderBottom: '1px solid #E2E8F0' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#122C4E' }}>
              Detail Perwalian
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {detail && <StatusBadge status={detail.status} />}
              <IconButton size="small" onClick={() => setDetailOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5 }}>
          {detailLoading || !detail ? (
            <Loading />
          ) : (
            <Stack spacing={2.5}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#EEF2FF', color: '#4273B8' }}>
                        <PersonIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Mahasiswa</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {detail.mahasiswa?.nama_lengkap}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          NIM: {detail.mahasiswa?.nim} &bull; {detail.mahasiswa?.program_studi} (Smt {detail.mahasiswa?.semester})
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#F0FDF4', color: '#16A34A' }}>
                        <SchoolIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Dosen Wali</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {detail.mahasiswa?.dosen_wali?.nama_lengkap || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          NIDN: {detail.mahasiswa?.dosen_wali?.nidn || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1.5, border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Periode Akademik</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#122C4E', mt: 0.25 }}>
                      {detail.tahun_akademik} ({SEMESTER_LABEL[detail.semester] || detail.semester})
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1.5, border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Tanggal Pengajuan</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.25 }}>
                      {formatTanggalWaktu(detail.created_at)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 1.5, border: '1px solid #E2E8F0', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Status Verifikasi</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: detail.verified_at ? '#16A34A' : '#64748B', mt: 0.25 }}>
                      {detail.verified_at ? formatTanggalWaktu(detail.verified_at) : 'Belum diverifikasi'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                  <DescriptionOutlinedIcon fontSize="small" sx={{ color: '#4273B8' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#122C4E' }}>
                    Uraian Konsultasi
                  </Typography>
                </Stack>
                <Box sx={{ p: 2, bgcolor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 2, minHeight: 80, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem', color: '#334155' }}>
                  {detail.uraian || 'Tidak ada uraian konsultasi.'}
                </Box>
              </Box>

              {detail.tanggal_ketemu && (
                <Box sx={{ p: 2, bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#B45309', mb: 1 }}>
                    Jadwal Pertemuan
                  </Typography>
                  <Grid container spacing={1.5}>
                    {detail.lokasi_pertemuan && (
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <PlaceIcon fontSize="small" sx={{ color: '#B45309' }} />
                          <Typography variant="body2">{detail.lokasi_pertemuan}</Typography>
                        </Stack>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <CalendarMonthIcon fontSize="small" sx={{ color: '#B45309' }} />
                        <Typography variant="body2">{detail.tanggal_ketemu}</Typography>
                      </Stack>
                    </Grid>
                    {detail.jam_ketemu && (
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ color: '#B45309' }} />
                          <Typography variant="body2">{detail.jam_ketemu}</Typography>
                        </Stack>
                      </Grid>
                    )}
                    {detail.catatan_jadwal && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">
                          Catatan Jadwal: {detail.catatan_jadwal}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {detail.komentar_dosen && (
                <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <CommentOutlinedIcon fontSize="small" sx={{ color: '#16A34A' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#122C4E' }}>
                      Catatan Dosen Wali
                    </Typography>
                  </Stack>
                  <Box sx={{ p: 2, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem', color: '#166534' }}>
                    {detail.komentar_dosen}
                  </Box>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setDetailOpen(false)} variant="contained" sx={{ bgcolor: '#122C4E', '&:hover': { bgcolor: '#0D213B' } }}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
