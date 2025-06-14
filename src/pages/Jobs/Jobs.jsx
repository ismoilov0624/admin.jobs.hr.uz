"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useJobs } from "./service/useJobs";
import { useDeleteJob } from "./service/useDeleteJob";
import CreateJobModal from "./components/CreateJobModal";
import ViewJobModal from "./components/ViewJobModal";
import EditJobModal from "./components/EditJobModal";
import ConfirmationModal from "./components/ConfirmationModal";
import "./Jobs.scss";

const Jobs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [filters, setFilters] = useState({
    location: "",
    minSalary: "",
    maxSalary: "",
    startDate: "",
    endDate: "",
    type: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Debounced filters for search inputs
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter changes for search inputs (location)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.location, filters]);

  // Update other filters immediately
  useEffect(() => {
    setDebouncedFilters((prev) => ({
      ...prev,
      minSalary: filters.minSalary,
      maxSalary: filters.maxSalary,
      startDate: filters.startDate,
      endDate: filters.endDate,
      type: filters.type,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }));
  }, [
    filters.minSalary,
    filters.maxSalary,
    filters.startDate,
    filters.endDate,
    filters.type,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useJobs({
    page: currentPage,
    limit: 10,
    ...debouncedFilters, // Use debounced filters
  });

  // Reset page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, debouncedFilters]);

  const getStatusBadge = (status) => {
    const statusMap = {
      DRAFT: { label: "Qoralama", class: "draft" },
      ACTIVE: { label: "Faol", class: "active" },
      INACTIVE: { label: "Nofaol", class: "inactive" },
      CLOSED: { label: "Yopiq", class: "closed" },
    };
    return statusMap[status] || { label: status, class: "draft" };
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      FULL_TIME: "To'liq vaqt",
      PART_TIME: "Yarim vaqt",
      FREELANCE: "Frilanser",
      INTERNSHIP: "Amaliyot",
    };
    return typeMap[type] || type;
  };

  const getLocationBadge = (location) => {
    const locationMap = {
      REMOTE: "Masofaviy",
      OFFICE: "Ofis",
      HYBRID: "Aralash",
    };
    return locationMap[location] || location;
  };

  // Event handlers with proper event stopping
  const handleViewJob = (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleEditJob = (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedJob(job);
    setConfirmationConfig({
      title: "Ish o'rnini tahrirlash",
      message: `"${job.title}" ish o'rnini tahrirlashni xohlaysizmi?`,
      confirmText: "Tahrirlash",
      type: "edit",
      onConfirm: () => {
        setIsConfirmationModalOpen(false);
        setSelectedJob(job);
        setIsEditModalOpen(true);
      },
    });
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteJob = (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedJob(job);
    setConfirmationConfig({
      title: "Ish o'rnini o'chirish",
      message: `"${job.title}" ish o'rnini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`,
      confirmText: "O'chirish",
      type: "danger",
      onConfirm: () => {
        deleteJob(job.id, {
          onSuccess: () => {
            setIsConfirmationModalOpen(false);
            setSelectedJob(null);
          },
          onError: () => {
            setIsConfirmationModalOpen(false);
          },
        });
      },
    });
    setIsConfirmationModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsConfirmationModalOpen(false);
    setSelectedJob(null);
    setConfirmationConfig({});
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      minSalary: "",
      maxSalary: "",
      startDate: "",
      endDate: "",
      type: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setDebouncedFilters(clearedFilters);
    setCurrentPage(1);
  };

  const setQuickFilter = (filterType) => {
    const today = new Date();
    let startDate = "";

    switch (filterType) {
      case "last7days":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        handleFilterChange("startDate", startDate);
        handleFilterChange("endDate", today.toISOString().split("T")[0]);
        break;
      case "last30days":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        handleFilterChange("startDate", startDate);
        handleFilterChange("endDate", today.toISOString().split("T")[0]);
        break;
      case "remote":
        handleFilterChange("location", "REMOTE");
        break;
      case "fulltime":
        handleFilterChange("type", "FULL_TIME");
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="jobs-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha ish o'rinlarini boshqaring</p>
            </div>
            <button className="create-btn" disabled>
              <Plus size={20} />
              Yangi ish o'rni
            </button>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Ish o'rinlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha ish o'rinlarini boshqaring</p>
            </div>
            <button
              className="create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} />
              Yangi ish o'rni
            </button>
          </div>
        </div>
        <div className="error-state">
          <p>Xatolik yuz berdi: {error.message}</p>
          <button onClick={() => refetch()} className="retry-btn">
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  // Extract jobs from the response structure
  const jobs = jobsData?.data?.jobs || [];
  const meta = jobsData?.data?.meta || { totalCount: 0, totalPages: 0 };

  // Filter jobs by search term (client-side filtering)
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <p className="page-subtitle">Barcha ish o'rinlarini boshqaring</p>
          </div>
          <button
            className="create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} />
            Yangi ish o'rni
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="filter-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Ish nomi yoki kompaniya bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`filter-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filtrar
          </button>
        </div>

        <div className="results-count">{filteredJobs.length} ta natija</div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <div className="filter-header">
                  <MapPin size={20} className="filter-icon" />
                  <label>Joylashuv</label>
                </div>
                <input
                  type="text"
                  placeholder="Shahar yoki viloyat"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter-icon"
                  >
                    <path
                      d="M7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M15 10C15 13.866 10 18.3333 10 18.3333C10 18.3333 5 13.866 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <label>Maosh diapazoni</label>
                </div>
                <div className="salary-range">
                  <input
                    type="number"
                    placeholder="Dan"
                    value={filters.minSalary}
                    onChange={(e) =>
                      handleFilterChange("minSalary", e.target.value)
                    }
                  />
                  <span className="range-separator">—</span>
                  <input
                    type="number"
                    placeholder="Gacha"
                    value={filters.maxSalary}
                    onChange={(e) =>
                      handleFilterChange("maxSalary", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter-icon"
                  >
                    <path
                      d="M6.66669 1.66666V4.16666M13.3334 1.66666V4.16666M2.91669 7.57916H17.0834M4.16669 3.33333H15.8334C16.7539 3.33333 17.5 4.07943 17.5 5V16.6667C17.5 17.5872 16.7539 18.3333 15.8334 18.3333H4.16669C3.24622 18.3333 2.50002 17.5872 2.50002 16.6667V5C2.50002 4.07953 3.24622 3.33333 4.16669 3.33333Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <label>E'lon qilingan sana</label>
                </div>
                <div className="date-range">
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                  <span className="range-separator">—</span>
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <Briefcase size={20} className="filter-icon" />
                  <label>Ish turi</label>
                </div>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">Barcha turlar</option>
                  <option value="FULL_TIME">To'liq vaqt</option>
                  <option value="PART_TIME">Yarim vaqt</option>
                  <option value="FREELANCE">Frilanser</option>
                  <option value="INTERNSHIP">Amaliyot</option>
                </select>
              </div>
            </div>

            <div className="sort-section">
              <div className="filter-group">
                <div className="filter-header">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter-icon"
                  >
                    <path
                      d="M5 10L15 10M5 10L8.33333 13.3333M5 10L8.33333 6.66667M15 10L11.6667 13.3333M15 10L11.6667 6.66667"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <label>Saralash</label>
                </div>
                <div className="sort-controls">
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-");
                      handleFilterChange("sortBy", sortBy);
                      handleFilterChange("sortOrder", sortOrder);
                    }}
                  >
                    <option value="createdAt-desc">E'lon qilingan sana</option>
                    <option value="title-asc">Ish nomi (A-Z)</option>
                    <option value="title-desc">Ish nomi (Z-A)</option>
                    <option value="salary-desc">Maosh (yuqori)</option>
                    <option value="salary-asc">Maosh (past)</option>
                  </select>
                  <button className="sort-direction-btn">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="quick-filters">
              <span className="quick-filters-label">Tezkor filtrlar:</span>
              <div className="quick-filter-tags">
                <button
                  className="quick-filter-tag"
                  onClick={() => setQuickFilter("last7days")}
                >
                  Oxirgi 7 kun
                </button>
                <button
                  className="quick-filter-tag"
                  onClick={() => setQuickFilter("last30days")}
                >
                  Oxirgi 30 kun
                </button>
                <button
                  className="quick-filter-tag"
                  onClick={() => setQuickFilter("remote")}
                >
                  Masofaviy ishlar
                </button>
                <button
                  className="quick-filter-tag"
                  onClick={() => setQuickFilter("fulltime")}
                >
                  To'liq vaqtli
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredJobs.length > 0 ? (
          <div className="jobs-table">
            <div className="table-header">
              <div className="col col-job">ISH O'RNI</div>
              <div className="col col-location">JOYLASHUV</div>
              <div className="col col-salary">MAOSH</div>
              <div className="col col-type">ISH TURI</div>
              <div className="col col-date">E'LON QILINGAN</div>
              <div className="col col-status">HOLAT</div>
              <div className="col col-actions">AMALLAR</div>
            </div>

            <div className="table-body">
              {filteredJobs.map((job) => {
                const status = getStatusBadge(job.status);

                return (
                  <div key={job.id} className="table-row">
                    <div className="col col-job">
                      <div className="job-info">
                        <div className="job-icon">
                          <Briefcase size={20} />
                        </div>
                        <div className="job-details">
                          <h3>{job.title}</h3>
                          <span className="job-id">
                            ID: {job.id?.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col col-location">
                      <div className="location">
                        <MapPin size={16} />
                        <span>{getLocationBadge(job.workLocation)}</span>
                      </div>
                    </div>

                    <div className="col col-salary">
                      <span className="salary">
                        {job.salary?.toLocaleString()}
                      </span>
                    </div>

                    <div className="col col-type">
                      <span className="job-type">{getTypeBadge(job.type)}</span>
                    </div>

                    <div className="col col-date">
                      <div className="date-info">
                        <span className="date">
                          {new Date(job.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                        <span className="time">
                          {new Date(job.createdAt).toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="col col-status">
                      <span className={`status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="col col-actions">
                      <div className="actions">
                        <button
                          className="action-btn view"
                          title="Ko'rish"
                          onClick={(e) => handleViewJob(e, job)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn edit"
                          title="Tahrirlash"
                          onClick={(e) => handleEditJob(e, job)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="O'chirish"
                          onClick={(e) => handleDeleteJob(e, job)}
                          disabled={isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase size={48} />
            </div>
            <h3>Hozircha ish o'rinlari yo'q</h3>
            <p>Birinchi ish o'rnini yarating</p>
            <button
              className="create-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} />
              Yangi ish o'rni
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ViewJobModal
        isOpen={isViewModalOpen}
        onClose={closeModals}
        job={selectedJob}
      />
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        job={selectedJob}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModals}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        confirmText={confirmationConfig.confirmText}
        type={confirmationConfig.type}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Jobs;
