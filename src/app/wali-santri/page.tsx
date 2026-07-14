"use client";

import { useState, useEffect } from "react";
import {
  HandCoins, CreditCard, Clock, FileText, RefreshCw, AlertCircle,
  Smartphone, QrCode, ShieldCheck, X, ArrowLeft, CheckCircle2,
  Banknote, Bell, LogOut, ChevronRight, ArrowDownRight, ArrowUpRight, Building2,
  Lock, Unlock, Star, Gift, MessageCircle, BookOpen, Store
} from "lucide-react";
import { useRouter } from "next/navigation";

const DUMMY_DATA = {
  tagihanList: [
    { id: 1, jenis: "SPP Bulan Juni 2026", nominal: 850000, status: "pending", dueDate: "30 Jun 2026" },
    { id: 2, jenis: "Seragam Pesantren Baru", nominal: 350000, status: "pending", dueDate: "25 Jun 2026" },
    { id: 3, jenis: "SPP Bulan Mei 2026", nominal: 850000, status: "lunas", dueDate: "31 Mei 2026" },
    { id: 4, jenis: "Buku Kitab Semester 1", nominal: 250000, status: "lunas", dueDate: "15 Jan 2026" },
  ]
};

const PAYMENT_METHODS = [
  { id: "bsi", label: "BSI Virtual Account", sub: "Bebas Biaya Admin", icon: Building2, color: "bg-teal-100 text-teal-600", qr: false },
  { id: "bca", label: "BCA Virtual Account", sub: "Verifikasi otomatis", icon: Building2, color: "bg-sky-100 text-sky-600", qr: false },
  { id: "mandiri", label: "Mandiri Virtual Account", sub: "Verifikasi otomatis", icon: CreditCard, color: "bg-amber-100 text-amber-600", qr: false },
  { id: "bni", label: "BNI Virtual Account", sub: "Verifikasi otomatis", icon: Building2, color: "bg-orange-100 text-orange-600", qr: false },
  { id: "bri", label: "BRI Virtual Account", sub: "Verifikasi otomatis", icon: Building2, color: "bg-blue-100 text-blue-600", qr: false },
  { id: "gopay", label: "GoPay / OVO / Dana / ShopeePay", sub: "E-Wallet", icon: Smartphone, color: "bg-green-100 text-green-600", qr: true },
  { id: "qris", label: "QRIS", sub: "Scan dari m-Banking apa saja", icon: QrCode, color: "bg-blue-100 text-blue-600", qr: true },
  { id: "indomaret", label: "Indomaret / Ceriamart", sub: "Bayar tunai di kasir", icon: Store, color: "bg-indigo-100 text-indigo-600", qr: false },
  { id: "alfamart", label: "Alfamart / Alfamidi", sub: "Bayar tunai di kasir", icon: Store, color: "bg-red-100 text-red-600", qr: false },
];

export default function WaliSantriPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dompet' | 'tagihan' | 'topup' | 'fitur'>('dompet');
  const [dompet, setDompet] = useState<any>(null);
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const [tagihanList, setTagihanList] = useState(DUMMY_DATA.tagihanList);
  const [loading, setLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Midtrans Simulation
  const [snapModal, setSnapModal] = useState(false);
  const [snapStep, setSnapStep] = useState<'method' | 'pay' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[0] | null>(null);
  const [snapContext, setSnapContext] = useState<any>(null);
  const [topupAmount, setTopupAmount] = useState(100000);

  useEffect(() => {
    fetch('/api/wali-santri/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setDompet(json.data.dompet);
          setTransaksiList(json.data.transaksiList);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUnlockLimit = () => {
    setIsUnlocking(true);
    fetch('/api/wali-santri/buka-gembok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dompet_id: dompet.id })
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        setDompet((prev: any) => ({ ...prev, is_limit_terbuka: true }));
      } else {
        alert(json.message || "Gagal membuka gembok");
      }
    })
    .catch(err => console.error(err))
    .finally(() => setIsUnlocking(false));
  };

  const openSnapForTagihan = (tagihan: any) => {
    setSnapContext({ type: 'tagihan', item: tagihan });
    setSnapStep('method');
    setSnapModal(true);
  };

  const openSnapForTopup = () => {
    setSnapContext({ type: 'topup', item: { jenis: 'Top Up Saldo ZAD', nominal: topupAmount } });
    setSnapStep('method');
    setSnapModal(true);
  };

  const handleSelectMethod = (method: typeof PAYMENT_METHODS[0]) => {
    setSelectedMethod(method);
    setSnapStep('pay');
  };

  const simulatePaymentSuccess = () => {
    setSnapStep('processing');
    setTimeout(() => {
      setSnapStep('success');
      if (snapContext?.type === 'tagihan') {
        setTagihanList(prev => prev.map(t => t.id === snapContext.item.id ? { ...t, status: 'lunas' } : t));
        showWANotif(`[SUKSES] *PEMBAYARAN BERHASIL*\nAlhamdulillah, pembayaran untuk *${snapContext.item.jenis}* senilai Rp ${snapContext.item.nominal.toLocaleString('id-ID')} telah berhasil diterima Yayasan. Jazakumullah khairan. (Sistem Keuangan)`);
      } else if (snapContext?.type === 'topup') {
        setDompet(prev => ({ ...prev, saldo: prev.saldo + snapContext.item.nominal }));
        setTransaksiList((prev: any) => [{
          id: Date.now(),
          tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          jenis: 'TOPUP',
          keterangan: `Top Up via ${selectedMethod?.label}`,
          nominal: snapContext.item.nominal
        }, ...prev]);
        showWANotif(`[INFO] *TOP UP BERHASIL*\nSaldo ZAD Khubaib telah bertambah Rp ${snapContext.item.nominal.toLocaleString('id-ID')} via ${selectedMethod?.label}. Sisa saldo saat ini: Rp ${(dompet.saldo + snapContext.item.nominal).toLocaleString('id-ID')}. (SAFINA)`);
      }
    }, 2000);
  };

  const closeSnap = () => {
    setSnapModal(false);
    setSnapStep('method');
    setSelectedMethod(null);
    setSnapContext(null);
  };

  // === WA NOTIFICATION SIMULATION ===
  const [waNotif, setWaNotif] = useState<string | null>(null);
  const showWANotif = (msg: string) => {
    setWaNotif(msg);
    setTimeout(() => setWaNotif(null), 6000);
  };

  // === SAVING LOCK ===
  const [savingLocks, setSavingLocks] = useState([{ id: 1, amount: 200000, label: "Tabungan Beli Kitab", active: true }]);
  const totalLocked = savingLocks.filter(l => l.active).reduce((s, l) => s + l.amount, 0);
  const saldoBebas = Math.max(0, (dompet?.saldo || 0) - totalLocked);

  const toggleLock = (id: number) => {
    setSavingLocks(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };
  const addLock = () => {
    setSavingLocks(prev => [...prev, { id: Date.now(), amount: 0, label: "Tujuan Baru", active: true }]);
  };
  const updateLock = (id: number, field: 'amount' | 'label', value: any) => {
    setSavingLocks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const removeLock = (id: number) => {
    setSavingLocks(prev => prev.filter(l => l.id !== id));
  };

  // === REWARD TAHFIDZ ===
  const [hafalanList, setHafalanList] = useState([
    { id: 1, surah: "Al-Fatiha", juz: 30, bonus: 10000, claimed: true },
    { id: 2, surah: "An-Nas s/d Al-Falaq", juz: 30, bonus: 15000, claimed: false },
    { id: 3, surah: "Al-Baqarah Ayat 1-50", juz: 1, bonus: 20000, claimed: false },
    { id: 4, surah: "Al-Ikhlas, Al-Kafirun", juz: 30, bonus: 10000, claimed: false },
  ]);

  const claimReward = (item: typeof hafalanList[0]) => {
    setDompet((prev: any) => ({ ...prev, saldo: prev.saldo + item.bonus }));
    setHafalanList(prev => prev.map(h => h.id === item.id ? { ...h, claimed: true } : h));
    setTransaksiList((prev: any) => [{
      id: Date.now(),
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      jenis: 'TOPUP',
      keterangan: `[Bonus] Hafalan: ${item.surah}`,
      nominal: item.bonus
    }, ...prev]);
    showWANotif(`[INFO] *BONUS HAFALAN*\nKhubaib berhasil setor hafalan *${item.surah}*!\nBonus saldo Rp ${item.bonus.toLocaleString('id-ID')} otomatis masuk ke kartu ZAD santri. MasyaAllah! (SAFINA)`);
  };

  if (loading || !dompet) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-maroon-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Memuat data santri...</p>
        </div>
      </div>
    );
  }

  const totalTagihanBelumLunas = tagihanList.filter(t => t.status === 'pending').reduce((s, t) => s + t.nominal, 0);


  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-400 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Beranda
            </button>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              </button>
              <button onClick={() => router.push('/')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-black">
              {dompet.nama_santri.charAt(0)}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Wali Santri</p>
              <h1 className="text-xl font-black text-white">{dompet.nama_santri}</h1>
              <p className="text-white/60 text-xs">{dompet.no_kartu} · {dompet.kelas}</p>
            </div>
          </div>

          {/* Saldo Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Saldo ZAD (Uang Jajan)</p>
              <h2 className="text-4xl font-black text-white tracking-tight">Rp {saldoBebas.toLocaleString('id-ID')}</h2>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ZAD AKTIF
                </span>
                {totalLocked > 0 && (
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Rp {totalLocked.toLocaleString('id-ID')} Terkunci
                  </span>
                )}
                {totalTagihanBelumLunas > 0 && (
                  <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Tunggakan: Rp {totalTagihanBelumLunas.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('topup')}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2 whitespace-nowrap"
            >
              <HandCoins className="w-5 h-5" /> Isi Saldo Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
          {[
            { id: 'dompet', label: 'Riwayat ZAD', icon: CreditCard },
            { id: 'tagihan', label: 'Tagihan SPP', icon: FileText },
            { id: 'topup', label: 'Isi Saldo', icon: HandCoins },
            { id: 'fitur', label: 'Fitur Unggulan', icon: Star },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-4 text-sm font-bold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === tab.id ? 'border-maroon-600 text-maroon-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* TAB: RIWAYAT DOMPET */}
        {activeTab === 'dompet' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-5 h-5 text-gold-500" /> Riwayat Transaksi ZAD</h3>
              <div className="flex items-center gap-2">
                {!dompet.is_limit_terbuka ? (
                  <button onClick={handleUnlockLimit} disabled={isUnlocking} className="flex items-center gap-2 text-xs font-bold text-maroon-600 bg-maroon-50 border border-maroon-200 px-3 py-1.5 rounded-lg hover:bg-maroon-100 transition-colors">
                    {isUnlocking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    Buka Limit
                  </button>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Limit Terbuka Hari Ini
                  </span>
                )}
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {transaksiList.length === 0 ? (
                <p className="p-10 text-center text-slate-400 text-sm">Belum ada transaksi.</p>
              ) : transaksiList.map(tx => (
                <div key={tx.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.jenis === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-maroon-100 text-maroon-600'}`}>
                    {tx.jenis === 'TOPUP' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{tx.keterangan}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{tx.tanggal}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${tx.jenis === 'TOPUP' ? 'text-green-600' : 'text-slate-700'}`}>
                      {tx.jenis === 'TOPUP' ? '+' : '-'} Rp {tx.nominal.toLocaleString('id-ID')}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.jenis === 'TOPUP' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {tx.jenis === 'TOPUP' ? 'Isi Saldo' : 'Jajan'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TAGIHAN */}
        {activeTab === 'tagihan' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-amber-800 text-sm font-medium">Terdapat <strong>{tagihanList.filter(t => t.status === 'pending').length} tagihan belum lunas</strong> senilai total <strong>Rp {totalTagihanBelumLunas.toLocaleString('id-ID')}</strong>.</p>
            </div>
            {tagihanList.map(tagihan => (
              <div key={tagihan.id} className={`bg-white rounded-3xl border overflow-hidden shadow-sm ${tagihan.status === 'lunas' ? 'border-slate-200 opacity-70' : 'border-maroon-200'}`}>
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tagihan.status === 'lunas' ? 'bg-green-100 text-green-600' : 'bg-maroon-100 text-maroon-600'}`}>
                      {tagihan.status === 'lunas' ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 ${tagihan.status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {tagihan.status === 'lunas' ? <><CheckCircle2 className="w-3 h-3"/> LUNAS</> : <><AlertCircle className="w-3 h-3"/> BELUM BAYAR</>}
                        </span>
                        {tagihan.status !== 'lunas' && <span className="text-[10px] text-slate-400">Jatuh Tempo: {tagihan.dueDate}</span>}
                      </div>
                      <p className="font-bold text-slate-800">{tagihan.jenis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-black text-xl ${tagihan.status === 'lunas' ? 'text-slate-400' : 'text-maroon-700'}`}>
                      Rp {tagihan.nominal.toLocaleString('id-ID')}
                    </p>
                    {tagihan.status === 'pending' && (
                      <button onClick={() => openSnapForTagihan(tagihan)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20 whitespace-nowrap">
                        <ShieldCheck className="w-4 h-4" /> Bayar Instan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: TOP UP */}
        {activeTab === 'topup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><HandCoins className="w-5 h-5 text-blue-500" /> Isi Saldo ZAD</h3>
              <p className="text-slate-400 text-sm mb-6">Top up saldo instan via Gopay, QRIS, atau Virtual Account. Tanpa konfirmasi admin, langsung masuk!</p>
              
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pilih Nominal</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[50000, 100000, 200000, 500000, 750000, 1000000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${topupAmount === amt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    Rp {(amt / 1000).toLocaleString('id-ID')}rb
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Atau masukkan nominal lain</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={e => setTopupAmount(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-bold focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={openSnapForTopup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" /> Top Up Rp {topupAmount.toLocaleString('id-ID')}
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-700 mb-4 text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" />Metode Tersedia</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center`}><m.icon className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold text-slate-700 text-xs">{m.label}</p>
                        <p className="text-slate-400 text-[10px]">{m.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-blue-800 text-xs font-bold mb-2 flex items-center gap-1.5"><Star className="w-4 h-4" /> Keunggulan Bayar via SAFINA</p>
                <ul className="text-blue-700 text-[11px] space-y-2">
                  <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Langsung masuk ke saldo santri (bukan antri konfirmasi Admin)</li>
                  <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 24 jam sehari, 7 hari seminggu — bisa top up kapan saja</li>
                  <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Notifikasi WhatsApp otomatis setelah berhasil</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FITUR UNGGULAN */}
        {activeTab === 'fitur' && (
          <div className="space-y-6">
            {/* SAVING LOCK */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-black text-lg flex items-center gap-2"><Lock className="w-5 h-5" /> Tabungan Terkunci (Saving Lock)</h3>
                  <p className="text-blue-100 text-sm mt-1">Amankan sebagian saldo untuk berbagai tujuan (Kitab, Seragam, dll).</p>
                </div>
                <button 
                  onClick={addLock}
                  className="px-4 py-2 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  + Tambah Pos
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {savingLocks.map(lock => (
                    <div key={lock.id} className={`p-4 border-2 rounded-2xl transition-all relative ${lock.active ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                      {savingLocks.length > 1 && (
                         <button onClick={() => removeLock(lock.id)} className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-sm z-10">✕</button>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tujuan Tabungan</label>
                          <input 
                            type="text" 
                            value={lock.label}
                            disabled={!lock.active}
                            onChange={(e) => updateLock(lock.id, 'label', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 font-bold focus:border-blue-400 focus:outline-none text-sm disabled:bg-slate-50"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nominal Dikunci</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                            <input 
                              type="number" 
                              value={lock.amount}
                              disabled={!lock.active}
                              onChange={(e) => updateLock(lock.id, 'amount', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-slate-800 font-black focus:border-blue-400 focus:outline-none text-sm disabled:bg-slate-50"
                            />
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 flex items-center justify-between md:justify-start gap-3 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider md:hidden">Status Lock:</span>
                          <button 
                            onClick={() => toggleLock(lock.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${lock.active ? 'bg-blue-500' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${lock.active ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {totalLocked > 0 && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-800">
                      Total <strong>Rp {totalLocked.toLocaleString('id-ID')}</strong> berhasil diamankan ke dalam {savingLocks.filter(l=>l.active).length} pos tabungan. Sisa saldo untuk jajan di kantin adalah <strong>Rp {saldoBebas.toLocaleString('id-ID')}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* REWARD TAHFIDZ */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Reward Tahfidz</h3>
                  <p className="text-slate-500 text-sm">Dapatkan bonus saldo uang jajan setiap santri menyelesaikan target hafalan!</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {hafalanList.map(hafalan => (
                  <div key={hafalan.id} className={`border-2 rounded-2xl p-4 flex flex-col transition-all ${hafalan.claimed ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-white hover:border-gold-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Juz {hafalan.juz}</span>
                        <h4 className="font-bold text-slate-800 mt-2 text-lg leading-tight">{hafalan.surah}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bonus</p>
                        <p className="font-black text-gold-600">Rp {(hafalan.bonus / 1000).toLocaleString('id-ID')}k</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      {hafalan.claimed ? (
                        <div className="w-full py-2 bg-green-100 text-green-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Bonus Telah Diklaim
                        </div>
                      ) : (
                        <button 
                          onClick={() => claimReward(hafalan)}
                          className="w-full py-2 bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-900 transition-colors font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Gift className="w-4 h-4" /> Setor Hafalan & Klaim Bonus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MIDTRANS SNAP SIMULATION MODAL */}
      {snapModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full md:max-w-[400px] md:rounded-xl rounded-t-2xl overflow-hidden shadow-2xl font-sans flex flex-col" style={{ maxHeight: '90vh' }}>
            {/* Midtrans Header */}
            <div className="px-4 py-4 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                {snapStep !== 'method' && snapStep !== 'success' ? (
                  <button onClick={() => setSnapStep('method')} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                ) : (
                  <div className="w-6 h-6" /> // spacer
                )}
                <div>
                  <p className="font-bold text-slate-800 text-[15px]">SAFINA Payment</p>
                </div>
              </div>
              <button onClick={closeSnap} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Order Summary Dropdown */}
            <div className="px-5 py-4 bg-[#F9FAFB] border-b border-slate-200 flex justify-between items-start cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-slate-500 text-[13px] mb-1">Total</p>
                <p className="text-slate-900 font-black text-xl">Rp {snapContext?.item?.nominal?.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[13px] mb-1">Order ID</p>
                <p className="text-slate-800 text-[13px] font-medium">ORD-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              {/* Step 1: Choose Method */}
              {snapStep === 'method' && (
                <div>
                  <p className="text-[13px] font-bold text-slate-800 mb-3">Pilih metode pembayaran</p>
                  <div className="space-y-0 border border-slate-200 rounded-xl overflow-hidden">
                    {PAYMENT_METHODS.map((m, index) => (
                      <button 
                        key={m.id} 
                        onClick={() => handleSelectMethod(m)} 
                        className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left group ${index !== PAYMENT_METHODS.length - 1 ? 'border-b border-slate-200' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 border border-slate-200 rounded flex items-center justify-center shrink-0 bg-white">
                            <m.icon className={`w-4 h-4 ${m.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                          </div>
                          <p className="font-medium text-slate-700 text-[14px]">{m.label}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Pay */}
              {snapStep === 'pay' && selectedMethod && (
                <div className="text-center pb-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <p className="font-bold text-slate-800 text-[14px]">Bayar dengan {selectedMethod.label}</p>
                    <div className={`w-10 h-6 border border-slate-200 rounded flex items-center justify-center shrink-0 bg-white`}>
                      <selectedMethod.icon className={`w-4 h-4 ${selectedMethod.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                    </div>
                  </div>

                  {selectedMethod.qr ? (
                    <>
                      <p className="text-[13px] text-slate-600 mb-4">Silahkan scan kode QR ini menggunakan aplikasi e-wallet Anda.</p>
                      <div className="w-56 h-56 mx-auto bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center mb-6 cursor-pointer group relative overflow-hidden p-2 shadow-sm" onClick={simulatePaymentSuccess}>
                        <div className="border-[6px] border-slate-800 rounded-lg p-2 w-full h-full flex flex-col items-center justify-center">
                          <QrCode className="w-32 h-32 text-slate-800 group-hover:scale-95 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-[#00A5CF]/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm text-center px-4">Klik untuk simulasi<br/>scan berhasil <CheckCircle2 className="w-4 h-4 inline ml-1" /></p>
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-500 mb-2">Batas waktu pembayaran:</p>
                      <p className="text-[14px] font-bold text-slate-800">14:59</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] text-slate-600 mb-4">Selesaikan pembayaran dari {selectedMethod.label} ke nomor Virtual Account di bawah ini.</p>
                      <div className="bg-[#F9FAFB] border border-slate-200 rounded flex flex-col mb-6 cursor-pointer group relative overflow-hidden" onClick={simulatePaymentSuccess}>
                        <div className="p-4 text-center">
                           <p className="text-[12px] text-slate-500 mb-1">Nomor Virtual Account</p>
                           <p className="text-[20px] font-bold text-[#00A5CF] tracking-[0.1em]">7012 3456 7890</p>
                        </div>
                        <div className="border-t border-slate-200 p-2 bg-slate-50 flex items-center justify-center gap-2 text-[#00A5CF] text-[12px] font-bold hover:bg-slate-100">
                          Salin Nomor
                        </div>
                        <div className="absolute inset-0 bg-[#00A5CF]/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm text-center">Klik untuk simulasi<br/>transfer berhasil <CheckCircle2 className="w-4 h-4 inline ml-1" /></p>
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-500 mb-1">Batas waktu pembayaran:</p>
                      <p className="text-[14px] font-bold text-slate-800">23:59:59</p>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Processing */}
              {snapStep === 'processing' && (
                <div className="text-center py-10">
                  <div className="w-12 h-12 mx-auto mb-6 border-4 border-[#00A5CF]/30 border-t-[#00A5CF] rounded-full animate-spin" />
                  <p className="font-bold text-slate-800 text-[15px]">Memverifikasi Pembayaran</p>
                  <p className="text-slate-500 text-[13px] mt-2">Mohon tunggu sebentar...</p>
                </div>
              )}

              {/* Step 4: Success */}
              {snapStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EAF7ED] flex items-center justify-center text-[#12A04B]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-[18px] font-bold text-slate-800 mb-2">Pembayaran Berhasil</h3>
                  <p className="text-slate-500 text-[13px] mb-8">Terima kasih atas pembayaran Anda.</p>
                  
                  <button onClick={closeSnap} className="w-full bg-[#00A5CF] hover:bg-[#0089B3] text-white font-bold text-[14px] py-3 rounded transition-colors">
                    Kembali ke Merchant
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">Powered by</span>
              <img src="https://gopay.co.id/icon/midtrans-logo.png" alt="Midtrans" className="h-4 opacity-70 grayscale" onError={(e) => {e.currentTarget.src='https://midtrans.com/assets/img/midtrans-logo-color.svg'; e.currentTarget.className='h-3 opacity-60'}} />
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP NOTIFICATION OVERLAY */}
      {waNotif && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#dcf8c6] border border-[#25D366]/20 shadow-2xl rounded-2xl p-4 z-[60] animate-in slide-in-from-top-10 fade-in duration-500">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-bold text-slate-800 text-sm">SAFINA Admin</p>
                <p className="text-[10px] text-slate-500 font-bold">Baru saja</p>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line">{waNotif}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
