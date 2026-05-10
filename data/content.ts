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

export const hadithTags = ["Muttafaq 'alaih", "Majelis Ilmu", "Keutamaan"];

export const sanadNodes = ["Imam Muslim", "Abu Bakr bin Abi Syaibah", "Abu Mu'awiyah", "Al-A'masy", "Abu Shalih", "Abu Hurairah"];

export const relatedHadith = [
  { title: "Menempuh jalan ilmu", href: "/hadist/muslim/2699", number: 2699 },
  { title: "Allah memudahkan surga", href: "/hadist/bukhari/100", number: 100 },
  { title: "Doa untuk penuntut ilmu", href: "/hadist/tirmidzi/2646", number: 2646 },
];
