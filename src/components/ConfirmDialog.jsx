import { AlertTriangle, X } from 'lucide-react';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, type = 'danger' }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-header ${type}`}>
          <AlertTriangle size={24} />
          <h3>{title}</h3>
          <button className="confirm-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        
        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <div className="confirm-footer">
          <button className="btn-cancel" onClick={onCancel}>
            İptal
          </button>
          <button className={`btn-confirm ${type}`} onClick={onConfirm}>
            Evet, {type === 'danger' ? 'Sil' : 'Onayla'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;