"use client";
import { X, AlertTriangle, Edit, Trash2 } from "lucide-react";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Bekor qilish",
  type = "danger", // danger, warning, info
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 size={24} />;
      case "warning":
        return <AlertTriangle size={24} />;
      case "edit":
        return <Edit size={24} />;
      default:
        return <AlertTriangle size={24} />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      case "edit":
        return "edit";
      default:
        return "warning";
    }
  };

  const getConfirmButtonClass = () => {
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
    <div className="modal-overlay">
      <div className="confirmation-modal-content">
        <div className="modal-header">
          <div className={`icon-container ${getIconClass()}`}>{getIcon()}</div>
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
            {cancelText}
          </button>
          <button
            className={getConfirmButtonClass()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Bajarilmoqda..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
