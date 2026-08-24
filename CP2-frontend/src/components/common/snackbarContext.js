import { createContext, useContext } from 'react'

export const SnackbarContext = createContext(null)

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar harus dipakai di dalam SnackbarProvider')
  return ctx
}
