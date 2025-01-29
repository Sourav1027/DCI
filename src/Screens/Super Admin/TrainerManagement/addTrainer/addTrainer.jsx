import React, { useState, useEffect } from "react";
import {User,Phone,Mail,MapPin,Book,Sparkles,IndianRupee,Calendar,UserSearch,} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./add.css";

const AddTrainer = ({ onSubmit, onCancel, initialValues }) => {
  const defaultFormData = {
    trainerName: "",
    gender: "",
    dob: "",
    phoneNo: "",
    email: "",
    address: "",
    subject: "",
    experience: "",
    salary: "",
    status: true,

  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      const formattedDob = initialValues.dob
      ? new Date(initialValues.dob).toISOString().split("T")[0]
      : "";
      setFormData({
        trainerName: initialValues.trainerName || "",
        gender: initialValues.gender || "",
        dob: formattedDob,
        phoneNo: initialValues.phoneNo || "",
        email: initialValues.email || "",
        address: initialValues.address || "",
        subject: initialValues.subject || "",
        experience: initialValues.experience || "",
        salary: initialValues.salary || "",
        status: initialValues.status ?? true,
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.trainerName?.trim()) {
      newErrors.trainerName = "Name is required";
    }

    if (!formData.subject?.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.dob?.trim()) {
      newErrors.dob = "DOB is required";
    }
    if (!formData.gender?.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.phoneNo) {
      newErrors.phoneNo = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Invalid mobile number (must be 10 digits)";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.experience?.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = "Please enter a valid salary amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form...");
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to submit form",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlephoneNoChange = (e) => {
    const value = e.target.value;
    // Allow only digits and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, phoneNo: value });
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-center-form">
    <div className="form-row">
      <div className="trainer-form">
        <label htmlFor="trainerName" className="form-label">
          Trainer Name
        </label>
        <div className="input-group">
          <span className="input-icon">
            <User size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.trainerName ? "is-invalid" : ""}`}
            id="trainerName"
            name="trainerName"
            value={formData.trainerName}
            onChange={handleChange}
            placeholder="Enter Trainer Name"
          />
        </div>
        {errors.trainerName && <div className="error-message">{errors.trainerName}</div>}
      </div>
      <div className="form-group">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Calendar size={18} />
            </span>
            <input
              type="date"
              className={`form-input ${errors.dob ? "is-invalid" : ""}`}
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Enter Date of Birth"
            />
          </div>
          {errors.dob && <div className="error-message">{errors.dob}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <div className="input-group">
            <span className="input-icon">
              <UserSearch size={18} />
            </span>
            <select
              id="gender"
              name="gender"
              value={formData.gender} 
              onChange={handleChange}
              className={`form-input ${errors.gender ? "is-invalid" : ""}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {errors.gender && <div className="error-message">{errors.gender}</div>}

        </div>

      <div className="trainer-form">
        <label htmlFor="phoneNo" className="form-label">
          phone No
        </label>
        <div className="input-group">
          <span className="input-icon">
            <Phone size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.phone ? "is-invalid" : ""}`}
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handlephoneNoChange}
            placeholder="Enter phone Number"
          />
        </div>
        {errors.phoneNo && <div className="error-message">{errors.phoneNo}</div>}
      </div>

      <div className="trainer-form">
        <label htmlFor="email" className="form-label">
          Email ID
        </label>
        <div className="input-group">
          <span className="input-icon">
            <Mail size={18} />
          </span>
          <input
            type="email"
            className={`form-input ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email ID"
          />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="trainer-form">
        <label htmlFor="address" className="form-label">
          Address
        </label>
        <div className="input-group">
          <span className="input-icon">
            <MapPin size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.address ? "is-invalid" : ""}`}
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter Address"
          />
        </div>
        {errors.address && (
          <div className="error-message">{errors.address}</div>
        )}
      </div>
      <div className="trainer-form">
        <label htmlFor="subject" className="form-label">
          Subject
        </label>
        <div className="input-group">
          <span className="input-icon">
            <Book size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.subject ? "is-invalid" : ""}`}
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
          />
        </div>
        {errors.subject && (
          <div className="error-message">{errors.subject}</div>
        )}
      </div>
      <div className="trainer-form">
        <label htmlFor="experience" className="form-label">
          Experience
        </label>
        <div className="input-group">
          <span className="input-icon">
            <Sparkles size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.experience ? "is-invalid" : ""}`}
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Enter experience"
          />
        </div>
        {errors.experience && (
          <div className="error-message">{errors.experience}</div>
        )}
      </div>
      <div className="trainer-form">
        <label htmlFor="salary" className="form-label">
          Salary
        </label>
        <div className="input-group">
          <span className="input-icon">
            <IndianRupee size={18} />
          </span>
          <input
            type="text"
            className={`form-input ${errors.salary ? "is-invalid" : ""}`}
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
          />
        </div>
        {errors.salary && (
          <div className="error-message">{errors.salary}</div>
        )}
      </div>
    </div>

    <div className="button-group">
      <button type="submit" className="btn btn-primary">
        <FontAwesomeIcon icon={faPlus} className="me-2" />
        Add Trainer
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleCancel}
      >
        <FontAwesomeIcon icon={faXmark} className="me-2" />
        Cancel
      </button>
    </div>
  </form>
);
};

export default AddTrainer;