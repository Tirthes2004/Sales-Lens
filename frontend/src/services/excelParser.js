import ExcelJS from 'exceljs';

export const parseExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();

  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  const worksheet =
    workbook.worksheets[0];

  const rows = [];

  let headers = [];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values.slice(1);

    // HEADER ROW
    if (rowNumber === 1) {
      headers = values;
    }

    // DATA ROWS
    else {
      const rowData = {};

      headers.forEach((header, index) => {
        rowData[header] =
          values[index];
      });

      rows.push(rowData);
    }
  });

  return rows;
};