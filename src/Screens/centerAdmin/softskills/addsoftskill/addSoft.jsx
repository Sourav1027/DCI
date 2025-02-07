import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Phone,
  Book,
  Clock,
  Building2,
  FileText,
  Presentation,
  Users,
  Code,
  UserCheck
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Alert, Snackbar } from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const ADDSOFT = ({ onClose, onSubmit, initialValues }) => {
  const gradeOptions = ["O","A+", "A", "B+", "B", "C+", "C", "D", "F"];

  const initialFormData = {
    centerName: "",
    course: "",
    batch: "",
    studentName: "",
    phone: "",
    resumeCreation: "",
    presentation: "",
    groupDiscussion: "",
    technical: "",
    mockInterview: "",
  };

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialValues || initialFormData);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [centers, setCenters] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [isLoading, setIsLoading] = useState({
    centers: false,
    courses: false,
    batches: false,
    students: false
  });

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
    if (!formData.phone) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid mobile number";
    }
    if (!formData.studentName) newErrors.studentName = "Student Name is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.batch) newErrors.batch = "Batch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData(initialFormData);
        setErrors({});
        onClose();
      } catch (error) {
        showToast(error.message || "Failed to save soft skills assessment", "error");
      }
      setIsSubmitting(false);
    }
  };

 
  // Fetch Centers
  const fetchCenters = async () => {
    try {
      setIsLoading(prev => ({ ...prev, centers: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/centers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setCenters(data.data || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      showToast("Failed to load centers", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, centers: false }));
    }
  };

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      setIsLoading(prev => ({ ...prev, courses: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to load courses", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      setIsLoading(prev => ({ ...prev, batches: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // You can modify the URL if you need to filter batches by course or center
      const response = await fetch(`${API_BASE_URL}/batches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setBatches(data.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      showToast("Failed to load batches", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, batches: false }));
    }
  };

  // Fetch Students
  const fetchStudents = async () => {
    try {
      setIsLoading(prev => ({ ...prev, students: true }));
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setStudents(data.data || []);
      setFilteredStudents(data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, students: false }));
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchCourses();
    fetchBatches();
    fetchStudents();
  }, []);


  // Filter students based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student => 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

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

  const handleStudentSelect = (student) => {
    const fullName = `${student.firstName} ${student.lastName}`;
    setSelectedStudentName(fullName);
    setFormData({
      ...formData,
      studentName: fullName,
      phone: student.phone,
    });
    setSearchTerm(fullName);
    setIsSearchOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear any error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-content">
            <h2>Add Skills Marks</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">
            <div className="form-section">
              <div className="input-grid">
                <div className="row g-2">
                  {/* First section - Basic Information */}
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="centerName">Center Name</label>
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
                          {centers.map((center) => (
                            <option key={center.id} value={center.centerName}>
                              {center.centerName}
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
                      <label htmlFor="course">Course Name</label>
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
                      <label htmlFor="batch">Batch Name</label>
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
                      <label htmlFor="studentSearch">Student Name</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <User size={18} />
                        </span>
                        <div className="relative w-full">
                          <input
                            type="text"
                            className={`form-input ${errors.studentName ? "is-invalid" : ""}`}
                            id="studentSearch"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            placeholder="Search student..."
                          />
                          {isSearchOpen && filteredStudents.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredStudents.map((student) => (
                                <div
                                  key={student.id}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleStudentSelect(student)}
                                >
                                  <div className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {student.phone}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {errors.studentName && (
                        <div className="error-message">{errors.studentName}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="phone">Mobile Number</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          className={`form-input ${errors.phone ? "is-invalid" : ""}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          placeholder="Enter Mobile Number"
                        />
                      </div>
                      {errors.phone && (
                        <div className="error-message">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Second section - Soft Skills Grades */}
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="resumeCreation">Resume Creation Grade</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <FileText size={18} />
                        </span>
                        <select
                          className="form-input"
                          id="resumeCreation"
                          name="resumeCreation"
                          value={formData.resumeCreation}
                          onChange={handleChange}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="presentation">Presentation Grade</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Presentation size={18} />
                        </span>
                        <select
                          className="form-input"
                          id="presentation"
                          name="presentation"
                          value={formData.presentation}
                          onChange={handleChange}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="groupDiscussion">Group Discussion Grade</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Users size={18} />
                        </span>
                        <select
                          className="form-input"
                          id="groupDiscussion"
                          name="groupDiscussion"
                          value={formData.groupDiscussion}
                          onChange={handleChange}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="technical">Technical Grade</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <Code size={18} />
                        </span>
                        <select
                          className="form-input"
                          id="technical"
                          name="technical"
                          value={formData.technical}
                          onChange={handleChange}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label htmlFor="mockInterview">Mock Interview Grade</label>
                      <div className="input-group">
                        <span className="input-icon">
                          <UserCheck size={18} />
                        </span>
                        <select
                          className="form-input"
                          id="mockInterview"
                          name="mockInterview"
                          value={formData.mockInterview}
                          onChange={handleChange}
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              {isSubmitting ? 'Saving...' : (initialValues ? 'Update Skills Assessment' : 'Add Skills Assessment')}
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

export default ADDSOFT;