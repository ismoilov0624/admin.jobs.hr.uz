"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Building,
  FileText,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useUpdateJob } from "../service/useUpdateJob";
import "./CreateJobModal.scss";

const EditJobModal = ({ isOpen, onClose, job }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { mutate: updateJob, isPending } = useUpdateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (job && isOpen) {
      // Reset form with job data
      reset({
        title: job.title || "",
        salary: job.salary || "",
        type: job.type || "FULL_TIME",
        workSchedule: job.workSchedule || "",
        workLocation: job.workLocation || "OFFICE",
        gender: job.gender || "BOTH",
        startDate: job.startDate ? job.startDate.split("T")[0] : "",
        endDate: job.endDate ? job.endDate.split("T")[0] : "",
        department: job.department || "",
        position: job.position || "",
        speciality: job.speciality || "",
        description: job.description || "",
        requirements: job.requirements || "",
        responsibilities: job.responsibilities || "",
        conditions: job.conditions || "",
        status: job.status || "ACTIVE",
      });

      // Set existing image preview if available
      if (job.avatar) {
        const avatarUrl = job.avatar.startsWith("http")
          ? job.avatar
          : `https://api.sahifam.uz/uploads/${job.avatar}`;
        setImagePreview(avatarUrl);
      } else {
        setImagePreview(null);
      }
      setSelectedImage(null);
    }
  }, [job, isOpen, reset]);

  if (!isOpen || !job) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setValue("avatar", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("avatar", null);
  };

  const onSubmit = (data) => {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all form fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        if (key === "avatar" && selectedImage) {
          formData.append(key, selectedImage);
        } else if (key !== "avatar") {
          formData.append(key, String(data[key]));
        }
      }
    });

    updateJob(
      {
        jobId: job.id,
        jobData: formData,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Ish o'rnini tahrirlash</h2>
          <button
            className="close-btn"
            onClick={handleClose}
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="job-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>
                <Briefcase size={18} />
                Asosiy ma'lumotlar
              </h3>

              <div className="form-group">
                <label>Ish nomi *</label>
                <input
                  type="text"
                  placeholder="Ish nomini kiriting"
                  {...register("title", {
                    required: "Ish nomi majburiy",
                  })}
                  className={errors.title ? "error" : ""}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Maosh</label>
                <input
                  type="text"
                  placeholder="Masalan: 5,000,000 so'm yoki kelishilgan holda"
                  {...register("salary")}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ish turi *</label>
                  <select
                    {...register("type", {
                      required: "Ish turi majburiy",
                    })}
                    className={errors.type ? "error" : ""}
                  >
                    <option value="FULL_TIME">To'liq vaqt</option>
                    <option value="PART_TIME">Yarim vaqt</option>
                    <option value="FREELANCE">Frilanser</option>
                    <option value="INTERNSHIP">Amaliyot</option>
                  </select>
                  {errors.type && (
                    <span className="error-message">{errors.type.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Ish joyi *</label>
                  <select
                    {...register("workLocation", {
                      required: "Ish joyi majburiy",
                    })}
                    className={errors.workLocation ? "error" : ""}
                  >
                    <option value="OFFICE">Ofis</option>
                    <option value="REMOTE">Masofaviy</option>
                    <option value="HYBRID">Aralash</option>
                  </select>
                  {errors.workLocation && (
                    <span className="error-message">
                      {errors.workLocation.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Ish vaqti *</label>
                <input
                  type="text"
                  placeholder="Masalan: Dushanba-Juma, 9:00-18:00"
                  {...register("workSchedule", {
                    required: "Ish vaqti majburiy",
                  })}
                  className={errors.workSchedule ? "error" : ""}
                />
                {errors.workSchedule && (
                  <span className="error-message">
                    {errors.workSchedule.message}
                  </span>
                )}
              </div>
            </div>

            {/* Company Information */}
            <div className="form-section">
              <h3>
                <Building size={18} />
                Kompaniya ma'lumotlari
              </h3>

              <div className="form-group">
                <label>Bo'lim</label>
                <input
                  type="text"
                  placeholder="Bo'lim nomini kiriting"
                  {...register("department")}
                />
              </div>

              <div className="form-group">
                <label>Lavozim</label>
                <input
                  type="text"
                  placeholder="Lavozim nomini kiriting"
                  {...register("position")}
                />
              </div>

              <div className="form-group">
                <label>Mutaxassislik</label>
                <input
                  type="text"
                  placeholder="Mutaxassislik nomini kiriting"
                  {...register("speciality")}
                />
              </div>

              <div className="form-group">
                <label>Jins talabi</label>
                <select {...register("gender")}>
                  <option value="BOTH">Farqi yo'q</option>
                  <option value="MALE">Erkak</option>
                  <option value="FEMALE">Ayol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="form-section full-width">
            <h3>
              <Calendar size={18} />
              Sanalar
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Boshlanish sanasi *</label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Boshlanish sanasi majburiy",
                  })}
                  className={errors.startDate ? "error" : ""}
                />
                {errors.startDate && (
                  <span className="error-message">
                    {errors.startDate.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Tugash sanasi *</label>
                <input
                  type="date"
                  {...register("endDate", {
                    required: "Tugash sanasi majburiy",
                  })}
                  className={errors.endDate ? "error" : ""}
                />
                {errors.endDate && (
                  <span className="error-message">
                    {errors.endDate.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section full-width">
            <h3>
              <ImageIcon size={18} />
              Rasm yuklash
            </h3>

            <div className="image-upload-section">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <div className="image-upload-label">
                    <Upload size={24} />
                    <span>Rasm yuklash</span>
                    <small>PNG, JPG, JPEG (max 5MB)</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="form-section full-width">
            <h3>
              <FileText size={18} />
              Tavsiflar
            </h3>

            <div className="form-group">
              <label>Ish haqida tavsif</label>
              <textarea
                placeholder="Ish haqida batafsil ma'lumot kiriting"
                {...register("description")}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Talablar</label>
              <textarea
                placeholder="Nomzodga qo'yiladigan talablarni kiriting"
                {...register("requirements")}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Mas'uliyatlar</label>
              <textarea
                placeholder="Ish mas'uliyatlarini kiriting"
                {...register("responsibilities")}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Sharoitlar</label>
              <textarea
                placeholder="Ish sharoitlari haqida ma'lumot kiriting"
                {...register("conditions")}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Holat</label>
              <select {...register("status")}>
                <option value="ACTIVE">Faol</option>
                <option value="INACTIVE">Nofaol</option>
                <option value="DRAFT">Qoralama</option>
                <option value="CLOSED">Yopiq</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={isPending}
            >
              Bekor qilish
            </button>
            <button type="submit" className="submit-btn" disabled={isPending}>
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
