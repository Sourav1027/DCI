import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import './profile.css';
import img from "../../../assets/photos/sorav.jpg";

const Profile = () => {
  const studentData = {
    name: "Sourav Rana",
    email: "souravrana@gmail.com",
    phone: "+91 9910140895",
    dob: "15 August 1998",
    address: "123, Gandhi Nagar, New Delhi - 110001",
    fatherName: "Rajeev Kumar",
    motherName: "Anita",
    course: "B.Tech Computer Science",
    batch: "2022-2026",
    rollNo: "CSE2022001",
    semester: "4th Semester",
    section: "A",
    cgpa: "8.9"
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="info-field">
      <div className="info-icon">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="info-label">{label}</p>
        <p className="info-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-cover">
          <h1 className="profile-title">Student Profile</h1>
        </div>

        <div className="profile-header-content">
          <div className="avatar-container">
            <div className="avatar-wrapper">
              <img 
                src={img}
                alt=" "
                className="avatar-image"
              />
            </div>
          </div>
          <div className="student-info">
            <h2 className="student-name">{studentData.name}</h2>
            <p className="roll-number">{studentData.rollNo}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="highlight-section">
            <h3 className="section-title">
              <Award className="h-6 w-6" />
              Academic Highlights
            </h3>
            <div className="info-grid">
              <InfoField 
                icon={GraduationCap}
                label="Course"
                value={studentData.course}
              />
              <InfoField 
                icon={Users}
                label="Batch"
                value={studentData.batch}
              />
              <InfoField 
                icon={BookOpen}
                label="Current Semester"
                value={studentData.semester}
              />
              <InfoField 
                icon={Award}
                label="CGPA"
                value={studentData.cgpa}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-section">
            <h3 className="section-title">
              <User className="h-6 w-6" />
              Personal Information
            </h3>
            <div className="info-grid">
              <InfoField 
                icon={Mail}
                label="Email"
                value={studentData.email}
              />
              <InfoField 
                icon={Phone}
                label="Phone"
                value={studentData.phone}
              />
              <InfoField 
                icon={Calendar}
                label="Date of Birth"
                value={studentData.dob}
              />
              <InfoField 
                icon={MapPin}
                label="Address"
                value={studentData.address}
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="info-section">
            <h3 className="section-title">
              <Users className="h-6 w-6" />
              Family Information
            </h3>
            <div className="info-grid">
              <InfoField 
                icon={User}
                label="Father's Name"
                value={studentData.fatherName}
              />
              <InfoField 
                icon={User}
                label="Mother's Name"
                value={studentData.motherName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;