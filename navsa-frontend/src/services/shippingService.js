const API_BASE = '/api'

export async function getContainers() {
  const response = await fetch(`${API_BASE}/shipping/containers`)
  if (!response.ok) throw new Error('Failed to load containers')
  return response.json()
}

export async function getCountries() {
  const response = await fetch(`${API_BASE}/shipping/countries`)
  if (!response.ok) throw new Error('Failed to load countries')
  return response.json()
}

export async function getPorts(countryId) {
  if (!countryId) return []

  const response = await fetch(`${API_BASE}/shipping/ports/${countryId}`)
  if (!response.ok) throw new Error('Failed to load ports')
  return response.json()
}