insert into public.prayer_schedule (name, time_label, status, position) values
  ('Subuh', '04:51', 'done', 1),
  ('Dzuhur', '12:12', 'done', 2),
  ('Ashar', '15:23', 'next', 3),
  ('Maghrib', '18:18', null, 4),
  ('Isya', '19:29', null, 5)
on conflict (name) do update
set time_label = excluded.time_label,
    status = excluded.status,
    position = excluded.position;

insert into public.hadith_collections (slug, name, count_label, description) values
  ('bukhari', 'Shahih Bukhari', '7.563 hadist', 'Koleksi induk untuk bab adab, iman, ilmu, dan muamalah.'),
  ('muslim', 'Shahih Muslim', '7.190 hadist', 'Tertata kuat secara sanad dan sangat nyaman untuk studi tematik.'),
  ('abudawud', 'Sunan Abu Dawud', '5.274 hadist', 'Fokus pada pembahasan hukum, ibadah, dan amal harian.'),
  ('tirmidzi', 'Jami'' At-Tirmidzi', '3.956 hadist', 'Memuat catatan kualitas hadist dan pendapat ulama secara ringkas.')
on conflict (slug) do update
set name = excluded.name,
    count_label = excluded.count_label,
    description = excluded.description;

insert into public.hadith_entries (collection_slug, number, title, narrator, grade, arabic_text, translation, summary) values
  ('muslim', 2699, 'Keutamaan majelis ilmu', 'Abu Hurairah', 'Shahih',
   'وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ...',
   'Tidaklah suatu kaum berkumpul di salah satu rumah Allah untuk membaca dan mempelajari Al-Qur''an, melainkan mereka diliputi ketenangan.',
   'Majelis ilmu menumbuhkan ketenangan, rahmat, dan adab dalam belajar.'),
  ('muslim', 2554, 'Lapang dalam urusan sesama', 'Abu Hurairah', 'Shahih', null, 'Permudah urusan saudaramu, Allah akan memudahkan urusanmu.', 'Akhlak sosial adalah bagian dari iman.'),
  ('bukhari', 8, 'Islam dibangun atas lima perkara', 'Ibnu Umar', 'Shahih', null, 'Islam dibangun atas lima perkara...', 'Landasan utama dalam syariat Islam.'),
  ('tirmidzi', 2646, 'Doa untuk penuntut ilmu', 'Anas bin Malik', 'Hasan', null, 'Semoga Allah menerangi wajah orang yang mendengar ilmu lalu menyampaikannya.', 'Ilmu yang disampaikan menjadi pahala berkelanjutan.')
on conflict (collection_slug, number) do update
set title = excluded.title,
    narrator = excluded.narrator,
    grade = excluded.grade,
    arabic_text = excluded.arabic_text,
    translation = excluded.translation,
    summary = excluded.summary;

insert into public.kitab_books (slug, title, category, level, lessons_count, cover_image, description) values
  ('mukhtashar-jiddan', 'Mukhtashar Jiddan fi Nahw', 'Nahwu', 'pemula', 24, 'https://picsum.photos/seed/kitab-nahwu-1/320/480', 'Pengantar ringkas untuk memahami isim, fi''il, dan huruf secara bertahap.'),
  ('matan-ajurumiyah', 'Matan Ajurumiyah', 'Nahwu', 'menengah', 31, 'https://picsum.photos/seed/kitab-nahwu-2/320/480', 'Matan klasik dengan struktur kokoh untuk fondasi i''rab dan tarkib.')
on conflict (slug) do update
set title = excluded.title,
    category = excluded.category,
    level = excluded.level,
    lessons_count = excluded.lessons_count,
    cover_image = excluded.cover_image,
    description = excluded.description;

insert into public.kitab_chapters (book_slug, slug, title, duration_label, position, arabic_text, translation, explanation) values
  ('mukhtashar-jiddan', 'mukadimah', 'Mukadimah', '8 menit', 1,
   'اَلْاِسْمُ يُعْرَفُ بِالْجَرِّ ...',
   'Isim dikenali dengan tanda jar dan tanda lainnya.',
   'Fokus pelajaran adalah mengenali ciri isim secara praktis.'),
  ('mukhtashar-jiddan', 'isim-dan-alamatnya', 'Isim dan Alamatnya', '14 menit', 2,
   'اَلْاِسْمُ يُعْرَفُ بِالْجَرِّ وَالتَّنْوِينِ ...',
   'Isim dikenali dengan tanda jar, tanwin, nida, alif lam, dan idhafah.',
   'Saat tanda terlihat, proses i''rab menjadi lebih terarah.'),
  ('mukhtashar-jiddan', 'fiil-dan-pembagian', 'Fi''il dan Pembagian', '16 menit', 3,
   'اَلْفِعْلُ مَا دَلَّ عَلَى مَعْنًى فِي نَفْسِهِ ...',
   'Fi''il menunjukkan makna yang terkait waktu.',
   'Pelajari pembagian fi''il madhi, mudhari'', dan amr secara bertahap.')
on conflict (book_slug, slug) do update
set title = excluded.title,
    duration_label = excluded.duration_label,
    position = excluded.position,
    arabic_text = excluded.arabic_text,
    translation = excluded.translation,
    explanation = excluded.explanation;

insert into public.surahs (slug, name, arabic, verses_count, origin, position) values
  ('al-fatihah', 'Al-Fatihah', 'الفاتحة', 7, 'Makkiyah', 1),
  ('al-kahf', 'Al-Kahf', 'الكهف', 110, 'Makkiyah', 18),
  ('ya-sin', 'Ya-Sin', 'يس', 83, 'Makkiyah', 36),
  ('ar-rahman', 'Ar-Rahman', 'الرحمن', 78, 'Madaniyah', 55),
  ('al-mulk', 'Al-Mulk', 'الملك', 30, 'Makkiyah', 67)
on conflict (slug) do update
set name = excluded.name,
    arabic = excluded.arabic,
    verses_count = excluded.verses_count,
    origin = excluded.origin,
    position = excluded.position;

insert into public.surah_ayahs (surah_slug, verse_number, arabic_text, translation, tafsir) values
  ('al-fatihah', 1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.', 'Basmalah membuka bacaan dengan adab dan tauhid.'),
  ('al-fatihah', 2, 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'Segala puji bagi Allah, Tuhan seluruh alam.', 'Fondasi syukur dan pengakuan rububiyah Allah.'),
  ('al-fatihah', 3, 'الرَّحْمَٰنِ الرَّحِيمِ', 'Yang Maha Pengasih, Maha Penyayang.', 'Rahmat Allah menjadi sumber harap seorang hamba.'),
  ('al-mulk', 1, 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ ...', 'Maha Suci Allah yang di tangan-Nya segala kerajaan...', 'Penegasan tauhid rububiyah.')
on conflict (surah_slug, verse_number) do update
set arabic_text = excluded.arabic_text,
    translation = excluded.translation,
    tafsir = excluded.tafsir;
