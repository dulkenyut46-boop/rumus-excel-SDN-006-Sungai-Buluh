import React from 'react';
import { Download, Table as TableIcon, FileSpreadsheet } from 'lucide-react';
import { SchoolTemplate } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface TemplatePreviewModalProps {
  template: SchoolTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (template: SchoolTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.title}
      subtitle={`Kategori: ${template.category} • Sasaran: ${template.targetClass}`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="emerald">{template.category}</Badge>
          <Badge variant={template.status === 'Aktif' ? 'success' : 'warning'}>
            Status: {template.status}
          </Badge>
          <span className="text-slate-400">
            {template.rowCount} Baris x {template.columnCount} Kolom
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">Diperbarui: {template.lastUpdated}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {template.description}
        </p>

        {/* Key Formulas */}
        {template.keyFormulas && template.keyFormulas.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Rumus yang Terpasang di Template Ini:
            </h4>
            <div className="space-y-1 font-mono text-[11px] text-emerald-300">
              {template.keyFormulas.map((f, i) => (
                <div key={i} className="p-1.5 rounded bg-slate-950/70 border border-slate-800/80">
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Table Preview */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold">
            <TableIcon className="w-4 h-4 text-emerald-600" />
            <span>Pratinjau Kolom & Contoh Isi Tabel:</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-56">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  {template.sampleHeaders.map((h, i) => (
                    <th key={i} className="p-2.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {template.sampleRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="p-2.5 font-mono text-[11px] whitespace-nowrap text-slate-800 dark:text-slate-200">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-semibold cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onDownload(template);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold flex items-center gap-2 shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File Excel (.xlsx)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
