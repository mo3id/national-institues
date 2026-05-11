import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ExportColumn<T = any> {
  header: string;
  key: string;
  width?: number;
  format?: (row: T) => string | number;
}

export interface ExportMetadata {
  title: string;
  exportedAt: string;
  totalRecords: number;
  filterInfo?: string;
  lang: 'en' | 'ar';
}

const ACCENT_COLOR = '1E3A5F';
const HEADER_BG = '1E3A5F';
const ALT_ROW_BG = 'F0F4F8';
const WHITE = 'FFFFFF';

export async function exportToExcel<T = any>(
  data: T[],
  columns: ExportColumn<T>[],
  metadata: ExportMetadata,
  filename?: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(metadata.title);

  const isRTL = metadata.lang === 'ar';

  // ── Title row ──
  worksheet.mergeCells(1, 1, 1, columns.length);
  const titleCell = worksheet.getCell(1, 1);
  titleCell.value = metadata.title;
  titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: WHITE } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_COLOR } };
  titleCell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
  worksheet.getRow(1).height = 36;

  // ── Metadata rows ──
  const metaRows = [
    `${metadata.lang === 'ar' ? 'تاريخ التصدير' : 'Export Date'}: ${metadata.exportedAt}`,
    `${metadata.lang === 'ar' ? 'إجمالي السجلات' : 'Total Records'}: ${metadata.totalRecords}`,
  ];
  if (metadata.filterInfo) {
    metaRows.push(`${metadata.lang === 'ar' ? 'الفلاتر المطبقة' : 'Applied Filters'}: ${metadata.filterInfo}`);
  }

  metaRows.forEach((text, idx) => {
    const rowNum = 2 + idx;
    worksheet.mergeCells(rowNum, 1, rowNum, columns.length);
    const cell = worksheet.getCell(rowNum, 1);
    cell.value = text;
    cell.font = { name: 'Arial', size: 10, italic: true, color: { argb: '666666' } };
    cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
    worksheet.getRow(rowNum).height = 20;
  });

  const headerRowNum = 2 + metaRows.length + 1;

  // ── Header row ──
  const headerRow = worksheet.getRow(headerRowNum);
  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
    cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle', wrapText: true };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
    };
  });
  headerRow.height = 28;

  // ── Data rows ──
  data.forEach((rowData, rowIdx) => {
    const rowNum = headerRowNum + 1 + rowIdx;
    const row = worksheet.getRow(rowNum);
    columns.forEach((col, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      const rawValue = col.format ? col.format(rowData) : (rowData as any)[col.key];
      cell.value = rawValue ?? '';
      cell.font = { name: 'Arial', size: 10, color: { argb: '333333' } };
      cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle', wrapText: true };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
      };
      // Alternating row color
      if (rowIdx % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW_BG } };
      }
    });
    row.height = 22;
  });

  // ── Column widths ──
  columns.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = col.width || 20;
  });

  // ── Freeze panes below header ──
  worksheet.views = [
    { state: 'frozen', ySplit: headerRowNum, rightToLeft: isRTL },
  ];

  // ── Generate and download ──
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const finalFilename = filename || `${metadata.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, finalFilename);
}
