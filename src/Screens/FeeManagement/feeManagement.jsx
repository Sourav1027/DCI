import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./fee.css";

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [students] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      course: "Computer Science",
      rollNo: "CS001",
      admissionDate: "2024-01-15",
      totalFee: 400000,
      paidFee: 30000,
      discount: 5000,
      installments: [
        { 
          date: "2024-01-15", 
          amount: 30000, 
          mode: "Online",
          receiptNo: "REC001",
          tax: 5400,
          status: "Paid"
        }
      ]
    },
    {
      id: 2,
      name: "Priya Sharma",
      course: "Mechanical Engineering",
      rollNo: "ME001",
      admissionDate: "2024-02-01",
      totalFee: 350000,
      paidFee: 50000,
      discount: 0,
      installments: [
        { 
          date: "2024-02-01", 
          amount: 50000, 
          mode: "Online",
          receiptNo: "REC002",
          tax: 9000,
          status: "Paid"
        }
      ]
    }
  ]);

  const [courses] = useState([
    {
      id: 1,
      name: "Computer Science",
      duration: "4 years",
      totalFee: 400000,
      installments: 8,
      tax: 18
    },
    {
      id: 2,
      name: "Mechanical Engineering",
      duration: "4 years",
      totalFee: 350000,
      installments: 8,
      tax: 18
    }
  ]);

  const getBadgeColor = (paidFee, totalFee) => {
    const percentage = (paidFee / totalFee) * 100;
    if (percentage === 100) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="gradient-text mb-4">Fee Management System</h1>
      
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students List
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={() => setActiveTab('collection')}
          >
            Fee Collection
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Course Structure
          </button>
        </li>
      </ul>

      {/* Students List Tab */}
      {activeTab === 'students' && (
        <div className="card shadow">
          <div className="card-header gradient-bg text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Students Fee Status</h5>
            <button className="btn btn-light btn-sm">Add New Student</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Total Fee</th>
                    <th>Paid Fee</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td>₹{student.totalFee.toLocaleString()}</td>
                      <td>₹{student.paidFee.toLocaleString()}</td>
                      <td>₹{(student.totalFee - student.paidFee).toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${getBadgeColor(student.paidFee, student.totalFee)}`}>
                          {student.paidFee === student.totalFee ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm gradient-btn text-white"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fee Collection Tab */}
      {activeTab === 'collection' && (
        <div className="card shadow">
        <div className="card-header gradient-bg text-white">
  <h5 className="mb-0">Collect Student Fee</h5>
</div>
<div className="card-body">
  <form>
    <div className="row g-2">
      {/* First Row */}
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Select Student</label>
          <select className="form-select">
            <option value="">Choose student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.rollNo} - {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Payment Mode</label>
          <select className="form-select">
            <option value="">Select payment mode...</option>
            <option value="cash">Cash</option>
            <option value="online">Online Transfer</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Payment Date</label>
          <input type="date" className="form-control" />
        </div>
      </div>

      {/* Second Row */}
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Amount</label>
          <input type="number" className="form-control" placeholder="Enter amount" />
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Include Tax?</label>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="includeTax" />
            <label className="form-check-label g-2" htmlFor="includeTax" >
              Add 18% GST
            </label>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label">Reference Number</label>
          <input type="text" className="form-control" placeholder="Enter reference number" />
        </div>
      </div>

      {/* Third Row */}
      <div className="col-12">
        <div className="alert alert-info">
          <strong>Note:</strong> Receipt will be automatically generated after payment submission.
        </div>
        <button type="submit" className="btn gradient-btn text-white">
          Submit Payment
        </button>
      </div>
    </div>
  </form>
</div>

        </div>
      )}

      {/* Course Structure Tab */}
      {activeTab === 'courses' && (
        <div className="card shadow">
          <div className="card-header gradient-bg text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Course Fee Structures</h5>
            <button className="btn btn-light btn-sm">Add New Course</button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Duration</th>
                    <th>Total Fee</th>
                    <th>Installments</th>
                    <th>Tax Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>{course.duration}</td>
                      <td>₹{course.totalFee.toLocaleString()}</td>
                      <td>{course.installments}</td>
                      <td>{course.tax}%</td>
                      <td>
                        <button className="btn btn-sm gradient-btn text-white me-2">Edit</button>
                        <button className="btn btn-sm btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;