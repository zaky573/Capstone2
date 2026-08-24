import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4273B8',
      dark: '#2C5A96',
      light: '#6E94C9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F9C900',
      dark: '#C9A300',
      light: '#FADF57',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#F4F6FA',
      paper: '#FFFFFF',
    },
    warning: { main: '#F9A825' },
    success: { main: '#2E7D32' },
    info: { main: '#0288D1' },
    error: { main: '#D32F2F' },
    text: {
      primary: '#1F2A37',
      secondary: '#637083',
    },
  },
  typography: {
    fontFamily: ['Roboto', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)',
          border: '1px solid #EAEEF4',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F4F6FA',
            fontWeight: 700,
            color: '#4B5563',
          },
        },
      },
    },
  },
})

export default theme
