/**
 * ByteMind — Express.js API Server
 *
 * Dual-mode: uses Gemini 2.5 Flash when GEMINI_API_KEY is set,
 * otherwise falls back to a rich simulation engine.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* ================================================================
   Health-check
   ================================================================ */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: process.env.GEMINI_API_KEY ? "live" : "simulation" });
});

/* ================================================================
   POST /api/explain
   Body: { code: string, language: string }
   Returns: { summary: string, steps: { title, detail }[] }
   ================================================================ */
app.post("/api/explain", async (req, res) => {
  try {
    const { code, language, targetLanguage = "id" } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Both 'code' and 'language' are required." });
    }

    // --- Live mode: Gemini API ---
    if (process.env.GEMINI_API_KEY) {
      const result = await callGemini(code, language, targetLanguage);
      return res.json(result);
    }

    // --- Simulation mode ---
    const result = simulateExplanation(code, language, targetLanguage);
    return res.json(result);
  } catch (err) {
    console.error("[ByteMind] Error:", err.message || err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/* ================================================================
   Gemini 2.5 Flash integration
   ================================================================ */
async function callGemini(code, language, targetLanguage = "id") {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const isIndo = targetLanguage === "id";
  const systemPrompt = isIndo
    ? `You are ByteMind, an AI code tutor for absolute beginners.
Analyze the provided ${language} code and respond with a JSON object in INDONESIAN containing:
- "summary": a 2-3 sentence overview in plain, beginner-friendly language in Indonesian.
- "steps": an array of objects, each with "title" (short heading in Indonesian) and "detail" (clear explanation of what that part does and why in Indonesian).
Respond ONLY with valid JSON. No markdown fences.`
    : `You are ByteMind, an AI code tutor for absolute beginners.
Analyze the provided ${language} code and respond with a JSON object in ENGLISH containing:
- "summary": a 2-3 sentence overview in plain, beginner-friendly language.
- "steps": an array of objects, each with "title" (short heading) and "detail" (clear explanation of what that part does and why).
Respond ONLY with valid JSON. No markdown fences.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`` }] },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${errBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip possible markdown fences
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    // Fallback if Gemini returns non-JSON
    return {
      summary: text.slice(0, 300),
      steps: [{ title: isIndo ? "Respon Lengkap" : "Full Response", detail: text }],
    };
  }
}

/* ================================================================
   Simulation engine — rich, educational mock explanations
   ================================================================ */
function simulateExplanation(code, language, targetLanguage = "id") {
  const isIndo = targetLanguage === "id";
  const lines = code.split("\n").filter((l) => l.trim());
  const langLabel = {
    python: "Python", javascript: "JavaScript", java: "Java",
    cpp: "C++", html: "HTML/CSS", sql: "SQL",
  }[language] || language;

  const steps = [];

  // Detect common patterns
  const hasFunction = /\b(def |function |void |int |public )\b/.test(code);
  const hasLoop = /\b(for |while |forEach|\.map\(|\.filter\()/.test(code);
  const hasCondition = /\b(if |else |elif |switch |case )/.test(code);
  const hasVariable = /\b(let |const |var |int |float |double |string |str |=)/.test(code);
  const hasPrint = /\b(print|console\.log|System\.out|cout|printf|echo)\b/.test(code);
  const hasImport = /\b(import |from |require|include|using )\b/.test(code);
  const hasClass = /\b(class )\b/.test(code);
  const hasReturn = /\breturn\b/.test(code);
  const hasComment = /\/\/|#|\/\*|\*\/|<!--/.test(code);
  const hasArray = /\[.*\]|\barray\b|\blist\b|\bArrayList\b/.test(code);

  if (hasImport) {
    steps.push({
      title: isIndo ? "Mengimpor Dependensi" : "Importing Dependencies",
      detail: isIndo
        ? `Kode ini diawali dengan mengimpor modul atau pustaka eksternal. Dalam ${langLabel}, impor memungkinkan Anda menggunakan alat dan fungsi siap pakai yang dibuat oleh pengembang lain, sehingga Anda tidak perlu menulis semuanya dari awal.`
        : `This code starts by importing external modules or libraries. In ${langLabel}, imports allow you to use pre-built tools and functions created by other developers, so you don't have to write everything from scratch.`,
    });
  }

  if (hasVariable) {
    steps.push({
      title: isIndo ? "Mendeklarasikan Variabel" : "Declaring Variables",
      detail: isIndo
        ? `Variabel sedang dibuat untuk menyimpan data. Bayangkan variabel seperti kotak berlabel — masing-masing menampung informasi tertentu (seperti angka, teks, atau daftar) yang dapat digunakan program nanti.`
        : `Variables are being created to store data. Think of variables like labeled boxes — each one holds a specific piece of information (like a number, text, or a list) that the program can use later.`,
    });
  }

  if (hasArray) {
    steps.push({
      title: isIndo ? "Bekerja dengan Koleksi Data" : "Working with Collections",
      detail: isIndo
        ? `Kode ini menggunakan array atau list untuk menyimpan beberapa nilai terkait di satu tempat. Ini seperti memiliki daftar bernomor di mana setiap item dapat diakses berdasarkan posisinya (indeks), dimulai dari 0.`
        : `The code uses arrays or lists to store multiple related values in one place. This is like having a numbered list where each item can be accessed by its position (index), starting from 0.`,
    });
  }

  if (hasClass) {
    steps.push({
      title: isIndo ? "Mendefinisikan Kelas (Class)" : "Defining a Class",
      detail: isIndo
        ? `Sebuah kelas didefinisikan di sini, yang bertindak sebagai cetak biru untuk membuat objek. Bayangkan seperti cetakan kue — kelas mendefinisikan bentuknya, dan setiap objek (kue) yang dibuat darinya memiliki struktur yang sama tetapi dapat menyimpan nilai yang berbeda.`
        : `A class is defined here, which acts as a blueprint for creating objects. Think of it like a cookie cutter — the class defines the shape, and each object (cookie) created from it shares the same structure but can hold different values.`,
    });
  }

  if (hasFunction) {
    steps.push({
      title: isIndo ? "Mendefinisikan Fungsi" : "Defining a Function",
      detail: isIndo
        ? `Sebuah fungsi sedang didefinisikan — ini adalah blok kode yang dapat digunakan kembali untuk melakukan tugas tertentu. Fungsi membantu mengatur kode dan menghindari pengulangan. Anda dapat memanggil fungsi dengan namanya kapan pun Anda butuhkan.`
        : `A function is being defined — this is a reusable block of code that performs a specific task. Functions help organize code and avoid repetition. You can call (use) a function by its name whenever you need it.`,
    });
  }

  if (hasCondition) {
    steps.push({
      title: isIndo ? "Mengambil Keputusan (Kondisional)" : "Making Decisions (Conditionals)",
      detail: isIndo
        ? `Kode menggunakan pernyataan kondisional (if/else) untuk mengambil keputusan. Program memeriksa apakah suatu kondisi benar atau salah, lalu menjalankan kode yang berbeda tergantung jawabannya — seperti memilih jalan di persimpangan.`
        : `The code uses conditional statements (if/else) to make decisions. The program checks whether a condition is true or false, then runs different code depending on the answer — like choosing which path to take at a fork in the road.`,
    });
  }

  if (hasLoop) {
    steps.push({
      title: isIndo ? "Mengulang Tindakan (Loop)" : "Repeating Actions (Loops)",
      detail: isIndo
        ? `Loop digunakan untuk mengulangi blok kode beberapa kali. Alih-alih menulis instruksi yang sama berulang-ulang, loop secara otomatis menjalankan kode untuk setiap item dalam koleksi atau sampai suatu kondisi terpenuhi.`
        : `A loop is used to repeat a block of code multiple times. Instead of writing the same instruction over and over, the loop automatically runs the code for each item in a collection or until a condition is met.`,
    });
  }

  if (hasReturn) {
    steps.push({
      title: isIndo ? "Mengembalikan Hasil" : "Returning a Result",
      detail: isIndo
        ? `Pernyataan return mengirimkan nilai kembali ke tempat fungsi dipanggil. Ini seperti menyerahkan kembali hasil akhir dari suatu tugas — setelah fungsi mengembalikan nilai, fungsi tersebut berhenti berjalan.`
        : `The return statement sends a value back to wherever the function was called. It's like handing back the finished result of a task — once a function returns, it stops running.`,
    });
  }

  if (hasPrint) {
    steps.push({
      title: isIndo ? "Menampilkan Output" : "Displaying Output",
      detail: isIndo
        ? `Kode menampilkan informasi ke layar menggunakan pernyataan print/log. Ini adalah salah satu cara paling umum untuk melihat apa yang sedang dilakukan program Anda dan memeriksa apakah semuanya berjalan dengan benar.`
        : `The code outputs information to the screen using a print/log statement. This is one of the most common ways to see what your program is doing and to check if things are working correctly.`,
    });
  }

  if (hasComment) {
    steps.push({
      title: isIndo ? "Komentar Kode" : "Code Comments",
      detail: isIndo
        ? `Komentar adalah catatan yang ditulis oleh pemrogram untuk menjelaskan apa yang dilakukan kode. Komputer mengabaikan komentar sepenuhnya — komentar hanya ada untuk membantu manusia memahami kode dengan lebih mudah.`
        : `Comments are notes written by the programmer to explain what the code does. The computer ignores comments completely — they exist only to help humans understand the code more easily.`,
    });
  }

  // Ensure at least one step
  if (steps.length === 0) {
    steps.push({
      title: isIndo ? "Ikhtisar Kode" : "Code Overview",
      detail: isIndo
        ? `Kode ${langLabel} ini berisi ${lines.length} baris instruksi. Setiap baris memberi tahu komputer untuk melakukan tindakan tertentu, seperti menyimpan data, melakukan perhitungan, atau menampilkan hasil.`
        : `This ${langLabel} code contains ${lines.length} line(s) of instructions. Each line tells the computer to perform a specific action, such as storing data, making calculations, or displaying results.`,
    });
  }

  // Build a contextual summary
  const detectedFeatures = [];
  if (hasFunction) detectedFeatures.push(isIndo ? "definisi fungsi" : "function definitions");
  if (hasLoop) detectedFeatures.push(isIndo ? "perulangan (loop)" : "loops");
  if (hasCondition) detectedFeatures.push(isIndo ? "logika kondisional" : "conditional logic");
  if (hasVariable) detectedFeatures.push(isIndo ? "variabel" : "variables");
  if (hasPrint) detectedFeatures.push(isIndo ? "pernyataan output" : "output statements");

  const featureStr = detectedFeatures.length
    ? isIndo
      ? ` Kode ini menggunakan ${detectedFeatures.join(", ")}.`
      : ` It uses ${detectedFeatures.join(", ")}.`
    : "";

  const summary = isIndo
    ? `Ini adalah program ${langLabel} dengan ${lines.length} baris kode.${featureStr} Berikut adalah rincian langkah demi langkah tentang apa yang dilakukan setiap bagian, dijelaskan dalam bahasa sederhana untuk pemula.`
    : `This is a ${langLabel} program with ${lines.length} line(s) of code.${featureStr} Below is a step-by-step breakdown of what each part does, explained in plain language for beginners.`;

  return { summary, steps };
}

/* ================================================================
   Start server
   ================================================================ */
app.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY ? "🟢 Live (Gemini)" : "🟡 Simulation";
  console.log(`\n  ⚡ ByteMind API Server`);
  console.log(`  → Port:  ${PORT}`);
  console.log(`  → Mode:  ${mode}`);
  console.log(`  → Ready: http://localhost:${PORT}\n`);
});
