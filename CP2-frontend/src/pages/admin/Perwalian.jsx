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
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EventNoteIcon from '@mui/icons-material/EventNote'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Loading from '../../components/common/Loading'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getAdminPerwalian, getAdminPerwalianDetail } from '../../api/services/admin'
import { getErrorMessage } from '../../api/client'
import { STATUS_PERWALIAN_FILTER, SEMESTER_LABEL, TA_OPTIONS } from '../../utils/constants'
import { formatTanggalWaktu } from '../../utils/formatters'

export default function AdminPerwalian() {
  const snackbar = useSnackbar()

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('')
  const [filterTa, setFilterTa] = useState('')
  const [filterOptions, setFilterOptions] = useState({ tahun_akademik: [], semester: [] })

  const [detail, setDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const taList = Array.from(new Set([...(filterOptions.tahun_akademik || []), ...TA_OPTIONS])).sort().reverse()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminPerwalian({ search, status, tahun_akademik: filterTa, page: page + 1 })
      setRows(res.data)
      setMeta(res.meta)
      if (res.filter_options) setFilterOptions(res.filter_options)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, status, filterTa, page, snackbar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openDetail = async (id) => {
    setDetailOpen(true)
    setDetail(null)
    setDetailLoading(true)
    try {
      const res = await getAdminPerwalianDetail(id)
      setDetail(res.data)
    } catch (err) {
      snackbar.error(getErrorMessage(err))
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Data Perwalian" subtitle="Seluruh catatan perwalian mahasiswa" />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 1 }} sx={{ mb: 2 }} useFlexGap>
            <TextField
              size="small"
              placeholder="Cari NIM atau nama mahasiswa..."
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
            <Select size="small" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }} displayEmpty sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              {STATUS_PERWALIAN_FILTER.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
            <Select size="small" value={filterTa} onChange={(e) => { setFilterTa(e.target.value); setPage(0) }} displayEmpty sx={{ minWidth: { xs: '100%', sm: 180 } }}>
              <MenuItem value="">Semua Tahun Akademik</MenuItem>
              {taList.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </Stack>

          {loading ? (
            <Loading />
          ) : rows.length === 0 ? (
            <EmptyState icon={<EventNoteIcon sx={{ fontSize: 48 }} />} title="Tidak ada data perwalian" />
          ) : (
            <Box className="table-responsive">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Mahasiswa</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>NIM</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Semester</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Dosen Wali</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{formatTanggalWaktu(row.created_at)}</TableCell>
                      <TableCell>{row.mahasiswa?.nama_lengkap}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.mahasiswa?.nim}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {row.tahun_akademik} ({SEMESTER_LABEL[row.semester]})
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.mahasiswa?.dosen_wali?.nama_lengkap || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => openDetail(row.id)}>
                          Detail
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

      {/* Dialog Detail Perwalian (Read-only for Admin) */}
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
              {/* Info Mahasiswa & Dosen Wali */}
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

              {/* Info Periode & Tanggal */}
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

              {/* Uraian Konsultasi */}
              <Box>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                  <DescriptionOutlinedIcon fontSize="small" sx={{ color: '#4273B8' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#122C4E' }}>
                    Uraian Konsultasi
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: 2,
                    minHeight: 80,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    fontSize: '0.875rem',
                    color: '#334155',
                  }}
                >
                  {detail.uraian || 'Tidak ada uraian konsultasi.'}
                </Box>
              </Box>

              {/* Jadwal Pertemuan (jika ada) */}
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

              {/* Catatan Dosen Wali (jika ada) */}
              {detail.catatan_dosen && (
                <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <CommentOutlinedIcon fontSize="small" sx={{ color: '#16A34A' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#122C4E' }}>
                      Catatan Dosen Wali
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 2,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      fontSize: '0.875rem',
                      color: '#166534',
                    }}
                  >
                    {detail.catatan_dosen}
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
