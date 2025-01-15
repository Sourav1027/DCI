import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Book,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./add.css";

const AddTrainer = ({ onSubmit, onCancel }) => {
  const initialFormData = {
    name: "",
    phoneNo: "",
    email: "",
    address: "",
    subject: "",
    experience: "",
    salary: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject Name is required";
    }

    if (!formData.phoneNo) {
      newErrors.phoneNo = "phoneNo Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Invalid phoneNo number";
    }

    if (!formData.email) {
      newErrors.email = "Email ID is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      setFormData({ ...formData, phoneNoNo: value });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
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
          <label htmlFor="name" className="form-label">
            Trainer Name
          </label>
          <div className="input-group">
            <span className="input-icon">
              <User size={18} />
            </span>
            <input
              type="text"
              className={`form-input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Trainer Name"
            />
          </div>
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="trainer-form">
          <label htmlFor="phone" className="form-label">
            phoneNo Number
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Phone size={18} />
            </span>
            <input
              type="tel"
              maxLength="10"
              className={`form-input ${errors.phone ? "is-invalid" : ""}`}
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlephoneNoChange}
              placeholder="Enter phoneNo Number"
              pattern="[0-9]{10}"
            />
          </div>
          {errors.phone && <div className="error-message">{errors.phone}</div>}
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
