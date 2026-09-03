import { useState } from 'react'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - 260px)` },
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
