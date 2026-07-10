import { useState, useEffect } from 'react'
import AdminDashboard  from './admin/AdminDashboard'
import AdminUsers      from './admin/AdminUsers'
import AdminProducts   from './admin/AdminProducts'
import AdminOffers     from './admin/AdminOffers'
import AdminBrands     from './admin/AdminBrands'
import AdminCategories from './admin/AdminCategories'

const ADMIN_KEY  = 'navsa2024'
const STORE_KEY  = 'navsa_admin_auth'

const NAV = [
  { id: 'dashboard',  icon: '📊', label: 'Dashboard'   },
  { id: 'users',      icon: '👥', label: 'Users'        },
  { id: 'products',   icon: '📦', label: 'Products'     },
  { id: 'offers',     icon: '🏷️', label: 'Daily Offers' },
  { id: 'brands',     icon: '🔤', label: 'Brands'       },
  { id: 'categories', icon: '📂', label: 'Categories'   },
]

// ── Login Gate ────────────────────────────────────────────────────────────────
function LoginGate({ onAuth }) {
  const [key, setKey]   = useState('')
  const [err, setErr]   = useState(false)
  const [show, setShow] = useState(false)

  const attempt = () => {
    if (key === ADMIN_KEY) {
      sessionStorage.setItem(STORE_KEY, '1')
      onAuth()
    } else {
      setErr(true)
      setTimeout(() => setErr(false), 1500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#060c17,#0a1128)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,.15),transparent 70%)', top:'30%', left:'50%', transform:'translateX(-50%)' }} />

      <div style={{
        background: 'rgba(10,17,40,.9)',
        border: `1px solid ${err ? '#991b1b' : '#2a3f6f'}`,
        borderRadius: '24px',
        padding: '48px 40px',
        width: '380px',
        backdropFilter: 'blur(20px)',
        boxShadow: err ? '0 0 40px rgba(239,68,68,.3)' : '0 0 60px rgba(0,0,0,.5)',
        transition: 'border-color .3s, box-shadow .3s',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo / brand */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'40px', marginBottom:'8px' }}>🛡️</div>
          <div style={{ color:'#c9a84c', fontSize:'22px', fontWeight:800, letterSpacing:'.02em' }}>NAVSA Admin</div>
          <div style={{ color:'#7ea8c4', fontSize:'13px', marginTop:'4px' }}>Restricted access — authorised personnel only</div>
        </div>

        <label style={{ color:'#7ea8c4', fontSize:'12px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>
          Admin Key
        </label>
        <div style={{ position:'relative', marginTop:'6px', marginBottom:'20px' }}>
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Enter admin key…"
            autoFocus
            style={{
              width:'100%', background:'#1a2744', border:`1px solid ${err?'#dc2626':'#2a3f6f'}`,
              borderRadius:'12px', color:'#fff', fontSize:'15px', outline:'none',
              padding:'12px 44px 12px 14px', fontFamily:'monospace', letterSpacing:'.1em',
              transition:'border-color .2s',
            }}
          />
          <button onClick={() => setShow(s => !s)} style={{
            position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', color:'#7ea8c4', cursor:'pointer', fontSize:'16px',
          }}>{show ? '🙈' : '👁'}</button>
        </div>

        {err && (
          <div style={{ color:'#f87171', fontSize:'13px', textAlign:'center', marginBottom:'12px', fontWeight:600 }}>
            ✗ Invalid admin key
          </div>
        )}

        <button onClick={attempt} style={{
          width:'100%', background:'linear-gradient(135deg,#c9a84c,#f0d080)',
          border:'none', borderRadius:'12px', color:'#0a1128', fontWeight:800,
          fontSize:'15px', padding:'13px', cursor:'pointer',
          boxShadow:'0 4px 20px rgba(201,168,76,.4)', transition:'transform .15s, box-shadow .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(201,168,76,.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(201,168,76,.4)' }}
        >
          Enter Admin Panel
        </button>
      </div>
    </div>
  )
}

// ── Admin Shell ───────────────────────────────────────────────────────────────
function AdminShell({ onLogout }) {
  const [tab,         setTab]         = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const pages = {
    dashboard:  <AdminDashboard />,
    users:      <AdminUsers />,
    products:   <AdminProducts />,
    offers:     <AdminOffers />,
    brands:     <AdminBrands />,
    categories: <AdminCategories />,
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Inter', sans-serif", background:'#060c17' }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '220px' : '64px',
        background: 'linear-gradient(180deg,#0a1128,#060c17)',
        borderRight: '1px solid #1a2744',
        display: 'flex', flexDirection: 'column',
        transition: 'width .25s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo row */}
        <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', gap:'10px', borderBottom:'1px solid #1a2744' }}>
          <span style={{ fontSize:'22px', flexShrink:0 }}>🛡️</span>
          {sidebarOpen && <span style={{ color:'#c9a84c', fontWeight:800, fontSize:'15px', whiteSpace:'nowrap' }}>NAVSA Admin</span>}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            marginLeft:'auto', background:'none', border:'none', color:'#7ea8c4', cursor:'pointer', fontSize:'18px', flexShrink:0,
          }}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:'4px' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display:'flex', alignItems:'center', gap:'12px',
              background: tab === item.id ? 'rgba(201,168,76,.15)' : 'transparent',
              border: `1px solid ${tab === item.id ? 'rgba(201,168,76,.4)' : 'transparent'}`,
              borderRadius:'10px', color: tab === item.id ? '#c9a84c' : '#7ea8c4',
              cursor:'pointer', padding:'10px 10px', width:'100%', textAlign:'left',
              fontFamily:"'Inter', sans-serif", fontWeight: tab===item.id ? 700 : 500,
              fontSize:'13px', transition:'all .2s', whiteSpace:'nowrap', overflow:'hidden',
            }}
              onMouseEnter={e => { if(tab!==item.id) { e.currentTarget.style.background='rgba(255,255,255,.05)'; e.currentTarget.style.color='#fff' }}}
              onMouseLeave={e => { if(tab!==item.id) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#7ea8c4' }}}
            >
              <span style={{ fontSize:'16px', flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid #1a2744' }}>
          <button onClick={onLogout} style={{
            display:'flex', alignItems:'center', gap:'12px',
            background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)',
            borderRadius:'10px', color:'#f87171', cursor:'pointer', padding:'10px',
            width:'100%', fontFamily:"'Inter', sans-serif", fontWeight:600, fontSize:'13px',
            transition:'all .2s', whiteSpace:'nowrap', overflow:'hidden',
          }}>
            <span style={{ flexShrink:0 }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflow:'auto', padding:'32px' }}>
        {pages[tab]}
      </main>
    </div>
  )
}

// ── Root Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORE_KEY) === '1')

  const logout = () => {
    sessionStorage.removeItem(STORE_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />
  return <AdminShell onLogout={logout} />
}
