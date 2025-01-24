import React, { useState } from "react";
import {
  User, Mail, Phone, Calendar, MapPin, GraduationCap,
  Users, Award, Camera, PenSquare,
} from "lucide-react";
import './profile.css';
import img from "../../../assets/photos/sorav.jpg";


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "Sourav Rana",
    email: "souravrana@gmail.com",
    phone: "+91 9910140895",
    dob: "15 August 1998",
    address: "123, Gandhi Nagar, New Delhi - 110001",
    fatherName: "Rajeev Kumar",
    motherName: "Anita",
    parentContact: "9910140565",
    course: "Mern Stack",
    batch: "2025-2026",
    rollNo: "DR12501",
    section: "A",
    cgpa: "8.9",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Saving updated data:", formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderInfoField = (icon, label, value, name) => {
    return (
      <div className="form-group">
        <div className={`defaultform ${isEditing ? 'editing-enabled' : ''}`}>
          <span className="icon-wrapper">{icon}</span>
          <div className="inputdefault w-full">
            <label className={isEditing ? 'editing-label' : ''}>{label}</label>
            <input
              type="text"
              className="form-control bg-transparent"
              value={value}
              name={name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container bg-gray-50">
      {/* Custom Toast */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            {isEditing ? "Now you can edit your profile" : "Edit mode disabled"}
          </div>
        </div>
      )}

      <div className="profile-card bg-white rounded-lg shadow">
        <div className="profile-cover bg-indigo-500 rounded-t-lg">
          <h1 className="profile-title text-white">Student Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-header-content p-4">
            <div className="avatar-container">
              <div className="avatar-wrapper relative">
                <img
                  src={previewImage || img}
                  alt=""
                  className="avatar-image w-24 h-24 rounded-full"
                />
                {isEditing && (
                  <label className="camera-icon absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                    <Camera className="h-5 w-5 text-indigo-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="student-info">
              <div>
                <h2 className="student-name">{formData.name}</h2>
                <p className="roll-number">{formData.rollNo}</p>
              </div>
              <button
                type="button"
                onClick={handleEditClick}
                style={{
                  color: "green",
                  border: "unset",
                  backgroundColor: "#fff",
                }}
              >
                <PenSquare className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>

          <div className="profile-content p-4">
            <div className="highlight-section mb-6">
              <h3 className="section-title flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-indigo-600" />
                Academic Highlights
              </h3>
              <div className="info-grid grid grid-cols-2 gap-4">
                {renderInfoField(
                  <GraduationCap className="text-indigo-600" />,
                  "Course",
                  formData.course,
                  "course"
                )}
                {renderInfoField(
                  <Users className="text-indigo-600" />,
                  "Batch",
                  formData.batch,
                  "batch"
                )}
                {renderInfoField(
                  <Award className="text-indigo-600" />,
                  "CGPA",
                  formData.cgpa,
                  "cgpa"
                )}
              </div>
            </div>

            <div className="info-section mb-6">
              <h3 className="section-title flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-indigo-600" />
                Personal Information
              </h3>
              <div className="info-grid grid grid-cols-2 gap-4">
                {renderInfoField(
                  <Mail className="text-indigo-600" />,
                  "Email",
                  formData.email,
                  "email"
                )}
                {renderInfoField(
                  <Phone className="text-indigo-600" />,
                  "Phone",
                  formData.phone,
                  "phone"
                )}
                {renderInfoField(
                  <Calendar className="text-indigo-600" />,
                  "Date of Birth",
                  formData.dob,
                  "dob"
                )}
                {renderInfoField(
                  <MapPin className="text-indigo-600" />,
                  "Address",
                  formData.address,
                  "address"
                )}
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-indigo-600" />
                Family Information
              </h3>
              <div className="info-grid grid grid-cols-2 gap-4">
                {renderInfoField(
                  <User className="text-indigo-600" />,
                  "Father's Name",
                  formData.fatherName,
                  "fatherName"
                )}
                {renderInfoField(
                  <User className="text-indigo-600" />,
                  "Mother's Name",
                  formData.motherName,
                  "motherName"
                )}
                {renderInfoField(
                  <Phone className="text-indigo-600" />,
                  "Parent Contact",
                  formData.parentContact,
                  "parentContact"
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;