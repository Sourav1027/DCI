import React, { useState } from "react";
import { Building2, User, Phone, Mail, MapPin, Hash, Lock } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./addCenter.css";

const AddCenter = ({ onSubmit, onCancel,initialValues }) => {
  const initialFormData = {
    centerId: "",
    centerName: "",
    ownerName: "",
    mobileNo: "",
    emailId: "",
    password: "",
    address: "",
  };

  const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1/";

  const [formData, setFormData] = useState(initialValues || initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.centerId.trim()) {
      newErrors.centerId = "Center ID is required";
    }

    if (!formData.centerName.trim()) {
      newErrors.centerName = "Center Name is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner Name is required";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Invalid mobile number";
    }

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email ID is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = "Invalid email format";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        console.log(token,"token")
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const url = initialValues 
          ? `${API_BASE_URL}centers/${initialValues.centerId}`
          : `${API_BASE_URL}centers`;

        const method = initialValues ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit form');
        }

        onSubmit(data);
        resetForm();
      } catch (error) {
        console.error('Error:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;

    // Allow only digits and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, mobileNo: value });
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
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="centerId" className="form-label">
            Center ID
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Hash size={18} />
            </span>
            <input
              type="text"
              className={`form-input ${errors.centerId ? "is-invalid" : ""}`}
              id="centerId"
              name="centerId"
              value={formData.centerId}
              onChange={handleChange}
              placeholder="Enter Center ID"
            />
          </div>
          {errors.centerId && (
            <div className="error-message">{errors.centerId}</div>
          )}
        </div>

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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ownerName" className="form-label">
            Owner Name
          </label>
          <div className="input-group">
            <span className="input-icon">
              <User size={18} />
            </span>
            <input
              type="text"
              className={`form-input ${errors.ownerName ? "is-invalid" : ""}`}
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter Owner Name"
            />
          </div>
          {errors.ownerName && (
            <div className="error-message">{errors.ownerName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mobileNo" className="form-label">
            Mobile Number
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Phone size={18} />
            </span>
            <input
              type="tel"
              maxLength="10"
              className={`form-input ${errors.mobileNo ? "is-invalid" : ""}`}
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleMobileChange}
              placeholder="Enter Mobile Number"
              pattern="[0-9]{10}"
            />
          </div>
          {errors.mobileNo && (
            <div className="error-message">{errors.mobileNo}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="emailId" className="form-label">
            Email ID
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Mail size={18} />
            </span>
            <input
              type="email"
              className={`form-input ${errors.emailId ? "is-invalid" : ""}`}
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="Enter Email ID"
            />
          </div>
          {errors.emailId && (
            <div className="error-message">{errors.emailId}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password 
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              type="text"
              className={`form-input ${errors.password ? "is-invalid" : ""}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
          </div>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
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
      </div>

      <div className="form-actions">
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Center
          {isSubmitting ? 'Submitting...' : initialValues ? 'Update Center' : 'Add Center'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddCenter;
