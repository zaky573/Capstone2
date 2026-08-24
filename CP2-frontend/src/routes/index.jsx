import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import Loading from '../components/common/Loading'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'
import Login from '../pages/auth/Login'
import NotFound from '../pages/NotFound'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminMahasiswa from '../pages/admin/Mahasiswa'
import AdminDosen from '../pages/admin/Dosen'
import AdminPenugasan from '../pages/admin/PenugasanWali'
import AdminPerwalian from '../pages/admin/Perwalian'
import AdminPerwalianDetail from '../pages/admin/PerwalianDetail'
import AdminRekap from '../pages/admin/Rekap'

import MahasiswaDashboard from '../pages/mahasiswa/Dashboard'
import MahasiswaPerwalianList from '../pages/mahasiswa/PerwalianList'
import MahasiswaPerwalianForm from '../pages/mahasiswa/PerwalianForm'
import MahasiswaPerwalianDetail from '../pages/mahasiswa/PerwalianDetail'

import DosenDashboard from '../pages/dosen/Dashboard'
import DosenBimbingan from '../pages/dosen/Bimbingan'
import DosenPerwalianList from '../pages/dosen/PerwalianList'
import DosenPerwalianDetail from '../pages/dosen/PerwalianDetail'

import Profile from '../pages/shared/Profile'

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <Loading fullScreen />
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role}`} replace />
}

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="mahasiswa" element={<AdminMahasiswa />} />
      <Route path="dosen" element={<AdminDosen />} />
      <Route path="penugasan-wali" element={<AdminPenugasan />} />
      <Route path="perwalian" element={<AdminPerwalian />} />
      <Route path="perwalian/:id" element={<AdminPerwalianDetail />} />
      <Route path="rekap" element={<AdminRekap />} />
      <Route path="profil" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function MahasiswaRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<MahasiswaDashboard />} />
      <Route path="perwalian" element={<MahasiswaPerwalianList />} />
      <Route path="perwalian/baru" element={<MahasiswaPerwalianForm />} />
      <Route path="perwalian/:id/edit" element={<MahasiswaPerwalianForm />} />
      <Route path="perwalian/:id" element={<MahasiswaPerwalianDetail />} />
      <Route path="profil" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function DosenRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DosenDashboard />} />
      <Route path="mahasiswa-bimbingan" element={<DosenBimbingan />} />
      <Route path="perwalian" element={<DosenPerwalianList />} />
      <Route path="perwalian/:id" element={<DosenPerwalianDetail />} />
      <Route path="profil" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/admin/*" element={<RoleRoute role="admin"><AdminRoutes /></RoleRoute>} />
        <Route path="/mahasiswa/*" element={<RoleRoute role="mahasiswa"><MahasiswaRoutes /></RoleRoute>} />
        <Route path="/dosen/*" element={<RoleRoute role="dosen"><DosenRoutes /></RoleRoute>} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
