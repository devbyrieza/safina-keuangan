// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Wallet,
  MonitorSmartphone,
  Crown,
  Store,
  Users,
  Key,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "Mudir Pesantren",
    username: "wahabrajasam",
    password: "2026#@",
    href: "/admin-keuangan",
    badge: "Pimpinan",
    color: "bg-[#550000] text-white",
    icon: <Crown className="w-5 h-5 text-[#ddc192]" />
  },
  {
    role: "Admin Keuangan",
    username: "admin",
    password: "admin123",
    href: "/admin-keuangan",
    badge: "Keuangan",
    color: "bg-[#400000] text-white",
    icon: <Wallet className="w-5 h-5 text-[#ddc192]" />
  },
  {
    role: "Kasir Kantin",
    username: "kasir",
    password: "kasir123",
    href: "/kasir",
    badge: "POS Kantin",
    color: "bg-slate-900 text-white",
    icon: <Store className="w-5 h-5 text-[#ddc192]" />
  },
  {
    role: "Wali Santri",
    username: "wali",
    password: "wali123",
    href: "/wali-santri",
    badge: "Orang Tua",
    color: "bg-[#ddc192] text-[#550000]",
    icon: <Users className="w-5 h-5 text-[#550000]" />
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const draft = localStorage.getItem("safina_login_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.password) setPassword(parsed.password);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (username || password) {
      localStorage.setItem(
        "safina_login_draft",
        JSON.stringify({ username, password })
      );
    }
  }, [username, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        (username === "wahabrajasam" ||
          username === "prof.wahabrajasam35@gmail.com" ||
          username === "081326611671") &&
        password === "2026#@"
      ) {
        localStorage.removeItem("safina_login_draft");
        router.push("/admin-keuangan");
        return;
      }
      const acc = DEMO_ACCOUNTS.find(
        (a) => a.username === username && a.password === password
      );
      if (acc) {
        localStorage.removeItem("safina_login_draft");
        router.push(acc.href);
      } else {
        setError("Username atau password salah. Silakan coba lagi.");
        setLoading(false);
      }
    }, 600);
  };

  const quickLogin = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("safina_login_draft");
      router.push(acc.href);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white py-10 sm:py-16 px-4 font-sans relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGwwIDYwIi8+PC9nPjwvc3ZnPg==')] opacity-70 pointer-events-none" />

      {/* Top Navigation Pills (OMI Standard) */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-3 mb-6 relative z-10">
        <a
          href="https://pesantren-alimam.com"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs text-xs font-extrabold uppercase tracking-wider text-slate-700 hover:text-[#550000] hover:border-[#550000]/40 transition-all hover:-translate-y-0.5"
        >
          <span>← Beranda Utama Al-Imam</span>
        </a>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SAFINA &bull; Portal Keuangan &amp; Dompet Santri</span>
        </div>
      </div>

      <div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── LEFT COLUMN: TWO-SECTION OMI LOGIN CARD ─── */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 border border-slate-200 bg-white">
          
          {/* Section 1: Dark Maroon Gradient Header */}
          <div className="bg-gradient-to-br from-[#2D0000] via-[#400000] to-[#550000] p-7 sm:p-9 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#ddc192]/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 mx-auto shadow-md border border-white/20 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Al-Imam"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  SAFINA AL-IMAM
                </h1>
                <p className="text-xs text-[#ddc192] font-semibold mt-0.5">
                  Sistem Administrasi Finansial &amp; Dompet Santri
                </p>
              </div>
              <p className="text-xs text-slate-200 font-medium max-w-md mx-auto leading-relaxed">
                Pusat pengelolaan tagihan SPP, tabungan, uang jajan digital, dan kasir kantin Pesantren Al Imam Al Islami.
              </p>
            </div>
          </div>

          {/* Section 2: White Body Card */}
          <div className="p-7 sm:p-9 space-y-5 bg-white">
            
            {/* Info Banner Box */}
            <div className="p-3.5 rounded-2xl bg-[#ddc192]/15 border border-[#ddc192]/40 text-xs text-[#550000] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#550000] shrink-0" />
              <span className="font-medium leading-relaxed">
                Login menggunakan <strong>Username / Email / No. WA</strong> yang telah terdaftar.
              </span>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Input Identifier */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <span>Username / Email / No. WA</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    disabled={loading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username / Email / No. WA..."
                    className="w-full h-12 pl-4 pr-10 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-[#550000] focus:ring-4 focus:ring-[#550000]/10 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <span>Kata Sandi</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full h-12 pl-4 pr-11 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-[#550000] focus:ring-4 focus:ring-[#550000]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#550000] hover:bg-[#400000] text-white font-extrabold text-sm shadow-md shadow-[#550000]/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem SAFINA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Card Info */}
            <div className="pt-3 border-t border-slate-100 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Terhubung dengan Settlement Bank Syariah Indonesia (BSI)</span>
              </div>
            </div>

          </div>

        </div>

        {/* ─── RIGHT COLUMN: QUICK ROLE ACCESS + SECURITY BADGES ─── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Demo Access Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4 text-[#550000]" />
                <span>Akses Cepat Demo / Presentasi</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Multi-Role
              </span>
            </div>

            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => quickLogin(acc)}
                  disabled={loading}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#550000] hover:bg-slate-50 transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {acc.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#550000] transition-colors">
                        {acc.role}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        {acc.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {acc.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#550000] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Security & Finance Trust Badges */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Jaminan Keamanan Finansial
            </span>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900">Payment Gateway Midtrans</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tersertifikasi Bank Indonesia &amp; Otoritas Jasa Keuangan (OJK).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-[#550000]/10 text-[#550000] flex items-center justify-center shrink-0 mt-0.5 border border-[#550000]/20">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900">Rekening Resmi Pesantren</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Seluruh dana langsung masuk ke rekening BSI Yayasan tanpa perantara.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <p className="text-center text-xs text-slate-400 mt-8 font-medium">
        &copy; 2026 Pesantren Al-Imam Al-Islami &bull; SAFINA v1.0
      </p>

    </main>
  );
}
