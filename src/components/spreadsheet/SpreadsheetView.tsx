import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  Plus,
  Sparkles,
  Info,
  Check,
  FileSpreadsheet,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { GridData } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SPREADSHEET_PRESETS } from '../../data/spreadsheetPresets';
import {
  COLUMNS,
  ROW_COUNT,
  evaluateFormula,
  downloadGridAsXLSX,
} from '../../utils/excelEngine';

interface SpreadsheetViewProps {
  regionalIndo: boolean;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  regionalIndo,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('nilai-5a');
  const [grid, setGrid] = useState<GridData>(() => {
    return JSON.parse(JSON.stringify(SPREADSHEET_PRESETS[0].grid));
  });
  const [activeCellKey, setActiveCellKey] = useState<string>('F2');
  const [formulaBarValue, setFormulaBarValue] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync formula bar whenever active cell changes
  useEffect(() => {
    const currentCell = grid[activeCellKey];
    setFormulaBarValue(currentCell ? currentCell.raw : '');
  }, [activeCellKey, grid]);

  // Recalculate whole grid formulas
  const recalculateGrid = (currentGrid: GridData): GridData => {
    const updated: GridData = { ...currentGrid };
    // Two passes to resolve dependencies
    for (let pass = 0; pass < 2; pass++) {
      for (let r = 1; r <= ROW_COUNT; r++) {
        for (const col of COLUMNS) {
          const key = `${col}${r}`;
          const cell = updated[key];
          if (cell && cell.raw.startsWith('=')) {
            const computed = evaluateFormula(cell.raw, updated);
            updated[key] = {
              raw: cell.raw,
              value: computed,
              hasFormula: true,
              error: typeof computed === 'string' && computed.startsWith('#') ? computed : undefined,
            };
          }
        }
      }
    }
    return updated;
  };

  const handleCellChange = (cellKey: string, newRawValue: string) => {
    const isFormula = newRawValue.startsWith('=');
    const newGrid = { ...grid };
    
    if (newRawValue.trim() === '') {
      delete newGrid[cellKey];
    } else {
      newGrid[cellKey] = {
        raw: newRawValue,
        value: isFormula ? evaluateFormula(newRawValue, newGrid) : (isNaN(Number(newRawValue)) ? newRawValue : Number(newRawValue)),
        hasFormula: isFormula,
      };
    }

    const recalculated = recalculateGrid(newGrid);
    setGrid(recalculated);
    setFormulaBarValue(newRawValue);
  };

  const handleFormulaBarChange = (val: string) => {
    setFormulaBarValue(val);
    handleCellChange(activeCellKey, val);
  };

  const loadPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = SPREADSHEET_PRESETS.find((p) => p.id === presetId);
    if (found) {
      const cloned = JSON.parse(JSON.stringify(found.grid));
      const evaluated = recalculateGrid(cloned);
      setGrid(evaluated);
      setActiveCellKey('A1');
      showToast(`Memuat template: ${found.name}`);
    }
  };

  const resetCurrentGrid = () => {
    loadPreset(selectedPreset);
  };

  const insertFormulaQuick = (template: string) => {
    handleCellChange(activeCellKey, template);
    showToast(`Rumus disisipkan ke sel ${activeCellKey}`);
  };

  const handleExportXLSX = () => {
    const presetName = SPREADSHEET_PRESETS.find((p) => p.id === selectedPreset)?.name || 'lembar-kerja-sdn-006';
    downloadGridAsXLSX(presetName, grid, COLUMNS, ROW_COUNT, presetName.slice(0, 31));
    showToast('Berhasil mengunduh lembar kerja sebagai format Excel (.xlsx)!');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <Card className="p-4 bg-white dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Pilih Skenario Lembar:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {SPREADSHEET_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedPreset === preset.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title="Panduan Simulator"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuide ? 'Tutup Panduan' : 'Bantuan Rumus'}</span>
            </button>

            <button
              onClick={resetCurrentGrid}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Kembalikan Data Semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleExportXLSX}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor ke Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Quick Insert Formula Shortcuts */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Sisipkan Rumus Cepat ke Sel Aktif ({activeCellKey}):
          </span>
          {[
            { label: 'SUM (Jumlah)', f: '=SUM(C2:E2)' },
            { label: 'AVERAGE (Rata-rata)', f: '=AVERAGE(C2:E2)' },
            { label: 'IF (KKTP Tuntas)', f: regionalIndo ? '=IF(G2>=75; "Tuntas"; "Remedial")' : '=IF(G2>=75, "Tuntas", "Remedial")' },
            { label: 'MAX (Tertinggi)', f: '=MAX(C2:C6)' },
            { label: 'MIN (Terendah)', f: '=MIN(C2:C6)' },
            { label: 'COUNT (Total Data)', f: '=COUNT(A2:A6)' },
            { label: 'Perkalian (*)', f: '=D2*E2' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => insertFormulaQuick(item.f)}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
            >
              <Plus className="w-2.5 h-2.5 inline mr-1" />
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Guide Helper Box (Collapsible) */}
      {showGuide && (
        <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-bold text-emerald-900 dark:text-emerald-200">
              Cara Menggunakan Lembar Kerja Simulasi SDN 006:
            </p>
            <p>
              1. Klik pada sel manapun (misal <strong>C2</strong> untuk mengubah angka nilai siswa, atau <strong>F2</strong> untuk melihat rumus <code>=SUM(C2:E2)</code>).
            </p>
            <p>
              2. Ubah angka nilai siswa di kolom C, D, atau E, lalu tekan <strong>Enter</strong> atau klik sel lain. Nilai Total, Rata-rata, dan Status Tuntas/Remedial akan dihitung secara live!
            </p>
            <p>
              3. Anda dapat mengetikkan rumus baru langsung di sel atau melalui <strong>Formula Bar (fx)</strong> di bawah.
            </p>
          </div>
        </div>
      )}

      {/* Formula Bar (fx) */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-inner">
        {/* Active Cell Address Tag */}
        <div className="flex items-center justify-center w-14 h-8 bg-slate-800 rounded-lg text-emerald-400 font-mono font-bold text-xs select-none border border-slate-700">
          {activeCellKey}
        </div>

        {/* Function Icon */}
        <div className="flex items-center justify-center w-8 h-8 text-slate-400 font-mono font-bold text-sm italic select-none">
          fx
        </div>

        {/* Formula Input */}
        <div className="flex-1">
          <input
            type="text"
            value={formulaBarValue}
            onChange={(e) => handleFormulaBarChange(e.target.value)}
            placeholder="Ketik nilai atau rumus (misal: =SUM(C2:E2) atau 85)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs md:text-sm font-mono text-emerald-300 focus:outline-hidden focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Spreadsheet Table Grid */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full border-collapse text-xs select-none">
            {/* Table Header: Column Letters (A-H) */}
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700">
                <th className="w-12 min-w-12 p-2 text-center text-slate-400 font-mono text-[11px] border-r border-slate-300 dark:border-slate-700">
                  <Hash className="w-3 h-3 mx-auto text-slate-400" />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="min-w-28 md:min-w-32 p-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 text-xs"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Rows 1..ROW_COUNT */}
            <tbody>
              {Array.from({ length: ROW_COUNT }, (_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <tr
                    key={rowNum}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                  >
                    {/* Row Header Number */}
                    <td className="w-12 text-center p-2 font-mono text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-800">
                      {rowNum}
                    </td>

                    {/* Data Cells */}
                    {COLUMNS.map((col) => {
                      const cellKey = `${col}${rowNum}`;
                      const cell = grid[cellKey];
                      const isActive = activeCellKey === cellKey;
                      const isFormula = cell?.hasFormula;
                      const hasError = cell?.error;

                      // Display value or edit raw
                      const displayVal = cell ? cell.value : '';

                      return (
                        <td
                          key={cellKey}
                          onClick={() => setActiveCellKey(cellKey)}
                          className={`p-0 border-r border-slate-200 dark:border-slate-800 relative transition-colors ${
                            isActive
                              ? 'ring-2 ring-emerald-500 z-10 bg-emerald-50/30 dark:bg-emerald-950/20'
                              : ''
                          } ${rowNum === 1 ? 'bg-slate-50 dark:bg-slate-900 font-bold' : ''}`}
                        >
                          <input
                            type="text"
                            value={isActive ? formulaBarValue : String(displayVal)}
                            onChange={(e) => handleCellChange(cellKey, e.target.value)}
                            onFocus={() => setActiveCellKey(cellKey)}
                            className={`w-full h-full px-2.5 py-2 bg-transparent border-none outline-hidden text-xs truncate ${
                              isFormula
                                ? 'font-mono text-emerald-800 dark:text-emerald-300 font-semibold'
                                : 'text-slate-900 dark:text-slate-100'
                            } ${
                              hasError ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
                            } ${
                              typeof displayVal === 'number' ? 'text-right' : 'text-left'
                            }`}
                          />

                          {/* Subtle blue corner mark if cell contains formula */}
                          {isFormula && !isActive && (
                            <span
                              className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"
                              title={`Rumus: ${cell.raw}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info of Grid */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sel Berumus Otomatis
            </span>
            <span>•</span>
            <span>
              Sel Aktif: <strong className="font-mono text-slate-800 dark:text-slate-200">{activeCellKey}</strong>
            </span>
          </div>
          <div>
            Format Angka: Nilai otomatis rata kanan, Teks rata kiri
          </div>
        </div>
      </Card>
    </div>
  );
};
