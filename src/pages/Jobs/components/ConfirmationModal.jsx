"use client";

import { X, AlertTriangle, Check, Edit } from "lucide-react";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = "warning",
  isLoading,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle size={24} />;
      case "warning":
        return <AlertTriangle size={24} />;
      case "edit":
        return <Edit size={24} />;
      default:
        return <Check size={24} />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "danger":
        return "delete-btn";
      case "warning":
        return "warning-btn";
      case "edit":
        return "edit-btn";
      default:
        return "confirm-btn";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="confirmation-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className={`icon-container ${type}`}>{getIcon()}</div>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Bekor qilish
          </button>
          <button
            className={getButtonClass()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Yuklanmoqda..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
