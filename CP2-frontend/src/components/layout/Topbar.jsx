import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_LABEL } from '../../utils/constants'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = Boolean(anchorEl)
  const profilePath = `/${user?.role}/profil`

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login')
  }

  const initials = (user?.name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid #EAEEF4', bgcolor: '#FFFFFF' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' },
              fontSize: { sm: '0.875rem', md: '1rem' },
            }}
          >
            Sistem Pencatatan Perwalian Mahasiswa
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'block', sm: 'none' },
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            STMIK Bandung
          </Typography>
        </Box>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ gap: { xs: 0, sm: 1 }, textTransform: 'none', p: { xs: 0.5, sm: 1 } }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              display: { xs: 'none', md: 'block' },
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name}
          </Typography>
          <Avatar
            src={user?.profile?.foto || user?.foto || undefined}
            sx={{
              width: { xs: 32, sm: 34 },
              height: { xs: 32, sm: 34 },
              bgcolor: 'primary.main',
              fontSize: { xs: 12, sm: 14 },
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ROLE_LABEL[user?.role]}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate(profilePath) }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profil & Password
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Keluar
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
