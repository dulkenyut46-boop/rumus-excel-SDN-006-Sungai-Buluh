import { GridData } from '../types';

export interface SpreadsheetPreset {
  id: string;
  name: string;
  description: string;
  grid: GridData;
}

export const SPREADSHEET_PRESETS: SpreadsheetPreset[] = [
  {
    id: 'nilai-5a',
    name: 'Daftar Nilai Siswa 5A SDN 006',
    description: 'Menghitung Total Nilai, Rata-rata, dan Status KKTP otomatis dengan =SUM, =AVERAGE, dan =IF',
    grid: {
      A1: { raw: 'No', value: 'No', hasFormula: false },
      B1: { raw: 'Nama Siswa', value: 'Nama Siswa', hasFormula: false },
      C1: { raw: 'Matematika', value: 'Matematika', hasFormula: false },
      D1: { raw: 'B. Indonesia', value: 'B. Indonesia', hasFormula: false },
      E1: { raw: 'IPAS', value: 'IPAS', hasFormula: false },
      F1: { raw: 'Total', value: 'Total', hasFormula: false },
      G1: { raw: 'Rata-rata', value: 'Rata-rata', hasFormula: false },
      H1: { raw: 'Keterangan', value: 'Keterangan', hasFormula: false },

      // Siswa 1
      A2: { raw: '1', value: 1, hasFormula: false },
      B2: { raw: 'Ahmad Faiz', value: 'Ahmad Faiz', hasFormula: false },
      C2: { raw: '85', value: 85, hasFormula: false },
      D2: { raw: '90', value: 90, hasFormula: false },
      E2: { raw: '88', value: 88, hasFormula: false },
      F2: { raw: '=SUM(C2:E2)', value: 263, hasFormula: true },
      G2: { raw: '=AVERAGE(C2:E2)', value: 87.67, hasFormula: true },
      H2: { raw: '=IF(G2>=75; "Tuntas"; "Remedial")', value: 'Tuntas', hasFormula: true },

      // Siswa 2
      A3: { raw: '2', value: 2, hasFormula: false },
      B3: { raw: 'Bilqis Humaira', value: 'Bilqis Humaira', hasFormula: false },
      C3: { raw: '92', value: 92, hasFormula: false },
      D3: { raw: '95', value: 95, hasFormula: false },
      E3: { raw: '94', value: 94, hasFormula: false },
      F3: { raw: '=SUM(C3:E3)', value: 281, hasFormula: true },
      G3: { raw: '=AVERAGE(C3:E3)', value: 93.67, hasFormula: true },
      H3: { raw: '=IF(G3>=75; "Tuntas"; "Remedial")', value: 'Tuntas', hasFormula: true },

      // Siswa 3
      A4: { raw: '3', value: 3, hasFormula: false },
      B4: { raw: 'Citra Kirana', value: 'Citra Kirana', hasFormula: false },
      C4: { raw: '68', value: 68, hasFormula: false },
      D4: { raw: '72', value: 72, hasFormula: false },
      E4: { raw: '70', value: 70, hasFormula: false },
      F4: { raw: '=SUM(C4:E4)', value: 210, hasFormula: true },
      G4: { raw: '=AVERAGE(C4:E4)', value: 70, hasFormula: true },
      H4: { raw: '=IF(G4>=75; "Tuntas"; "Remedial")', value: 'Remedial', hasFormula: true },

      // Siswa 4
      A5: { raw: '4', value: 4, hasFormula: false },
      B5: { raw: 'Dimas Setiawan', value: 'Dimas Setiawan', hasFormula: false },
      C5: { raw: '80', value: 80, hasFormula: false },
      D5: { raw: '82', value: 82, hasFormula: false },
      E5: { raw: '79', value: 79, hasFormula: false },
      F5: { raw: '=SUM(C5:E5)', value: 241, hasFormula: true },
      G5: { raw: '=AVERAGE(C5:E5)', value: 80.33, hasFormula: true },
      H5: { raw: '=IF(G5>=75; "Tuntas"; "Remedial")', value: 'Tuntas', hasFormula: true },

      // Siswa 5
      A6: { raw: '5', value: 5, hasFormula: false },
      B6: { raw: 'Eka Wahyuni', value: 'Eka Wahyuni', hasFormula: false },
      C6: { raw: '74', value: 74, hasFormula: false },
      D6: { raw: '76', value: 76, hasFormula: false },
      E6: { raw: '75', value: 75, hasFormula: false },
      F6: { raw: '=SUM(C6:E6)', value: 225, hasFormula: true },
      G6: { raw: '=AVERAGE(C6:E6)', value: 75, hasFormula: true },
      H6: { raw: '=IF(G6>=75; "Tuntas"; "Remedial")', value: 'Tuntas', hasFormula: true },

      // Rata-rata Kelas (Baris 8)
      A8: { raw: 'REKAP', value: 'REKAP', hasFormula: false },
      B8: { raw: 'Rata-rata Kelas', value: 'Rata-rata Kelas', hasFormula: false },
      C8: { raw: '=AVERAGE(C2:C6)', value: 79.8, hasFormula: true },
      D8: { raw: '=AVERAGE(D2:D6)', value: 83, hasFormula: true },
      E8: { raw: '=AVERAGE(E2:E6)', value: 81.2, hasFormula: true },
      F8: { raw: 'Nilai Tertinggi', value: 'Nilai Tertinggi', hasFormula: false },
      G8: { raw: '=MAX(G2:G6)', value: 93.67, hasFormula: true },
      H8: { raw: 'Nilai Terendah: 70', value: 'Nilai Terendah: 70', hasFormula: false },

      // Nilai Min
      B9: { raw: 'Nilai Terendah', value: 'Nilai Terendah', hasFormula: false },
      C9: { raw: '=MIN(C2:C6)', value: 68, hasFormula: true },
      D9: { raw: '=MIN(D2:D6)', value: 72, hasFormula: true },
      E9: { raw: '=MIN(E2:E6)', value: 70, hasFormula: true },
      F9: { raw: 'Jumlah Siswa', value: 'Jumlah Siswa', hasFormula: false },
      G9: { raw: '=COUNT(A2:A6)', value: 5, hasFormula: true },
      H9: { raw: 'KKTP: 75', value: 'KKTP: 75', hasFormula: false },
    }
  },
  {
    id: 'spj-bos',
    name: 'SPJ Belanja Kas BOS SDN 006',
    description: 'Format rekap kas BOS sederhana dengan penjumlahan otomatis =SUM',
    grid: {
      A1: { raw: 'No', value: 'No', hasFormula: false },
      B1: { raw: 'Tanggal', value: 'Tanggal', hasFormula: false },
      C1: { raw: 'Uraian Pengeluaran', value: 'Uraian Pengeluaran', hasFormula: false },
      D1: { raw: 'Volume', value: 'Volume', hasFormula: false },
      E1: { raw: 'Harga Satuan', value: 'Harga Satuan', hasFormula: false },
      F1: { raw: 'Subtotal (Rp)', value: 'Subtotal (Rp)', hasFormula: false },
      G1: { raw: 'Status Nota', value: 'Status Nota', hasFormula: false },
      H1: { raw: 'Paraf', value: 'Paraf', hasFormula: false },

      A2: { raw: '1', value: 1, hasFormula: false },
      B2: { raw: '02/10/2026', value: '02/10/2026', hasFormula: false },
      C2: { raw: 'Kertas HVS A4 Sidu', value: 'Kertas HVS A4 Sidu', hasFormula: false },
      D2: { raw: '10', value: 10, hasFormula: false },
      E2: { raw: '55000', value: 55000, hasFormula: false },
      F2: { raw: '=D2*E2', value: 550000, hasFormula: true },
      G2: { raw: 'Lengkap', value: 'Lengkap', hasFormula: false },
      H2: { raw: 'Bendahara', value: 'Bendahara', hasFormula: false },

      A3: { raw: '2', value: 2, hasFormula: false },
      B3: { raw: '05/10/2026', value: '05/10/2026', hasFormula: false },
      C3: { raw: 'Tinta Printer Epson 664', value: 'Tinta Printer Epson 664', hasFormula: false },
      D3: { raw: '4', value: 4, hasFormula: false },
      E3: { raw: '95000', value: 95000, hasFormula: false },
      F3: { raw: '=D3*E3', value: 380000, hasFormula: true },
      G3: { raw: 'Lengkap', value: 'Lengkap', hasFormula: false },
      H3: { raw: 'Bendahara', value: 'Bendahara', hasFormula: false },

      A4: { raw: '3', value: 3, hasFormula: false },
      B4: { raw: '09/10/2026', value: '09/10/2026', hasFormula: false },
      C4: { raw: 'Spidol Whiteboard Snowman', value: 'Spidol Whiteboard Snowman', hasFormula: false },
      D4: { raw: '24', value: 24, hasFormula: false },
      E4: { raw: '12000', value: 12000, hasFormula: false },
      F4: { raw: '=D4*E4', value: 288000, hasFormula: true },
      G4: { raw: 'Lengkap', value: 'Lengkap', hasFormula: false },
      H4: { raw: 'Bendahara', value: 'Bendahara', hasFormula: false },

      A5: { raw: 'TOTAL', value: 'TOTAL', hasFormula: false },
      B5: { raw: 'Total Belanja ATK', value: 'Total Belanja ATK', hasFormula: false },
      C5: { raw: '', value: '', hasFormula: false },
      D5: { raw: '=SUM(D2:D4)', value: 38, hasFormula: true },
      E5: { raw: '-', value: '-', hasFormula: false },
      F5: { raw: '=SUM(F2:F4)', value: 1218000, hasFormula: true },
      G5: { raw: 'Terverifikasi', value: 'Terverifikasi', hasFormula: false },
      H5: { raw: 'Kepsek SDN 006', value: 'Kepsek SDN 006', hasFormula: false }
    }
  },
  {
    id: 'lembar-kosong',
    name: 'Lembar Kerja Kosong (Uji Coba Mandiri)',
    description: 'Lembar kosong untuk bereksperimen mengetik rumus sesuka hati',
    grid: {
      A1: { raw: 'Ketik Angka/Rumus Disini', value: 'Ketik Angka/Rumus Disini', hasFormula: false },
      A2: { raw: '10', value: 10, hasFormula: false },
      A3: { raw: '20', value: 20, hasFormula: false },
      A4: { raw: '30', value: 30, hasFormula: false },
      A5: { raw: '=SUM(A2:A4)', value: 60, hasFormula: true }
    }
  }
];
