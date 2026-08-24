import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 1 }}>
      <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h6">Halaman tidak ditemukan</Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Kembali ke Beranda
      </Button>
    </Box>
  )
}
