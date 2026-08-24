import client, { USE_MOCK } from '../client'
import * as mock from '../mock'

const guard = (fn) => (payload) => {
  if (USE_MOCK) return mock[fn](payload)
  return null
}

export const login = async (payload) => {
  if (USE_MOCK) return mock.login(payload)
  const { data } = await client.post('/auth/login', payload)
  return data
}

export const logout = async () => {
  if (USE_MOCK) return mock.logout()
  const { data } = await client.post('/auth/logout')
  return data
}

export const me = async () => {
  if (USE_MOCK) return mock.me()
  const { data } = await client.get('/auth/me')
  return data
}

export const unused = guard
