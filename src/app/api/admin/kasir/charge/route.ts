import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { dompet_id, nominal, keterangan } = await req.json();

    if (!dompet_id || !nominal || nominal <= 0) {
      return NextResponse.json({ success: false, message: "Data tidak valid atau nominal harus lebih dari 0" }, { status: 400 });
    }

    // Gunakan transaksi prisma untuk memastikan atomisitas (mencegah race conditions)
    const result = await prisma.$transaction(async (tx) => {
      // Kunci baris dompet agar tidak bisa diakses transaksi lain bersamaan
      const dompet = await tx.dompetSantri.findUnique({
        where: { id: dompet_id },
      });

      if (!dompet) {
        throw new Error("Dompet tidak ditemukan");
      }

      if (dompet.status !== 'AKTIF') {
        throw new Error("Kartu sedang tidak aktif atau diblokir");
      }

      if (Number(dompet.saldo) < Number(nominal)) {
        throw new Error(`Saldo tidak mencukupi. Sisa saldo: Rp ${Number(dompet.saldo).toLocaleString('id-ID')}`);
      }

      // Hitung total jajan hari ini untuk memvalidasi batas harian
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const transaksiHariIni = await tx.transaksiDompet.aggregate({
        where: {
          dompet_id: dompet.id,
          jenis_transaksi: 'JAJAN_KANTIN',
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          }
        },
        _sum: {
          nominal: true
        }
      });

      const totalJajanHariIni = Number(transaksiHariIni._sum.nominal || 0);

      // --- LOGIC ONE DAY PASS (BUKA GEMBOK) ---
      const now = new Date();
      let limitAktif = Number(dompet.batas_jajan_harian);
      let isBypassLimit = false;

      if (dompet.is_limit_terbuka && dompet.limit_terbuka_sampai) {
        // Jika batas waktu buka gembok masih berlaku
        if (now <= dompet.limit_terbuka_sampai) {
          isBypassLimit = true;
        } else {
          // Jika waktu buka gembok sudah habis, kembalikan is_limit_terbuka ke false
          await tx.dompetSantri.update({
            where: { id: dompet.id },
            data: { is_limit_terbuka: false }
          });
        }
      }

      if (!isBypassLimit && (totalJajanHariIni + Number(nominal) > limitAktif)) {
        throw new Error(`Melebihi batas jajan harian (Rp ${limitAktif.toLocaleString('id-ID')}). Sisa jatah hari ini: Rp ${(limitAktif - totalJajanHariIni).toLocaleString('id-ID')}`);
      }
      // ----------------------------------------

      const saldoAkhir = Number(dompet.saldo) - Number(nominal);

      // Potong saldo
      const updatedDompet = await tx.dompetSantri.update({
        where: { id: dompet.id },
        data: { saldo: saldoAkhir }
      });

      // Catat riwayat
      const riwayat = await tx.transaksiDompet.create({
        data: {
          dompet_id: dompet.id,
          jenis_transaksi: 'JAJAN_KANTIN',
          nominal: Number(nominal),
          saldo_akhir: saldoAkhir,
          keterangan: keterangan || "Jajan Kantin/Koperasi",
          // kasir_id: admin_id // Nanti bisa dikaitkan dengan ID Admin yang sedang login
        }
      });

      return { updatedDompet, riwayat };
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil",
      data: result
    });

  } catch (error: any) {
    console.error("Error charging dompet:", error);
    return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan internal server" }, { status: 400 });
  }
}
