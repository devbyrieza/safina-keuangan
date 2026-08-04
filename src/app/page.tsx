"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, User, Eye, EyeOff, ShieldCheck, Wallet, MonitorSmartphone, Crown, Store, Users, Key, ArrowRight } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Admin Keuangan", username: "admin", password: "admin123", href: "/admin-keuangan", color: "from-[#550000] to-[#751414]", icon: <Crown className="w-6 h-6 text-[#ddc192]" /> },
  { role: "Kasir Kantin", username: "kasir", password: "kasir123", href: "/kasir", color: "from-[#380000] to-[#550000]", icon: <Store className="w-6 h-6 text-[#ddc192]" /> },
  { role: "Wali Santri", username: "wali", password: "wali123", href: "/wali-santri", color: "from-[#b89758] to-[#8c6d32]", icon: <Users className="w-6 h-6 text-white" /> },
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
    localStorage.setItem(
      "safina_login_draft",
      JSON.stringify({ username, password })
    );
  }, [username, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const acc = DEMO_ACCOUNTS.find(a => a.username === username && a.password === password);
      if (acc) {
        localStorage.removeItem("safina_login_draft");
        router.push(acc.href);
      } else {
        setError("Username atau password salah. Coba akun demo di bawah.");
        setLoading(false);
      }
    }, 800);
  };

  const quickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(true);
    setTimeout(() => router.push(acc.href), 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-6 md:py-24 relative overflow-hidden">
      {/* Background decorations - Glassmorphism & Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-400/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-maroon-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#550000]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-[#ebdcc3] rounded-3xl shadow-[0_20px_50px_rgba(85,0,0,0.08)] mb-6">
            <Building2 className="w-10 h-10 text-[#550000]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-2">
            SAFINA <span className="text-[#b89758]">KEUANGAN</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Sistem Administrasi Finansial Pesantren Al-Imam Al-Islami</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ddc192]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h2 className="text-slate-800 font-black text-2xl mb-8 flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#b89758]" /> Masuk ke Sistem
            </h2>
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Username</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Masukkan username..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#550000] focus:ring-4 focus:ring-[#550000]/10 transition-all text-base"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#550000] focus:ring-4 focus:ring-[#550000]/10 transition-all text-base"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-bold flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#550000] to-[#751414] hover:from-[#440000] hover:to-[#601010] text-white font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(85,0,0,0.35)] hover:shadow-[0_10px_40px_rgba(85,0,0,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#ddc192]" />
                )}
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>

            <div className="mt-8 p-5 bg-slate-50/80 backdrop-blur-md rounded-[1.5rem] border border-slate-200/60 relative z-10">
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-gold-500" /> Akun Demo Presentasi
              </p>
              <div className="space-y-3">
                {DEMO_ACCOUNTS.map(acc => (
                  <div key={acc.role} className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-500">{acc.icon}</div>
                      <span className="text-slate-700 font-bold">{acc.role}</span>
                    </div>
                    <span className="text-slate-500 font-mono font-medium">{acc.username} / {acc.password}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access + Features */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-10">
              <h2 className="text-slate-800 font-black text-xl mb-6 flex items-center gap-3">
                <MonitorSmartphone className="w-6 h-6 text-[#b89758]" /> Akses Cepat Demo
              </h2>
              <div className="space-y-4">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    onClick={() => quickLogin(acc)}
                    disabled={loading}
                    className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-gradient-to-r ${acc.color} hover:opacity-90 transition-all text-white text-left disabled:opacity-50 group shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1`}
                  >
                    <div className="text-white/90 bg-white/10 p-2 rounded-xl">{acc.icon}</div>
                    <div>
                      <p className="font-black text-lg text-white">{acc.role}</p>
                      <p className="text-white/80 text-sm font-medium">{acc.href}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-full">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security badges */}
            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Keamanan Sistem</p>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 group-hover:scale-110 transition-transform shrink-0"><ShieldCheck className="w-6 h-6 text-green-600" /></div>
                <div>
                  <p className="text-slate-800 text-sm font-black leading-tight">Diproteksi Midtrans</p>
                  <p className="text-slate-500 text-xs font-medium mt-1">Berizin OJK & Bank Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center border border-maroon-100 group-hover:scale-110 transition-transform shrink-0"><Wallet className="w-6 h-6 text-[#550000]" /></div>
                <div>
                  <p className="text-slate-800 text-sm font-black leading-tight">Uang Mengendap di Rekening Yayasan</p>
                  <p className="text-slate-500 text-xs font-medium mt-1">Settlement otomatis ke BSI Yayasan setiap hari</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center border border-gold-100 group-hover:scale-110 transition-transform shrink-0"><Building2 className="w-6 h-6 text-gold-600" /></div>
                <div>
                  <p className="text-slate-800 text-sm font-black leading-tight">Data Milik Pesantren 100%</p>
                  <p className="text-slate-500 text-xs font-medium mt-1">Server & database dikontrol penuh oleh pesantren</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-12 font-medium">© 2026 Ponpes Al-Imam Al-Islami · SAFINA v1.0 · Dikembangkan Secara Internal</p>
      </div>
    </div>
  );
}
