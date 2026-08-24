import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SchoolIcon from '@mui/icons-material/School'
import { keyframes } from '@mui/system'

const float1 = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`
const float2 = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
`
const float3 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10px, -10px) scale(1.05); }
`
const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`
const orbit = keyframes`
  from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
`
const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`

export default function AuthLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* LEFT PANEL - Animated */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0B1929 0%, #122C4E 30%, #1A3A5C 60%, #2C5A96 100%)',
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 8s ease infinite`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated floating circles */}
        <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(249,201,0,0.15)', top: -80, right: -60, animation: `${float1} 6s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', bottom: 60, left: -50, animation: `${float2} 7s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(249,201,0,0.06)', top: '25%', left: '15%', animation: `${float3} 5s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(249,201,0,0.1)', bottom: '20%', right: '20%', animation: `${pulse} 4s ease-in-out infinite` }} />

        {/* Orbiting dot */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: `${orbit} 12s linear infinite` }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(249,201,0,0.6)', ml: -4, mt: -4 }} />
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: `${orbit} 16s linear infinite reverse` }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)', ml: -3, mt: -3 }} />
        </Box>

        {/* Twinkling dots */}
        {[
          { top: '12%', left: '20%', delay: '0s', size: 4 },
          { top: '18%', right: '25%', delay: '1.5s', size: 3 },
          { top: '70%', left: '30%', delay: '0.8s', size: 5 },
          { top: '80%', right: '15%', delay: '2s', size: 3 },
          { top: '45%', left: '8%', delay: '1.2s', size: 4 },
          { top: '55%', right: '10%', delay: '0.5s', size: 3 },
        ].map((dot, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              right: dot.right,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              bgcolor: '#fff',
              animation: `${twinkle} 3s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Content */}
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            position: 'relative',
            zIndex: 1,
            animation: `${slideUp} 0.8s ease-out`,
          }}
        >
          {/* Logo */}
          <SchoolIcon
            sx={{
              fontSize: 72,
              color: '#F9C900',
              filter: 'drop-shadow(0 8px 24px rgba(249,201,0,0.4))',
            }}
          />

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textAlign: 'center' }}>
              STMIK Bandung
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.6 }}>
              Sekolah Tinggi Manajemen Informatika
              <br />
              dan Komputer Bandung
            </Typography>
          </Stack>

          <Box sx={{ width: 50, height: 3, borderRadius: 2, bgcolor: '#F9C900' }} />

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.7, maxWidth: 280 }}>
            Sistem Pencatatan Perwalian Mahasiswa
          </Typography>
        </Stack>

        {/* Bottom */}
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 24, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
          Jl. Cikutra No. 113-A Bandung &middot; Telp +62 22 7207777
        </Typography>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#F8FAFD',
          position: 'relative',
          p: { xs: 3, sm: 4 },
          overflow: 'hidden',
        }}
      >
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 85% 15%, rgba(66,115,184,0.08) 0%, transparent 45%), radial-gradient(ellipse at 15% 85%, rgba(249,201,0,0.06) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(66,115,184,0.02) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top-right circle */}
        <Box
          sx={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: '2px solid rgba(66,115,184,0.08)',
            top: -120,
            right: -80,
            animation: `${float2} 8s ease-in-out infinite`,
          }}
        />
        {/* Bottom-left circle */}
        <Box
          sx={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            border: '2px solid rgba(249,201,0,0.07)',
            bottom: -80,
            left: -60,
            animation: `${float1} 10s ease-in-out infinite`,
          }}
        />
        {/* Center-right rounded square */}
        <Box
          sx={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '24px',
            border: '2px solid rgba(66,115,184,0.06)',
            bgcolor: 'rgba(66,115,184,0.03)',
            top: '12%',
            right: '8%',
            transform: 'rotate(15deg)',
            animation: `${float3} 7s ease-in-out infinite`,
          }}
        />
        {/* Bottom-right circle */}
        <Box
          sx={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(249,201,0,0.05)',
            border: '1.5px solid rgba(249,201,0,0.08)',
            bottom: '18%',
            right: '12%',
            animation: `${pulse} 6s ease-in-out infinite`,
          }}
        />
        {/* Small accent circle */}
        <Box
          sx={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'rgba(66,115,184,0.04)',
            border: '1.5px solid rgba(66,115,184,0.08)',
            top: '55%',
            left: '6%',
            animation: `${float3} 9s ease-in-out infinite`,
          }}
        />
        {/* Dots */}
        {[
          { top: '8%', left: '10%', size: 6, delay: '0s', color: 'rgba(66,115,184,0.2)' },
          { top: '20%', right: '6%', size: 5, delay: '1s', color: 'rgba(249,201,0,0.25)' },
          { top: '65%', left: '4%', size: 5, delay: '2s', color: 'rgba(66,115,184,0.2)' },
          { bottom: '12%', right: '6%', size: 6, delay: '0.5s', color: 'rgba(249,201,0,0.2)' },
          { top: '40%', left: '2%', size: 4, delay: '1.5s', color: 'rgba(66,115,184,0.15)' },
          { top: '80%', left: '15%', size: 4, delay: '0.8s', color: 'rgba(66,115,184,0.15)' },
        ].map((dot, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              right: dot.right,
              bottom: dot.bottom,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              bgcolor: dot.color,
              animation: `${twinkle} 3s ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}
        {/* Mobile logo */}
        <Stack
          alignItems="center"
          spacing={1}
          sx={{
            display: { xs: 'flex', md: 'none' },
            mb: 4,
            animation: `${slideUp} 0.6s ease-out`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <SchoolIcon sx={{ fontSize: 48, color: '#F9C900', filter: 'drop-shadow(0 4px 12px rgba(249,201,0,0.3))' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#122C4E' }}>
            STMIK Bandung
          </Typography>
        </Stack>

        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            animation: `${slideUp} 0.7s ease-out`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
