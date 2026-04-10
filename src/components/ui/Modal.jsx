import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '520px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ maxWidth }} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
        {title && (
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </>,
    document.body
  );
}
