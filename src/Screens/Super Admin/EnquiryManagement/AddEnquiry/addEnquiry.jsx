import React, { useState } from "react";
import {X,User,Mail,Phone,Calendar,MapPin,Book,Clock,Building2,UserSearch,ImageUp,Asterisk,IndianRupee,Landmark,School,WatchIcon, Award,} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./addEnquiry.css";

const AddEnquiry = ({ onClose, onSubmit }) => {
  const initialFormData = {
    centerName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    course: "",
    batch: "",
    gender: "",
    counsellorName: "",
    collegeName: "",
    preferTiming: "",
    professional: "",
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.centerName) {
      newErrors.centerName = "Center Name is required";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid mobile number";
    }
    if (!formData.email) {
      newErrors.email = "Email ID is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.course) {
      newErrors.course = "Course is required";
    }
    if (!formData.batch) {
      newErrors.batch = "Batch is required";
    }
    if (!formData.counsellorName) {
      newErrors.counsellorName = "Counsellor Name is required";
    }
    if (!formData.collegeName) {
      newErrors.collegeName = "College Name is required";
    }
    if (!formData.preferTiming) {
      newErrors.preferTiming = "Prefer Timing is required";
    }
    if (!formData.professional) {
      newErrors.professional = "Professional is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;

    // Allow only digits and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
            <h2>Student Enquiry Form</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">

          <div className="form-section">
              <div className="input-grid">
                <div className="row g-2 text-center">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="course" className="form-label">
                        Course Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Book size={18} />
                        </span>
                        <select
                          id="course"
                          name="course"
                          className={`form-input ${errors.course ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Course</option>
                          <option>Web Development</option>
                          <option>Mobile Development</option>
                          <option>UI/UX Design</option>
                          <option>Data Science</option>
                        </select>
                      </div>
                      {errors.course && (
                        <div className="error-message">{errors.course}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="batch" className="form-label">
                        Batch Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Clock size={18} />
                        </span>
                        <select
                          id="batch"
                          name="batch"
                          className={`form-input ${errors.batch ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Batch</option>
                          <option>Morning Batch</option>
                          <option>Evening Batch</option>
                        </select>
                      </div>
                      {errors.batch && (
                        <div className="error-message">{errors.batch}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="counsellorName" className="form-label">
                        Counsellor Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="counsellorName"
                          className={`form-input ${errors.counsellorName ? "is-invalid" : ""}`}
                          id="counsellorName"
                          name="counsellorName"
                          value={formData.counsellorName}
                          onChange={handleChange}
                          placeholder="Enter Counsellor Name"
                        />
                      </div>
                      {errors.counsellorName && (
                        <div className="error-message">
                          {errors.counsellorName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="preferTiming" className="form-label">
                        Prefer Timing
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <WatchIcon size={18} />
                        </span>
                        <input
                          type="time"
                          className={`form-input ${errors.preferTiming ? "is-invalid" : ""}`}
                          id="preferTiming"
                          name="preferTiming"
                          value={formData.preferTiming}
                          onChange={handleChange}
                          placeholder="Enter Prefer Timing"
                        />
                      </div>
                      {errors.preferTiming && (
                        <div className="error-message">{errors.preferTiming}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="professional" className="form-label">
                        Professional Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Award size={18} />
                        </span>
                        <select
                          id="professional"
                          name="professional"
                          className={`form-input ${errors.professional ? "is-invalid" : ""}`}
                        >
                          <option value="">Select professional</option>
                          <option>Working</option>
                          <option>Not Working</option>
                          <option>Student</option>
                          <option>Experienced</option>
                        </select>
                      </div>
                      {errors.professional && (
                        <div className="error-message">{errors.professional}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="collegeName" className="form-label">
                        College Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <School size={18} />
                        </span>
                        <input
                          type="collegeName"
                          className={`form-input ${errors.collegeName ? "is-invalid" : ""}`}
                          id="collegeName"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="Enter College Name"
                        />
                      </div>
                      {errors.collegeName && (
                        <div className="error-message">
                          {errors.collegeName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="input-grid">
                <div className="row g-2 text-center">
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="centerName" className="form-label">
                        Center Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Building2 size={18} />
                        </span>
                        <input
                          type="text"
                          className={`form-input ${errors.centerName ? "is-invalid" : ""}`}
                          id="centerName"
                          name="centerName"
                          value={formData.centerName}
                          onChange={handleChange}
                          placeholder="Enter Center Name"
                        />
                      </div>
                      {errors.centerName && (
                        <div className="error-message">{errors.centerName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          className={`form-input ${errors.firstName ? "is-invalid" : ""}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter First Name"
                        />
                      </div>
                      {errors.firstName && (
                        <div className="error-message">{errors.firstName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          className={`form-input ${errors.lastName ? "is-invalid" : ""}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter Last Name"
                        />
                      </div>
                      {errors.lastName && (
                        <div className="error-message">{errors.lastName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Mobile Number
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
                          onChange={handleMobileChange}
                          placeholder="Enter Mobile Number"
                          pattern="[0-9]{10}"
                        />
                      </div>
                      {errors.phone && (
                        <div className="error-message">{errors.phone}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
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
                      {errors.email && (
                        <div className="error-message">{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
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
                      {errors.dob && (
                        <div className="error-message">{errors.dob}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
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
                          className={`form-input ${errors.gender ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {errors.gender && (
                        <div className="error-message">{errors.gender}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <MapPin size={18} />
                        </span>
                        <textarea
                          id="address"
                          name="address"
                          rows="1"
                          onChange={handleChange}
                          className={`form-input ${errors.address ? "is-invalid" : ""}`}
                        ></textarea>
                      </div>
                      {errors.address && (
                        <div className="error-message">{errors.address}</div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

           
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Submit
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
      </div>
    </div>
  );
};

export default AddEnquiry;
