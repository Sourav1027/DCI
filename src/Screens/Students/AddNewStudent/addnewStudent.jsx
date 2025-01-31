import React, { useEffect, useState } from "react";
import {X,User, Mail, Phone, Calendar, MapPin, Book, Clock, Building2, UserSearch, ImageUp, Asterisk, IndianRupee, Landmark, School,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import "./addnew.css";
import { Alert, Snackbar } from "@mui/material";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const AddStudent = ({ onClose, onSubmit, initialValues }) => {
  const defaultFormData = {
    centerName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    fatherName: "",
    motherName: "",
    course: "",
    batch: "",
    previousEducation: "",
    emergencyContact: "",
    gender: "",
    admissionDate: "",
    fee: "",
    counsellorName: "",
    reference: "",
    paymentTerm: "",
    collegeName: "",
    status: true,
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centers, setCenters] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Toast handling function
  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message: message,
      severity: severity,
    });
  };

  // Handle toast close
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (initialValues) {
      const formattedDob = initialValues.dob
        ? new Date(initialValues.dob).toISOString().split("T")[0]
        : "";
      const formattedadmissionDate = initialValues.admissionDate
        ? new Date(initialValues.admissionDate).toISOString().split("T")[0]
        : "";
      setFormData({
        ...defaultFormData,
        ...initialValues,
        centerName: initialValues.centerName || "",
        firstName: initialValues.firstName || "",
        lastName: initialValues.centerName || "",
        gender: initialValues.gender || "",
        dob: formattedDob,
        phone: initialValues.phone || "",
        email: initialValues.email || "",
        address: initialValues.address || "",
        fatherName: initialValues.fatherName || "",
        motherName: initialValues.motherName || "",
        course: initialValues.course || "",
        batch: initialValues.batch || "",
        previousEducation: initialValues.previousEducation || "",
        emergencyContact: initialValues.emergencyContact || "",
        admissionDate: formattedadmissionDate,
        fee: initialValues.fee || "",
        counsellorName: initialValues.counsellorName || "",
        reference: initialValues.reference || "",
        paymentTerm: initialValues.paymentTerm || "",
        collegeName: initialValues.collegeName || "",
        status: initialValues.status ?? true,
      });
    }
  }, [initialValues]);

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
    if (!formData.fatherName) {
      newErrors.fatherName = "Father Name is required";
    }
    if (!formData.motherName) {
      newErrors.motherName = "Mother Name is required";
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
    if (!formData.previousEducation) {
      newErrors.previousEducation = "Previous Education is required";
    }
    if (!formData.emergencyContact) {
      newErrors.emergencyContact = "Emergency Contact is required";
    }
    if (!formData.counsellorName) {
      newErrors.counsellorName = "Counsellor Name is required";
    }
    if (!formData.reference) {
      newErrors.reference = "Reference is required";
    }
    if (!formData.fee) {
      newErrors.fee = "Fee is required";
    }
    if (!formData.paymentTerm) {
      newErrors.paymentTerm = "Payment Term is required";
    }
    if (!formData.collegeName) {
      newErrors.collegeName = "College Name is required";
    }
    if (!formData.admissionDate) {
      newErrors.admissionDate = "Admission Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      console.log('Form submission successful');
    } catch (error) {
      console.error('Form submission error:', error);
      setToast({
        open: true,
        message: error.message || "Failed to save student",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

const handleMobileChange = (e) => {
  const { name, value } = e.target;
  if (/^\d{0,10}$/.test(value)) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};

  const resetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  //fetch course
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setCourses(responseData.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to load courses", "error");
    }
  };

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  //fetch Batches
  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/batches`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setBatches(responseData.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      showToast("Failed to load batches", "error");
    }
  };

  // Fetch courses when component mounts
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchCenters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/centers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setCenters(responseData.data || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      showToast("Failed to load centers", "error");
    }
  };

  // Fetch centers when component mounts
  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
          <h2>{initialValues ? 'Edit Student' : 'Add New Student'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">
            <div className="form-section">
              <h3>Personal Information</h3>
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
                        <select
                          className={`form-input ${errors.centerName ? "is-invalid" : ""}`}
                          id="centerName"
                          name="centerName"
                          value={formData.centerName}
                          onChange={handleChange}
                        >
                          <option value="">Select Center</option>
                          {centers.map((centerName) => (
                            <option
                              key={centerName.id}
                              value={centerName.centerName}
                            >
                              {centerName.centerName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.course && (
                        <div className="error-message">{errors.course}</div>
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

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="input-grid">
                <div className="row g-2 text-center">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="fatherName" className="form-label">
                        Father Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="fatherName"
                          className={`form-input ${errors.fatherName ? "is-invalid" : ""}`}
                          id="fatherName"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          placeholder="Enter Father Name"
                        />
                      </div>
                      {errors.fatherName && (
                        <div className="error-message">{errors.fatherName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="motherName" className="form-label">
                        Mother Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="motherName"
                          className={`form-input ${errors.motherName ? "is-invalid" : ""}`}
                          id="motherName"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          placeholder="Enter Mother Name"
                        />
                      </div>
                      {errors.motherName && (
                        <div className="error-message">{errors.motherName}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label htmlFor="emergencyContact" className="form-label">
                        Emergency Contact Number
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          maxLength="10"
                          className={`form-input ${errors.emergencyContact ? "is-invalid" : ""}`}
                          id="emergencyContact"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleMobileChange}
                          placeholder="Enter Mobile Number"
                          pattern="[0-9]{10}"
                        />
                      </div>
                      {errors.emergencyContact && (
                        <div className="error-message">
                          {errors.emergencyContact}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Academic Information</h3>
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
                          className={`form-input ${errors.course ? "is-invalid" : ""}`}
                          id="course"
                          name="course"
                          value={formData.course}
                          onChange={handleChange}
                        >
                          <option value="">Select Course</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.courseName}>
                              {course.courseName}
                            </option>
                          ))}
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
                          className={`form-input ${errors.batch ? "is-invalid" : ""}`}
                          id="batch"
                          name="batch"
                          value={formData.batch}
                          onChange={handleChange}
                        >
                          <option value="">Select Batch</option>
                          {batches.map((batch) => (
                            <option key={batch.id} value={batch.batchName}>
                              {batch.batchName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.batch && (
                        <div className="error-message">{errors.batch}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="reference" className="form-label">
                        Reference
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Asterisk size={18} />
                        </span>
                        <input
                          type="reference"
                          className={`form-input ${errors.reference ? "is-invalid" : ""}`}
                          id="reference"
                          name="reference"
                          value={formData.reference}
                          onChange={handleChange}
                          placeholder="Enter Reference"
                        />
                      </div>
                      {errors.reference && (
                        <div className="error-message">{errors.reference}</div>
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
                          placeholder="Enter Previous Counsellor Name"
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
                      <label htmlFor="fee" className="form-label">
                        Fee Amount
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <IndianRupee size={18} />
                        </span>
                        <input
                          type="fee"
                          className={`form-input ${errors.fee ? "is-invalid" : ""}`}
                          id="fee"
                          name="fee"
                          value={formData.fee}
                          onChange={handleChange}
                          placeholder="Enter Amount"
                        />
                      </div>
                      {errors.fee && (
                        <div className="error-message">{errors.fee}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="paymentTerm" className="form-label">
                        Payment Term
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Landmark size={18} />
                        </span>
                        <select
                          id="paymentTerm"
                          name="paymentTerm"
                          value={formData.paymentTerm}
                          onChange={handleChange}
                          className={`form-input ${errors.paymentTerm ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Payment Term</option>
                          <option>Online</option>
                          <option>Cash</option>
                        </select>
                      </div>
                      {errors.paymentTerm && (
                        <div className="error-message">
                          {errors.paymentTerm}
                        </div>
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
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="previousEducation" className="form-label">
                        Previous Education
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <School size={18} />
                        </span>
                        <input
                          type="previousEducation"
                          className={`form-input ${errors.previousEducation ? "is-invalid" : ""}`}
                          id="previousEducation"
                          name="previousEducation"
                          value={formData.previousEducation}
                          onChange={handleChange}
                          placeholder="Previous Education Name"
                        />
                      </div>
                      {errors.previousEducation && (
                        <div className="error-message">
                          {errors.previousEducation}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="admissionDate" className="form-label">
                        Admission Date
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Calendar size={18} />
                        </span>
                        <input
                          type="date"
                          className={`form-input ${errors.admissionDate ? "is-invalid" : ""}`}
                          id="admissionDate"
                          name="admissionDate"
                          value={formData.admissionDate}
                          onChange={handleChange}
                          placeholder="Enter Admission Date"
                        />
                      </div>
                      {errors.admissionDate && (
                        <div className="error-message">
                          {errors.admissionDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
          <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {isSubmitting ? 'Saving...' : (initialValues ? 'Update Student' : 'Add Student')}
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
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddStudent;
