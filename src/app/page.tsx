"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, User, Eye, EyeOff, ShieldCheck, Wallet, MonitorSmartphone, Crown, Store, Users, Key } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Admin Keuangan", username: "admin", password: "admin123", href: "/admin-keuangan", color: "from-gold-500 to-amber-600", icon: <Crown className="w-6 h-6" /> },
  { role: "Kasir Kantin", username: "kasir", password: "kasir123", href: "/kasir", color: "from-blue-500 to-blue-700", icon: <Store className="w-6 h-6" /> },
  { role: "Wali Santri", username: "wali", password: "wali123", href: "/wali-santri", color: "from-maroon-600 to-maroon-800", icon: <Users className="w-6 h-6" /> },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const acc = DEMO_ACCOUNTS.find(a => a.username === username && a.password === password);
      if (acc) {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-maroon-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 mb-4">
            <Building2 className="w-8 h-8 text-maroon-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            SAFINA <span className="text-gold-500">KEUANGAN</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Sistem Administrasi Finansial Pesantren Al-Imam Al-Islami</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
            <h2 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold-500" /> Masuk ke Sistem
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Masukkan username..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-gold-500" /> Akun Demo Presentasi
              </p>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <div key={acc.role} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-500">{acc.icon}</div>
                      <span className="text-slate-700 font-medium">{acc.role}</span>
                    </div>
                    <span className="text-slate-500 font-mono">{acc.username} / {acc.password}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access + Features */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-6">
              <h2 className="text-slate-800 font-bold text-sm mb-4 flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4 text-blue-500" /> Akses Cepat Demo
              </h2>
              <div className="space-y-3">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    onClick={() => quickLogin(acc)}
                    disabled={loading}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${acc.color} hover:opacity-90 transition-all text-white text-left disabled:opacity-50 group shadow-md`}
                  >
                    <div className="text-white/90">{acc.icon}</div>
                    <div>
                      <p className="font-bold text-sm text-white">{acc.role}</p>
                      <p className="text-white/80 text-xs">{acc.href}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security badges */}
            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-6 space-y-4">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Keamanan Sistem</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center border border-green-100"><ShieldCheck className="w-4 h-4 text-green-600" /></div>
                <div>
                  <p className="text-slate-800 text-xs font-bold">Diproteksi Midtrans</p>
                  <p className="text-slate-500 text-[11px]">Berizin OJK & Bank Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100"><Wallet className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <p className="text-slate-800 text-xs font-bold">Uang Mengendap di Rekening Yayasan</p>
                  <p className="text-slate-500 text-[11px]">Settlement otomatis ke BSI Yayasan setiap hari</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center border border-gold-100"><Building2 className="w-4 h-4 text-gold-600" /></div>
                <div>
                  <p className="text-slate-800 text-xs font-bold">Data Milik Pesantren 100%</p>
                  <p className="text-slate-500 text-[11px]">Server & database dikontrol penuh oleh pesantren</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">© 2026 Ponpes Al-Imam Al-Islami · SAFINA v1.0 · Dikembangkan Secara Internal</p>
      </div>
    </div>
  );
}
