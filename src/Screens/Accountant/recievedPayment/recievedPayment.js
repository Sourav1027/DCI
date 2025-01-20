import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./recievedPayment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheckCircle,faClock, faReceipt,} from "@fortawesome/free-solid-svg-icons";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const ReceivedPayment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");


  const receivedPayments = [
    {
      id: 1,studentName: "Rahul Kumar",centerName: "D-codetech Malad",courseName: "Web Development",batch: "Morning Batch",receiptNo: "RCP001",
      paymentDate: "2025-01-15",amount: 15000,paymentMode: "UPI",transactionId: "UPI123456789",installmentNo: 1},
    {
      id: 2,studentName: "Priya Singh",centerName: "D-codetech Kalyan",courseName: "Mobile Development",batch: "Evening Batch",
      receiptNo: "RCP002",paymentDate: "2025-01-18",amount: 20000,paymentMode: "Card",transactionId: "CARD987654321",installmentNo: 2},
    {
      id: 3,studentName: "Amit Sharma",centerName: "D-codetech Thane",courseName: "UI/UX Design",batch: "Afternoon Batch",receiptNo: "RCP003",
      paymentDate: "2025-01-20",amount: 25000,paymentMode: "Cash",transactionId: "CASH001",installmentNo: 1
    }
  ];

  

  const filteredData = receivedPayments.filter((item) => {
    const matchesSearchQuery =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = selectedCenter
      ? item.centerName === selectedCenter
      : true;

    const matchesCourse = selectedCourse
      ? item.courseName === selectedCourse
      : true;

    const matchesBatch = selectedBatch 
      ? item.batch === selectedBatch 
      : true;

    const matchesPaymentMode = selectedPaymentMode
      ? item.paymentMode === selectedPaymentMode
      : true;

    return matchesSearchQuery && matchesCenter && matchesCourse && matchesBatch && matchesPaymentMode;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="recieved-container">
      <div className="recieved-header">
        <h1 className="gradient-text">Recieved Fee</h1>

        {/* Filters */}
        <div className="recieved-filter-container">
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
            <option value="">Payment Mode</option>
            <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
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

        <div className="table-recieved-container">
          <table className="recieved-table">
            <thead>
              <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Sr No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Receipt No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Center Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Student Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Course</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Batch</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Payment Mode</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Transaction ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Installment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faReceipt} className="text-gray-400" />
                        {item.receiptNo}
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.paymentDate}</td>
                    <td className="px-4 py-3">{item.centerName}</td>
                    <td className="px-4 py-3">{item.studentName}</td>
                    <td className="px-4 py-3">{item.courseName}</td>
                    <td className="px-4 py-3">{item.batch}</td>
                    <td className="px-4 py-3 font-medium">₹{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{item.paymentMode}</td>
                    <td className="px-4 py-3">{item.transactionId}</td>
                    <td className="px-4 py-3">Installment {item.installmentNo}</td>
                    
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

export default ReceivedPayment;
