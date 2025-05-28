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

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

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
              <option value="DRAFT">Qoralama</option>
              <option value="ACTIVE">Faol</option>
              <option value="INACTIVE">Nofaol</option>
              <option value="CLOSED">Yopiq</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ish turi</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option value="FULL_TIME">To'liq vaqt</option>
              <option value="PART_TIME">Yarim vaqt</option>
              <option value="FREELANCE">Frilanser</option>
              <option value="INTERNSHIP">Amaliyot</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ish joyi</label>
            <select
              value={filters.workLocation}
              onChange={(e) =>
                handleFilterChange("workLocation", e.target.value)
              }
            >
              <option value="">Barchasi</option>
              <option value="OFFICE">Ofis</option>
              <option value="REMOTE">Masofaviy</option>
              <option value="HYBRID">Aralash</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Jins</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option value="BOTH">Farqi yo'q</option>
              <option value="MALE">Erkak</option>
              <option value="FEMALE">Ayol</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Maosh (dan)</label>
            <input
              type="number"
              placeholder="Minimal maosh"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange("minSalary", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Maosh (gacha)</label>
            <input
              type="number"
              placeholder="Maksimal maosh"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
            />
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
