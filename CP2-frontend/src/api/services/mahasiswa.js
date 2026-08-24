import client, { USE_MOCK } from '../client'
import * as mock from '../mock'

export const getDashboard = async () => {
  if (USE_MOCK) return mock.getMahasiswaDashboard()
  const { data } = await client.get('/mahasiswa/dashboard')
  return data
}

export const getDosenWali = async () => {
  if (USE_MOCK) return mock.getDosenWali()
  const { data } = await client.get('/mahasiswa/dosen-wali')
  return data
}

export const getMyPerwalian = async (params) => {
  if (USE_MOCK) return mock.getMyPerwalian(params)
  const { data } = await client.get('/mahasiswa/perwalian', { params })
  return data
}

export const getMyPerwalianDetail = async (id) => {
  if (USE_MOCK) return mock.getMyPerwalianDetail(id)
  const { data } = await client.get(`/mahasiswa/perwalian/${id}`)
  return data
}

export const storePerwalian = async (payload) => {
  if (USE_MOCK) return mock.storePerwalian(payload)
  const { data } = await client.post('/mahasiswa/perwalian', payload)
  return data
}

export const updatePerwalian = async (id, payload) => {
  if (USE_MOCK) return mock.updatePerwalian(id, payload)
  const { data } = await client.put(`/mahasiswa/perwalian/${id}`, payload)
  return data
}
