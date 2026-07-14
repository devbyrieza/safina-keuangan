import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { dompet_id } = await req.json();

    if (!dompet_id) {
      return NextResponse.json({ success: false, message: "ID Dompet tidak valid" }, { status: 400 });
    }

    const dompet = await prisma.dompetSantri.findUnique({
      where: { id: dompet_id }
    });

    if (!dompet) {
      return NextResponse.json({ success: false, message: "Dompet tidak ditemukan" }, { status: 404 });
    }

    // Buka gembok sampai jam 23:59:59 hari ini
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updatedDompet = await prisma.dompetSantri.update({
      where: { id: dompet_id },
      data: {
        is_limit_terbuka: true,
        limit_terbuka_sampai: endOfDay
      }
    });

    return NextResponse.json({
      success: true,
      message: "Gembok limit berhasil dibuka untuk hari ini",
      data: updatedDompet
    });

  } catch (error: any) {
    console.error("Buka Gembok API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
