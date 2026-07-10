// Central admin API helper — always injects X-Admin-Key header
const BASE = import.meta.env.VITE_API_URL || '/api'
const KEY  = 'navsa2024'

const headers = () => ({
  'Content-Type': 'application/json',
  'X-Admin-Key': KEY,
})

async function req(method, path, body) {
  const opts = { method, headers: headers() }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}/admin${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getStats = () => req('GET', '/stats')

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/products${qs ? '?' + qs : ''}`)
}
export const updateProduct    = (id, data) => req('PUT',   `/products/${id}`, data)
export const toggleWeb        = (id)       => req('PATCH', `/products/${id}/toggle-web`)
export const toggleOffer      = (id, label) => req('PATCH', `/products/${id}/toggle-offer`, label ? { offer_label: label } : {})
export const updateStock      = (id, stock_quantity, price, price_list) =>
  req('PATCH', `/products/${id}/stock`, { stock_quantity, price, price_list })
export const softDeleteProduct= (id) => req('PATCH', `/products/${id}/soft-delete`)
export const restoreProduct   = (id) => req('PATCH', `/products/${id}/restore`)
export const hardDeleteProduct= (id) => req('DELETE', `/products/${id}`)

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers    = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/users${qs ? '?' + qs : ''}`)
}
export const updateUser  = (id, data) => req('PUT',    `/users/${id}`, data)
export const deleteUser  = (id)       => req('DELETE', `/users/${id}`)

// ── Brands ────────────────────────────────────────────────────────────────────
export const getBrands        = () => req('GET', '/brands')
export const createBrand      = (brand_name) => req('POST',  '/brands', { brand_name })
export const updateBrand      = (id, data)   => req('PUT',   `/brands/${id}`, data)
export const softDeleteBrand  = (id) => req('PATCH',  `/brands/${id}/soft-delete`)
export const hardDeleteBrand  = (id) => req('DELETE', `/brands/${id}`)

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories       = () => req('GET', '/categories')
export const createCategory      = (category_name) => req('POST',  '/categories', { category_name })
export const updateCategory      = (id, data)       => req('PUT',   `/categories/${id}`, data)
export const softDeleteCategory  = (id) => req('PATCH',  `/categories/${id}/soft-delete`)
export const hardDeleteCategory  = (id) => req('DELETE', `/categories/${id}`)
