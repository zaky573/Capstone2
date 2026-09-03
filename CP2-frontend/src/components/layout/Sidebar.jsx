import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import SchoolIcon from '@mui/icons-material/School'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import BadgeIcon from '@mui/icons-material/Badge'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AssessmentIcon from '@mui/icons-material/Assessment'
import EditNoteIcon from '@mui/icons-material/EditNote'
import LogoutIcon from '@mui/icons-material/Logout'
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { SIDEBAR_BG, BRAND_GOLD } from '../../utils/constants'

const MENUS = {
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Mahasiswa', to: '/admin/mahasiswa', icon: <GroupIcon /> },
    { label: 'Dosen', to: '/admin/dosen', icon: <BadgeIcon /> },
    { label: 'Penugasan Wali', to: '/admin/penugasan-wali', icon: <SupervisorAccountIcon /> },
    { label: 'Perwalian', to: '/admin/perwalian', icon: <EventNoteIcon /> },
    { label: 'Rekap Data', to: '/admin/rekap', icon: <AssessmentIcon /> },
  ],
  mahasiswa: [
    { label: 'Dashboard', to: '/mahasiswa/dashboard', icon: <DashboardIcon /> },
    { label: 'Histori Perwalian', to: '/mahasiswa/perwalian', icon: <EditNoteIcon /> },
  ],
  dosen: [
    { label: 'Dashboard', to: '/dosen/dashboard', icon: <DashboardIcon /> },
    { label: 'Mahasiswa Bimbingan', to: '/dosen/mahasiswa-bimbingan', icon: <GroupIcon /> },
    { label: 'Data Perwalian', to: '/dosen/perwalian', icon: <EventNoteIcon /> },
  ],
}

const DRAWER_WIDTH = 260

function SidebarContent({ onNavigate, collapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const menus = MENUS[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: SIDEBAR_BG, color: '#fff' }}>
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 64, sm: 64 }, px: collapsed ? 1.5 : 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: BRAND_GOLD,
            flexShrink: 0,
          }}
        >
          <SchoolIcon sx={{ fontSize: 26, color: '#122C4E' }} />
        </Box>
        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              STMIK Bandung
            </Typography>
            <Typography variant="caption" sx={{ color: '#AFC3DB', whiteSpace: 'nowrap' }}>
              Sistem Perwalian
            </Typography>
          </Box>
        )}
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ flexGrow: 1, pt: 1, px: collapsed ? 0.5 : 0 }}>
        {menus.map((menu) => (
          <ListItemButton
            key={menu.to}
            component={RouterNavLink}
            to={menu.to}
            onClick={onNavigate}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              mx: collapsed ? 0.5 : 1,
              px: collapsed ? 0 : undefined,
              justifyContent: collapsed ? 'center' : 'flex-start',
              minHeight: 44,
              color: '#C9D8EA',
              '&.active': {
                bgcolor: '#4273B8',
                color: '#fff',
                fontWeight: 600,
              },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
              {menu.icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={menu.label} slotProps={{ primary: { sx: { fontSize: 14, whiteSpace: 'nowrap' } } }} />}
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ px: collapsed ? 0.5 : 0 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: '#F1A8A8',
            borderRadius: 1.5,
            mx: collapsed ? 0.5 : 1,
            px: collapsed ? 0 : undefined,
            justifyContent: collapsed ? 'center' : 'flex-start',
            minHeight: 44,
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Keluar" slotProps={{ primary: { sx: { fontSize: 14 } } }} />}
        </ListItemButton>
      </List>
    </Box>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  )
}
