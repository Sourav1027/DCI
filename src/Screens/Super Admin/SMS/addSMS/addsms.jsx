import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faBook,
  faGraduationCap,
  faUsers,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { Building2 } from "lucide-react";
import "./addsms.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const AddSMS = ({ onSubmit, onCancel }) => {
  const initialFormData = {
    centerName: "",
    courseName: "",
    batchName: "",
    selectStudent: "",
    sms: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [messageContent, setMessageContent] = useState("");
  
  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCenter.trim()) {
      newErrors.centerName = "Center Name is required";
    }
    if (!selectedCourse.trim()) {
      newErrors.courseName = "Course Name is required";
    }
    if (!selectedBatch.trim()) {
      newErrors.batchName = "Batch Name is required";
    }
    if (!messageContent.trim()) {
      newErrors.sms = "Message Content is required";
    }
    if (selectedStudents.length === 0) {
      newErrors.selectStudent = "At least one student must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        center: selectedCenter,
        course: selectedCourse,
        batch: selectedBatch,
        students: selectedStudents,
        message: messageContent,
      };
      onSubmit(submissionData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedCenter("");
    setSelectedCourse("");
    setSelectedBatch("");
    setSelectedStudents([]);
    setMessageContent("");
    setErrors({});
    setStudentSearch("");
    setFilteredStudents(students);
    setIsAllSelected(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update corresponding selected states
    switch (name) {
      case "centerName":
        setSelectedCenter(value);
        break;
      case "courseName":
        setSelectedCourse(value);
        break;
      case "batchName":
        setSelectedBatch(value);
        break;
      default:
        break;
    }
  };

  // Fetch Centers
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

  // Fetch Courses
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

  // Fetch Batches
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

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const transformedStudents = responseData.data.map(student => ({
        id: student.id,
        fullName: `${student.firstName} ${student.lastName}`,
        centerName: student.centerName,
        course: student.course,
        batch: student.batch
      }));
      
      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Failed to load students", "error");
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchCourses();
    fetchBatches();
    fetchStudents();
  }, []);

  const handleStudentSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setStudentSearch(searchTerm);
    
    const newFilteredStudents = students.filter((student) =>
      student.fullName.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(newFilteredStudents);
    
    // Update selected students if all were previously selected
    if (isAllSelected) {
      const allStudentIds = newFilteredStudents.map(student => student.id);
      setSelectedStudents(allStudentIds);
    }
  };

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      setSelectedStudents([]);
      setIsAllSelected(false);
    } else {
      const allStudentIds = students.map(student => student.id);
      setSelectedStudents(allStudentIds);
      setIsAllSelected(true);
    }
  };

  const handleStudentChange = (event) => {
    const { value } = event.target;
    const newSelected = typeof value === 'string' ? value.split(',') : value;
    setSelectedStudents(newSelected);
    setIsAllSelected(newSelected.length === students.length);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
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
              <option key={centerName.id} value={centerName.centerName}>
                {centerName.centerName}
              </option>
            ))}
          </select>
          {errors.centerName && (
            <FormHelperText style={{ color: "#ff0000c7" }}>
              {errors.centerName}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <span className="input-icon">
            <FontAwesomeIcon icon={faBook} className="me-2" />
          </span>
          <select
            className={`form-input ${errors.courseName ? "is-invalid" : ""}`}
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
          {errors.courseName && (
            <FormHelperText style={{ color: "#ff0000c7" }}>
              {errors.courseName}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <span className="input-icon">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
          </span>
          <select
            className={`form-input ${errors.batchName ? "is-invalid" : ""}`}
            id="batchName"
            name="batchName"
            value={formData.batchName}
            onChange={handleChange}
          >
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.batchName}>
                {batch.batchName}
              </option>
            ))}
          </select>
          {errors.batchName && (
            <FormHelperText style={{ color: "#ff0000c7" }}>
              {errors.batchName}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <span className="input-icon">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
          </span>
          <Select
            multiple
            value={selectedStudents}
            onChange={handleStudentChange}
            renderValue={(selected) => {
              if (isAllSelected) {
                return "All Students Selected";
              }
              return selected
                .map((id) => students.find((s) => s.id === id)?.fullName)
                .join(", ");
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflow: "auto",
                },
              },
            }}
          >
            <MenuItem disabled>
              <TextField
                placeholder="Search students..."
                value={studentSearch}
                onChange={handleStudentSearch}
                fullWidth
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>
            <MenuItem onClick={handleSelectAllClick}>
              <Checkbox 
                checked={isAllSelected}
                indeterminate={!isAllSelected && selectedStudents.length > 0}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {filteredStudents.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                <Checkbox 
                  checked={selectedStudents.includes(student.id) || isAllSelected}
                />
                <ListItemText primary={student.fullName} />
              </MenuItem>
            ))}
          </Select>
          {errors.selectStudent && (
            <FormHelperText style={{ color: "#ff0000c7" }}>
              {errors.selectStudent}
            </FormHelperText>
          )}
        </FormControl>
      </div>

      <FormControl className="m-0" fullWidth margin="normal">
        <TextField
          label={
            <>
              <FontAwesomeIcon icon={faComment} className="me-2" /> Message
              Content
            </>
          }
          multiline
          rows={4}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.sms}
          helperText={errors.sms}
        />
      </FormControl>

      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Send SMS
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

export default AddSMS;