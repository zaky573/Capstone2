import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

export default function StatCard({ title, value, icon, color = 'primary', onClick }) {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? { transform: 'translateY(-2px)', boxShadow: 4, borderColor: `${color}.main`, borderWidth: 1, borderStyle: 'solid' }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
            }}
            variant="rounded"
          >
            {icon}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
