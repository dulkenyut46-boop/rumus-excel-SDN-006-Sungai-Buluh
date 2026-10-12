import { VbaSnippet } from '../types';

export const INITIAL_VBA_SNIPPETS: VbaSnippet[] = [
  {
    id: 'vba-terbilang',
    title: 'Fungsi Kustom: =Terbilang(Angka) Rupiah Otomatis',
    category: 'Fungsi Kustom (UDF)',
    summary: 'Mengubah nominal angka rupiah kwitansi BOS & slip honor (misal 1.750.000) menjadi kalimat ejaan resmi: "Satu Juta Tujuh Ratus Lima Puluh Ribu Rupiah".',
    explanation: 'Fungsi terbilang adalah fungsi VBA paling dicari di seluruh sekolah Indonesia karena Microsoft Excel tidak memiliki rumus bawaan untuk ejaan kata nominal. Setelah dipasang di Module, Anda dapat langsung mengetik rumus =Terbilang(E2) di sel lembar kerja Anda!',
    code: `' ========================================================
' FUNGSI TERBILANG RUPIAH RESMI - SDN 006
' Pasang di: VBA Editor (Alt + F11) -> Insert -> Module
' Penggunaan di Excel: =Terbilang(A1)
' ========================================================
Function Terbilang(ByVal Nilai As Double) As String
    Dim Angka As Variant
    Dim Hasil As String
    
    Angka = Array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas")
    Nilai = Fix(Nilai)
    
    Select Case Nilai
        Case 0 To 11
            Hasil = Angka(Nilai)
        Case 12 To 19
            Hasil = Terbilang(Nilai Mod 10) & " Belas"
        Case 20 To 99
            Hasil = Terbilang(Fix(Nilai / 10)) & " Puluh " & Terbilang(Nilai Mod 10)
        Case 100 To 199
            Hasil = "Seratus " & Terbilang(Nilai Mod 100)
        Case 200 To 999
            Hasil = Terbilang(Fix(Nilai / 100)) & " Ratus " & Terbilang(Nilai Mod 100)
        Case 1000 To 1999
            Hasil = "Seribu " & Terbilang(Nilai Mod 1000)
        Case 2000 To 999999
            Hasil = Terbilang(Fix(Nilai / 1000)) & " Ribu " & Terbilang(Nilai Mod 1000)
        Case 1000000 To 999999999
            Hasil = Terbilang(Fix(Nilai / 1000000)) & " Juta " & Terbilang(Nilai Mod 1000000)
        Case 1000000000 To 999999999999#
            Hasil = Terbilang(Fix(Nilai / 1000000000)) & " Miliar " & Terbilang(Nilai Mod 1000000000)
        Case Else
            Hasil = "Nilai Terlalu Besar"
    End Select
    
    Hasil = Application.Trim(Hasil)
    If Len(Hasil) > 0 Then
        Terbilang = Hasil & " Rupiah"
    Else
        Terbilang = "Nol Rupiah"
    End If
End Function`,
    sampleUse: '=Terbilang(D15)',
    tips: 'Untuk huruf kapital di awal setiap kata, gunakan kombinasi rumus =PROPER(Terbilang(D15)).',
    tags: ['terbilang', 'rupiah', 'bos', 'kwitansi', 'slip honor', 'udf']
  },
  {
    id: 'vba-cetak-rapor-pdf',
    title: 'Macro Cetak Massal Rapor Siswa ke PDF Terpisah Otomatis',
    category: 'Cetak & Ekspor PDF',
    summary: 'Mencetak otomatis rapor seluruh siswa satu per satu ke berkas PDF dengan nama siswa dan NISN sebagai nama file.',
    explanation: 'Wali kelas SDN 006 tidak perlu lagi mengganti nomor urut siswa lalu Save as PDF sebanyak 35 kali. Cukup klik satu tombol, makro akan mengulang (looping) dari siswa nomor 1 sampai selesai dan menyimpan PDF langsung ke folder yang sama dengan file Excel.',
    code: `' ========================================================
' MACRO CETAK MASSAL RAPOR SISWA KE PDF
' SDN 006 INDONESIA
' ========================================================
Sub CetakRaporMassalPDF()
    Dim wsLeger As Worksheet
    Dim wsRapor As Worksheet
    Dim noAwal As Integer, noAkhir As Integer, i As Integer
    Dim namaSiswa As String, nisn As String
    Dim folderPath As String, filePath As String
    
    Set wsLeger = ThisWorkbook.Sheets("Leger")
    Set wsRapor = ThisWorkbook.Sheets("CetakRapor")
    
    folderPath = ThisWorkbook.Path & Application.PathSeparator & "Rapor_PDF" & Application.PathSeparator
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath
    
    noAwal = 1
    noAkhir = 35 ' Ubah sesuai jumlah siswa di kelas Anda
    
    Application.ScreenUpdating = False
    
    For i = noAwal To noAkhir
        ' Pasang nomor urut siswa ke sel kunci form cetak rapor (misal sel C2)
        wsRapor.Range("C2").Value = i
        Calculate
        
        namaSiswa = wsRapor.Range("D5").Value ' Sel nama siswa
        nisn = wsRapor.Range("D6").Value      ' Sel NISN siswa
        
        filePath = folderPath & "Rapor_" & i & "_" & nisn & "_" & namaSiswa & ".pdf"
        
        ' Ekspor halaman cetak rapor ke PDF
        wsRapor.ExportAsFixedFormat _
            Type:=xlTypePDF, _
            Filename:=filePath, _
            Quality:=xlQualityStandard, _
            IncludeDocProperties:=True, _
            IgnorePrintAreas:=False, _
            OpenAfterPublish:=False
    Next i
    
    Application.ScreenUpdating = True
    MsgBox "Alhamdulillah! Selesai mencetak " & (noAkhir - noAwal + 1) & " berkas Rapor ke folder: " & vbCrLf & folderPath, vbInformation, "SDN 006 Sukses"
End Sub`,
    sampleUse: 'Jalankan melalui Tombol Shape di Sheet atau tombol F5 di VBA Editor.',
    tips: 'Pastikan sheet "Leger" dan "CetakRapor" sudah dibuat dan file Excel disimpan berformat .xlsm (Excel Macro-Enabled Workbook).',
    tags: ['rapor pdf', 'looping', 'cetak otomatis', 'wali kelas', 'massal']
  },
  {
    id: 'vba-clear-form',
    title: 'Macro Bersihkan Isi Formulir Input Nilai (Anti Hapus Rumus)',
    category: 'Formulir & Tombol Interaktif',
    summary: 'Menghapus data input isian nilai siswa yang lama tanpa sengaja menghapus sel yang berisi rumus dan formula.',
    explanation: 'Seringkali guru menekan tombol Delete di lembar kerja sehingga rumus rata-rata atau ranking ikut terhapus. Makro ini menggunakan metode SpecialCells(xlCellTypeConstants) yang hanya menghapus angka/teks inputan mentah saja, sementara semua rumus dan fungsi matematika tetap 100% utuh!',
    code: `' ========================================================
' MACRO BERSIHKAN FORM INPUT NILAI TANPA HAPUS RUMUS
' SDN 006 INDONESIA
' ========================================================
Sub BersihkanFormNilai()
    Dim respon As VbMsgBoxResult
    Dim areaInput As Range
    
    respon = MsgBox("Apakah Anda yakin ingin mengosongkan seluruh isian nilai siswa?" & vbCrLf & _
                    "Sel yang berisi rumus otomatis TIDAK akan terhapus.", _
                    vbQuestion + vbYesNo, "Konfirmasi Reset Nilai - SDN 006")
                    
    If respon = vbYes Then
        On Error Resume Next
        ' Tentukan rentang sel input (misal C5:G40)
        Set areaInput = ThisWorkbook.Sheets("InputNilai").Range("C5:G40")
        
        ' Hanya hapus nilai konstan (teks & angka), pertahankan rumus!
        areaInput.SpecialCells(xlCellTypeConstants).ClearContents
        On Error GoTo 0
        
        MsgBox "Data nilai berhasil dibersihkan! Rumus tetap aman.", vbInformation, "SDN 006"
    End If
End Sub`,
    sampleUse: 'Klik tombol "Reset Form" di lembar kerja.',
    tips: 'Sangat aman karena melindungi kerja keras Anda menyusun formula.',
    tags: ['reset form', 'clear contents', 'anti rusak rumus', 'tombol interaktif']
  },
  {
    id: 'vba-sort-ranking',
    title: 'Macro Urutkan Leger Kelas Otomatis Berdasarkan Nilai Tertinggi',
    category: 'Otomasi Rapor & Nilai',
    summary: 'Mengurutkan otomatis 35 baris siswa dari nilai rapor tertinggi ke terendah (Descending) dalam 1 detik.',
    explanation: 'Setelah semua nilai ulangan harian dan sumatif akhir dimasukkan, makro ini secara instan menyusun urutan siswa ranking 1, 2, 3 ke atas beserta nomor urut baru.',
    code: `' ========================================================
' MACRO URUTKAN PERINGKAT SISWA LEGER OTOMATIS
' SDN 006 INDONESIA
' ========================================================
Sub UrutkanRankingKelas()
    Dim ws As Worksheet
    Dim barisTerakhir As Long
    
    Set ws = ThisWorkbook.Sheets("Leger")
    barisTerakhir = ws.Cells(ws.Rows.Count, "B").End(xlUp).Row
    
    If barisTerakhir < 5 Then Exit Sub
    
    ' Rentang tabel leger dari kolom A s/d kolom H (baris 5 s/d akhir)
    ' Urutkan berdasarkan kolom Total Nilai (Kolom G) secara Descending
    With ws.Sort
        .SortFields.Clear
        .SortFields.Add Key:=ws.Range("G5:G" & barisTerakhir), _
            SortOn:=xlSortOnValues, Order:=xlDescending, DataOption:=xlSortNormal
        .SetRange ws.Range("A4:H" & barisTerakhir)
        .Header = xlYes
        .MatchCase = False
        .Orientation = xlTopToBottom
        .Apply
    End With
    
    ' Perbarui nomor urut 1, 2, 3 di kolom A
    Dim i As Long
    For i = 5 To barisTerakhir
        ws.Cells(i, 1).Value = i - 4
    Next i
    
    MsgBox "Peringkat siswa berhasil diurutkan dari nilai tertinggi ke terendah!", vbInformation, "SDN 006"
End Sub`,
    sampleUse: 'Klik tombol "Urutkan Ranking" di sheet Leger.',
    tips: 'Pastikan baris judul tabel Anda sesuai (misal baris 4 adalah Header).',
    tags: ['ranking', 'sort leger', 'juara kelas', 'prestasi']
  },
  {
    id: 'vba-kunci-rumus',
    title: 'Macro Kunci Sel Berumus Otomatis (Protect Formulas Only)',
    category: 'Administrasi & BOS',
    summary: 'Mengunci secara otomatis semua sel yang mengandung rumus agar tidak bisa diedit/terhapus, sementara sel isian tetap bebas diketik.',
    explanation: 'Saat lembar kerja dioper ke guru lain, seringkali rumus penting terhapus karena kelalaian. Makro ini otomatis mencari sel berumus, menguncinya (Locked = True), membuka sel input (Locked = False), dan memproteksi lembar kerja dengan password SDN 006.',
    code: `' ========================================================
' MACRO AMANKAN SEL BERUMUS DARI TERHAPUS
' SDN 006 INDONESIA
' ========================================================
Sub LindungiSelBerumus()
    Dim ws As Worksheet
    Dim passwordSekolah As String
    
    Set ws = ActiveSheet
    passwordSekolah = "SDN006" ' Ganti dengan password pilihan Anda
    
    ws.Unprotect Password:=passwordSekolah
    
    ' Buka kunci semua sel terlebih dahulu
    ws.Cells.Locked = False
    
    On Error Resume Next
    ' Cari seluruh sel yang memiliki rumus dan kunci sel tersebut
    ws.Cells.SpecialCells(xlCellTypeFormulas).Locked = True
    On Error GoTo 0
    
    ' Proteksi sheet dengan password
    ws.Protect Password:=passwordSekolah, _
        DrawingObjects:=True, Contents:=True, Scenarios:=True, _
        AllowFormattingCells:=True, AllowFormattingColumns:=True
        
    MsgBox "Seluruh rumus di lembar kerja ini telah TERKUNCI dan AMAN dari salah ketik!" & vbCrLf & _
           "Password proteksi: " & passwordSekolah, vbInformation, "Keamanan Data SDN 006"
End Sub`,
    sampleUse: 'Jalankan sebelum mendistribusikan format Excel ke rekan guru.',
    tips: 'Guru lain tetap bisa mengetik nilai pada sel kosong, tapi tidak bisa mengotak-atik rumus yang sudah dikunci.',
    tags: ['protect sheet', 'keamanan data', 'kunci rumus', 'anti salah ketik']
  },
  {
    id: 'vba-auto-backup-bos',
    title: 'Macro Auto-Backup Buku Kas Umum BOS dengan Waktu & Tanggal',
    category: 'Administrasi & BOS',
    summary: 'Membuat salinan cadangan (backup) otomatis pembukuan BOS setiap kali tombol ditekan dengan nama file ber-timestamp.',
    explanation: 'Mencegah kehilangan berkas SPJ BOS berharga. Setiap kali dijalankan, makro ini menyimpan salinan file ke subfolder "Backup_BOS" dengan nama tanggal dan jam saat itu, contoh: BKU_BOS_SDN006_20261011_1430.xlsm.',
    code: `' ========================================================
' MACRO AUTO BACKUP BUKU KAS UMUM DANA BOS
' SDN 006 INDONESIA
' ========================================================
Sub BackupOtomatisBOS()
    Dim folderBackup As String
    Dim namaFileBackup As String
    Dim formatWaktu As String
    
    folderBackup = ThisWorkbook.Path & Application.PathSeparator & "Backup_BOS" & Application.PathSeparator
    If Dir(folderBackup, vbDirectory) = "" Then MkDir folderBackup
    
    formatWaktu = Format(Now, "yyyy-mm-dd_hh-nn-ss")
    namaFileBackup = folderBackup & "BKU_SDN006_" & formatWaktu & ".xlsm"
    
    ' Simpan salinan ke file backup
    ThisWorkbook.SaveCopyAs Filename:=namaFileBackup
    
    MsgBox "Cadangan Buku Kas Umum berhasil dibuat di:" & vbCrLf & namaFileBackup, vbInformation, "Backup Berhasil - SDN 006"
End Sub`,
    sampleUse: 'Jalankan sebelum melakukan rekap tutup buku bulanan.',
    tips: 'Simpan file master di cloud (Google Drive / OneDrive) agar cadangan otomatis sinkron secara online.',
    tags: ['backup', 'dana bos', 'bku', 'arsip keuangan', 'bendahara']
  },
  {
    id: 'vba-konversi-predikat',
    title: 'Fungsi Kustom: =PredikatRapor(Nilai) Kurikulum Merdeka',
    category: 'Fungsi Kustom (UDF)',
    summary: 'Fungsi khusus SDN 006 untuk konversi nilai angka ke deskripsi capaian rapor tanpa perlu mengetik IF bertingkat yang panjang.',
    explanation: 'Cukup ketik rumus sederhana =PredikatRapor(85) di sel Excel Anda, maka sel akan otomatis menampilkan "Baik (Mencapai Tujuan Pembelajaran)".',
    code: `' ========================================================
' FUNGSI UDF PREDIKAT KURIKULUM MERDEKA - SDN 006
' Penggunaan di Excel: =PredikatRapor(G2)
' ========================================================
Function PredikatRapor(ByVal Nilai As Double) As String
    Select Case Nilai
        Case Is >= 90
            PredikatRapor = "Sangat Baik (Menunjukkan Penguasaan Maksimal)"
        Case Is >= 80
            PredikatRapor = "Baik (Mencapai Tujuan Pembelajaran)"
        Case Is >= 75
            PredikatRapor = "Cukup (Perlu Pemantapan pada Materi Tertentu)"
        Case Else
            PredikatRapor = "Perlu Bimbingan (Belum Mencapai KKTP)"
    End Select
End Function`,
    sampleUse: '=PredikatRapor(H2)',
    tips: 'Bisa digabungkan dengan rumus VLOOKUP atau AVERAGE: =PredikatRapor(AVERAGE(C2:F2)).',
    tags: ['udf', 'kurikulum merdeka', 'predikat', 'rapor', 'fungsi buatan']
  },
  {
    id: 'vba-auto-format-nilai',
    title: 'Macro Auto-Format Nilai Rapor & Leger Siswa',
    category: 'Otomasi Rapor & Nilai',
    summary: 'Mewarnai otomatis nilai siswa: Hijau pastel untuk Tuntas (>=75) dan Merah muda untuk Remedial (<75), meluruskan border garis tabel, dan memformat angka rapi.',
    explanation: 'Sangat praktis untuk merapikan leger nilai kelas 1-6 SDN 006 dalam 1 detik. Makro ini otomatis memeriksa seluruh nilai, memberi pewarnaan visual yang memudahkan guru melihat siswa mana yang perlu bimbingan khusus, serta merapikan garis tabel tanpa perlu setting manual.',
    code: `' ========================================================
' MACRO AUTO-FORMAT NILAI RAPOR & LEGER - SDN 006
' Beri warna otomatis: Hijau (>=75 Tuntas), Merah (<75 Remedial)
' Pasang border rapi dan rata tengah angka
' ========================================================
Sub AutoFormatNilaiLeger()
    Dim ws As Worksheet
    Dim rngNilai As Range
    Dim cell As Range
    Dim kktp As Double
    
    Set ws = ActiveSheet
    kktp = 75# ' Nilai standar KKTP SDN 006
    
    ' Rentang tabel nilai siswa yang ingin diformat
    ' Menggunakan area seleksi saat ini, atau default C5:G39
    If TypeName(Selection) = "Range" And Selection.Count > 1 Then
        Set rngNilai = Selection
    Else
        Set rngNilai = ws.Range("C5:G39")
    End If
    
    Application.ScreenUpdating = False
    
    ' 1. Bersihkan format warna lama
    rngNilai.Interior.ColorIndex = xlNone
    rngNilai.Font.ColorIndex = xlAutomatic
    
    ' 2. Atur perataan tengah dan angka desimal
    rngNilai.HorizontalAlignment = xlCenter
    rngNilai.VerticalAlignment = xlCenter
    rngNilai.NumberFormat = "0.00"
    
    ' 3. Beri border tipis rapi
    With rngNilai.Borders
        .LineStyle = xlContinuous
        .Weight = xlThin
        .Color = RGB(180, 180, 180)
    End With
    
    ' 4. Pewarnaan otomatis (Hijau pastel Tuntas, Merah muda Remedial)
    For Each cell In rngNilai
        If IsNumeric(cell.Value) And Not IsEmpty(cell.Value) Then
            If cell.Value >= kktp Then
                cell.Interior.Color = RGB(220, 245, 225) ' Hijau pastel segar
                cell.Font.Color = RGB(20, 90, 40)
                cell.Font.Bold = False
            Else
                cell.Interior.Color = RGB(255, 225, 225) ' Merah muda pastel
                cell.Font.Color = RGB(150, 20, 20)
                cell.Font.Bold = True ' Tebalkan teks yang remedial
            End If
        End If
    Next cell
    
    Application.ScreenUpdating = True
    MsgBox "Selesai! Format nilai telah dirapikan secara otomatis." & vbCrLf & _
           "- Tuntas (>= " & kktp & "): Hijau" & vbCrLf & _
           "- Remedial (< " & kktp & "): Merah", vbInformation, "Format Nilai SDN 006"
End Sub`,
    sampleUse: 'Blok sel nilai lalu jalankan Macro AutoFormatNilaiLeger',
    tips: 'Ambang batas KKTP (75) bisa diubah sesuai ketetapan mata pelajaran masing-masing.',
    tags: ['auto-format', 'pewarnaan nilai', 'kktp', 'remedial', 'tuntas', 'tabel leger']
  },
  {
    id: 'vba-export-range-pdf',
    title: 'Macro Export Range / Seleksi Tabel ke PDF Terstandar',
    category: 'Cetak & Ekspor PDF',
    summary: 'Mengekspor area tabel yang dipilih pengguna atau rentang tertentu ke berkas PDF rapi yang pas 1 lembar (Fit to 1 Page Landscape/Portrait).',
    explanation: 'Seringkali saat mencetak ke PDF dari Excel, tabel terpotong menjadi 2 lembar yang jelek. Makro ini mengatur konfigurasi FitToPagesWide = 1 secara presisi, membuat subfolder "Dokumen_PDF", dan langsung membuka pratinjau PDF setelah ekspor selesai.',
    code: `' ========================================================
' MACRO EXPORT RANGE / SELEKSI KE PDF TERSTANDAR
' SDN 006 INDONESIA
' Ekspor area terpilih atau tabel khusus ke PDF 1 Halaman Rapi
' ========================================================
Sub ExportRangeKePDF()
    Dim ws As Worksheet
    Dim rngTarget As Range
    Dim namaFile As String, folderPath As String, fullPath As String
    Dim judulTabel As String
    
    Set ws = ActiveSheet
    
    ' Gunakan area yang sedang diseleksi atau tetapkan rentang default
    If TypeName(Selection) = "Range" And Selection.Count > 1 Then
        Set rngTarget = Selection
        judulTabel = "Area_Pilihan"
    Else
        ' Default rentang tabel leger kelas 1 halaman
        Set rngTarget = ws.Range("A1:H40")
        judulTabel = ws.Name
    End If
    
    ' Tentukan folder tujuan (subfolder Dokumen_PDF di samping file Excel)
    folderPath = ThisWorkbook.Path & Application.PathSeparator & "Dokumen_PDF" & Application.PathSeparator
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath
    
    namaFile = "SDN006_" & judulTabel & "_" & Format(Now, "yyyy-mm-dd_hhmm") & ".pdf"
    fullPath = folderPath & namaFile
    
    Application.ScreenUpdating = False
    
    ' Konfigurasi halaman agar pas di 1 lembar A4
    With ws.PageSetup
        .PrintArea = rngTarget.Address
        .Orientation = xlLandscape ' xlLandscape untuk tabel lebar, xlPortrait untuk vertikal
        .PaperSize = xlPaperA4
        .Zoom = False
        .FitToPagesWide = 1
        .FitToPagesTall = 1
        .CenterHorizontally = True
    End With
    
    ' Ekspor ke PDF
    ws.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=fullPath, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False, _
        OpenAfterPublish:=True ' Buka file PDF otomatis
        
    Application.ScreenUpdating = True
    MsgBox "Tabel berhasil diekspor ke PDF!" & vbCrLf & fullPath, vbInformation, "Ekspor PDF - SDN 006"
End Sub`,
    sampleUse: 'Blok tabel yang ingin diekspor lalu jalankan Macro ExportRangeKePDF',
    tips: 'Ubah .Orientation = xlPortrait jika mencetak surat atau berkas yang berorientasi tegak lurus.',
    tags: ['export pdf', 'range ke pdf', 'cetak a4', 'fit to page', 'cetak leger']
  },
  {
    id: 'vba-validasi-nisn-nik',
    title: 'Macro Validasi Panjang Digit NISN (10 Digit) & NIK (16 Digit)',
    category: 'Administrasi & BOS',
    summary: 'Memeriksa otomatis kebenaran panjang digit NISN dan NIK seluruh siswa sekolah, menandai sel yang keliru dengan warna kuning untuk diverifikasi sebelum cetak ijazah.',
    explanation: 'Sangat sering terjadi kesalahan input data oleh orang tua atau operator dimana angka nol di depan NISN hilang atau NIK kurang dari 16 digit. Makro ini menelusuri ratusan data siswa seketika dan memberi peringatan pada sel yang salah.',
    code: `' ========================================================
' MACRO VALIDASI PANJANG DIGIT NISN & NIK MASSAL
' SDN 006 INDONESIA
' Cek kebenaran data dapodik & beri tanda kuning jika keliru
' ========================================================
Sub ValidasiDigitNISNdanNIK()
    Dim ws As Worksheet
    Dim barisAkhir As Long, i As Long
    Dim strNISN As String, strNIK As String
    Dim jmlSalahNISN As Integer, jmlSalahNIK As Integer
    
    Set ws = ActiveSheet
    barisAkhir = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    If barisAkhir < 2 Then Exit Sub
    
    jmlSalahNISN = 0
    jmlSalahNIK = 0
    
    Application.ScreenUpdating = False
    
    For i = 2 To barisAkhir
        ' Asumsi: Kolom B = NISN (10 digit), Kolom C = NIK (16 digit)
        strNISN = Trim(CStr(ws.Cells(i, "B").Value))
        strNIK = Trim(CStr(ws.Cells(i, "C").Value))
        
        ' Validasi NISN (harus tepat 10 angka numerik)
        If Len(strNISN) <> 10 Or Not IsNumeric(strNISN) Then
            ws.Cells(i, "B").Interior.Color = RGB(255, 240, 150) ' Kuning peringatan
            jmlSalahNISN = jmlSalahNISN + 1
        Else
            ws.Cells(i, "B").Interior.ColorIndex = xlNone
        End If
        
        ' Validasi NIK (harus tepat 16 angka numerik)
        If Len(strNIK) <> 16 Or Not IsNumeric(strNIK) Then
            ws.Cells(i, "C").Interior.Color = RGB(255, 210, 150) ' Oranye peringatan
            jmlSalahNIK = jmlSalahNIK + 1
        Else
            ws.Cells(i, "C").Interior.ColorIndex = xlNone
        End If
    Next i
    
    Application.ScreenUpdating = True
    MsgBox "Pemeriksaan Selesai!" & vbCrLf & _
           "- NISN tidak valid: " & jmlSalahNISN & " siswa" & vbCrLf & _
           "- NIK tidak valid: " & jmlSalahNIK & " siswa" & vbCrLf & _
           "Sel yang salah telah diberi warna penanda untuk diperbaiki.", vbInformation, "Verifikasi Data SDN 006"
End Sub`,
    sampleUse: 'Klik tombol di sheet Buku Induk / Biodata Siswa',
    tips: 'Format kolom NISN dan NIK sebagai Teks di Excel agar angka 0 di depan tidak terhapus otomatis.',
    tags: ['nisn 10 digit', 'nik 16 digit', 'validasi data', 'dapodik', 'ijazah']
  },
  {
    id: 'vba-gabung-mapel',
    title: 'Macro Gabung File Rekap Nilai Guru Mapel ke 1 Leger Utama',
    category: 'Administrasi & BOS',
    summary: 'Menggabungkan otomatis file-file nilai Excel dari berbagai guru mata pelajaran (PAI, PJOK, B. Inggris) ke dalam satu lembar rekap utama tanpa salin-tempel manual.',
    explanation: 'Wali kelas tidak perlu lagi membuka satu per satu file kiriman dari guru bidang studi lalu copy-paste yang memakan waktu berjam-jam. Cukup letakkan semua file di satu folder, pilih folder tersebut, dan makro ini akan menggabungkan semuanya otomatis.',
    code: `' ========================================================
' MACRO GABUNG DATA FILE NILAI GURU MAPEL KE 1 LEGER UTAMA
' SDN 006 INDONESIA
' Menggabungkan data dari beberapa file Excel guru mata pelajaran
' ========================================================
Sub GabungNilaiGuruMapel()
    Dim folderPath As String, namaFile As String
    Dim wbSumber As Workbook, wbTujuan As Workbook
    Dim wsSumber As Worksheet, wsTujuan As Worksheet
    Dim fd As Object
    Dim barisTujuan As Long
    
    Set wbTujuan = ThisWorkbook
    Set wsTujuan = wbTujuan.Sheets("RekapSemuaMapel")
    
    ' Dialog pemilihan folder tempat berkas nilai disimpan
    Set fd = Application.FileDialog(4) ' msoFileDialogFolderPicker
    fd.Title = "Pilih Folder Berkas Nilai Guru SDN 006"
    If fd.Show = -1 Then
        folderPath = fd.SelectedItems(1) & Application.PathSeparator
    Else
        Exit Sub
    End If
    
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    namaFile = Dir(folderPath & "*.xls*")
    Do While namaFile <> ""
        If namaFile <> wbTujuan.Name Then
            Set wbSumber = Workbooks.Open(folderPath & namaFile, ReadOnly:=True)
            Set wsSumber = wbSumber.Sheets(1)
            
            barisTujuan = wsTujuan.Cells(wsTujuan.Rows.Count, "A").End(xlUp).Row + 1
            
            ' Salin baris data dari baris 2 s/d selesai
            wsSumber.Range("A2:H" & wsSumber.Cells(wsSumber.Rows.Count, "A").End(xlUp).Row).Copy _
                wsTujuan.Range("A" & barisTujuan)
                
            wbSumber.Close SaveChanges:=False
        End If
        namaFile = Dir()
    Loop
    
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    MsgBox "Seluruh berkas nilai berhasil digabungkan ke lembar RekapSemuaMapel!", vbInformation, "SDN 006 Sukses"
End Sub`,
    sampleUse: 'Jalankan dari lembar Leger RekapSemuaMapel',
    tips: 'Pastikan format kolom di semua file guru mapel seragam (misal Kolom A=No, B=NISN, C=Nama).',
    tags: ['gabung file', 'merge workbook', 'guru mapel', 'wali kelas', 'otomasi']
  }
];

export const VBA_TUTORIAL_STEPS = [
  {
    step: 1,
    title: 'Aktifkan Tab Developer di Excel',
    desc: 'Buka Microsoft Excel -> Klik File -> Options -> Customize Ribbon -> Centang kotak "Developer" di kolom kanan -> Klik OK.'
  },
  {
    step: 2,
    title: 'Buka Visual Basic Editor (VBE)',
    desc: 'Tekan tombol shortcut sakti Alt + F11 di keyboard Anda secara bersamaan, atau klik tab Developer -> klik tombol Visual Basic.'
  },
  {
    step: 3,
    title: 'Buat Module Baru & Tempel Kode',
    desc: 'Di menu atas Visual Basic Editor, klik menu Insert -> pilih Module. Tempel (Ctrl + V) kode VBA yang Anda salin dari aplikasi ini ke jendela putih yang muncul.'
  },
  {
    step: 4,
    title: 'Simpan Buku Kerja sebagai .xlsm',
    desc: 'PENTING: Simpan file Excel Anda dengan tipe format "Excel Macro-Enabled Workbook (*.xlsm)", bukan .xlsx biasa, agar kode VBA tersimpan permanen!'
  },
  {
    step: 5,
    title: 'Hubungkan Macro ke Tombol Interaktif',
    desc: 'Kembali ke lembar kerja Excel -> Tab Insert -> Shapes (pilih kotak rounded rectangle) -> Gambar tombol di sheet -> Klik kanan tombol tersebut -> Pilih "Assign Macro..." -> Pilih nama Macro Anda -> Klik OK!'
  }
];
