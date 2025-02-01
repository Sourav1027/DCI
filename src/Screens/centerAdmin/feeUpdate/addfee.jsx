import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Book,
  Clock,
  Building2,
  Award,
  CreditCard,
  IndianRupeeIcon,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./addfee.css";
import { Alert, Snackbar } from "@mui/material";
import { Paid, Pending } from "@mui/icons-material";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const AddFee = ({ onClose, onSubmit,initialValues }) => {
  const initialFormData = {
    centerName: "",
    course: "",
    batch: "",
    studentName: "",
    phone: "",
    modeOfPayment: "",
    totalAmount: "",
    receivedAmount: "",
    pendingAmount: "",
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialValues || initialFormData);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centers, setCenters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const formatIndianCurrency = (x) => {
    if (x === undefined || x === null) return '0.00'
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Reset form when initialValues changes
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      setFormData(initialFormData);
    }
  }, [initialValues]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.centerName) newErrors.centerName = "Center Name is required";
    if (!formData.studentName)
      newErrors.studentName = "Student Name is required";
    if (!formData.modeOfPayment)
      newErrors.modeOfPayment = "Mode of Payment is required";
    if (!formData.phone) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid mobile number";
    }
    if (!formData.totalAmount)
      newErrors.totalAmount = "Total Amount is required";
    if (!formData.receivedAmount)
      newErrors.receivedAmount = "Received Amount is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.batch) newErrors.batch = "Batch is required";

    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const receivedAmount = parseFloat(formData.receivedAmount) || 0;

    if (receivedAmount > totalAmount) {
      newErrors.receivedAmount = "Received amount cannot be greater than total amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "course") {
      const selectedCourse = courses.find(course => course.courseName === value);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          totalAmount: selectedCourse.courseFee,
          receivedAmount: "", // Reset received amount when course changes
          pendingAmount: selectedCourse.courseFee
        }));
      }
    } else if (name === "receivedAmount") {
      // Remove commas from the values for calculation
      const cleanValue = value.replace(/,/g, '');
      const totalAmount = parseFloat(formData.totalAmount.replace(/,/g, '')) || 0;
      const receivedAmount = parseFloat(cleanValue) || 0;

      // Only update if received amount is not greater than total amount
      if (receivedAmount <= totalAmount) {
        const pendingAmount = totalAmount - receivedAmount;
        setFormData(prev => ({
          ...prev,
          receivedAmount: cleanValue,
          pendingAmount: pendingAmount.toString(),
          status: pendingAmount <= 0 ? "Paid" : "Pending"
        }));
        // Clear the error if it exists
        if (errors.receivedAmount) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.receivedAmount;
            return newErrors;
          });
        }
      } else {
        // Show error and don't update the received amount
        setErrors(prev => ({
          ...prev,
          receivedAmount: "Received amount cannot be greater than total amount"
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()&& !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData(initialFormData); 
        setErrors({});
        resetForm();
        onClose();
      } catch (error) {
        showToast(error.message || "Failed to create fee update", "error");
      }
      setIsSubmitting(false);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
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
    onClose(); 
  };

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

  useEffect(() => {
    fetchCourses();
  }, []);

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

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
          <h2>{initialValues ? 'Update Student Fee' : 'Add Student Fee'}</h2>
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
                      {errors.centerName && (
                        <div className="error-message">{errors.centerName}</div>
                      )}
                    </div>
                  </div>
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
                      <label htmlFor="studentName" className="form-label">
                        Student Name
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <input
                          type="studentName"
                          className={`form-input ${errors.studentName ? "is-invalid" : ""}`}
                          id="studentName"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          placeholder="Enter Counsellor Name"
                        />
                      </div>
                      {errors.studentName && (
                        <div className="error-message">
                          {errors.studentName}
                        </div>
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

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="modeOfPayment" className="form-label">
                        Payment mode
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <CreditCard size={18} />
                        </span>
                        <select
                          id="modeOfPayment"
                          name="modeOfPayment"
                          className={`form-input ${errors.modeOfPayment ? "is-invalid" : ""}`}
                          value={formData.modeOfPayment}
                          onChange={handleChange}
                        >
                          <option value="">Select Mode Of Payment</option>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                        </select>
                      </div>
                      {errors.modeOfPayment && (
                        <div className="error-message">
                          {errors.modeOfPayment}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="totalAmount" className="form-label">
                        Total Amount
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <IndianRupeeIcon size={18} />
                        </span>
                        <input
                          type="totalAmount"
                          className={`form-input ${errors.totalAmount ? "is-invalid" : ""}`}
                          id="totalAmount"
                          name="totalAmount"
                          value={formatIndianCurrency(formData.totalAmount)}
                          onChange={handleChange}
                          placeholder="Enter Total Amount"
                          disabled
                        />
                        </div>
                      {errors.totalAmount && (
                        <div className="error-message">
                          {errors.totalAmount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="receivedAmount" className="form-label">
                        Recieved Amount
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <IndianRupeeIcon size={18} />
                        </span>
                        <input
                          type="receivedAmount"
                          className={`form-input ${errors.receivedAmount ? "is-invalid" : ""}`}
                          id="receivedAmount"
                          name="receivedAmount"
                          value={formatIndianCurrency(formData.receivedAmount)}
                          onChange={handleChange}
                          placeholder="Enter Recieve Amount"
                        />
                      </div>
                      {errors.receivedAmount && (
                        <div className="error-message">
                          {errors.receivedAmount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="pendingAmount" className="form-label">
                        Pending Amount
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <IndianRupeeIcon size={18} />
                        </span>
                        <input
                          type="pendingAmount"
                          className={`form-input ${errors.pendingAmount ? "is-invalid" : ""}`}
                          id="pendingAmount"
                          name="pendingAmount"
                          value={formatIndianCurrency(formData.pendingAmount)}
                          onChange={handleChange}
                          placeholder="Enter Recieve Amount"
                          disabled
                        />
                      </div>
                      {errors.pendingAmount && (
                        <div className="error-message">
                          {errors.pendingAmount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary"  disabled={isSubmitting}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              {isSubmitting ? 'Submitting...' : initialValues ? 'Update' : 'Add'}
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

export default AddFee;