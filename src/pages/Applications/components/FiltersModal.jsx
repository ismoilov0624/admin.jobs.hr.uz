"use client";
import { X, Filter } from "lucide-react";
import "./FiltersModal.scss";

const FiltersModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== "createdAt" && value !== "desc"
  );

  return (
    <div className="modal-overlay">
      <div className="filters-modal-content">
        <div className="modal-header">
          <div className="header-info">
            <Filter size={20} />
            <h2>Filtrlar</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="filter-group">
            <label>Holat</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option value="PENDING">Yangi</option>
              <option value="APPROVED">Tasdiqlangan</option>
              <option value="REJECTED">Rad etilgan</option>
              <option value="UNDER_REVIEW">Ko'rib chiqilmoqda</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ish nomi</label>
            <input
              type="text"
              placeholder="Ish nomini kiriting"
              value={filters.jobTitle}
              onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Boshlanish sanasi</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Tugash sanasi</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Saralash</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                handleFilterChange("sortBy", sortBy);
                handleFilterChange("sortOrder", sortOrder);
              }}
            >
              <option value="createdAt-desc">Yangi arizalar</option>
              <option value="createdAt-asc">Eski arizalar</option>
              <option value="status-asc">Holat bo'yicha</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          {hasActiveFilters && (
            <button className="clear-btn" onClick={onClearFilters}>
              Tozalash
            </button>
          )}
          <button className="apply-btn" onClick={onClose}>
            Qo'llash
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
