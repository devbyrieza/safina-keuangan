import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Dana Mengendap (Saldo seluruh santri)
    const dompetAggr = await prisma.dompetSantri.aggregate({
      _sum: { saldo: true },
      where: { status: "AKTIF" }
    });
    const totalSaldo = dompetAggr._sum.saldo || 0;

    // 2. Pemasukan Kantin Hari Ini (JAJAN_KANTIN)
    const kantinAggr = await prisma.transaksiDompet.aggregate({
      _sum: { nominal: true },
      where: {
        jenis_transaksi: "JAJAN_KANTIN",
        created_at: { gte: today }
      }
    });
    const omzetKantin = kantinAggr._sum.nominal || 0;

    // 3. Top Up Hari Ini
    const topupAggr = await prisma.transaksiDompet.aggregate({
      _sum: { nominal: true },
      where: {
        jenis_transaksi: "TOPUP",
        created_at: { gte: today }
      }
    });
    const topupHariIni = topupAggr._sum.nominal || 0;

    // 4. Live Transaction Feed (10 transaksi terakhir)
    const recentTx = await prisma.transaksiDompet.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        dompet: {
          include: {
            pendaftar: {
              select: { nama_lengkap: true }
            }
          }
        }
      }
    });

    const feed = recentTx.map(tx => ({
      id: tx.id,
      jenis: tx.jenis_transaksi,
      nominal: Number(tx.nominal),
      keterangan: tx.keterangan,
      nama_santri: tx.dompet?.pendaftar?.nama_lengkap || "Unknown Santri",
      waktu: tx.created_at.toISOString()
    }));

    // 5. Chart Data (7 Hari Terakhir)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const tx7Days = await prisma.transaksiDompet.findMany({
      where: {
        created_at: { gte: sevenDaysAgo }
      },
      select: {
        jenis_transaksi: true,
        nominal: true,
        created_at: true
      }
    });

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const chartData = [];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      
      const dayTx = tx7Days.filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate.getDate() === d.getDate() && txDate.getMonth() === d.getMonth();
      });

      const topup = dayTx.filter(tx => tx.jenis_transaksi === 'TOPUP').reduce((sum, tx) => sum + Number(tx.nominal), 0);
      const jajan = dayTx.filter(tx => tx.jenis_transaksi === 'JAJAN_KANTIN').reduce((sum, tx) => sum + Number(tx.nominal), 0);

      chartData.push({
        day: dayName,
        topup: topup,
        jajan: jajan
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSaldo: Number(totalSaldo),
        omzetKantin: Number(omzetKantin),
        topupHariIni: Number(topupHariIni),
        totalTagihanLunas: 24500000, // Dummy data for Tagihan Lunas since we don't have SPP model yet
        feed,
        chartData
      }
    });

  } catch (error: any) {
    console.error("Admin Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
