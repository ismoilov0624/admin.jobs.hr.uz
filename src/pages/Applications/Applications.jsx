"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Check,
  X,
  Trash2,
  Filter,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { useApplications } from "./service/useApplications";
import { useUpdateApplicationStatus } from "./service/useUpdateApplicationStatus";
import { useDeleteApplication } from "./service/useDeleteApplication";
import ConfirmationModal from "../Jobs/components/ConfirmationModal";
import { getRegions, getDistrictsByRegion } from "../../data/regions";
import "./Applications.scss";
import { toast } from "react-toastify";

const Applications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplications, setSelectedApplications] = useState([]);

  // Modals
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [confirmationConfig, setConfirmationConfig] = useState({});

  const [filters, setFilters] = useState({
    status: "",
    jobTitle: "",
    organizationId: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    // New user filters
    gender: "",
    region: "",
    district: "",
    specialty: "",
    degree: "",
    birthDateFrom: "",
    birthDateTo: "",
  });

  // Debounced filters for search inputs
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter changes for search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.jobTitle, filters]);

  // Update other filters immediately
  useEffect(() => {
    setDebouncedFilters((prev) => ({
      ...prev,
      status: filters.status,
      organizationId: filters.organizationId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      gender: filters.gender,
      region: filters.region,
      district: filters.district,
      degree: filters.degree,
      birthDateFrom: filters.birthDateFrom,
      birthDateTo: filters.birthDateTo,
    }));
  }, [
    filters.status,
    filters.organizationId,
    filters.startDate,
    filters.endDate,
    filters.sortBy,
    filters.sortOrder,
    filters.gender,
    filters.region,
    filters.district,
    filters.degree,
    filters.birthDateFrom,
    filters.birthDateTo,
  ]);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateApplicationStatus();
  const { mutate: deleteApplication, isPending: isDeleting } =
    useDeleteApplication();

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useApplications({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    ...debouncedFilters, // Use debounced filters instead of regular filters
  });

  const applications = applicationsData?.data?.applications || [];
  const meta = applicationsData?.data?.meta || { totalCount: 0, totalPages: 0 };

  // Helper function to get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "https://api.sahifam.uz";
    return `${baseUrl}/uploads/${avatar}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: "Yangi", class: "pending" },
      ACCEPTED: { label: "Qabul qilingan", class: "accepted" },
      REJECTED: { label: "Rad etilgan", class: "rejected" },
      DELETED: { label: "O'chirilgan", class: "deleted" },
    };
    return statusMap[status] || { label: status, class: "pending" };
  };

  const getJobTypeBadge = (type) => {
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

  const getGenderBadge = (gender) => {
    const genderMap = {
      MALE: "Erkak",
      FEMALE: "Ayol",
    };
    return genderMap[gender] || gender;
  };

  const getDegreeBadge = (degree) => {
    const degreeMap = {
      BACHELOR: "Bakalavr",
      MASTER: "Magistr",
      DOCTORATE: "Doktorantura",
      SECONDARY: "O'rta",
      VOCATIONAL: "Kasb-hunar",
    };
    return degreeMap[degree] || degree;
  };

  // Helper function to get user private info
  const getUserPrivateInfo = (user) => {
    return user?.UserPrivateInfo || {};
  };

  const handleViewApplication = (e, application) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("View application clicked:", application);
    navigate(`/applications/${application.id}`);
  };

  const handleViewUserProfile = (userId) => {
    window.open(`https://hr.jobs.uz/profile/${userId}`, "_blank");
  };

  const handleStatusUpdate = (e, application, newStatus) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("=== STATUS UPDATE DEBUG ===");
    console.log("Application:", application);
    console.log("New status:", newStatus);

    if (!application || !application.id) {
      console.error("Invalid application object:", application);
      toast.error("Noto'g'ri ariza ma'lumotlari");
      return;
    }

    setSelectedApplication(application);
    setConfirmationConfig({
      title: `Ariza holatini o'zgartirish`,
      message: `${
        application.user?.phoneNumber || "Nomzod"
      } foydalanuvchisining arizasini "${
        getStatusBadge(newStatus).label
      }" holatiga o'zgartirishni xohlaysizmi?`,
      confirmText: "O'zgartirish",
      type: newStatus === "ACCEPTED" ? "edit" : "warning",
      onConfirm: () => {
        console.log(
          "Confirming status update for application ID:",
          application.id
        );
        updateStatus(
          {
            applicationId: application.id,
            status: newStatus,
          },
          {
            onSuccess: (data) => {
              console.log("Status update successful:", data);
              closeModals();
              refetch();
            },
            onError: (error) => {
              console.error("Status update failed:", error);
              closeModals();
            },
          }
        );
      },
    });
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteApplication = (e, application) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("=== DELETE APPLICATION DEBUG ===");
    console.log("Application:", application);

    if (!application || !application.id) {
      console.error("Invalid application object:", application);
      toast.error("Noto'g'ri ariza ma'lumotlari");
      return;
    }

    setSelectedApplication(application);
    setConfirmationConfig({
      title: "Arizani o'chirish",
      message: `${
        application.user?.phoneNumber || "Nomzod"
      } foydalanuvchisining arizasini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`,
      confirmText: "O'chirish",
      type: "danger",
      onConfirm: () => {
        console.log("Confirming delete for application ID:", application.id);
        deleteApplication(application.id, {
          onSuccess: (data) => {
            console.log("Delete successful:", data);
            closeModals();
            refetch();
          },
          onError: (error) => {
            console.error("Delete failed:", error);
            closeModals();
          },
        });
      },
    });
    setIsConfirmationModalOpen(true);
  };

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app.id));
    }
  };

  const closeModals = () => {
    setIsConfirmationModalOpen(false);
    setSelectedApplication(null);
    setConfirmationConfig({});
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      jobTitle: "",
      organizationId: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      gender: "",
      region: "",
      district: "",
      specialty: "",
      degree: "",
      birthDateFrom: "",
      birthDateTo: "",
    };
    setFilters(clearedFilters);
    setDebouncedFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleRegionChange = (region) => {
    handleFilterChange({
      ...filters,
      region: region,
      district: "", // Reset district when region changes
    });
  };

  // Reset page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, debouncedFilters]);

  if (isLoading) {
    return (
      <div className="applications-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha arizalarni boshqaring</p>
            </div>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Arizalar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha arizalarni boshqaring</p>
            </div>
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

  return (
    <div className="applications-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <p className="page-subtitle">Barcha arizalarni boshqaring</p>
          </div>
          {/* <div className="stats">
            <div className="stat-item">
              <FileText size={20} />
              <span>Jami: {meta.totalCount}</span>
            </div>
          </div> */}
        </div>
      </div>

      <div className="page-content">
        <div className="filter-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`filter-btn ${isFiltersModalOpen ? "active" : ""}`}
            onClick={() => setIsFiltersModalOpen(!isFiltersModalOpen)}
          >
            <Filter size={20} />
            Filterlar
          </button>
        </div>

        {isFiltersModalOpen && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <div className="filter-header">
                  <Filter size={20} className="filter-icon" />
                  <label>Ariza holati</label>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">Barchasi</option>
                  <option value="PENDING">Yangi</option>
                  <option value="ACCEPTED">Qabul qilingan</option>
                  <option value="REJECTED">Rad etilgan</option>
                  <option value="DELETED">O'chirilgan</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <FileText size={20} className="filter-icon" />
                  <label>Ish nomi</label>
                </div>
                <input
                  type="text"
                  placeholder="Ish nomini kiriting"
                  value={filters.jobTitle}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, jobTitle: e.target.value })
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <User size={20} className="filter-icon" />
                  <label>Nomzod jinsi</label>
                </div>
                <select
                  value={filters.gender}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, gender: e.target.value })
                  }
                >
                  <option value="">Barchasi</option>
                  <option value="MALE">Erkak</option>
                  <option value="FEMALE">Ayol</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <MapPin size={20} className="filter-icon" />
                  <label>Nomzod viloyati</label>
                </div>
                <select
                  value={filters.region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">Barcha viloyatlar</option>
                  {getRegions().map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <MapPin size={20} className="filter-icon" />
                  <label>Nomzod tumani</label>
                </div>
                <select
                  value={filters.district}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, district: e.target.value })
                  }
                  disabled={!filters.region}
                >
                  <option value="">Barcha tumanlar</option>
                  {filters.region &&
                    getDistrictsByRegion(filters.region).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <GraduationCap size={20} className="filter-icon" />
                  <label>Nomzod mutaxassisligi</label>
                </div>
                <input
                  type="text"
                  placeholder="Mutaxassislik nomini kiriting"
                  value={filters.specialty}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      specialty: e.target.value,
                    })
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <GraduationCap size={20} className="filter-icon" />
                  <label>Nomzod ta'lim darajasi</label>
                </div>
                <select
                  value={filters.degree}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, degree: e.target.value })
                  }
                >
                  <option value="">Barchasi</option>
                  <option value="SECONDARY">O'rta</option>
                  <option value="VOCATIONAL">Kasb-hunar</option>
                  <option value="BACHELOR">Bakalavr</option>
                  <option value="MASTER">Magistr</option>
                  <option value="DOCTORATE">Doktorantura</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <Calendar size={20} className="filter-icon" />
                  <label>Nomzod tug'ilgan yil (dan)</label>
                </div>
                <input
                  type="date"
                  value={filters.birthDateFrom}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      birthDateFrom: e.target.value,
                    })
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <Calendar size={20} className="filter-icon" />
                  <label>Nomzod tug'ilgan yil (gacha)</label>
                </div>
                <input
                  type="date"
                  value={filters.birthDateTo}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      birthDateTo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <Calendar size={20} className="filter-icon" />
                  <label>Ariza berilgan sana (dan)</label>
                </div>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <Calendar size={20} className="filter-icon" />
                  <label>Ariza berilgan sana (gacha)</label>
                </div>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      endDate: e.target.value,
                    })
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
                      d="M5 10L15 10M5 10L8.33333 13.3333M5 10L8.33333 6.66667M15 10L11.6667 13.3333M15 10L11.6667 6.66667"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <label>Saralash</label>
                </div>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    handleFilterChange({ ...filters, sortBy, sortOrder });
                  }}
                >
                  <option value="createdAt-desc">Yangi arizalar</option>
                  <option value="createdAt-asc">Eski arizalar</option>
                  <option value="status-asc">Holat bo'yicha</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Tozalash
              </button>
              <button
                className="close-filters-btn"
                onClick={() => setIsFiltersModalOpen(false)}
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        <div className="toolbar">
          <div className="bulk-actions">
            {selectedApplications.length > 0 && (
              <span className="selected-count">
                Holatni o'zgartirish({selectedApplications.length})
              </span>
            )}
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="applications-table">
            <div className="table-header">
              <div className="col col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedApplications.length === applications.length}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="col col-id">ID</div>
              <div className="col col-candidate">Nomzod</div>
              <div className="col col-organization">Tashkilot</div>
              <div className="col col-job">Bo'sh ish o'rin</div>
              <div className="col col-date">Ariza berilgan sana</div>
              <div className="col col-status">Holat</div>
              <div className="col col-actions">Amallar</div>
            </div>

            <div className="table-body">
              {applications.map((application, index) => {
                const status = getStatusBadge(application.status);
                const isSelected = selectedApplications.includes(
                  application.id
                );
                const userPrivateInfo = getUserPrivateInfo(application.user);
                const avatarUrl = getAvatarUrl(application.user?.avatar);

                return (
                  <div key={application.id} className="table-row">
                    <div className="col col-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectApplication(application.id)}
                      />
                    </div>

                    <div className="col col-id">
                      <span className="row-number">
                        {(currentPage - 1) * 10 + index + 1}
                      </span>
                    </div>

                    <div className="col col-candidate">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl || "/placeholder.svg"}
                              alt="Avatar"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="avatar-fallback"
                            style={{
                              display: avatarUrl ? "none" : "flex",
                            }}
                          >
                            <User size={20} />
                          </div>
                        </div>
                        <div className="candidate-details">
                          <h4>
                            {application.user?.firstName &&
                            application.user?.lastName
                              ? `${application.user.firstName} ${application.user.lastName}`
                              : application.user?.firstName || "Noma'lum"}
                          </h4>
                          <div className="candidate-meta">
                            <span className="phone">
                              {application.user?.phoneNumber ||
                                "Ko'rsatilmagan"}
                            </span>
                            {userPrivateInfo?.gender && (
                              <span className="gender">
                                {getGenderBadge(userPrivateInfo.gender)}
                              </span>
                            )}
                            {userPrivateInfo?.region && (
                              <span className="region">
                                <MapPin size={12} />
                                {userPrivateInfo.region}
                                {userPrivateInfo?.district &&
                                  `, ${userPrivateInfo.district}`}
                              </span>
                            )}
                            {application.user?.specialty &&
                              application.user.specialty !== null && (
                                <span className="specialty">
                                  <GraduationCap size={12} />
                                  {application.user.specialty}
                                </span>
                              )}
                            {userPrivateInfo?.degree && (
                              <span className="degree">
                                {getDegreeBadge(userPrivateInfo.degree)}
                              </span>
                            )}
                            {userPrivateInfo?.birthDate && (
                              <span className="birth-date">
                                <Calendar size={12} />
                                {new Date(
                                  userPrivateInfo.birthDate
                                ).toLocaleDateString("uz-UZ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col col-organization">
                      <div className="organization-info">
                        <Building size={16} />
                        <span>{application.organization?.title}</span>
                      </div>
                    </div>

                    <div className="col col-job">
                      <div className="job-info">
                        <div className="job-title">
                          {application.job?.title}
                        </div>
                        <div className="job-details">
                          <div className="job-meta">
                            <span className="start-date">
                              Boshlanish:{" "}
                              {new Date(
                                application.job?.startDate
                              ).toLocaleDateString("uz-UZ")}
                            </span>
                            <span className="end-date">
                              Tugash:{" "}
                              {new Date(
                                application.job?.endDate
                              ).toLocaleDateString("uz-UZ")}
                            </span>
                            <span className="location">
                              Yo'nalish:{" "}
                              {getLocationBadge(application.job?.workLocation)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col col-date">
                      <div className="date-info">
                        <span className="date">
                          {new Date(application.createdAt).toLocaleDateString(
                            "uz-UZ"
                          )}
                        </span>
                        <span className="time">
                          {new Date(application.createdAt).toLocaleTimeString(
                            "uz-UZ",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                          title="Batafsil ko'rish"
                          onClick={(e) => handleViewApplication(e, application)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn reject"
                          title="Rad etish"
                          onClick={(e) =>
                            handleStatusUpdate(e, application, "REJECTED")
                          }
                          disabled={isUpdatingStatus}
                        >
                          <X size={16} />
                        </button>
                        <button
                          className="action-btn approve"
                          title="Qabul qilish"
                          onClick={(e) =>
                            handleStatusUpdate(e, application, "ACCEPTED")
                          }
                          disabled={isUpdatingStatus}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="O'chirish"
                          onClick={(e) =>
                            handleDeleteApplication(e, application)
                          }
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
              <FileText size={48} />
            </div>
            <h3>Arizalar topilmadi</h3>
            <p>Hozircha hech qanday ariza yo'q</p>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
              Oldingi
            </button>

            <div className="pagination-info">
              {currentPage} / {meta.totalPages}
            </div>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))
              }
              disabled={currentPage === meta.totalPages}
            >
              Keyingi
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModals}
        onConfirm={confirmationConfig.onConfirm}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        confirmText={confirmationConfig.confirmText}
        type={confirmationConfig.type}
        isLoading={isUpdatingStatus || isDeleting}
      />
    </div>
  );
};

export default Applications;
