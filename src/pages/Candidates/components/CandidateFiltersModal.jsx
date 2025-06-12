"use client";
import { X, Filter } from "lucide-react";
import "./CandidateFiltersModal.scss";

const CandidateFiltersModal = ({
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
      <div className="candidate-filters-modal-content">
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
            <label>Ish holati</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option value="EMPLOYED">Ishlamoqda</option>
              <option value="UNEMPLOYED">Ishsiz</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Mutaxassislik</label>
            <input
              type="text"
              placeholder="Mutaxassislik nomini kiriting"
              value={filters.specialty}
              onChange={(e) => handleFilterChange("specialty", e.target.value)}
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
              <option value="createdAt-desc">Yangi ro'yxatdan o'tganlar</option>
              <option value="createdAt-asc">Eski ro'yxatdan o'tganlar</option>
              <option value="firstName-asc">Ism bo'yicha (A-Z)</option>
              <option value="firstName-desc">Ism bo'yicha (Z-A)</option>
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

export default CandidateFiltersModal;
