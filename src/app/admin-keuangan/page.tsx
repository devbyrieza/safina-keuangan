"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Wallet, ArrowUpRight, ArrowDownRight, 
  Activity, Users, Zap, Search, Bell, History, ArrowRightLeft,
  Banknote, Receipt, LogOut, ArrowLeft, CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminKeuanganDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const draft = localStorage.getItem("safina_admin_search_draft");
      if (draft) {
        setSearchQuery(draft);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("safina_admin_search_draft", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [simulating, setSimulating] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{title: string, desc: string} | null>(null);

  const simulateAction = (actionName: string) => {
    setSimulating(actionName);
    setTimeout(() => {
      setSimulating(null);
      setToastMsg({ 
        title: 'Eksekusi Berhasil', 
        desc: `${actionName} telah diproses oleh sistem SAFINA secara otomatis.` 
      });
      setTimeout(() => setToastMsg(null), 4000);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-blue-500/30">
      
      {/* PREMIUM TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-8 fade-in zoom-in-95 duration-300">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-4 flex gap-4 items-center min-w-[350px]">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-wide">{toastMsg.title}</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMsg.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button onClick={() => router.push('/')} className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#550000] to-[#751414] flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5 text-[#ddc192]" />
                </div>
                <div>
                  <h1 className="font-black text-slate-800 tracking-wide text-lg">SAFINA<span className="text-[#b89758] font-bold">COMMAND</span></h1>
                </div>
              </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Santri / Transaksi..." 
                  className="bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-800 focus:outline-none focus:border-[#550000] focus:ring-1 focus:ring-[#550000] transition-all w-64"
                />
              </div>
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button onClick={() => router.push('/')} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Bendahara</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> System is online and monitoring real-time transactions.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => simulateAction('Tarik Dana ke Bank')}
              disabled={simulating === 'Tarik Dana ke Bank'}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Banknote className="w-4 h-4" /> Tarik Dana (Settlement)
            </button>
            <button 
              onClick={() => simulateAction('Generate Tagihan Massal')}
              disabled={simulating === 'Generate Tagihan Massal'}
              className="px-4 py-2 bg-[#550000] hover:bg-[#660000] rounded-lg text-sm font-bold text-white transition-all shadow-md shadow-[#550000]/20 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-[#ddc192]" /> Generate Tagihan SPP
            </button>
          </div>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-maroon-600/10 rounded-full blur-[40px] group-hover:bg-maroon-600/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-maroon-50 rounded-2xl text-maroon-700 shadow-sm group-hover:scale-110 transition-transform"><Wallet className="w-6 h-6" /></div>
              <span className="flex items-center text-xs font-black text-green-700 bg-green-100 px-2.5 py-1.5 rounded-lg"><ArrowUpRight className="w-4 h-4 mr-1"/> +12%</span>
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Dana ZAD Mengendap</p>
            <h3 className="text-3xl font-black text-slate-800 relative z-10 tracking-tight">Rp {data?.totalSaldo?.toLocaleString('id-ID') || 0}</h3>
          </div>

          {/* CARD 2 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-green-50 rounded-2xl text-green-600 shadow-sm group-hover:scale-110 transition-transform"><Zap className="w-6 h-6" /></div>
              <span className="flex items-center text-xs font-black text-green-700 bg-green-100 px-2.5 py-1.5 rounded-lg"><ArrowUpRight className="w-4 h-4 mr-1"/> +5%</span>
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Top Up Masuk Hari Ini</p>
            <h3 className="text-3xl font-black text-slate-800 relative z-10 tracking-tight">Rp {data?.topupHariIni?.toLocaleString('id-ID') || 0}</h3>
          </div>

          {/* CARD 3 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-maroon-600/10 rounded-full blur-[40px] group-hover:bg-maroon-600/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-maroon-50 rounded-2xl text-maroon-700 shadow-sm group-hover:scale-110 transition-transform"><ArrowRightLeft className="w-6 h-6" /></div>
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Omzet Kantin Hari Ini</p>
            <h3 className="text-3xl font-black text-slate-800 relative z-10 tracking-tight">Rp {data?.omzetKantin?.toLocaleString('id-ID') || 0}</h3>
          </div>

          {/* CARD 4 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[2rem] p-6 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shadow-sm group-hover:scale-110 transition-transform"><Users className="w-6 h-6" /></div>
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Tagihan Lunas (Bulan Ini)</p>
            <h3 className="text-3xl font-black text-slate-800 relative z-10 tracking-tight">Rp {data?.totalTagihanLunas?.toLocaleString('id-ID') || 0}</h3>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* LEFT: CHART (SIMULATED) */}
          <div className="xl:col-span-2 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-slate-800">Arus Kas ZAD (7 Hari Terakhir)</h3>
                <p className="text-xs text-slate-500 font-medium">Perbandingan Top Up masuk vs Jajan keluar.</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 py-1.5 px-3 outline-none">
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>
            
            {/* CSS Bar Chart Simulation */}
            <div className="h-64 flex items-end justify-between gap-2 px-2 mt-4 relative ml-8 flex-wrap">
              {/* Y-Axis lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-l border-white/10 pl-2">
                {(() => {
                  const rawMax = data?.chartData?.reduce((max: number, d: any) => Math.max(max, d.topup, d.jajan), 0) || 1000000;
                  // Round up maxVal to a "nice" number (e.g., nearest 100k or 1M)
                  let magnitude = Math.pow(10, Math.floor(Math.log10(rawMax || 1)));
                  let normalizedMax = Math.ceil(rawMax / magnitude) * magnitude;
                  // Make sure it's divisible by 4 cleanly
                  if ((normalizedMax / magnitude) % 4 !== 0) {
                     normalizedMax = Math.ceil((rawMax / magnitude) / 4) * 4 * magnitude;
                  }
                  const maxVal = Math.max(normalizedMax, 400000); // Minimum 400k scale
                  
                  const step = maxVal / 4;
                  
                  const formatNum = (val: number) => {
                    if (val === 0) return '0';
                    if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.0', '') + 'M';
                    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
                    return val.toString();
                  };

                  return [4, 3, 2, 1, 0].map(i => (
                    <span key={i} className="text-[10px] text-slate-500 -ml-10 bg-white pr-1">{formatNum(step * i)}</span>
                  ));
                })()}
              </div>
              {/* Bars */}
              {data?.chartData?.map((d: any, i: number) => {
                const rawMax = data?.chartData?.reduce((max: number, d: any) => Math.max(max, d.topup, d.jajan), 0) || 1000000;
                let magnitude = Math.pow(10, Math.floor(Math.log10(rawMax || 1)));
                let normalizedMax = Math.ceil(rawMax / magnitude) * magnitude;
                if ((normalizedMax / magnitude) % 4 !== 0) {
                   normalizedMax = Math.ceil((rawMax / magnitude) / 4) * 4 * magnitude;
                }
                const maxVal = Math.max(normalizedMax, 400000);
                
                const safeMax = maxVal === 0 ? 1000000 : maxVal;
                const topupH = (d.topup / safeMax) * 100;
                const jajanH = (d.jajan / safeMax) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative z-10 h-full">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                      Topup: Rp {d.topup.toLocaleString('id-ID')}<br/>
                      Jajan: Rp {d.jajan.toLocaleString('id-ID')}
                    </div>
                    <div className="w-full flex justify-center gap-1.5 h-full items-end">
                      {/* Topup bar */}
                      <div className="w-1/3 bg-[#c9a84c] rounded-t-sm transition-all hover:bg-[#ddc192] cursor-pointer" style={{ height: `${topupH}%`, minHeight: d.topup > 0 ? '4px' : '0' }}></div>
                      {/* Jajan bar */}
                      <div className="w-1/3 bg-[#550000] rounded-t-sm transition-all hover:bg-[#800a0a] cursor-pointer" style={{ height: `${jajanH}%`, minHeight: d.jajan > 0 ? '4px' : '0' }}></div>
                    </div>
                    <span className="text-center text-[10px] text-slate-500 mt-2 block font-bold">{d.day}</span>
                  </div>
                );
              }) || <div className="w-full text-center text-slate-400 text-sm py-20">Memuat Data Grafik...</div>}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-xs text-slate-400"><div className="w-3 h-3 rounded-full bg-[#c9a84c]"></div> Top Up</div>
              <div className="flex items-center gap-2 text-xs text-slate-400"><div className="w-3 h-3 rounded-full bg-[#550000]"></div> Jajan (Kantin)</div>
            </div>
          </div>

          {/* RIGHT: LIVE FEED */}
          <div className="xl:col-span-1 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-3">
                <History className="w-5 h-5 text-[#550000]" /> Live Feed
              </h3>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {data?.feed?.length === 0 ? (
                <p className="text-center text-slate-500 text-sm mt-10 font-medium">Belum ada aktivitas hari ini.</p>
              ) : (
                data?.feed?.map((tx: any) => (
                  <div key={tx.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                    <div className={`mt-1 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      tx.jenis === 'TOPUP' ? 'bg-[#faf0d7] text-[#8c6d32] border border-[#ebdcc3]' : 'bg-maroon-50 text-[#550000] border border-maroon-100'
                    }`}>
                      {tx.jenis === 'TOPUP' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        <span className="font-black">{tx.nama_santri}</span> {tx.jenis === 'TOPUP' ? 'melakukan Top Up saldo' : `berbelanja di Kantin`}
                      </p>
                      <p className={`text-sm font-black mt-1 ${tx.jenis === 'TOPUP' ? 'text-[#8c6d32]' : 'text-[#550000]'}`}>
                        {tx.jenis === 'TOPUP' ? '+' : '-'} Rp {tx.nominal.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{new Date(tx.waktu).toLocaleTimeString('id-ID')} • {tx.keterangan}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors uppercase tracking-widest">
              Lihat Semua Transaksi
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
