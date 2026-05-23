# ByteMind ⚡

> **Pahami Kode Lebih Cerdas** — Platform berbasis AI yang membantu pemula memahami kode pemrograman dengan penjelasan langkah demi langkah yang jelas dan mudah dipahami.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4-green?logo=express)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)

---

## 🚀 Cara Memulai (Getting Started)

### Prasyarat
- **Node.js** (versi 18+) dan **npm** sudah terinstal di komputer Anda.
- (Opsional) API Key Gemini dari [Google AI Studio](https://aistudio.google.com/apikey). Jika dikosongkan, aplikasi akan berjalan menggunakan **Mode Simulasi**.

### Instalasi dan Menjalankan Aplikasi
Aplikasi ini sudah dikonfigurasi untuk menjalankan Frontend dan Backend secara bersamaan hanya dengan satu perintah.

**1. Instalasi Dependensi**
Buka terminal di direktori utama (`bytemind/`), lalu jalankan perintah berikut untuk menginstal dependensi:
```bash
# Instal dependensi frontend (dan concurrently)
npm install

# Instal dependensi backend
npm --prefix server install
```

**2. Konfigurasi Environment Variables**
Siapkan konfigurasi environment untuk aplikasi:
- Buat file `.env.local` di folder **root**:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```
- Buat file `.env` di dalam folder **`server/`**:
  ```env
  PORT=5000
  GEMINI_API_KEY=KUNCI_API_ANDA_DISINI # Kosongkan untuk Mode Simulasi
  ```

**3. Jalankan Aplikasi**
Cukup jalankan satu perintah ini di direktori utama:
```bash
npm run dev
```
*Selesai! Frontend kini berjalan di http://localhost:3000 dan Backend API berjalan di http://localhost:5000.*

---

## 🛠️ Teknologi Utama
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, TypeScript
- **Backend**: Express.js
- **AI Engine**: Gemini API (Live Mode) & ByteMind Simulation Engine (Offline)
- **Fitur Andalan**: Mode Gelap/Terang Otomatis, Dukungan Bilingual (Bahasa Indonesia & Inggris), Desain antarmuka Glassmorphism bergaya premium.

---

## 📄 Lisensi
Lisensi MIT — Bebas dikembangkan dan digunakan untuk tujuan pembelajaran.
