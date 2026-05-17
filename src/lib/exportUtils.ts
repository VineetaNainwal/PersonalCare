import { MedicalRecord } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToCSV = (records: MedicalRecord[]) => {
  const headers = [
    'Date', 'Weight', 'Notes', 
    'Urine Prot', 'Urine Cr', 'Urine P/C', 'Urine A/C',
    'HB', 'WBC', 'Platelets', 'Hematocrit', 'RBC',
    'KFT Urea', 'KFT Cr',
    'TAC Level'
  ];
  const rows = records.map(r => [
    r.date, r.weight || '', (r.notes || '').replace(/,/g, ';'),
    r.rur_protein || '', r.rur_creatinine || '', r.rur_pc_ratio || '', r.rur_ac_ratio || '',
    r.rhm_hb || '', r.rhm_wbc || '', r.rhm_platelets || '', r.rhm_hematocrit || '', r.rhm_rbc || '',
    r.rch_urea || '', r.rch_creatinine || '',
    r.rst_tac_level || ''
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `vineeta_reports_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (records: MedicalRecord[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('RenalFlow: Patient Medical Reports', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 30);

  const tableRows = records.map(r => [
    format(new Date(r.date), 'MMM dd, yyyy'),
    r.rst_tac_level || '-',
    r.rch_creatinine || '-',
    r.rch_urea || '-',
    r.rhm_hb || '-',
    r.rur_pc_ratio || '-',
    r.weight || '-',
    (r.notes || '').substring(0, 50) + (r.notes?.length && r.notes.length > 50 ? '...' : '')
  ]);

  doc.autoTable({
    head: [['Date', 'TAC', 'Cr', 'Urea', 'HB', 'P/C', 'Wt', 'Notes (abbr)']],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [107, 142, 107] }, // sage
    styles: { fontSize: 8 },
  });

  doc.save(`vineeta_reports_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
