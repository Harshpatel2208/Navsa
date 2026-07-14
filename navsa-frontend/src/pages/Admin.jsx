import { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, Search, Bell, Lock, UserCheck } from 'lucide-react';
import AdminDashboard  from './admin/AdminDashboard';
import AdminUsers      from './admin/AdminUsers';
import AdminProducts   from './admin/AdminProducts';
import AdminOffers     from './admin/AdminOffers';
import AdminBrands     from './admin/AdminBrands';
import AdminCategories from './admin/AdminCategories';
import AdminRegistrations from './admin/AdminRegistrations';

// Temporary bypass for login as requested
function AdminShell({ onLogout }) {
  const location = useLocation();

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
        <header className="glass-header admin-flex-between" style={{ padding: '1rem 2rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="admin-input-field" 
              style={{ width: '100%', paddingLeft: '2.5rem', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px' }} 
              placeholder="Search..." 
            />
          </div>
          <div className="admin-flex-center" style={{ gap: '1rem' }}>
            <button className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              A
            </div>
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
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  const logout = () => {
    alert("Logout clicked (login disabled for testing)");
  };

  // Login bypassed for testing
  return <AdminShell onLogout={logout} />;
}
