export type FormulaCategory = 
  | 'Logika'
  | 'Pencarian'
  | 'Statistik & Hitungan'
  | 'Teks'
  | 'Tanggal & Waktu'
  | 'Administrasi Sekolah';

export type FormulaLevel = 'Dasar' | 'Menengah' | 'Mahir';

export interface FormulaParam {
  name: string;
  description: string;
  required: boolean;
}

export interface SchoolExample {
  title: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
  formulaUsed: string;
  formulaEng: string;
  resultExplanation: string;
}

export interface ExcelFormula {
  id: string;
  name: string;
  category: FormulaCategory;
  level: FormulaLevel;
  syntaxIndo: string;
  syntaxEng: string;
  summary: string;
  explanation: string;
  params: FormulaParam[];
  schoolExample: SchoolExample;
  commonErrors: string[];
  tips: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface SchoolTemplate {
  id: string;
  title: string;
  category: 'Akademik & Nilai' | 'Kesiswaan & Absensi' | 'Keuangan & BOS' | 'Sarpras & Inventaris' | 'Kepegawaian';
  description: string;
  targetClass: string;
  rowCount: number;
  columnCount: number;
  downloadsCount: number;
  lastUpdated: string;
  tags: string[];
  status: 'Aktif' | 'Arsip' | 'Draft';
  sampleHeaders: string[];
  sampleRows: (string | number)[][];
  keyFormulas: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  scenario: string;
  formulaCode?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: FormulaLevel;
}

export interface CellData {
  raw: string; // The user input (e.g., "=SUM(A1:A3)" or "85")
  value: string | number; // Evaluated display value
  hasFormula: boolean;
  error?: string;
}

export type GridData = Record<string, CellData>; // key: "A1", "B2", etc.

export type VbaCategory =
  | 'Otomasi Rapor & Nilai'
  | 'Cetak & Ekspor PDF'
  | 'Fungsi Kustom (UDF)'
  | 'Administrasi & BOS'
  | 'Formulir & Tombol Interaktif';

export interface VbaSnippet {
  id: string;
  title: string;
  category: VbaCategory;
  summary: string;
  explanation: string;
  code: string;
  sampleUse: string;
  tips: string;
  tags: string[];
  isUserCreated?: boolean;
  createdAt?: string;
}

