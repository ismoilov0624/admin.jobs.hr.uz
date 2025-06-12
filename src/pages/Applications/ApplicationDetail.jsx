"use client";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Building,
  FileText,
  Phone,
  BadgeIcon as IdCard,
  Users,
  Target,
  CheckCircle,
  Globe,
  Award,
  GraduationCap,
} from "lucide-react";
import { useApplicationDetail } from "./service/useApplicationDetail";
import "./ApplicationDetail.scss";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: applicationData, isLoading, error } = useApplicationDetail(id);

  // Helper function to get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "https://api.sahifam.uz";
    return `${baseUrl}/uploads/${avatar}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belgilanmagan";
    return new Date(dateString).toLocaleDateString("uz-UZ");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";
      case "ACCEPTED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "REVIEW":
        return "review";
      default:
        return "pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Kutilmoqda";
      case "ACCEPTED":
        return "Tasdiqlangan";
      case "REJECTED":
        return "Rad etilgan";
      case "REVIEW":
        return "Ko'rib chiqilmoqda";
      default:
        return "Kutilmoqda";
    }
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
      BOTH: "Farqi yo'q",
      MALE: "Erkak",
      FEMALE: "Ayol",
    };
    return genderMap[gender] || gender;
  };

  const getLanguageLevelBadge = (level) => {
    const levelMap = {
      BEGINNER: "Boshlang'ich",
      ELEMENTARY: "Elementar",
      INTERMEDIATE: "O'rta",
      UPPER_INTERMEDIATE: "Yuqori o'rta",
      ADVANCED: "Ilg'or",
      PROFICIENT: "Mukammal",
      NATIVE: "Ona tili",
    };
    return levelMap[level] || level;
  };

  const getDegreeBadge = (degree) => {
    const degreeMap = {
      BACHELOR: "Bakalavr",
      MASTER: "Magistr",
      DOCTORATE: "Doktorantura",
      ASSOCIATE: "O'rta maxsus",
      OTHER: "Boshqa",
    };
    return degreeMap[degree] || degree;
  };

  if (isLoading) {
    return (
      <div className="application-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-detail-page">
        <div className="error-state">
          <p>Xatolik yuz berdi: {error.message}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!applicationData?.data?.application) {
    return (
      <div className="application-detail-page">
        <div className="error-state">
          <p>Ariza topilmadi</p>
          <button
            className="retry-btn"
            onClick={() => navigate("/applications")}
          >
            Arizalar ro'yxatiga qaytish
          </button>
        </div>
      </div>
    );
  }

  const application = applicationData.data.application;
  const job = application.job || {};
  const user = application.user || {};
  const organization = application.organization || {};
  const avatarUrl = getAvatarUrl(user.avatar);

  return (
    <div className="application-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/applications")}>
          <ArrowLeft size={20} />
          Orqaga
        </button>
        <button
          className="view-profile-btn"
          onClick={() =>
            window.open(`https://hr.jobs.uz/profile/${user.id}`, "_blank")
          }
        >
          <User size={20} />
          Profilni ko'rish
        </button>
      </div>

      <div className="page-content">
        <div className="application-status-card">
          <div className="status-header">
            <h1>Ariza tafsilotlari</h1>
            <span
              className={`status-badge ${getStatusBadgeClass(
                application.status
              )}`}
            >
              {getStatusText(application.status)}
            </span>
          </div>
          <div className="application-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>Yuborilgan: {formatDate(application.createdAt)}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>Yangilangan: {formatDate(application.updatedAt)}</span>
            </div>
            <div className="meta-item">
              <IdCard size={16} />
              <span>ID: {application.id?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <div className="info-sections">
          {/* Nomzod haqida ma'lumot */}
          <div className="info-section candidate-info-section">
            <h3>
              <User size={18} />
              Nomzod haqida ma'lumot
            </h3>
            <div className="candidate-detail-card">
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
                  <User size={32} />
                </div>
              </div>
              <div className="candidate-details">
                <h4>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Noma'lum foydalanuvchi"}
                </h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <Phone size={18} />
                    <div>
                      <span className="label">Telefon</span>
                      <span className="value">
                        {user.phoneNumber || "Belgilanmagan"}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <IdCard size={18} />
                    <div>
                      <span className="label">ID</span>
                      <span className="value">{user.id?.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ta'lim ma'lumotlari */}
          <div className="info-section education-section">
            <h3>
              <GraduationCap size={18} />
              Ta'lim ma'lumotlari
            </h3>
            <div className="education-list">
              {user.UserEducation && user.UserEducation.length > 0 ? (
                user.UserEducation.map((education, index) => (
                  <div key={index} className="education-item">
                    <div className="education-header">
                      <h4>
                        {education.institution ||
                          "Ta'lim muassasasi ko'rsatilmagan"}
                      </h4>
                      <span className="education-period">
                        {education.startYear && education.endYear
                          ? `${education.startYear} - ${education.endYear}`
                          : education.startYear
                          ? `${education.startYear} dan`
                          : "Davr ko'rsatilmagan"}
                      </span>
                    </div>
                    <div className="education-details">
                      {education.degree && (
                        <div className="education-field">
                          <span className="field-label">Daraja:</span>
                          <span className="field-value">
                            {getDegreeBadge(education.degree)}
                          </span>
                        </div>
                      )}
                      {education.fieldOfStudy && (
                        <div className="education-field">
                          <span className="field-label">Yo'nalish:</span>
                          <span className="field-value">
                            {education.fieldOfStudy}
                          </span>
                        </div>
                      )}
                      {education.description && (
                        <div className="education-field">
                          <span className="field-label">Tavsif:</span>
                          <span className="field-value">
                            {education.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <p>Ta'lim ma'lumotlari kiritilmagan</p>
                </div>
              )}
            </div>
          </div>

          {/* Ish tajribasi */}
          <div className="info-section experience-section">
            <h3>
              <Briefcase size={18} />
              Ish tajribasi
            </h3>
            <div className="experience-list">
              {user.UserExperience && user.UserExperience.length > 0 ? (
                user.UserExperience.map((experience, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <h4>{experience.position || "Lavozim ko'rsatilmagan"}</h4>
                      <span className="experience-period">
                        {experience.startDate && experience.endDate
                          ? `${new Date(
                              experience.startDate
                            ).toLocaleDateString("uz-UZ")} - ${new Date(
                              experience.endDate
                            ).toLocaleDateString("uz-UZ")}`
                          : experience.startDate
                          ? `${new Date(
                              experience.startDate
                            ).toLocaleDateString("uz-UZ")} dan`
                          : "Davr ko'rsatilmagan"}
                      </span>
                    </div>
                    <div className="experience-details">
                      {experience.company && (
                        <div className="experience-field">
                          <span className="field-label">Kompaniya:</span>
                          <span className="field-value">
                            {experience.company}
                          </span>
                        </div>
                      )}
                      {experience.location && (
                        <div className="experience-field">
                          <span className="field-label">Joylashuv:</span>
                          <span className="field-value">
                            {experience.location}
                          </span>
                        </div>
                      )}
                      {experience.description && (
                        <div className="experience-field">
                          <span className="field-label">Tavsif:</span>
                          <span className="field-value">
                            {experience.description}
                          </span>
                        </div>
                      )}
                      {experience.isCurrent && (
                        <div className="experience-field">
                          <span className="current-badge">
                            Hozirda ishlaydi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <p>Ish tajribasi ma'lumotlari kiritilmagan</p>
                </div>
              )}
            </div>
          </div>

          {/* Til bilimi */}
          <div className="info-section language-section">
            <h3>
              <Globe size={18} />
              Til bilimi
            </h3>
            <div className="language-list">
              {user.UserLanguage && user.UserLanguage.length > 0 ? (
                <div className="language-grid">
                  {user.UserLanguage.map((language, index) => (
                    <div key={index} className="language-item">
                      <div className="language-name">
                        {language.language || "Til ko'rsatilmagan"}
                      </div>
                      <div className="language-level">
                        {language.level ? (
                          <span
                            className={`level-badge level-${language.level.toLowerCase()}`}
                          >
                            {getLanguageLevelBadge(language.level)}
                          </span>
                        ) : (
                          <span className="level-badge level-unknown">
                            Daraja ko'rsatilmagan
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-small">
                  <p>Til bilimi ma'lumotlari kiritilmagan</p>
                </div>
              )}
            </div>
          </div>

          {/* Tashkilot */}
          <div className="info-section organization-section">
            <h3>
              <Building size={18} />
              Tashkilot
            </h3>
            <div className="organization-card">
              <div className="org-info">
                <div className="org-item">
                  <Building size={18} />
                  <span>{organization.title || "Belgilanmagan"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ish o'rni haqida */}
          <div className="info-section job-info-section">
            <h3>
              <Briefcase size={18} />
              Ish o'rni haqida
            </h3>
            <div className="job-detail-card">
              <div className="job-header">
                <h4>{job.title || "Belgilanmagan"}</h4>
                <div className="job-meta">
                  <span className="job-type">{getJobTypeBadge(job.type)}</span>
                  <span className="job-location">
                    {getLocationBadge(job.workLocation)}
                  </span>
                </div>
              </div>

              <div className="job-details-grid">
                <div className="detail-item">
                  <DollarSign size={18} />
                  <div>
                    <span className="label">Maosh</span>
                    <span className="value">
                      {job.salary
                        ? `${job.salary.toLocaleString()} so'm`
                        : "Belgilanmagan"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Award size={18} />
                  <div>
                    <span className="label">Mutaxassislik</span>
                    <span className="value">
                      {job.speciality || "Belgilanmagan"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <div>
                    <span className="label">Ish vaqti</span>
                    <span className="value">
                      {job.workSchedule || "Belgilanmagan"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <span className="label">Boshlanish sanasi</span>
                    <span className="value">{formatDate(job.startDate)}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <span className="label">Tugash sanasi</span>
                    <span className="value">{formatDate(job.endDate)}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Users size={18} />
                  <div>
                    <span className="label">Jins talabi</span>
                    <span className="value">{getGenderBadge(job.gender)}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Building size={18} />
                  <div>
                    <span className="label">Bo'lim</span>
                    <span className="value">
                      {job.department || "Belgilanmagan"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} />
                  <div>
                    <span className="label">Lavozim</span>
                    <span className="value">
                      {job.position || "Belgilanmagan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description Sections */}
              <div className="job-content-sections">
                <div className="content-section">
                  <h5>
                    <FileText size={18} />
                    Tavsif
                  </h5>
                  <div className="content-text">
                    {job.description ||
                      "Ish haqida batafsil ma'lumot berilmagan."}
                  </div>
                </div>

                <div className="content-section">
                  <h5>
                    <CheckCircle size={18} />
                    Talablar
                  </h5>
                  <div className="content-text">
                    {job.requirements ? (
                      <div className="formatted-list">
                        {job.requirements.split("\n").map((item, index) => (
                          <div key={index} className="list-item">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "Maxsus talablar belgilanmagan."
                    )}
                  </div>
                </div>

                <div className="content-section">
                  <h5>
                    <Target size={18} />
                    Mas'uliyatlar
                  </h5>
                  <div className="content-text">
                    {job.responsibilities ? (
                      <div className="formatted-list">
                        {job.responsibilities.split("\n").map((item, index) => (
                          <div key={index} className="list-item">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "Mas'uliyatlar ro'yxati berilmagan."
                    )}
                  </div>
                </div>

                <div className="content-section">
                  <h5>
                    <Globe size={18} />
                    Sharoitlar
                  </h5>
                  <div className="content-text">
                    {job.conditions ? (
                      <div className="formatted-list">
                        {job.conditions.split("\n").map((item, index) => (
                          <div key={index} className="list-item">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "Ish sharoitlari haqida ma'lumot yo'q."
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* To'liq profil */}
          <div className="info-section profile-link-section">
            <h3>
              <User size={18} />
              To'liq profil
            </h3>
            <div className="profile-link-card">
              <div className="profile-link-content">
                <p>
                  Nomzodning to'liq profilini ko'rish uchun hr.jobs.uz saytiga
                  o'ting
                </p>
                <a
                  href={`https://hr.jobs.uz/profile/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link-btn"
                >
                  <Globe size={18} />
                  hr.jobs.uz da profilni ko'rish
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
