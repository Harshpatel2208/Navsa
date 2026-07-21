import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius, shadow } from '../theme'

function Account() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response. Please check server logs.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirect to home page or dashboard
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '70vh', background: colors.paper, display: 'flex', justifyContent: 'center', padding: '70px 6vw' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', border: `1px solid rgba(149, 204, 221, 0.6)`, borderRadius: radius.lg, boxShadow: shadow.soft, padding: '44px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '22px', marginBottom: '24px', textAlign: 'center' }}>
          Trade Account Login
        </h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: radius.sm, marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <label style={{ fontSize: '13px', color: colors.inkMuted, fontFamily: fonts.body }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', border: `1px solid ${colors.hairline}`, borderRadius: radius.sm, outline: 'none', marginTop: '6px', marginBottom: '18px' }}
        />

        <label style={{ fontSize: '13px', color: colors.inkMuted, fontFamily: fonts.body }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', border: `1px solid ${colors.hairline}`, borderRadius: radius.sm, outline: 'none', marginTop: '6px', marginBottom: '24px' }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', background: colors.navy, color: '#fff', border: 'none', padding: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: radius.pill, boxShadow: '0 8px 20px rgba(41, 54, 129, 0.25)', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: colors.inkMuted, marginTop: '18px' }}>
          Don't have a trade account?{' '}
          <span 
            onClick={() => navigate('/become-a-customer')}
            style={{ color: colors.accent, fontWeight: 600, cursor: 'pointer' }}
          >
            Create one
          </span>
        </p>

      </form>
    </div>
  )
}

export default Account
