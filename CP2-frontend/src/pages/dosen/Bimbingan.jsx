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
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import GroupIcon from '@mui/icons-material/Group'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getBimbingan } from '../../api/services/dosen'
import { getErrorMessage } from '../../api/client'
import { useNavigate } from 'react-router-dom'

export default function DosenBimbingan() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getBimbingan({ search, page: page + 1 })
      setRows(res.data)
      setMeta(res.meta)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, page, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <PageHeader title="Mahasiswa Bimbingan" subtitle={`Total ${meta.total} mahasiswa bimbingan`} />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 1 }} sx={{ mb: 2 }} useFlexGap>
            <TextField
              size="small"
              placeholder="Cari NIM atau nama..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
              sx={{ flex: 1, minWidth: 0 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="outlined" onClick={() => setSearch(searchInput)}>
              Cari
            </Button>
          </Stack>

          {loading ? (
            <Loading />
          ) : rows.length === 0 ? (
            <EmptyState icon={<GroupIcon sx={{ fontSize: 48 }} />} title="Belum ada mahasiswa bimbingan" />
          ) : (
            <Box className="table-responsive">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>NIM</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Prodi</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Semester</TableCell>
                  <TableCell align="center">Total Perwalian</TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Menunggu</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.nim}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.nama_lengkap}</Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.program_studi}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.semester}</TableCell>
                    <TableCell align="center">{row.jumlah_perwalian}</TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {row.perwalian_menunggu > 0 ? (
                        <Typography color="warning.main" sx={{ fontWeight: 700 }}>
                          {row.perwalian_menunggu}
                        </Typography>
                      ) : (
                        row.perwalian_menunggu
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => navigate('/dosen/perwalian', { state: { filterNim: row.nim } })}>
                        Lihat Perwalian
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Box>
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
