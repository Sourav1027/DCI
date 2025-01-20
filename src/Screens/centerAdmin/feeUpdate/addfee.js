import React, { useState } from "react";
import {X,User,Mail,Phone,Calendar,MapPin,Book,Clock,Building2,UserSearch,School,WatchIcon, Award, CreditCard, IndianRupeeIcon,} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./addfee.css";

const AddFee = ({ onClose, onSubmit }) => {
  const initialFormData = {
    centerName: "",
    course: "",
    batch: "",
    studentName: "",
    phone:"",
    modeOfPayment:"",
    totalAmount:"",
    recievedAmount:"",
    status:"",

  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.centerName) {
      newErrors.centerName = "Center Name is required";
    }

    if (!formData.studentName) {
      newErrors.studentName = "Student Name is required";
    }

    if (!formData.modeOfPayment) {
      newErrors.modeOfPayment = "Mode of Payment is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid mobile number";
    }
 

    if (!formData.totalAmount) {
      newErrors.totalAmount = "totalAmount is required";
    }
    if (!formData.recievedAmount) {
      newErrors.recievedAmount = "Receieved Amount is required";
    }
  
    if (!formData.course) {
      newErrors.course = "Course is required";
    }
    if (!formData.batch) {
      newErrors.batch = "Batch is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
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
            <h2>Update Student Fee</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">

          <div className="form-section">
              <div className="input-grid">
                <div class="row g-2 text-center">
                <div class="col-sm-12 col-md-4 col-lg-4">
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
                  <div class="col-sm-12 col-md-4 col-lg-4">
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
                  <div class="col-sm-12 col-md-4 col-lg-4">
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

                  <div class="col-sm-12 col-md-4 col-lg-4">
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

                  <div class="col-sm-6 col-md-4">
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

                  <div class="col-sm-12 col-md-4 col-lg-4">
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
                        >
                          <option value="">Select Mode Of Payment</option>
                          <option>Cash</option>
                          <option>UPI</option>
                        </select>
                      </div>
                      {errors.modeOfPayment && (
                        <div className="error-message">{errors.modeOfPayment}</div>
                      )}
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-4 col-lg-4">
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
                          value={formData.totalAmount}
                          onChange={handleChange}
                          placeholder="Enter Total Amount"
                        />
                      </div>
                      {errors.totalAmount && (
                        <div className="error-message">
                          {errors.totalAmount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="recievedAmount" className="form-label">
                      Recieved Amount
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <IndianRupeeIcon size={18} />
                        </span>
                        <input
                          type="recievedAmount"
                          className={`form-input ${errors.recievedAmount ? "is-invalid" : ""}`}
                          id="recievedAmount"
                          name="recievedAmount"
                          value={formData.recievedAmount}
                          onChange={handleChange}
                          placeholder="Enter Recieve Amount"
                        />
                      </div>
                      {errors.recievedAmount && (
                        <div className="error-message">
                          {errors.recievedAmount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div class="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="status" className="form-label">
                        Fee status
                      </label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Award size={18} />
                        </span>
                        <select
                          id="status"
                          name="status"
                          className={`form-input ${errors.status ? "is-invalid" : ""}`}
                        >
                          <option value="">Select status</option>
                          <option>Pending</option>
                          <option>Paid</option>
                        </select>
                      </div>
                      {errors.status && (
                        <div className="error-message">{errors.status}</div>
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

export default AddFee;
