"use client";

import { useState, useEffect, useRef } from "react";
import {
  Camera,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Calculator,
  RefreshCcw,
  ArrowLeft,
  LogOut,
  Bell,
  TrendingUp,
  MessageCircle,
  Package,
  Utensils,
  UtensilsCrossed,
  Cookie,
  CupSoda,
  Droplet,
  Coffee,
  ShoppingBag,
  Bath,
  Droplets,
  BookOpen,
  PenTool,
  ShoppingCart,
  Cpu,
  Wifi,
  User,
} from "lucide-react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function KasirKantinPage() {
  const router = useRouter();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nominal, setNominal] = useState<number>(0);
  const [keterangan, setKeterangan] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waPreview, setWaPreview] = useState<string | null>(null);
  const scannerRef = useRef<any>(null); // Use any because it's loaded via CDN
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Play a beep sound on successful scan
  const playBeep = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  useEffect(() => {
    if (scriptLoaded && !student && !scannerRef.current) {
      scannerRef.current = new (window as any).Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((error: any) =>
            console.error("Failed to clear html5QrcodeScanner. ", error),
          );
        scannerRef.current = null;
      }
    };
  }, [student, scriptLoaded]);

  const onScanSuccess = async (decodedText: string, decodedResult: any) => {
    if (decodedText && decodedText !== scannedData && !loading) {
      playBeep();
      setScannedData(decodedText);
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      // Stop scanner temporarily if it exists
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }

      handleProcessScan(decodedText);
    }
  };

  const handleProcessScan = async (code: string) => {
    try {
      const res = await fetch("/api/admin/kasir/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_code: code }),
      });
      const data = await res.json();
      if (data.success) {
        setStudent(data.data);
      } else {
        setErrorMsg(data.message || "Gagal memindai kartu");
        setTimeout(() => {
          setScannedData(null);
          // Restart scanner
          setStudent(null);
        }, 3000);
      }
    } catch (err) {
      setErrorMsg("Koneksi error");
      setTimeout(() => {
        setScannedData(null);
        setStudent(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (error: any) => {
    // handle scan failure, usually better to ignore and keep scanning
  };

  // Handler for Physical RFID / Barcode Scanner (acts like a keyboard input + Enter)
  const [manualInput, setManualInput] = useState("");

  useEffect(() => {
    try {
      const draft = localStorage.getItem("safina_kasir_manual_input");
      if (draft) {
        setManualInput(draft);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("safina_kasir_manual_input", manualInput);
  }, [manualInput]);

  const handlePhysicalScannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      localStorage.removeItem("safina_kasir_manual_input");
      setScannedData(manualInput);
      setLoading(true);
      handleProcessScan(manualInput.trim());
      setManualInput("");
    }
  };

  const handleCharge = async () => {
    if (!student || !nominal) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/kasir/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dompet_id: student.dompet.id,
          nominal: nominal,
          keterangan: keterangan || "Jajan Kantin",
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(
          `Berhasil memotong saldo Rp ${nominal.toLocaleString("id-ID")}`,
        );
        setTimeout(() => {
          handleReset();
        }, 3000);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Gagal memproses pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setStudent(null);
    setNominal(0);
    setKeterangan("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // === POS SYSTEM ===
  const POS_MENU = [
    {
      id: 1,
      nama: "Nasi Kotak",
      harga: 15000,
      kategori: "Makanan",
      icon: Package,
      stok: 42,
    },
    {
      id: 2,
      nama: "Mie Goreng",
      harga: 10000,
      kategori: "Makanan",
      icon: UtensilsCrossed,
      stok: 28,
    },
    {
      id: 3,
      nama: "Roti Bakery",
      harga: 5000,
      kategori: "Snack",
      icon: Cookie,
      stok: 55,
    },
    {
      id: 4,
      nama: "Chiki Snack",
      harga: 3000,
      kategori: "Snack",
      icon: ShoppingBag,
      stok: 120,
    },
    {
      id: 5,
      nama: "Susu Murni",
      harga: 4000,
      kategori: "Minuman",
      icon: CupSoda,
      stok: 35,
    },
    {
      id: 6,
      nama: "Air Mineral",
      harga: 2000,
      kategori: "Minuman",
      icon: Droplet,
      stok: 100,
    },
    {
      id: 7,
      nama: "Teh Botol",
      harga: 5000,
      kategori: "Minuman",
      icon: Coffee,
      stok: 48,
    },
    {
      id: 8,
      nama: "Es Krim",
      harga: 6000,
      kategori: "Snack",
      icon: ShoppingBag,
      stok: 20,
    },
    {
      id: 9,
      nama: "Sabun Mandi",
      harga: 8000,
      kategori: "Koperasi",
      icon: Bath,
      stok: 60,
    },
    {
      id: 10,
      nama: "Shampo Sachet",
      harga: 2000,
      kategori: "Koperasi",
      icon: Droplets,
      stok: 200,
    },
    {
      id: 11,
      nama: "Kitab Nahwu",
      harga: 25000,
      kategori: "Koperasi",
      icon: BookOpen,
      stok: 15,
    },
    {
      id: 12,
      nama: "Pena / Bolpen",
      harga: 3000,
      kategori: "Koperasi",
      icon: PenTool,
      stok: 150,
    },
  ];

  const [cart, setCart] = useState<
    { id: number; nama: string; harga: number; qty: number; Icon: any }[]
  >([]);
  const [posCategory, setPosCategory] = useState("Semua");

  const addToCart = (item: (typeof POS_MENU)[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [
        ...prev,
        {
          id: item.id,
          nama: item.nama,
          harga: item.harga,
          qty: 1,
          Icon: item.icon,
        },
      ];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const cartTotal = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const cartLabel = cart.map((c) => `${c.nama}(${c.qty})`).join(", ");

  const filteredMenu =
    posCategory === "Semua"
      ? POS_MENU
      : POS_MENU.filter((m) => m.kategori === posCategory);
  const categories = ["Semua", "Makanan", "Snack", "Minuman", "Koperasi"];

  const handleChargeWithCart = async () => {
    if (!student || cartTotal === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    // Use cart total and label automatically
    try {
      const res = await fetch("/api/admin/kasir/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dompet_id: student.dompet.id,
          nominal: cartTotal,
          keterangan: cartLabel || "Jajan Kantin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          `Berhasil! Saldo terpotong Rp ${cartTotal.toLocaleString("id-ID")}`,
        );

        // WA PREVIEW TRIGGER
        setWaPreview(
          `[KANTIN] *INFO JAJAN SANTRI*\nKhubaib baru saja jajan di Kantin senilai *Rp ${cartTotal.toLocaleString("id-ID")}*.\nItem: ${cartLabel}.\nSisa Saldo ZAD: Rp ${(student.dompet.saldo - cartTotal).toLocaleString("id-ID")}.`,
        );
        setTimeout(() => setWaPreview(null), 7000);

        setCart([]);
        setTimeout(() => handleReset(), 3000);
      } else {
        setErrorMsg(data.message);
      }
    } catch {
      setErrorMsg("Gagal memproses pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decorations - Glassmorphism & Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#ddc192]/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-maroon-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header Kasir */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <h1 className="text-slate-800 font-black text-xl tracking-wide">
              KASIR <span className="text-[#550000]">KANTIN</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-green-600 text-xs font-black uppercase tracking-widest">
                KANTIN BUKA
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Script
        src="https://unpkg.com/html5-qrcode"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 w-full flex-1 flex flex-col">
        <div className="grid lg:grid-cols-2 gap-8 flex-1">
          {/* Kolom Kiri: Scanner */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] overflow-hidden flex flex-col relative transition-all group">
            {!student ? (
              <div className="flex-1 relative aspect-[4/3] lg:aspect-auto flex flex-col items-center justify-center p-8 bg-slate-50/50">
                <div
                  id="reader"
                  className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-inner"
                ></div>

                <div className="w-full max-w-sm mt-8">
                  <form
                    onSubmit={handlePhysicalScannerSubmit}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Atau Tap Kartu di Mesin EDC/RFID..."
                      className="w-full bg-white border-2 border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-[#550000] text-sm font-bold transition-colors"
                      autoFocus
                    />
                    <div className="absolute right-3 top-3 px-2 py-0.5 bg-slate-200 text-[10px] text-slate-600 rounded font-bold">
                      MODE MESIN
                    </div>
                  </form>
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center text-slate-800 backdrop-blur-sm z-20">
                    <Loader2 className="w-10 h-10 animate-spin text-[#550000] mb-4" />
                    <p className="font-bold animate-pulse text-slate-700">
                      Memeriksa Data Santri...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center relative perspective-1000">
                {/* VIRTUAL ZAD CARD (FLIPPABLE) VERTICAL PORTRAIT */}
                <div
                  className="w-full max-w-[260px] aspect-[54/85.6] relative cursor-pointer mb-6 transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* FRONT OF CARD */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#ddc192]/30"
                    style={{
                      backfaceVisibility: "hidden",
                      backgroundColor: "#550000",
                    }}
                  >
                    {/* Background pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, #ddc192 1px, transparent 0)",
                        backgroundSize: "12px 12px",
                      }}
                    ></div>

                    {/* Glowing Top */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ddc192]/20 to-transparent pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-5 relative z-10 flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-black text-sm tracking-widest leading-tight">
                          PESANTREN
                          <br />
                          AL-IMAM
                        </h4>
                        <p className="text-[#ddc192] text-[8px] font-bold tracking-widest mt-1 uppercase">
                          Smart Student Card
                        </p>
                      </div>
                      <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#f2dfbe] via-[#ddc192] to-[#c29f60] flex items-center justify-center shadow-inner border border-[#330000] shrink-0">
                        <Cpu className="w-5 h-5 text-[#550000]/80" />
                      </div>
                    </div>

                    {/* Photo */}
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 mt-2">
                      <div className="w-28 h-32 rounded-xl bg-[#330000] border-[3px] border-[#ddc192] p-1 overflow-hidden shadow-[0_0_20px_rgba(221,193,146,0.3)]">
                        {student.foto_url &&
                        student.foto_url !== "/images/avatars/default.png" ? (
                          <img
                            src={student.foto_url}
                            alt="Foto"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.nama_lengkap.replace(/ /g, "")}&backgroundColor=ddc192`}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-lg bg-[#ddc192]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Name & Details */}
                    <div className="p-5 text-center relative z-10 mb-2">
                      <p className="text-white font-black text-lg uppercase leading-tight tracking-wide shadow-black/50 drop-shadow-md">
                        {student.nama_lengkap}
                      </p>
                      <div className="inline-block px-4 py-1.5 bg-[#330000]/50 rounded-full mt-3 backdrop-blur-sm border border-[#ddc192]/30 shadow-inner">
                        <p className="text-[#ddc192] text-xs uppercase font-bold tracking-widest">
                          {student.jenjang} • {student.nomor_pendaftaran}
                        </p>
                      </div>
                    </div>

                    {/* Bottom QR Code & Logo */}
                    <div className="p-4 flex justify-between items-center relative z-10 border-t border-[#ddc192]/20 bg-[#330000]/60">
                      <div className="bg-white p-1 rounded-md shadow-md shrink-0 flex items-center justify-center w-[46px] h-[46px]">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.nomor_pendaftaran}&margin=0`} alt="QR Front" className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="text-right">
                        <Wifi className="w-4 h-4 text-[#ddc192] rotate-90 ml-auto mb-1 opacity-70" />
                        <p className="text-[8px] font-black text-[#ddc192] tracking-widest uppercase">SAFINA PAYMENT</p>
                      </div>
                    </div>
                  </div>

                  {/* BACK OF CARD */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#ddc192]/30"
                    style={{ backfaceVisibility: 'hidden', backgroundColor: '#550000', transform: 'rotateY(180deg)' }}
                  >
                    <div className="w-full h-10 bg-[#1a0000] mt-6 opacity-80 shrink-0"></div>
                    
                    <div className="flex-1 px-5 py-4 flex flex-col items-center text-center">
                      <p className="font-bold text-[#ddc192] uppercase tracking-widest border-b border-[#ddc192]/30 pb-1.5 w-full" style={{ fontSize: '11px' }}>Ketentuan Penggunaan</p>
                      
                      <div className="text-left w-full mt-2 flex flex-col gap-1.5 border-b border-[#ddc192]/10 pb-3">
                        <p className="text-white leading-tight font-medium" style={{ fontSize: '10px' }}>1. Kartu ini identitas resmi santri Al-Imam.</p>
                        <p className="text-white leading-tight font-medium" style={{ fontSize: '10px' }}>2. Wajib dibawa saat makan & belanja.</p>
                        <p className="text-white leading-tight font-medium" style={{ fontSize: '10px' }}>3. Hilang/rusak segera lapor ke admin.</p>
                      </div>

                      <div className="mt-auto w-full text-center">
                        <p className="text-[#ddc192] font-bold tracking-wider mb-1" style={{ fontSize: '9px' }}>PESANTREN AL-IMAM AL-ISLAMI</p>
                        <p className="text-white/70 leading-tight" style={{ fontSize: '8px' }}>
                          Jl. Raya Sukabumi No. 123, Jawa Barat<br/>
                          Hubungi Admin: 0812-3456-7890
                        </p>
                      </div>
                      
                      <p className="mt-3 font-black tracking-widest uppercase bg-[#330000] w-full py-1.5" style={{ fontSize: '8px', color: '#ddc192' }}>#CERDASBERSAMAALIMAM</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-black text-amber-700 mb-6 uppercase tracking-widest bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full shadow-sm animate-pulse flex items-center gap-2">
                  <RefreshCcw className="w-3 h-3" /> Klik kartu untuk membalik
                </p>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2 relative z-10">
                    Sisa Saldo Saat Ini
                  </p>
                  <p className="text-4xl font-black text-emerald-600 relative z-10">
                    Rp {Number(student.dompet.saldo).toLocaleString("id-ID")}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 text-slate-500 hover:text-slate-800 underline underline-offset-4 text-sm font-bold"
                >
                  Batalkan & Scan Ulang
                </button>
              </div>
            )}

            {errorMsg && !student && (
              <div className="absolute bottom-6 left-6 right-6 bg-red-600/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-[0_20px_40px_rgba(220,38,38,0.3)] flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in border border-red-400/30">
                <div className="bg-white/20 p-2 rounded-full">
                  <XCircle className="w-6 h-6 shrink-0" />
                </div>
                <p className="font-bold text-sm leading-tight">{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Input Pembayaran */}
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] p-6 md:p-8 flex flex-col transition-all group">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div> 
              Form Pembayaran
            </h2>

            {!student ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
                <Camera className="w-16 h-16 text-slate-300 mb-4" />
                <p className="font-bold text-lg text-slate-500">
                  Silakan Scan Kartu Santri
                </p>
                <p className="text-sm mt-2">
                  Form ini akan aktif setelah kartu berhasil terdeteksi oleh
                  kamera.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col animate-in fade-in duration-500 gap-4">
                {/* POS MENU CATEGORIES */}
                <div>
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPosCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          posCategory === cat
                            ? "bg-[#550000] text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                    {filteredMenu.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className="p-2 bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-left transition-all group active:scale-95"
                      >
                        <div className="text-slate-600 mb-2 bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-slate-800 text-[11px] leading-tight">
                          {item.nama}
                        </p>
                        <p className="text-emerald-600 font-black text-[11px]">
                          Rp {(item.harga / 1000).toLocaleString("id-ID")}k
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Stok: {item.stok}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CART / KERANJANG */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4" /> Keranjang
                    </p>
                    {cart.length > 0 && (
                      <button
                        onClick={() => setCart([])}
                        className="text-[11px] text-red-400 hover:text-red-600 font-bold"
                      >
                        Kosongkan
                      </button>
                    )}
                  </div>
                  {cart.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-2">
                      Belum ada item. Klik menu di atas.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {cart.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-slate-700 flex items-center gap-1.5">
                            <c.Icon className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {c.nama} ×{c.qty}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              Rp {(c.harga * c.qty).toLocaleString("id-ID")}
                            </span>
                            <button
                              onClick={() => removeFromCart(c.id)}
                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="text-sm font-black text-slate-800">
                          TOTAL
                        </span>
                        <span className="text-sm font-black text-emerald-600">
                          Rp {cartTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {cartTotal > Number(student.dompet.saldo) && (
                  <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Saldo santri tidak cukup!
                    Kurangi item.
                  </p>
                )}

                {errorMsg && (
                  <div className="bg-red-500/10 backdrop-blur-sm text-red-600 p-3.5 rounded-2xl border border-red-500/20 flex items-start gap-3 shadow-[0_8px_16px_rgba(239,68,68,0.05)] animate-in zoom-in-95 fade-in">
                    <div className="bg-red-500 rounded-full p-1 shadow-md shadow-red-500/20 shrink-0 mt-0.5">
                      <XCircle className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-500/10 backdrop-blur-sm text-green-700 p-3.5 rounded-2xl border border-green-500/20 flex items-start gap-3 shadow-[0_8px_16px_rgba(34,197,94,0.05)] animate-in zoom-in-95 fade-in">
                    <div className="bg-green-500 rounded-full p-1 shadow-md shadow-green-500/20 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-bold leading-relaxed">{successMsg}</p>
                  </div>
                )}

                <div className="mt-auto">
                  <button
                    onClick={handleChargeWithCart}
                    disabled={
                      cartTotal === 0 ||
                      isProcessing ||
                      cartTotal > Number(student.dompet.saldo) ||
                      !!successMsg
                    }
                    className="w-full bg-[#550000] hover:bg-[#660000] disabled:bg-slate-200 disabled:text-slate-400 text-white text-lg font-black py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Bayar Rp {cartTotal.toLocaleString("id-ID")}{" "}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WHATSAPP PREVIEW OVERLAY (For Mudir Demo) */}
      {waPreview && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100] animate-in slide-in-from-top-8 fade-in duration-500">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[24px] p-4 flex gap-4 items-start relative overflow-hidden group cursor-pointer hover:bg-white/90 transition-colors">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"></div>
            
            <div className="w-12 h-12 bg-gradient-to-tr from-[#128C7E] to-[#25D366] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30 border border-green-400/50">
              <MessageCircle className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            
            <div className="flex-1 pt-0.5 relative z-10">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900 text-[13px] tracking-tight">WhatsApp</p>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <p className="text-[11px] font-medium text-slate-500">Baru saja</p>
                </div>
              </div>
              <p className="font-bold text-slate-800 text-[13px] leading-tight mb-0.5">Sistem SAFINA (Kantin)</p>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{waPreview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
