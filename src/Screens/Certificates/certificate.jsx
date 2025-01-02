import React, { useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import "./certificate.css";
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import img from "../../assets/logo/ml.png"

const Certificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    batchName: '',
  });
  // Reference for the certificate section
  const certificateRef = useRef(null);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      const certificate = certificateRef.current;
      const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificate-${formData.studentName || 'Student'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Function to print certificate
  const printCertificate = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const certificateContent = certificateRef.current?.innerHTML;
    
    if (printWindow && certificateContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              @media print {
                body {
                  padding: 0;
                  margin: 0;
                }
                .certificate-preview {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  box-shadow: none;
                }
                .certificate-inner {
                  border: 4px double #000;
                  padding: 20px;
                  height: 100%;
                }
                .certificate-content {
                  text-align: center;
                }
                /* Copy all your certificate styles here */
                ${document.querySelector('style')?.innerHTML || ''}
              }
            </style>
          </head>
          <body>
            <div class="certificate-preview">
              ${certificateContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="certificate-container">
      {/* Input Form */}
      <h2 className="form-title">Certificate Generator</h2>
      <div className="form-container">
        <div className="form-group">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter student name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter course name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Batch Name</label>
          <input
            type="text"
            name="batchName"
            value={formData.batchName}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter batch name"
          />
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="certificate-preview" id="certificate">
        <div className="certificate-inner">
          {/* Decorative Corners */}
          <div className="corner corner-top-left"></div>
          <div className="corner corner-top-right"></div>
          <div className="corner corner-bottom-left"></div>
          <div className="corner corner-bottom-right"></div>

          <div className="certificate-content">
            {/* Header */}
            <div className="certificate-header">
              <h1 className="certificate-title">Certificate</h1>
              <div className="certificate-subtitle">OF COMPLETION</div>
              <div className="certificate-company">d-Codetech</div>
            </div>

            {/* Main Content */}
            <div className="certificate-body">
              <div className="certificate-text">This is to certify that</div>
              <div className="certificate-name">
                {formData.studentName || '[Student Name]'}
              </div>
              <div className="certificate-text">
                has successfully completed the course
              </div>
              <div className="certificate-course">
                {formData.courseName || '[Course Name]'}
              </div>
              <div className="certificate-text">
                Batch: {formData.batchName || '[Batch Name]'}
              </div>
              <div className="certificate-text">
                Date: {getCurrentDate()}
              </div>
            </div>

            {/* Signatures */}
            <div className="signatures-section">
              <div className="signature-container">
                <div className="signature-line"></div>
                <div className="signature-title">Director</div>
              </div>
              <div className="certificate-seals">
                <img src={img} alt="" className="seal-image" />
                <img src={img} alt="" className="seal-image" />
              </div>
              <div className="signature-container">
                <div className="signature-line"></div>
                <div className="signature-title">Academic Head</div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Action Buttons */}
       <div className="buttons-container">
        <button onClick={downloadPDF} className="action-button download-button">
          <Download className="button-icon" />
          Download PDF
        </button>
        <button onClick={printCertificate} className="action-button print-button">
          <Printer className="button-icon" />
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;