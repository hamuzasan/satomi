import {
  Bell,
  Bot,
  ChevronRight,
  Database,
  Heart,
  Landmark,
  LockKeyhole,
  Shield,
  SlidersHorizontal,
  Smile,
  Zap,
} from "lucide-react";

export const settingsSections = [
  {
    title: "Asisten AI",
    items: [
      {
        title: "Persona Satomi",
        description: "Sesuaikan gaya komunikasi SATOMI",
        href: "/settings/persona",
        icon: Bot,
        tone: "purple",
      },
    ],
  },
  {
    title: "Preferensi",
    items: [
      {
        title: "Preferensi Keuangan",
        description: "Mata uang dasar dan target finansial",
        href: "/goals",
        icon: Landmark,
        tone: "cyan",
      },
      {
        title: "Deteksi transaksi otomatis",
        description: "Izin notifikasi dan deteksi transaksi",
        href: "/settings/notification-intercept",
        icon: Bell,
        tone: "cyan",
      },
    ],
  },
  {
    title: "Keamanan & Data",
    items: [
      {
        title: "Keamanan",
        description: "Password, PIN, dan biometrik",
        href: "/settings/privacy",
        icon: LockKeyhole,
        tone: "cyan",
      },
      {
        title: "Privasi & Data",
        description: "Pengelolaan data personal Anda",
        href: "/settings/privacy",
        icon: Shield,
        tone: "cyan",
      },
    ],
  },
];

export const personaOptions = [
  {
    title: "Lembut & suportif",
    description: "Empatik, mendorong, dan fokus pada penguatan positif.",
    icon: Heart,
  },
  {
    title: "Tegas tapi sopan",
    description: "Langsung, profesional, dan fokus pada akuntabilitas.",
    icon: Shield,
  },
  {
    title: "Santai & ramah",
    description: "Akrab, ringan, dan tetap jelas saat memberi nudge.",
    icon: Smile,
    selected: true,
  },
  {
    title: "Minimal & langsung",
    description: "Data dulu, singkat, dan tanpa basa-basi.",
    icon: Zap,
  },
];

export const privacyCards = [
  {
    title: "Data Transaksi",
    description: "Unduh salinan transaksi Anda atau hapus riwayat tertentu.",
    icon: Database,
    actions: ["Export CSV", "Kelola arsip"],
  },
  {
    title: "Transparansi Data",
    description: "Lihat laporan tentang bagaimana SATOMI melindungi enkripsi data.",
    icon: Shield,
    actions: ["Baca laporan"],
  },
  {
    title: "Pemrosesan AI",
    description: "Izinkan data anonim digunakan untuk meningkatkan akurasi wawasan finansial.",
    icon: SlidersHorizontal,
    enabled: true,
    actions: ["Aktif"],
  },
  {
    title: "Riwayat Chat AI",
    description: "Simpan riwayat percakapan agar Satomi punya konteks yang lebih baik.",
    icon: Bot,
    enabled: true,
    actions: ["Bersihkan riwayat"],
  },
];

export const ChevronIcon = ChevronRight;
