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
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
          Sistem Pencatatan Perwalian Mahasiswa
        </Typography>
        <Typography variant="body2" sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 600 }}>
          STMIK Bandung
        </Typography>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ gap: 1, textTransform: 'none' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Avatar src={user?.profile?.foto || user?.foto || undefined} sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>{initials}</Avatar>
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
