import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { SchoolTemplate } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TemplateFormModal } from './TemplateFormModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { downloadXLSX } from '../../utils/excelEngine';

interface TemplateManagerViewProps {
  templates: SchoolTemplate[];
  onAddTemplate: (tpl: SchoolTemplate) => void;
  onUpdateTemplate: (tpl: SchoolTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export const TemplateManagerView: React.FC<TemplateManagerViewProps> = ({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'updated'>('downloads');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SchoolTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<SchoolTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    'Semua',
    'Akademik & Nilai',
    'Kesiswaan & Absensi',
    'Keuangan & BOS',
    'Sarpras & Inventaris',
    'Kepegawaian',
  ];

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tpl) => {
        if (selectedCategory !== 'Semua' && tpl.category !== selectedCategory) {
          return false;
        }
        if (selectedStatus !== 'Semua' && tpl.status !== selectedStatus) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = tpl.title.toLowerCase().includes(q);
          const matchDesc = tpl.description.toLowerCase().includes(q);
          const matchTags = tpl.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [templates, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(start, start + itemsPerPage);
  }, [filteredTemplates, currentPage, itemsPerPage]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownload = (tpl: SchoolTemplate) => {
    downloadXLSX(
      tpl.title,
      tpl.sampleHeaders,
      tpl.sampleRows,
      tpl.title.slice(0, 31)
    );

    // Increment downloads count locally
    onUpdateTemplate({
      ...tpl,
      downloadsCount: tpl.downloadsCount + 1,
    });
    showToast(`Template "${tpl.title}" berhasil diunduh dalam format .xlsx!`);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteTemplate(deletingId);
      setDeletingId(null);
      showToast('Template berhasil dihapus.');
    }
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

      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Pusat Template Administrasi SDN 006
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kumpulan berkas format Excel terstandarisasi untuk Kurikulum Merdeka, BOS, Kesiswaan, dan Inventaris
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTemplate(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Template Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama template, format nilai, BOS, absensi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Kategori: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Draft">Draft</option>
              <option value="Arsip">Arsip</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="sm:col-span-2 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Content: Table or Cards */}
      {paginatedTemplates.length > 0 ? (
        viewMode === 'table' ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Nama & Uraian Template</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Sasaran</th>
                    <th className="p-3.5">Ukuran</th>
                    <th className="p-3.5 text-center">Unduhan</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedTemplates.map((tpl) => (
                    <tr
                      key={tpl.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white leading-snug">
                          {tpl.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tpl.description}
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <Badge variant="emerald" size="sm">
                          {tpl.category}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tpl.targetClass}
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {tpl.rowCount} baris • {tpl.columnCount} kol
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {tpl.downloadsCount}x
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <Badge
                          variant={
                            tpl.status === 'Aktif'
                              ? 'success'
                              : tpl.status === 'Draft'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {tpl.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Preview */}
                          <button
                            onClick={() => setPreviewTemplate(tpl)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Pratinjau Data"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingTemplate(tpl);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Download */}
                          <button
                            onClick={() => handleDownload(tpl)}
                            className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                            title="Unduh File Excel (.xlsx)"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingId(tpl.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Hapus Template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} dari{' '}
                {filteredTemplates.length} template
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTemplates.map((tpl) => (
              <Card key={tpl.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="emerald" size="sm">
                      {tpl.category}
                    </Badge>
                    <Badge
                      variant={tpl.status === 'Aktif' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {tpl.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {tpl.description}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>Sasaran: {tpl.targetClass}</div>
                    <div>Dimensi: {tpl.rowCount} baris • {tpl.columnCount} kolom</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {tpl.downloadsCount}x diunduh
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Pratinjau"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setIsFormOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(tpl)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                      title="Unduh (.xlsx)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(tpl.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="p-12 text-center space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada template yang ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba sesuaikan pencarian atau tambahkan template baru untuk sekolah SDN 006.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setSelectedStatus('Semua');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white cursor-pointer"
          >
            Reset Filter
          </button>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <Card className="max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hapus Template Ini?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus template ini? Tindakan ini akan menghapus data dari daftar.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <TemplateFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTemplate(null);
        }}
        onSave={(tpl) => {
          if (editingTemplate) {
            onUpdateTemplate(tpl);
            showToast('Template berhasil diperbarui!');
          } else {
            onAddTemplate(tpl);
            showToast('Template baru berhasil ditambahkan!');
          }
        }}
        templateToEdit={editingTemplate}
      />

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};
