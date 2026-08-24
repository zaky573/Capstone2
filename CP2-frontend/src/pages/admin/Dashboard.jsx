import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import GroupIcon from '@mui/icons-material/Group'
import BadgeIcon from '@mui/icons-material/Badge'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { getDashboard } from '../../api/services/admin'
import { formatTanggalWaktu } from '../../utils/formatters'
import { SEMESTER_LABEL } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <>
      <PageHeader title="Dashboard Admin" subtitle="Ringkasan data sistem perwalian" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Mahasiswa" value={data.total_mahasiswa} icon={<GroupIcon />} color="primary" onClick={() => navigate('/admin/mahasiswa')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Dosen" value={data.total_dosen} icon={<BadgeIcon />} color="secondary" onClick={() => navigate('/admin/dosen')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Mahasiswa Tanpa Wali"
            value={data.mahasiswa_tanpa_wali}
            icon={<PendingActionsIcon />}
            color="warning"
            onClick={() => navigate('/admin/penugasan-wali')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Perwalian" value={data.total_perwalian} icon={<EventNoteIcon />} color="success" onClick={() => navigate('/admin/perwalian')} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Perwalian Terbaru
          </Typography>
          {data.recent.length === 0 ? (
            <EmptyState title="Belum ada perwalian" />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Mahasiswa</TableCell>
                  <TableCell>NIM</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Dosen Wali</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recent.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/perwalian/${p.id}`)}
                  >
                    <TableCell>{formatTanggalWaktu(p.created_at)}</TableCell>
                    <TableCell>{p.mahasiswa?.nama_lengkap}</TableCell>
                    <TableCell>{p.mahasiswa?.nim}</TableCell>
                    <TableCell>
                      {p.tahun_akademik} ({SEMESTER_LABEL[p.semester]})
                    </TableCell>
                    <TableCell>{p.mahasiswa?.dosen_wali?.nama_lengkap || '-'}</TableCell>
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
    </>
  )
}
