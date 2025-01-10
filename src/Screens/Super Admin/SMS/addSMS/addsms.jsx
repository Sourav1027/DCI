import React, { useState, useEffect } from "react";
import {Select,MenuItem,TextField,Checkbox,ListItemText,InputLabel,FormControl,FormHelperText} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus,faXmark,faBuilding,faBook,faGraduationCap,faUsers,faComment,} from "@fortawesome/free-solid-svg-icons";
import "./addsms.css";

const AddSMS = ({ onSubmit, onCancel }) => {
  const initialFormData = {
    centerId: "",
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
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [students, setStudents] = useState([]);

  const [centers, setCenters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centersResponse = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const coursesResponse = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const batchesResponse = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const studentsResponse = await fetch("https://jsonplaceholder.typicode.com/users");

        setCenters(await centersResponse.json());
        setCourses(await coursesResponse.json());
        setBatches(await batchesResponse.json());
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleStudentSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setStudentSearch(searchTerm);
    setFilteredStudents(
      students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm)
      )
    );
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

  const handleStudentChange = (event) => {
    const { value } = event.target;
    setSelectedStudents(typeof value === "string" ? value.split(",") : value);
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
        <FormControl fullWidth margin="normal" style={{ position: "relative" }}>
          <InputLabel>
            <span style={{ display: "flex", alignItems: "center",backgroundColor:"white" }}>
              <FontAwesomeIcon icon={faBuilding} className="me-2" />
              Center
            </span>
          </InputLabel>
          <Select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            error={!!errors.centerName}
          >
            {centers.map((center) => (
              <MenuItem key={center.id} value={center.id}>
                {center.title}
              </MenuItem>
            ))}
          </Select>    
          {errors.centerName && <FormHelperText style={{ color: '#ff0000c7' }}>{errors.centerName}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>
          <span style={{ display: "flex", alignItems: "center",backgroundColor:"white" }}>
            <FontAwesomeIcon icon={faBook} className="me-2" /> Course
            </span>
          </InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            error={!!errors.courseName}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
          {errors.courseName && <FormHelperText style={{ color: '#ff0000c7' }}>{errors.courseName}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>
          <span style={{ display: "flex", alignItems: "center",backgroundColor:"white" }}>
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Batch
            </span>
          </InputLabel>
          <Select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            error={!!errors.batchName}
          >
            {batches.map((batch) => (
              <MenuItem key={batch.id} value={batch.id}>
                {batch.title}
              </MenuItem>
            ))}
          </Select>
          {errors.batchName && <FormHelperText style={{ color: '#ff0000c7' }}>{errors.batchName}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>
          <span style={{ display: "flex", alignItems: "center",backgroundColor:"white" }}>
            <FontAwesomeIcon icon={faUsers} className="me-2" /> Students
            </span>
          </InputLabel>
          <Select
            multiple
            value={selectedStudents}
            onChange={handleStudentChange}
            renderValue={(selected) =>
              selected.map((id) => students.find((s) => s.id === id)?.name).join(", ")
            }
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
                placeholder="Search..."
                value={studentSearch}
                onChange={handleStudentSearch}
                fullWidth
              />
            </MenuItem>
            {filteredStudents.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                <Checkbox checked={selectedStudents.indexOf(student.id) > -1} />
                <ListItemText primary={student.name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText style={{ color: '#ff0000c7' }}>
  {errors.selectStudent}
</FormHelperText>
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
