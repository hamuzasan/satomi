export type SatomiNavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "chat" | "add" | "pockets" | "profile" | "history";
};

export type SatomiStat = {
  label: string;
  value: string;
  detail: string;
  tone: "cyan" | "purple" | "green" | "amber" | "error";
};

export type SatomiPocket = {
  id: string;
  name: string;
  amount: string;
  limit: string;
  progress: number;
  tone: "cyan" | "purple" | "green" | "amber" | "error";
  status: string;
};

export type SatomiGoal = {
  id: string;
  name: string;
  collected: string;
  target: string;
  progress: number;
  deadline: string;
};

export type SatomiBill = {
  id: string;
  name: string;
  amount: string;
  due: string;
  status: "Segera" | "Belum dibayar" | "Lunas";
};

export type SatomiTransaction = {
  id: string;
  title: string;
  pocket: string;
  amount: string;
  type: "masuk" | "keluar" | "pindah";
  time: string;
};

export const satomiUser = {
  name: "Hamzah",
  status: "Satomi aktif",
  plan: "Member Premium",
};

export const satomiNavItems: SatomiNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Chat", href: "/chat", icon: "chat" },
  { label: "Catat", href: "/chat", icon: "add" },
  { label: "Pockets", href: "/pockets", icon: "pockets" },
  { label: "Profil", href: "/settings", icon: "profile" },
];

export const satomiStats: SatomiStat[] = [
  {
    label: "Sisa budget",
    value: "Rp1.225.000",
    detail: "Bulan ini",
    tone: "cyan",
  },
  {
    label: "Pemasukan",
    value: "Rp2.500.000",
    detail: "2 sumber aktif",
    tone: "green",
  },
  {
    label: "Pengeluaran",
    value: "Rp1.275.000",
    detail: "Turun 8%",
    tone: "purple",
  },
  {
    label: "Skor sehat",
    value: "78/100",
    detail: "Stabil",
    tone: "amber",
  },
];

export const satomiPockets: SatomiPocket[] = [
  {
    id: "kebutuhan-harian",
    name: "Kebutuhan Harian",
    amount: "Rp3,2 jt",
    limit: "Rp5 jt",
    progress: 62,
    tone: "cyan",
    status: "Stabil",
  },
  {
    id: "tagihan",
    name: "Tagihan",
    amount: "Rp4,2 jt",
    limit: "Rp5 jt",
    progress: 72,
    tone: "amber",
    status: "Aman",
  },
  {
    id: "tabungan",
    name: "Tabungan",
    amount: "Rp12 jt",
    limit: "Rp50 jt",
    progress: 70,
    tone: "green",
    status: "Naik",
  },
  {
    id: "self-reward",
    name: "Self-Reward",
    amount: "Rp270 rb",
    limit: "Rp300 rb",
    progress: 90,
    tone: "purple",
    status: "Hampir limit",
  },
];

export const satomiGoals: SatomiGoal[] = [
  {
    id: "dana-jepang",
    name: "Dana Jepang",
    collected: "Rp13.000.000",
    target: "Rp20.000.000",
    progress: 65,
    deadline: "Des 2024",
  },
  {
    id: "dana-darurat",
    name: "Dana Darurat",
    collected: "Rp10.000.000",
    target: "Rp50.000.000",
    progress: 20,
    deadline: "Aktif",
  },
];

export const satomiBills: SatomiBill[] = [
  {
    id: "internet",
    name: "Internet",
    amount: "Rp250.000",
    due: "Jatuh tempo 5 Okt",
    status: "Segera",
  },
  {
    id: "listrik",
    name: "Listrik",
    amount: "Rp180.000",
    due: "Jatuh tempo 10 Okt",
    status: "Belum dibayar",
  },
  {
    id: "spotify",
    name: "Spotify",
    amount: "Rp55.000",
    due: "Jatuh tempo 10 Okt",
    status: "Lunas",
  },
];

export const satomiTransactions: SatomiTransaction[] = [
  {
    id: "ayam-geprek",
    title: "Ayam geprek",
    pocket: "Kebutuhan Harian",
    amount: "-Rp35.000",
    type: "keluar",
    time: "Hari ini, 12:30",
  },
  {
    id: "gaji-freelance",
    title: "Gaji freelance",
    pocket: "Utama",
    amount: "+Rp500.000",
    type: "masuk",
    time: "Kemarin, 09:15",
  },
];
