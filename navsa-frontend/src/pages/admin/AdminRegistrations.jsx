import React, { useState, useEffect } from 'react';
import { UserCheck, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null); // For viewing details
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/admin/registrations`, {
        headers: { 'X-Admin-Key': 'navsa2024' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this registration?")) return;
    setProcessing(true);
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/admin/registrations/${id}/approve`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'navsa2024' }
      });
      if (res.ok) {
        alert("Registration approved successfully!");
        fetchRegistrations();
        setSelectedReg(null);
      } else {
        alert("Failed to approve");
      }
    } catch (error) {
      console.error("Approval error", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this registration?")) return;
    setProcessing(true);
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/admin/registrations/${id}/reject`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'navsa2024' }
      });
      if (res.ok) {
        alert("Registration rejected successfully!");
        fetchRegistrations();
        setSelectedReg(null);
      } else {
        alert("Failed to reject");
      }
    } catch (error) {
      console.error("Rejection error", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading registrations...</div>;

  return (
    <div className="admin-registrations" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserCheck /> Pending Customer Registrations
        </h2>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Company</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No pending registrations</td>
              </tr>
            ) : (
              registrations.map(reg => (
                <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px' }}>{reg.name}</td>
                  <td style={{ padding: '10px' }}>{reg.company_name}</td>
                  <td style={{ padding: '10px' }}>{reg.email}</td>
                  <td style={{ padding: '10px' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <button 
                      onClick={() => setSelectedReg(reg)}
                      className="admin-btn admin-btn-ghost" 
                      style={{ padding: '5px 10px', marginRight: '10px' }}>
                      <Eye size={16} style={{ marginRight: '5px' }}/> View
                    </button>
                    <button 
                      onClick={() => handleApprove(reg.id)}
                      disabled={processing}
                      className="admin-btn" 
                      style={{ padding: '5px 10px', background: '#10b981', marginRight: '8px' }}>
                      <CheckCircle size={16} style={{ marginRight: '5px' }}/> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(reg.id)}
                      disabled={processing}
                      className="admin-btn" 
                      style={{ padding: '5px 10px', background: '#ef4444' }}>
                      <XCircle size={16} style={{ marginRight: '5px' }}/> Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '80%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Registration Details: {selectedReg.name}</h2>
              <button onClick={() => setSelectedReg(null)} className="admin-btn admin-btn-ghost">Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3>Basic Info</h3>
                <p><strong>Email:</strong> {selectedReg.email}</p>
                <p><strong>Company:</strong> {selectedReg.company_name}</p>
                <p><strong>Phone:</strong> {selectedReg.phone}</p>
              </div>
              
              {selectedReg.customer_detail && (
                <>
                  <div>
                    <h3>Business Details</h3>
                    <p><strong>Nature:</strong> {selectedReg.customer_detail.business_nature}</p>
                    <p><strong>Trading Years:</strong> {selectedReg.customer_detail.trading_years}</p>
                    <p><strong>Turnover:</strong> {selectedReg.customer_detail.turnover}</p>
                    <p><strong>Director:</strong> {selectedReg.customer_detail.director_name}</p>
                  </div>
                  <div>
                    <h3>Address</h3>
                    <p>{selectedReg.customer_detail.address_line_1}</p>
                    <p>{selectedReg.customer_detail.city}, {selectedReg.customer_detail.province}</p>
                    <p>{selectedReg.customer_detail.country} - {selectedReg.customer_detail.zip_code}</p>
                  </div>
                  <div>
                    <h3>Preferences</h3>
                    <p><strong>Region:</strong> {selectedReg.customer_detail.region}</p>
                    <p><strong>Currency:</strong> {selectedReg.customer_detail.currency}</p>
                    <p><strong>Import Containers:</strong> {selectedReg.customer_detail.import_full_containers}</p>
                    <p><strong>Brands:</strong> {selectedReg.customer_detail.brands_interested}</p>
                    <p><strong>Categories:</strong> {selectedReg.customer_detail.categories_interested?.join(', ')}</p>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <button onClick={() => setSelectedReg(null)} className="admin-btn admin-btn-ghost" style={{ marginRight: '10px' }}>Cancel</button>
              <button onClick={() => handleReject(selectedReg.id)} disabled={processing} className="admin-btn" style={{ background: '#ef4444', marginRight: '10px' }}>
                Reject Request
              </button>
              <button onClick={() => handleApprove(selectedReg.id)} disabled={processing} className="admin-btn" style={{ background: '#10b981' }}>
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
