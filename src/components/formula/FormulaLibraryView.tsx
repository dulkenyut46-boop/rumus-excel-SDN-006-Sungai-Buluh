import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Copy,
  Check,
  Star,
  BookOpen,
  ArrowUpDown,
  X,
  ArrowRight,
} from 'lucide-react';
import { ExcelFormula, FormulaCategory, FormulaLevel } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FormulaDetailModal } from './FormulaDetailModal';

interface FormulaLibraryViewProps {
  formulas: ExcelFormula[];
  onToggleFavorite?: (id: string) => void;
  regionalIndo: boolean;
  setRegionalIndo: (val: boolean) => void;
  onOpenSpreadsheet: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const FormulaLibraryView: React.FC<FormulaLibraryViewProps> = ({
  formulas,
  onToggleFavorite,
  regionalIndo,
  setRegionalIndo,
  onOpenSpreadsheet,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'category'>('name');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFormula, setActiveFormula] = useState<ExcelFormula | null>(null);

  const categories = [
    'Semua',
    'Logika',
    'Pencarian',
    'Statistik & Hitungan',
    'Teks',
    'Tanggal & Waktu',
    'Administrasi Sekolah',
  ];

  const levels = ['Semua', 'Dasar', 'Menengah', 'Mahir'];

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFormulas = useMemo(() => {
    return formulas
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
          return false;
        }
        // Level filter
        if (selectedLevel !== 'Semua' && item.level !== selectedLevel) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchSummary = item.summary.toLowerCase().includes(q);
          const matchExpl = item.explanation.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchName || matchSummary || matchExpl || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'level') return a.level.localeCompare(b.level);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return 0;
      });
  }, [formulas, selectedCategory, selectedLevel, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Bank & Katalog Rumus Excel SDN 006
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar lengkap rumus Excel praktis yang disesuaikan dengan kebutuhan administrasi sekolah
          </p>
        </div>

        {/* Regional Format Toggle button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRegionalIndo(!regionalIndo)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Format Rumus: </span>
            <span className="font-bold underline">
              {regionalIndo ? 'Gaya Indonesia (Titik Koma ;)' : 'Gaya US (Koma ,)'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-4">
        {/* Top search & sorting */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rumus, fungsi, atau kata kunci (contoh: kkm, vlookup, umur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-emerald-500 text-slate-800 dark:text-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Urutkan:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="name">Nama Rumus (A-Z)</option>
              <option value="level">Tingkat Kesulitan</option>
              <option value="category">Kategori Fungsi</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
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

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-medium mr-1 shrink-0">Tingkat:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">
            Ditemukan: <strong className="text-emerald-600 dark:text-emerald-400">{filteredFormulas.length}</strong> rumus
          </span>
        </div>
      </Card>

      {/* Formulas Grid */}
      {filteredFormulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFormulas.map((item) => {
            const syntax = regionalIndo ? item.syntaxIndo : item.syntaxEng;

            return (
              <Card
                key={item.id}
                onClick={() => setActiveFormula(item)}
                hoverEffect
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        ={item.name}
                      </span>
                      {item.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
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

                  {/* Code syntax container with copy button */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] break-all border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{syntax}</span>
                    <button
                      onClick={(e) => handleCopy(syntax, item.id, e)}
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.category}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Buka Panduan <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada rumus yang cocok dengan filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat rumus lainnya.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setSelectedLevel('Semua');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </Card>
      )}

      {/* Formula Modal */}
      <FormulaDetailModal
        formula={activeFormula}
        isOpen={!!activeFormula}
        onClose={() => setActiveFormula(null)}
        regionalIndo={regionalIndo}
        onOpenSpreadsheet={onOpenSpreadsheet}
      />
    </div>
  );
};
