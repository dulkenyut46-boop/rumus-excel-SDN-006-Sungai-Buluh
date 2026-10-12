import React, { useState } from 'react';
import {
  Wand2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ActiveTab } from '../layout/Sidebar';

interface FormulaGeneratorViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  regionalIndo: boolean;
}

export const FormulaGeneratorView: React.FC<FormulaGeneratorViewProps> = ({
  setActiveTab,
  regionalIndo,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('kktp');

  // Parameters state
  // 1. KKTP
  const [kktpCell, setKktpCell] = useState('B2');
  const [kktpThreshold, setKktpThreshold] = useState('75');
  const [kktpPassText, setKktpPassText] = useState('Tuntas');
  const [kktpFailText, setKktpFailText] = useState('Remedial');

  // 2. VLOOKUP
  const [vlookupKeyCell, setVlookupKeyCell] = useState('A2');
  const [vlookupTable, setVlookupTable] = useState('$F$2:$H$100');
  const [vlookupColIndex, setVlookupColIndex] = useState('2');

  // 3. RANK.EQ
  const [rankScoreCell, setRankScoreCell] = useState('G2');
  const [rankRange, setRankRange] = useState('$G$2:$G$35');

  // 4. COUNTIF
  const [countifRange, setCountifRange] = useState('D2:AH2');
  const [countifCriteria, setCountifCriteria] = useState('A');

  // 5. SUMIF
  const [sumifCategoryRange, setSumifCategoryRange] = useState('C2:C50');
  const [sumifCriteria, setSumifCriteria] = useState('ATK');
  const [sumifAmountRange, setSumifAmountRange] = useState('E2:E50');

  // 6. DATEDIF
  const [dateBirthCell, setDateBirthCell] = useState('B2');
  const [dateCutoffCell, setDateCutoffCell] = useState('$C$1');

  const [copied, setCopied] = useState(false);

  // Computed Formulas based on Scenario
  const getGeneratedFormula = (): { indo: string; eng: string; desc: string } => {
    switch (selectedScenario) {
      case 'kktp':
        return {
          indo: `=IF(${kktpCell}>=${kktpThreshold}; "${kktpPassText}"; "${kktpFailText}")`,
          eng: `=IF(${kktpCell}>=${kktpThreshold}, "${kktpPassText}", "${kktpFailText}")`,
          desc: `Memeriksa apakah nilai pada sel ${kktpCell} mencapai angka ${kktpThreshold} ke atas. Jika ya maka tampil "${kktpPassText}", jika belum tampil "${kktpFailText}".`,
        };
      case 'vlookup':
        return {
          indo: `=VLOOKUP(${vlookupKeyCell}; ${vlookupTable}; ${vlookupColIndex}; FALSE)`,
          eng: `=VLOOKUP(${vlookupKeyCell}, ${vlookupTable}, ${vlookupColIndex}, FALSE)`,
          desc: `Mencari data dengan kata kunci di sel ${vlookupKeyCell} pada tabel master ${vlookupTable}, dan mengambil nilai dari kolom ke-${vlookupColIndex} secara tepat (exact match).`,
        };
      case 'rank':
        return {
          indo: `=RANK.EQ(${rankScoreCell}; ${rankRange}; 0)`,
          eng: `=RANK.EQ(${rankScoreCell}, ${rankRange}, 0)`,
          desc: `Menghitung peringkat siswa di sel ${rankScoreCell} dibandingkan rentang nilai seluruh teman di ${rankRange}. Angka terbesar mendapat Peringkat 1.`,
        };
      case 'countif':
        return {
          indo: `=COUNTIF(${countifRange}; "${countifCriteria}")`,
          eng: `=COUNTIF(${countifRange}, "${countifCriteria}")`,
          desc: `Menghitung berapa kali kriteria "${countifCriteria}" muncul dalam rentang ${countifRange} (misal jumlah hari Alpha/Sakit/Izin).`,
        };
      case 'sumif':
        return {
          indo: `=SUMIF(${sumifCategoryRange}; "${sumifCriteria}"; ${sumifAmountRange})`,
          eng: `=SUMIF(${sumifCategoryRange}, "${sumifCriteria}", ${sumifAmountRange})`,
          desc: `Menjumlahkan nominal pada rentang ${sumifAmountRange} yang barisnya bertuliskan "${sumifCriteria}" di rentang ${sumifCategoryRange}.`,
        };
      case 'datedif':
        return {
          indo: `=DATEDIF(${dateBirthCell}; ${dateCutoffCell}; "Y") & " Thn " & DATEDIF(${dateBirthCell}; ${dateCutoffCell}; "YM") & " Bln"`,
          eng: `=DATEDIF(${dateBirthCell}, ${dateCutoffCell}, "Y") & " Thn " & DATEDIF(${dateBirthCell}, ${dateCutoffCell}, "YM") & " Bln"`,
          desc: `Menghitung usia siswa dari tanggal lahir di ${dateBirthCell} hingga tanggal acuan ${dateCutoffCell} dalam satuan Tahun dan Bulan.`,
        };
      default:
        return {
          indo: '=SUM(A1:A10)',
          eng: '=SUM(A1:A10)',
          desc: 'Menjumlahkan rentang angka.',
        };
    }
  };

  const currentFormula = getGeneratedFormula();
  const displayFormula = regionalIndo ? currentFormula.indo : currentFormula.eng;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayFormula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-amber-500" />
          Generator & Solver Rumus Otomatis SDN 006
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pilih masalah pengolahan data Anda, sesuaikan nama kolom sel, dan salin rumus yang sudah tersusun sempurna
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scenario & Parameter Settings */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: Scenario Chooser */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Pilih Kebutuhan / Masalah Administrasi Anda:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'kktp', title: 'Kelulusan KKTP Rapor', desc: 'Nilai >= 75: Tuntas / Remedial' },
                { id: 'vlookup', title: 'Cari Siswa dari NISN', desc: 'Otomatis tarik nama dari master' },
                { id: 'rank', title: 'Peringkat / Ranking Kelas', desc: 'Juara kelas dari nilai tertinggi' },
                { id: 'countif', title: 'Rekap Presensi (A/S/I)', desc: 'Hitung total ketidakhadiran' },
                { id: 'sumif', title: 'Rekap Belanja Kas BOS', desc: 'Total anggaran per pos belanja' },
                { id: 'datedif', title: 'Hitung Usia Siswa PPDB', desc: 'Format X Tahun Y Bulan' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedScenario === sc.id
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">{sc.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {sc.desc}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 2: Dynamic Customizer Form */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              Sesuaikan Koordinat Sel Tabel Anda:
            </h3>

            {/* KKTP scenario inputs */}
            {selectedScenario === 'kktp' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Sel Nilai Siswa
                    </label>
                    <input
                      type="text"
                      value={kktpCell}
                      onChange={(e) => setKktpCell(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Ambang Batas KKTP
                    </label>
                    <input
                      type="text"
                      value={kktpThreshold}
                      onChange={(e) => setKktpThreshold(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Teks Jika Tuntas
                    </label>
                    <input
                      type="text"
                      value={kktpPassText}
                      onChange={(e) => setKktpPassText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Teks Jika Belum Tuntas
                    </label>
                    <input
                      type="text"
                      value={kktpFailText}
                      onChange={(e) => setKktpFailText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VLOOKUP scenario inputs */}
            {selectedScenario === 'vlookup' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Sel Kunci Pencarian (misal Sel NISN)
                  </label>
                  <input
                    type="text"
                    value={vlookupKeyCell}
                    onChange={(e) => setVlookupKeyCell(e.target.value)}
                    className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Rentang Master ($Wajib$)
                    </label>
                    <input
                      type="text"
                      value={vlookupTable}
                      onChange={(e) => setVlookupTable(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Nomor Kolom Hasil (1, 2, 3...)
                    </label>
                    <input
                      type="text"
                      value={vlookupColIndex}
                      onChange={(e) => setVlookupColIndex(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RANK scenario inputs */}
            {selectedScenario === 'rank' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Sel Total Nilai Siswa
                    </label>
                    <input
                      type="text"
                      value={rankScoreCell}
                      onChange={(e) => setRankScoreCell(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Rentang Nilai Seluruh Kelas ($Kunci$)
                    </label>
                    <input
                      type="text"
                      value={rankRange}
                      onChange={(e) => setRankRange(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COUNTIF scenario inputs */}
            {selectedScenario === 'countif' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Rentang Hari Absensi (Tgl 1 s/d 31)
                    </label>
                    <input
                      type="text"
                      value={countifRange}
                      onChange={(e) => setCountifRange(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Huruf Kriteria yang Dihitung
                    </label>
                    <input
                      type="text"
                      value={countifCriteria}
                      onChange={(e) => setCountifCriteria(e.target.value)}
                      placeholder="A / S / I"
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUMIF scenario inputs */}
            {selectedScenario === 'sumif' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Kolom Kategori Belanja
                  </label>
                  <input
                    type="text"
                    value={sumifCategoryRange}
                    onChange={(e) => setSumifCategoryRange(e.target.value)}
                    className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Nama Pos Belanja
                    </label>
                    <input
                      type="text"
                      value={sumifCriteria}
                      onChange={(e) => setSumifCriteria(e.target.value)}
                      placeholder="ATK"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Kolom Nominal Uang
                    </label>
                    <input
                      type="text"
                      value={sumifAmountRange}
                      onChange={(e) => setSumifAmountRange(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DATEDIF scenario inputs */}
            {selectedScenario === 'datedif' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Sel Tanggal Lahir Siswa
                    </label>
                    <input
                      type="text"
                      value={dateBirthCell}
                      onChange={(e) => setDateBirthCell(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Sel Tanggal Acuan Cut-off ($Kunci$)
                    </label>
                    <input
                      type="text"
                      value={dateCutoffCell}
                      onChange={(e) => setDateCutoffCell(e.target.value)}
                      className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Generated Output & Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Rumus Siap Tempel (Excel Ready)
              </span>
              <Badge variant="emerald" size="sm">
                {regionalIndo ? 'Format Indonesia (;)' : 'Format US (,)'}
              </Badge>
            </div>

            {/* Code Output Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-300 break-all select-all shadow-inner relative group">
              {displayFormula}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Berhasil Disalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Rumus Sekarang</span>
                </>
              )}
            </button>

            {/* Explanation */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Penjelasan Logika Rumus:
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentFormula.desc}
              </p>
            </div>

            {/* Try in Sandbox Button */}
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Uji Rumus di Lembar Kerja Simulasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>

          {/* Quick Tip Card */}
          <Card className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-xs space-y-1.5">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
              Tips Menempelkan di Microsoft Excel:
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              1. Klik sel target di Excel (misal sel D2).
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              2. Tempel rumus (Ctrl + V) lalu tekan Enter.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              3. Arahkan kursor ke pojok kanan bawah sel hingga kursor berubah jadi tanda plus hitam (+), lalu tarik ke bawah (AutoFill) untuk menerapkan ke semua baris siswa.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
