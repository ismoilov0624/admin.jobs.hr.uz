"use client";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  ExternalLink,
  Briefcase,
  Calendar,
  Award,
  MapPin,
} from "lucide-react";
import { useCandidateDetail } from "./service/useCandidateDetail";
import "./CandidateDetail.scss";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: candidateData,
    isLoading,
    error,
    refetch,
  } = useCandidateDetail(id);

  const candidate = candidateData?.data;

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

  const handleViewProfile = () => {
    window.open(`https://jobs-hr.uz/profile/${id}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="candidate-detail-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/candidates")}>
            <ArrowLeft size={20} />
            Orqaga
          </button>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Nomzod ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-detail-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/candidates")}>
            <ArrowLeft size={20} />
            Orqaga
          </button>
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

  if (!candidate) {
    return (
      <div className="candidate-detail-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/candidates")}>
            <ArrowLeft size={20} />
            Orqaga
          </button>
        </div>
        <div className="error-state">
          <p>Nomzod topilmadi</p>
        </div>
      </div>
    );
  }

  const status = getStatusBadge(candidate.status);
  const userPrivateInfo = getUserPrivateInfo(candidate);
  const avatarUrl = getAvatarUrl(candidate.avatar);

  return (
    <div className="candidate-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/candidates")}>
          <ArrowLeft size={20} />
          Orqaga
        </button>
        <button className="view-profile-btn" onClick={handleViewProfile}>
          <ExternalLink size={20} />
          Profilni ko'rish
        </button>
      </div>

      <div className="page-content">
        {/* Candidate Profile Card */}
        <div className="candidate-profile-card">
          <div className="profile-header">
            <div className="avatar-section">
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
                  style={{ display: avatarUrl ? "none" : "flex" }}
                >
                  <User size={48} />
                </div>
              </div>
            </div>

            <div className="profile-info">
              <h1>
                {candidate.firstName && candidate.lastName
                  ? `${candidate.firstName} ${candidate.lastName}`
                  : candidate.firstName || "Noma'lum"}
              </h1>
              <div className="profile-meta">
                <span className={`status-badge ${status.class}`}>
                  {status.label}
                </span>
                {candidate.specialty && (
                  <span className="specialty">
                    <Award size={16} />
                    {candidate.specialty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Information */}
        <div className="info-sections">
          <div className="info-section">
            <h3>
              <User size={18} />
              Shaxsiy ma'lumotlar
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{candidate.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Ism:</span>
                <span className="value">
                  {candidate.firstName || "Ko'rsatilmagan"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Familiya:</span>
                <span className="value">
                  {candidate.lastName || "Ko'rsatilmagan"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Holat:</span>
                <span className={`status-badge ${status.class}`}>
                  {status.label}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Mutaxassislik:</span>
                <span className="value">
                  {candidate.specialty || "Ko'rsatilmagan"}
                </span>
              </div>
              {userPrivateInfo?.gender && (
                <div className="info-item">
                  <span className="label">Jins:</span>
                  <span className="value">
                    {getGenderBadge(userPrivateInfo.gender)}
                  </span>
                </div>
              )}
              {userPrivateInfo?.birthDate && (
                <div className="info-item">
                  <span className="label">Tug'ilgan sana:</span>
                  <span className="value">
                    {new Date(userPrivateInfo.birthDate).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </span>
                </div>
              )}
              {userPrivateInfo?.region && (
                <div className="info-item">
                  <span className="label">Viloyat:</span>
                  <span className="value">{userPrivateInfo.region}</span>
                </div>
              )}
              {userPrivateInfo?.district && (
                <div className="info-item">
                  <span className="label">Tuman/Shahar:</span>
                  <span className="value">{userPrivateInfo.district}</span>
                </div>
              )}
              {userPrivateInfo?.degree && (
                <div className="info-item">
                  <span className="label">Ta'lim darajasi:</span>
                  <span className="value">
                    {getDegreeBadge(userPrivateInfo.degree)}
                  </span>
                </div>
              )}
              {userPrivateInfo?.citizenship && (
                <div className="info-item">
                  <span className="label">Fuqarolik:</span>
                  <span className="value">{userPrivateInfo.citizenship}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional sections can be added here when more data is available */}
          <div className="info-section">
            <h3>
              <Briefcase size={18} />
              Kasbiy ma'lumotlar
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Ish holati:</span>
                <span className={`status-badge ${status.class}`}>
                  {status.label}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Mutaxassislik:</span>
                <span className="value">
                  {candidate.specialty || "Ko'rsatilmagan"}
                </span>
              </div>
              {userPrivateInfo?.degree && (
                <div className="info-item">
                  <span className="label">Ta'lim darajasi:</span>
                  <span className="value">
                    {getDegreeBadge(userPrivateInfo.degree)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>
              <MapPin size={18} />
              Manzil ma'lumotlari
            </h3>
            <div className="info-grid">
              {userPrivateInfo?.region && (
                <div className="info-item">
                  <span className="label">Viloyat:</span>
                  <span className="value">{userPrivateInfo.region}</span>
                </div>
              )}
              {userPrivateInfo?.district && (
                <div className="info-item">
                  <span className="label">Tuman/Shahar:</span>
                  <span className="value">{userPrivateInfo.district}</span>
                </div>
              )}
              {userPrivateInfo?.citizenship && (
                <div className="info-item">
                  <span className="label">Fuqarolik:</span>
                  <span className="value">{userPrivateInfo.citizenship}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>
              <Calendar size={18} />
              Tizim ma'lumotlari
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Ro'yxatdan o'tgan:</span>
                <span className="value">
                  {candidate.createdAt
                    ? new Date(candidate.createdAt).toLocaleDateString("uz-UZ")
                    : "Ma'lum emas"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Oxirgi yangilanish:</span>
                <span className="value">
                  {candidate.updatedAt
                    ? new Date(candidate.updatedAt).toLocaleDateString("uz-UZ")
                    : "Ma'lum emas"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile View Section */}
        <div className="profile-view-section">
          <h3>To'liq profil</h3>
          <p>
            Nomzodning to'liq profilini ko'rish uchun hr.jobs.uz saytiga o'ting
          </p>
          <button
            className="view-profile-btn large"
            onClick={handleViewProfile}
          >
            <ExternalLink size={20} />
            hr.jobs.uz da profilni ko'rish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
