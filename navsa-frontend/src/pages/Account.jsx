import { useState } from 'react'
import { colors, fonts } from '../theme'

function Account() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ width: '100%', minHeight: '70vh', background: colors.paper, display: 'flex', justifyContent: 'center', padding: '70px 6vw' }}>
      <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '40px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '22px', marginBottom: '24px', textAlign: 'center' }}>
          Trade Account Login
        </h2>

        <label style={{ fontSize: '13px', color: colors.inkMuted, fontFamily: fonts.body }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '11px', border: `1px solid ${colors.hairline}`, marginTop: '6px', marginBottom: '18px' }}
        />

        <label style={{ fontSize: '13px', color: colors.inkMuted, fontFamily: fonts.body }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '11px', border: `1px solid ${colors.hairline}`, marginTop: '6px', marginBottom: '24px' }}
        />

        <button style={{ width: '100%', background: colors.navy, color: '#fff', border: 'none', padding: '13px', fontWeight: 600, cursor: 'pointer' }}>
          Log In
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: colors.inkMuted, marginTop: '18px' }}>
          Don't have a trade account?{' '}
          <span style={{ color: colors.accent, fontWeight: 600, cursor: 'pointer' }}>Create one</span>
        </p>

        <p style={{ textAlign: 'center', fontSize: '12px', color: colors.inkMuted, marginTop: '20px', fontFamily: fonts.mono }}>
          ⚠ Login isn't wired to the backend yet — this is the UI only.
        </p>
      </div>
    </div>
  )
}

export default Account