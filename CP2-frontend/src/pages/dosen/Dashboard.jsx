import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import GroupIcon from '@mui/icons-material/Group'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import VerifiedIcon from '@mui/icons-material/Verified'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
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

  return (
    <>
      <PageHeader title="Dashboard Dosen" subtitle="Pantau perwalian mahasiswa bimbingan Anda" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Perwalian Terbaru
              </Typography>
              {data.recent.length === 0 ? (
                <EmptyState title="Belum ada perwalian" subtitle="Perwalian dari mahasiswa bimbingan akan tampil di sini." />
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Mahasiswa</TableCell>
                      <TableCell>NIM</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recent.map((p) => (
                      <TableRow
                        key={p.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/dosen/perwalian/${p.id}`)}
                      >
                        <TableCell>{formatTanggalWaktu(p.created_at)}</TableCell>
                        <TableCell>{p.mahasiswa?.nama_lengkap}</TableCell>
                        <TableCell>{p.mahasiswa?.nim}</TableCell>
                        <TableCell>
                          {p.tahun_akademik} ({SEMESTER_LABEL[p.semester]})
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Mahasiswa Bimbingan</Typography>
                <Button size="small" onClick={() => navigate('/dosen/mahasiswa-bimbingan')}>
                  Lihat Semua
                </Button>
              </Stack>
              {data.mahasiswa.length === 0 ? (
                <EmptyState title="Belum ada mahasiswa bimbingan" />
              ) : (
                data.mahasiswa.slice(0, 5).map((m) => (
                  <Stack key={m.id} justifyContent="space-between" alignItems="center" sx={{ py: 1.25, borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {m.nama_lengkap}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {m.nim} · Semester {m.semester}
                      </Typography>
                    </Box>
                    <Button size="small" onClick={() => navigate('/dosen/perwalian')}>
                      Lihat Perwalian
                    </Button>
                  </Stack>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
