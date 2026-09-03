import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function EmptyState({ title = 'Belum ada data', subtitle, icon }) {
  return (
    <Stack spacing={1} sx={{ py: 6, color: 'text.secondary', alignItems: 'center' }}>
      {icon}
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  )
}
