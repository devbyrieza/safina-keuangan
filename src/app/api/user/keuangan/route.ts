import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // For MVP/Demo purposes, we fetch Khubaib Abdul Aziz
    // In production, this would use session/token to get the correct user
    const pendaftar = await prisma.pendaftar.findFirst({
      where: { nama_lengkap: { contains: "Khubaib" } },
      include: {
        DompetSantri: {
          include: {
            transaksi: {
              orderBy: { created_at: 'desc' },
              take: 10 // Last 10 transactions
            }
          }
        }
      }
    });

    if (!pendaftar || !pendaftar.DompetSantri) {
      return NextResponse.json({ success: false, message: "Data keuangan belum diaktifkan oleh admin" }, { status: 404 });
    }

    const transaksiList = pendaftar.DompetSantri.transaksi.map(tx => ({
      id: tx.id,
      jenis: tx.jenis_transaksi,
      nominal: Number(tx.nominal),
      keterangan: tx.keterangan || (tx.jenis_transaksi === 'TOPUP' ? 'Isi Saldo ZAD' : 'Jajan Kantin'),
      tanggal: new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }));

    // Dummy Tagihan for now since we haven't built the Tagihan SPP data generation engine yet
    const tagihanList = [
      { id: 1, jenis: "SPP Bulan Juli 2026", nominal: 1500000, status: "pending", dueDate: "10 Jul 2026" },
      { id: 2, jenis: "Laundry Juli 2026", nominal: 150000, status: "pending", dueDate: "10 Jul 2026" },
      { id: 3, jenis: "Uang Kegiatan Semester 1", nominal: 800000, status: "lunas", dueDate: "01 Jul 2026" }
    ];

    return NextResponse.json({
      success: true,
      data: {
        dompet: {
          saldo: Number(pendaftar.DompetSantri.saldo),
          status: pendaftar.DompetSantri.status,
          is_limit_terbuka: pendaftar.DompetSantri.is_limit_terbuka
        },
        transaksiList,
        tagihanList
      }
    });

  } catch (error: any) {
    console.error("User Keuangan API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
