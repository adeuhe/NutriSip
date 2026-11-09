# NutriSip - Pemindai Nutrisi Minuman Kemasan Cerdas
> Proyek Mobile Healthtech & Nutritech — Mata Kuliah Teknopreneur

**NutriSip** adalah aplikasi mobile berbasis **React Native (Expo)** yang dirancang khusus untuk memindai dan menganalisis tabel Informasi Nilai Gizi (ING) pada berbagai produk **minuman kemasan** (botol, kaleng, dan kotak UHT). 

NutriSip membantu konsumen mendeteksi kandungan gula cair tersembunyi, natrium, dan lemak total, memberikan **titik kendali verifikasi manual (Human-in-the-Loop)** bagi pengguna, serta menyajikannya dalam bentuk **Nutri-Grade (Level A, B, C, D)** dengan kode warna yang mudah dipahami.

---

## 💡 Mengapa NutriSip & Fokus pada Minuman?
1. **Tingginya Asupan Gula Cair**: Minuman Berpemanis Dalam Kemasan (MBDK) seperti teh kemasan, kopi susu kaleng, soda, dan boba merupakan salah satu penyumbang lonjakan kasus diabetes dan obesitas tertinggi pada usia muda di Indonesia.
2. **Kesesuaian Standar Nutri-Grade**: Standar Nutri-Grade (yang diadopsi dari acuan internasional dan sheet data per 100 ml) dirancang khusus untuk mengukur kualitas nutrisi cairan minuman siap konsumsi.
3. **Penyelamat Penderita Komorbid**: Penderita diabetes dan hipertensi dapat langsung mengetahui apakah minuman yang hendak mereka teguk aman atau berbahaya.

---

## 🌟 Fitur Utama

1. **Form Pengguna & Personalisasi (Onboarding Form)**:
   - Pengguna mengisi identitas: Nama, Usia, dan Jenis Kelamin.
   - **Kondisi / Fokus Kesehatan**:
     - *Pola Sehat Seimbang* (standar umum)
     - *Diabetes (Waspada Gula Minuman)*: Memberikan peringatan tegas jika minuman berkadar gula Level C atau D.
     - *Hipertensi (Waspada Natrium Minuman)*: Peringatan jika kadar natrium tinggi (minuman isotonik/kalengan).
     - *Rendah Lemak & Krimer*: Peringatan jika lemak jenuh tinggi (kopi susu krimer/susu full cream).
   - Target batas asupan gula harian (berdasarkan anjuran Kemenkes RI maksimal 50g/hari).

2. **Scanner Kamera Minuman & Unggah Galeri**:
   - Tampilan viewfinder kamera dengan sudut laser hijau neon.
   - Ambil foto kemasan minuman langsung via kamera atau unggah dari galeri.
   - Fitur *Quick Beverage Samples* untuk menguji coba sampel minuman (Teh Botol, Susu UHT, Kopi Kaleng, Minuman Isotonik) secara instan saat demo/presentasi.

3. **Titik Kendali: Verifikasi Nilai Gizi Minuman (Langkah 3 Sistem)**:
   - Pengguna memiliki kendali penuh untuk meninjau dan mengoreksi angka pembacaan OCR (*Gula, Natrium, Lemak, Takaran Saji ml*) sebelum penilaian akhir dihitung.

4. **Kalkulator Nutri-Grade & Skor Gizi Minuman (0–100)**:
   - Menggunakan ambang batas standar (per 100 ml minuman siap konsumsi):
     - **Gula**: Level A ($\le 0.5$g), Level B ($>0.5 - 6$g), Level C ($>6 - 12.5$g), Level D ($>12.5$g).
     - **Natrium**: Level A ($\le 5$mg), Level B ($>5 - 120$mg), Level C ($>120 - 500$mg), Level D ($>500$mg).
     - **Lemak Total**: Level A ($\le 0.5$g), Level B ($>0.5 - 3$g), Level C ($>3 - 17$g), Level D ($>17$g).
   - Menghasilkan Grade A (Dark Green), Grade B (Light Green), Grade C (Yellow), Grade D (Red).

5. **Basis Data Lokal (AsyncStorage - Offline First)**:
   - Berjalan mandiri tanpa ketergantungan server berbayar.
   - Profil pengguna dan riwayat minuman tersimpan di memori lokal HP.
   - Sangat aman saat presentasi di depan dosen/penguji.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan berada di direktori `foodscan`:

```bash
cd "d:\kuliah els\Teknopreneur\foodscan"
```

### Opsi 1: Menjalankan di Smartphone Fisik (Android / iPhone) via Expo Go
1. Install aplikasi **Expo Go** dari Google Play Store atau Apple App Store.
2. Jalankan perintah di terminal:
   ```bash
   npx expo start
   ```
3. Scan QR Code yang muncul di terminal menggunakan Expo Go.
4. Aplikasi **NutriSip** akan langsung terbuka dan berjalan secara native di HP!

### Opsi 2: Menjalankan di Web Browser
```bash
npx expo start --web
```

---

## 📂 Struktur Direktori Proyek

```
foodscan/
├── App.js                         # Komponen Utama & Bottom Tab Navigation
├── app.json                       # Konfigurasi NutriSip di Expo
├── package.json                   # Dependensi Proyek
├── README.md                      # Dokumentasi Proyek
└── src/
    ├── components/
    │   ├── Header.js              # Header atas NutriSip, User Badge, Dark Mode
    │   ├── VerificationModal.js   # Langkah 3: Titik Kendali Verifikasi Angka Minuman
    │   └── ResultModal.js         # Langkah 6: Hasil Skor, Grade & Peringatan Medis
    ├── screens/
    │   ├── OnboardingScreen.js    # Form Pengisian Diri & Kondisi Kesehatan Minuman
    │   ├── HomeScreen.js          # Ringkasan Statistik & Edukasi Bahaya MBDK
    │   ├── ScannerScreen.js       # Layar Kamera Pemindai Kemasan Minuman
    │   ├── HistoryScreen.js       # Riwayat Pindaian Minuman & Filter Grade
    │   └── ProfileScreen.js       # Manajemen Profil & Target Asupan Gula
    └── services/
        ├── storage.js             # Service Database Lokal (AsyncStorage)
        └── nutritionCalculator.js # Logika Ambang Batas Nutrisi Minuman
```
