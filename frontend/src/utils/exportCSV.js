//code in dev stage here no prod
export const exportKpiCsv = (kpis) => {
  const headers = ['Title', 'Value', 'Change'];

  const rows = kpis.map((kpi) => [
    kpi.title,
    kpi.value,
    kpi.change,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

    const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = 'kpi-summary.csv';

  link.click();
};