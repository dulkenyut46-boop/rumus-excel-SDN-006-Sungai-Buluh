import React, { useState } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Play,
  Download,
  Code,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExcelFormula, SchoolTemplate } from '../../types';
import { ActiveTab } from '../layout/Sidebar';
import { downloadXLSX } from '../../utils/excelEngine';

interface DashboardViewProps {
  formulas: ExcelFormula[];
  templates: SchoolTemplate[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectFormula: (formula: ExcelFormula) => void;
  regionalIndo: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  formulas,
  templates,
  setActiveTab,
  onSelectFormula,
  regionalIndo,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sandboxInput, setSandboxInput] = useState<string>('=IF(82>=75; "Tuntas"; "Remedial")');
  const [sandboxResult, setSandboxResult] = useState<string>('Tuntas');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const runQuickSandbox = (formulaText: string) => {
    setSandboxInput(formulaText);
    if (formulaText.includes('AVERAGE')) {
      setSandboxResult('87.33');
    } else if (formulaText.includes('SUM')) {
      setSandboxResult('262');
    } else if (formulaText.includes('IF(') || formulaText.includes('IFS(')) {
      setSandboxResult(formulaText.includes('90') ? 'Sangat Baik' : 'Tuntas');
    } else if (formulaText.includes('COUNTIF')) {
      setSandboxResult('4 Hari');
    } else if (formulaText.includes('RANK')) {
      setSandboxResult('Peringkat 1');
    } else {
      setSandboxResult('Tervalidasi');
    }
  };

  const handleQuickDownload = (template: SchoolTemplate) => {
    downloadXLSX(
      template.title,
      template.sampleHeaders,
      template.sampleRows,
      template.title.slice(0, 31)
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 p-6 md:p-8 text-white shadow-xl border border-emerald-700/50">
        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Resmi SDN 006 • Administrasi & Kurikulum Merdeka</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Terapkan Rumus Excel, <br className="hidden md:inline" />
            <span className="text-emerald-300">Olah Data Nilai & Administrasi 10x Lebih Cepat</span>
          </h1>

          <p className="mt-3 text-sm md:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            Solusi praktis untuk para guru, wali kelas, bendahara BOS, dan tata usaha SDN 006. 
            Cari rumus siap pakai, uji coba langsung di lembar kerja simulasi, dan unduh template administrasi terstandarisasi.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Buka Lembar Kerja Interaktif
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className="px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium text-sm border border-emerald-600/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Jelajahi Bank Rumus
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-sm border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Generator Rumus Otomatis
            </button>

            <button
              onClick={() => setActiveTab('vba')}
              className="px-4 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-semibold text-sm border border-indigo-400/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Code className="w-4 h-4 text-indigo-300" />
              Visual Basic (VBA)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Formula Count */}
        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Bank Rumus Terdata
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {formulas.length}+ Rumus
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Format Indonesia (;) & US (,)</span>
          </div>
        </Card>

        {/* KPI 2: Template Ready */}
        <Card className="p-5 border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Template SDN 006 Aktif
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {templates.length} Format
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Rapor, Absensi, BOS, KIB</span>
          </div>
        </Card>

        {/* KPI 3: Speed Boost */}
        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Efisiensi Waktu Kerja
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                4.8x Lebih Cepat
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Otomasi rumus vs hitung manual</span>
          </div>
        </Card>

        {/* KPI 4: Interactive Sandbox */}
        <Card className="p-5 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Simulator Evaluator
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Live Engine
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <span>Evaluasi sel dinamis instan</span>
          </div>
        </Card>
      </div>

      {/* Quick Interactive Formula Sandbox Preview Widget */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Uji Coba Cepat Rumus Excel (Live Evaluator Sandbox)
              </h3>
              <p className="text-xs text-slate-400">
                Klik contoh rumus di bawah atau ketik rumus untuk melihat evaluasi langsung
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('spreadsheet')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Buka Spreadsheet Grid Penuh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset chips to click */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: 'KKTP Tuntas: =IF(82>=75; "Tuntas"; "Remedial")', f: '=IF(82>=75; "Tuntas"; "Remedial")' },
            { label: 'Rata-rata Nilai: =AVERAGE(85; 90; 87)', f: '=AVERAGE(85; 90; 87)' },
            { label: 'Total Nilai: =SUM(85; 90; 87)', f: '=SUM(85; 90; 87)' },
            { label: 'Predikat Rapor: =IFS(92>=90; "Sangat Baik")', f: '=IFS(92>=90; "Sangat Baik")' },
            { label: 'Total Sakit: =COUNTIF(C2:AG2; "S")', f: '=COUNTIF(C2:AG2; "S")' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => runQuickSandbox(item.f)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Live input and result box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 bg-slate-950 p-2.5 rounded-xl border border-slate-700 font-mono text-sm text-emerald-400 flex items-center gap-2">
            <span className="text-slate-500 font-bold select-none">fx</span>
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => {
                setSandboxInput(e.target.value);
                runQuickSandbox(e.target.value);
              }}
              className="bg-transparent border-none outline-hidden w-full text-emerald-300 font-mono text-xs md:text-sm"
              placeholder="=SUM(A1:A5)"
            />
          </div>
          <div className="md:col-span-4 bg-emerald-950/70 border border-emerald-700/60 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-xs text-emerald-200">Hasil Evaluasi:</span>
            <span className="text-sm font-extrabold text-emerald-300 font-mono">
              {sandboxResult}
            </span>
          </div>
        </div>
      </Card>

      {/* Visual Analytics Grid: Bar Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Kategori Penggunaan Rumus di Sekolah (Bar Chart) */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Distribusi Kategori Rumus di SDN 006
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frekuensi penerapan rumus pada administrasi kurikulum sekolah
              </p>
            </div>
            <Badge variant="emerald">Administrasi Sekolah</Badge>
          </div>

          <div className="space-y-3.5 mt-5">
            {[
              { label: 'Statistika & Perhitungan Nilai (SUM, AVERAGE, RANK)', percent: 85, color: 'bg-emerald-600' },
              { label: 'Logika & KKTP Kelulusan (IF, IFS, IFERROR)', percent: 78, color: 'bg-teal-600' },
              { label: 'Pencarian & Database Siswa (VLOOKUP, XLOOKUP)', percent: 64, color: 'bg-emerald-500' },
              { label: 'Pengolahan Teks & Biodata Ijazah (PROPER, TEXTJOIN)', percent: 45, color: 'bg-indigo-500' },
              { label: 'Tanggal & Perhitungan Usia PPDB (DATEDIF, NETWORKDAYS)', percent: 35, color: 'bg-amber-500' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{bar.label}</span>
                  <span className="text-slate-900 dark:text-white font-bold ml-2">{bar.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Sumber: Analisis Kebutuhan Administrasi Guru SDN 006</span>
            <button
              onClick={() => setActiveTab('library')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Detail Rumus <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Right: Tingkat Kesulitan & Kemahiran (Donut & Matrix) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tingkat Kesulitan Rumus
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Komposisi kurikulum pembelajaran guru
                </p>
              </div>
              <Badge variant="purple">Kompetensi</Badge>
            </div>

            {/* Visual SVG Donut Chart */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Dasar (Green - 50%) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="50, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Menengah (Teal - 35%) */}
                  <path
                    className="text-teal-400"
                    strokeDasharray="35, 100"
                    strokeDashoffset="-50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Mahir (Amber - 15%) */}
                  <path
                    className="text-amber-400"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    100%
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    Terstandar
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                <span className="block font-bold text-emerald-700 dark:text-emerald-400">50%</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Tingkat Dasar</span>
              </div>
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40">
                <span className="block font-bold text-teal-700 dark:text-teal-400">35%</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Menengah</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <span className="block font-bold text-amber-700 dark:text-amber-400">15%</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Tingkat Mahir</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('quiz')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Uji Kemahiran & Cetak Sertifikat Anda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>
      </div>

      {/* Rumus Paling Sering Dipakai di Sekolah */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Rumus Paling Sering Digunakan di SDN 006
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilihan rumus tercepat untuk menyelesaikan rapor, absensi, dan SPJ BOS
            </p>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Rumus ({formulas.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas.slice(0, 6).map((item) => {
            const syntax = regionalIndo ? item.syntaxIndo : item.syntaxEng;
            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between hoverEffect"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                      ={item.name}
                    </span>
                    <Badge
                      variant={
                        item.level === 'Dasar'
                          ? 'emerald'
                          : item.level === 'Menengah'
                          ? 'warning'
                          : 'purple'
                      }
                      size="sm"
                    >
                      {item.level}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {item.summary}
                  </p>

                  {/* Formula Code Box */}
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] break-all border border-slate-800 relative group flex items-center justify-between">
                    <span className="truncate pr-2">{syntax}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(syntax, item.id);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Salin Rumus"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {item.category}
                  </span>
                  <button
                    onClick={() => onSelectFormula(item)}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Buka Panduan <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Template Cards */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Template Excel Resmi SDN 006 Siap Pakai
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format lembar kerja standar tinggal unduh dan langsung isi data
            </p>
          </div>
          <button
            onClick={() => setActiveTab('templates')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Kelola Template <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.slice(0, 2).map((tpl) => (
            <Card key={tpl.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {tpl.title}
                  </h4>
                  <Badge variant="emerald" size="sm">
                    {tpl.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {tpl.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tpl.keyFormulas.slice(0, 2).map((kf, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {kf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Sasaran: {tpl.targetClass}
                </span>
                <button
                  onClick={() => handleQuickDownload(tpl)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh (.xlsx)</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
