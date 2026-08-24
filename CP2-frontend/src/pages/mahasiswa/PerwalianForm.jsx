import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import PageHeader from '../../components/common/PageHeader'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getMyPerwalianDetail, storePerwalian, updatePerwalian } from '../../api/services/mahasiswa'
import { getErrorMessage } from '../../api/client'
import { SEMESTER_OPTIONS, SEMESTER_LABEL, TA_OPTIONS } from '../../utils/constants'

const emptyForm = {
  tahun_akademik: '',
  semester: '',
  uraian: '',
}

export default function MahasiswaPerwalianForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getMyPerwalianDetail(id)
      .then(({ data }) => {
        setForm({
          tahun_akademik: data.tahun_akademik,
          semester: data.semester,
          uraian: data.uraian,
        })
      })
      .catch((err) => snackbar.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit, snackbar])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.tahun_akademik || !form.semester || !form.uraian.trim()) {
      setError('Tahun akademik, semester, dan uraian konsultasi wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const res = await updatePerwalian(id, form)
        snackbar.success(res.message)
      } else {
        const res = await storePerwalian(form)
        snackbar.success(res.message)
      }
      navigate('/mahasiswa/perwalian')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 10 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Pencatatan Perwalian' : 'Buat Pencatatan Perwalian'}
        subtitle="Isi data konsultasi Anda untuk diverifikasi dosen wali"
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Tahun Akademik *"
                  name="tahun_akademik"
                  value={form.tahun_akademik}
                  onChange={handleChange}
                  fullWidth
                >
                  {TA_OPTIONS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Semester *"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  fullWidth
                >
                  {SEMESTER_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {SEMESTER_LABEL[s]}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <TextField
                label="Uraian Konsultasi *"
                name="uraian"
                value={form.uraian}
                onChange={handleChange}
                multiline
                minRows={3}
                fullWidth
                placeholder="Jelaskan tujuan konsultasi dan hal yang dibahas."
              />
              {isEdit && (
                <Typography variant="caption" color="text.secondary">
                  Perwalian dengan status selain &quot;Menunggu Verifikasi&quot; tidak dapat diedit.
                </Typography>
              )}
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => navigate('/mahasiswa/perwalian')} color="inherit">
              Batal
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Perwalian'}
            </Button>
          </CardActions>
        </form>
      </Card>
    </>
  )
}
