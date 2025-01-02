import React, { useState } from "react";
import {
  X,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Book,
  Clock,
  Building,
} from "lucide-react";
import "./addnew.css";

const AddStudent = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    fatherName: "",
    motherName: "",
    photo: null,
    course: "",
    batch: "",
    previousEducation: "",
    bloodGroup: "",
    emergencyContact: "",
    gender: "",
    admissionDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
            <h2>Student Registration Form</h2>
            <p>Enter student details to register</p>
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
                <div className="form-group">
                  <label htmlFor="firstName">
                    <User size={16} />
                    First Name
                  </label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    <User size={16} />
                    Last Name
                  </label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    Email
                  </label>
                  <input type="email" id="email" name="email" required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input type="tel" id="phone" name="phone" required />
                </div>

                <div className="form-group">
                  <label htmlFor="dob">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input type="date" id="dob" name="dob" required />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">
                    <Users size={16} />
                    Gender
                  </label>
                  <select id="gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="Photo Upload">
                  <Users size={16} />
                    Upload
                  </label>
                  <input
                    type="file"
                    id="inputGroupFile01"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="input-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">
                    <MapPin size={16} />
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="fatherName">
                    <Users size={16} />
                    Father's Name
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="motherName">
                    <Users size={16} />
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyContact">
                    <Phone size={16} />
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Academic Information</h3>
              <div className="input-grid">
                <div className="form-group">
                  <label htmlFor="course">
                    <Book size={16} />
                    Course
                  </label>
                  <select id="course" name="course" required>
                    <option value="">Select Course</option>
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>UI/UX Design</option>
                    <option>Data Science</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="batch">
                    <Clock size={16} />
                    Batch
                  </label>
                  <select id="batch" name="batch" required>
                    <option value="">Select Batch</option>
                    <option>Morning Batch</option>
                    <option>Evening Batch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="previousEducation">
                    <Building size={16} />
                    Previous Education
                  </label>
                  <input
                    type="text"
                    id="previousEducation"
                    name="previousEducation"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bloodGroup">
                    <Users size={16} />
                    Blood Group
                  </label>
                  <select id="bloodGroup" name="bloodGroup" required>
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="admissionDate">
                    <Calendar size={16} />
                    Admission Date
                  </label>
                  <input
                    type="date"
                    id="admissionDate"
                    name="admissionDate"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
          <button type="submit" className="submit-btn">
              <Upload size={16} />
              Submit Registration
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              <X size={16} />
              Cancel
            </button>
        
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
