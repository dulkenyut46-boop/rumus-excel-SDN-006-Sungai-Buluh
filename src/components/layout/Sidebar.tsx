import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  TableProperties,
  FolderKanban,
  Wand2,
  Award,
  HelpCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  School,
  Sparkles,
  Code,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'library' | 'spreadsheet' | 'templates' | 'generator' | 'vba' | 'quiz' | 'tips';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  formulaCount: number;
  templateCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  formulaCount,
  templateCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dasbor Utama',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'library' as ActiveTab,
      label: 'Bank Rumus Excel',
      icon: BookOpen,
      badge: `${formulaCount}`,
    },
    {
      id: 'spreadsheet' as ActiveTab,
      label: 'Lembar Kerja Interaktif',
      icon: TableProperties,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'templates' as ActiveTab,
      label: 'Template SDN 006',
      icon: FolderKanban,
      badge: `${templateCount}`,
    },
    {
      id: 'generator' as ActiveTab,
      label: 'Generator Rumus',
      icon: Wand2,
      badge: 'Cepat',
      badgeColor: 'bg-amber-500 text-black font-semibold',
    },
    {
      id: 'vba' as ActiveTab,
      label: 'Visual Basic (VBA)',
      icon: Code,
      badge: 'Makro',
      badgeColor: 'bg-indigo-600 text-white font-semibold',
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'Uji Kemahiran & Sertifikat',
      icon: Award,
      badge: null,
    },
    {
      id: 'tips' as ActiveTab,
      label: 'Tips & Diagnosa Error',
      icon: HelpCircle,
      badge: null,
    },
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out lg:static ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header Branding */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
              <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  RUMUS EXCEL
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SDN 006
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  Portal Pengolah Data Cepat
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Perluas Menu' : 'Perkecil Menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* School Profile Mini Banner (if expanded) */}
        {!collapsed && (
          <div className="p-3 mx-3 my-3 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-800/40 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center shrink-0 text-emerald-300">
              <School className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-200 truncate">SDN 006 Indonesia</p>
              <p className="text-[10px] text-slate-400 truncate">Kurikulum Merdeka & Administrasi</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`}
                />

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.badgeColor || (isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-center">
          {!collapsed ? (
            <div className="text-left px-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Versi Aplikasi</span>
                <span className="font-mono text-emerald-400">v2.4 (2026)</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Dioptimasi untuk format Indonesia (Titik Koma ;)
              </p>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-emerald-400">v2.4</span>
          )}
        </div>
      </aside>
    </>
  );
};
