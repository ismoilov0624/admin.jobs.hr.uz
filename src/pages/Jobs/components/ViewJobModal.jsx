"use client";
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Building,
} from "lucide-react";
import "./ViewJobModal.scss";

const ViewJobModal = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

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

  const getGenderBadge = (gender) => {
    const genderMap = {
      BOTH: "Farqi yo'q",
      MALE: "Erkak",
      FEMALE: "Ayol",
    };
    return genderMap[gender] || gender;
  };

  const status = getStatusBadge(job.status);

  return (
    <div className="modal-overlay">
      <div className="view-modal-content">
        <div className="modal-header">
          <div className="header-info">
            <h2>{job.title}</h2>
            <span className={`status-badge ${status.class}`}>
              {status.label}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="job-overview">
            <div className="overview-grid">
              <div className="overview-item">
                <DollarSign size={20} />
                <div>
                  <span className="label">Maosh</span>
                  <span className="value">
                    {job.salary?.toLocaleString()} so'm
                  </span>
                </div>
              </div>

              <div className="overview-item">
                <MapPin size={20} />
                <div>
                  <span className="label">Joylashuv</span>
                  <span className="value">
                    {getLocationBadge(job.workLocation)}
                  </span>
                </div>
              </div>

              <div className="overview-item">
                <Clock size={20} />
                <div>
                  <span className="label">Ish turi</span>
                  <span className="value">{getTypeBadge(job.type)}</span>
                </div>
              </div>

              <div className="overview-item">
                <Users size={20} />
                <div>
                  <span className="label">Jins</span>
                  <span className="value">{getGenderBadge(job.gender)}</span>
                </div>
              </div>

              <div className="overview-item">
                <Building size={20} />
                <div>
                  <span className="label">Bo'lim</span>
                  <span className="value">
                    {job.department || "Ko'rsatilmagan"}
                  </span>
                </div>
              </div>

              <div className="overview-item">
                <Calendar size={20} />
                <div>
                  <span className="label">Yaratilgan</span>
                  <span className="value">
                    {new Date(job.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="job-details">
            <div className="detail-section">
              <h3>Asosiy ma'lumotlar</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Lavozim:</span>
                  <span className="detail-value">
                    {job.position || "Ko'rsatilmagan"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mutaxassislik:</span>
                  <span className="detail-value">
                    {job.speciality || "Ko'rsatilmagan"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ish vaqti:</span>
                  <span className="detail-value">{job.workSchedule}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Boshlanish sanasi:</span>
                  <span className="detail-value">
                    {new Date(job.startDate).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tugash sanasi:</span>
                  <span className="detail-value">
                    {new Date(job.endDate).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Tavsif</h3>
              <p className="detail-text">{job.description}</p>
            </div>

            <div className="detail-section">
              <h3>Talablar</h3>
              <div className="detail-text formatted-text">
                {job.requirements?.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Mas'uliyatlar</h3>
              <div className="detail-text formatted-text">
                {job.responsibilities?.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Sharoitlar</h3>
              <div className="detail-text formatted-text">
                {job.conditions?.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;
