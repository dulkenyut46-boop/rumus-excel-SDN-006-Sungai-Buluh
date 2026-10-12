import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Command,
  SlidersHorizontal,
  Lock,
  ChevronDown,
  Check,
  Lightbulb,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ERROR_GUIDES, KEYBOARD_SHORTCUTS } from '../../data/initialData';

export const TipsGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regional' | 'errors' | 'absolute' | 'shortcuts'>('regional');
  const [openErrorIdx, setOpenErrorIdx] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Tips, Diagnosa Error & Trik Cepat Excel SDN 006
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Panduan lengkap mengatasi masalah umum yang sering dihadapi guru dan staf saat mengolah lembar kerja
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'regional', label: 'Titik Koma (;) vs Koma (,)', icon: SlidersHorizontal },
          { id: 'errors', label: 'Diagnosa Kode Error (#N/A, #DIV/0!)', icon: AlertTriangle },
          { id: 'absolute', label: 'Tanda Dollar ($) & F4', icon: Lock },
          { id: 'shortcuts', label: '10 Shortcut Keyboard Sakti', icon: Command },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Regional Settings (Indonesian ; vs US ,) */}
      {activeTab === 'regional' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mengapa di Komputer Indonesia Harus Memakai Titik Koma (;)?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Masalah paling sering dialami guru SDN 006 saat meniru rumus dari internet adalah rumus menjadi error karena pemisah koma. Hal ini terjadi karena pengaturan regional komputer:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <Badge variant="emerald">Pengaturan Indonesia (Bawaan SDN 006)</Badge>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Pemisah Parameter = Titik Koma (;)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Karena Indonesia menggunakan tanda koma (,) untuk angka desimal (contoh: nilai <strong>75,5</strong>), maka Excel memakai <strong>titik koma (;)</strong> untuk memisahkan argumen rumus agar tidak terjadi bentrok penafsiran angka desimal.
                </p>
                <div className="p-2 bg-emerald-950 rounded font-mono text-[11px] text-emerald-300">
                  =IF(B2&gt;=75; &quot;Tuntas&quot;; &quot;Remedial&quot;)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <Badge variant="default">Pengaturan English / US</Badge>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Pemisah Parameter = Koma (,)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Di negara barat, desimal menggunakan tanda titik (75.5), sehingga pemisah argumen rumusnya menggunakan <strong>koma (,)</strong>.
                </p>
                <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300">
                  =IF(B2&gt;=75, &quot;Tuntas&quot;, &quot;Remedial&quot;)
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cara Cek Cepat di Excel Laptop Anda:</strong> Ketik <code>=SUM(</code> lalu perhatikan petunjuk kecil (tooltip) abu-abu di bawah sel. Jika tertulis <code>SUM(number1; [number2]; ...)</code> maka komputer Anda wajib menggunakan <strong>titik koma (;)</strong>.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Error Diagnosis */}
      {activeTab === 'errors' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Kamus Kode Error Excel & Solusi Mengatasinya
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik salah satu kode error di bawah untuk melihat penyebab dan solusi perbaikannya:
            </p>

            <div className="space-y-2 pt-2">
              {ERROR_GUIDES.map((err, idx) => {
                const isOpen = openErrorIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenErrorIdx(isOpen ? null : idx)}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-sm text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                          {err.code}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {err.name}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white dark:bg-slate-900 text-xs space-y-3 border-t border-slate-200 dark:border-slate-800">
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block mb-1">
                            Penyebab Utama:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {err.cause}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                          <strong className="text-emerald-900 dark:text-emerald-300 block mb-1">
                            Cara Memperbaikinya:
                          </strong>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                            {err.fix}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Absolute Reference & F4 */}
      {activeTab === 'absolute' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Lock className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kekuatan Tanda Dollar ($) dan Tombol F4
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Seringkali saat guru menarik rumus ke baris bawah, hasilnya menjadi berantakan atau error #N/A. Penyebabnya adalah lupa mengunci referensi sel dengan tanda dollar <code>$</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                A1 (Relatif)
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Tidak terkunci. Jika ditarik ke bawah berubah jadi A2, A3, dst. Cocok untuk baris nilai siswa perorangan.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                $A$1 (Absolut Penuh)
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Terkunci mati kolom & barisnya. Ditarik kemanapun tetap merujuk ke A1. Wajib untuk tabel referensi VLOOKUP dan ambang batas KKTP!
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                $A1 atau A$1 (Semi-Absolut)
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Mengunci kolom saja ($A1) atau baris saja (A$1). Digunakan untuk tabel perkalian atau matriks ganda.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-amber-400 font-bold">Shortcut Rahasia: </span>
              <span>Saat kursor berada di alamat sel (misal A1), tekan tombol </span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-bold border border-slate-700">
                F4
              </kbd>
              <span> di keyboard untuk otomatis menambahkan tanda dollar!</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: Shortcuts */}
      {activeTab === 'shortcuts' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Command className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              10 Shortcut Keyboard Sakti Pengolah Data Sekolah
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Hafalkan kombinasi tombol ini untuk menghemat hingga 50% waktu kerja administrasi Anda:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {KEYBOARD_SHORTCUTS.map((sc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {sc.desc}
                </span>
                <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] border border-slate-200 dark:border-slate-700 shrink-0">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
