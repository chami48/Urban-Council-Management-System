import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Header component
const Header = () => (
  <header className="bg-blue-800 text-white p-4 shadow-md">
    <div className="max-w-7xl mx-auto text-center font-bold text-xl">
      Company Payroll Management
    </div>
  </header>
);

// Footer component
const Footer = () => (
  <footer className="bg-blue-800 text-white p-4 mt-10 shadow-inner">
    <div className="max-w-7xl mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Company Name. All rights reserved.
    </div>
  </footer>
);

// Government letterhead configuration
const GOVERNMENT_CONFIG = {
  emblemPath: "/emblem.png",
  logoPath: "/horanalogo.png",
  signaturePath: "/signature.png",
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa",
  address: "123, Mathugama Horana",
  email: "horanaurbancouncil123@gmail.com",
  fax: "1235565"
};

// Helper function to load PNG images as base64
const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    img.src = src;
  });
};

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/salaries/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Salary not found');
        return res.json();
      })
      .then(data => {
        setSalary(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleExportPDF = async () => {
    if (!salary) return;

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const currentDate = new Date();

      // Add Government Header
      const addGovernmentHeader = async () => {
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, 150, 'F');
        
        doc.setDrawColor(128, 0, 32);
        doc.setLineWidth(3);
        doc.line(margin, 145, pageWidth - margin, 145);
        
        let emblemLoaded = false;
        let logoLoaded = false;
        
        try {
          const emblemBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.emblemPath);
          if (emblemBase64) {
            doc.addImage(emblemBase64, 'PNG', margin, 40, 50, 50);
            emblemLoaded = true;
          }
        } catch (error) {
          console.error('Emblem loading error:', error);
        }
        
        try {
          const logoBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.logoPath);
          if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', pageWidth - margin - 50, 40, 50, 50);
            logoLoaded = true;
          }
        } catch (error) {
          console.error('Logo loading error:', error);
        }
        
        if (!emblemLoaded) {
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(2);
          doc.rect(margin, 40, 50, 50, 'S');
        }
        
        if (!logoLoaded) {
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(2);
          doc.rect(pageWidth - margin - 50, 40, 50, 50, 'S');
        }
        
        const centerX = pageWidth / 2;
        
        doc.setTextColor(128, 0, 32);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`${GOVERNMENT_CONFIG.address} | Email: ${GOVERNMENT_CONFIG.email} | Fax: ${GOVERNMENT_CONFIG.fax}`, centerX, 98, { align: 'center' });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('SALARY DETAILS', centerX, 120, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Employee ID: ${salary.employeeId} | ${salary.month} ${salary.year}`, centerX, 135, { align: 'center' });
      };

      // Add Footer
      const addFooter = async () => {
        const footerY = pageHeight - 110;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Generated on:', margin, footerY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(currentDate.toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }), margin, footerY + 15);
        doc.text(currentDate.toLocaleTimeString('en-GB', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }), margin, footerY + 30);
        
        const sigX = pageWidth - margin - 160;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Authorized by:', sigX, footerY);
        
        let signatureLoaded = false;
        try {
          const signatureBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.signaturePath);
          if (signatureBase64) {
            doc.addImage(signatureBase64, 'PNG', sigX, footerY + 10, 100, 25);
            signatureLoaded = true;
          }
        } catch (error) {
          console.error('Signature loading error:', error);
        }
        
        if (!signatureLoaded) {
          doc.setDrawColor(0, 100, 200);
          doc.setLineWidth(2);
          doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
          
          doc.setDrawColor(0, 80, 180);
          doc.setLineWidth(2.5);
          const sigY = footerY + 20;
          doc.line(sigX + 15, sigY, sigX + 35, sigY - 6);
          doc.line(sigX + 35, sigY - 6, sigX + 55, sigY + 4);
          doc.line(sigX + 55, sigY + 4, sigX + 85, sigY - 3);
          doc.line(sigX + 85, sigY - 3, sigX + 115, sigY + 6);
          doc.line(sigX + 115, sigY + 6, sigX + 135, sigY - 2);
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Administrative Officer', sigX, footerY + 40);
        doc.text('Horana Urban Council', sigX, footerY + 52);
        
        doc.setDrawColor(128, 0, 32);
        doc.setLineWidth(1);
        doc.line(margin, footerY + 70, pageWidth - margin, footerY + 70);
        
        const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(pageStr, pageWidth / 2, footerY + 85, { align: 'center' });
      };

      await addGovernmentHeader();

      // Basic Information Table
      let startY = 165;
      autoTable(doc, {
        startY: startY,
        head: [['Field', 'Value']],
        body: [
          ['Employee ID', salary.employeeId],
          ['Month', salary.month],
          ['Year', salary.year.toString()],
          ['Basic Salary', `Rs ${Number(salary.basicSalary).toFixed(2)}`],
          ['Net Salary', `Rs ${Number(salary.netSalary).toFixed(2)}`]
        ],
        headStyles: { 
          fillColor: [128, 0, 32],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8
        },
        alternateRowStyles: {
          fillColor: [248, 250, 255]
        },
        margin: { left: margin, right: margin }
      });

      // Allowances Table
      startY = doc.lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Allowances', margin, startY);

      const allowancesData = salary.allowances 
        ? Object.entries(salary.allowances).map(([key, value]) => [
            key.charAt(0).toUpperCase() + key.slice(1),
            `Rs ${Number(value).toFixed(2)}`
          ])
        : [];

      autoTable(doc, {
        startY: startY + 10,
        head: [['Type', 'Amount']],
        body: allowancesData,
        headStyles: { 
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8
        },
        alternateRowStyles: {
          fillColor: [240, 253, 244]
        },
        margin: { left: margin, right: margin }
      });

      // Overtime Table
      startY = doc.lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Overtime', margin, startY);

      const overtimeData = salary.overtime
        ? Object.entries(salary.overtime).map(([key, value]) => [
            key === 'normalDayHours' ? 'Normal Day Hours' : 'Holiday Hours',
            `${Number(value).toFixed(2)} hrs`
          ])
        : [];

      autoTable(doc, {
        startY: startY + 10,
        head: [['Type', 'Hours']],
        body: overtimeData,
        headStyles: { 
          fillColor: [249, 115, 22],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8
        },
        alternateRowStyles: {
          fillColor: [255, 247, 237]
        },
        margin: { left: margin, right: margin }
      });

      // Deductions Table
      startY = doc.lastAutoTable.finalY + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Deductions', margin, startY);

      const deductionsData = salary.deductions
        ? Object.entries(salary.deductions).map(([key, value]) => [
            key.charAt(0).toUpperCase() + key.slice(1),
            `Rs ${Number(value).toFixed(2)}`
          ])
        : [];

      autoTable(doc, {
        startY: startY + 10,
        head: [['Type', 'Amount']],
        body: deductionsData,
        headStyles: { 
          fillColor: [239, 68, 68],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8
        },
        alternateRowStyles: {
          fillColor: [254, 242, 242]
        },
        margin: { left: margin, right: margin }
      });

      await addFooter();

      doc.save(`Salary_Details_${salary.employeeId}_${salary.month}_${salary.year}.pdf`);

      Swal.fire({
        title: "Success!",
        text: "PDF has been generated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF. Please try again.",
        icon: "error",
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salary) return <div className="p-8 text-center text-white">No data found.</div>;

  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto p-6 bg-gray-500 rounded-xl shadow-xl mt-10 text-black"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Salary Details
        </h2>

        <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Employee ID</td>
              <td className="px-6 py-3">{salary.employeeId}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Month</td>
              <td className="px-6 py-3">{salary.month}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Year</td>
              <td className="px-6 py-3">{salary.year}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Basic Salary</td>
              <td className="px-6 py-3">{salary.basicSalary}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Net Salary</td>
              <td className="px-6 py-3">{Number(salary.netSalary).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Allowances */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Allowances</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.allowances && Object.entries(salary.allowances).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overtime */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Overtime</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.overtime && Object.entries(salary.overtime).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key === 'normalDayHours' ? 'Normal Day Hours' : 'Holiday Hours'}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Deductions</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.deductions && Object.entries(salary.deductions).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition transform hover:-translate-y-1 duration-300"
            onClick={handleExportPDF}
          >
            Export PDF
          </button>
          <button
            className="bg-blue-700 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition transform hover:-translate-y-1 duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default ViewSalary;