import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  School,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { QuizQuestion } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface QuizViewProps {
  questions: QuizQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userName, setUserName] = useState('Guru / Staf SDN 006');

  const currentQ = questions[currentIndex];
  const selectedOption = userAnswers[currentQ.id];

  const handleSelectOption = (optIndex: number) => {
    if (showExplanation) return;
    setUserAnswers({
      ...userAnswers,
      [currentQ.id]: optIndex,
    });
  };

  const handleNext = () => {
    if (!showExplanation) {
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowExplanation(false);
  };

  // Calculate score
  const correctCount = questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  const getGradeTitle = (score: number) => {
    if (score >= 90) return 'Ahli Utama Rumus Excel';
    if (score >= 75) return 'Mahir Terampil Pengolah Data';
    if (score >= 60) return 'Tingkat Menengah';
    return 'Tingkat Pemula';
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Uji Kemahiran & Sertifikasi Digital Rumus Excel SDN 006
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Uji pemahaman Anda seputar penerapan rumus di lembar kerja sekolah dan dapatkan sertifikat digital
        </p>
      </div>

      {!isCompleted ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>
              Soal {currentIndex + 1} dari {questions.length}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Progres: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <Badge variant="emerald" size="sm">
                {currentQ.category}
              </Badge>
              <Badge
                variant={
                  currentQ.difficulty === 'Dasar'
                    ? 'default'
                    : currentQ.difficulty === 'Menengah'
                    ? 'warning'
                    : 'purple'
                }
                size="sm"
              >
                {currentQ.difficulty}
              </Badge>
            </div>

            {/* Scenario */}
            {currentQ.scenario && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic">
                <span className="font-bold not-italic text-slate-800 dark:text-slate-200">
                  Skenario Kasus:{' '}
                </span>
                {currentQ.scenario}
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Code Snippet if any */}
            {currentQ.formulaCode && (
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800">
                {currentQ.formulaCode}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyle =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300';

                if (showExplanation) {
                  if (isCorrect) {
                    optionStyle =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showExplanation && (
                      <div>
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div
                className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Pembahasan Kunci Jawaban:
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                {selectedOption !== undefined
                  ? 'Jawaban tersimpan'
                  : 'Pilih salah satu jawaban'}
              </span>

              <button
                disabled={selectedOption === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-colors cursor-pointer"
              >
                <span>
                  {showExplanation
                    ? currentIndex + 1 === questions.length
                      ? 'Lihat Hasil Akhir'
                      : 'Lanjut ke Soal Berikutnya'
                    : 'Periksa Jawaban'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      ) : (
        /* Completed Result & Certificate */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Summary Card */}
          <Card className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Ujian Kemahiran Selesai!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Predikat: <strong className="text-emerald-600 dark:text-emerald-400">{getGradeTitle(scorePercentage)}</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto my-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {scorePercentage}%
                </span>
                <span className="text-[10px] text-slate-400">Nilai Akhir</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-xl font-bold text-slate-900 dark:text-white">
                  {correctCount}
                </span>
                <span className="text-[10px] text-slate-400">Benar</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-xl font-bold text-rose-500">
                  {questions.length - correctCount}
                </span>
                <span className="text-[10px] text-slate-400">Salah</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          </Card>

          {/* Certificate Customizer & Printable Card */}
          <Card className="p-8 border-4 border-emerald-700/60 bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 shadow-2xl relative overflow-hidden">
            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/20 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                  <School className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-base font-extrabold tracking-tight text-emerald-900 dark:text-emerald-300">
                    SDN 006 INDONESIA
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Sistem Sertifikasi Kompetensi Literasi Digital & Pengolah Data
                  </p>
                </div>
              </div>
              <Badge variant="emerald">No: SDN006-EXCEL-{Date.now().toString().slice(-6)}</Badge>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4">
              <h2 className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                SERTIFIKAT KEMAHIRAN FORMULA EXCEL
              </h2>
              <p className="text-xs text-slate-500">Diberikan kepada:</p>

              {/* Editable Name */}
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-center text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white border-b-2 border-emerald-500 bg-transparent py-1 focus:outline-hidden"
                  placeholder="Ketik Nama & Gelar Anda..."
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  (Klik pada nama untuk mengubah nama dan gelar Anda)
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                Telah berhasil menyelesaikan Uji Kompetensi Penerapan Rumus Excel (VLOOKUP, IF/IFS, KKTP, SUMIF, COUNTIF, RANK.EQ, dan Pemecahan Masalah Administrasi Sekolah SDN 006) dengan skor <strong>{scorePercentage}%</strong> dan berhak menyandang predikat:
              </p>

              <div className="inline-block px-5 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                ★ {getGradeTitle(scorePercentage)} ★
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex items-center justify-between border-t border-emerald-800/20 pt-6 mt-6 text-xs text-slate-500">
              <div className="text-left">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Tanggal Kelulusan
                </p>
                <p>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-600/40 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 rotate-[-12deg] bg-emerald-50/50">
                  SEAL VALID
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Koordinator IT & Kurikulum
                </p>
                <p>SDN 006 Indonesia</p>
              </div>
            </div>

            {/* Print Button */}
            <div className="mt-6 pt-4 text-center print:hidden">
              <button
                onClick={handlePrintCertificate}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF Sertifikat</span>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
