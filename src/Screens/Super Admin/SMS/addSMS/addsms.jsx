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
  const [formData, setFormData] = useState({
    centerName: "",
    course: "",
    batch: "",
    selectStudent: [],
    message: "", 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.centerName) newErrors.centerName = "Center Name is required";
    if (!formData.course) newErrors.course = "Course Name is required";
    if (!formData.batch) newErrors.batch = "Batch Name is required";
    if (!formData.message) newErrors.message = "Message Content is required";
    if (!formData.selectStudent.length) newErrors.selectStudent = "At least one student must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Transform the selected student IDs into the required format
        const formattedStudents = formData.selectStudent.map(studentId => {
          const student = students.find(s => s.id === studentId);
          return {
            id: student.id,
            name: student.fullName
          };
        });
  
        const submissionData = {
          centerName: formData.centerName,
          course: formData.course,
          batch: formData.batch,
          selectStudent: formattedStudents, // Send the formatted student array
          message: formData.message,
        };
  
        await onSubmit(submissionData);
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || "Failed to submit form"
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const resetForm = () => {
    setFormData({
      centerName: "",
      course: "",
      batch: "",
      selectStudent: [],
      message: "",
    });
    setErrors({});
    setStudentSearch("");
    setFilteredStudents(students);
    setIsAllSelected(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch data functions
  const fetchData = async (endpoint, setter) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      setter(responseData.data || []);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData("centers", setCenters);
    fetchData("courses", setCourses);
    fetchData("batches", setBatches);
    fetchData("students", (data) => {
      const transformedStudents = data.map(student => ({
        id: student.id,
        fullName: `${student.firstName} ${student.lastName}`,
        centerName: student.centerName,
        course: student.course,
        batch: student.batch
      }));
      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);
    });
  }, []);

  const handleStudentSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setStudentSearch(searchTerm);
    
    const filtered = students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      setFormData(prev => ({ ...prev, selectStudent: [] }));
      setIsAllSelected(false);
    } else {
      const allStudentIds = students.map(student => student.id);
      setFormData(prev => ({ ...prev, selectStudent: allStudentIds }));
      setIsAllSelected(true);
    }
  };

  const handleStudentChange = (event) => {
    const selectedIds = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      selectStudent: selectedIds
    }));
    setIsAllSelected(selectedIds.length === students.length);
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
          {errors.centerName && (
            <FormHelperText error>{errors.centerName}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <span className="input-icon">
            <FontAwesomeIcon icon={faBook} />
          </span>
          <select
            className={`form-input ${errors.course ? "is-invalid" : ""}`}
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
          {errors.course && (
            <FormHelperText error>{errors.course}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <span className="input-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </span>
          <select
            className={`form-input ${errors.batch ? "is-invalid" : ""}`}
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
          {errors.batch && (
            <FormHelperText error>{errors.batch}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <span className="input-icon">
            <FontAwesomeIcon icon={faUsers} />
          </span>
          <Select
            multiple
            value={formData.selectStudent}
            onChange={handleStudentChange}
            renderValue={(selected) => {
              if (isAllSelected) return "All Students Selected";
              return selected
                .map(id => students.find(s => s.id === id)?.fullName)
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
                indeterminate={!isAllSelected && formData.selectStudent.length > 0}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {filteredStudents.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                <Checkbox checked={formData.selectStudent.includes(student.id)} />
                <ListItemText primary={student.fullName} />
              </MenuItem>
            ))}
          </Select>
          {errors.selectStudent && (
            <FormHelperText error>{errors.selectStudent}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Message Content"
            multiline
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
            InputProps={{
              startAdornment: (
                <FontAwesomeIcon icon={faComment} style={{ marginRight: '8px' }} />
              ),
            }}
          />
        </FormControl>
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          {isSubmitting ? 'Sending...' : 'Send SMS'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddSMS;