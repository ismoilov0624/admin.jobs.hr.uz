"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Users,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { useCandidates } from "./service/useCandidates";
import { getRegions, getDistrictsByRegion } from "../../data/regions";
import "./Candidates.scss";

const Candidates = () => {
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
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    specialty: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    // New user filters
    gender: "",
    region: "",
    district: "",
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
  }, [filters]);

  // Update other filters immediately
  useEffect(() => {
    setDebouncedFilters((prev) => ({
      ...prev,
      status: filters.status,
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
    filters.sortBy,
    filters.sortOrder,
    filters.gender,
    filters.region,
    filters.district,
    filters.degree,
    filters.birthDateFrom,
    filters.birthDateTo,
  ]);

  const {
    data: candidatesData,
    isLoading,
    error,
    refetch,
  } = useCandidates({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    ...debouncedFilters, // Use debounced filters instead of regular filters
  });

  // Reset page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, debouncedFilters]);

  const candidates = candidatesData?.data?.users || [];
  const meta = candidatesData?.data?.meta || { totalCount: 0, totalPages: 0 };

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
      EMPLOYED: { label: "Ishlamoqda", class: "employed" },
      UNEMPLOYED: { label: "Ishsiz", class: "unemployed" },
    };
    return statusMap[status] || { label: status, class: "unemployed" };
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

  const handleViewCandidate = (candidate) => {
    // Redirect to external profile URL instead of internal route
    window.open(
      `https://jobs-hr.uz/profile/personal-infos/${candidate.id}`,
      "_blank"
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      specialty: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      gender: "",
      region: "",
      district: "",
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

  if (isLoading) {
    return (
      <div className="candidates-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha nomzodlarni boshqaring</p>
            </div>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Nomzodlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidates-page">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <p className="page-subtitle">Barcha nomzodlarni boshqaring</p>
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
    <div className="candidates-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <p className="page-subtitle">Barcha nomzodlarni boshqaring</p>
          </div>
          <div className="stats">
            <div className="stat-item">
              <Users size={20} />
              <span>Jami: {meta.totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="filter-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Ism, familiya yoki mutaxassislik bo'yicha qidirish..."
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
                  <label>Ish holati</label>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">Barchasi</option>
                  <option value="EMPLOYED">Ishlamoqda</option>
                  <option value="UNEMPLOYED">Ishsiz</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <User size={20} className="filter-icon" />
                  <label>Jins</label>
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
                  <label>Viloyat</label>
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
                  <label>Tuman/Shahar</label>
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
                  <UserCheck size={20} className="filter-icon" />
                  <label>Mutaxassislik</label>
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
                  <label>Ta'lim darajasi</label>
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
                  <label>Tug'ilgan yil (dan)</label>
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
                  <label>Tug'ilgan yil (gacha)</label>
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
                  <option value="createdAt-desc">
                    Yangi ro'yxatdan o'tganlar
                  </option>
                  <option value="createdAt-asc">
                    Eski ro'yxatdan o'tganlar
                  </option>
                  <option value="firstName-asc">Ism bo'yicha (A-Z)</option>
                  <option value="firstName-desc">Ism bo'yicha (Z-A)</option>
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
          <div className="results-info">
            <span>{candidates.length} ta nomzod topildi</span>
          </div>
        </div>

        {candidates.length > 0 ? (
          <div className="candidates-table">
            <div className="table-header">
              <div className="col col-id">ID</div>
              <div className="col col-candidate">Nomzod</div>
              <div className="col col-info">Ma'lumotlar</div>
              <div className="col col-specialty">Mutaxassislik</div>
              <div className="col col-status">Holat</div>
              <div className="col col-actions">Amallar</div>
            </div>

            <div className="table-body">
              {candidates.map((candidate, index) => {
                const status = getStatusBadge(candidate.status);
                const userPrivateInfo = getUserPrivateInfo(candidate);
                const avatarUrl = getAvatarUrl(candidate.avatar);

                return (
                  <div key={candidate.id} className="table-row">
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
                            {candidate.firstName && candidate.lastName
                              ? `${candidate.firstName} ${candidate.lastName}`
                              : candidate.firstName || "Noma'lum"}
                          </h4>
                          <span className="candidate-id">
                            ID: {candidate.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col col-info">
                      <div className="candidate-meta">
                        {userPrivateInfo?.gender && (
                          <span className="meta-item gender">
                            <User size={12} />
                            {getGenderBadge(userPrivateInfo.gender)}
                          </span>
                        )}
                        {userPrivateInfo?.birthDate && (
                          <span className="meta-item birth-date">
                            <Calendar size={12} />
                            {new Date(
                              userPrivateInfo.birthDate
                            ).toLocaleDateString("uz-UZ")}
                          </span>
                        )}
                        {userPrivateInfo?.region && (
                          <span className="meta-item region">
                            <MapPin size={12} />
                            {userPrivateInfo.region}
                            {userPrivateInfo?.district &&
                              `, ${userPrivateInfo.district}`}
                          </span>
                        )}
                        {userPrivateInfo?.degree && (
                          <span className="meta-item degree">
                            <GraduationCap size={12} />
                            {getDegreeBadge(userPrivateInfo.degree)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col col-specialty">
                      <span className="specialty">
                        {candidate.specialty && candidate.specialty !== null
                          ? candidate.specialty
                          : "Ko'rsatilmagan"}
                      </span>
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
                          title="Profilni ko'rish"
                          onClick={() => handleViewCandidate(candidate)}
                        >
                          <Eye size={16} />
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
              <UserCheck size={48} />
            </div>
            <h3>Nomzodlar topilmadi</h3>
            <p>Qidiruv mezonlariga mos nomzodlar mavjud emas</p>
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
    </div>
  );
};

export default Candidates;
