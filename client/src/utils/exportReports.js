import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ========== EXCEL EXPORT ==========
export const exportToExcel = (students) => {
  const rows = [];

  students.forEach((student) => {
    if (student.consultations && student.consultations.length > 0) {
      student.consultations.forEach((c) => {
        rows.push({
          "Student Name": student.name,
          "Matric Number": student.matricNumber || student.matric || "N/A",
          Department: student.department || "N/A",
          "Predicted Disease": c.predictedDisease || "N/A",
          Confidence: c.confidence || "N/A",
          Symptoms: (c.symptoms || []).join(", "),
          Date: new Date(c.createdAt || c.date).toLocaleString(),
        });
      });
    } else {
      rows.push({
        "Student Name": student.name,
        "Matric Number": student.matricNumber || student.matric || "N/A",
        Department: student.department || "N/A",
        "Predicted Disease": "No consultation",
        Confidence: "-",
        Symptoms: "-",
        Date: "-",
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clinic Records");

  worksheet["!cols"] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 18 },
    { wch: 22 },
    { wch: 12 },
    { wch: 40 },
    { wch: 22 },
  ];

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(
    data,
    `SmartClinic_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

// ========== PDF EXPORT ==========
export const exportToPDF = (students) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text("Smart Clinic - Consultation Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  const tableRows = [];

  students.forEach((student) => {
    if (student.consultations && student.consultations.length > 0) {
      student.consultations.forEach((c) => {
        tableRows.push([
          student.name,
          student.matricNumber || student.matric || "N/A",
          c.predictedDisease || "N/A",
          c.confidence || "N/A",
          (c.symptoms || []).slice(0, 3).join(", "),
          new Date(c.createdAt || c.date).toLocaleDateString(),
        ]);
      });
    }
  });

  autoTable(doc, {
    startY: 38,
    head: [
      ["Student", "Matric No", "Disease", "Confidence", "Symptoms", "Date"],
    ],
    body: tableRows,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 14, right: 14 },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} | Smart Clinic Prediction System`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(
    `SmartClinic_Report_${new Date().toISOString().slice(0, 10)}.pdf`
  );
};