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
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EventNoteIcon from '@mui/icons-material/EventNote'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getPerwalian } from '../../api/services/dosen'
import { getErrorMessage } from '../../api/client'
import { STATUS_PERWALIAN_FILTER, SEMESTER_LABEL, TA_OPTIONS } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'
import { useNavigate, useLocation } from 'react-router-dom'

export default function DosenPerwalianList() {
  const navigate = useNavigate()
  const location = useLocation()
  const snackbar = useSnackbar()

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState(location.state?.filterStatus || '')
  const [filterNim, setFilterNim] = useState(location.state?.filterNim || '')
  const [filterTa, setFilterTa] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPerwalian({ search, status, nim: filterNim, tahun_akademik: filterTa, page: page + 1 })
      setRows(res.data)
      setMeta(res.meta)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, status, filterNim, filterTa, page, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <PageHeader 
        title="Data Perwalian Bimbingan" 
        subtitle={filterNim ? `Menampilkan perwalian untuk mahasiswa NIM: ${filterNim}` : "Seluruh catatan perwalian mahasiswa bimbingan Anda"}
        actions={filterNim ? <Button variant="outlined" onClick={() => { setFilterNim(''); navigate('/dosen/perwalian', { replace: true }) }}>Tampilkan Semua</Button> : null}
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Cari NIM atau nama mahasiswa..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
              sx={{ minWidth: 260 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" onClick={() => setSearch(searchInput)}>
              Cari
            </Button>
            <Select
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(0)
              }}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              {STATUS_PERWALIAN_FILTER.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              size="small"
              value={filterTa}
              onChange={(e) => {
                setFilterTa(e.target.value)
                setPage(0)
              }}
              displayEmpty
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Semua Tahun Akademik</MenuItem>
              {TA_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </Stack>

          {loading ? (
            <Loading />
          ) : rows.length === 0 ? (
            <EmptyState icon={<EventNoteIcon sx={{ fontSize: 48 }} />} title="Tidak ada data perwalian" />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Mahasiswa</TableCell>
                  <TableCell>NIM</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{formatTanggalWaktu(row.created_at)}</TableCell>
                    <TableCell>{row.mahasiswa?.nama_lengkap}</TableCell>
                    <TableCell>{row.mahasiswa?.nim}</TableCell>
                    <TableCell>
                      {row.tahun_akademik} ({SEMESTER_LABEL[row.semester]})
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => navigate(`/dosen/perwalian/${row.id}`)}>
                        Detail
                      </Button>
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
