import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK || 'true') === 'true'

const client = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') =>
  error?.response?.data?.message || error?.message || fallback

export default client
