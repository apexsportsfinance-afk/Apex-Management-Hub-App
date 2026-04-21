import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceDetails {
  invoiceId: string;
  date: string;
  parentName: string;
  athleteName: string;
  packageName: string;
  amount: number;
  currency?: string;
  status?: "Paid" | "Pending";
}

export const generateInvoicePDF = (details: InvoiceDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const currency = details.currency || "AED";

  // --- BRANDING HEADER ---
  doc.setFillColor(15, 23, 42); // slate-900 
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Apex Sports", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Management Hub", 14, 32);

  // --- INVOICE TITLE & STATUS ---
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 14, 25, { align: "right" });

  doc.setFontSize(10);
  doc.text(`#${details.invoiceId}`, pageWidth - 14, 32, { align: "right" });

  // --- BILLING INFO ---
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Billed To:", 14, 60);
  
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("helvetica", "bold");
  doc.text(details.parentName, 14, 66);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Athlete: ${details.athleteName}`, 14, 72);
  doc.text(`Date: ${details.date}`, 14, 78);
  
  // Status badge logic
  const isPaid = details.status === "Paid";
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isPaid ? 34 : 220, isPaid ? 197 : 38, isPaid ? 94 : 38); // green or red
  doc.text(`Status: ${details.status || "Paid"}`, 14, 86);

  // --- LINE ITEMS TABLE ---
  autoTable(doc, {
    startY: 100,
    head: [["Description", "Amount"]],
    body: [
      [`Apex Sports Package - ${details.packageName}`, `${currency} ${details.amount.toFixed(2)}`],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [79, 70, 229], // indigo-600
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 6,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  // --- TOTALS ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", pageWidth - 50, finalY);
  doc.text("VAT (5%):", pageWidth - 50, finalY + 8);
  
  const subtotal = details.amount;
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  doc.setTextColor(15, 23, 42);
  doc.text(`${currency} ${subtotal.toFixed(2)}`, pageWidth - 14, finalY, { align: "right" });
  doc.text(`${currency} ${vat.toFixed(2)}`, pageWidth - 14, finalY + 8, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", pageWidth - 50, finalY + 20);
  doc.text(`${currency} ${total.toFixed(2)}`, pageWidth - 14, finalY + 20, { align: "right" });

  // --- FOOTER ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for choosing Apex Sports.", pageWidth / 2, 280, { align: "center" });
  doc.text("For any inquiries, please contact info@apexsports.ae", pageWidth / 2, 285, { align: "center" });

  // Download the PDF
  doc.save(`Invoice_${details.invoiceId}.pdf`);
};
