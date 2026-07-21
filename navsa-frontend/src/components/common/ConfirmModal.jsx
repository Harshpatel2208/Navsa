// import { useEffect, useId, useRef } from 'react'
// import './ConfirmModal.css'

// export default function ConfirmModal({
//   open,
//   title = 'Are you sure?',
//   message,
//   description = '',
//   confirmText = 'Confirm',
//   cancelText = 'Cancel',
//   eyebrow = 'CONFIRMATION',
//   icon = '!',
//   variant = 'danger',
//   loading = false,
//   closeOnBackdrop = true,
//   onConfirm,
//   onClose,
// }) {
//   const titleId = useId()
//   const cancelButtonRef = useRef(null)

//   useEffect(() => {
//     if (!open) return undefined

//     const previousOverflow = document.body.style.overflow
//     document.body.style.overflow = 'hidden'

//     const frame = window.requestAnimationFrame(() => {
//       cancelButtonRef.current?.focus()
//     })

//     function handleKeyDown(event) {
//       if (event.key === 'Escape' && !loading) {
//         onClose?.()
//       }
//     }

//     document.addEventListener('keydown', handleKeyDown)

//     return () => {
//       window.cancelAnimationFrame(frame)
//       document.body.style.overflow = previousOverflow
//       document.removeEventListener('keydown', handleKeyDown)
//     }
//   }, [loading, onClose, open])

//   if (!open) return null

//   return (
//     <div
//       className="confirm-modal__backdrop"
//       role="presentation"
//       onMouseDown={event => {
//         if (
//           closeOnBackdrop &&
//           !loading &&
//           event.target === event.currentTarget
//         ) {
//           onClose?.()
//         }
//       }}
//     >
//       <section
//         className={`confirm-modal confirm-modal--${variant}`}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={titleId}
//       >
//         <button
//           type="button"
//           className="confirm-modal__close"
//           onClick={onClose}
//           aria-label="Close confirmation"
//           disabled={loading}
//         >
//           ×
//         </button>

//         <div className="confirm-modal__icon" aria-hidden="true">
//           {icon}
//         </div>

//         {eyebrow && (
//           <span className="confirm-modal__eyebrow">{eyebrow}</span>
//         )}

//         <h2 id={titleId}>{title}</h2>

//         {message && (
//           <div className="confirm-modal__message">{message}</div>
//         )}

//         {description && (
//           <p className="confirm-modal__description">{description}</p>
//         )}

//         <div className="confirm-modal__actions">
//           <button
//             ref={cancelButtonRef}
//             type="button"
//             className="confirm-modal__cancel"
//             onClick={onClose}
//             disabled={loading}
//           >
//             {cancelText}
//           </button>

//           <button
//             type="button"
//             className="confirm-modal__confirm"
//             onClick={onConfirm}
//             disabled={loading}
//           >
//             {loading ? 'Please wait…' : confirmText}
//           </button>
//         </div>
//       </section>
//     </div>
//   )
// }

import { useEffect, useId, useRef } from 'react'
import './ConfirmModal.css'

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  eyebrow = 'CONFIRMATION',
  icon = '!',
  variant = 'danger',
  loading = false,
  closeOnBackdrop = true,
  onConfirm,
  onClose,
}) {
  const titleId = useId()
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus()
    })

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !loading) {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [loading, onClose, open])

  if (!open) return null

  return (
    <div
      className="confirm-modal__backdrop"
      role="presentation"
      onMouseDown={event => {
        if (
          closeOnBackdrop &&
          !loading &&
          event.target === event.currentTarget
        ) {
          onClose?.()
        }
      }}
    >
      <section
        className={`confirm-modal confirm-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="confirm-modal__close"
          onClick={onClose}
          aria-label="Close confirmation"
          disabled={loading}
        >
          ×
        </button>

        <div className="confirm-modal__icon" aria-hidden="true">
          {icon}
        </div>

        {eyebrow && (
          <span className="confirm-modal__eyebrow">{eyebrow}</span>
        )}

        <h2 id={titleId}>{title}</h2>

        {message && (
          <div className="confirm-modal__message">{message}</div>
        )}

        {description && (
          <p className="confirm-modal__description">{description}</p>
        )}

        <div className="confirm-modal__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="confirm-modal__cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirm-modal__confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait…' : confirmText}
          </button>
        </div>
      </section>
    </div>
  )
}