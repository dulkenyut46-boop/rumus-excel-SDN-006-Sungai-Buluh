import { ExcelFormula, SchoolTemplate, QuizQuestion } from '../types';

export const INITIAL_FORMULAS: ExcelFormula[] = [
  {
    id: 'vlookup',
    name: 'VLOOKUP',
    category: 'Pencarian',
    level: 'Menengah',
    syntaxIndo: '=VLOOKUP(nilai_kunci; tabel_referensi; nomor_kolom; [pencarian_persis])',
    syntaxEng: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    summary: 'Mencari data siswa, NISN, atau barang secara vertikal pada kolom pertama tabel referensi.',
    explanation: 'VLOOKUP adalah rumus paling vital bagi tata usaha dan guru di SDN 006 untuk mengambil nama siswa otomatis hanya dengan mengetikkan NISN, atau mengambil gaji pokok berdasarkan Golongan.',
    params: [
      { name: 'nilai_kunci', description: 'Nilai yang dicari (misal NISN siswa di sel B5).', required: true },
      { name: 'tabel_referensi', description: 'Rentang tabel master (misal $A$2:$E$150). Selalu gunakan tanda dollar $ agar tabel tidak bergeser saat ditarik.', required: true },
      { name: 'nomor_kolom', description: 'Nomor urut kolom hasil yang ingin diambil (kolom 1, 2, 3, dst).', required: true },
      { name: 'pencarian_persis', description: 'Gunakan FALSE atau 0 untuk pencarian data yang harus tepat 100%.', required: false }
    ],
    schoolExample: {
      title: 'Pencarian Nama Siswa Otomatis Berdasarkan NISN',
      description: 'Di SDN 006, saat input nilai rapor, guru hanya memasukkan NISN di kolom A, lalu Nama Siswa terisi otomatis dari Database Induk.',
      headers: ['NISN (A)', 'Nama Siswa (B)', 'Kelas (C)', 'Status (D)'],
      rows: [
        ['00129481', '=VLOOKUP(A2; $F$2:$H$40; 2; 0)', '5A', 'Aktif'],
        ['00129482', '=VLOOKUP(A3; $F$2:$H$40; 2; 0)', '5A', 'Aktif'],
        ['00129483', '=VLOOKUP(A4; $F$2:$H$40; 2; 0)', '5A', 'Aktif']
      ],
      formulaUsed: '=VLOOKUP(A2; $F$2:$H$40; 2; FALSE)',
      formulaEng: '=VLOOKUP(A2, $F$2:$H$40, 2, FALSE)',
      resultExplanation: 'Mengambil nama siswa dari kolom ke-2 pada tabel master data siswa ($F$2:$H$40) yang cocok persis dengan NISN di sel A2.'
    },
    commonErrors: [
      'Error #N/A: NISN yang dicari tidak ada di tabel referensi, atau terdapat spasi tersembunyi.',
      'Error #REF!: Nomor kolom yang diminta melebihi total kolom pada tabel referensi.',
      'Tabel bergeser saat di-copy: Lupa memberi tanda absolut $ pada tabel master (gunakan tombol F4).'
    ],
    tips: 'Selalu gunakan FALSE atau 0 pada parameter ke-4 agar hasil pencarian akurat dan tidak salah mengambil nama siswa yang mirip.',
    tags: ['nisn', 'pencarian', 'database siswa', 'rapor', 'master data'],
    isFavorite: true
  },
  {
    id: 'if-tunggal',
    name: 'IF',
    category: 'Logika',
    level: 'Dasar',
    syntaxIndo: '=IF(kondisi_logika; nilai_jika_benar; nilai_jika_salah)',
    syntaxEng: '=IF(logical_test, value_if_true, value_if_false)',
    summary: 'Memeriksa kriteria kelulusan KKM atau status ketercapaian tujuan pembelajaran (Tuntas / Remedial).',
    explanation: 'Rumus logika dasar yang paling sering dipakai guru kelas SDN 006 untuk menentukan apakah seorang siswa tuntas mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) atau harus mengikuti bimbingan remedial.',
    params: [
      { name: 'kondisi_logika', description: 'Syarat yang diuji, contoh: D2>=75 (apakah nilai rata-rata lebih dari atau sama dengan 75).', required: true },
      { name: 'nilai_jika_benar', description: 'Teks atau angka jika lolos syarat (contoh: "Tuntas").', required: true },
      { name: 'nilai_jika_salah', description: 'Teks atau angka jika tidak lolos syarat (contoh: "Remedial").', required: true }
    ],
    schoolExample: {
      title: 'Menentukan Ketercapaian KKTP Nilai Matematika',
      description: 'KKTP SDN 006 ditetapkan sebesar 75. Siswa dengan nilai 75 ke atas berstatus "Tuntas", di bawah 75 "Remedial".',
      headers: ['Nama Siswa', 'Nilai Akhir', 'KKTP', 'Keterangan'],
      rows: [
        ['Ahmad Faiz', 88, 75, 'Tuntas'],
        ['Siti Aisyah', 72, 75, 'Remedial'],
        ['Budi Santoso', 90, 75, 'Tuntas'],
        ['Nurul Huda', 74, 75, 'Remedial']
      ],
      formulaUsed: '=IF(B2>=75; "Tuntas"; "Remedial")',
      formulaEng: '=IF(B2>=75, "Tuntas", "Remedial")',
      resultExplanation: 'Jika nilai pada sel B2 >= 75 maka muncul kata "Tuntas", selain itu muncul "Remedial".'
    },
    commonErrors: [
      'Lupa tanda kutip dua ("): Teks seperti "Tuntas" wajib diapit tanda kutip, jika tidak akan muncul error #NAME?.',
      'Salah menggunakan tanda pemisah: Menggunakan koma (,) padahal regional setting komputer memakai titik koma (;).'
    ],
    tips: 'Gunakan operator >= jika nilai 75 termasuk tuntas. Jika menggunakan >, maka nilai tepat 75 akan dianggap belum tuntas.',
    tags: ['kktp', 'kkm', 'kelulusan', 'nilai', 'rapor'],
    isFavorite: true
  },
  {
    id: 'ifs-bertingkat',
    name: 'IFS',
    category: 'Logika',
    level: 'Menengah',
    syntaxIndo: '=IFS(syarat_1; nilai_1; syarat_2; nilai_2; syarat_3; nilai_3; TRUE; nilai_default)',
    syntaxEng: '=IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)',
    summary: 'Menentukan predikat nilai rapor Kurikulum Merdeka (A, B, C, D atau Sangat Baik, Baik, Cukup, Kurang).',
    explanation: 'Rumus modern pengganti IF bertingkat bersarang. Guru tidak perlu lagi mengetik IF di dalam IF yang membingungkan dan rawan salah tutup kurung.',
    params: [
      { name: 'syarat_1; nilai_1', description: 'Kondisi pertama dan hasilnya jika terpenuhi (misal: B2>=90; "Sangat Baik").', required: true },
      { name: 'syarat_2; nilai_2', description: 'Kondisi kedua jika kondisi pertama tidak terpenuhi (misal: B2>=80; "Baik").', required: true },
      { name: 'syarat_3; nilai_3', description: 'Kondisi ketiga (misal: B2>=70; "Cukup").', required: true },
      { name: 'TRUE; nilai_default', description: 'Kondisi penutup untuk nilai sisa yang paling rendah (misal: TRUE; "Perlu Bimbingan").', required: true }
    ],
    schoolExample: {
      title: 'Predikat Capaian Pembelajaran SDN 006',
      description: 'Konversi nilai rapor: >=90 (A - Sangat Baik), >=80 (B - Baik), >=70 (C - Cukup), <70 (D - Perlu Bimbingan).',
      headers: ['Nama Siswa', 'Nilai', 'Predikat'],
      rows: [
        ['Dewi Sartika', 94, 'Sangat Baik'],
        ['Dimas Pratama', 83, 'Baik'],
        ['Rian Hidayat', 74, 'Cukup'],
        ['Eka Wahyuni', 65, 'Perlu Bimbingan']
      ],
      formulaUsed: '=IFS(B2>=90; "Sangat Baik"; B2>=80; "Baik"; B2>=70; "Cukup"; TRUE; "Perlu Bimbingan")',
      formulaEng: '=IFS(B2>=90, "Sangat Baik", B2>=80, "Baik", B2>=70, "Cukup", TRUE, "Perlu Bimbingan")',
      resultExplanation: 'Mengevaluasi secara bertahap dari nilai tertinggi ke terendah, menghasilkan deskripsi predikat resmi rapor.'
    },
    commonErrors: [
      'Urutan syarat terbalik: Jika syarat B2>=70 ditulis sebelum B2>=90, maka siswa dengan nilai 95 akan langsung terdeteksi Cukup.',
      'Lupa parameter penutup: Tidak memberikan TRUE di akhir dapat memunculkan error #N/A jika tidak ada kondisi yang cocok.'
    ],
    tips: 'Selalu susun kondisi dari nilai tertinggi ke nilai terendah (90, lalu 80, lalu 70, lalu TRUE).',
    tags: ['predikat', 'rapor kurikulum merdeka', 'nilai', 'evaluasi'],
    isFavorite: true
  },
  {
    id: 'countif',
    name: 'COUNTIF',
    category: 'Statistik & Hitungan',
    level: 'Dasar',
    syntaxIndo: '=COUNTIF(rentang_sel; kriteria)',
    syntaxEng: '=COUNTIF(range, criteria)',
    summary: 'Menghitung total kehadiran siswa (jumlah Hadir, Sakit, Izin, Alpha) dalam satu bulan.',
    explanation: 'Sangat praktis untuk rekap buku presensi bulanan wali kelas SDN 006. Tidak perlu menghitung manual satu per satu tanda "S" atau "A" pada absensi.',
    params: [
      { name: 'rentang_sel', description: 'Rentang hari absensi siswa (misal: D4:AH4 untuk tanggal 1 s/d 31).', required: true },
      { name: 'kriteria', description: 'Huruf atau kata yang ingin dihitung, misal "S" (Sakit), "I" (Izin), "A" (Alpha).', required: true }
    ],
    schoolExample: {
      title: 'Rekap Presensi Siswa SDN 006 Bulan Oktober',
      description: 'Menghitung berapa kali siswa tidak masuk karena sakit atau tanpa keterangan (Alpha).',
      headers: ['Nama Siswa', 'Tgl 1-30 Data', 'Total Sakit (S)', 'Total Izin (I)', 'Total Alpha (A)'],
      rows: [
        ['Ananda Putra', 'H,H,S,H,H...', '=COUNTIF(B2:AF2; "S")', '=COUNTIF(B2:AF2; "I")', '=COUNTIF(B2:AF2; "A")'],
        ['Bilqis Humaira', 'H,H,H,H,H...', '=COUNTIF(B3:AF3; "S")', '=COUNTIF(B3:AF3; "I")', '=COUNTIF(B3:AF3; "A")'],
        ['Chairul Anwar', 'A,H,H,S,H...', '=COUNTIF(B4:AF4; "S")', '=COUNTIF(B4:AF4; "I")', '=COUNTIF(B4:AF4; "A")']
      ],
      formulaUsed: '=COUNTIF(D2:AH2; "A")',
      formulaEng: '=COUNTIF(D2:AH2, "A")',
      resultExplanation: 'Menghitung berapa kali huruf "A" muncul di baris tanggal D2 sampai AH2.'
    },
    commonErrors: [
      'Lupa tanda kutip pada teks kriteria: Tulis "A", bukan A tanpa kutip.',
      'Huruf besar/kecil bercampur: COUNTIF tidak case-sensitive, namun spasi tidak sengaja ("A ") tidak akan terhitung.'
    ],
    tips: 'Bisa juga menghitung angka bersyarat, misal menghitung siswa yang tuntas KKM: =COUNTIF(C2:C35; ">=75").',
    tags: ['absensi', 'kehadiran', 'sakit', 'izin', 'alpha', 'presensi'],
    isFavorite: true
  },
  {
    id: 'sumif',
    name: 'SUMIF',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=SUMIF(rentang_kriteria; kriteria; [rentang_jumlah])',
    syntaxEng: '=SUMIF(range, criteria, [sum_range])',
    summary: 'Menjumlahkan anggaran SPJ Dana BOS berdasarkan kode pos belanja tertentu (ATK, Sarpras, Konsumsi).',
    explanation: 'Dipakai oleh Bendahara BOS SDN 006 untuk menghitung subtotal belanja tertentu pada Buku Kas Umum (BKU) tanpa harus memfilter dan menghitung kalkulator terpisah.',
    params: [
      { name: 'rentang_kriteria', description: 'Kolom kategori pengeluaran (misal: B2:B100 berisi nama pos belanja).', required: true },
      { name: 'kriteria', description: 'Kategori spesifik yang dijumlahkan (misal: "ATK" atau "Konsumsi Guru").', required: true },
      { name: 'rentang_jumlah', description: 'Kolom nominal rupiah yang akan dijumlahkan (misal: D2:D100).', required: false }
    ],
    schoolExample: {
      title: 'Rekap Realisasi Belanja BOS Triwulan 3',
      description: 'Menghitung total uang keluar untuk pembelian ATK sekolah dari seluruh transaksi pembukuan.',
      headers: ['Tanggal', 'Jenis Belanja', 'Uraian Barang', 'Nominal (Rp)'],
      rows: [
        ['02/10/2026', 'ATK', 'Kertas HVS A4 10 Rim', '550.000'],
        ['05/10/2026', 'Konsumsi', 'Snack Rapat Komite', '320.000'],
        ['12/10/2026', 'ATK', 'Tinta Printer Epson', '480.000'],
        ['15/10/2026', 'Pemeliharaan', 'Servis AC Ruang Guru', '250.000']
      ],
      formulaUsed: '=SUMIF(B2:B50; "ATK"; D2:D50)',
      formulaEng: '=SUMIF(B2:B50, "ATK", D2:D50)',
      resultExplanation: 'Menjumlahkan seluruh nominal pada kolom D jika kolom B bertuliskan "ATK".'
    },
    commonErrors: [
      'Panjang rentang tidak sama: Rentang kriteria (B2:B50) dan rentang jumlah (D2:D45) ukurannya berbeda, menyebabkan error atau hasil keliru.',
      'Penulisan kriteria berbeda: Di tabel tertulis "A.T.K", di rumus tertulis "ATK".'
    ],
    tips: 'Kriteria bisa diarahkan ke alamat sel lain, misalnya =SUMIF(B2:B50; F2; D2:D50) agar dinamis.',
    tags: ['bos', 'spj', 'keuangan', 'bendahara', 'belanja sekolah'],
    isFavorite: true
  },
  {
    id: 'rank-eq',
    name: 'RANK.EQ',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=RANK.EQ(nilai_siswa; seluruh_rentang_nilai; [urutan_ranking])',
    syntaxEng: '=RANK.EQ(number, ref, [order])',
    summary: 'Menentukan peringkat / ranking kelas siswa secara otomatis berdasarkan total perolehan nilai rapor.',
    explanation: 'Wali kelas SDN 006 tidak perlu mengurutkan (sort) data satu persatu saat membuat leger nilai. Rumus ini langsung menghitung peringkat 1, 2, 3 hingga peringkat terakhir secara instan.',
    params: [
      { name: 'nilai_siswa', description: 'Nilai total atau rata-rata siswa di baris tersebut (misal: sel E2).', required: true },
      { name: 'seluruh_rentang_nilai', description: 'Rentang nilai seluruh siswa di kelas (misal: $E$2:$E$35). Wajib kunci dengan tanda $!', required: true },
      { name: 'urutan_ranking', description: 'Gunakan 0 (atau kosongkan) untuk nilai tertinggi = Ranking 1 (Descending).', required: false }
    ],
    schoolExample: {
      title: 'Peringkat Prestasi Siswa Kelas 5A SDN 006',
      description: 'Menentukan juara kelas berdasarkan akumulasi nilai akhir seluruh mata pelajaran.',
      headers: ['No', 'Nama Siswa', 'Total Nilai', 'Peringkat Kelas'],
      rows: [
        [1, 'Faris Alfian', 925, '=RANK.EQ(C2; $C$2:$C$5; 0) -> Rank 2'],
        [2, 'Nabila Az-Zahra', 960, '=RANK.EQ(C3; $C$2:$C$5; 0) -> Rank 1'],
        [3, 'Rendi Saputra', 880, '=RANK.EQ(C4; $C$2:$C$5; 0) -> Rank 4'],
        [4, 'Zaskia Ramadhani', 910, '=RANK.EQ(C5; $C$2:$C$5; 0) -> Rank 3']
      ],
      formulaUsed: '=RANK.EQ(C2; $C$2:$C$32; 0)',
      formulaEng: '=RANK.EQ(C2, $C$2:$C$32, 0)',
      resultExplanation: 'Memberikan nomor urut ranking siswa berdasarkan posisi nilai C2 di antara seluruh nilai di rentang $C$2:$C$32.'
    },
    commonErrors: [
      'Lupa mengunci rentang referensi dengan F4 ($C$2:$C$32), sehingga saat rumus ditarik ke bawah rentang ikut turun dan ranking menjadi acak-acakan.',
      'Mengisi parameter ke-3 dengan angka 1: Ini akan menjadikan nilai terendah sebagai ranking 1.'
    ],
    tips: 'Jika terdapat 2 siswa dengan nilai sama, keduanya akan mendapat ranking kembar (misal sama-sama rank 2).',
    tags: ['ranking', 'peringkat', 'juara kelas', 'leger', 'prestasi'],
    isFavorite: true
  },
  {
    id: 'textjoin',
    name: 'TEXTJOIN',
    category: 'Teks',
    level: 'Menengah',
    syntaxIndo: '=TEXTJOIN(pemisah; abaikan_kosong; teks1; [teks2]; ...)',
    syntaxEng: '=TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)',
    summary: 'Menggabungkan Tempat Lahir, Tanggal Lahir, atau nama gelar guru dengan pemisah tanda baca rapi.',
    explanation: 'Pengganti modern dari CONCATENATE. Memungkinkan menggabungkan puluhan sel sekaligus dengan tanda koma atau spasi otomatis tanpa mengetik tanda kutip berulang kali.',
    params: [
      { name: 'pemisah', description: 'Karakter pembatas, misal: ", " atau " - " atau " " (spasi).', required: true },
      { name: 'abaikan_kosong', description: 'Gunakan TRUE untuk melewati sel yang kosong agar tidak ada spasi ganda.', required: true },
      { name: 'teks1; teks2...', description: 'Sel-sel yang ingin digabungkan, bisa langsung satu rentang misal A2:C2.', required: true }
    ],
    schoolExample: {
      title: 'Format Tempat dan Tanggal Lahir (TTL) Ijazah Siswa',
      description: 'Menggabungkan kolom Kota Lahir dan kolom Tanggal Lahir untuk keperluan pencetakan Ijazah dan Buku Induk.',
      headers: ['Tempat Lahir (B)', 'Tgl Lahir (C)', 'Hasil TTL Lengkap'],
      rows: [
        ['Jakarta', '14 Mei 2014', 'Jakarta, 14 Mei 2014'],
        ['Surabaya', '02 Agustus 2014', 'Surabaya, 02 Agustus 2014'],
        ['Bandung', '29 November 2013', 'Bandung, 29 November 2013']
      ],
      formulaUsed: '=TEXTJOIN(", "; TRUE; B2; TEXT(C2; "dd mmmm yyyy"))',
      formulaEng: '=TEXTJOIN(", ", TRUE, B2, TEXT(C2, "dd mmmm yyyy"))',
      resultExplanation: 'Menggabungkan nama kota lahir di B2 dan tanggal lahir terformat di C2 dengan dipisahkan tanda koma dan spasi.'
    },
    commonErrors: [
      'Format tanggal menjadi angka serial: Tanggal di Excel adalah angka (misal 45123). Bungkus sel tanggal dengan rumus TEXT(C2; "dd mmmm yyyy").'
    ],
    tips: 'Sangat cocok untuk membuat daftar hadir rapat atau tanda terima bantuan seragam.',
    tags: ['ttl', 'ijazah', 'buku induk', 'biodata', 'gabung teks']
  },
  {
    id: 'datedif',
    name: 'DATEDIF',
    category: 'Tanggal & Waktu',
    level: 'Menengah',
    syntaxIndo: '=DATEDIF(tanggal_awal; tanggal_akhir; "satuan")',
    syntaxEng: '=DATEDIF(start_date, end_date, "unit")',
    summary: 'Menghitung usia tepat siswa per tanggal cut-off PPDB (dalam tahun, bulan, atau hari).',
    explanation: 'Rumus rahasia Excel yang sangat berguna bagi panitia Penerimaan Peserta Didik Baru (PPDB) SDN 006 untuk memvalidasi syarat batas usia minimal 7 tahun atau 6 tahun.',
    params: [
      { name: 'tanggal_awal', description: 'Tanggal lahir siswa (misal di sel B2).', required: true },
      { name: 'tanggal_akhir', description: 'Tanggal acuan cut-off pendaftaran PPDB (misal: TODAY() atau sel acuan 01/07/2026).', required: true },
      { name: '"satuan"', description: '"Y" untuk tahun, "M" untuk bulan, "D" untuk hari, "YM" untuk sisa bulan setelah genap tahun.', required: true }
    ],
    schoolExample: {
      title: 'Validasi Syarat Usia Calon Siswa Baru PPDB',
      description: 'Menghitung usia anak per 1 Juli 2026 dalam format "X Tahun Y Bulan".',
      headers: ['Nama Calon Siswa', 'Tgl Lahir', 'Tgl Acuan PPDB', 'Usia Tepat'],
      rows: [
        ['Raditya Pratama', '15/03/2019', '01/07/2026', '7 Tahun 3 Bulan'],
        ['Anindya Zahra', '20/09/2019', '01/07/2026', '6 Tahun 9 Bulan'],
        ['Muhammad Farhan', '05/01/2020', '01/07/2026', '6 Tahun 5 Bulan']
      ],
      formulaUsed: '=DATEDIF(B2; $C$1; "Y") & " Tahun " & DATEDIF(B2; $C$1; "YM") & " Bulan"',
      formulaEng: '=DATEDIF(B2, $C$1, "Y") & " Tahun " & DATEDIF(B2, $C$1, "YM") & " Bulan"',
      resultExplanation: 'Menghitung selisih tahun penuh menggunakan "Y" dan sisa bulan menggunakan "YM" lalu digabungkan menjadi teks informatif.'
    },
    commonErrors: [
      'Error #NUM!: Tanggal awal lebih baru daripada tanggal akhir (tanggal lahir terbalik dengan tanggal acuan).',
      'Format sel tanggal berupa teks biasa bukan format date.'
    ],
    tips: 'Rumus DATEDIF tidak muncul di intellisense autocomplete Excel, namun tetap berfungsi sempurna.',
    tags: ['ppdb', 'usia siswa', 'tanggal lahir', 'cut off', 'administrasi']
  },
  {
    id: 'proper',
    name: 'PROPER',
    category: 'Teks',
    level: 'Dasar',
    syntaxIndo: '=PROPER(teks_atau_sel)',
    syntaxEng: '=PROPER(text)',
    summary: 'Merapikan penulisan nama siswa dan wali murid menjadi huruf kapital di awal setiap kata.',
    explanation: 'Seringkali data yang diinput oleh wali murid saat pendaftaran online berantakan (ada yang memakai huruf kecil semua atau CAPS LOCK semua). PROPER merapikannya seketika.',
    params: [
      { name: 'teks_atau_sel', description: 'Sel teks yang ingin dirapikan (misal: A2 yang berisi "muhammad hafidz al-fatih").', required: true }
    ],
    schoolExample: {
      title: 'Standarisasi Penulisan Nama Buku Induk',
      description: 'Mengubah format penulisan nama siswa yang acak menjadi standar penulisan dokumen resmi kependidikan.',
      headers: ['Input Data Mentah', 'Hasil Rumus PROPER'],
      rows: [
        ['siti nurhaliza putri', 'Siti Nurhaliza Putri'],
        ['DIMAS ANGGARA KUSUMA', 'Dimas Anggara Kusuma'],
        ['aHMAD fAUZI sAPUTRA', 'Ahmad Fauzi Saputra']
      ],
      formulaUsed: '=PROPER(A2)',
      formulaEng: '=PROPER(A2)',
      resultExplanation: 'Mengubah huruf pertama setiap kata menjadi huruf besar dan sisanya menjadi huruf kecil.'
    },
    commonErrors: [
      'Nama singkatan seperti S.Pd atau M.Pd akan menjadi S.pd atau M.pd. Untuk gelar, gunakan rumus gabungan atau pengecualian.'
    ],
    tips: 'Gabungkan dengan TRIM untuk membersihkan spasi berlebih di awal atau akhir nama: =PROPER(TRIM(A2)).',
    tags: ['nama siswa', 'kapital', 'rapor', 'buku induk', 'ijazah']
  },
  {
    id: 'countifs',
    name: 'COUNTIFS',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=COUNTIFS(rentang_1; kriteria_1; rentang_2; kriteria_2; ...)',
    syntaxEng: '=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)',
    summary: 'Menghitung jumlah data dengan lebih dari 1 syarat (misal: siswa Perempuan yang tuntas KKM).',
    explanation: 'Sangat dibutuhkan saat membuat laporan bulanan kepala sekolah SDN 006 untuk menganalisis data terpilah gender dan capaian ketuntasan belajar.',
    params: [
      { name: 'rentang_1; kriteria_1', description: 'Kriteria pertama, misal kolom jenis kelamin C2:C40 bernilai "P" (Perempuan).', required: true },
      { name: 'rentang_2; kriteria_2', description: 'Kriteria kedua, misal kolom nilai akhir D2:D40 bernilai ">=75".', required: true }
    ],
    schoolExample: {
      title: 'Analisis Demografi Ketuntasan Siswa',
      description: 'Menghitung berapa banyak siswi (Perempuan) di kelas 5 yang nilainya mencapai KKTP (>=75).',
      headers: ['Nama', 'Jenis Kelamin (L/P)', 'Nilai Rapor', 'Keterangan'],
      rows: [
        ['Alya', 'P', 85, 'Tuntas'],
        ['Bagas', 'L', 78, 'Tuntas'],
        ['Citra', 'P', 92, 'Tuntas'],
        ['Dinda', 'P', 70, 'Remedial']
      ],
      formulaUsed: '=COUNTIFS(B2:B35; "P"; C2:C35; ">=75")',
      formulaEng: '=COUNTIFS(B2:B35, "P", C2:C35, ">=75")',
      resultExplanation: 'Menghitung berapa baris yang memenuhi dua syarat sekaligus: Kolom B bernilai "P" dan Kolom C bernilai 75 ke atas.'
    },
    commonErrors: [
      'Ukuran rentang kolom 1 dan kolom 2 harus sama persis (misal B2:B35 dan C2:C35).'
    ],
    tips: 'Bisa menambahkan hingga puluhan kriteria tambahan jika dibutuhkan.',
    tags: ['rekap data', 'laporan bulanan', 'statistik siswa', 'gender']
  },
  {
    id: 'xlookup',
    name: 'XLOOKUP',
    category: 'Pencarian',
    level: 'Mahir',
    syntaxIndo: '=XLOOKUP(nilai_dicari; kolom_kunci; kolom_hasil; [jika_tidak_ditemukan]; [tipe_cocok])',
    syntaxEng: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])',
    summary: 'Pencarian generasi terbaru pengganti VLOOKUP dan HLOOKUP yang jauh lebih cepat dan aman.',
    explanation: 'XLOOKUP tidak peduli apakah kolom hasil berada di sebelah kiri atau kanan kolom kunci, dan secara bawaan sudah default pencarian tepat (exact match) serta memiliki fitur anti error jika data tidak ditemukan.',
    params: [
      { name: 'nilai_dicari', description: 'Nilai yang ingin dicocokkan (misal NIK guru atau NISN siswa).', required: true },
      { name: 'kolom_kunci', description: 'Kolom tempat mencari kecocokan (misal A2:A100).', required: true },
      { name: 'kolom_hasil', description: 'Kolom hasil yang ingin diambil (misal D2:D100).', required: true },
      { name: 'jika_tidak_ditemukan', description: 'Pesan pengganti jika data tidak ada, contoh: "Data Siswa Belum Terdaftar".', required: false }
    ],
    schoolExample: {
      title: 'Cari Riwayat Pembayaran Iuran Siswa SDN 006',
      description: 'Mencari status pelunasan seragam siswa berdasarkan NISN tanpa takut kolom bergeser.',
      headers: ['Cari NISN (G2)', 'Hasil Nama', 'Status Pembayaran'],
      rows: [
        ['00129481', '=XLOOKUP(G2; A2:A50; B2:B50; "Tidak Ada")', '=XLOOKUP(G2; A2:A50; E2:E50; "Belum Lunas")']
      ],
      formulaUsed: '=XLOOKUP(G2; A2:A50; B2:B50; "NISN Tidak Ditemukan")',
      formulaEng: '=XLOOKUP(G2, A2:A50, B2:B50, "NISN Tidak Ditemukan")',
      resultExplanation: 'Mencari nilai di G2 pada kolom A2:A50 dan mengembalikan nilai yang sejajar di B2:B50. Jika tidak ada, menampilkan teks ramah tanpa error #N/A.'
    },
    commonErrors: [
      'Fitur ini hanya tersedia di Excel 2021 ke atas dan Microsoft 365. Untuk Excel versi lama (2013/2016), gunakan INDEX & MATCH.'
    ],
    tips: 'Sangat disarankan memakai XLOOKUP jika sekolah Anda sudah menggunakan Microsoft 365 atau Excel versi mutakhir.',
    tags: ['xlookup', 'modern excel', 'anti error', 'pencarian fleksibel']
  },
  {
    id: 'iferror',
    name: 'IFERROR',
    category: 'Logika',
    level: 'Dasar',
    syntaxIndo: '=IFERROR(rumus_utama; nilai_jika_error)',
    syntaxEng: '=IFERROR(value, value_if_error)',
    summary: 'Mencegah lembar kerja dipenuhi tampilan error jelek seperti #N/A, #DIV/0!, atau #VALUE!.',
    explanation: 'Membuat tampilan lembar kerja SDN 006 tampak profesional dan bersih. Bila data di sel belum diisi atau rumus pembagian menghasilkan nol, sel akan otomatis menampilkan tanda strip (-) atau kosong ("").',
    params: [
      { name: 'rumus_utama', description: 'Rumus yang rentan memunculkan error, misal VLOOKUP atau pembagian rata-rata.', required: true },
      { name: 'nilai_jika_error', description: 'Tampilan pengganti jika error terjadi, contoh: "-" atau "" atau "Belum Ada Nilai".', required: true }
    ],
    schoolExample: {
      title: 'Pembersih Error Tampilan Leger Nilai Rapor',
      description: 'Saat murid belum mengikuti ulangan, rumus rata-rata tidak memunculkan #DIV/0! melainkan strip "-".',
      headers: ['Nama Siswa', 'Ulangan 1', 'Ulangan 2', 'Rata-rata Bersih'],
      rows: [
        ['Andi', 80, 85, '82.5'],
        ['Beni (Sakit)', '', '', '-']
      ],
      formulaUsed: '=IFERROR(AVERAGE(B2:C2); "-")',
      formulaEng: '=IFERROR(AVERAGE(B2:C2), "-")',
      resultExplanation: 'Jika AVERAGE menghasilkan error karena nilai masih kosong, rumus menampilkan karakter "-" sehingga tabel tetap rapi.'
    },
    commonErrors: [
      'Menyembunyikan error rumus yang sebenarnya salah ketik: IFERROR akan menutupi semua jenis error, pastikan rumus utama Anda sudah benar logikanya.'
    ],
    tips: 'Gunakan "" (dua tanda kutip rapat tanpa spasi) jika ingin sel benar-benar tampak kosong saat error.',
    tags: ['kebersihan data', 'anti error', 'rapor', 'estetika tabel']
  },
  {
    id: 'index-match',
    name: 'INDEX & MATCH',
    category: 'Pencarian',
    level: 'Mahir',
    syntaxIndo: '=INDEX(kolom_hasil; MATCH(kunci_cari; kolom_kunci; 0))',
    syntaxEng: '=INDEX(return_array, MATCH(lookup_val, lookup_array, 0))',
    summary: 'Pencarian dinamis dua arah fleksibel ke kiri maupun kanan tanpa terhalang urutan kolom seperti VLOOKUP.',
    explanation: 'Kombinasi rumus legendaris yang jauh lebih cepat dari VLOOKUP. MATCH mencari posisi baris siswa, dan INDEX mengambil data yang sejajar di kolom berapapun (bahkan kolom di sebelah kiri kunci pencarian).',
    params: [
      { name: 'kolom_hasil', description: 'Kolom data yang ingin diambil (misal $B$2:$B$100 untuk Nama Siswa).', required: true },
      { name: 'kunci_cari', description: 'Nilai acuan pencarian (misal sel NISN di G2).', required: true },
      { name: 'kolom_kunci', description: 'Kolom tempat mencari NISN (misal $A$2:$A$100).', required: true }
    ],
    schoolExample: {
      title: 'Pencarian Nama Siswa dengan Posisi Kolom Bebas',
      description: 'Mengambil nama siswa dari kolom B berdasarkan kecocokan NISN di kolom A.',
      headers: ['NISN (A)', 'Nama Siswa (B)', 'Cari NISN (G2)', 'Hasil Nama'],
      rows: [
        ['00129481', 'Ahmad Faiz', '00129482', '=INDEX(B2:B5; MATCH(G2; A2:A5; 0)) -> Siti Aisyah'],
        ['00129482', 'Siti Aisyah', '', '']
      ],
      formulaUsed: '=INDEX($B$2:$B$50; MATCH(G2; $A$2:$A$50; 0))',
      formulaEng: '=INDEX($B$2:$B$50, MATCH(G2, $A$2:$A$50, 0))',
      resultExplanation: 'MATCH menemukan posisi baris NISN, lalu INDEX mengambil nama siswa pada baris tersebut.'
    },
    commonErrors: [
      'Ukuran rentang kolom hasil dan kolom kunci harus sama panjang (misal sama-sama baris 2 sampai 50).'
    ],
    tips: 'Bekerja di seluruh versi Excel lama (2007/2010/2013) yang belum mendukung XLOOKUP.',
    tags: ['index match', 'pencarian fleksibel', 'anti vlookup', 'database guru']
  },
  {
    id: 'average-averageif',
    name: 'AVERAGE & AVERAGEIF',
    category: 'Statistik & Hitungan',
    level: 'Dasar',
    syntaxIndo: '=AVERAGE(rentang_nilai) atau =AVERAGEIF(rentang_kriteria; kriteria; rentang_nilai)',
    syntaxEng: '=AVERAGE(range) or =AVERAGEIF(criteria_range, criteria, average_range)',
    summary: 'Menghitung rata-rata nilai mata pelajaran kelas, atau rata-rata terpilah gender (L/P).',
    explanation: 'Rumus wajib setiap wali kelas dan guru bidang studi SDN 006 untuk menghitung Nilai Rata-rata Ujian Harian, Asesmen Sumatif, serta membandingkan performa siswa laki-laki dan perempuan.',
    params: [
      { name: 'rentang_kriteria', description: 'Kolom pemilah (misal C2:C40 untuk jenis kelamin "L" atau "P").', required: false },
      { name: 'kriteria', description: 'Kriteria filter (misal "P" untuk siswi perempuan).', required: false },
      { name: 'rentang_nilai', description: 'Kolom angka nilai ujian (misal E2:E40).', required: true }
    ],
    schoolExample: {
      title: 'Perbandingan Rata-rata Nilai Siswa vs Siswi',
      description: 'Menghitung rata-rata nilai matematika khusus siswi perempuan di kelas 5.',
      headers: ['Nama', 'Gender', 'Nilai MTK'],
      rows: [
        ['Andi', 'L', 80],
        ['Bunga', 'P', 90],
        ['Citra', 'P', 86]
      ],
      formulaUsed: '=AVERAGEIF(B2:B35; "P"; C2:C35)',
      formulaEng: '=AVERAGEIF(B2:B35, "P", C2:C35)',
      resultExplanation: 'Hanya menjumlahkan dan membagi nilai siswa yang kolom gendernya bertuliskan "P".'
    },
    commonErrors: ['Error #DIV/0! jika tidak ada satu pun baris yang memenuhi kriteria.'],
    tips: 'Bungkus dengan IFERROR(AVERAGEIF(...); 0) agar tidak error saat data belum lengkap.',
    tags: ['rata-rata', 'analisis nilai', 'gender', 'evaluasi kelas'],
    isFavorite: true
  },
  {
    id: 'max-min',
    name: 'MAX & MIN',
    category: 'Statistik & Hitungan',
    level: 'Dasar',
    syntaxIndo: '=MAX(rentang_nilai) dan =MIN(rentang_nilai)',
    syntaxEng: '=MAX(range) and =MIN(range)',
    summary: 'Menemukan nilai tertinggi dan nilai terendah di kelas secara instan.',
    explanation: 'Digunakan pada bagian rekapitulasi bawah leger nilai SDN 006 untuk mengetahui daya serap tertinggi dan mengidentifikasi nilai terendah yang membutuhkan bimbingan remedial.',
    params: [
      { name: 'rentang_nilai', description: 'Rentang kolom nilai rapor siswa (misal: E2:E36).', required: true }
    ],
    schoolExample: {
      title: 'Rekap Nilai Tertinggi & Terendah Kelas 5A',
      description: 'Mengetahui skor tertinggi try out ujian sekolah.',
      headers: ['Nama', 'Nilai Try Out'],
      rows: [
        ['Siswa 1..35', '70 s/d 98'],
        ['Nilai Tertinggi', '=MAX(B2:B36) -> 98'],
        ['Nilai Terendah', '=MIN(B2:B36) -> 70']
      ],
      formulaUsed: '=MAX(B2:B36)',
      formulaEng: '=MAX(B2:B36)',
      resultExplanation: 'Mengembalikan angka terbesar dalam kumpulan data numerik.'
    },
    commonErrors: ['Jika sel berisi angka dalam format teks, rumus MAX akan mengabaikannya.'],
    tips: 'Pastikan angka tidak berawalan tanda kutip satu (\') agar terbaca numerik.',
    tags: ['nilai tertinggi', 'nilai terendah', 'rekap rapor', 'leger']
  },
  {
    id: 'large-small',
    name: 'LARGE & SMALL',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=LARGE(rentang_nilai; peringkat_ke_k) dan =SMALL(rentang_nilai; peringkat_ke_k)',
    syntaxEng: '=LARGE(range, k) and =SMALL(range, k)',
    summary: 'Mengambil nilai juara 1, juara 2, juara 3, atau nilai terendah ke-1, ke-2 tanpa mengurutkan tabel.',
    explanation: 'Sangat cocok untuk panitia lomba sekolah SDN 006 atau penentuan 3 besar penerima piagam penghargaan kelas.',
    params: [
      { name: 'rentang_nilai', description: 'Kumpulan nilai seluruh siswa (misal: F2:F36).', required: true },
      { name: 'peringkat_ke_k', description: 'Urutan peringkat (1 untuk juara 1, 2 untuk juara 2, 3 untuk juara 3).', required: true }
    ],
    schoolExample: {
      title: 'Penentuan 3 Besar Nilai Terbaik Ujian Sekolah',
      description: 'Mencari skor juara 1, 2, dan 3 tanpa perlu mengacak susunan baris absen siswa.',
      headers: ['Juara', 'Rumus', 'Hasil Nilai'],
      rows: [
        ['Juara 1', '=LARGE(F2:F36; 1)', 98.5],
        ['Juara 2', '=LARGE(F2:F36; 2)', 96.0],
        ['Juara 3', '=LARGE(F2:F36; 3)', 94.5]
      ],
      formulaUsed: '=LARGE($F$2:$F$36; 1)',
      formulaEng: '=LARGE($F$2:$F$36, 1)',
      resultExplanation: 'Mengambil angka terbesar urutan ke-1 dari seluruh data di rentang F2:F36.'
    },
    commonErrors: ['Error #NUM! jika angka parameter k melebihi jumlah total baris data.'],
    tips: 'Gunakan SMALL(F2:F36; 1) untuk menemukan siswa dengan nilai paling kritis yang wajib remedial.',
    tags: ['peringkat', '3 besar', 'juara kelas', 'lomba sekolah']
  },
  {
    id: 'round-family',
    name: 'ROUND, ROUNDUP, ROUNDDOWN',
    category: 'Statistik & Hitungan',
    level: 'Dasar',
    syntaxIndo: '=ROUND(angka_desimal; jumlah_digit_desimal)',
    syntaxEng: '=ROUND(number, num_digits)',
    summary: 'Membulatkan nilai rata-rata rapor ke 2 digit desimal (misal 87.6666 menjadi 87.67).',
    explanation: 'Aturan rapor Kurikulum Merdeka dan Ijazah SDN 006 mewajibkan penulisan nilai akhir dibulatkan menjadi bilangan bulat atau tepat 2 angka di belakang koma.',
    params: [
      { name: 'angka_desimal', description: 'Sel angka atau hasil rumus pembagian (misal sel G2).', required: true },
      { name: 'jumlah_digit_desimal', description: 'Angka 0 untuk bilangan bulat, angka 2 untuk 2 desimal.', required: true }
    ],
    schoolExample: {
      title: 'Pembulatan Rata-rata Nilai Ijazah',
      description: 'Membulatkan rata-rata 3 sumatif agar pas 2 angka desimal.',
      headers: ['Hasil Asli', 'Rumus ROUND', 'Tampilan Bersih'],
      rows: [
        [83.333333, '=ROUND(A2; 2)', 83.33],
        [87.666667, '=ROUND(A3; 2)', 87.67]
      ],
      formulaUsed: '=ROUND(AVERAGE(C2:E2); 2)',
      formulaEng: '=ROUND(AVERAGE(C2:E2), 2)',
      resultExplanation: 'Menggabungkan rata-rata dan langsung membulatkannya menjadi 2 desimal.'
    },
    commonErrors: ['Format tampilan sel di Excel (Increase/Decrease Decimal) hanya mengubah tampilan luar, bukan nilai asli. Gunakan ROUND agar perhitungan nilai akhir presisi.'],
    tips: 'Gunakan ROUND(A2; 0) jika ingin membulatkan langsung ke angka bulat tanpa koma.',
    tags: ['pembulatan', 'desimal', 'nilai rapor', 'ijazah']
  },
  {
    id: 'len-validation',
    name: 'LEN',
    category: 'Teks',
    level: 'Dasar',
    syntaxIndo: '=LEN(teks_atau_sel)',
    syntaxEng: '=LEN(text)',
    summary: 'Menghitung jumlah karakter teks untuk memvalidasi tepat 10 digit NISN atau 16 digit NIK.',
    explanation: 'Seringkali nomor NISN siswa terpotong angka 0 depannya atau salah ketik kelebihan angka. Rumus LEN memeriksa panjang karakter seketika.',
    params: [
      { name: 'teks_atau_sel', description: 'Sel yang ingin dihitung karakternya (misal sel B2 berisi nomor NISN).', required: true }
    ],
    schoolExample: {
      title: 'Validasi Format NISN 10 Angka',
      description: 'Mengecek apakah NISN siswa sudah pas 10 digit atau salah ketik.',
      headers: ['Nama Siswa', 'Input NISN', 'Panjang Karakter', 'Status Validasi'],
      rows: [
        ['Budi', '0012948112', '=LEN(B2) -> 10', 'Valid'],
        ['Ani', '12948112', '=LEN(B3) -> 8', 'Kurang 2 Digit (Cek Nol Depan!)']
      ],
      formulaUsed: '=IF(LEN(B2)=10; "Valid"; "Cek Ulang NISN!")',
      formulaEng: '=IF(LEN(B2)=10, "Valid", "Cek Ulang NISN!")',
      resultExplanation: 'Jika panjang teks di sel B2 sama dengan 10 maka dinyatakan Valid, selain itu diminta cek ulang.'
    },
    commonErrors: ['Spasi tidak sengaja di awal atau akhir kata ikut terhitung sebagai 1 karakter.'],
    tips: 'Kombinasikan dengan TRIM: =LEN(TRIM(B2)) agar spasi liar terhapus lebih dulu.',
    tags: ['validasi nisn', 'nik 16 digit', 'dapodik', 'panjang karakter', 'buku induk']
  },
  {
    id: 'left-mid-right',
    name: 'LEFT, MID, RIGHT',
    category: 'Teks',
    level: 'Menengah',
    syntaxIndo: '=LEFT(teks; jml_karakter), =MID(teks; awal; panjang), =RIGHT(teks; jml_karakter)',
    syntaxEng: '=LEFT(text, num_chars), =MID(text, start_num, num_chars), =RIGHT(text, num_chars)',
    summary: 'Mengambil bagian tertentu dari kode pendaftaran PPDB, tahun ajaran, atau kode inventaris barang.',
    explanation: 'Misalnya kode inventaris "INV-2026-KOMP-01", rumus ini dapat mengambil tahun "2026" atau kode urut "01" secara terpisah untuk pengelompokan sarpras.',
    params: [
      { name: 'teks', description: 'Teks kode sumber (misal sel A2).', required: true },
      { name: 'awal / panjang', description: 'Titik awal karakter dan berapa banyak huruf yang diambil.', required: true }
    ],
    schoolExample: {
      title: 'Pemisahan Tahun dan Rombel dari Nomor Registrasi Siswa',
      description: 'Nomor registrasi PPDB: "REG-2026-5A-024".',
      headers: ['Kode Lengkap', 'Tahun (MID)', 'Rombel (MID)', 'No Urut (RIGHT)'],
      rows: [
        ['REG-2026-5A-024', '=MID(A2; 5; 4) -> 2026', '=MID(A2; 10; 2) -> 5A', '=RIGHT(A2; 3) -> 024']
      ],
      formulaUsed: '=MID(A2; 5; 4)',
      formulaEng: '=MID(A2, 5, 4)',
      resultExplanation: 'Mengambil 4 huruf dimulai dari karakter ke-5 (yaitu angka tahun).'
    },
    commonErrors: ['Salah menghitung posisi awal karakter pemisah strip (-).'],
    tips: 'Bisa digabungkan dengan VALUE() jika hasilnya ingin langsung diubah ke angka murni.',
    tags: ['ekstrak teks', 'kode siswa', 'ppdb', 'inventaris', 'sarpras']
  },
  {
    id: 'trim-clean',
    name: 'TRIM',
    category: 'Teks',
    level: 'Dasar',
    syntaxIndo: '=TRIM(teks_atau_sel)',
    syntaxEng: '=TRIM(text)',
    summary: 'Penyelamat rumus VLOOKUP! Menghapus spasi ganda dan spasi liar tersembunyi pada nama atau NISN.',
    explanation: 'Penyebab 80% error #N/A pada VLOOKUP di sekolah adalah wali murid atau guru tidak sengaja menekan spasi di akhir NISN ("00129481 "). Excel menganggapnya berbeda. Rumus TRIM membersihkan semua spasi berlebih tersebut.',
    params: [
      { name: 'teks_atau_sel', description: 'Sel teks yang ingin dibersihkan dari spasi liar.', required: true }
    ],
    schoolExample: {
      title: 'Pembersihan Database Siswa dari Spasi Tersembunyi',
      description: 'Membersihkan spasi di ujung teks sebelum dihubungkan ke VLOOKUP.',
      headers: ['Data Asli Kotor', 'Hasil TRIM Bersih'],
      rows: [
        ['"Ahmad   Faiz  "', '"Ahmad Faiz"'],
        ['"00129481 "', '"00129481"']
      ],
      formulaUsed: '=TRIM(A2)',
      formulaEng: '=TRIM(A2)',
      resultExplanation: 'Menghapus spasi di awal dan akhir teks serta merapikan spasi ganda di tengah menjadi 1 spasi.'
    },
    commonErrors: ['TRIM Excel standar tidak menghapus karakter non-breaking space (char 160) dari web copy-paste. Gunakan =TRIM(CLEAN(SUBSTITUTE(A2; CHAR(160); " "))) jika masih membandel.'],
    tips: 'Gunakan selalu =VLOOKUP(TRIM(A2); $F$2:$H$40; 2; 0) agar aman 100%.',
    tags: ['pembersih spasi', 'solusi error na', 'vlookup fix', 'kualitas data'],
    isFavorite: true
  },
  {
    id: 'subtotal-filter',
    name: 'SUBTOTAL',
    category: 'Administrasi Sekolah',
    level: 'Mahir',
    syntaxIndo: '=SUBTOTAL(nomor_fungsi; rentang_data)',
    syntaxEng: '=SUBTOTAL(function_num, range)',
    summary: 'Menghitung total belanja kas BOS yang otomatis hanya menjumlahkan baris yang sedang tampil saat difilter!',
    explanation: 'Jika menggunakan =SUM(), saat bendahara memfilter tabel belanja bulan Oktober, angka total tetap menjumlahkan seluruh bulan lain yang tersembunyi. Rumus =SUBTOTAL(9; D2:D100) otomatis hanya menghitung baris yang terlihat di layar!',
    params: [
      { name: 'nomor_fungsi', description: 'Angka 9 untuk SUM, 1 untuk AVERAGE, 3 untuk COUNTA.', required: true },
      { name: 'rentang_data', description: 'Kolom angka yang ingin dihitung (misal D2:D100).', required: true }
    ],
    schoolExample: {
      title: 'Total Belanja Kas BOS Dinamis Sesuai Filter',
      description: 'Menghitung total uang keluar yang otomatis menyesuaikan saat nama pos belanja difilter.',
      headers: ['Status Filter', 'Rumus SUM', 'Rumus SUBTOTAL (Benar)'],
      rows: [
        ['Semua Data Tampil', 'Rp 15.000.000', 'Rp 15.000.000'],
        ['Filter Pos "ATK" Saja', 'Rp 15.000.000 (Salah!)', 'Rp 2.450.000 (Tepat!)']
      ],
      formulaUsed: '=SUBTOTAL(9; D2:D100)',
      formulaEng: '=SUBTOTAL(9, D2:D100)',
      resultExplanation: 'Mengabaikan baris yang disembunyikan oleh fitur Filter Excel (Ctrl + Shift + L).'
    },
    commonErrors: ['Salah memilih nomor fungsi (pilih angka 9 untuk penjumlahan).'],
    tips: 'Gunakan nomor 109 jika ingin mengabaikan baris yang di-hide secara manual (bukan lewat filter).',
    tags: ['bos', 'spj', 'bendahara', 'filter tabel', 'subtotal']
  },
  {
    id: 'sumifs-multi',
    name: 'SUMIFS',
    category: 'Administrasi Sekolah',
    level: 'Mahir',
    syntaxIndo: '=SUMIFS(rentang_jumlah; rentang_syarat1; syarat1; rentang_syarat2; syarat2; ...)',
    syntaxEng: '=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)',
    summary: 'Menjumlahkan kas belanja BOS dengan 2 syarat atau lebih (misal Belanja "ATK" DAN Status "Lunas").',
    explanation: 'Bendahara BOS SDN 006 seringkali perlu merekap belanja komponen tertentu pada bulan tertentu yang sudah diverifikasi tanda terima notanya.',
    params: [
      { name: 'rentang_jumlah', description: 'Kolom nominal rupiah yang dijumlahkan (misal: E2:E100).', required: true },
      { name: 'rentang_syarat1; syarat1', description: 'Syarat pertama (misal kolom kategori B2:B100 bernilai "ATK").', required: true },
      { name: 'rentang_syarat2; syarat2', description: 'Syarat kedua (misal kolom bulan C2:C100 bernilai "Oktober").', required: true }
    ],
    schoolExample: {
      title: 'Rekap Realisasi BOS Pos ATK Bulan Oktober',
      description: 'Menghitung pengeluaran khusus ATK di bulan Oktober saja.',
      headers: ['Bulan (B)', 'Kategori (C)', 'Nominal (D)'],
      rows: [
        ['Oktober', 'ATK', 550000],
        ['Oktober', 'Konsumsi', 300000],
        ['September', 'ATK', 400000]
      ],
      formulaUsed: '=SUMIFS(D2:D50; B2:B50; "Oktober"; C2:C50; "ATK")',
      formulaEng: '=SUMIFS(D2:D50, B2:B50, "Oktober", C2:C50, "ATK")',
      resultExplanation: 'Menjumlahkan angka kolom D hanya jika baris tersebut Bulan Oktober DAN Kategori ATK.'
    },
    commonErrors: ['Urutan SUMIFS terbalik dari SUMIF: Pada SUMIFS, kolom angka yang dijumlahkan ditaruh di parameter PALING PERTAMA.'],
    tips: 'Bisa menambahkan hingga puluhan syarat tambahan.',
    tags: ['bos reguler', 'keuangan', 'spj', 'multi syarat', 'bku']
  },
  {
    id: 'today-now',
    name: 'TODAY & NOW',
    category: 'Tanggal & Waktu',
    level: 'Dasar',
    syntaxIndo: '=TODAY() dan =NOW()',
    syntaxEng: '=TODAY() and =NOW()',
    summary: 'Memasukkan tanggal hari ini atau waktu realtime otomatis pada tanda tangan cetak rapor / dokumen.',
    explanation: 'Pada bagian tanda tangan kepala sekolah SDN 006 di bawah lembar kerja ("Jakarta, 12 Oktober 2026"), rumus ini membuat tanggal selalu mutakhir otomatis setiap hari saat berkas dibuka tanpa ketik manual.',
    params: [],
    schoolExample: {
      title: 'Titimangsa Tanda Tangan Cetak Rapor Otomatis',
      description: 'Menggabungkan nama kota sekolah dan tanggal hari ini secara otomatis.',
      headers: ['Hasil Tanggal', 'Format Indonesia Terbaca'],
      rows: [
        ['=TODAY()', '12/10/2026'],
        ['="Jakarta, " & TEXT(TODAY(); "dd mmmm yyyy")', 'Jakarta, 12 Oktober 2026']
      ],
      formulaUsed: '="Jakarta, " & TEXT(TODAY(); "dd mmmm yyyy")',
      formulaEng: '="Jakarta, " & TEXT(TODAY(), "dd mmmm yyyy")',
      resultExplanation: 'Mengambil tanggal sistem hari ini dan memformatnya menjadi teks nama bulan resmi.'
    },
    commonErrors: ['Tanpa fungsi TEXT, hasil penggabungan teks tanggal akan menjadi angka serial (misal "Jakarta, 45123").'],
    tips: 'Jika ingin tanggal mati (tidak berubah esok hari), tekan shortcut Ctrl + ; di keyboard.',
    tags: ['tanggal hari ini', 'titimangsa', 'tanda tangan', 'surat resmi']
  },
  {
    id: 'networkdays-efektif',
    name: 'NETWORKDAYS',
    category: 'Tanggal & Waktu',
    level: 'Menengah',
    syntaxIndo: '=NETWORKDAYS(tanggal_mulai; tanggal_selesai; [daftar_libur])',
    syntaxEng: '=NETWORKDAYS(start_date, end_date, [holidays])',
    summary: 'Menghitung jumlah hari efektif belajar (HEB) sekolah dalam satu semester tanpa menghitung Sabtu-Minggu.',
    explanation: 'Kurikulum SDN 006 membutuhkan perhitungan Hari Efektif Belajar (HEB) dan Pekan Efektif untuk menyusun Program Semester (Promes) dan Program Tahunan (Prota) guru.',
    params: [
      { name: 'tanggal_mulai', description: 'Hari pertama masuk semester (misal 13 Juli 2026).', required: true },
      { name: 'tanggal_selesai', description: 'Hari pembagian rapor semester (misal 18 Desember 2026).', required: true },
      { name: 'daftar_libur', description: 'Rentang tanggal libur nasional / cuti bersama keagamaan.', required: false }
    ],
    schoolExample: {
      title: 'Penghitungan Hari Efektif Belajar Semester Ganjil',
      description: 'Menghitung total jam tatap muka efektif selama semester 1.',
      headers: ['Tgl Mulai', 'Tgl Selesai', 'Libur Nasional', 'Total Hari Efektif'],
      rows: [
        ['13/07/2026', '18/12/2026', 'Rentang K1:K8', '=NETWORKDAYS(A2; B2; K1:K8) -> 108 Hari']
      ],
      formulaUsed: '=NETWORKDAYS(A2; B2; $K$1:$K$8)',
      formulaEng: '=NETWORKDAYS(A2, B2, $K$1:$K$8)',
      resultExplanation: 'Menghitung hari kerja Senin s/d Jumat antara dua tanggal dan otomatis mengurangkan hari libur.'
    },
    commonErrors: ['Jika sekolah Anda memberlakukan 6 hari sekolah (Sabtu masuk), gunakan rumus NETWORKDAYS.INTL(A2; B2; 11; libur).'],
    tips: 'Bagi hasil hari efektif dengan 5 untuk mendapatkan jumlah Pekan Efektif.',
    tags: ['promes', 'prota', 'kalender pendidikan', 'hari efektif', 'guru kelas']
  },
  {
    id: 'and-or-logic',
    name: 'AND & OR (Logika Ganda)',
    category: 'Logika',
    level: 'Menengah',
    syntaxIndo: '=IF(AND(syarat1; syarat2); "Lulus"; "Tidak")',
    syntaxEng: '=IF(AND(condition1, condition2), "Pass", "Fail")',
    summary: 'Kriteria kenaikan kelas dengan syarat rangkap (contoh: Nilai KKTP >= 75 DAN Kehadiran >= 85%).',
    explanation: 'Kelulusan siswa SDN 006 tidak hanya dinilai dari angka ujian, tetapi juga kedisiplinan absensi dan sikap. Rumus AND memastikan seluruh syarat wajib terpenuhi bersamaan.',
    params: [
      { name: 'syarat1', description: 'Syarat nilai akhir, misal D2>=75.', required: true },
      { name: 'syarat2', description: 'Syarat persentase kehadiran, misal E2>=85.', required: true }
    ],
    schoolExample: {
      title: 'Kriteria Kenaikan Kelas Komprehensif',
      description: 'Siswa naik kelas jika Nilai >= 75 DAN Kehadiran >= 85%.',
      headers: ['Nama', 'Nilai Akhir', '% Hadir', 'Keputusan'],
      rows: [
        ['Budi', 82, 95, 'Naik Kelas'],
        ['Doni (Sering Alpha)', 78, 65, 'Pertimbangan Khusus']
      ],
      formulaUsed: '=IF(AND(B2>=75; C2>=85); "Naik Kelas"; "Tinjau Khusus")',
      formulaEng: '=IF(AND(B2>=75, C2>=85), "Naik Kelas", "Tinjau Khusus")',
      resultExplanation: 'Menghasilkan "Naik Kelas" hanya jika kedua kriteria terpenuhi sekaligus.'
    },
    commonErrors: ['Menggunakan OR padahal maksudnya adalah AND.'],
    tips: 'Gunakan OR jika siswa cukup memenuhi salah satu syarat prestasi.',
    tags: ['kenaikan kelas', 'syarat ganda', 'kehadiran', 'rapor']
  },
  {
    id: 'filter-spill',
    name: 'FILTER',
    category: 'Pencarian',
    level: 'Mahir',
    syntaxIndo: '=FILTER(rentang_data; kriteria_saring; [jika_kosong])',
    syntaxEng: '=FILTER(array, include, [if_empty])',
    summary: 'Menyaring dan menampilkan daftar siswa atau data secara dinamis berdasarkan syarat tertentu tanpa filter manual.',
    explanation: 'Fungsi array dinamis modern di Excel 365/2021 untuk menarik otomatis seluruh baris siswa remedial, penerima PIP, atau siswa teladan ke tabel rekap terpisah hanya dengan 1 baris rumus.',
    params: [
      { name: 'rentang_data', description: 'Tabel data yang ingin diambil (misal: A2:C40 untuk kolom Nama, Nilai, Status).', required: true },
      { name: 'kriteria_saring', description: 'Kondisi penyaringan (misal: C2:C40="Remedial" atau B2:B40<75).', required: true },
      { name: 'jika_kosong', description: 'Teks jika tidak ada satupun yang cocok, misal: "Semua Siswa Tuntas".', required: false }
    ],
    schoolExample: {
      title: 'Menyaring Otomatis Siswa yang Harus Ikut Remedial',
      description: 'Di SDN 006, wali kelas cukup mengetikkan rumus di sel awal, maka daftar nama anak remedial langsung tumpah ke bawah (Spill Range).',
      headers: ['Nama Siswa', 'Nilai Formatif', 'Keterangan'],
      rows: [
        ['Bambang Irawan', 68, 'Remedial'],
        ['Siti Maryam', 70, 'Remedial'],
        ['Rizky Pratama', 64, 'Remedial']
      ],
      formulaUsed: '=FILTER(A2:C40; C2:C40="Remedial"; "Semua Tuntas")',
      formulaEng: '=FILTER(A2:C40, C2:C40="Remedial", "Semua Tuntas")',
      resultExplanation: 'Mengambil seluruh baris data siswa yang memiliki keterangan "Remedial" di kolom C.'
    },
    commonErrors: [
      'Error #SPILL!: Ada teks atau garis tabel lain di sel bawahnya yang menghalangi area tumpahan hasil. Hapus sel yang menghalangi.',
      'Ukuran rentang kriteria tidak sama dengan ukuran rentang data: Misal data A2:C40 tapi kriteria C2:C35.'
    ],
    tips: 'Kombinasikan dengan SORT agar daftar siswa remedial langsung terurut dari nilai terendah: =SORT(FILTER(A2:C40; C2:C40="Remedial"); 2; 1).',
    tags: ['filter', 'spill', 'array dinamis', 'remedial', 'kurikulum merdeka'],
    isFavorite: true
  },
  {
    id: 'unique-list',
    name: 'UNIQUE',
    category: 'Pencarian',
    level: 'Menengah',
    syntaxIndo: '=UNIQUE(rentang_data; [berdasarkan_kolom]; [tepat_sekali])',
    syntaxEng: '=UNIQUE(array, [by_col], [exactly_once])',
    summary: 'Mengekstrak daftar nama unik tanpa duplikasi (misal: daftar asal desa siswa, mata pelajaran, atau wali kelas).',
    explanation: 'Sangat berguna bagi panitia PPDB dan operator SDN 006 untuk memfilter data 200 siswa dan langsung mendapatkan daftar unik dusun/kelurahan asal siswa tanpa harus menghapus duplikat secara manual.',
    params: [
      { name: 'rentang_data', description: 'Kolom yang memuat data berulang (misal: D2:D200 untuk kolom Asal TK/Kelurahan).', required: true },
      { name: 'berdasarkan_kolom', description: 'FALSE (default) untuk baris unik, TRUE untuk kolom unik.', required: false },
      { name: 'tepat_sekali', description: 'FALSE untuk semua item unik, TRUE hanya yang muncul tepat satu kali.', required: false }
    ],
    schoolExample: {
      title: 'Merekap Asal Sekolah TK Siswa Baru PPDB',
      description: 'Mengetahui variasi nama TK asal dari 100 pendaftar baru tanpa nama TK yang berulang.',
      headers: ['Data Asli (Banyak Dobel)', 'Hasil Rumus UNIQUE (Otomatis)'],
      rows: [
        ['TK Pertiwi 01', 'TK Pertiwi 01'],
        ['TK Aisyiyah', 'TK Aisyiyah'],
        ['TK Pertiwi 01', 'TK Tunas Bangsa'],
        ['TK Tunas Bangsa', 'RA Al-Ikhlas']
      ],
      formulaUsed: '=UNIQUE(A2:A100)',
      formulaEng: '=UNIQUE(A2:A100)',
      resultExplanation: 'Menghasilkan daftar nama sekolah tanpa ada satupun nama yang berulang.'
    },
    commonErrors: ['Error #SPILL! jika sel di bawah rumus terhalang oleh tulisan lain.'],
    tips: 'Bungkus dengan SORT untuk langsung mengurutkan nama sesuai abjad A-Z: =SORT(UNIQUE(A2:A100)).',
    tags: ['unique', 'tanpa duplikat', 'ppdb', 'dapodik', 'master data']
  },
  {
    id: 'sort-sortby',
    name: 'SORT & SORTBY',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=SORT(rentang; [nomor_kolom_urut]; [urutan_1_atau_min1])',
    syntaxEng: '=SORT(array, [sort_index], [sort_order])',
    summary: 'Mengurutkan tabel data siswa secara dinamis berdasarkan ranking nilai tertinggi atau abjad nama.',
    explanation: 'Tidak perlu klik tombol Data Sort manual yang merusak rumus sel. Dengan fungsi SORT, tabel peringkat juara kelas otomatis tersusun rapi saat nilai diubah.',
    params: [
      { name: 'rentang', description: 'Rentang data yang ingin diurutkan (misal: A2:C35).', required: true },
      { name: 'nomor_kolom_urut', description: 'Nomor kolom yang menjadi acuan pengurutan (misal: 2 untuk kolom Nilai).', required: false },
      { name: 'urutan_1_atau_min1', description: 'Gunakan 1 untuk Menaik (A-Z / terkecil ke terbesar), -1 untuk Menurun (terbesar ke terkecil / ranking 1).', required: false }
    ],
    schoolExample: {
      title: 'Papan Peringkat Juara Kelas Otomatis',
      description: 'Mengurutkan 3 siswa dengan nilai rata-rata tertinggi untuk piagam penghargaan.',
      headers: ['Nama Siswa', 'Nilai Rata-rata', 'Juara'],
      rows: [
        ['Annisa Zahra', 94.75, 'Juara 1'],
        ['Citra Kirana', 90.00, 'Juara 2'],
        ['Aditiya Pratama', 87.25, 'Juara 3']
      ],
      formulaUsed: '=SORT(A2:B35; 2; -1)',
      formulaEng: '=SORT(A2:B35, 2, -1)',
      resultExplanation: 'Mengurutkan data A2:B35 berdasarkan kolom ke-2 (Nilai) secara menurun (-1) dari nilai tertinggi.'
    },
    commonErrors: ['Lupa mengisi parameter ke-3 dengan -1 saat menginginkan peringkat juara (karena defaultnya adalah 1 / menaik).'],
    tips: 'Gunakan bersama TAKE(SORT(...); 3) untuk langsung mengambil TOP 3 juara kelas!',
    tags: ['sort', 'ranking', 'juara kelas', 'urutan nilai', 'prestasi']
  },
  {
    id: 'concat-operator',
    name: 'CONCAT & Operator &',
    category: 'Teks',
    level: 'Dasar',
    syntaxIndo: '=A2 & " " & B2 atau =CONCAT(A2; " "; B2)',
    syntaxEng: '=A2 & " " & B2 or =CONCAT(A2, " ", B2)',
    summary: 'Menggabungkan beberapa sel teks seperti Nama & Gelar Guru, atau Tempat & Tanggal Lahir.',
    explanation: 'Operator ampersand (&) dan fungsi CONCAT adalah senjata utama tata usaha SDN 006 untuk menyusun teks identitas siswa untuk cetak rapor dan ijazah dari kolom terpisah.',
    params: [
      { name: 'teks1; teks2...', description: 'Sel teks yang digabung, diselingi tanda kutip untuk spasi atau koma (contoh: A2 & ", " & B2).', required: true }
    ],
    schoolExample: {
      title: 'Format Tempat dan Tanggal Lahir Ijazah',
      description: 'Kolom B berisi Tempat Lahir ("Balikpapan"), kolom C berisi Tanggal Lahir ("15 Mei 2014").',
      headers: ['Tempat Lahir (B)', 'Tanggal Lahir (C)', 'Hasil Gabungan di Ijazah'],
      rows: [
        ['Balikpapan', '15 Mei 2014', 'Balikpapan, 15 Mei 2014'],
        ['Samarinda', '20 Agustus 2014', 'Samarinda, 20 Agustus 2014']
      ],
      formulaUsed: '=B2 & ", " & TEXT(C2; "dd mmmm yyyy")',
      formulaEng: '=B2 & ", " & TEXT(C2, "dd mmmm yyyy")',
      resultExplanation: 'Menyambungkan nama kota dengan tanggal lahir yang diformat teks bahasa Indonesia.'
    },
    commonErrors: ['Lupa menyisipkan spasi di antara kata sehingga hasilnya menempel (contoh: "Balikpapan15 Mei"). Gunakan & " " &.'],
    tips: 'Gunakan rumus TEXT(sel_tanggal; "dd mmmm yyyy") agar tanggal tidak berubah menjadi kode angka saat disambung.',
    tags: ['gabung teks', 'ijazah', 'biodata', 'nama gelar', 'rapor']
  },
  {
    id: 'substitute-replace',
    name: 'SUBSTITUTE',
    category: 'Teks',
    level: 'Menengah',
    syntaxIndo: '=SUBSTITUTE(teks; teks_lama; teks_baru; [nomor_kejadian])',
    syntaxEng: '=SUBSTITUTE(text, old_text, new_text, [instance_num])',
    summary: 'Mengganti kata atau karakter tertentu pada teks (misal menghapus tanda strip NIK/NISN atau merapikan nomor HP).',
    explanation: 'Membersihkan format nomor rekening guru, NIK, atau nomor telepon orang tua murid yang terkadang ada tanda titik, spasi, atau strip agar bisa dibaca sistem Dapodik.',
    params: [
      { name: 'teks', description: 'Sel teks asal yang ingin dimodifikasi (misal: A2).', required: true },
      { name: 'teks_lama', description: 'Karakter yang ingin dibuang / diganti (misal: "-" atau ".").', required: true },
      { name: 'teks_baru', description: 'Karakter pengganti (gunakan "" untuk menghapus).', required: true }
    ],
    schoolExample: {
      title: 'Membersihkan Tanda Strip pada NIK KTP Orang Tua',
      description: 'Dapodik mewajibkan NIK berupa 16 digit angka murni tanpa pemisah.',
      headers: ['Format NIK Orang Tua Asal', 'Hasil Rumus Bersih (Dapodik)'],
      rows: [
        ['64.71.01-150585-0001', '6471011505850001'],
        ['64-71-02-200888-0003', '6471022008880003']
      ],
      formulaUsed: '=SUBSTITUTE(SUBSTITUTE(A2; "-"; ""); "."; "")',
      formulaEng: '=SUBSTITUTE(SUBSTITUTE(A2, "-", ""), ".", "")',
      resultExplanation: 'Menghapus tanda titik dan tanda strip sekaligus dari kode NIK.'
    },
    commonErrors: ['Fungsi SUBSTITUTE peka huruf besar-kecil (case sensitive). "sdn" berbeda dengan "SDN".'],
    tips: 'Bisa disarangkan (nested) bertingkat untuk membersihkan beberapa karakter sekaligus.',
    tags: ['bersih data', 'dapodik', 'nik', 'substitute', 'format teks']
  },
  {
    id: 'isnumber-istext',
    name: 'ISNUMBER & ISTEXT',
    category: 'Logika',
    level: 'Dasar',
    syntaxIndo: '=IF(ISNUMBER(A2); "Valid"; "Bukan Angka")',
    syntaxEng: '=IF(ISNUMBER(A2), "Valid", "Not a Number")',
    summary: 'Memeriksa keabsahan isian sel apakah berupa angka murni atau teks huruf.',
    explanation: 'Sering dipakai untuk validasi form pendaftaran siswa SDN 006: memastikan kolom NISN hanya diisi angka, dan kolom Nama Siswa tidak salah diketik nomor telepon.',
    params: [
      { name: 'nilai_atau_sel', description: 'Sel yang ingin diperiksa tipe isinya (misal: B2).', required: true }
    ],
    schoolExample: {
      title: 'Validasi Input Kolom Nilai Ujian',
      description: 'Mendeteksi apakah guru memasukkan nilai angka atau teks keterangan ("Sakit" / "Izin").',
      headers: ['Isian Nilai', 'Rumus Deteksi', 'Kategori Data'],
      rows: [
        ['85', '=ISNUMBER(A2)', 'Angka Nilai (Bisa Dihitung)'],
        ['Sakit', '=ISNUMBER(A3)', 'Keterangan Teks (Non-Angka)']
      ],
      formulaUsed: '=IF(ISNUMBER(A2); "Angka Nilai"; "Keterangan Khusus")',
      formulaEng: '=IF(ISNUMBER(A2), "Angka Nilai", "Keterangan Khusus")',
      resultExplanation: 'Menghasilkan TRUE jika sel berisi angka dan FALSE jika teks atau simbol.'
    },
    commonErrors: ['Angka yang diformat sebagai teks (diawali tanda kutip satu \'85) akan dianggap FALSE oleh ISNUMBER.'],
    tips: 'Gunakan VALUE(A2) untuk mengubah angka bertipe teks menjadi angka numerik murni.',
    tags: ['validasi', 'isnumber', 'istext', 'tipe data', 'audit form']
  },
  {
    id: 'edate-eomonth',
    name: 'EDATE & EOMONTH',
    category: 'Tanggal & Waktu',
    level: 'Menengah',
    syntaxIndo: '=EDATE(tanggal_mulai; bulan) atau =EOMONTH(tanggal_mulai; bulan)',
    syntaxEng: '=EDATE(start_date, months) or =EOMONTH(start_date, months)',
    summary: 'Menentukan tanggal jatuh tempo iuran bulanan dan batas akhir laporan SPJ BOS setiap akhir bulan.',
    explanation: 'EOMONTH (End of Month) otomatis menghasilkan tanggal terakhir di suatu bulan (28/29 Februari, 30 April, 31 Desember) yang krusial untuk tanggal tutup buku BKU BOS SDN 006.',
    params: [
      { name: 'tanggal_mulai', description: 'Tanggal referensi (misal: B2 atau TODAY()).', required: true },
      { name: 'bulan', description: 'Jumlah bulan ke depan (angka positif misal 1) atau ke belakang (angka negatif misal -1). Angka 0 untuk bulan ini.', required: true }
    ],
    schoolExample: {
      title: 'Tanggal Tutup Buku SPJ BOS Akhir Bulan',
      description: 'Menetapkan otomatis tanggal tutup buku kas umum pada hari terakhir bulan berjalan.',
      headers: ['Tanggal Transaksi', 'Rumus EOMONTH', 'Tanggal Tutup Buku SPJ'],
      rows: [
        ['15/02/2026', '=EOMONTH(A2; 0)', '28/02/2026'],
        ['10/04/2026', '=EOMONTH(A3; 0)', '30/04/2026'],
        ['05/10/2026', '=EOMONTH(A4; 0)', '31/10/2026']
      ],
      formulaUsed: '=EOMONTH(A2; 0)',
      formulaEng: '=EOMONTH(A2, 0)',
      resultExplanation: 'Menghitung tanggal hari terakhir di bulan yang sama dengan sel A2.'
    },
    commonErrors: ['Hasil rumus menampilkan angka 46083: ini adalah serial number tanggal Excel. Cukup ganti format sel menjadi "Short Date" (Ctrl + 1).'],
    tips: 'Gunakan =EOMONTH(TODAY(); 0) untuk selalu mendapatkan tanggal penutupan bulan ini secara dinamis.',
    tags: ['eomonth', 'edate', 'spj bos', 'tutup buku', 'jatuh tempo']
  },
  {
    id: 'workday-intl',
    name: 'WORKDAY & WORKDAY.INTL',
    category: 'Tanggal & Waktu',
    level: 'Menengah',
    syntaxIndo: '=WORKDAY.INTL(tanggal_mulai; jumlah_hari; [akhir_pekan]; [hari_libur])',
    syntaxEng: '=WORKDAY.INTL(start_date, days, [weekend], [holidays])',
    summary: 'Menghitung batas tanggal pengumpulan tugas atau koreksi ujian setelah N hari kerja efektif.',
    explanation: 'Memudahkan kepala sekolah SDN 006 menetapkan tenggat waktu pengumpulan nilai rapor oleh guru (misal: 7 hari kerja setelah ujian akhir semester, otomatis mengabaikan hari Sabtu/Minggu dan libur nasional).',
    params: [
      { name: 'tanggal_mulai', description: 'Tanggal dimulainya kegiatan (misal sel C2).', required: true },
      { name: 'jumlah_hari', description: 'Berapa hari kerja yang diberikan (misal: 7).', required: true },
      { name: 'akhir_pekan', description: 'Kode akhir pekan: 1 untuk Sabtu-Minggu, 11 untuk hanya hari Minggu.', required: false },
      { name: 'hari_libur', description: 'Rentang sel daftar tanggal merah / libur bersama.', required: false }
    ],
    schoolExample: {
      title: 'Batas Pengumpulan Nilai Rapor Ujian',
      description: 'Ujian selesai tanggal 10 Desember 2026. Guru diberi waktu 5 hari kerja efektif.',
      headers: ['Tanggal Selesai Ujian', 'Waktu Diberikan', 'Batas Akhir Pengumpulan'],
      rows: [
        ['10/12/2026 (Kamis)', '5 Hari Kerja', '17/12/2026 (Kamis)']
      ],
      formulaUsed: '=WORKDAY.INTL(A2; 5; 1; $K$1:$K$5)',
      formulaEng: '=WORKDAY.INTL(A2, 5, 1, $K$1:$K$5)',
      resultExplanation: 'Menghitung 5 hari kerja ke depan dengan melewati hari Sabtu, Minggu, dan tanggal merah yang terdaftar.'
    },
    commonErrors: ['Lupa memberi tanda absolut $ pada rentang hari libur.'],
    tips: 'Jika sekolah menerapkan 6 hari kerja (Sabtu masuk), gunakan kode akhir pekan 11 (hanya Minggu libur).',
    tags: ['workday', 'hari kerja', 'deadline', 'jadwal ujian', 'kalender akademik']
  },
  {
    id: 'maxifs-minifs',
    name: 'MAXIFS & MINIFS',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=MAXIFS(rentang_nilai; rentang_syarat1; syarat1; ...)',
    syntaxEng: '=MAXIFS(max_range, criteria_range1, criteria1, ...)',
    summary: 'Mencari nilai tertinggi atau terendah dengan kriteria tertentu (misal: Nilai tertinggi khusus kelas 5A atau siswi perempuan).',
    explanation: 'Sangat praktis untuk rekapitulasi data akreditasi sekolah saat kepala sekolah ingin mengetahui siswa peraih nilai matematika tertinggi di masing-masing rombel secara terpisah.',
    params: [
      { name: 'rentang_nilai', description: 'Kolom angka nilai ujian (misal: D2:D120).', required: true },
      { name: 'rentang_syarat1', description: 'Kolom kelas atau jenis kelamin (misal: B2:B120).', required: true },
      { name: 'syarat1', description: 'Kriteria yang dicari (misal: "5A" atau "L").', required: true }
    ],
    schoolExample: {
      title: 'Mencari Nilai Tertinggi Berdasarkan Kelas',
      description: 'Mencari rekor nilai IPAS tertinggi di kelas 5A dan 5B.',
      headers: ['Kelas', 'Kriteria', 'Nilai Tertinggi Ditemukan'],
      rows: [
        ['Semua Kelas', 'Kelas 5A', 98],
        ['Semua Kelas', 'Kelas 5B', 95]
      ],
      formulaUsed: '=MAXIFS(D2:D80; B2:B80; "5A")',
      formulaEng: '=MAXIFS(D2:D80, B2:B80, "5A")',
      resultExplanation: 'Mengambil angka paling maksimal pada kolom D khusus baris yang kolom B-nya tertulis "5A".'
    },
    commonErrors: ['Susunan parameter MAXIFS terbalik dengan MAX biasa: rentang nilai ditulis pertama kali, baru kriteria.'],
    tips: 'Gunakan MINIFS dengan format yang persis sama untuk mendeteksi nilai terendah di kelas sebagai acuan remedial.',
    tags: ['maxifs', 'minifs', 'nilai tertinggi', 'juara rombel', 'rekap']
  },
  {
    id: 'averageifs-multi',
    name: 'AVERAGEIFS',
    category: 'Statistik & Hitungan',
    level: 'Menengah',
    syntaxIndo: '=AVERAGEIFS(rentang_rata; rentang_syarat1; syarat1; rentang_syarat2; syarat2)',
    syntaxEng: '=AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2)',
    summary: 'Menghitung rata-rata nilai dengan beberapa kriteria sekaligus (misal: rata-rata nilai matematika siswa Laki-laki di Kelas 5A).',
    explanation: 'Dibutuhkan saat pembuatan laporan analisis ketercapaian kompetensi sekolah per gender dan per kelas untuk evaluasi guru penggerak.',
    params: [
      { name: 'rentang_rata', description: 'Kolom angka yang dirata-rata (misal: F2:F100).', required: true },
      { name: 'rentang_syarat1; syarat1', description: 'Syarat pertama (misal kolom kelas C2:C100 bernilai "5A").', required: true },
      { name: 'rentang_syarat2; syarat2', description: 'Syarat kedua (misal kolom gender D2:D100 bernilai "P").', required: true }
    ],
    schoolExample: {
      title: 'Rata-rata Nilai Siswi Perempuan Kelas 5A',
      description: 'Mengetahui capaian rata-rata siswi perempuan kelas 5A pada asesmen sumatif.',
      headers: ['Kelas', 'Gender', 'Target Analisis', 'Rata-rata Dihitung'],
      rows: [
        ['5A', 'P (Perempuan)', 'Rata-rata Nilai', 88.4]
      ],
      formulaUsed: '=AVERAGEIFS(E2:E40; B2:B40; "5A"; C2:C40; "P")',
      formulaEng: '=AVERAGEIFS(E2:E40, B2:B40, "5A", C2:C40, "P")',
      resultExplanation: 'Menghitung nilai rata-rata kolom E hanya untuk murid kelas 5A yang berjenis kelamin P.'
    },
    commonErrors: ['Error #DIV/0! jika tidak ada satu pun baris data yang memenuhi kedua kriteria tersebut.'],
    tips: 'Selalu bungkus dengan IFERROR: =IFERROR(AVERAGEIFS(...); 0) agar lembar cetak rapor tetap bersih.',
    tags: ['averageifs', 'rata-rata ganda', 'analisis nilai', 'gender', 'rombel']
  },
  {
    id: 'countblank-audit',
    name: 'COUNTBLANK',
    category: 'Statistik & Hitungan',
    level: 'Dasar',
    syntaxIndo: '=COUNTBLANK(rentang_sel)',
    syntaxEng: '=COUNTBLANK(range)',
    summary: 'Mendeteksi dan menghitung jumlah sel yang masih kosong (belum diisi nilai atau biodata).',
    explanation: 'Alat kontrol kualitas bagi wali kelas sebelum mencetak rapor: memastikan tidak ada siswa yang nilai ujiannya terlewat atau belum diinput.',
    params: [
      { name: 'rentang_sel', description: 'Rentang nilai yang dicek (misal: E2:E35).', required: true }
    ],
    schoolExample: {
      title: 'Pemeriksaan Sel Kosong Input Nilai Rapor',
      description: 'Memastikan 35 siswa seluruhnya telah memiliki nilai sebelum rapor dicetak.',
      headers: ['Kolom Diperiksa', 'Rumus Kontrol', 'Keterangan Audit'],
      rows: [
        ['Nilai Sumatif IPAS', '=COUNTBLANK(E2:E36)', '0 (Lengkap - Siap Cetak!)'],
        ['Nomor WhatsApp Wali', '=COUNTBLANK(H2:H36)', '3 Siswa Belum Mengisi']
      ],
      formulaUsed: '=IF(COUNTBLANK(E2:E36)=0; "Lengkap Siap Cetak"; "Ada " & COUNTBLANK(E2:E36) & " Nilai Belum Terisi!")',
      formulaEng: '=IF(COUNTBLANK(E2:E36)=0, "Lengkap Siap Cetak", "Ada " & COUNTBLANK(E2:E36) & " Nilai Belum Terisi!")',
      resultExplanation: 'Jika COUNTBLANK bernilai 0 maka data lengkap, jika > 0 memberi peringatan jumlah data yang kosong.'
    },
    commonErrors: ['Sel yang berisi spasi " " tidak dianggap kosong oleh COUNTBLANK. Gunakan TRIM jika ragu.'],
    tips: 'Pasang rumus ini di bagian atas leger sebagai lampu indikator kesiapan cetak rapor.',
    tags: ['countblank', 'cek kosong', 'audit nilai', 'rapor', 'kontrol']
  },
  {
    id: 'exact-validate',
    name: 'EXACT',
    category: 'Teks',
    level: 'Menengah',
    syntaxIndo: '=EXACT(teks1; teks2)',
    syntaxEng: '=EXACT(text1, text2)',
    summary: 'Memeriksa kesamaan dua teks secara presisi peka huruf besar-kecil (Case Sensitive).',
    explanation: 'Berbeda dengan operator sama dengan (=), rumus EXACT membedakan huruf besar dan kecil, sangat berguna untuk verifikasi kode token ujian siswa atau nomor ijazah nasional.',
    params: [
      { name: 'teks1', description: 'Teks atau sel pertama (misal: A2).', required: true },
      { name: 'teks2', description: 'Teks atau sel kedua pembanding (misal: B2).', required: true }
    ],
    schoolExample: {
      title: 'Verifikasi Token Ujian ANBK Siswa',
      description: 'Token asesmen bersifat sensitif huruf kapital (misal: "SDN06-SMART").',
      headers: ['Token Kunci', 'Token Diketik Siswa', 'Status Validasi'],
      rows: [
        ['SDN06-SMART', 'sdn06-smart', 'Tidak Cocok (Huruf Kecil)'],
        ['SDN06-SMART', 'SDN06-SMART', 'Cocok (Login Berhasil)']
      ],
      formulaUsed: '=IF(EXACT(A2; B2); "Valid"; "Salah Huruf Besar/Kecil!")',
      formulaEng: '=IF(EXACT(A2, B2), "Valid", "Salah Huruf Besar/Kecil!")',
      resultExplanation: 'Menghasilkan TRUE hanya jika kedua teks sama persis hingga ke kapitalisasi hurufnya.'
    },
    commonErrors: ['Memakai rumus biasa =A2=B2 yang di Excel menganggap "andi" sama dengan "ANDI".'],
    tips: 'Gunakan EXACT saat mencocokkan password atau kode aktivasi aplikasi rapor.',
    tags: ['exact', 'case sensitive', 'token ujian', 'validasi', 'anbk']
  },
  {
    id: 'transpose-data',
    name: 'TRANSPOSE',
    category: 'Pencarian',
    level: 'Menengah',
    syntaxIndo: '=TRANSPOSE(rentang_tabel)',
    syntaxEng: '=TRANSPOSE(array)',
    summary: 'Memutar orientasi tabel: mengubah baris menjadi kolom, atau kolom menjadi baris secara dinamis.',
    explanation: 'Memudahkan tata usaha saat menyalin daftar 12 mata pelajaran yang aslinya tersusun ke bawah di buku kurikulum menjadi judul kolom horizontal ke samping di lembar leger rapor.',
    params: [
      { name: 'rentang_tabel', description: 'Tabel yang ingin diputar orientasinya (misal: A1:A12).', required: true }
    ],
    schoolExample: {
      title: 'Mengubah Daftar Mapel Vertikal Menjadi Header Horizontal',
      description: 'Daftar mata pelajaran tersusun vertikal di A1:A10 diputar jadi judul kolom C1:L1.',
      headers: ['Daftar Vertikal Asal', 'Hasil Transpose Horizontal'],
      rows: [
        ['Pendidikan Pancasila', 'Pendidikan Pancasila | B. Indonesia | Matematika | IPAS | PJOK']
      ],
      formulaUsed: '=TRANSPOSE(A1:A5)',
      formulaEng: '=TRANSPOSE(A1:A5)',
      resultExplanation: 'Memutar rentang vertikal 5 baris x 1 kolom menjadi 1 baris x 5 kolom secara dinamis.'
    },
    commonErrors: ['Error #SPILL! jika area kanan tabel terhalang tulisan lain.'],
    tips: 'Di Excel modern, cukup ketik rumus di satu sel dan tekan Enter tanpa perlu menekan Ctrl+Shift+Enter.',
    tags: ['transpose', 'putar tabel', 'baris jadi kolom', 'header rapor']
  },
  {
    id: 'pmt-angsuran',
    name: 'PMT',
    category: 'Administrasi Sekolah',
    level: 'Menengah',
    syntaxIndo: '=PMT(bunga_per_bulan; total_bulan; -jumlah_pinjaman)',
    syntaxEng: '=PMT(rate, nper, pv, [fv], [type])',
    summary: 'Menghitung cicilan angsuran bulanan pinjaman Koperasi Guru & Karyawan SDN 006.',
    explanation: 'Pengurus Koperasi Sekolah SDN 006 dapat menentukan potongan gaji bulanan guru untuk pinjaman barang elektronik atau dana pendidikan secara transparan.',
    params: [
      { name: 'bunga_per_bulan', description: 'Suku bunga per bulan (misal 1% atau 0.01).', required: true },
      { name: 'total_bulan', description: 'Jangka waktu cicilan dalam bulan (misal: 12 atau 24).', required: true },
      { name: 'jumlah_pinjaman', description: 'Nominal pinjaman (berikan tanda minus - agar hasil cicilan bernilai positif).', required: true }
    ],
    schoolExample: {
      title: 'Simulasi Pinjaman Koperasi Guru SDN 006',
      description: 'Pinjaman Rp 10.000.000 dicicil selama 12 bulan dengan bunga koperasi 0.8% per bulan flat.',
      headers: ['Pinjaman Pokok', 'Bulan Tenor', 'Bunga / Bln', 'Angsuran / Bln'],
      rows: [
        ['Rp 10.000.000', '12 Bulan', '0.8%', 'Rp 876.835']
      ],
      formulaUsed: '=ROUND(PMT(0.008; 12; -10000000); 0)',
      formulaEng: '=ROUND(PMT(0.008, 12, -10000000), 0)',
      resultExplanation: 'Menghitung angsuran tetap bulanan pinjaman pokok 10 juta dengan tenor 12 bulan.'
    },
    commonErrors: ['Lupa tanda minus (-) pada pokok pinjaman sehingga hasil cicilan menjadi angka minus bertanda kurung (merah).'],
    tips: 'Gunakan fungsi ROUND untuk membulatkan angka cicilan ke ribuan terdekat.',
    tags: ['koperasi guru', 'angsuran', 'pinjaman', 'keuangan sekolah', 'pmt']
  },
  {
    id: 'switch-lookup',
    name: 'SWITCH',
    category: 'Logika',
    level: 'Menengah',
    syntaxIndo: '=SWITCH(nilai_uji; nilai1; hasil1; nilai2; hasil2; ...; hasil_default)',
    syntaxEng: '=SWITCH(expression, val1, result1, [val2, result2], ..., [default])',
    summary: 'Mengubah kode rombel, kode guru, atau hari menjadi nama lengkap tanpa IF bertingkat.',
    explanation: 'Sintaksnya jauh lebih rapi dibanding IF bertingkat. Cukup masukkan sel kode satu kali, lalu daftarkan pasangan kode dan nama lengkapnya.',
    params: [
      { name: 'nilai_uji', description: 'Sel kode yang diuji (misal kode hari atau kode rombel di sel B2).', required: true },
      { name: 'nilai1; hasil1', description: 'Jika bernilai 1 hasilnya "Senin", jika 2 hasilnya "Selasa", dst.', required: true }
    ],
    schoolExample: {
      title: 'Konversi Kode Rombel Menjadi Nama Wali Kelas',
      description: 'Mengubah kode "5A", "5B", "5C" menjadi nama wali kelas SDN 006.',
      headers: ['Kode Rombel', 'Rumus SWITCH', 'Nama Wali Kelas'],
      rows: [
        ['5A', '=SWITCH(A2; "5A"; "Ibu Siti Rohana, S.Pd"; ...)', 'Ibu Siti Rohana, S.Pd'],
        ['5B', '=SWITCH(A3; ...)', 'Pak Ahmad Zaelani, S.Pd']
      ],
      formulaUsed: '=SWITCH(A2; "5A"; "Ibu Siti Rohana"; "5B"; "Pak Zaelani"; "5C"; "Ibu Nur Halimah"; "Guru Lain")',
      formulaEng: '=SWITCH(A2, "5A", "Ibu Siti Rohana", "5B", "Pak Zaelani", "5C", "Ibu Nur Halimah", "Guru Lain")',
      resultExplanation: 'Mencocokkan kode di sel A2 dan langsung menghasilkan nama wali kelas yang sesuai.'
    },
    commonErrors: ['Lupa memberikan nilai default di akhir parameter sehingga menghasilkan error #N/A jika kode tidak cocok.'],
    tips: 'Gunakan SWITCH untuk mengganti rumus WEEKDAY(TODAY()) menjadi nama hari bahasa Indonesia (1="Minggu", 2="Senin", dst).',
    tags: ['switch', 'logika', 'kode rombel', 'wali kelas', 'pengganti if']
  }
];

export const INITIAL_TEMPLATES: SchoolTemplate[] = [
  {
    id: 'tpl-rapor-merdeka',
    title: 'Template Leger & Rekap Nilai Rapor Kurikulum Merdeka SDN 006',
    category: 'Akademik & Nilai',
    description: 'Format otomatis perhitungan Nilai Akhir (NA), Predikat Capaian Pembelajaran, Keterangan KKTP, serta Ranking Kelas otomatis.',
    targetClass: 'Kelas 1 - Kelas 6 (Wali Kelas)',
    rowCount: 35,
    columnCount: 12,
    downloadsCount: 142,
    lastUpdated: '08 Oktober 2026',
    tags: ['kurikulum merdeka', 'rapor', 'kktp', 'ranking', 'nilai'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'L/P', 'Formatif 1', 'Formatif 2', 'Sumatif Lingkup', 'Sumatif Akhir', 'Nilai Akhir', 'Predikat', 'Status KKTP', 'Peringkat'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 'L', 85, 88, 90, 86, 87.25, 'Baik', 'Tuntas', 3],
      [2, '00145292', 'Annisa Zahra', 'P', 95, 92, 94, 98, 94.75, 'Sangat Baik', 'Tuntas', 1],
      [3, '00145293', 'Bayu Nugroho', 'L', 72, 70, 75, 71, 72.00, 'Cukup', 'Remedial', 5],
      [4, '00145294', 'Citra Kirana', 'P', 88, 90, 92, 90, 90.00, 'Sangat Baik', 'Tuntas', 2],
      [5, '00145295', 'Dimas Setiawan', 'L', 78, 80, 82, 80, 80.00, 'Baik', 'Tuntas', 4]
    ],
    keyFormulas: [
      'Nilai Akhir: =AVERAGE(E2:H2)',
      'Predikat: =IFS(I2>=90; "Sangat Baik"; I2>=80; "Baik"; I2>=75; "Cukup"; TRUE; "Perlu Bimbingan")',
      'Status: =IF(I2>=75; "Tuntas"; "Remedial")',
      'Ranking: =RANK.EQ(I2; $I$2:$I$36; 0)'
    ]
  },
  {
    id: 'tpl-absensi-bulanan',
    title: 'Format Rekapitulasi Presensi Kehadiran Siswa SDN 006',
    category: 'Kesiswaan & Absensi',
    description: 'Format rekap bulanan tanggal 1-31 dengan rumus otomatis penghitung Sakit, Izin, Alpha, Total Hadir, dan Persentase Kehadiran bulanan.',
    targetClass: 'Semua Rombel (1A - 6B)',
    rowCount: 38,
    columnCount: 38,
    downloadsCount: 189,
    lastUpdated: '01 Oktober 2026',
    tags: ['absensi', 'kehadiran', 'sakit', 'izin', 'alpha', 'persentase'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'L/P', 'Tgl 1', 'Tgl 2', 'Tgl 3', 'Tgl 4', 'Tgl 5', 'Hadir (H)', 'Sakit (S)', 'Izin (I)', 'Alpha (A)', '% Hadir'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 'L', 'H', 'H', 'H', 'S', 'H', 24, 1, 0, 0, '96%'],
      [2, '00145292', 'Annisa Zahra', 'P', 'H', 'H', 'H', 'H', 'H', 25, 0, 0, 0, '100%'],
      [3, '00145293', 'Bayu Nugroho', 'L', 'H', 'I', 'H', 'H', 'A', 22, 0, 2, 1, '88%'],
      [4, '00145294', 'Citra Kirana', 'P', 'H', 'H', 'H', 'H', 'H', 25, 0, 0, 0, '100%']
    ],
    keyFormulas: [
      'Hitung Sakit: =COUNTIF(E2:AI2; "S")',
      'Hitung Izin: =COUNTIF(E2:AI2; "I")',
      'Hitung Alpha: =COUNTIF(E2:AI2; "A")',
      'Persentase: =ROUND((J2/25)*100; 1) & "%"'
    ]
  },
  {
    id: 'tpl-bku-dana-bos',
    title: 'Buku Kas Umum (BKU) & SPJ Dana BOS Reguler SDN 006',
    category: 'Keuangan & BOS',
    description: 'Format pembukuan kas BOS dengan otomatisasi saldo berjalan, rekap per pos belanja (Komponen ARKAS), dan verifikasi selisih kas.',
    targetClass: 'Bendahara BOS & Kepala Sekolah',
    rowCount: 50,
    columnCount: 9,
    downloadsCount: 215,
    lastUpdated: '05 Oktober 2026',
    tags: ['bos', 'bku', 'spj', 'bendahara', 'arkas', 'kas umum'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Tanggal', 'No Bukti', 'Uraian Transaksi', 'Kategori Pos', 'Penerimaan (Rp)', 'Pengeluaran (Rp)', 'Saldo Kas (Rp)', 'Status Verifikasi'],
    sampleRows: [
      [1, '01/10/2026', 'BOS-01', 'Penyaluran Dana BOS Tahap 2', 'Penerimaan', 45000000, 0, 45000000, 'Valid'],
      [2, '03/10/2026', 'BOS-02', 'Belanja ATK Ujian Tengah Semester', 'Pengembangan Perpustakaan/ATK', 0, 1850000, 43150000, 'Valid'],
      [3, '08/10/2026', 'BOS-03', 'Langganan Internet Indihome Sekolah', 'Daya dan Jasa', 0, 750000, 42400000, 'Valid'],
      [4, '12/10/2026', 'BOS-04', 'Honor GTT & PTT Bulan Oktober', 'Pembayaran Honor', 0, 6500000, 35900000, 'Valid']
    ],
    keyFormulas: [
      'Saldo Berjalan: =H1+F2-G2',
      'Total Belanja ATK: =SUMIF(E2:E50; "Pengembangan Perpustakaan/ATK"; G2:G50)',
      'Total Honorarium: =SUMIF(E2:E50; "Pembayaran Honor"; G2:G50)'
    ]
  },
  {
    id: 'tpl-inventaris-sarpras',
    title: 'Kartu Inventaris Barang (KIB) & Aset Sekolah SDN 006',
    category: 'Sarpras & Inventaris',
    description: 'Format pendataan sarana prasarana sekolah, meja kursi, komputer chromebook, proyektor dengan kondisi Baik, Rusak Ringan, Rusak Berat.',
    targetClass: 'Pengurus Barang & Sarpras',
    rowCount: 45,
    columnCount: 10,
    downloadsCount: 88,
    lastUpdated: '28 September 2026',
    tags: ['sarpras', 'aset', 'kib', 'chromebook', 'inventaris'],
    status: 'Aktif',
    sampleHeaders: ['Kode Barang', 'Nama Aset', 'Merk/Tipe', 'Tahun Pengadaan', 'Sumber Dana', 'Jumlah Unit', 'Kondisi Baik', 'Rusak Ringan', 'Rusak Berat', 'Lokasi Ruang'],
    sampleRows: [
      ['INV-001', 'Chromebook Google', 'Acer C733', 2023, 'BOS Kinerja', 30, 28, 2, 0, 'Lab Komputer'],
      ['INV-002', 'Proyektor InFocus', 'Epson EB-X400', 2022, 'BOS Reguler', 6, 5, 1, 0, 'Ruang Multimedia'],
      ['INV-003', 'Meja Kursi Siswa', 'Kayu Jati Kombinasi', 2021, 'DAK Fisik', 180, 165, 12, 3, 'Kelas 1-6']
    ],
    keyFormulas: [
      'Total Rusak: =H2+I2',
      'Persentase Layak Pakai: =ROUND((G2/F2)*100; 1) & "%"'
    ]
  },
  {
    id: 'tpl-slip-honor-ptk',
    title: 'Rekapitulasi & Cetak Slip Gaji Honor Pendidik GTT/PTT SDN 006',
    category: 'Kepegawaian',
    description: 'Perhitungan honor jam mengajar, tunjangan tugas tambahan (Wali Kelas, Pembina Pramuka), potongan iuran, dan nominal bersih siap ditransfer.',
    targetClass: 'Tata Usaha & Kepegawaian',
    rowCount: 20,
    columnCount: 10,
    downloadsCount: 112,
    lastUpdated: '30 September 2026',
    tags: ['gaji', 'honor guru', 'gtt', 'ptt', 'slip gaji'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Nama Guru/Staf', 'Status PTK', 'Jumlah Jam', 'Tarif per Jam (Rp)', 'Honor Pokok', 'Tunjangan Tambahan', 'Potongan', 'Gaji Bersih (Rp)', 'No Rekening'],
    sampleRows: [
      [1, 'Fitri Handayani, S.Pd', 'GTT', 28, 50000, 1400000, 300000, 50000, 1650000, 'Bank BPD 10293847'],
      [2, 'Rizky Kurniawan, S.Pd', 'GTT', 24, 50000, 1200000, 200000, 50000, 1350000, 'Bank BPD 10293848'],
      [3, 'Joko Sutrisno', 'PTT (Penjaga)', 40, 35000, 1400000, 250000, 25000, 1625000, 'Bank BPD 10293849']
    ],
    keyFormulas: [
      'Honor Pokok: =D2*E2',
      'Gaji Bersih: =F2+G2-H2'
    ]
  },
  {
    id: 'tpl-tabungan-siswa',
    title: 'Buku Tabungan & Uang Kas Kelas Siswa SDN 006',
    category: 'Kesiswaan & Absensi',
    description: 'Format pencatatan setoran dan penarikan tabungan siswa harian dengan rekap saldo otomatis untuk masing-masing siswa.',
    targetClass: 'Wali Kelas 1-6',
    rowCount: 35,
    columnCount: 8,
    downloadsCount: 97,
    lastUpdated: '15 September 2026',
    tags: ['tabungan', 'uang kas', 'wali kelas', 'keuangan siswa'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'Total Setoran (Rp)', 'Total Penarikan (Rp)', 'Saldo Akhir (Rp)', 'Status Tabungan'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 450000, 50000, 400000, 'Aktif'],
      [2, '00145292', 'Annisa Zahra', 620000, 100000, 520000, 'Aktif'],
      [3, '00145293', 'Bayu Nugroho', 310000, 0, 310000, 'Aktif']
    ],
    keyFormulas: [
      'Saldo Akhir: =D2-E2',
      'Total Uang Kelas: =SUM(F2:F36)'
    ]
  },
  {
    id: 'tpl-analisis-soal',
    title: 'Template Analisis Butir Soal Ujian & Daya Pembeda SDN 006',
    category: 'Akademik & Nilai',
    description: 'Format otomatis analisis tingkat kesukaran soal (Mudah, Sedang, Sukar) dan daya pembeda butir soal pilihan ganda ujian sekolah.',
    targetClass: 'Semua Guru Kelas & Mapel (1-6)',
    rowCount: 45,
    columnCount: 15,
    downloadsCount: 136,
    lastUpdated: '10 Oktober 2026',
    tags: ['analisis butir soal', 'daya pembeda', 'evaluasi belajar', 'ujian sekolah'],
    status: 'Aktif',
    sampleHeaders: ['No Soal', 'Kunci', 'Kelompok Atas Benar', 'Kelompok Bawah Benar', 'Tingkat Kesukaran (P)', 'Kategori Soal', 'Daya Pembeda (D)', 'Status Butir Soal'],
    sampleRows: [
      [1, 'A', 15, 12, 0.90, 'Mudah', 0.20, 'Diterima & Direvisi'],
      [2, 'C', 14, 5, 0.63, 'Sedang', 0.60, 'Sangat Baik (Dipakai)'],
      [3, 'B', 8, 2, 0.33, 'Sukar', 0.40, 'Baik (Dipakai)'],
      [4, 'D', 3, 3, 0.20, 'Sangat Sukar', 0.00, 'Dibuang / Diganti']
    ],
    keyFormulas: [
      'Indeks Kesukaran: =ROUND((C2+D2)/30; 2)',
      'Kategori Kesukaran: =IFS(E2>=0.7; "Mudah"; E2>=0.3; "Sedang"; TRUE; "Sukar")',
      'Daya Pembeda: =ROUND((C2-D2)/15; 2)'
    ]
  },
  {
    id: 'tpl-buku-induk',
    title: 'Format Buku Induk Siswa Nasional (NISN & Biodata Lengkap)',
    category: 'Kesiswaan & Absensi',
    description: 'Buku induk digital kearsipan data pribadi siswa, NIK, NISN, nama ayah/ibu, pekerjaan orang tua, alamat, dan riwayat kesehatan.',
    targetClass: 'Tata Usaha & Operator Sekolah',
    rowCount: 50,
    columnCount: 16,
    downloadsCount: 174,
    lastUpdated: '06 Oktober 2026',
    tags: ['buku induk', 'dapodik', 'biodata siswa', 'arsip kesiswaan', 'nik', 'nisn'],
    status: 'Aktif',
    sampleHeaders: ['No Induk', 'NISN', 'Nama Lengkap Siswa', 'L/P', 'Tempat Lahir', 'Tanggal Lahir', 'NIK Siswa', 'Nama Ayah', 'Nama Ibu', 'Pekerjaan Wali', 'Alamat Domisili', 'Status Siswa'],
    sampleRows: [
      ['006/2026/001', '00145291', 'Aditiya Pratama', 'L', 'Jakarta', '15/05/2015', '3171011505150001', 'Bambang Irawan', 'Sri Wahyuni', 'Wiraswasta', 'Jl. Merdeka No. 12', 'Aktif'],
      ['006/2026/002', '00145292', 'Annisa Zahra', 'P', 'Bogor', '20/08/2015', '3171012008150002', 'Hendra Gunawan', 'Dewi Sartika', 'PNS', 'Jl. Kenanga No. 4', 'Aktif'],
      ['006/2026/003', '00145293', 'Bayu Nugroho', 'L', 'Depok', '03/01/2015', '3171010301150003', 'Slamet Riyadi', 'Siti Maryam', 'Karyawan Swasta', 'Jl. Melati No. 8', 'Aktif']
    ],
    keyFormulas: [
      'Format Nama: =PROPER(TRIM(C2))',
      'Validasi NISN: =IF(LEN(B2)=10; "OK"; "Cek Digit!")',
      'Usia Masuk: =DATEDIF(F2; TODAY(); "Y") & " Tahun"'
    ]
  },
  {
    id: 'tpl-jadwal-pelajaran',
    title: 'Jadwal Pelajaran Tematik & Distribusi Jam Mengajar Guru (JJM)',
    category: 'Kepegawaian',
    description: 'Matriks alokasi jadwal pelajaran mingguan Senin s/d Jumat dan perhitungan akumulasi Jam Mengajar Guru (JJM) untuk syarat TPG / Sertifikasi.',
    targetClass: 'Kurikulum & Seluruh Dewan Guru',
    rowCount: 30,
    columnCount: 9,
    downloadsCount: 128,
    lastUpdated: '02 Oktober 2026',
    tags: ['jadwal pelajaran', 'jjm', 'sertifikasi guru', 'tpg', 'beban mengajar'],
    status: 'Aktif',
    sampleHeaders: ['Kode Guru', 'Nama Pendidik', 'NIP / NUPTK', 'Mapel Diampu', 'Kelas', 'Alokasi Jam (JP)', 'Tugas Tambahan', 'Total Jam Mengajar', 'Syarat 24 Jam'],
    sampleRows: [
      ['G-01', 'Hj. Rohana, S.Pd., M.Pd', '197508122005012003', 'Guru Kelas (Tematik)', '5A', 24, 12, 36, 'Memenuhi Syarat (Linier)'],
      ['G-02', 'Ahmad Zaelani, S.Pd', '198203152008011005', 'Pendidikan Jasmani (PJOK)', '1-6', 24, 0, 24, 'Memenuhi Syarat (Linier)'],
      ['G-03', 'Nur Halimah, S.Pd.I', '198906202014022001', 'Pendidikan Agama Islam (PAI)', '1-6', 24, 2, 26, 'Memenuhi Syarat (Linier)']
    ],
    keyFormulas: [
      'Total JJM: =F2+G2',
      'Status Linier: =IF(H2>=24; "Memenuhi Syarat (Linier)"; "Kurang " & (24-H2) & " JP")'
    ]
  },
  {
    id: 'tpl-ekskul-bakat',
    title: 'Buku Rekap Ekstrakurikuler & Penilaian Bakat Minat Siswa',
    category: 'Kesiswaan & Absensi',
    description: 'Pencatatan keikutsertaan kegiatan Pramuka (Wajib), Pencak Silat, Futsal, Tari Tradisional, Drumband, dan nilai kualitatif deskriptif rapor.',
    targetClass: 'Pembina Ekskul & Wali Kelas 1-6',
    rowCount: 35,
    columnCount: 9,
    downloadsCount: 92,
    lastUpdated: '25 September 2026',
    tags: ['ekskul', 'pramuka', 'futsal', 'tari', 'minat bakat', 'rapor'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'Kelas', 'Jenis Ekskul', 'Kehadiran (JP)', '% Hadir', 'Predikat', 'Deskripsi Nilai Rapor'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', '5A', 'Pramuka Penggalang', 28, '93%', 'Sangat Baik', 'Sangat aktif dalam kegiatan tali-temali dan kepemimpinan regu.'],
      [2, '00145292', 'Annisa Zahra', '5A', 'Tari Tradisional', 30, '100%', 'Sangat Baik', 'Menunjukkan keluwesan dan penguasaan wiraga tarian daerah.'],
      [3, '00145293', 'Bayu Nugroho', '5A', 'Futsal Sekolah', 24, '80%', 'Baik', 'Aktif bekerjasama dalam tim dan memiliki sportivitas tinggi.']
    ],
    keyFormulas: [
      'Persentase: =ROUND((F2/30)*100; 0) & "%"',
      'Predikat: =IF(F2>=27; "Sangat Baik"; IF(F2>=21; "Baik"; "Cukup"))'
    ]
  },
  {
    id: 'tpl-penilaian-p5',
    title: 'Format Lembar Penilaian Projek Profil Pelajar Pancasila (P5)',
    category: 'Akademik & Nilai',
    description: 'Rubrik penilaian 6 Dimensi Profil Pancasila (Beriman, Mandiri, Gotong Royong, Berkebinekaan, Bernalar Kritis, Kreatif) Kurikulum Merdeka.',
    targetClass: 'Fasilitator P5 & Guru Kelas',
    rowCount: 35,
    columnCount: 11,
    downloadsCount: 165,
    lastUpdated: '04 Oktober 2026',
    tags: ['p5', 'kurikulum merdeka', 'profil pelajar pancasila', 'dimensi p5', 'rubrik'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Nama Siswa', 'Tema Projek', 'Gotong Royong', 'Bernalar Kritis', 'Kreatif', 'Kemandirian', 'Capaian Akhir', 'Catatan Proses'],
    sampleRows: [
      [1, 'Aditiya Pratama', 'Gaya Hidup Berkelanjutan', 'BSH', 'SAB', 'BSH', 'BSH', 'Berkembang Sesuai Harapan (BSH)', 'Mampu memilah sampah plastik dengan mandiri.'],
      [2, 'Annisa Zahra', 'Gaya Hidup Berkelanjutan', 'SAB', 'SAB', 'SAB', 'BSH', 'Sangat Berkembang (SAB)', 'Menciptakan kreasi pot tanaman daur ulang yang sangat inovatif.']
    ],
    keyFormulas: [
      'Predikat P5: =IF(COUNTIF(D2:G2; "SAB")>=2; "Sangat Berkembang (SAB)"; "Berkembang Sesuai Harapan (BSH)")'
    ]
  },
  {
    id: 'tpl-pembantu-pajak-bos',
    title: 'Buku Pembantu Pajak (PPh 21, PPh 22, PPh 23, PPN) Dana BOS',
    category: 'Keuangan & BOS',
    description: 'Format rekapitulasi pungutan dan penyetoran pajak transaksi belanja BOS sekolah ke kas negara (e-Billing) sesuai aturan perpajakan kementerian.',
    targetClass: 'Bendahara BOS & Pengelola Keuangan',
    rowCount: 35,
    columnCount: 10,
    downloadsCount: 118,
    lastUpdated: '09 Oktober 2026',
    tags: ['pajak bos', 'ppn 11%', 'pph 21', 'pph 23', 'ebilling', 'bendahara'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Tanggal', 'No Bukti', 'Uraian Belanja', 'Nilai Belanja (Rp)', 'PPN 11%', 'PPh 21 (Honor)', 'PPh 23 (Jasa)', 'Total Pajak Disetor', 'Kode NTPN / Billing'],
    sampleRows: [
      [1, '05/10/2026', 'BOS-04', 'Pembayaran Honor Narasumber Workshop', 2000000, 0, 100000, 0, 100000, '0293847192837461'],
      [2, '08/10/2026', 'BOS-06', 'Pengadaan Komputer Toko Jaya', 12500000, 1238739, 0, 0, 1238739, '0293847192837462'],
      [3, '11/10/2026', 'BOS-09', 'Jasa Servis & Pemeliharaan Jaringan WiFi', 1500000, 0, 0, 30000, 30000, '0293847192837463']
    ],
    keyFormulas: [
      'Hitung PPN 11%: =ROUND(E2*(11/111); 0)',
      'Total Pajak: =F2+G2+H2',
      'Total Rekap: =SUM(I2:I35)'
    ]
  },
  {
    id: 'tpl-kenaikan-kelas',
    title: 'Format Rekapitulasi Kenaikan Kelas & Kelulusan Siswa Kelas 6',
    category: 'Akademik & Nilai',
    description: 'Format penetapan hasil rapat dewan guru kenaikan kelas 1 s/d 5 dan penetapan kelulusan serta nomor seri ijazah siswa kelas 6 SDN 006.',
    targetClass: 'Wali Kelas & Kepala Sekolah',
    rowCount: 40,
    columnCount: 10,
    downloadsCount: 149,
    lastUpdated: '07 Oktober 2026',
    tags: ['kenaikan kelas', 'kelulusan kelas 6', 'ijazah', 'rapat pleno', 'tuntas'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NIS / NISN', 'Nama Siswa', 'L/P', 'Rata-rata Nilai', 'Nilai Sikap', '% Hadir', 'Keputusan Pleno Guru', 'Melanjutkan Ke / Rombel Baru', 'No Seri Ijazah'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 'L', 87.25, 'A (Baik)', '96%', 'Lulus / Naik Kelas', 'Kelas 6A (Naik)', 'DN-01/D-SD/K13/26/00145291'],
      [2, '00145292', 'Annisa Zahra', 'P', 94.75, 'A (Sangat Baik)', '100%', 'Lulus / Naik Kelas', 'Kelas 6A (Naik)', 'DN-01/D-SD/K13/26/00145292']
    ],
    keyFormulas: [
      'Status Kenaikan: =IF(AND(E2>=75; G2>="85%"); "Naik Kelas"; "Rapat Khusus")',
      'Persentase Kelulusan: =ROUND((COUNTIF(H2:H40; "Lulus / Naik Kelas")/COUNT(A2:A40))*100; 1) & "%"'
    ]
  },
  {
    id: 'tpl-perpustakaan-buku',
    title: 'Daftar Inventaris & Sirkulasi Peminjaman Buku Perpustakaan SDN 006',
    category: 'Sarpras & Inventaris',
    description: 'Pendataan koleksi buku paket Kurikulum Merdeka, buku pengayaan referensi, dan sirkulasi peminjaman siswa dengan tanggal pengembalian otomatis.',
    targetClass: 'Pengelola Perpustakaan & Guru Kelas',
    rowCount: 50,
    columnCount: 9,
    downloadsCount: 84,
    lastUpdated: '22 September 2026',
    tags: ['perpustakaan', 'buku paket', 'peminjaman buku', 'literasi', 'sarpras'],
    status: 'Aktif',
    sampleHeaders: ['Kode Buku', 'Judul Buku', 'Pengarang / Penerbit', 'Jumlah Total', 'Dipinjam', 'Tersedia', 'Peminjam Terakhir', 'Tgl Kembali', 'Status Denda'],
    sampleRows: [
      ['B-KUR-01', 'Buku Siswa IPAS Kelas 5', 'Kemdikbudristek', 65, 32, 33, 'Aditiya Pratama (5A)', '18/10/2026', 'Tepat Waktu'],
      ['B-KUR-02', 'Buku Siswa Matematika Kelas 5', 'Kemdikbudristek', 65, 30, 35, 'Bilqis Humaira (5A)', '19/10/2026', 'Tepat Waktu'],
      ['B-REF-03', 'Ensiklopedi Sains Anak', 'Erlangga for Kids', 5, 2, 3, 'Citra Kirana (5A)', '15/10/2026', 'Terlambat 2 Hari']
    ],
    keyFormulas: [
      'Buku Tersedia: =D2-E2',
      'Status Keterlambatan: =IF(TODAY()>H2; "Terlambat " & (TODAY()-H2) & " Hari"; "Tepat Waktu")'
    ]
  },
  {
    id: 'tpl-rekap-spp-iuran',
    title: 'Format Rekapitulasi Tabungan Siswa & Iuran Paguyuban Kelas SDN 006',
    category: 'Keuangan & BOS',
    description: 'Format pencatatan setoran tabungan mingguan siswa dan iuran kas paguyuban orang tua murid dengan rekap saldo otomatis per siswa.',
    targetClass: 'Bendahara Paguyuban & Wali Kelas 1-6',
    rowCount: 38,
    columnCount: 10,
    downloadsCount: 153,
    lastUpdated: '11 Oktober 2026',
    tags: ['tabungan siswa', 'paguyuban kelas', 'iuran kas', 'saldo otomatis', 'keuangan'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'L/P', 'Saldo Awal', 'Setoran Bln Ini', 'Penarikan', 'Saldo Akhir', 'Status Tabungan', 'Tanda Tangan'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 'L', 150000, 50000, 0, 200000, 'Aktif', 'V'],
      [2, '00145292', 'Annisa Zahra', 'P', 200000, 100000, 50000, 250000, 'Aktif', 'V'],
      [3, '00145293', 'Bayu Nugroho', 'L', 100000, 25000, 0, 125000, 'Aktif', 'V'],
      [4, '00145294', 'Citra Kirana', 'P', 300000, 50000, 0, 350000, 'Aktif', 'V']
    ],
    keyFormulas: [
      'Saldo Akhir: =E2+F2-G2',
      'Total Kas Kelas: =SUM(H2:H38)',
      'Rata-rata Saldo: =AVERAGE(H2:H38)'
    ]
  },
  {
    id: 'tpl-kartu-stok-bos',
    title: 'Kartu Kendali Persediaan & Stok Opname ATK Dana BOS SDN 006',
    category: 'Sarpras & Inventaris',
    description: 'Pencatatan mutasi barang habis pakai (kertas HVS, spidol boardmarker, tinta printer, map rapor) dengan peringatan stok kritis otomatis.',
    targetClass: 'Pengurus Barang & Tim BOS',
    rowCount: 40,
    columnCount: 11,
    downloadsCount: 141,
    lastUpdated: '09 Oktober 2026',
    tags: ['kartu stok', 'persediaan atk', 'stok opname', 'dana bos', 'barang habis pakai'],
    status: 'Aktif',
    sampleHeaders: ['Kode Barang', 'Nama Barang', 'Satuan', 'Stok Awal', 'Penerimaan', 'Pengeluaran', 'Sisa Stok', 'Batas Minimum', 'Status Pengadaan', 'Harga Satuan (Rp)', 'Total Nilai Aset'],
    sampleRows: [
      ['ATK-01', 'Kertas HVS A4 75gr Sinar Dunia', 'Rim', 20, 50, 45, 25, 10, 'Aman', 55000, 1375000],
      ['ATK-02', 'Spidol Whiteboard Snowman Hitam', 'Lusin', 5, 10, 12, 3, 5, 'Perlu Beli!', 85000, 255000],
      ['ATK-03', 'Tinta Printer Epson 003 Black', 'Botol', 2, 8, 8, 2, 3, 'Perlu Beli!', 95000, 190000],
      ['ATK-04', 'Stopmap Kertas Folio Merah', 'Pack', 10, 15, 20, 5, 5, 'Batas Minimal', 35000, 175000]
    ],
    keyFormulas: [
      'Sisa Stok: =D2+E2-F2',
      'Status Pengadaan: =IF(G2<=H2; "Perlu Beli!"; "Aman")',
      'Total Nilai: =G2*J2',
      'Total Aset ATK: =SUM(K2:K40)'
    ]
  },
  {
    id: 'tpl-evaluasi-kinerja-guru',
    title: 'Format Sasaran Kinerja Pegawai (SKP) & Penilaian Kinerja Guru (PKG)',
    category: 'Kepegawaian',
    description: 'Format instrumen observasi kelas kinerja guru, evaluasi indikator capaian belajar siswa, dan konversi predikat kinerja PMM (Platform Merdeka Mengajar).',
    targetClass: 'Kepala Sekolah & Guru ASN/PPPK',
    rowCount: 30,
    columnCount: 9,
    downloadsCount: 168,
    lastUpdated: '10 Oktober 2026',
    tags: ['skp', 'pkg', 'pmm', 'kinerja guru', 'observasi kelas', 'asn pppk'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NIP Pegawai', 'Nama Guru', 'Jabatan', 'Target Kinerja', 'Skor Observasi (1-100)', 'Capaian Perilaku', 'Predikat Kinerja', 'Keterangan TPP/Insentif'],
    sampleRows: [
      [1, '197508122005012003', 'Hj. Rohana, S.Pd., M.Pd', 'Guru Ahli Madya', 'Sangat Baik', 92, 'Sesuai Ekspektasi', 'Sangat Baik', 'Memenuhi Syarat 100%'],
      [2, '198203152008011005', 'Ahmad Zaelani, S.Pd', 'Guru Ahli Muda', 'Baik', 84, 'Sesuai Ekspektasi', 'Baik', 'Memenuhi Syarat 100%'],
      [3, '198906202014022001', 'Nur Halimah, S.Pd.I', 'Guru Ahli Pertama', 'Baik', 86, 'Sesuai Ekspektasi', 'Baik', 'Memenuhi Syarat 100%']
    ],
    keyFormulas: [
      'Predikat: =IFS(F2>=90; "Sangat Baik"; F2>=75; "Baik"; F2>=60; "Cukup"; TRUE; "Kurang")',
      'Syarat Insentif: =IF(F2>=75; "Memenuhi Syarat 100%"; "Perlu Bimbingan")'
    ]
  },
  {
    id: 'tpl-agenda-surat',
    title: 'Buku Agenda Surat Masuk & Surat Keluar Tata Usaha SDN 006',
    category: 'Kepegawaian',
    description: 'Pencatatan persuratan dinas pendidikan, surat undangan dinas, mutasi siswa, dispensasi, dan nomor surat keluar resmi berurutan otomatis.',
    targetClass: 'Staf Tata Usaha & Urusan Administrasi',
    rowCount: 45,
    columnCount: 9,
    downloadsCount: 112,
    lastUpdated: '05 Oktober 2026',
    tags: ['agenda surat', 'surat dinas', 'tata usaha', 'kearsipan', 'nomor surat'],
    status: 'Aktif',
    sampleHeaders: ['No Urut', 'No Surat', 'Tanggal Surat', 'Tanggal Terima', 'Asal / Tujuan Surat', 'Perihal Surat', 'Disposisi Kepala Sekolah', 'Tenggat Tindak Lanjut', 'Status Surat'],
    sampleRows: [
      [1, '421.2/084/Disdik/2026', '02/10/2026', '03/10/2026', 'Dinas Pendidikan Kota', 'Undangan Rakor ANBK 2026', 'Tugaskan Proktor & Teknisi', '08/10/2026', 'Selesai'],
      [2, '421.1/012/SDN006/X/2026', '05/10/2026', '05/10/2026', 'Orang Tua Siswa Kelas 5', 'Pemberitahuan Asesmen Bakat', 'Arsipkan & Bagikan', '12/10/2026', 'Proses']
    ],
    keyFormulas: [
      'Sisa Hari: =DATEDIF(TODAY(); H2; "D") & " Hari"',
      'Status Tindak Lanjut: =IF(TODAY()>H2; "Jatuh Tempo!"; "Dalam Proses")'
    ]
  },
  {
    id: 'tpl-denah-ujian',
    title: 'Format Denah Ruang & Daftar Hadir Pengawas Asesmen ANBK / Ujian',
    category: 'Akademik & Nilai',
    description: 'Format plotting nomor peserta asesmen per ruang (Ruang 1, 2, 3), jadwal giliran sesi simulasi dan bersih ANBK, serta absensi pengawas ruang.',
    targetClass: 'Panitia ANBK & Asesmen Sekolah',
    rowCount: 30,
    columnCount: 8,
    downloadsCount: 135,
    lastUpdated: '08 Oktober 2026',
    tags: ['anbk', 'denah ruang', 'ujian sekolah', 'daftar hadir pengawas', 'proktor'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Nomor Peserta ANBK', 'Nama Peserta', 'Ruang', 'Sesi Ujian', 'No Komputer (Client)', 'Tanda Tangan Sesi 1', 'Tanda Tangan Sesi 2'],
    sampleRows: [
      [1, 'U-006-001', 'Aditiya Pratama', 'Ruang Lab 1', 'Sesi 1 (07.30 - 09.30)', 'PC-01', 'Hadir', 'Hadir'],
      [2, 'U-006-002', 'Annisa Zahra', 'Ruang Lab 1', 'Sesi 1 (07.30 - 09.30)', 'PC-02', 'Hadir', 'Hadir'],
      [3, 'U-006-003', 'Bayu Nugroho', 'Ruang Lab 1', 'Sesi 1 (07.30 - 09.30)', 'PC-03', 'Hadir', 'Hadir']
    ],
    keyFormulas: [
      'Total Hadir Sesi 1: =COUNTIF(G2:G31; "Hadir")',
      'Persentase Partisipasi: =ROUND((COUNTIF(G2:G31; "Hadir")/30)*100; 0) & "%"'
    ]
  },
  {
    id: 'tpl-rekap-kesehatan-uks',
    title: 'Format Rekapitulasi Skrining Kesehatan, Pengukuran TB/BB & Imunisasi UKS',
    category: 'Kesiswaan & Absensi',
    description: 'Pencatatan berkala Tinggi Badan, Berat Badan, perhitungan IMT (Indeks Massa Tubuh) otomatis, status gizi siswa, dan riwayat imunisasi BIAS.',
    targetClass: 'Pembina UKS & Puskesmas',
    rowCount: 35,
    columnCount: 10,
    downloadsCount: 97,
    lastUpdated: '03 Oktober 2026',
    tags: ['uks', 'skrining kesehatan', 'imt', 'status gizi', 'imunisasi bias', 'berat badan'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'Tinggi (cm)', 'Berat (kg)', 'Nilai IMT', 'Status Gizi', 'Pemeriksaan Gigi', 'Imunisasi MR', 'Catatan Dokter'],
    sampleRows: [
      [1, '00145291', 'Aditiya Pratama', 138, 32, 16.8, 'Gizi Baik (Normal)', 'Sehat', 'Sudah (Lengkap)', 'Pertahankan pola makan sehat.'],
      [2, '00145292', 'Annisa Zahra', 142, 34, 16.9, 'Gizi Baik (Normal)', 'Sehat', 'Sudah (Lengkap)', 'Pertumbuhan fisik sangat baik.'],
      [3, '00145293', 'Bayu Nugroho', 135, 27, 14.8, 'Gizi Baik (Normal)', 'Karies 1 Gigi', 'Sudah (Lengkap)', 'Perlu periksa ke dokter gigi.']
    ],
    keyFormulas: [
      'Hitung IMT: =ROUND(E2/((D2/100)^2); 1)',
      'Status Gizi: =IFS(F2>=25; "Obesitas"; F2>=18.5; "Gizi Lebih"; F2>=14.5; "Gizi Baik (Normal)"; TRUE; "Gizi Kurang")'
    ]
  },
  {
    id: 'tpl-kuitansi-bos',
    title: 'Template Bukti Pembayaran Kuitansi Otomatis Dana BOS SDN 006',
    category: 'Keuangan & BOS',
    description: 'Kuitansi otomatis siap cetak dengan rumus konversi angka menjadi kata-kata (Terbilang rupiah) dan potongan pajak belanja BOS terperinci.',
    targetClass: 'Bendahara BOS & Pengelola Keuangan',
    rowCount: 25,
    columnCount: 9,
    downloadsCount: 178,
    lastUpdated: '11 Oktober 2026',
    tags: ['kuitansi bos', 'bukti kas pengeluaran', 'terbilang', 'bendahara', 'rkas'],
    status: 'Aktif',
    sampleHeaders: ['No Bukti', 'Tahun Anggaran', 'Sudah Terima Dari', 'Jumlah Uang (Rp)', 'Untuk Pembayaran', 'Potongan Pajak PPh (Rp)', 'Jumlah Bersih Diterima', 'Penerima Uang', 'Lunas Dibayar Tanggal'],
    sampleRows: [
      ['BOS-KW-01', '2026', 'Bendahara BOS SDN 006', 1500000, 'Penggandaan Naskah Soal Asesmen Sumatif Rombel 5', 0, 1500000, 'Percetakan Berkah Mandiri', '08/10/2026'],
      ['BOS-KW-02', '2026', 'Bendahara BOS SDN 006', 3000000, 'Honor Narasumber In-House Training Guru', 150000, 2850000, 'Dr. H. Sulaiman, M.Pd', '10/10/2026']
    ],
    keyFormulas: [
      'Jumlah Bersih: =D2-F2',
      'Rekap Kuitansi: =SUM(G2:G26)'
    ]
  },
  {
    id: 'tpl-distribusi-bantuan-pip',
    title: 'Daftar Penyaluran & Rekapitulasi Buku Tabungan PIP Kemdikbud',
    category: 'Kesiswaan & Absensi',
    description: 'Format pemantauan pencairan dana Program Indonesia Pintar (PIP), aktivasi rekening SimPel Bank BRI, dan status penerimaan siswa prasejahtera.',
    targetClass: 'Operator PIP & Kesiswaan',
    rowCount: 40,
    columnCount: 10,
    downloadsCount: 162,
    lastUpdated: '06 Oktober 2026',
    tags: ['pip', 'bantuan siswa', 'bank bri', 'simpel', 'kemdikbud', 'siswa miskin'],
    status: 'Aktif',
    sampleHeaders: ['No', 'NISN', 'Nama Siswa', 'Kelas', 'Nomor Virtual Account', 'Tahap PIP', 'Besaran Dana (Rp)', 'Status Aktivasi Rekening', 'Status Penarikan', 'Keterangan Pemanfaatan'],
    sampleRows: [
      [1, '00145293', 'Bayu Nugroho', '5A', '9880014529300001', 'Tahap 2 / 2026', 450000, 'Sudah Aktivasi', 'Sudah Dicairkan', 'Pembelian Seragam & Sepatu'],
      [2, '00145297', 'Fajar Ramadhan', '5B', '9880014529700001', 'Tahap 2 / 2026', 450000, 'Sudah Aktivasi', 'Belum Dicairkan', 'Buku Tabungan dipegang orang tua']
    ],
    keyFormulas: [
      'Total Dana Disalurkan: =SUM(G2:G40)',
      'Sudah Dicairkan: =COUNTIF(I2:I40; "Sudah Dicairkan") & " Siswa"',
      'Persentase Penyaluran: =ROUND((COUNTIF(I2:I40; "Sudah Dicairkan")/COUNT(A2:A40))*100; 1) & "%"'
    ]
  },
  {
    id: 'tpl-jurnal-pembelajaran',
    title: 'Format Jurnal Mengajar Harian & Catatan Refleksi Guru Kelas',
    category: 'Akademik & Nilai',
    description: 'Pencatatan agenda kegiatan belajar mengajar harian, TP (Tujuan Pembelajaran) yang dicapai, asesmen formatif, kendala di kelas, dan tindak lanjut refleksi.',
    targetClass: 'Seluruh Dewan Guru SDN 006',
    rowCount: 30,
    columnCount: 8,
    downloadsCount: 125,
    lastUpdated: '07 Oktober 2026',
    tags: ['jurnal mengajar', 'refleksi', 'tujuan pembelajaran', 'kurikulum merdeka', 'guru kelas'],
    status: 'Aktif',
    sampleHeaders: ['Hari / Tanggal', 'Mata Pelajaran', 'Materi / Bab', 'Tujuan Pembelajaran (TP)', 'Metode Belajar', 'Jumlah Hadir / Total', 'Catatan Refleksi Guru', 'Tindak Lanjut'],
    sampleRows: [
      ['Senin, 05/10/2026', 'IPAS', 'Bab 3: Magnet & Listrik', 'Membuat rangkaian listrik seri sederhana', 'Eksperimen Kelompok', '34 / 35', 'Siswa sangat antusias saat lampu menyala.', 'Bagi siswa yang belum berhasil, bimbingan di jam istirahat.'],
      ['Selasa, 06/10/2026', 'Matematika', 'Pecahan Desimal', 'Mengubah pecahan biasa ke desimal', 'Tanya Jawab & Game', '35 / 35', 'Perlu penekanan perkalian persepuluh.', 'Berikan latihan mandiri 3 soal.']
    ],
    keyFormulas: [
      'Tingkat Kehadiran: =ROUND((34/35)*100; 0) & "%"',
      'Rekap Pertemuan: =COUNTA(A2:A30) & " Pertemuan"'
    ]
  },
  {
    id: 'tpl-buku-kas-umum',
    title: 'Buku Kas Umum (BKU) Pembantu Bank & Tunai Standar RKAS Kemdikbud',
    category: 'Keuangan & BOS',
    description: 'Buku kas induk pembantu bank dan tunai resmi dengan penghitungan saldo berjalan otomatis, kode rekening belanja ARKAS, dan rekapitulasi tutup buku bulanan.',
    targetClass: 'Bendahara BOS & Kepala Sekolah',
    rowCount: 45,
    columnCount: 10,
    downloadsCount: 195,
    lastUpdated: '11 Oktober 2026',
    tags: ['bku bos', 'arkas', 'kas pembantu', 'bank dan tunai', 'spj dana bos', 'saldo berjalan'],
    status: 'Aktif',
    sampleHeaders: ['No', 'Tanggal', 'No Kode Bukti', 'Uraian Transaksi', 'Kode Rekening ARKAS', 'Penerimaan (Rp)', 'Pengeluaran (Rp)', 'Saldo Kas (Rp)', 'Pos Simpanan', 'Paraf Pengesahan'],
    sampleRows: [
      [1, '01/10/2026', 'SALDO-AWAL', 'Saldo Awal Bulan Oktober 2026', '-', 28500000, 0, 28500000, 'Bank BPD Kaltimtara', 'Setuju'],
      [2, '03/10/2026', 'BOS-01/X', 'Tarik Tunai dari Rekening Giro Sekolah', '-', 0, 5000000, 23500000, 'Kas Tunai Bendahara', 'Setuju'],
      [3, '05/10/2026', 'BOS-02/X', 'Belanja Kertas HVS & ATK Ujian (Toko Sumber)', '5.2.1.01.0001', 0, 1850000, 21650000, 'Kas Tunai Bendahara', 'Setuju']
    ],
    keyFormulas: [
      'Saldo Berjalan: =H2+F3-G3',
      'Total Penerimaan: =SUM(F2:F45)',
      'Total Pengeluaran: =SUM(G2:G45)',
      'Saldo Akhir Kas: =F2-SUM(G3:G45)'
    ]
  }
];

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Di komputer dengan Regional Setting Indonesia, tanda pemisah parameter rumus Excel yang benar adalah...',
    scenario: 'Ibu Guru Ani di SDN 006 mengetik rumus =IF(B2>=75, "Tuntas", "Remedial") di laptopnya namun muncul pesan error peringatan rumus tidak valid.',
    formulaCode: '=IF(B2>=75; "Tuntas"; "Remedial")',
    options: [
      'Titik dua (:)',
      'Titik koma (;)',
      'Garis miring (/)',
      'Tanda seru (!)'
    ],
    correctIndex: 1,
    explanation: 'Pada sistem operasi dengan setelan wilayah Indonesia (Indonesian regional format), pemisah argumen formula Excel adalah titik koma (;), sedangkan pemisah koma (,) digunakan pada sistem bahasa Inggris (US).',
    category: 'Sintaks & Pengaturan',
    difficulty: 'Dasar'
  },
  {
    id: 2,
    question: 'Rumus manakah yang tepat untuk menghitung berapa kali siswa mendapat keterangan Alpha ("A") pada kolom absensi B2 sampai AF2?',
    scenario: 'Pak Guru Budi ingin merekap jumlah ketidakhadiran siswa tanpa keterangan dalam 1 bulan.',
    options: [
      '=COUNT(B2:AF2; "A")',
      '=SUM(B2:AF2; "A")',
      '=COUNTIF(B2:AF2; "A")',
      '=COUNTA(B2:AF2; "A")'
    ],
    correctIndex: 2,
    explanation: 'Rumus COUNTIF digunakan untuk mencacah jumlah sel yang memenuhi syarat tertentu, dalam hal ini menghitung kemunculan huruf "A".',
    category: 'Statistik & Absensi',
    difficulty: 'Dasar'
  },
  {
    id: 3,
    question: 'Mengapa saat menyalin rumus VLOOKUP ke baris bawah, alamat tabel referensi harus menggunakan tanda dollar ($) seperti $A$2:$E$40?',
    scenario: 'Ibu Ratna menyalin rumus ke bawah untuk 30 siswa, namun pada siswa ke-5 ke bawah tiba-tiba hasilnya menjadi error #N/A.',
    options: [
      'Agar rumus menghitung mata uang Rupiah',
      'Agar rentang tabel master terkunci (absolut) dan tidak ikut bergeser turun',
      'Agar data terurut secara otomatis',
      'Syarat wajib dari Microsoft Excel agar tidak lemot'
    ],
    correctIndex: 1,
    explanation: 'Tanda dollar ($) berfungsi sebagai pengunci referensi absolut. Tanpa tanda $, saat rumus ditarik ke baris 5, rentang tabel referensi akan ikut turun menjadi A5:E43 sehingga data master di baris atas terlewat.',
    category: 'Referensi Absolut',
    difficulty: 'Menengah'
  },
  {
    id: 4,
    question: 'Jika KKTP SDN 006 adalah 75, rumus manakah yang benar untuk menampilkan kata "Tuntas" bagi nilai 75 ke atas dan "Remedial" untuk nilai di bawahnya?',
    scenario: 'Wali kelas ingin menentukan kelulusan otomatis di kolom D berdasarkan nilai ujian di kolom C.',
    options: [
      '=IF(C2>75; "Tuntas"; "Remedial")',
      '=IF(C2>=75; "Tuntas"; "Remedial")',
      '=IF(C2=75; "Tuntas"; "Remedial")',
      '=IF(C2<75; "Tuntas"; "Remedial")'
    ],
    correctIndex: 1,
    explanation: 'Operator >= (lebih dari atau sama dengan) memastikan bahwa siswa yang mendapat nilai pas 75 tetap berstatus "Tuntas". Jika hanya menggunakan >, siswa bernilai 75 akan salah dinilai sebagai Remedial.',
    category: 'Logika Nilai',
    difficulty: 'Dasar'
  },
  {
    id: 5,
    question: 'Bendahara BOS ingin menjumlahkan seluruh biaya belanja yang jenisnya adalah "ATK" pada kolom B2:B50 dengan nilai rupiah di kolom D2:D50. Rumus yang tepat adalah...',
    scenario: 'Pembuatan Laporan Pertanggungjawaban (SPJ) Dana BOS SDN 006.',
    options: [
      '=SUM(B2:B50; "ATK")',
      '=SUMIF(B2:B50; "ATK"; D2:D50)',
      '=COUNTIF(B2:B50; "ATK"; D2:D50)',
      '=VLOOKUP("ATK"; B2:D50; 3; 0)'
    ],
    correctIndex: 1,
    explanation: 'SUMIF memiliki susunan: =SUMIF(rentang_kriteria; kriteria; rentang_yang_dijumlahkan). Rumus ini memeriksa kolom B lalu menjumlahkan angka di kolom D yang sesuai.',
    category: 'Keuangan & BOS',
    difficulty: 'Menengah'
  },
  {
    id: 6,
    question: 'Rumus manakah yang digunakan untuk menentukan Peringkat / Ranking kelas siswa di sel C2 dibandingkan seluruh teman sekelasnya di sel $C$2:$C$35?',
    scenario: 'Menentukan 3 besar juara kelas 5A SDN 006.',
    options: [
      '=ORDER(C2; $C$2:$C$35)',
      '=SORT(C2; $C$2:$C$35)',
      '=RANK.EQ(C2; $C$2:$C$35; 0)',
      '=MAX(C2; $C$2:$C$35)'
    ],
    correctIndex: 2,
    explanation: '=RANK.EQ(nilai; referensi; 0) memberikan urutan peringkat dari nilai terbesar sebagai peringkat 1.',
    category: 'Statistik & Ranking',
    difficulty: 'Menengah'
  },
  {
    id: 7,
    question: 'Jika kolom nama siswa tertulis "muhammad arkan pratama", rumus apa yang dapat mengubahnya seketika menjadi "Muhammad Arkan Pratama"?',
    scenario: 'Standarisasi biodata buku induk siswa SDN 006.',
    options: [
      '=UPPER(A2)',
      '=LOWER(A2)',
      '=PROPER(A2)',
      '=CAPITAL(A2)'
    ],
    correctIndex: 2,
    explanation: 'Fungsi PROPER mengubah huruf pertama dari setiap kata menjadi huruf kapital dan huruf berikutnya menjadi huruf kecil.',
    category: 'Manipulasi Teks',
    difficulty: 'Dasar'
  },
  {
    id: 8,
    question: 'Tampilan error apakah yang muncul di lembar kerja jika rumus mencoba membagi suatu angka dengan nol atau sel kosong?',
    scenario: 'Sel rata-rata nilai matematika siswa yang belum mengikuti ujian sama sekali.',
    options: [
      '#N/A',
      '#VALUE!',
      '#DIV/0!',
      '#REF!'
    ],
    correctIndex: 2,
    explanation: '#DIV/0! adalah kode error resmi Excel yang berarti "Division by Zero" (pembagian dengan angka nol atau sel yang masih kosong).',
    category: 'Diagnosa Error',
    difficulty: 'Dasar'
  },
  {
    id: 9,
    question: 'Bagaimana cara mencegah agar error #DIV/0! atau #N/A tidak terlihat di lembar kerja cetak rapor, melainkan diganti dengan tanda strip (-)?',
    scenario: 'Mempercantik format cetak leger nilai agar bersih dan rapi.',
    options: [
      'Menggunakan rumus =IFERROR(rumus_utama; "-")',
      'Menghapus sel yang error secara manual setiap kali mencetak',
      'Mengubah warna tulisan menjadi putih',
      'Mengganti format sel menjadi general'
    ],
    correctIndex: 0,
    explanation: 'Rumus IFERROR membungkus rumus utama. Jika rumus utama menghasilkan error jenis apapun, IFERROR akan menggantinya dengan nilai alternatif yang ditentukan (misalnya tanda strip "-").',
    category: 'Pembersih Error',
    difficulty: 'Menengah'
  },
  {
    id: 10,
    question: 'Shortcut keyboard sakti di Excel yang paling cepat untuk mengaktifkan atau mematikan fitur FILTER data (panah dropdown) dalam 1 detik adalah...',
    scenario: 'Guru ingin menyaring siswa dengan nilai remedial secara cepat.',
    options: [
      'Ctrl + C',
      'Ctrl + Shift + L',
      'Alt + F4',
      'Ctrl + Z'
    ],
    correctIndex: 1,
    explanation: 'Kombinasi tombol Ctrl + Shift + L adalah shortcut resmi Microsoft Excel untuk mengaktifkan dan menonaktifkan filter otomatis pada baris judul tabel.',
    category: 'Shortcut Cepat',
    difficulty: 'Menengah'
  }
];

export const ERROR_GUIDES = [
  {
    code: '#N/A',
    name: 'Not Available / Data Tidak Ditemukan',
    cause: 'Biasanya terjadi pada rumus VLOOKUP atau MATCH saat nilai yang dicari (misal NISN siswa) tidak ada dalam tabel referensi, atau terdapat spasi di akhir kata.',
    fix: '1. Pastikan data ada di tabel master.\n2. Cek apakah ada spasi tersembunyi dengan rumus TRIM.\n3. Bungkus dengan IFERROR(rumus; "Data Tidak Ada").'
  },
  {
    code: '#DIV/0!',
    name: 'Divide by Zero / Pembagian dengan Nol',
    cause: 'Terjadi saat melakukan pembagian atau rata-rata (AVERAGE) pada baris yang nilainya masih kosong atau nol (misal murid belum ujian).',
    fix: 'Gunakan =IFERROR(AVERAGE(B2:D2); 0) atau cek sel pembagi agar tidak bernilai 0.'
  },
  {
    code: '#VALUE!',
    name: 'Wrong Value Type / Salah Tipe Nilai',
    cause: 'Terjadi saat rumus matematika mencoba mengoperasikan teks (misal sel berisi tulisan "Sakit" dijumlahkan dengan angka nilai 80).',
    fix: 'Pastikan seluruh sel yang dihitung berisi angka murni, bukan teks gabungan.'
  },
  {
    code: '#REF!',
    name: 'Invalid Cell Reference / Sel Terhapus',
    cause: 'Terjadi ketika baris atau kolom yang dijadikan referensi rumus telah dihapus (Delete Row/Col) secara tidak sengaja.',
    fix: 'Tekan Ctrl + Z untuk membatalkan penghapusan, atau perbarui koordinat sel di dalam rumus.'
  },
  {
    code: '#NAME?',
    name: 'Unrecognized Name / Salah Ketik Rumus',
    cause: 'Salah mengetikkan nama rumus (misal mengetik =VLOKUP bukan =VLOOKUP) atau lupa memberi tanda petik dua pada teks (misal IF(A1=1; Tuntas) tanpa tanda petik di kata "Tuntas").',
    fix: 'Periksa ejaan nama rumus dan pastikan semua teks diapit tanda kutip dua (").'
  },
  {
    code: '#####',
    name: 'Column Too Narrow / Kolom Kurang Lebar',
    cause: 'Bukan error rumus, melainkan lebar kolom terlalu sempit untuk menampilkan angka nominal rupiah yang panjang.',
    fix: 'Arahkan kursor ke batas garis antar kolom di atas dan klik ganda (double-click) untuk auto-fit lebar kolom.'
  }
];

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + Shift + L', desc: 'Mengaktifkan / Mematikan Filter Otomatis' },
  { key: 'Alt + =', desc: 'AutoSum otomatis menjumlahkan kolom/baris angka' },
  { key: 'F4', desc: 'Mengunci sel menjadi absolut ($A$1) saat mengetik rumus' },
  { key: 'Ctrl + E', desc: 'Flash Fill otomatis memisahkan nama/data cerdas' },
  { key: 'Ctrl + ;', desc: 'Memasukkan Tanggal Hari Ini secara otomatis' },
  { key: 'Ctrl + Shift + :', desc: 'Memasukkan Waktu / Jam Saat Ini secara otomatis' },
  { key: 'Ctrl + 1', desc: 'Membuka menu Format Cells (Rupiah, Tanggal, dll)' },
  { key: 'Ctrl + D', desc: 'Menyalin isi sel tepat di atasnya ke sel aktif' },
  { key: 'Ctrl + R', desc: 'Menyalin isi sel tepat di sebelah kirinya' },
  { key: 'Ctrl + `', desc: 'Menampilkan seluruh rumus yang ada di lembar kerja' }
];
