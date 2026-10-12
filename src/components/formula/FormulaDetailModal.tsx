import React, { useState } from 'react';
import {
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Table as TableIcon,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ExcelFormula } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface FormulaDetailModalProps {
  formula: ExcelFormula | null;
  isOpen: boolean;
  onClose: () => void;
  regionalIndo: boolean;
  onOpenSpreadsheet?: () => void;
}

export const FormulaDetailModal: React.FC<FormulaDetailModalProps> = ({
  formula,
  isOpen,
  onClose,
  regionalIndo,
  onOpenSpreadsheet,
}) => {
  const [copied, setCopied] = useState(false);

  if (!formula) return null;

  const currentSyntax = regionalIndo ? formula.syntaxIndo : formula.syntaxEng;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSyntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rumus =${formula.name}`}
      subtitle={`Kategori: ${formula.category} • Tingkat: ${formula.level}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Syntax Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sintaks Rumus ({regionalIndo ? 'Format Indonesia - Titik Koma ;' : 'Format Internasional - Koma ,'})
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Rumus</span>
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-xs md:text-sm text-emerald-300 break-all select-all p-2 rounded bg-slate-950/70 border border-slate-800/80">
            {currentSyntax}
          </div>
        </div>

        {/* Overview & Explanation */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Penjelasan Fungsi
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {formula.explanation}
          </p>
        </div>

        {/* Parameters Breakdown */}
        {formula.params && formula.params.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Parameter & Argumen Rumus
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="p-3 w-1/3">Nama Parameter</th>
                    <th className="p-3">Keterangan & Cara Isi</th>
                    <th className="p-3 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {formula.params.map((param, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {param.name}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                        {param.description}
                      </td>
                      <td className="p-3 text-center">
                        {param.required ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Opsional
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Real School Example Table */}
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300">
            <TableIcon className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Contoh Kasus Nyata di SDN 006: {formula.schoolExample.title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
            {formula.schoolExample.description}
          </p>

          {/* Sample Table */}
          <div className="overflow-x-auto rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 mb-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-emerald-100/60 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold border-b border-emerald-200 dark:border-emerald-800">
                <tr>
                  {formula.schoolExample.headers.map((h, i) => (
                    <th key={i} className="p-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {formula.schoolExample.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {row.map((col, cIdx) => (
                      <td key={cIdx} className="p-2.5 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        {String(col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-200 font-mono text-xs break-all border border-emerald-800/80 mb-2">
            <span className="text-slate-400 select-none mr-1">Rumus:</span>
            <span className="font-bold text-emerald-300">
              {regionalIndo ? formula.schoolExample.formulaUsed : formula.schoolExample.formulaEng}
            </span>
          </div>

          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            💡 {formula.schoolExample.resultExplanation}
          </p>
        </div>

        {/* Common Errors */}
        {formula.commonErrors && formula.commonErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Kesalahan Umum & Solusinya
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {formula.commonErrors.map((err, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips & Tricks */}
        <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-sky-900 dark:text-sky-300">Tips Pengolahan Cepat: </span>
            {formula.tips}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 mr-1">Kata Kunci:</span>
          {formula.tags.map((t, idx) => (
            <Badge key={idx} variant="default" size="sm">
              #{t}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          {onOpenSpreadsheet && (
            <button
              onClick={() => {
                onClose();
                onOpenSpreadsheet();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-colors cursor-pointer"
            >
              <span>Coba di Lembar Kerja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
