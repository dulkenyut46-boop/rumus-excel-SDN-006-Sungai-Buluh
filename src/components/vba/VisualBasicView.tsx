import React, { useState, useEffect, useMemo } from 'react';
import {
  Code,
  Copy,
  Check,
  Search,
  Filter,
  Sparkles,
  Lightbulb,
  FileCode,
  BookOpen,
  ArrowRight,
  HelpCircle,
  FolderCode,
  Cpu,
  Save,
  Plus,
  Trash2,
  Edit3,
  HardDrive,
  FileDown,
  UserCheck,
  ExternalLink,
  Layers,
  Printer,
  Palette,
} from 'lucide-react';
import { VbaSnippet, VbaCategory } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { INITIAL_VBA_SNIPPETS, VBA_TUTORIAL_STEPS } from '../../data/vbaData';

const LOCAL_STORAGE_KEY = 'sdn006_custom_vba_snippets';

export const VisualBasicView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'generator' | 'tutorial'>('catalog');
  
  // Custom user snippets with LocalStorage persistence
  const [customSnippets, setCustomSnippets] = useState<VbaSnippet[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Gagal membaca skrip VBA dari localStorage', e);
    }
    return [];
  });

  // Save to LocalStorage whenever customSnippets changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customSnippets));
    } catch (e) {
      console.error('Gagal menyimpan skrip VBA ke localStorage', e);
    }
  }, [customSnippets]);

  // Combined snippets
  const allSnippets = useMemo(() => {
    return [...customSnippets, ...INITIAL_VBA_SNIPPETS];
  }, [customSnippets]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filterUserOnly, setFilterUserOnly] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<VbaSnippet>(() => {
    return customSnippets.length > 0 ? customSnippets[0] : INITIAL_VBA_SNIPPETS[0];
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Generator State
  const [genType, setGenType] = useState<
    'auto-format' | 'export-range-pdf' | 'cetak-pdf' | 'kunci-rumus' | 'clear-form' | 'terbilang'
  >('auto-format');
  
  // Generator Parameters
  const [genKktpVal, setGenKktpVal] = useState('75');
  const [genFormatRange, setGenFormatRange] = useState('C5:G40');
  const [genExportRange, setGenExportRange] = useState('A1:H40');
  const [genExportOrientation, setGenExportOrientation] = useState<'xlLandscape' | 'xlPortrait'>('xlLandscape');
  const [genExportDocName, setGenExportDocName] = useState('RekapLeger5A');
  const [genSheetRapor, setGenSheetRapor] = useState('CetakRapor');
  const [genKeyCell, setGenKeyCell] = useState('C2');
  const [genTotalStudents, setGenTotalStudents] = useState('35');
  const [genPassword, setGenPassword] = useState('SDN006_AMAN');
  const [genInputSheet, setGenInputSheet] = useState('InputNilai');
  const [genInputRange, setGenInputRange] = useState('C5:G40');

  // Modal State for Saving / Creating / Editing Custom Script
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<VbaCategory>('Otomasi Rapor & Nilai');
  const [formSummary, setFormSummary] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formSampleUse, setFormSampleUse] = useState('');
  const [formTips, setFormTips] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete Confirm Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories: (string | VbaCategory)[] = [
    'Semua',
    'Otomasi Rapor & Nilai',
    'Cetak & Ekspor PDF',
    'Fungsi Kustom (UDF)',
    'Administrasi & BOS',
    'Formulir & Tombol Interaktif',
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredSnippets = useMemo(() => {
    return allSnippets.filter((s) => {
      if (filterUserOnly && !s.isUserCreated) {
        return false;
      }
      if (selectedCategory !== 'Semua' && s.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.explanation.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allSnippets, selectedCategory, searchQuery, filterUserOnly]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Kode VBA berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadBas = (snippet: VbaSnippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const safeName = snippet.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
    link.href = URL.createObjectURL(blob);
    link.download = `${safeName}.bas`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File modul "${safeName}.bas" berhasil diunduh!`);
  };

  // 1-Click Load into Editor Modal for Customization & Saving
  const handleLoadIntoEditor = (snippet: VbaSnippet) => {
    setEditingSnippetId(null);
    setFormTitle(snippet.isUserCreated ? snippet.title : `${snippet.title} (Kustom Saya)`);
    setFormCategory(snippet.category);
    setFormSummary(snippet.summary);
    setFormCode(snippet.code);
    setFormSampleUse(snippet.sampleUse);
    setFormTips(snippet.tips);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // 1-Click Fast Clone directly to LocalStorage
  const handleQuickClone = (snippet: VbaSnippet) => {
    const clonedSnippet: VbaSnippet = {
      ...snippet,
      id: `user-vba-${Date.now()}`,
      title: `${snippet.title} (Tersimpan)`,
      summary: `${snippet.summary} - Disimpan di koleksi lokal`,
      isUserCreated: true,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setCustomSnippets((prev) => [clonedSnippet, ...prev]);
    setActiveSnippet(clonedSnippet);
    showToast(`"${snippet.title}" berhasil disimpan ke skrip lokal Anda!`);
  };

  // Generate dynamic VBA code
  const generatedCode = useMemo(() => {
    if (genType === 'auto-format') {
      return `' ========================================================
' MACRO AUTO-FORMAT NILAI RAPOR - GENERATED SDN 006
' Range Target: ${genFormatRange} | KKTP Standar: ${genKktpVal}
' ========================================================
Sub AutoFormatNilaiLeger()
    Dim ws As Worksheet
    Dim rngNilai As Range
    Dim cell As Range
    Dim kktp As Double
    
    Set ws = ActiveSheet
    kktp = ${genKktpVal}#
    
    ' Rentang tabel nilai siswa
    If TypeName(Selection) = "Range" And Selection.Count > 1 Then
        Set rngNilai = Selection
    Else
        Set rngNilai = ws.Range("${genFormatRange}")
    End If
    
    Application.ScreenUpdating = False
    
    ' Bersihkan format lama
    rngNilai.Interior.ColorIndex = xlNone
    rngNilai.Font.ColorIndex = xlAutomatic
    rngNilai.HorizontalAlignment = xlCenter
    rngNilai.VerticalAlignment = xlCenter
    rngNilai.NumberFormat = "0.00"
    
    ' Pasang border tipis
    With rngNilai.Borders
        .LineStyle = xlContinuous
        .Weight = xlThin
        .Color = RGB(180, 180, 180)
    End With
    
    ' Pewarnaan bersyarat: Hijau (>=KKTP), Merah (<KKTP)
    For Each cell In rngNilai
        If IsNumeric(cell.Value) And Not IsEmpty(cell.Value) Then
            If cell.Value >= kktp Then
                cell.Interior.Color = RGB(220, 245, 225) ' Hijau pastel segar
                cell.Font.Color = RGB(20, 90, 40)
                cell.Font.Bold = False
            Else
                cell.Interior.Color = RGB(255, 225, 225) ' Merah muda pastel
                cell.Font.Color = RGB(150, 20, 20)
                cell.Font.Bold = True
            End If
        End If
    Next cell
    
    Application.ScreenUpdating = True
    MsgBox "Format nilai selesai dirapikan! Tuntas (>= " & kktp & ") hijau, Remedial merah.", vbInformation, "SDN 006"
End Sub`;
    }

    if (genType === 'export-range-pdf') {
      return `' ========================================================
' MACRO EXPORT RANGE / SELEKSI KE PDF - GENERATED SDN 006
' Range: ${genExportRange} | Orientasi: ${genExportOrientation} | Judul: ${genExportDocName}
' ========================================================
Sub ExportRangeKePDF()
    Dim ws As Worksheet
    Dim rngTarget As Range
    Dim folderPath As String, fullPath As String
    
    Set ws = ActiveSheet
    
    If TypeName(Selection) = "Range" And Selection.Count > 1 Then
        Set rngTarget = Selection
    Else
        Set rngTarget = ws.Range("${genExportRange}")
    End If
    
    folderPath = ThisWorkbook.Path & Application.PathSeparator & "Dokumen_PDF" & Application.PathSeparator
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath
    
    fullPath = folderPath & "SDN006_${genExportDocName}_" & Format(Now, "yyyy-mm-dd_hhmm") & ".pdf"
    
    Application.ScreenUpdating = False
    
    With ws.PageSetup
        .PrintArea = rngTarget.Address
        .Orientation = ${genExportOrientation}
        .PaperSize = xlPaperA4
        .Zoom = False
        .FitToPagesWide = 1
        .FitToPagesTall = 1
        .CenterHorizontally = True
    End With
    
    ws.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=fullPath, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False, _
        OpenAfterPublish:=True
        
    Application.ScreenUpdating = True
    MsgBox "Tabel berhasil diekspor ke PDF!" & vbCrLf & fullPath, vbInformation, "SDN 006"
End Sub`;
    }

    if (genType === 'cetak-pdf') {
      return `' ========================================================
' MACRO CETAK MASSAL RAPOR OTOMATIS - GENERATED SDN 006
' Sheet: ${genSheetRapor} | Sel Kunci: ${genKeyCell} | Total: ${genTotalStudents} Siswa
' ========================================================
Sub CetakRaporOtomatisPDF()
    Dim ws As Worksheet
    Dim i As Integer, totalSiswa As Integer
    Dim folderPath As String, filePath As String
    Dim namaSiswa As String
    
    Set ws = ThisWorkbook.Sheets("${genSheetRapor}")
    totalSiswa = ${genTotalStudents}
    
    folderPath = ThisWorkbook.Path & Application.PathSeparator & "PDF_Rapor" & Application.PathSeparator
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath
    
    Application.ScreenUpdating = False
    
    For i = 1 To totalSiswa
        ws.Range("${genKeyCell}").Value = i
        Calculate
        namaSiswa = ws.Range("D5").Value
        
        filePath = folderPath & "Rapor_No_" & i & "_" & namaSiswa & ".pdf"
        
        ws.ExportAsFixedFormat _
            Type:=xlTypePDF, _
            Filename:=filePath, _
            Quality:=xlQualityStandard, _
            IncludeDocProperties:=True, _
            IgnorePrintAreas:=False, _
            OpenAfterPublish:=False
    Next i
    
    Application.ScreenUpdating = True
    MsgBox "Berhasil mengekspor " & totalSiswa & " rapor siswa ke folder: " & vbCrLf & folderPath, vbInformation, "SDN 006"
End Sub`;
    }

    if (genType === 'kunci-rumus') {
      return `' ========================================================
' MACRO PROTEKSI SEL BERUMUS DENGAN PASSWORD SDN 006
' Password: ${genPassword}
' ========================================================
Sub LindungiSelBerumus()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    ws.Unprotect Password:="${genPassword}"
    ws.Cells.Locked = False
    
    On Error Resume Next
    ws.Cells.SpecialCells(xlCellTypeFormulas).Locked = True
    On Error GoTo 0
    
    ws.Protect Password:="${genPassword}", _
        DrawingObjects:=True, Contents:=True, Scenarios:=True
        
    MsgBox "Seluruh rumus berhasil dikunci rapat dengan password: ${genPassword}", vbInformation, "Keamanan SDN 006"
End Sub`;
    }

    if (genType === 'clear-form') {
      return `' ========================================================
' MACRO RESET FORM TANPA MERUSAK RUMUS - SDN 006
' Sheet: ${genInputSheet} | Area: ${genInputRange}
' ========================================================
Sub BersihkanFormNilai()
    Dim ws As Worksheet
    Dim areaInput As Range
    
    Set ws = ThisWorkbook.Sheets("${genInputSheet}")
    Set areaInput = ws.Range("${genInputRange}")
    
    If MsgBox("Kosongkan nilai isian siswa?", vbQuestion + vbYesNo, "Konfirmasi Reset") = vbYes Then
        On Error Resume Next
        areaInput.SpecialCells(xlCellTypeConstants).ClearContents
        On Error GoTo 0
        MsgBox "Nilai lama berhasil dibersihkan, rumus tetap utuh!", vbInformation, "SDN 006"
    End If
End Sub`;
    }

    return INITIAL_VBA_SNIPPETS[0].code;
  }, [
    genType,
    genKktpVal,
    genFormatRange,
    genExportRange,
    genExportOrientation,
    genExportDocName,
    genSheetRapor,
    genKeyCell,
    genTotalStudents,
    genPassword,
    genInputSheet,
    genInputRange,
  ]);

  // Open Save / Edit Modal from Generator
  const handleOpenSaveFromGenerator = () => {
    let title = 'Macro Cetak Rapor Massal PDF';
    let cat: VbaCategory = 'Cetak & Ekspor PDF';
    let summary = 'Hasil racikan generator untuk sheet ' + genSheetRapor;

    if (genType === 'auto-format') {
      title = 'Macro Auto-Format Nilai KKTP ' + genKktpVal;
      cat = 'Otomasi Rapor & Nilai';
      summary = 'Auto-format pewarnaan dan border untuk area ' + genFormatRange;
    } else if (genType === 'export-range-pdf') {
      title = 'Macro Export PDF ' + genExportDocName;
      cat = 'Cetak & Ekspor PDF';
      summary = 'Ekspor range ' + genExportRange + ' ke 1 halaman PDF ' + genExportOrientation;
    } else if (genType === 'kunci-rumus') {
      title = 'Macro Kunci Rumus Password ' + genPassword;
      cat = 'Administrasi & BOS';
      summary = 'Proteksi rumus otomatis dengan password';
    } else if (genType === 'clear-form') {
      title = 'Macro Reset Nilai Form ' + genInputSheet;
      cat = 'Formulir & Tombol Interaktif';
      summary = 'Bersihkan nilai input tanpa merusak rumus di ' + genInputRange;
    } else if (genType === 'terbilang') {
      title = 'Fungsi Kustom Terbilang Rupiah';
      cat = 'Fungsi Kustom (UDF)';
      summary = 'UDF konversi angka ke ejaan kata Rupiah';
    }

    setEditingSnippetId(null);
    setFormTitle(title);
    setFormCategory(cat);
    setFormSummary(summary);
    setFormCode(generatedCode);
    setFormSampleUse('Jalankan macro atau pasang ke tombol');
    setFormTips('Disimpan permanen di memori lokal peramban Anda.');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open New Blank Script Modal
  const handleOpenCreateNew = () => {
    setEditingSnippetId(null);
    setFormTitle('');
    setFormCategory('Otomasi Rapor & Nilai');
    setFormSummary('');
    setFormCode(`Sub NamaMacroSaya()
    ' Tulis kode VBA Anda di sini
    MsgBox "Halo dari Macro SDN 006!", vbInformation, "SDN 006"
End Sub`);
    setFormSampleUse('Jalankan dengan F5 atau Assign Macro');
    setFormTips('Pastikan file Excel Anda disimpan sebagai .xlsm');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Script Modal
  const handleOpenEdit = (snippet: VbaSnippet) => {
    setEditingSnippetId(snippet.id);
    setFormTitle(snippet.title);
    setFormCategory(snippet.category);
    setFormSummary(snippet.summary);
    setFormCode(snippet.code);
    setFormSampleUse(snippet.sampleUse);
    setFormTips(snippet.tips);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Save / Update to LocalStorage
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formTitle.trim()) errs.title = 'Judul skrip wajib diisi';
    if (!formCode.trim()) errs.code = 'Kode VBA tidak boleh kosong';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editingSnippetId) {
      // Update existing
      setCustomSnippets((prev) =>
        prev.map((item) =>
          item.id === editingSnippetId
            ? {
                ...item,
                title: formTitle.trim(),
                category: formCategory,
                summary: formSummary.trim() || 'Skrip VBA buatan pengguna',
                code: formCode,
                sampleUse: formSampleUse.trim() || 'Jalankan makro',
                tips: formTips.trim() || 'Tersimpan di local storage',
              }
            : item
        )
      );
      showToast('Skrip VBA berhasil diperbarui di penyimpanan lokal!');
    } else {
      // Create new
      const newSnippet: VbaSnippet = {
        id: `user-vba-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim() || 'Skrip VBA kustom SDN 006',
        explanation: 'Skrip VBA kustom yang dibuat dan disimpan di browser Anda.',
        code: formCode,
        sampleUse: formSampleUse.trim() || 'Jalankan makro',
        tips: formTips.trim() || 'Tersimpan otomatis di LocalStorage',
        tags: ['kustom', 'skrip saya', 'sdn 006'],
        isUserCreated: true,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };

      setCustomSnippets((prev) => [newSnippet, ...prev]);
      setActiveSnippet(newSnippet);
      showToast('Skrip VBA berhasil disimpan ke penyimpanan lokal!');
    }

    setIsFormModalOpen(false);
  };

  // Delete from LocalStorage
  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;

    setCustomSnippets((prev) => prev.filter((item) => item.id !== deleteConfirmId));
    if (activeSnippet.id === deleteConfirmId) {
      setActiveSnippet(INITIAL_VBA_SNIPPETS[0]);
    }
    setDeleteConfirmId(null);
    showToast('Skrip VBA kustom telah dihapus dari penyimpanan lokal.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Visual Basic (VBA) & Makro Otomasi SDN 006
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pustaka skrip administrasi siap pakai (Auto-Format Nilai, Export Range ke PDF, Terbilang) yang dapat langsung dimuat ke editor pengguna.
          </p>
        </div>

        {/* Action Controls & Sub-Tab Navigation */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenCreateNew}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Skrip Baru</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'catalog'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderCode className="w-3.5 h-3.5" />
              <span>Katalog ({allSnippets.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('generator')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'generator'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Generator & Muat ke Editor</span>
            </button>
            <button
              onClick={() => setActiveSubTab('tutorial')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'tutorial'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan (Alt+F11)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Quick Load Pills for School Admin */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              Pustaka Makro Paling Sering Dipakai di Sekolah:
            </h4>
            <p className="text-[11px] text-slate-400">
              Klik untuk langsung melihat, menguji, dan memuat ke editor VBA Anda
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { label: 'Auto-Format Nilai Rapor', id: 'vba-auto-format-nilai', icon: Palette },
            { label: 'Export Range ke PDF', id: 'vba-export-range-pdf', icon: Printer },
            { label: 'Fungsi =Terbilang(Rp)', id: 'vba-terbilang', icon: Code },
            { label: 'Validasi Digit NISN & NIK', id: 'vba-validasi-nisn-nik', icon: Check },
            { label: 'Cetak Rapor PDF Massal', id: 'vba-cetak-rapor-pdf', icon: FileDown },
          ].map((item) => {
            const Icon = item.icon;
            const target = allSnippets.find((s) => s.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (target) {
                    setActiveSnippet(target);
                    setActiveSubTab('catalog');
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              >
                <Icon className="w-3 h-3 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Local Storage Indicator Banner */}
      {customSnippets.length > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Penyimpanan Lokal Aktif:</strong> Ada <strong>{customSnippets.length}</strong> skrip VBA buatan Anda yang tersimpan aman di browser ini.
            </span>
          </div>
          <button
            onClick={() => setFilterUserOnly(!filterUserOnly)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
              filterUserOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
            }`}
          >
            {filterUserOnly ? 'Tampilkan Semua Skrip' : 'Filter Skrip Saya Saja'}
          </button>
        </div>
      )}

      {/* SUB-TAB 1: CATALOG OF READY-TO-USE MACROS */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari script makro VBA (auto-format, export pdf, terbilang, nisn)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <button
                  onClick={() => setFilterUserOnly(!filterUserOnly)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    filterUserOnly
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Skrip Saya ({customSnippets.length})</span>
                </button>
                <span className="text-slate-400">
                  Total: <strong className="text-emerald-600 dark:text-emerald-400">{filteredSnippets.length}</strong>
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Snippet List (Left) */}
            <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredSnippets.map((item) => {
                const isSelected = activeSnippet.id === item.id;
                const isUser = item.isUserCreated;

                return (
                  <Card
                    key={item.id}
                    onClick={() => setActiveSnippet(item)}
                    className={`p-4 cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                        : 'hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        {isUser && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            <HardDrive className="w-2.5 h-2.5" /> Lokal
                          </span>
                        )}
                      </div>
                      <Badge variant="emerald" size="sm">
                        {item.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[150px]">
                        {item.sampleUse}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadIntoEditor(item);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Muat kode ini ke editor pengguna"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Muat ke Editor</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {filteredSnippets.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  Tidak ada skrip yang sesuai filter.
                </div>
              )}
            </div>

            {/* Code Detail & Inspector (Right) */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 bg-slate-900 border-slate-800 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        {activeSnippet.title}
                      </h3>
                      {activeSnippet.isUserCreated && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                          Tersimpan di Browser
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeSnippet.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                    {/* Load into Editor Button (Directly requested feature) */}
                    <button
                      onClick={() => handleLoadIntoEditor(activeSnippet)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      title="Muat kode ini ke editor VBA pengguna untuk dimodifikasi dan disimpan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Muat ke Editor Saya</span>
                    </button>

                    {/* Quick Clone to user collection if not already user created */}
                    {!activeSnippet.isUserCreated && (
                      <button
                        onClick={() => handleQuickClone(activeSnippet)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Simpan salinan skrip ini langsung ke koleksi lokal saya"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Kloning ke Lokal</span>
                      </button>
                    )}

                    {/* User Actions for custom script: Delete */}
                    {activeSnippet.isUserCreated && (
                      <button
                        onClick={() => setDeleteConfirmId(activeSnippet.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
                        title="Hapus dari Penyimpanan Lokal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download as .bas file */}
                    <button
                      onClick={() => handleDownloadBas(activeSnippet)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Unduh File Modul (.bas)"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    {/* Copy code */}
                    <button
                      onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
                    >
                      {copiedId === activeSnippet.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Kode</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Window with syntax look */}
                <div className="my-4 max-h-[380px] overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs leading-relaxed text-emerald-300 shadow-inner select-all">
                  <pre className="whitespace-pre">{activeSnippet.code}</pre>
                </div>

                {/* Explanation & Usage */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs space-y-2 text-slate-300">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    Penjelasan Cara Kerja:
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {activeSnippet.explanation}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-emerald-400">Cara Pakai:</span>
                    <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">
                      {activeSnippet.sampleUse}
                    </code>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800">
                  {activeSnippet.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTERACTIVE VBA GENERATOR */}
      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Cpu className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Pilih Kebutuhan Otomasi Sekolah:
                </h3>
              </div>

              {/* Type Select */}
              <div className="space-y-2 text-xs">
                {[
                  { id: 'auto-format', title: 'Auto-Format Nilai Rapor & KKTP', desc: 'Pewarnaan tuntas/remedial & garis border rapi' },
                  { id: 'export-range-pdf', title: 'Export Range / Seleksi ke PDF', desc: 'Ekspor tabel 1 halaman A4 pas tanpa terpotong' },
                  { id: 'cetak-pdf', title: 'Cetak Massal Rapor ke PDF', desc: 'Looping siswa 1 s/d selesai ke folder' },
                  { id: 'kunci-rumus', title: 'Kunci Sel Berumus (Protect)', desc: 'Amankan formula dengan password' },
                  { id: 'clear-form', title: 'Bersihkan Input Formulir', desc: 'Hapus nilai lama tanpa merusak rumus' },
                  { id: 'terbilang', title: 'Fungsi Terbilang Kwitansi', desc: 'Konversi angka ke kalimat Rupiah' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGenType(item.id as any)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      genType === item.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>{item.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic Form Customizer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">
                  Sesuaikan Parameter Lembar Kerja:
                </h4>

                {genType === 'auto-format' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Ambang Batas KKTP
                        </label>
                        <input
                          type="number"
                          value={genKktpVal}
                          onChange={(e) => setGenKktpVal(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Rentang Sel Nilai
                        </label>
                        <input
                          type="text"
                          value={genFormatRange}
                          onChange={(e) => setGenFormatRange(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {genType === 'export-range-pdf' && (
                  <>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Rentang Tabel yang Diekspor
                      </label>
                      <input
                        type="text"
                        value={genExportRange}
                        onChange={(e) => setGenExportRange(e.target.value)}
                        placeholder="A1:H40"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Orientasi Kertas
                        </label>
                        <select
                          value={genExportOrientation}
                          onChange={(e) => setGenExportOrientation(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        >
                          <option value="xlLandscape">Landscape (Mendatar)</option>
                          <option value="xlPortrait">Portrait (Tegak)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Nama File PDF
                        </label>
                        <input
                          type="text"
                          value={genExportDocName}
                          onChange={(e) => setGenExportDocName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    </div>
                  </>
                )}

                {genType === 'cetak-pdf' && (
                  <>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Nama Sheet Cetak Rapor
                      </label>
                      <input
                        type="text"
                        value={genSheetRapor}
                        onChange={(e) => setGenSheetRapor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Sel Nomor Urut
                        </label>
                        <input
                          type="text"
                          value={genKeyCell}
                          onChange={(e) => setGenKeyCell(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Total Jumlah Siswa
                        </label>
                        <input
                          type="number"
                          value={genTotalStudents}
                          onChange={(e) => setGenTotalStudents(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {genType === 'kunci-rumus' && (
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Password Pengunci Sheet
                    </label>
                    <input
                      type="text"
                      value={genPassword}
                      onChange={(e) => setGenPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                )}

                {genType === 'clear-form' && (
                  <>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Nama Sheet Input
                      </label>
                      <input
                        type="text"
                        value={genInputSheet}
                        onChange={(e) => setGenInputSheet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Rentang Sel Isian Nilai
                      </label>
                      <input
                        type="text"
                        value={genInputRange}
                        onChange={(e) => setGenInputRange(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Generated Live Output (Right) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-5 bg-slate-900 border-slate-800 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Kode Visual Basic (VBA) Hasil Generator
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Load / Save into User's Editor */}
                  <button
                    onClick={handleOpenSaveFromGenerator}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Muat ke Editor & Simpan</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(generatedCode, 'gen-code')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
                  >
                    {copiedId === 'gen-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="my-4 max-h-[380px] overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs leading-relaxed text-emerald-300 shadow-inner select-all">
                <pre className="whitespace-pre">{generatedCode}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  Klik tombol <strong>&quot;Muat ke Editor & Simpan&quot;</strong> di atas untuk langsung membuka kode ini di editor kustom Anda, melakukan kustomisasi tambahan, dan menyimpannya secara permanen ke memori lokal browser!
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TUTORIAL STEP-BY-STEP */}
      {activeSubTab === 'tutorial' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Langkah Praktis Memasang Kode VBA di Microsoft Excel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ikuti 5 langkah sederhana berikut untuk menjalankan makro pertama Anda di lembar kerja sekolah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VBA_TUTORIAL_STEPS.map((tut) => (
                <div
                  key={tut.step}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-md shadow-emerald-950/20">
                      {tut.step}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm mb-1.5">
                      {tut.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tut.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Langkah ke-{tut.step} dari 5
                  </div>
                </div>
              ))}
            </div>

            {/* Crucial Note about .xlsm */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold text-amber-950 dark:text-amber-100 mb-1">
                  Peringatan Format Simpan Berkas:
                </strong>
                File Excel biasa berformat <code>.xlsx</code> TIDAK dapat menyimpan script makro VBA. Saat menyimpan file, pastikan Anda memilih tipe:
                <strong className="block text-emerald-700 dark:text-emerald-300 font-mono text-xs mt-1">
                  Excel Macro-Enabled Workbook (*.xlsm)
                </strong>
                Jika disimpan sebagai .xlsx, Excel akan otomatis menghapus semua kode VBA yang telah Anda pasang.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* CREATE / EDIT CUSTOM VBA SCRIPT MODAL (EDITOR PENGGUNA) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingSnippetId ? 'Edit Skrip di Editor Pengguna' : 'Editor Skrip VBA Pengguna (Tersimpan Lokal)'}
        subtitle="Sesuaikan kode makro Anda, kode akan tersimpan permanen di memori browser"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Skrip Makro <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Contoh: Macro Auto-Format Nilai Rapor 5A"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
            {formErrors.title && <p className="text-rose-500 text-[11px] mt-1">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Skrip
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="Otomasi Rapor & Nilai">Otomasi Rapor & Nilai</option>
                <option value="Cetak & Ekspor PDF">Cetak & Ekspor PDF</option>
                <option value="Fungsi Kustom (UDF)">Fungsi Kustom (UDF)</option>
                <option value="Administrasi & BOS">Administrasi & BOS</option>
                <option value="Formulir & Tombol Interaktif">Formulir & Tombol Interaktif</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Petunjuk Pemanggilan / Cara Pakai
              </label>
              <input
                type="text"
                value={formSampleUse}
                onChange={(e) => setFormSampleUse(e.target.value)}
                placeholder="Contoh: =AutoFormatNilaiLeger() atau Assign Tombol"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ringkasan Singkat / Kegunaan
            </label>
            <input
              type="text"
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
              placeholder="Contoh: Menghitung & mewarnai rekapitulasi nilai tuntas/remedial otomatis"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Kode Visual Basic (VBA) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                Editor Kode VBA Siap Dimuat
              </span>
            </div>
            <textarea
              rows={12}
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="Sub NamaMacro()&#10;    ...&#10;End Sub"
              className="w-full font-mono text-xs px-3 py-2 bg-slate-950 text-emerald-300 border border-slate-700 rounded-xl focus:outline-hidden focus:border-emerald-500 leading-relaxed"
            />
            {formErrors.code && <p className="text-rose-500 text-[11px] mt-1">{formErrors.code}</p>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
              Tersimpan permanen di LocalStorage browser
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingSnippetId ? 'Simpan Perubahan' : 'Simpan ke Skrip Saya'}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <Card className="max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hapus Skrip VBA Ini?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus skrip kustom ini dari penyimpanan lokal browser Anda? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Ya, Hapus Skrip
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
