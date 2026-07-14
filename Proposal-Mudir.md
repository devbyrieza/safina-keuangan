# EXECUTIVE SUMMARY & ROADMAP: SISTEM KEUANGAN TERPADU PESANTREN AL-IMAM AL-ISLAMI

**Kepada Yth. Mudir Pesantren Al-Imam Al-Islami**

Bismillah,
Semoga Ustadz senantiasa berada dalam lindungan Allah Ta'ala dan diberikan kemudahan dalam memimpin Pesantren Al-Imam Al-Islami.

Menindaklanjuti arahan strategis Ustadz pada pertemuan terakhir, bersama ini saya paparkan *Blueprint* dan Peta Jalan (*Roadmap*) tata kelola keuangan digital pesantren kita yang bernama **SAFINA** (Sistem Administrasi Finansial Al-Imam).

---

## 1. Strategi Pengamanan Angkatan Pertama
Kebijakan Ustadz untuk tetap menggunakan aplikasi **PSP** pada Angkatan Pertama ini adalah langkah manajerial yang sangat cermat demi memastikan kelancaran administrasi sembari melengkapi seluruh legalitas Yayasan.

Selama Angkatan Pertama berjalan, Tim IT dan Tim Finance akan melakukan **Observasi Lapangan Terpadu**. Kami akan mencatat semua kendala, kebocoran, dan kekurangan fitur di PSP (seperti: fitur admin finance yang kurang lengkap dan kurang *user-friendly*, biaya langganan tambahan, serta limitasi metode pembayaran). Seluruh evaluasi ini akan menjadi landasan mutlak untuk menyempurnakan fitur SAFINA.

## 2. SAFINA: Keamanan Dana & Alur "Nol Rupiah"
Merespons catatan Ustadz mengenai biaya Admin Payment Gateway (MDR QRIS 0,7% dan VA Rp 4.000) yang dirasa akan membebani Wali Santri, saya telah melakukan riset mendalam dan menemukan **Solusi Pamungkas** yang sangat hemat, tanpa mengorbankan keamanan sedikit pun.

Kita akan menggunakan **Integrasi API Cek Mutasi Otomatis (Direct to BSI)**. Dengan sistem ini, SAFINA murni hanya menjadi "Buku Catatan Digital" yang cerdas.

### Menjawab Kekhawatiran Ustadz Tentang Pendirian PT
Sebelumnya Ustadz mengkhawatirkan bahwa saya harus memiliki izin PT (Perseroan Terbatas). Kekhawatiran ini sangat tepat **JIKA** SAFINA menampung uang. Namun, dengan metode Cek Mutasi, SAFINA murni hanya "Software Pembaca". Uang ditransfer **LANGSUNG ke Rekening BSI Yayasan**. Tidak ada uang mampir ke rekening saya atau pihak ketiga. Oleh karena itu, kita **TIDAK PERLU mendirikan PT baru**.

### Bagaimana Aliran Dana dan Kode Uniknya?
1. Wali Santri mentransfer via BSI Mobile/BI-Fast langsung ke **Rekening Utama BSI Yayasan**.
2. SAFINA membuatkan **Kode Unik** (persis seperti aplikasi Flip). Contoh: Tagihan Rp 1.000.000, Wali Santri transfer **Rp 1.000.012**.
3. Robot Cek Mutasi mendeteksi uang masuk (Rp 1.000.012) secara otomatis.
4. **Ke Mana Perginya Kode Unik (Rp 12)?** Uang fisik Rp 1.000.012 seutuhnya masuk ke satu Rekening BSI Yayasan (**TIDAK PERLU rekening kedua**). SAFINA hanya memisahkan pembukuannya: Rp 1.000.000 melunasi SPP, dan sisa Rp 12 rupiah tercatat sebagai **"Kas Sedekah Yayasan"** (atau disetting menjadi **"Poin Saldo Santri"**).

**Kesimpulan Keamanan:** Uang bermuara di BSI Yayasan tanpa mampir pihak ketiga, tanpa biaya admin, dan tanpa mengendap di pembuat aplikasi.

## 3. Efisiensi Biaya Ekstrim (Game Changer)
Perbedaan mendasar sistem SAFINA dengan Payment Gateway (Midtrans/PSP) terletak pada beban biaya:

> [!TIP]
> **💡 Mengapa ini Sangat Menguntungkan?**
> - **Biaya Admin untuk Wali Santri = Rp 0 (Gratis)**. Wali santri tidak lagi dikenakan biaya admin Rp 3.000 - Rp 7.000 per transaksi. Cukup transfer sesama BSI.
> - **Biaya Yayasan Sangat Rendah (Flat)**. Biaya langganan API Cek Mutasi berkisar di angka **Rp 45.000 per bulan (Flat)**, berapa ribu kali pun transaksi terjadi. Jauh lebih murah dibanding PSP atau Payment Gateway yang memotong biaya *per transaksi*.
> - **Tanpa Biaya Pembuatan Software (Vendor Cost)**. SAFINA dikembangkan 100% mandiri (In-House) oleh Tim IT Al-Imam. Yayasan terbebas dari biaya pengadaan software senilai puluhan juta rupiah.

## 4. Fitur Unggulan & Persiapan SAFINA v1.0
Berbekal observasi atas kelemahan PSP pada Angkatan Pertama ini, SAFINA v1.0 akan hadir dengan perbaikan menyeluruh:
- **Kartu Santri Cashless Terintegrasi:** Aman dari kehilangan dan pencurian di lingkungan pondok.
- **Super-Admin Finance:** Pak Bachtiar dan tim akan memiliki kontrol penuh tanpa perlu *request* ke vendor eksternal.
- **Dashboard Eksekutif Mudir:** Tampilan khusus untuk Ustadz agar dapat memantau **Omzet Kantin, Saldo Mengendap, dan Arus Kas** secara *Real-Time* langsung dari ruangan Mudir.

---

**Penutup**

Langkah kita sangat terukur. Angkatan Pertama kita gunakan untuk *Play Safe* dan observasi, sambil Tim IT menyempurnakan koding SAFINA v1.0 di belakang layar. Saat kita siap melakukan migrasi nanti, SAFINA sudah menjadi sistem yang tanpa celah, murah, dan sepenuhnya milik Al-Imam.

Jazaakumullahu khairan atas kepercayaan dan arahan strategis Ustadz.

Hormat saya,

**Rieza Eka Tomara**  
Kasi IT  
Pesantren Al-Imam Al-Islami Managed by Al Andalus IIBS
