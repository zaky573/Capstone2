import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import PersonIcon from '@mui/icons-material/Person'

export default function CredentialSuccessDialog({
  open,
  onClose,
  data,
}) {
  const [copiedField, setCopiedField] = useState('')

  if (!data) return null

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(''), 2000)
  }

  const handleCopyAll = () => {
    const text = `Kredensial Login STMIK Bandung
-----------------------------------
Nama     : ${data.nama || '-'}
Role     : ${data.role || '-'}
Username : ${data.username || '-'}
Password : ${data.password || '-'}
-----------------------------------
Silakan login di sistem perwalian dan ganti password Anda setelah masuk.`
    handleCopy(text, 'all')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'success.light',
              color: 'success.dark',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {data.title || 'Data Berhasil Ditambahkan!'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Akun pengguna telah berhasil dibuat otomatis.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Alert severity="info" variant="outlined" sx={{ py: 0.5 }}>
            Berikut adalah detail akun login baru. Harap berikan kredensial ini kepada yang bersangkutan.
          </Alert>

          {/* User Info Card */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Stack spacing={2}>
              {/* Nama */}
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    NAMA LENGKAP
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {data.nama}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: data.role === 'Dosen' ? 'primary.light' : 'secondary.light',
                    color: data.role === 'Dosen' ? 'primary.dark' : 'secondary.dark',
                    fontWeight: 'bold',
                  }}
                >
                  {data.role}
                </Typography>
              </Stack>

              <Box sx={{ borderBottom: '1px dashed #cbd5e1' }} />

              {/* Username Field */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <PersonIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Username ({data.role === 'Dosen' ? 'NIDN' : 'NIM'})
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" fontFamily="monospace">
                      {data.username}
                    </Typography>
                  </Box>
                </Stack>
                <Tooltip title={copiedField === 'username' ? 'Tersalin!' : 'Salin Username'}>
                  <IconButton
                    size="small"
                    color={copiedField === 'username' ? 'success' : 'primary'}
                    onClick={() => handleCopy(data.username, 'username')}
                  >
                    {copiedField === 'username' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Password Field */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <VpnKeyIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Password Default
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" fontFamily="monospace" color="primary.main">
                      {data.password}
                    </Typography>
                  </Box>
                </Stack>
                <Tooltip title={copiedField === 'password' ? 'Tersalin!' : 'Salin Password'}>
                  <IconButton
                    size="small"
                    color={copiedField === 'password' ? 'success' : 'primary'}
                    onClick={() => handleCopy(data.password, 'password')}
                  >
                    {copiedField === 'password' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          startIcon={copiedField === 'all' ? <CheckIcon /> : <ContentCopyIcon />}
          color={copiedField === 'all' ? 'success' : 'inherit'}
          onClick={handleCopyAll}
        >
          {copiedField === 'all' ? 'Semua Info Tersalin' : 'Salin Semua Info Login'}
        </Button>
        <Button variant="contained" onClick={onClose}>
          Selesai
        </Button>
      </DialogActions>
    </Dialog>
  )
}
