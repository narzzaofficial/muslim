export type Prayer = {
  name: string;
  time: string;
  status?: "next" | "done";
};

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/hadist", label: "Hadist" },
  { href: "/kitab", label: "Kitab" },
  { href: "/quran", label: "Qur'an" },
];

export const quickAccess = [
  {
    title: "Shalat Hari Ini",
    description: "Lihat ringkasan waktu shalat langsung dari beranda.",
    href: "/#shalat-hari-ini",
    eyebrow: "Ibadah",
  },
  {
    title: "Pusat Hadist",
    description: "Jelajahi koleksi hadist, tema pembahasan, dan ringkasan sanad secara rapi.",
    href: "/hadist",
    eyebrow: "Perpustakaan Sunnah",
  },
  {
    title: "Kitab Nahwu & Sharaf",
    description: "Belajar bertahap melalui kitab pilihan dengan progress dan pelajaran terstruktur.",
    href: "/kitab",
    eyebrow: "Studi Bahasa Arab",
  },
  {
    title: "Al-Qur'an",
    description: "Ruang baca yang nyaman untuk tilawah, tadabbur, dan melanjutkan hafalan.",
    href: "/quran",
    eyebrow: "Ruang Baca",
  },
];

export const prayerSchedule: Prayer[] = [
  { name: "Subuh", time: "04:51", status: "done" },
  { name: "Dzuhur", time: "12:12", status: "done" },
  { name: "Ashar", time: "15:23", status: "next" },
  { name: "Maghrib", time: "18:18" },
  { name: "Isya", time: "19:29" },
];

export const locations = ["Makassar", "Jakarta", "Yogyakarta", "Bandung"];
export const calculationMethods = ["Kemenag RI", "MWL", "Umm Al-Qura"];

export const continueItems = [
  {
    title: "Mukhtashar Jiddan fi Nahw",
    subtitle: "Bab Isim, halaman 18 dari 42",
    progress: 43,
    href: "/kitab/mukhtashar-jiddan/isim-dan-alamatnya",
  },
  {
    title: "Surah Al-Mulk",
    subtitle: "Ayat 12 dari 30",
    progress: 40,
    href: "/quran/al-mulk",
  },
];

export const featuredHadith = {
  collection: "Shahih Muslim",
  number: 2699,
  title: "Keutamaan majelis ilmu",
  arabic:
    "ÙˆÙŽÙ…ÙŽØ§ Ø§Ø¬Ù’ØªÙŽÙ…ÙŽØ¹ÙŽ Ù‚ÙŽÙˆÙ’Ù…ÙŒ ÙÙÙŠ Ø¨ÙŽÙŠÙ’ØªÙ Ù…ÙÙ†Ù’ Ø¨ÙÙŠÙÙˆØªÙ Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù ÙŠÙŽØªÙ’Ù„ÙÙˆÙ†ÙŽ ÙƒÙØªÙŽØ§Ø¨ÙŽ Ø§Ù„Ù„Ù‘ÙŽÙ‡Ù ÙˆÙŽÙŠÙŽØªÙŽØ¯ÙŽØ§Ø±ÙŽØ³ÙÙˆÙ†ÙŽÙ‡Ù Ø¨ÙŽÙŠÙ’Ù†ÙŽÙ‡ÙÙ…Ù’",
  translation:
    "Tidaklah suatu kaum berkumpul di salah satu rumah Allah, membaca Kitabullah dan saling mempelajarinya, melainkan ketenangan turun kepada mereka.",
  href: "/hadist/muslim/2699",
};

export const featuredSurah = {
  name: "Al-Kahf",
  arabic: "Ø§Ù„ÙƒÙ‡Ù",
  verses: 110,
  origin: "Makkiyah",
  summary: "Surah yang meneguhkan iman melalui kisah, perlindungan fitnah, dan janji petunjuk.",
  href: "/quran/al-kahf",
};

export const hadithCollections = [
  {
    slug: "bukhari",
    name: "Shahih Bukhari",
    count: "7.563 hadist",
    description: "Koleksi induk untuk bab adab, iman, ilmu, dan muamalah.",
  },
  {
    slug: "muslim",
    name: "Shahih Muslim",
    count: "7.190 hadist",
    description: "Tertata kuat secara sanad dan sangat nyaman untuk studi tematik.",
  },
  {
    slug: "abudawud",
    name: "Sunan Abu Dawud",
    count: "5.274 hadist",
    description: "Fokus pada pembahasan hukum, ibadah, dan amal harian.",
  },
  {
    slug: "tirmidzi",
    name: "Jami' At-Tirmidzi",
    count: "3.956 hadist",
    description: "Memuat catatan kualitas hadist dan pendapat ulama secara ringkas.",
  },
];

export const hadithTopics = [
  "Adab",
  "Ilmu",
  "Shalat",
  "Tazkiyah",
  "Tawakkal",
  "Keluarga",
];

export const hadithTags = ["Muttafaq 'alaih", "Majelis Ilmu", "Keutamaan"];

export type HadithListItem = {
  number: number;
  title: string;
  narrator: string;
  grade: string;
};

export const hadithByCollection: Record<string, HadithListItem[]> = {
  bukhari: [
    { number: 8, title: "Islam dibangun atas lima perkara", narrator: "Ibnu Umar", grade: "Shahih" },
    { number: 52, title: "Keutamaan ilmu sebelum berkata dan beramal", narrator: "Mu'awiyah", grade: "Shahih" },
    { number: 100, title: "Menuntut ilmu sebagai jalan kebaikan", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 6018, title: "Adab berbicara yang baik", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 6114, title: "Senyum adalah adab mulia", narrator: "Abdullah bin Harits", grade: "Shahih" },
    { number: 6407, title: "Dzikir yang dicintai Allah", narrator: "Abu Hurairah", grade: "Shahih" },
  ],
  muslim: [
    { number: 2699, title: "Keutamaan majelis ilmu", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 2554, title: "Lapang dalam urusan sesama", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 223, title: "Keutamaan wudhu", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 1828, title: "Pemimpin adalah pelayan umat", narrator: "Ibn Umar", grade: "Shahih" },
    { number: 49, title: "Cinta karena Allah", narrator: "Anas bin Malik", grade: "Shahih" },
    { number: 1017, title: "Sedekah membuka pintu kemudahan", narrator: "Abu Hurairah", grade: "Shahih" },
  ],
  abudawud: [
    { number: 3641, title: "Jalan menuntut ilmu", narrator: "Abu Darda", grade: "Hasan Shahih" },
    { number: 1526, title: "Doa setelah tasyahud", narrator: "Abu Hurairah", grade: "Shahih" },
    { number: 5105, title: "Dzikir pagi dan petang", narrator: "Abdullah bin Khubaib", grade: "Hasan" },
    { number: 4840, title: "Lemah lembut dalam muamalah", narrator: "Aisyah", grade: "Shahih" },
    { number: 4954, title: "Menjaga lisan", narrator: "Uqbah bin Amir", grade: "Hasan" },
    { number: 1470, title: "Adab berdoa", narrator: "Fadhalah bin Ubaid", grade: "Hasan Shahih" },
  ],
  tirmidzi: [
    { number: 2646, title: "Doa untuk penuntut ilmu", narrator: "Anas bin Malik", grade: "Hasan" },
    { number: 1987, title: "Akhlak terbaik", narrator: "Abu Darda", grade: "Hasan Shahih" },
    { number: 2516, title: "Jagalah Allah, Allah menjagamu", narrator: "Ibnu Abbas", grade: "Shahih" },
    { number: 3375, title: "Dzikir paling ringan di lisan", narrator: "Abu Hurairah", grade: "Hasan Shahih" },
    { number: 2302, title: "Qanaah dan kecukupan hati", narrator: "Fadhalah bin Ubaid", grade: "Hasan" },
    { number: 2165, title: "Adab meminta izin", narrator: "Abu Musa", grade: "Hasan" },
  ],
};

export const sanadNodes = [
  "Imam Muslim",
  "Abu Bakr bin Abi Syaibah",
  "Abu Mu'awiyah",
  "Al-A'masy",
  "Abu Shalih",
  "Abu Hurairah",
];

export const relatedHadith = [
  { title: "Menempuh jalan ilmu", href: "/hadist/muslim/2699", number: 2699 },
  { title: "Allah memudahkan surga", href: "/hadist/bukhari/100", number: 100 },
  { title: "Doa untuk penuntut ilmu", href: "/hadist/tirmidzi/2646", number: 2646 },
];

export const hadithQa = [
  {
    question: "Apa inti pesan hadist ini untuk pelajar?",
    answer:
      "Fokus utamanya adalah menjaga kebersamaan dalam belajar Al-Qur'an. Belajar bukan hanya menambah informasi, tapi juga menghadirkan ketenangan hati.",
  },
  {
    question: "Bagaimana cara mengamalkan hadist ini secara realistis?",
    answer:
      "Mulai dari langkah kecil: jadwalkan halaqah pekanan, baca beberapa ayat bersama, lalu diskusikan maknanya dengan adab dan saling menghormati.",
  },
  {
    question: "Kenapa disebutkan ketenangan turun?",
    answer:
      "Karena majelis ilmu yang benar membawa dampak ruhani. Ia menenangkan pikiran, menata niat, dan memudahkan kita istiqamah dalam amal.",
  },
];

export const kitabFilters = ["Semua", "Nahwu", "Sharaf", "Tamat Dibaca", "Populer"];

export const kitabBooks = [
  {
    slug: "mukhtashar-jiddan",
    title: "Mukhtashar Jiddan fi Nahw",
    category: "Nahwu",
    level: "pemula",
    lessons: 24,
    progress: 43,
    coverImage: "https://picsum.photos/seed/kitab-nahwu-1/320/480",
    description: "Pengantar ringkas untuk memahami isim, fi'il, dan huruf secara bertahap.",
  },
  {
    slug: "matan-ajurumiyah",
    title: "Matan Ajurumiyah",
    category: "Nahwu",
    level: "menengah",
    lessons: 31,
    progress: 18,
    coverImage: "https://picsum.photos/seed/kitab-nahwu-2/320/480",
    description: "Matan klasik dengan struktur kokoh untuk fondasi i'rab dan tarkib.",
  },
  {
    slug: "bina-wa-asas",
    title: "Bina wa Asas Sharaf",
    category: "Sharaf",
    level: "pemula",
    lessons: 16,
    progress: 67,
    coverImage: "https://picsum.photos/seed/kitab-sharaf-1/320/480",
    description: "Belajar wazan, tashrif, dan pola perubahan kata secara mudah diikuti.",
  },
  {
    slug: "syadzal-arf",
    title: "Syadza al-'Arf",
    category: "Sharaf",
    level: "lanjut",
    lessons: 28,
    progress: 12,
    coverImage: "https://picsum.photos/seed/kitab-sharaf-2/320/480",
    description: "Pendalaman struktur sharaf untuk pelajar yang siap naik level.",
  },
];

export const kitabChapters = [
  { slug: "mukadimah", title: "Mukadimah", duration: "8 menit", completed: true },
  { slug: "isim-dan-alamatnya", title: "Isim dan Alamatnya", duration: "14 menit", completed: true },
  { slug: "fiil-dan-pembagian", title: "Fi'il dan Pembagian", duration: "16 menit", completed: false },
  { slug: "huruf-dan-fungsi", title: "Huruf dan Fungsinya", duration: "11 menit", completed: false },
];

export const lessonConversation = [
  {
    role: "assistant",
    text: "Kita mulai dari poin inti: isim dikenali melalui tanda seperti jar, tanwin, dan nida'.",
  },
  {
    role: "user",
    text: "Kenapa tanda itu penting untuk pemula?",
  },
  {
    role: "assistant",
    text: "Karena begitu tanda terlihat, kita bisa cepat mengklasifikasikan kata tanpa menebak-nebak fungsi kalimatnya.",
  },
];

export const quranFeatured = [
  {
    slug: "ya-sin",
    name: "Yasin",
    arabic: "ÙŠØ³",
    verses: 83,
    summary: "Bacaan yang lembut untuk tadabbur, dakwah, dan penguatan hati.",
  },
  {
    slug: "ar-rahman",
    name: "Ar-Rahman",
    arabic: "Ø§Ù„Ø±Ø­Ù…Ù†",
    verses: 78,
    summary: "Surah dengan ritme indah yang menghadirkan rasa syukur dan kagum.",
  },
];

export const surahList = [
  { slug: "al-fatihah", name: "Al-Fatihah", arabic: "الفاتحة", verses: 7, origin: "Makkiyah" },
  { slug: "al-baqarah", name: "Al-Baqarah", arabic: "البقرة", verses: 286, origin: "Madaniyah" },
  { slug: "ali-imran", name: "Ali 'Imran", arabic: "آل عمران", verses: 200, origin: "Madaniyah" },
  { slug: "an-nisa", name: "An-Nisa", arabic: "النساء", verses: 176, origin: "Madaniyah" },
  { slug: "al-maidah", name: "Al-Ma'idah", arabic: "المائدة", verses: 120, origin: "Madaniyah" },
  { slug: "al-anam", name: "Al-An'am", arabic: "الأنعام", verses: 165, origin: "Makkiyah" },
  { slug: "al-araf", name: "Al-A'raf", arabic: "الأعراف", verses: 206, origin: "Makkiyah" },
  { slug: "al-anfal", name: "Al-Anfal", arabic: "الأنفال", verses: 75, origin: "Madaniyah" },
  { slug: "at-tawbah", name: "At-Tawbah", arabic: "التوبة", verses: 129, origin: "Madaniyah" },
  { slug: "yunus", name: "Yunus", arabic: "يونس", verses: 109, origin: "Makkiyah" },
  { slug: "hud", name: "Hud", arabic: "هود", verses: 123, origin: "Makkiyah" },
  { slug: "yusuf", name: "Yusuf", arabic: "يوسف", verses: 111, origin: "Makkiyah" },
  { slug: "ar-rad", name: "Ar-Ra'd", arabic: "الرعد", verses: 43, origin: "Madaniyah" },
  { slug: "ibrahim", name: "Ibrahim", arabic: "ابراهيم", verses: 52, origin: "Makkiyah" },
  { slug: "al-hijr", name: "Al-Hijr", arabic: "الحجر", verses: 99, origin: "Makkiyah" },
  { slug: "an-nahl", name: "An-Nahl", arabic: "النحل", verses: 128, origin: "Makkiyah" },
  { slug: "al-isra", name: "Al-Isra", arabic: "الإسراء", verses: 111, origin: "Makkiyah" },
  { slug: "al-kahf", name: "Al-Kahf", arabic: "الكهف", verses: 110, origin: "Makkiyah" },
  { slug: "maryam", name: "Maryam", arabic: "مريم", verses: 98, origin: "Makkiyah" },
  { slug: "taha", name: "Taha", arabic: "طه", verses: 135, origin: "Makkiyah" },
  { slug: "al-anbya", name: "Al-Anbya", arabic: "الأنبياء", verses: 112, origin: "Makkiyah" },
  { slug: "al-hajj", name: "Al-Hajj", arabic: "الحج", verses: 78, origin: "Madaniyah" },
  { slug: "al-muminun", name: "Al-Mu'minun", arabic: "المؤمنون", verses: 118, origin: "Makkiyah" },
  { slug: "an-nur", name: "An-Nur", arabic: "النور", verses: 64, origin: "Madaniyah" },
  { slug: "al-furqan", name: "Al-Furqan", arabic: "الفرقان", verses: 77, origin: "Makkiyah" },
  { slug: "ash-shuara", name: "Ash-Shu'ara", arabic: "الشعراء", verses: 227, origin: "Makkiyah" },
  { slug: "an-naml", name: "An-Naml", arabic: "النمل", verses: 93, origin: "Makkiyah" },
  { slug: "al-qasas", name: "Al-Qasas", arabic: "القصص", verses: 88, origin: "Makkiyah" },
  { slug: "al-ankabut", name: "Al-'Ankabut", arabic: "العنكبوت", verses: 69, origin: "Makkiyah" },
  { slug: "ar-rum", name: "Ar-Rum", arabic: "الروم", verses: 60, origin: "Makkiyah" },
  { slug: "luqman", name: "Luqman", arabic: "لقمان", verses: 34, origin: "Makkiyah" },
  { slug: "as-sajdah", name: "As-Sajdah", arabic: "السجدة", verses: 30, origin: "Makkiyah" },
  { slug: "al-ahzab", name: "Al-Ahzab", arabic: "الأحزاب", verses: 73, origin: "Madaniyah" },
  { slug: "saba", name: "Saba", arabic: "سبإ", verses: 54, origin: "Makkiyah" },
  { slug: "fatir", name: "Fatir", arabic: "فاطر", verses: 45, origin: "Makkiyah" },
  { slug: "ya-sin", name: "Ya-Sin", arabic: "يس", verses: 83, origin: "Makkiyah" },
  { slug: "as-saffat", name: "As-Saffat", arabic: "الصافات", verses: 182, origin: "Makkiyah" },
  { slug: "sad", name: "Sad", arabic: "ص", verses: 88, origin: "Makkiyah" },
  { slug: "az-zumar", name: "Az-Zumar", arabic: "الزمر", verses: 75, origin: "Makkiyah" },
  { slug: "ghafir", name: "Ghafir", arabic: "غافر", verses: 85, origin: "Makkiyah" },
  { slug: "fussilat", name: "Fussilat", arabic: "فصلت", verses: 54, origin: "Makkiyah" },
  { slug: "ash-shuraa", name: "Ash-Shuraa", arabic: "الشورى", verses: 53, origin: "Makkiyah" },
  { slug: "az-zukhruf", name: "Az-Zukhruf", arabic: "الزخرف", verses: 89, origin: "Makkiyah" },
  { slug: "ad-dukhan", name: "Ad-Dukhan", arabic: "الدخان", verses: 59, origin: "Makkiyah" },
  { slug: "al-jathiyah", name: "Al-Jathiyah", arabic: "الجاثية", verses: 37, origin: "Makkiyah" },
  { slug: "al-ahqaf", name: "Al-Ahqaf", arabic: "الأحقاف", verses: 35, origin: "Makkiyah" },
  { slug: "muhammad", name: "Muhammad", arabic: "محمد", verses: 38, origin: "Madaniyah" },
  { slug: "al-fath", name: "Al-Fath", arabic: "الفتح", verses: 29, origin: "Madaniyah" },
  { slug: "al-hujurat", name: "Al-Hujurat", arabic: "الحجرات", verses: 18, origin: "Madaniyah" },
  { slug: "qaf", name: "Qaf", arabic: "ق", verses: 45, origin: "Makkiyah" },
  { slug: "adh-dhariyat", name: "Adh-Dhariyat", arabic: "الذاريات", verses: 60, origin: "Makkiyah" },
  { slug: "at-tur", name: "At-Tur", arabic: "الطور", verses: 49, origin: "Makkiyah" },
  { slug: "an-najm", name: "An-Najm", arabic: "النجم", verses: 62, origin: "Makkiyah" },
  { slug: "al-qamar", name: "Al-Qamar", arabic: "القمر", verses: 55, origin: "Makkiyah" },
  { slug: "ar-rahman", name: "Ar-Rahman", arabic: "الرحمن", verses: 78, origin: "Madaniyah" },
  { slug: "al-waqiah", name: "Al-Waqi'ah", arabic: "الواقعة", verses: 96, origin: "Makkiyah" },
  { slug: "al-hadid", name: "Al-Hadid", arabic: "الحديد", verses: 29, origin: "Madaniyah" },
  { slug: "al-mujadila", name: "Al-Mujadila", arabic: "المجادلة", verses: 22, origin: "Madaniyah" },
  { slug: "al-hashr", name: "Al-Hashr", arabic: "الحشر", verses: 24, origin: "Madaniyah" },
  { slug: "al-mumtahanah", name: "Al-Mumtahanah", arabic: "الممتحنة", verses: 13, origin: "Madaniyah" },
  { slug: "as-saf", name: "As-Saf", arabic: "الصف", verses: 14, origin: "Madaniyah" },
  { slug: "al-jumuah", name: "Al-Jumu'ah", arabic: "الجمعة", verses: 11, origin: "Madaniyah" },
  { slug: "al-munafiqun", name: "Al-Munafiqun", arabic: "المنافقون", verses: 11, origin: "Madaniyah" },
  { slug: "at-taghabun", name: "At-Taghabun", arabic: "التغابن", verses: 18, origin: "Madaniyah" },
  { slug: "at-talaq", name: "At-Talaq", arabic: "الطلاق", verses: 12, origin: "Madaniyah" },
  { slug: "at-tahrim", name: "At-Tahrim", arabic: "التحريم", verses: 12, origin: "Madaniyah" },
  { slug: "al-mulk", name: "Al-Mulk", arabic: "الملك", verses: 30, origin: "Makkiyah" },
  { slug: "al-qalam", name: "Al-Qalam", arabic: "القلم", verses: 52, origin: "Makkiyah" },
  { slug: "al-haqqah", name: "Al-Haqqah", arabic: "الحاقة", verses: 52, origin: "Makkiyah" },
  { slug: "al-maarij", name: "Al-Ma'arij", arabic: "المعارج", verses: 44, origin: "Makkiyah" },
  { slug: "nuh", name: "Nuh", arabic: "نوح", verses: 28, origin: "Makkiyah" },
  { slug: "al-jinn", name: "Al-Jinn", arabic: "الجن", verses: 28, origin: "Makkiyah" },
  { slug: "al-muzzammil", name: "Al-Muzzammil", arabic: "المزمل", verses: 20, origin: "Makkiyah" },
  { slug: "al-muddaththir", name: "Al-Muddaththir", arabic: "المدثر", verses: 56, origin: "Makkiyah" },
  { slug: "al-qiyamah", name: "Al-Qiyamah", arabic: "القيامة", verses: 40, origin: "Makkiyah" },
  { slug: "al-insan", name: "Al-Insan", arabic: "الانسان", verses: 31, origin: "Madaniyah" },
  { slug: "al-mursalat", name: "Al-Mursalat", arabic: "المرسلات", verses: 50, origin: "Makkiyah" },
  { slug: "an-naba", name: "An-Naba", arabic: "النبإ", verses: 40, origin: "Makkiyah" },
  { slug: "an-naziat", name: "An-Nazi'at", arabic: "النازعات", verses: 46, origin: "Makkiyah" },
  { slug: "abasa", name: "'Abasa", arabic: "عبس", verses: 42, origin: "Makkiyah" },
  { slug: "at-takwir", name: "At-Takwir", arabic: "التكوير", verses: 29, origin: "Makkiyah" },
  { slug: "al-infitar", name: "Al-Infitar", arabic: "الإنفطار", verses: 19, origin: "Makkiyah" },
  { slug: "al-mutaffifin", name: "Al-Mutaffifin", arabic: "المطففين", verses: 36, origin: "Makkiyah" },
  { slug: "al-inshiqaq", name: "Al-Inshiqaq", arabic: "الإنشقاق", verses: 25, origin: "Makkiyah" },
  { slug: "al-buruj", name: "Al-Buruj", arabic: "البروج", verses: 22, origin: "Makkiyah" },
  { slug: "at-tariq", name: "At-Tariq", arabic: "الطارق", verses: 17, origin: "Makkiyah" },
  { slug: "al-ala", name: "Al-A'la", arabic: "الأعلى", verses: 19, origin: "Makkiyah" },
  { slug: "al-ghashiyah", name: "Al-Ghashiyah", arabic: "الغاشية", verses: 26, origin: "Makkiyah" },
  { slug: "al-fajr", name: "Al-Fajr", arabic: "الفجر", verses: 30, origin: "Makkiyah" },
  { slug: "al-balad", name: "Al-Balad", arabic: "البلد", verses: 20, origin: "Makkiyah" },
  { slug: "ash-shams", name: "Ash-Shams", arabic: "الشمس", verses: 15, origin: "Makkiyah" },
  { slug: "al-layl", name: "Al-Layl", arabic: "الليل", verses: 21, origin: "Makkiyah" },
  { slug: "ad-duhaa", name: "Ad-Duhaa", arabic: "الضحى", verses: 11, origin: "Makkiyah" },
  { slug: "ash-sharh", name: "Ash-Sharh", arabic: "الشرح", verses: 8, origin: "Makkiyah" },
  { slug: "at-tin", name: "At-Tin", arabic: "التين", verses: 8, origin: "Makkiyah" },
  { slug: "al-alaq", name: "Al-'Alaq", arabic: "العلق", verses: 19, origin: "Makkiyah" },
  { slug: "al-qadr", name: "Al-Qadr", arabic: "القدر", verses: 5, origin: "Makkiyah" },
  { slug: "al-bayyinah", name: "Al-Bayyinah", arabic: "البينة", verses: 8, origin: "Madaniyah" },
  { slug: "az-zalzalah", name: "Az-Zalzalah", arabic: "الزلزلة", verses: 8, origin: "Madaniyah" },
  { slug: "al-adiyat", name: "Al-'Adiyat", arabic: "العاديات", verses: 11, origin: "Makkiyah" },
  { slug: "al-qariah", name: "Al-Qari'ah", arabic: "القارعة", verses: 11, origin: "Makkiyah" },
  { slug: "at-takathur", name: "At-Takathur", arabic: "التكاثر", verses: 8, origin: "Makkiyah" },
  { slug: "al-asr", name: "Al-'Asr", arabic: "العصر", verses: 3, origin: "Makkiyah" },
  { slug: "al-humazah", name: "Al-Humazah", arabic: "الهمزة", verses: 9, origin: "Makkiyah" },
  { slug: "al-fil", name: "Al-Fil", arabic: "الفيل", verses: 5, origin: "Makkiyah" },
  { slug: "quraysh", name: "Quraysh", arabic: "قريش", verses: 4, origin: "Makkiyah" },
  { slug: "al-maun", name: "Al-Ma'un", arabic: "الماعون", verses: 7, origin: "Makkiyah" },
  { slug: "al-kawthar", name: "Al-Kawthar", arabic: "الكوثر", verses: 3, origin: "Makkiyah" },
  { slug: "al-kafirun", name: "Al-Kafirun", arabic: "الكافرون", verses: 6, origin: "Makkiyah" },
  { slug: "an-nasr", name: "An-Nasr", arabic: "النصر", verses: 3, origin: "Madaniyah" },
  { slug: "al-masad", name: "Al-Masad", arabic: "المسد", verses: 5, origin: "Makkiyah" },
  { slug: "al-ikhlas", name: "Al-Ikhlas", arabic: "الإخلاص", verses: 4, origin: "Makkiyah" },
  { slug: "al-falaq", name: "Al-Falaq", arabic: "الفلق", verses: 5, origin: "Makkiyah" },
  { slug: "an-nas", name: "An-Nas", arabic: "الناس", verses: 6, origin: "Makkiyah" },
];

export const ayatSample = [
  {
    number: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
    tafsir: "Basmalah membuka bacaan dengan adab, tauhid, dan kesadaran bahwa setiap amal dimulai atas nama Allah.",
  },
  {
    number: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "Segala puji bagi Allah, Tuhan seluruh alam.",
    tafsir: "Ayat ini menanamkan fondasi syukur dan pengakuan rububiyah Allah atas seluruh ciptaan.",
  },
  {
    number: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "Yang Maha Pengasih, Maha Penyayang.",
    tafsir: "Pengulangan sifat rahmat menumbuhkan harap dan kedekatan hati hamba kepada Rabb-nya.",
  },
];

export function getCollection(slug: string) {
  return hadithCollections.find((item) => item.slug === slug) ?? hadithCollections[1];
}

export function getHadithItems(slug: string) {
  return hadithByCollection[slug] ?? hadithByCollection.muslim;
}

export function getBook(slug: string) {
  return kitabBooks.find((item) => item.slug === slug) ?? kitabBooks[0];
}

export function getSurah(slug: string) {
  return surahList.find((item) => item.slug === slug) ?? surahList[1];
}


