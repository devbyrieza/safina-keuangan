import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Hapus semua riwayat transaksi agar Live Feed dan Grafik bersih kembali
    await prisma.transaksiDompet.deleteMany({});

    // 2. Kembalikan saldo Khubaib ke 500.000 dan KUNCI KEMBALI limitnya
    await prisma.dompetSantri.updateMany({
      data: {
        saldo: 500000,
        is_limit_terbuka: false,
        limit_terbuka_sampai: null,
      }
    });

    // 3. Buat satu transaksi awal (Top Up Perdana) agar tidak kosong sama sekali
    const pendaftar = await prisma.pendaftar.findFirst({
      where: { nomor_pendaftaran: "ILA2600001" },
      include: { DompetSantri: true }
    });

    if (pendaftar && pendaftar.DompetSantri) {
      await prisma.transaksiDompet.create({
        data: {
          dompet_id: pendaftar.DompetSantri.id,
          jenis_transaksi: "TOPUP",
          nominal: 500000,
          saldo_akhir: 500000,
          keterangan: "Top Up Perdana (Bonus Sistem)",
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sistem telah di-reset untuk presentasi."
    });

  } catch (error: any) {
    console.error("Error reset demo:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
