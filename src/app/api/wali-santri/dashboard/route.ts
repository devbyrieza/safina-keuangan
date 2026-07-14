import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// HARDCODED UNTUK DEMO: Mengambil dompet Khubaib
const DEMO_NO_PENDAFTARAN = "ILA2600001";

export async function GET() {
  try {
    const pendaftar = await prisma.pendaftar.findFirst({
      where: { nomor_pendaftaran: DEMO_NO_PENDAFTARAN },
      include: {
        DompetSantri: {
          include: {
            transaksi: {
              take: 5,
              orderBy: { created_at: 'desc' }
            }
          }
        }
      }
    });

    if (!pendaftar || !pendaftar.DompetSantri) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    const dompet = pendaftar.DompetSantri;
    
    // Format riwayat transaksi
    const transaksiList = dompet.transaksi.map(tx => ({
      id: tx.id,
      tanggal: new Date(tx.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      jenis: tx.jenis_transaksi,
      keterangan: tx.keterangan,
      nominal: Number(tx.nominal)
    }));

    // Cek apakah limit masih terbuka
    const now = new Date();
    let isLimitTerbuka = dompet.is_limit_terbuka;
    if (isLimitTerbuka && dompet.limit_terbuka_sampai) {
      if (now > dompet.limit_terbuka_sampai) {
        // Jika sudah kadaluwarsa, kembalikan ke false
        isLimitTerbuka = false;
        await prisma.dompetSantri.update({
          where: { id: dompet.id },
          data: { is_limit_terbuka: false }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        dompet: {
          id: dompet.id,
          saldo: Number(dompet.saldo),
          is_limit_terbuka: isLimitTerbuka,
          nama_santri: pendaftar.nama_lengkap,
          no_kartu: pendaftar.nomor_pendaftaran,
          kelas: pendaftar.jenjang
        },
        transaksiList
      }
    });
  } catch (error: any) {
    console.error("Wali Santri Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
