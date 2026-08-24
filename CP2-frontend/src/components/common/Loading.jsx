import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loading({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
}
