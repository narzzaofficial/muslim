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

export const hadithTopics = ["Adab", "Ilmu", "Shalat", "Tazkiyah", "Tawakkal", "Keluarga"];

export const hadithTags = ["Muttafaq 'alaih", "Majelis Ilmu", "Keutamaan"];

export const sanadNodes = ["Imam Muslim", "Abu Bakr bin Abi Syaibah", "Abu Mu'awiyah", "Al-A'masy", "Abu Shalih", "Abu Hurairah"];

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

export const kitabFilters = ["Semua", "Nahwu", "Sharaf", "Populer"];

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
