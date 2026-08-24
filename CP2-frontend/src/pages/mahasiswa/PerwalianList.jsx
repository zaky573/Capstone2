import { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputAdornment from '@mui/material/InputAdornment'
import AddIcon from '@mui/icons-material/Add'
import EditNoteIcon from '@mui/icons-material/EditNote'
import SearchIcon from '@mui/icons-material/Search'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getMyPerwalian } from '../../api/services/mahasiswa'
import { getErrorMessage } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { SEMESTER_LABEL, TA_OPTIONS } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

export default function MahasiswaPerwalianList() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [semester, setSemester] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMyPerwalian({ page: page + 1, search: searchInput, semester })
      setRows(res.data)
      setMeta(res.meta)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, searchInput, semester, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <PageHeader
        title="Histori Perwalian"
        subtitle="Riwayat pencatatan perwalian Anda"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/mahasiswa/perwalian/baru')}>
            Buat Perwalian
          </Button>
        }
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Cari uraian atau komentar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { setPage(0); fetchData() }
              }}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              size="small"
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setPage(0) }}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>Semua Tahun Akademik</em>
              </MenuItem>
              {TA_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </Stack>

          {loading ? (
            <Loading />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<EditNoteIcon sx={{ fontSize: 48 }} />}
              title="Belum ada pencatatan perwalian"
              subtitle="Klik tombol 'Buat Perwalian' untuk memulai."
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Uraian</TableCell>
                  <TableCell>Komentar Dosen</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{formatTanggalWaktu(row.created_at)}</TableCell>
                    <TableCell>
                      {row.tahun_akademik} ({SEMESTER_LABEL[row.semester]})
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Tooltip title={row.uraian} placement="top" arrow>
                        <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'default' }}>
                          {row.uraian}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      {row.komentar_dosen ? (
                        <Tooltip title={row.komentar_dosen} placement="top" arrow>
                          <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'default' }}>
                            {row.komentar_dosen}
                          </Typography>
                        </Tooltip>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {row.status === 'menunggu_verifikasi' && (
                          <Button size="small" onClick={() => navigate(`/mahasiswa/perwalian/${row.id}/edit`)}>
                            Edit
                          </Button>
                        )}
                        <Button size="small" onClick={() => navigate(`/mahasiswa/perwalian/${row.id}`)}>
                          Detail
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <TablePagination
            component="div"
            count={meta.total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
          />
        </CardContent>
      </Card>
    </>
  )
}
