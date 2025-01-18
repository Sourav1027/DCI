import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./fee.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheckCircle,faClock,} from "@fortawesome/free-solid-svg-icons";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const FeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [feeData] = useState([
    {
      id: 1,
      centerName: "Tech Training Center",
      courseName: "Computer Science",
      duration: "4 years",
      batch: "2024",
      studentName: "John Doe",
      totalFee: 400000,
      paidFee: 200000,
      installments: [
        {
          mode: "Online",
          amount: 50000,
          date: "2024-01-15",
          status: "Paid",
        },
      ],
    },
    {
      id: 2,
      centerName: "Tech Training Center",
      courseName: "Mechanical Engineering",
      duration: "4 years",
      batch: "2024",
      studentName: "Jane Smith",
      totalFee: 350000,
      paidFee: 350000,
      installments: [
        {
          mode: "Cash",
          amount: 87500,
          date: "2024-01-10",
          status: "Pending",
        },
      ],
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

    return matchesSearchQuery && matchesCenter && matchesCourse && matchesBatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="gradient-text">Fee Management System</h1>

        {/* Filters */}
        <div className="fee-filter-container">
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
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-fee-container">
          <table className="fee-table">
            <thead>
              <tr className="bg-gray-50">
                <th className=" text-left font-medium text-gray-600">Sr No</th>
                <th className=" text-left font-medium text-gray-600">
                  Center Name
                </th>
                <th className=" text-left font-medium text-gray-600">
                  Course Name
                </th>
                <th className=" text-left font-medium text-gray-600">Batch</th>
                <th className=" text-left font-medium text-gray-600">
                  Student
                </th>
                <th className=" text-left font-medium text-gray-600">M O P</th>
                <th className=" text-left font-medium text-gray-600">Amount</th>
                <th className=" text-left font-medium text-gray-600">Status</th>
                <th className=" text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {startIndex + index + 1}
                  </td>
                  <td>{item.centerName}</td>
                  <td>{item.courseName}</td>
                  <td>{item.batch}</td>
                  <td>{item.studentName}</td>
                  <td>{item.installments[0]?.mode || "N/A"}</td>
                  <td>₹{item.installments[0]?.amount.toLocaleString() || 0}</td>
                  <td>
                    {item.paidFee === item.totalFee ? (
                      <div className="status-cell flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ color: "green" }}
                        />
                        <span className="text-green-500">Paid</span>
                      </div>
                    ) : (
                      <div className="status-cell flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ color: "orange" }}
                        />
                        <span className="text-yellow-500">Pending</span>
                      </div>
                    )}
                  </td>

                  <td>{item.installments[0]?.date || "N/A"}</td>
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

export default FeeManagement;
