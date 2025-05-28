"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, DollarSign, Clock, FileText } from "lucide-react";
import { useUpdateJob } from "../service/useUpdateJob";
import { useEffect } from "react";
import "./CreateJobModal.scss";

const EditJobModal = ({ isOpen, onClose, job }) => {
  const { mutate: updateJob, isPending } = useUpdateJob();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      status: "ACTIVE",
      type: "FULL_TIME",
      workLocation: "OFFICE",
      gender: "BOTH",
    },
  });

  // Watch start and end dates for validation
  const startDate = watch("startDate");

  // Populate form with job data when modal opens
  useEffect(() => {
    if (isOpen && job) {
      setValue("title", job.title);
      setValue("position", job.position || "");
      setValue("department", job.department || "");
      setValue("speciality", job.speciality || "");
      setValue("type", job.type);
      setValue("workLocation", job.workLocation);
      setValue("workSchedule", job.workSchedule);
      setValue("gender", job.gender);
      setValue("salary", job.salary);
      setValue(
        "startDate",
        job.startDate ? new Date(job.startDate).toISOString().split("T")[0] : ""
      );
      setValue(
        "endDate",
        job.endDate ? new Date(job.endDate).toISOString().split("T")[0] : ""
      );
      setValue("status", job.status);
      setValue("description", job.description);
      setValue("requirements", job.requirements);
      setValue("responsibilities", job.responsibilities);
      setValue("conditions", job.conditions);
    }
  }, [isOpen, job, setValue]);

  const onSubmit = (data) => {
    console.log("=== EDIT FORM SUBMIT ===");
    console.log("Form data:", data);

    // Validate dates
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      toast.error("Tugash sanasi boshlanish sanasidan kech bo'lishi kerak", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Format data exactly like create
    const formattedData = {
      title: data.title.trim(),
      salary: Number.parseInt(data.salary),
      type: data.type,
      workSchedule: data.workSchedule.trim(),
      workLocation: data.workLocation,
      gender: data.gender,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      description: data.description.trim(),
      requirements: data.requirements.trim(),
      responsibilities: data.responsibilities.trim(),
      conditions: data.conditions.trim(),
      status: data.status,
      speciality: data.speciality?.trim() || "",
      department: data.department?.trim() || "",
      position: data.position?.trim() || "",
    };

    console.log("Formatted data for API:", formattedData);

    updateJob(
      { jobId: job.id, jobData: formattedData },
      {
        onSuccess: () => {
          console.log("Job update successful");
          onClose();
        },
        onError: (error) => {
          console.error("Job update failed:", error);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !job) return null;

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
                <FileText size={18} />
                Asosiy ma'lumotlar
              </h3>

              <div className="form-group">
                <label htmlFor="title">Ish nomi *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ish nomini kiriting"
                  {...register("title", {
                    required: "Ish nomi majburiy",
                    minLength: {
                      value: 2,
                      message:
                        "Ish nomi kamida 2 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                  className={errors.title ? "error" : ""}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="position">Lavozim</label>
                  <input
                    id="position"
                    type="text"
                    placeholder="Lavozim"
                    {...register("position")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Bo'lim</label>
                  <input
                    id="department"
                    type="text"
                    placeholder="Bo'lim"
                    {...register("department")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="speciality">Mutaxassislik</label>
                <input
                  id="speciality"
                  type="text"
                  placeholder="Mutaxassislik"
                  {...register("speciality")}
                />
              </div>
            </div>

            {/* Work Details */}
            <div className="form-section">
              <h3>
                <Clock size={18} />
                Ish sharoitlari
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Ish turi *</label>
                  <select
                    id="type"
                    {...register("type", { required: "Ish turi majburiy" })}
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
                  <label htmlFor="workLocation">Ish joyi *</label>
                  <select
                    id="workLocation"
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="workSchedule">Ish vaqti *</label>
                  <input
                    id="workSchedule"
                    type="text"
                    placeholder="Ish vaqti"
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

                <div className="form-group">
                  <label htmlFor="gender">Jins *</label>
                  <select
                    id="gender"
                    {...register("gender", { required: "Jins majburiy" })}
                    className={errors.gender ? "error" : ""}
                  >
                    <option value="BOTH">Farqi yo'q</option>
                    <option value="MALE">Erkak</option>
                    <option value="FEMALE">Ayol</option>
                  </select>
                  {errors.gender && (
                    <span className="error-message">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Salary and Dates */}
            <div className="form-section">
              <h3>
                <DollarSign size={18} />
                Maosh va muddat
              </h3>

              <div className="form-group">
                <label htmlFor="salary">Maosh (so'm) *</label>
                <input
                  id="salary"
                  type="number"
                  min="0"
                  placeholder="Maosh"
                  {...register("salary", {
                    required: "Maosh majburiy",
                    min: {
                      value: 1,
                      message: "Maosh 1 dan kam bo'lmasligi kerak",
                    },
                  })}
                  className={errors.salary ? "error" : ""}
                />
                {errors.salary && (
                  <span className="error-message">{errors.salary.message}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Boshlanish sanasi *</label>
                  <input
                    id="startDate"
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
                  <label htmlFor="endDate">Tugash sanasi *</label>
                  <input
                    id="endDate"
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

              <div className="form-group">
                <label htmlFor="status">Holat</label>
                <select id="status" {...register("status")}>
                  <option value="DRAFT">Qoralama</option>
                  <option value="ACTIVE">Faol</option>
                  <option value="INACTIVE">Nofaol</option>
                  <option value="CLOSED">Yopiq</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Areas */}
          <div className="form-section full-width">
            <div className="form-group">
              <label htmlFor="description">Tavsif *</label>
              <textarea
                id="description"
                rows="4"
                placeholder="Ish haqida tavsif"
                {...register("description", {
                  required: "Tavsif majburiy",
                })}
                className={errors.description ? "error" : ""}
              />
              {errors.description && (
                <span className="error-message">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Talablar *</label>
              <textarea
                id="requirements"
                rows="4"
                placeholder="Talablar"
                {...register("requirements", {
                  required: "Talablar majburiy",
                })}
                className={errors.requirements ? "error" : ""}
              />
              {errors.requirements && (
                <span className="error-message">
                  {errors.requirements.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="responsibilities">Mas'uliyatlar *</label>
              <textarea
                id="responsibilities"
                rows="4"
                placeholder="Mas'uliyatlar"
                {...register("responsibilities", {
                  required: "Mas'uliyatlar majburiy",
                })}
                className={errors.responsibilities ? "error" : ""}
              />
              {errors.responsibilities && (
                <span className="error-message">
                  {errors.responsibilities.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="conditions">Sharoitlar *</label>
              <textarea
                id="conditions"
                rows="4"
                placeholder="Sharoitlar"
                {...register("conditions", {
                  required: "Sharoitlar majburiy",
                })}
                className={errors.conditions ? "error" : ""}
              />
              {errors.conditions && (
                <span className="error-message">
                  {errors.conditions.message}
                </span>
              )}
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
              {isPending ? "Saqlanmoqda..." : "Yangilash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
