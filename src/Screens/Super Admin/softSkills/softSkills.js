import React, { useState } from "react";
import "./softskill.css";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const SoftSkills = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");

  const [feeData] = useState([
    {
      id: 1,
      centerName: "dcodeTech Mulund",
      courseName: "Computer Application",
      batch: "2024",
      studentName: "John Doe",
      grade: "A+",
      date: "10-01-2025"
    },
    {
      id: 2,
      centerName: "dcodeTech Thane",
      courseName: "AWS",
      batch: "2024",
      studentName: "Jane Smith",
      grade: 'B+',
      date: "03-01-2025"

    },
  ]);

  const filteredData = feeData.filter((item) => {
    const matchesSearchQuery =
      item.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = selectedCenter
      ? item.centerName === selectedCenter
      : true;

    const matchesCourse = selectedCourse
      ? item.courseName === selectedCourse
      : true;

    const matchesBatch = selectedBatch ? item.batch === selectedBatch : true;
    const matchesSkills = selectedSkills ? item.grade === selectedSkills : true;

    return matchesSearchQuery && matchesCenter && matchesCourse && matchesBatch && matchesSkills;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="softskill-container">
      <div className="softskill-header">
        <h1 className="gradient-text">Fee Management System</h1>

        {/* Filters */}
        <div className="skill-filter-container">
          <select className="select-input">
            <option value="">Select Center</option>
            <option>D-codetech Malad</option>
            <option>D-codetech Kalyan</option>
            <option>D-codetech Thane</option>
            <option>D-codetech Navi Mumbai</option>
          </select>
          <select className="select-input">
            <option value="">Course</option>
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>UI/UX Design</option>
            <option>Data Science</option>
          </select>
          <select className="select-input">
            <option value="">Select Batch</option>
            <option>Morning Batch</option>
            <option>Afternoon Batch</option>
            <option>Evening Batch</option>
          </select>
          <select className="select-input">
            <option value="">Select Skills</option>
            <option>Resume Creation</option>
            <option>Presentation</option>
            <option>Group Discussion</option>
            <option>Technical</option>
            <option>Mock Interviews</option>
          </select>
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-softskill-container">
          <table className="softskill-table">
            <thead>
              <tr className="bg-gray-50">
                <th className=" text-left font-medium text-gray-600">Sr No</th>
                <th className=" text-left font-medium text-gray-600"> Center Name</th>
                <th className=" text-left font-medium text-gray-600"> Course Name </th>
                <th className=" text-left font-medium text-gray-600">Batch</th>
                <th className=" text-left font-medium text-gray-600">Student</th>
                <th className=" text-left font-medium text-gray-600">Grade</th>
                <th className=" text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {startIndex + index + 1}
                  </td>
                  <td className=" text-left font-medium text-gray-600">{item.centerName}</td>
                  <td className=" text-left font-medium text-gray-600">{item.courseName}</td>
                  <td className=" text-left font-medium text-gray-600">{item.batch}</td>
                  <td className=" text-left font-medium text-gray-600">{item.studentName}</td>
                  <td className=" text-left font-medium text-gray-600">{item.grade}</td>
                  <td className=" text-left font-medium text-gray-600">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container">
            <span className="page-info">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              results
            </span>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftSkills;
