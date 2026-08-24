import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BadgeIcon from '@mui/icons-material/Badge'
import GroupsIcon from '@mui/icons-material/Groups'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { keyframes } from '@mui/system'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../api/client'

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`
const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-15px); }
  to { opacity: 1; transform: translateX(0); }
`
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const DEMO_ACCOUNTS = [
  { label: 'Admin', username: 'admin', password: 'admin123', icon: <AdminPanelSettingsIcon fontSize="small" />, color: '#4273B8', bg: 'rgba(66,115,184,0.08)' },
  { label: 'Dosen', username: '0426018001', password: 'dosen123', icon: <BadgeIcon fontSize="small" />, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Mahasiswa', username: '211102001', password: 'mahasiswa123', icon: <GroupsIcon fontSize="small" />, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotInfo, setShowForgotInfo] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Username dan password wajib diisi.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { user } = await login(form)
      const from = location.state?.from?.pathname
      if (from) navigate(from, { replace: true })
      else navigate(`/${user.role}`, { replace: true })
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg === 'Network Error') {
        setError('Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:3001 atau gunakan akun demo.')
      } else {
        setError(msg || 'Login gagal. Periksa kembali username dan password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (account) => {
    setForm({ username: account.username, password: account.password })
    if (error) setError('')
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      {/* Card container */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          bgcolor: '#fff',
          border: '1px solid #E8EDF4',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          animation: `${scaleIn} 0.5s ease-out`,
        }}
      >
        {/* Avatar + Header */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'linear-gradient(135deg, #4273B8 0%, #2C5A96 100%)',
              boxShadow: '0 6px 20px rgba(66,115,184,0.3)',
              animation: `${slideUp} 0.5s ease-out 0.1s both`,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ textAlign: 'center', animation: `${slideUp} 0.5s ease-out 0.15s both` }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#122C4E', letterSpacing: '-0.02em' }}>
              Selamat Datang
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Masuk ke akun Anda untuk melanjutkan
            </Typography>
          </Box>
        </Stack>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2,
              animation: `${slideUp} 0.3s ease-out`,
              border: '1px solid',
              borderColor: 'error.light',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Forgot info */}
        {showForgotInfo && (
          <Alert
            severity="info"
            onClose={() => setShowForgotInfo(false)}
            sx={{
              mb: 2.5,
              borderRadius: 2,
              animation: `${slideUp} 0.3s ease-out`,
              border: '1px solid',
              borderColor: 'info.light',
            }}
          >
            Untuk mengubah password, silakan hubungi pihak <strong>Admin</strong> di bagian akademik kampus.
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {/* Username */}
            <Box sx={{ animation: `${slideRight} 0.4s ease-out 0.2s both` }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                placeholder="NIM, NIDN, atau username admin"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                autoComplete="username"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: focusedField === 'username' ? '#F8FAFF' : '#FAFBFE',
                    transition: 'all 0.3s ease',
                    '& fieldset': { borderColor: '#E2E8F0', transition: 'all 0.3s ease' },
                    '&:hover fieldset': { borderColor: '#93B3E0' },
                    '&.Mui-focused fieldset': { borderColor: '#4273B8', borderWidth: 2 },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4273B8' },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ animation: `${slideRight} 0.4s ease-out 0.3s both` }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                placeholder="Masukkan password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: focusedField === 'password' ? '#F8FAFF' : '#FAFBFE',
                    transition: 'all 0.3s ease',
                    '& fieldset': { borderColor: '#E2E8F0', transition: 'all 0.3s ease' },
                    '&:hover fieldset': { borderColor: '#93B3E0' },
                    '&.Mui-focused fieldset': { borderColor: '#4273B8', borderWidth: 2 },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4273B8' },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          sx={{ color: '#94A3B8', '&:hover': { color: '#4273B8' } }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Forgot password */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2.5, animation: `${slideRight} 0.4s ease-out 0.35s both` }}>
            <Typography
              variant="caption"
              component="button"
              type="button"
              onClick={() => setShowForgotInfo(true)}
              sx={{
                color: '#4273B8',
                textDecoration: 'none',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                fontFamily: 'inherit',
                fontSize: '0.8rem',
                transition: 'color 0.2s',
                '&:hover': { color: '#2C5A96', textDecoration: 'underline' },
              }}
            >
              Lupa Password?
            </Typography>
          </Box>

          {/* Submit button */}
          <Box sx={{ animation: `${slideRight} 0.4s ease-out 0.4s both` }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              endIcon={loading ? undefined : <ArrowForwardIcon />}
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 2,
                textTransform: 'none',
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #4273B8 0%, #2C5A96 100%)',
                boxShadow: '0 4px 16px rgba(66,115,184,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3565A0 0%, #234D82 100%)',
                  boxShadow: '0 6px 24px rgba(66,115,184,0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 2px 8px rgba(66,115,184,0.3)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Masuk'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Demo Accounts */}
      <Box
        sx={{
          mt: 3,
          mx: 2,
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #E8EDF4',
          animation: `${slideUp} 0.5s ease-out 0.5s both`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
            Akun Demo
          </Typography>
          <Divider sx={{ flex: 1, borderColor: '#E2E8F0' }} />
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {DEMO_ACCOUNTS.map((acc, i) => (
            <Chip
              key={acc.username}
              icon={<Box sx={{ color: acc.color, display: 'flex', alignItems: 'center' }}>{acc.icon}</Box>}
              label={
                <Box component="span" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                  <Box component="span" sx={{ fontSize: '0.7rem', fontWeight: 700, color: acc.color }}>{acc.label}</Box>
                  <Box component="span" sx={{ fontSize: '0.65rem', color: '#64748B' }}>{acc.username}</Box>
                </Box>
              }
              onClick={() => fillDemo(acc)}
              variant="outlined"
              size="small"
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
                borderRadius: 2,
                px: 0.5,
                height: 'auto',
                py: 0.75,
                bgcolor: acc.bg,
                borderColor: acc.color + '30',
                '&:hover': {
                  bgcolor: acc.color + '15',
                  borderColor: acc.color + '50',
                  boxShadow: `0 2px 12px ${acc.color}20`,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontSize: '0.7rem' }}>
          Klik chip untuk auto-fill kredensial
        </Typography>
      </Box>
    </Box>
  )
}
