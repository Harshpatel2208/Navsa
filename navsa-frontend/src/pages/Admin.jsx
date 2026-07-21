import { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, Lock, UserCheck, ChevronDown } from 'lucide-react';
import AdminDashboard  from './admin/AdminDashboard';
import AdminUsers      from './admin/AdminUsers';
import AdminProducts   from './admin/AdminProducts';
import AdminOffers     from './admin/AdminOffers';
import AdminBrands     from './admin/AdminBrands';
import AdminCategories from './admin/AdminCategories';
import AdminRegistrations from './admin/AdminRegistrations';
import AdminPdfs from './admin/AdminPdfs';

// Temporary bypass for login as requested
function AdminShell({ onLogout }) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const adminUser = (() => { try { return JSON.parse(localStorage.getItem('admin_user') || '{}'); } catch { return {}; } })();
  const initials = (adminUser.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="admin-layout admin-bg">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
          <h2 style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={24} /> Navsa Admin
          </h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/admin/dashboard" className={({isActive}) => `admin-nav-item ${isActive || location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} /> Products
          </NavLink>
          <NavLink to="/admin/offers" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Tag size={20} /> Daily Offers
          </NavLink>
          <NavLink to="/admin/registrations" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <UserCheck size={20} /> Registrations
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Customers
          </NavLink>
          <NavLink to="/admin/brands" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> Brands
          </NavLink>
          <NavLink to="/admin/categories" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> Categories
          </NavLink>
          <NavLink to="/admin/pdfs" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} /> PDFs & Manuals
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button onClick={onLogout} className="admin-btn admin-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

        {/* Main Content */}
      <main className="admin-main-content">
        {/* Topbar */}
        <header className="glass-header admin-flex-between" style={{ padding: '1rem 2rem', position: 'relative' }}>
          <div />
          <div className="admin-flex-center" style={{ gap: '1rem', position: 'relative' }}>
            {/* Profile Avatar Button */}
            <button
              onClick={() => setProfileOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '24px', padding: '6px 12px 6px 6px', cursor: 'pointer', color: '#fff'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
              }}>
                {initials}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{adminUser.name || 'Admin'}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Administrator</div>
              </div>
              <ChevronDown size={14} style={{ color: '#94a3b8', marginLeft: '2px', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '12px', minWidth: '240px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1000
              }}>
                {/* Profile header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', fontWeight: 'bold', color: '#fff'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{adminUser.name || 'Admin User'}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{adminUser.email || 'admin@navsainternational.com'}</div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>ADMINISTRATOR</span>
                    </div>
                  </div>
                </div>
                {/* Logout */}
                <button
                  onClick={() => { setProfileOpen(false); onLogout(); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', borderRadius: '8px', padding: '8px 12px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: 600
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-page-content">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="pdfs" element={<AdminPdfs />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response. Please check server logs.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#3b82f6', textAlign: 'center', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Lock size={22} /> Admin Login
        </h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>Sign in to access the admin panel</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="admin-input-field" style={{ width: '100%', padding: '10px 14px', marginBottom: '16px' }} />

          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="admin-input-field" style={{ width: '100%', padding: '10px 14px', marginBottom: '24px' }} />

          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px dashed rgba(255,255,255,0.15)', 
          borderRadius: '6px', 
          fontSize: '12px',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Demo Credentials:</strong>
            <button 
              type="button"
              onClick={() => {
                setEmail('admin@navsainternational.com');
                setPassword('password');
              }}
              className="admin-btn"
              style={{ padding: '3px 8px', fontSize: '11px', background: '#3b82f6', color: '#fff', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
            >
              Auto Fill
            </button>
          </div>
          <div><strong>Email:</strong> admin@navsainternational.com</div>
          <div><strong>Password:</strong> password</div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('admin_token'));

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminShell onLogout={logout} />;
}
