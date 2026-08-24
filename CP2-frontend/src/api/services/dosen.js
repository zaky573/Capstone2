import client, { USE_MOCK } from '../client'
import * as mock from '../mock'

export const getDashboard = async () => {
  if (USE_MOCK) return mock.getDosenDashboard()
  const { data } = await client.get('/dosen/dashboard')
  return data
}

export const getBimbingan = async (params) => {
  if (USE_MOCK) return mock.getBimbingan(params)
  const { data } = await client.get('/dosen/mahasiswa-bimbingan', { params })
  return data
}

export const getPerwalian = async (params) => {
  if (USE_MOCK) return mock.getDosenPerwalian(params)
  const { data } = await client.get('/dosen/perwalian', { params })
  return data
}

export const getPerwalianDetail = async (id) => {
  if (USE_MOCK) return mock.getDosenPerwalianDetail(id)
  const { data } = await client.get(`/dosen/perwalian/${id}`)
  return data
}

export const komentarPerwalian = async (id, payload) => {
  if (USE_MOCK) return mock.komentarPerwalian(id, payload)
  const { data } = await client.put(`/dosen/perwalian/${id}/komentar`, payload)
  return data
}

export const updateStatus = async (id, payload) => {
  if (USE_MOCK) return mock.updatePerwalianStatus(id, payload)
  const { data } = await client.put(`/dosen/perwalian/${id}/status`, payload)
  return data
}
