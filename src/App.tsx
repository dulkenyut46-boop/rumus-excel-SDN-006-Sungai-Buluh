/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { FormulaLibraryView } from './components/formula/FormulaLibraryView';
import { SpreadsheetView } from './components/spreadsheet/SpreadsheetView';
import { TemplateManagerView } from './components/templates/TemplateManagerView';
import { FormulaGeneratorView } from './components/generator/FormulaGeneratorView';
import { VisualBasicView } from './components/vba/VisualBasicView';
import { QuizView } from './components/quiz/QuizView';
import { TipsGuideView } from './components/tips/TipsGuideView';
import { FormulaDetailModal } from './components/formula/FormulaDetailModal';
import { INITIAL_FORMULAS, INITIAL_TEMPLATES, INITIAL_QUIZ } from './data/initialData';
import { ExcelFormula, SchoolTemplate } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_sdn006');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Regional Formula Setting (true = Indonesian ;, false = US ,)
  const [regionalIndo, setRegionalIndo] = useState<boolean>(true);

  // Search State
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Core Mutable States
  const [formulas, setFormulas] = useState<ExcelFormula[]>(() => {
    return INITIAL_FORMULAS;
  });

  const [templates, setTemplates] = useState<SchoolTemplate[]>(() => {
    return INITIAL_TEMPLATES;
  });

  // Modal State for viewing formula details
  const [modalFormula, setModalFormula] = useState<ExcelFormula | null>(null);

  // Effect to toggle dark class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_sdn006', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_sdn006', 'light');
    }
  }, [darkMode]);

  // Handle template CRUD actions
  const handleAddTemplate = (newTpl: SchoolTemplate) => {
    setTemplates((prev) => [newTpl, ...prev]);
  };

  const handleUpdateTemplate = (updatedTpl: SchoolTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updatedTpl.id ? updatedTpl : t))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const handleSearchFocus = () => {
    if (activeTab !== 'library') {
      setActiveTab('library');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        formulaCount={formulas.length}
        templateCount={templates.length}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <Topbar
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          regionalIndo={regionalIndo}
          setRegionalIndo={setRegionalIndo}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onSearchFocus={handleSearchFocus}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <DashboardView
                formulas={formulas}
                templates={templates}
                setActiveTab={setActiveTab}
                onSelectFormula={(f) => setModalFormula(f)}
                regionalIndo={regionalIndo}
              />
            )}

            {activeTab === 'library' && (
              <FormulaLibraryView
                formulas={formulas}
                onToggleFavorite={handleToggleFavorite}
                regionalIndo={regionalIndo}
                setRegionalIndo={setRegionalIndo}
                onOpenSpreadsheet={() => setActiveTab('spreadsheet')}
                searchQuery={globalSearch}
                setSearchQuery={setGlobalSearch}
              />
            )}

            {activeTab === 'spreadsheet' && (
              <SpreadsheetView regionalIndo={regionalIndo} />
            )}

            {activeTab === 'templates' && (
              <TemplateManagerView
                templates={templates}
                onAddTemplate={handleAddTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            )}

            {activeTab === 'generator' && (
              <FormulaGeneratorView
                setActiveTab={setActiveTab}
                regionalIndo={regionalIndo}
              />
            )}

            {activeTab === 'vba' && (
              <VisualBasicView />
            )}

            {activeTab === 'quiz' && (
              <QuizView questions={INITIAL_QUIZ} />
            )}

            {activeTab === 'tips' && (
              <TipsGuideView />
            )}
          </div>
        </main>
      </div>

      {/* Global Formula Modal */}
      <FormulaDetailModal
        formula={modalFormula}
        isOpen={!!modalFormula}
        onClose={() => setModalFormula(null)}
        regionalIndo={regionalIndo}
        onOpenSpreadsheet={() => {
          setModalFormula(null);
          setActiveTab('spreadsheet');
        }}
      />
    </div>
  );
}
