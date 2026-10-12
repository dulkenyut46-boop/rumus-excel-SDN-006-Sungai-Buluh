import * as XLSX from 'xlsx';
import { GridData } from '../types';

export const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const ROW_COUNT = 14;

// Convert "A" -> 0, "B" -> 1
export function colToIndex(col: string): number {
  return col.toUpperCase().charCodeAt(0) - 65;
}

// Convert 0 -> "A", 1 -> "B"
export function indexToCol(index: number): string {
  return String.fromCharCode(65 + index);
}

// Parse cell key: "A1" -> { col: "A", row: 1 }
export function parseCellAddress(addr: string): { col: string; row: number } | null {
  const match = addr.trim().match(/^([A-Za-z]+)(\d+)$/);
  if (!match) return null;
  return {
    col: match[1].toUpperCase(),
    row: parseInt(match[2], 10),
  };
}

// Expand range: "A1:A4" -> ["A1", "A2", "A3", "A4"]
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) return [parts[0].trim().toUpperCase()];
  if (parts.length !== 2) return [];

  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start || !end) return [];

  const startColIdx = Math.min(colToIndex(start.col), colToIndex(end.col));
  const endColIdx = Math.max(colToIndex(start.col), colToIndex(end.col));
  const startRow = Math.min(start.row, end.row);
  const endRow = Math.max(start.row, end.row);

  const cells: string[] = [];
  for (let c = startColIdx; c <= endColIdx; c++) {
    const colName = indexToCol(c);
    for (let r = startRow; r <= endRow; r++) {
      cells.push(`${colName}${r}`);
    }
  }
  return cells;
}

// Get raw numerical value of cell
export function getCellValue(grid: GridData, cellKey: string): string | number {
  const cell = grid[cellKey];
  if (!cell) return '';
  return cell.value;
}

export function getCellNumeric(grid: GridData, cellKey: string): number {
  const val = getCellValue(grid, cellKey);
  if (typeof val === 'number') return val;
  const parsed = parseFloat(String(val).replace(/,/g, '.'));
  return isNaN(parsed) ? 0 : parsed;
}

// Split parameters considering parentheses and both comma (,) and semicolon (;)
export function splitParams(paramString: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inQuote = false;

  for (let i = 0; i < paramString.length; i++) {
    const char = paramString[i];
    if (char === '"' || char === "'") {
      inQuote = !inQuote;
      current += char;
    } else if (char === '(' && !inQuote) {
      depth++;
      current += char;
    } else if (char === ')' && !inQuote) {
      depth--;
      current += char;
    } else if ((char === ',' || char === ';') && depth === 0 && !inQuote) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim().length > 0) {
    result.push(current.trim());
  }
  return result;
}

// Clean string literal (e.g. "Tuntas" -> Tuntas)
function cleanStringLiteral(str: string): string {
  const trimmed = str.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// Main formula evaluation engine
export function evaluateFormula(rawFormula: string, grid: GridData): string | number {
  if (!rawFormula.startsWith('=')) {
    // Regular text or number
    if (!isNaN(Number(rawFormula)) && rawFormula.trim() !== '') {
      return Number(rawFormula);
    }
    return rawFormula;
  }

  const formula = rawFormula.slice(1).trim();
  const upper = formula.toUpperCase();

  try {
    // 1. SUM
    if (upper.startsWith('SUM(') && upper.endsWith(')')) {
      const inside = formula.slice(4, -1);
      const args = splitParams(inside);
      let sum = 0;
      for (const arg of args) {
        if (arg.includes(':')) {
          const cells = expandRange(arg);
          for (const cell of cells) {
            sum += getCellNumeric(grid, cell);
          }
        } else {
          // Direct cell or number
          const addr = parseCellAddress(arg);
          if (addr) {
            sum += getCellNumeric(grid, arg.toUpperCase());
          } else {
            const num = parseFloat(arg);
            if (!isNaN(num)) sum += num;
          }
        }
      }
      return Math.round(sum * 100) / 100;
    }

    // 2. AVERAGE
    if (upper.startsWith('AVERAGE(') && upper.endsWith(')')) {
      const inside = formula.slice(8, -1);
      const args = splitParams(inside);
      let sum = 0;
      let count = 0;
      for (const arg of args) {
        if (arg.includes(':')) {
          const cells = expandRange(arg);
          for (const cell of cells) {
            const rawVal = getCellValue(grid, cell);
            if (rawVal !== '' && rawVal !== null && rawVal !== undefined) {
              sum += getCellNumeric(grid, cell);
              count++;
            }
          }
        } else {
          const addr = parseCellAddress(arg);
          if (addr) {
            sum += getCellNumeric(grid, arg.toUpperCase());
            count++;
          } else {
            const num = parseFloat(arg);
            if (!isNaN(num)) {
              sum += num;
              count++;
            }
          }
        }
      }
      return count > 0 ? Math.round((sum / count) * 100) / 100 : '#DIV/0!';
    }

    // 3. MAX
    if (upper.startsWith('MAX(') && upper.endsWith(')')) {
      const inside = formula.slice(4, -1);
      const cells = expandRange(inside.replace(/;/g, ',').split(',')[0]);
      if (cells.length === 0) return 0;
      let max = -Infinity;
      for (const cell of cells) {
        const val = getCellNumeric(grid, cell);
        if (val > max) max = val;
      }
      return max === -Infinity ? 0 : max;
    }

    // 4. MIN
    if (upper.startsWith('MIN(') && upper.endsWith(')')) {
      const inside = formula.slice(4, -1);
      const cells = expandRange(inside.replace(/;/g, ',').split(',')[0]);
      if (cells.length === 0) return 0;
      let min = Infinity;
      for (const cell of cells) {
        const val = getCellNumeric(grid, cell);
        if (val < min) min = val;
      }
      return min === Infinity ? 0 : min;
    }

    // 5. COUNT
    if (upper.startsWith('COUNT(') && upper.endsWith(')')) {
      const inside = formula.slice(6, -1);
      const cells = expandRange(inside.replace(/;/g, ',').split(',')[0]);
      let count = 0;
      for (const cell of cells) {
        const raw = getCellValue(grid, cell);
        if (raw !== '' && !isNaN(Number(raw))) count++;
      }
      return count;
    }

    // 6. COUNTA
    if (upper.startsWith('COUNTA(') && upper.endsWith(')')) {
      const inside = formula.slice(7, -1);
      const cells = expandRange(inside.replace(/;/g, ',').split(',')[0]);
      let count = 0;
      for (const cell of cells) {
        const raw = getCellValue(grid, cell);
        if (raw !== '' && raw !== null && raw !== undefined) count++;
      }
      return count;
    }

    // 7. IF(condition, valTrue, valFalse)
    if (upper.startsWith('IF(') && upper.endsWith(')')) {
      const inside = formula.slice(3, -1);
      const params = splitParams(inside);
      if (params.length < 2) return '#VALUE!';

      const conditionStr = params[0];
      const trueVal = cleanStringLiteral(params[1]);
      const falseVal = params[2] ? cleanStringLiteral(params[2]) : '';

      const condResult = evaluateCondition(conditionStr, grid);
      return condResult ? trueVal : falseVal;
    }

    // 8. CONCAT or CONCATENATE
    if ((upper.startsWith('CONCAT(') || upper.startsWith('CONCATENATE(')) && upper.endsWith(')')) {
      const prefixLen = upper.startsWith('CONCAT(') ? 7 : 12;
      const inside = formula.slice(prefixLen, -1);
      const params = splitParams(inside);
      return params
        .map((p) => {
          if (p.startsWith('"') || p.startsWith("'")) {
            return cleanStringLiteral(p);
          }
          const addr = parseCellAddress(p);
          if (addr) return String(getCellValue(grid, p.toUpperCase()));
          return p;
        })
        .join('');
    }

    // 9. UPPER, LOWER, PROPER, LEN
    if (upper.startsWith('UPPER(') && upper.endsWith(')')) {
      const inside = formula.slice(6, -1);
      const val = parseCellAddress(inside) ? getCellValue(grid, inside.toUpperCase()) : cleanStringLiteral(inside);
      return String(val).toUpperCase();
    }
    if (upper.startsWith('LOWER(') && upper.endsWith(')')) {
      const inside = formula.slice(6, -1);
      const val = parseCellAddress(inside) ? getCellValue(grid, inside.toUpperCase()) : cleanStringLiteral(inside);
      return String(val).toLowerCase();
    }
    if (upper.startsWith('PROPER(') && upper.endsWith(')')) {
      const inside = formula.slice(7, -1);
      const val = parseCellAddress(inside) ? getCellValue(grid, inside.toUpperCase()) : cleanStringLiteral(inside);
      return String(val).replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (upper.startsWith('LEN(') && upper.endsWith(')')) {
      const inside = formula.slice(4, -1);
      const val = parseCellAddress(inside) ? getCellValue(grid, inside.toUpperCase()) : cleanStringLiteral(inside);
      return String(val).length;
    }

    // 10. Simple direct cell reference e.g. =A1
    if (parseCellAddress(upper)) {
      return getCellValue(grid, upper);
    }

    // 11. Arithmetic expressions: e.g. =B2+C2 or =(B2+C2)/2 or =A1*10
    return evaluateArithmetic(formula, grid);
  } catch (err) {
    return '#ERROR!';
  }
}

// Evaluate condition such as "B2>=75", "A1='Laki-laki'", "C3<60"
function evaluateCondition(cond: string, grid: GridData): boolean {
  const operators = ['>=', '<=', '<>', '!=', '==', '=', '>', '<'];
  let matchedOp = '';
  for (const op of operators) {
    if (cond.includes(op)) {
      matchedOp = op;
      break;
    }
  }

  if (!matchedOp) return false;

  const [leftRaw, rightRaw] = cond.split(matchedOp);
  const leftStr = leftRaw.trim();
  const rightStr = rightRaw.trim();

  let leftVal: any = parseCellAddress(leftStr) ? getCellValue(grid, leftStr.toUpperCase()) : leftStr;
  let rightVal: any = parseCellAddress(rightStr) ? getCellValue(grid, rightStr.toUpperCase()) : cleanStringLiteral(rightStr);

  const leftNum = parseFloat(leftVal);
  const rightNum = parseFloat(rightVal);
  const isNumeric = !isNaN(leftNum) && !isNaN(rightNum);

  if (isNumeric) {
    leftVal = leftNum;
    rightVal = rightNum;
  } else {
    leftVal = String(leftVal).toLowerCase().trim();
    rightVal = String(rightVal).toLowerCase().trim();
  }

  switch (matchedOp) {
    case '>=':
      return leftVal >= rightVal;
    case '<=':
      return leftVal <= rightVal;
    case '>':
      return leftVal > rightVal;
    case '<':
      return leftVal < rightVal;
    case '=':
    case '==':
      return leftVal === rightVal;
    case '<>':
    case '!=':
      return leftVal !== rightVal;
    default:
      return false;
  }
}

// Evaluate simple arithmetic e.g. B2+C2 or B2*2 or (A1+B1)/2
function evaluateArithmetic(expr: string, grid: GridData): number | string {
  // Replace cell addresses with numeric values
  const replaced = expr.replace(/[A-Za-z]+\d+/g, (match) => {
    const n = getCellNumeric(grid, match.toUpperCase());
    return String(n);
  });

  // Only allow digits, math operators, spaces, decimals, parentheses
  if (!/^[\d\s+\-*/().%]+$/.test(replaced)) {
    return '#VALUE!';
  }

  try {
    // Safe numeric arithmetic parser
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${replaced})`)();
    if (result === Infinity || result === -Infinity) return '#DIV/0!';
    if (typeof result === 'number' && !isNaN(result)) {
      return Math.round(result * 100) / 100;
    }
    return '#VALUE!';
  } catch {
    return '#VALUE!';
  }
}

// Export grid table to CSV formatted with UTF-8 BOM
export function exportGridToCSV(grid: GridData, cols: string[] = COLUMNS, rowCount: number = ROW_COUNT): string {
  const rows: string[] = [];
  
  // Header row
  rows.push(['No.', ...cols].join(','));

  for (let r = 1; r <= rowCount; r++) {
    const rowValues = cols.map((col) => {
      const cell = grid[`${col}${r}`];
      const val = cell ? String(cell.value) : '';
      // Escape commas and quotes for CSV
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    rows.push([r, ...rowValues].join(','));
  }

  return '\uFEFF' + rows.join('\r\n');
}

// Trigger browser download for CSV
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export data directly as true Microsoft Excel .xlsx workbook
export function downloadXLSX(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  sheetName: string = 'SDN 006'
) {
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Auto-fit column widths
  const colWidths = headers.map((h, i) => {
    let maxLen = String(h).length;
    rows.forEach((r) => {
      const valStr = r[i] !== undefined && r[i] !== null ? String(r[i]) : '';
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.max(maxLen + 3, 12) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  const safeSheetName = sheetName.replace(/[:\\/?*\[\]]/g, '').slice(0, 31) || 'Sheet1';
  XLSX.utils.book_append_sheet(wb, ws, safeSheetName);

  const safeFilename = filename.replace(/\.(xlsx|csv)$/i, '');
  XLSX.writeFile(wb, `${safeFilename}.xlsx`);
}

// Export interactive spreadsheet grid directly to .xlsx
export function downloadGridAsXLSX(
  filename: string,
  grid: GridData,
  cols: string[] = COLUMNS,
  rowCount: number = ROW_COUNT,
  sheetName: string = 'Lembar Kerja'
) {
  const headers = ['No.', ...cols];
  const rows: (string | number)[][] = [];

  for (let r = 1; r <= rowCount; r++) {
    const rowValues = cols.map((col) => {
      const cell = grid[`${col}${r}`];
      if (!cell) return '';
      return cell.value;
    });
    rows.push([r, ...rowValues]);
  }

  downloadXLSX(filename, headers, rows, sheetName);
}

