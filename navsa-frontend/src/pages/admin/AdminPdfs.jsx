import { useEffect, useState, useCallback, useRef } from 'react'
import { getPdfs, uploadPdf, deletePdf } from '../../services/adminApi'
import { Plus, Trash2, FileText } from 'lucide-react';

export default function AdminPdfs() {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('manual')
  const fileInputRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPdfs()
      setPdfs(res)
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const doUpload = async () => {
    if (!title || !fileInputRef.current?.files[0]) {
      alert("Please provide a title and select a PDF file.")
      return
    }
    
    setBusy(true)
    try {
      await uploadPdf(fileInputRef.current.files[0], title, type)
      setTitle('')
      fileInputRef.current.value = ''
      load()
    } catch (e) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }

  const doDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return
    try {
      await deletePdf(id)
      load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>PDFs Management</h1>
          <p style={{ color: '#94a3b8' }}>Upload manuals and documents</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '20px' }}>
        <h3>Upload New PDF</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Title (e.g. Manual of the Month)" 
            className="admin-input-field" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <select value={type} onChange={e => setType(e.target.value)} className="admin-input-field">
            <option value="manual">Manual</option>
            <option value="catalog">Catalog</option>
            <option value="other">Other</option>
          </select>
          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            className="admin-input-field" 
            style={{ paddingTop: '8px' }}
          />
          <button onClick={doUpload} disabled={busy} className="admin-btn admin-btn-primary">
            {busy ? 'Uploading...' : <><Plus size={18} /> Upload</>}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="admin-table-container">
          {loading ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading PDFs…</div>
          ) : pdfs.length === 0 ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>No PDFs found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>File</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pdfs.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.title}</td>
                    <td>{p.type}</td>
                    <td>
                      <a 
                        href={(() => {
                          const apiBase = import.meta.env.VITE_API_URL || '';
                          if (apiBase) {
                            const base = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
                            return `${base}/storage/${p.file_path}`;
                          }
                          return `/storage/${p.file_path}`;
                        })()} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <FileText size={16} /> View PDF
                      </a>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => doDelete(p.id)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
