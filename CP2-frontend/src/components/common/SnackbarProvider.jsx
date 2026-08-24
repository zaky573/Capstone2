import { useCallback, useMemo, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { SnackbarContext } from './snackbarContext'

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const show = useCallback((msg, sev = 'success') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }, [])

  const success = useCallback((msg) => show(msg, 'success'), [show])
  const error = useCallback((msg) => show(msg, 'error'), [show])
  const info = useCallback((msg) => show(msg, 'info'), [show])

  const value = useMemo(() => ({ show, success, error, info }), [show, success, error, info])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
