"use client";
import {
  X,
  User,
  MapPin,
  Calendar,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
  GraduationCap,
} from "lucide-react";
import "./ApplicationDetailModal.scss";

const ApplicationDetailModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

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
      BOTH: "Farqi yo'q",
      MALE: "Erkak",
      FEMALE: "Ayol",
    };
    return genderMap[gender] || gender;
  };

  const getUserGenderBadge = (gender) => {
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

  const status = getStatusBadge(application.status);

  return (
    <div className="modal-overlay">
      <div className="application-detail-modal">
        <div className="modal-header">
          <div className="header-info">
            <h2>Ariza tafsilotlari</h2>
            <span className={`status-badge ${status.class}`}>
              {status.label}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Candidate Information */}
          <div className="section">
            <h3>
              <User size={18} />
              Nomzod haqida ma'lumot
            </h3>
            <div className="candidate-card">
              <div className="candidate-avatar">
                {application.user?.avatar ? (
                  <img
                    src={application.user.avatar || "/placeholder.svg"}
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
                    display: application.user?.avatar ? "none" : "flex",
                  }}
                >
                  <User size={32} />
                </div>
              </div>
              <div className="candidate-info">
                <h4>
                  {application.user?.firstName && application.user?.lastName
                    ? `${application.user.firstName} ${application.user.lastName}`
                    : application.user?.firstName || "Noma'lum"}
                </h4>
                <div className="info-grid">
                  <div className="info-item">
                    <Phone size={16} />
                    <span>
                      {application.user?.phoneNumber || "Ko'rsatilmagan"}
                    </span>
                  </div>
                  {application.user?.birthDate && (
                    <div className="info-item">
                      <Calendar size={16} />
                      <span>
                        Tug'ilgan kun:{" "}
                        {new Date(
                          application.user.birthDate
                        ).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>
                  )}
                  {application.user?.region && (
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>Viloyat: {application.user.region}</span>
                    </div>
                  )}
                  {application.user?.district && (
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>Tuman: {application.user.district}</span>
                    </div>
                  )}
                  {application.user?.gender && (
                    <div className="info-item">
                      <User size={16} />
                      <span>
                        Jinsi: {getUserGenderBadge(application.user.gender)}
                      </span>
                    </div>
                  )}
                  {application.user?.specialty && (
                    <div className="info-item">
                      <GraduationCap size={16} />
                      <span>Mutaxassislik: {application.user.specialty}</span>
                    </div>
                  )}
                  {application.user?.degree && (
                    <div className="info-item">
                      <GraduationCap size={16} />
                      <span>
                        Ta'lim darajasi:{" "}
                        {getDegreeBadge(application.user.degree)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="section">
            <h3>
              <Building size={18} />
              Tashkilot
            </h3>
            <div className="info-card">
              <div className="info-item">
                <Building size={16} />
                <span>{application.organization?.title}</span>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="section">
            <h3>
              <Briefcase size={18} />
              Ish o'rni haqida
            </h3>
            <div className="job-card">
              <div className="job-header">
                <h4>{application.job?.title}</h4>
                <div className="job-meta">
                  <span className="job-type">
                    {getJobTypeBadge(application.job?.type)}
                  </span>
                  <span className="job-location">
                    {getLocationBadge(application.job?.workLocation)}
                  </span>
                </div>
              </div>

              <div className="job-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <DollarSign size={16} />
                    <div>
                      <span className="label">Maosh</span>
                      <span className="value">
                        {application.job?.salary?.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <div>
                      <span className="label">Ish vaqti</span>
                      <span className="value">
                        {application.job?.workSchedule}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <div>
                      <span className="label">Boshlanish sanasi</span>
                      <span className="value">
                        {new Date(
                          application.job?.startDate
                        ).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <div>
                      <span className="label">Tugash sanasi</span>
                      <span className="value">
                        {new Date(application.job?.endDate).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <User size={16} />
                    <div>
                      <span className="label">Jins talabi</span>
                      <span className="value">
                        {getGenderBadge(application.job?.gender)}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <div>
                      <span className="label">Lavozim</span>
                      <span className="value">
                        {application.job?.position || "Ko'rsatilmagan"}
                      </span>
                    </div>
                  </div>
                </div>

                {application.job?.description && (
                  <div className="job-description">
                    <h5>Tavsif</h5>
                    <p>{application.job.description}</p>
                  </div>
                )}

                {application.job?.requirements && (
                  <div className="job-requirements">
                    <h5>Talablar</h5>
                    <div className="formatted-text">
                      {application.job.requirements
                        .split("\n")
                        .map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="section">
            <h3>
              <FileText size={18} />
              Ariza vaqti
            </h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h5>Ariza yuborilgan</h5>
                  <p>
                    {new Date(application.createdAt).toLocaleDateString(
                      "uz-UZ"
                    )}{" "}
                    -{" "}
                    {new Date(application.createdAt).toLocaleTimeString(
                      "uz-UZ",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
