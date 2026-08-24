import client, { USE_MOCK } from '../client'
import * as mock from '../mock'

export const getProfile = async () => {
  if (USE_MOCK) return mock.getProfile()
  const { data } = await client.get('/profile')
  return data
}

export const updateProfile = async (payload) => {
  if (USE_MOCK) return mock.updateProfile(payload)
  const { data } = await client.put('/profile', payload)
  return data
}

export const changePassword = async (payload) => {
  if (USE_MOCK) return mock.changePassword(payload)
  const { data } = await client.put('/profile/password', payload)
  return data
}
