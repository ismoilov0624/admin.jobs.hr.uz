"use client";
import { X, AlertTriangle } from "lucide-react";
import "./DeleteConfirmationModal.scss";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal-content">
        <div className="modal-header">
          <div className="warning-icon">
            <AlertTriangle size={24} />
          </div>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2>Ish o'rnini o'chirish</h2>
          <p>
            <strong>"{jobTitle}"</strong> ish o'rnini o'chirishni xohlaysizmi?
          </p>
          <p className="warning-text">Bu amalni bekor qilib bo'lmaydi.</p>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Bekor qilish
          </button>
          <button
            className="delete-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
