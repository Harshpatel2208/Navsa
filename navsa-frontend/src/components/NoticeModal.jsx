import './NoticeModal.css'

function NoticeModal({
  open,
  title,
  message,
  type = 'warning',
  buttonText = 'OK',
  onClose,
}) {
  if (!open) return null

  return (
    <div
      className="notice-modal-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={`notice-modal notice-modal-${type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-modal-title"
      >
        <button
          type="button"
          className="notice-modal-close"
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>

        <div className="notice-modal-icon">
          {type === 'success' ? '✓' : type === 'error' ? '×' : '!'}
        </div>

        <h3 id="notice-modal-title">{title}</h3>
        <p>{message}</p>

        <button
          type="button"
          className="notice-modal-button"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </section>
    </div>
  )
}

export default NoticeModal
