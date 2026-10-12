import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface TopbarProps {
  activeTab: ActiveTab;
  setMobileOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  regionalIndo: boolean;
  setRegionalIndo: (val: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  onSearchFocus?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setMobileOpen,
  darkMode,
  setDarkMode,
  regionalIndo,
  setRegionalIndo,
  globalSearch,
  setGlobalSearch,
  onSearchFocus,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dasbor Kemahiran Excel SDN 006';
      case 'library':
        return 'Katalog & Bank Rumus Terlengkap';
      case 'spreadsheet':
        return 'Lembar Kerja Interaktif (Sandbox Grid)';
      case 'templates':
        return 'Pusat Template Administrasi Sekolah';
      case 'generator':
        return 'Generator Rumus Cepat & Solver Kasus';
      case 'vba':
        return 'Visual Basic (VBA) & Otomasi Makro Sekolah';
      case 'quiz':
        return 'Uji Kemahiran Excel & Sertifikat Kompetensi';
      case 'tips':
        return 'Panduan Trik, Shortcut, & Kode Error';
      default:
        return 'Portal Rumus Excel';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {getTabTitle()}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Percepat pengolahan data rapor, absensi, BOS, dan administrasi sekolah
          </p>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari rumus (contoh: VLOOKUP, IF, ranking, umur)..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:outline-hidden text-slate-800 dark:text-slate-200 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Regional Setting Switcher (Indonesian ; vs US ,) */}
        <button
          onClick={() => setRegionalIndo(!regionalIndo)}
          title={`Format Pemisah Rumus: ${regionalIndo ? 'Gaya Indonesia (;)' : 'Gaya Internasional (,)'}`}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Pemisah:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {regionalIndo ? 'Titik Koma (;)' : 'Koma (,)'}
          </span>
        </button>

        {/* Dark Mode Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-colors"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Ubah Tema"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Identity SDN 006 */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Guru / Staf SDN 006
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
              Admin Pengolah Data
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
