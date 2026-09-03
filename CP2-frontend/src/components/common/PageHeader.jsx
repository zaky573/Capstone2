import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ mb: { xs: 2, md: 3 }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' } }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  )
}
