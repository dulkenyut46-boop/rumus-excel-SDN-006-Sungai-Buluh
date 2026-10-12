import React, { useState, useEffect } from 'react';
import { SchoolTemplate } from '../../types';
import { Modal } from '../ui/Modal';

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: SchoolTemplate) => void;
  templateToEdit: SchoolTemplate | null;
}

export const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  templateToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SchoolTemplate['category']>('Akademik & Nilai');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('Kelas 1 - Kelas 6');
  const [rowCount, setRowCount] = useState<number>(35);
  const [columnCount, setColumnCount] = useState<number>(10);
  const [status, setStatus] = useState<SchoolTemplate['status']>('Aktif');
  const [tagsInput, setTagsInput] = useState('kurikulum merdeka, nilai');
  const [keyFormulasInput, setKeyFormulasInput] = useState('=AVERAGE(E2:H2)\n=IF(I2>=75; "Tuntas"; "Remedial")');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title);
      setCategory(templateToEdit.category);
      setDescription(templateToEdit.description);
      setTargetClass(templateToEdit.targetClass);
      setRowCount(templateToEdit.rowCount);
      setColumnCount(templateToEdit.columnCount);
      setStatus(templateToEdit.status);
      setTagsInput(templateToEdit.tags.join(', '));
      setKeyFormulasInput(templateToEdit.keyFormulas.join('\n'));
    } else {
      setTitle('');
      setCategory('Akademik & Nilai');
      setDescription('');
      setTargetClass('Kelas 1 - Kelas 6');
      setRowCount(35);
      setColumnCount(10);
      setStatus('Aktif');
      setTagsInput('sdn 006, administrasi');
      setKeyFormulasInput('=SUM(A2:A10)');
    }
    setErrors({});
  }, [templateToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Judul template wajib diisi';
    if (!description.trim()) newErrors.description = 'Deskripsi template wajib diisi';
    if (rowCount <= 0) newErrors.rowCount = 'Jumlah baris minimal 1';
    if (columnCount <= 0) newErrors.columnCount = 'Jumlah kolom minimal 1';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const keyFormulas = keyFormulasInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedTemplate: SchoolTemplate = {
      id: templateToEdit ? templateToEdit.id : `tpl-${Date.now()}`,
      title,
      category,
      description,
      targetClass,
      rowCount: Number(rowCount),
      columnCount: Number(columnCount),
      downloadsCount: templateToEdit ? templateToEdit.downloadsCount : 0,
      lastUpdated: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      tags,
      status,
      sampleHeaders: templateToEdit?.sampleHeaders || ['No', 'NISN', 'Nama Siswa', 'Nilai', 'Keterangan'],
      sampleRows: templateToEdit?.sampleRows || [
        [1, '00129481', 'Ahmad Pratama', 88, 'Tuntas'],
        [2, '00129482', 'Bilqis Humaira', 94, 'Tuntas'],
      ],
      keyFormulas,
    };

    onSave(updatedTemplate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={templateToEdit ? 'Edit Template Excel' : 'Tambah Template Baru'}
      subtitle="Konfigurasi data template lembar kerja administrasi SDN 006"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Judul Template <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Format Leger Nilai Rapor Kurikulum Merdeka 2026"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
          {errors.title && <p className="text-rose-500 text-[11px] mt-1">{errors.title}</p>}
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Akademik & Nilai">Akademik & Nilai</option>
              <option value="Kesiswaan & Absensi">Kesiswaan & Absensi</option>
              <option value="Keuangan & BOS">Keuangan & BOS</option>
              <option value="Sarpras & Inventaris">Sarpras & Inventaris</option>
              <option value="Kepegawaian">Kepegawaian</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status Template
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Aktif">Aktif (Bisa Diunduh)</option>
              <option value="Draft">Draft (Tahap Pengembangan)</option>
              <option value="Arsip">Arsip (Semester Lalu)</option>
            </select>
          </div>
        </div>

        {/* Target Class & Size */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sasaran Pengguna
            </label>
            <input
              type="text"
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              placeholder="Wali Kelas 1-6"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Perkiraan Baris
            </label>
            <input
              type="number"
              value={rowCount}
              onChange={(e) => setRowCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Perkiraan Kolom
            </label>
            <input
              type="number"
              value={columnCount}
              onChange={(e) => setColumnCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Deskripsi Kegunaan <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan untuk keperluan apa template ini digunakan di SDN 006..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
          {errors.description && (
            <p className="text-rose-500 text-[11px] mt-1">{errors.description}</p>
          )}
        </div>

        {/* Key Formulas */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Rumus Kunci di Template Ini (1 per baris)
          </label>
          <textarea
            rows={2}
            value={keyFormulasInput}
            onChange={(e) => setKeyFormulasInput(e.target.value)}
            placeholder="=AVERAGE(E2:H2)&#10;=RANK.EQ(I2; $I$2:$I$35; 0)"
            className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 text-[11px]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tags / Kata Kunci (pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="rapor, kktp, kurikulum merdeka"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-950/20 cursor-pointer"
          >
            {templateToEdit ? 'Simpan Perubahan' : 'Tambahkan Template'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
