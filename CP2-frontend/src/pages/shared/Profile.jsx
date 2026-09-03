import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import PageHeader from '../../components/common/PageHeader'
import { useSnackbar } from '../../components/common/snackbarContext'
import { getProfile, updateProfile, changePassword } from '../../api/services/profile'
import { getErrorMessage } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_LABEL } from '../../utils/constants'

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const snackbar = useSnackbar()

  const [tab, setTab] = useState(0)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', no_hp: '', alamat: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)

  const [pw, setPw] = useState({ password_lama: '', password_baru: '', password_konfirmasi: '' })
  const [savingPw, setSavingPw] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setProfile(data.user)
        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          no_hp: data.user.profile?.no_hp || '',
          alamat: data.user.profile?.alamat || '',
        })
        setPhotoPreview(data.user.profile?.foto || null)
      })
      .catch((err) => snackbar.error(getErrorMessage(err)))
  }, [snackbar])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      snackbar.error('Ukuran foto maksimal 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      setFormError('Nama wajib diisi.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = { name: form.name, email: form.email, no_hp: form.no_hp, alamat: form.alamat, foto: photoPreview }
      const res = await updateProfile(payload)
      updateUser(res.data.user)
      setProfile(res.data.user)
      snackbar.success(res.message)
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (!pw.password_lama || !pw.password_baru || !pw.password_konfirmasi) {
      setPwError('Semua kolom wajib diisi.')
      return
    }
    if (pw.password_baru !== pw.password_konfirmasi) {
      setPwError('Konfirmasi password tidak sama.')
      return
    }
    setSavingPw(true)
    setPwError('')
    try {
      const res = await changePassword({ password_lama: pw.password_lama, password_baru: pw.password_baru })
      snackbar.success(res.message)
      setPw({ password_lama: '', password_baru: '', password_konfirmasi: '' })
    } catch (err) {
      setPwError(getErrorMessage(err))
    } finally {
      setSavingPw(false)
    }
  }

  const isMahasiswa = user?.role === 'mahasiswa'
  const isDosen = user?.role === 'dosen'
  const profileData = profile?.profile

  return (
    <>
      <PageHeader title="Profil" subtitle="Kelola informasi akun Anda" />

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar sx={{ width: 80, height: 80, fontSize: 32, bgcolor: '#4273B8' }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  form.name?.charAt(0)?.toUpperCase() || '?'
                )}
              </Avatar>
              <IconButton
                size="small"
                sx={{ position: 'absolute', bottom: -4, right: -4, bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#f0f0f0' } }}
                component="label"
              >
                <CameraAltIcon fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {ROLE_LABEL[user?.role]} · {user?.username}
              </Typography>
              {profileData && profileData.program_studi && (
                <Typography variant="body2" color="text.secondary">
                  {profileData.program_studi} · Semester {profileData.semester || '-'}
                </Typography>
              )}
            </Box>
          </Stack>

          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Data Diri" />
            <Tab label="Ganti Password" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Stack spacing={2} sx={{ maxWidth: { xs: '100%', sm: 560 } }}>
              {formError && <Alert severity="error">{formError}</Alert>}

              {isMahasiswa && profileData && (
                <Typography variant="body2" color="text.secondary">
                  NIM: {profileData.nim} · Angkatan {profileData.angkatan}
                </Typography>
              )}
              {isDosen && profileData && (
                <Typography variant="body2" color="text.secondary">
                  NIDN: {profileData.nidn}
                </Typography>
              )}

              <TextField label="Nama Lengkap *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
              <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
              <TextField label="No. HP" value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} fullWidth />
              <TextField
                label="Alamat"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />
              <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
            </Stack>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Stack spacing={2} sx={{ maxWidth: { xs: '100%', sm: 420 } }}>
              {pwError && <Alert severity="error">{pwError}</Alert>}
              <TextField
                label="Password Lama"
                type="password"
                value={pw.password_lama}
                onChange={(e) => setPw({ ...pw, password_lama: e.target.value })}
                fullWidth
              />
              <TextField
                label="Password Baru (min. 8 karakter)"
                type="password"
                value={pw.password_baru}
                onChange={(e) => setPw({ ...pw, password_baru: e.target.value })}
                fullWidth
              />
              <TextField
                label="Konfirmasi Password Baru"
                type="password"
                value={pw.password_konfirmasi}
                onChange={(e) => setPw({ ...pw, password_konfirmasi: e.target.value })}
                fullWidth
              />
              <Button variant="contained" sx={{ alignSelf: 'flex-start' }} onClick={handleSavePassword} disabled={savingPw}>
                {savingPw ? 'Menyimpan...' : 'Ganti Password'}
              </Button>
            </Stack>
          </TabPanel>
        </CardContent>
      </Card>
    </>
  )
}
