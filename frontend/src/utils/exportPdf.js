//code in dev stage here no prod
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

export const exportDashboardPdf = async (
  dashboardRef,
  narrative,
  kpis
) => {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // COVER PAGE
  pdf.setFontSize(28);

  pdf.text(
    'Sales Lens Analytics Report',
    20,
    40
  );

  pdf.addPage();

  // AI NARRATIVE
  pdf.setFontSize(22);

  pdf.text('AI Narrative Summary', 20, 20);

  pdf.setFontSize(12);

  const splitText = pdf.splitTextToSize(
    narrative,
    170
  );

  pdf.text(splitText, 20, 35);

  pdf.addPage();

  // DASHBOARD SCREENSHOT
  const canvas = await html2canvas(
    dashboardRef.current,
    {
      scale: 2,
    }
  );

  const imgData = canvas.toDataURL(
    'image/png'
  );

  const imgWidth = 190;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

    pdf.addImage(
    imgData,
    'PNG',
    10,
    10,
    imgWidth,
    imgHeight
  );

  pdf.addPage();

  // KPI TABLE
  pdf.setFontSize(22);

  pdf.text('KPI Summary', 20, 20);

  let y = 40;

  kpis.forEach((kpi) => {
    pdf.text(
      `${kpi.title}: ${kpi.value} (${kpi.change})`,
      20,
      y
    );

    y += 12;
  });

  pdf.save('sales-lens-report.pdf');
};