import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { qr_code } = await req.json();

    if (!qr_code) {
      return NextResponse.json({ success: false, message: "QR Code tidak boleh kosong" }, { status: 400 });
    }

    // Cari pendaftar berdasarkan nomor pendaftaran ATAU string unik dari QR Code dompet
    const pendaftar = await prisma.pendaftar.findFirst({
      where: {
        OR: [
          { nomor_pendaftaran: qr_code },
          { DompetSantri: { qr_code_string: qr_code } }
        ]
      },
      include: {
        DompetSantri: true,
      }
    });

    if (!pendaftar) {
      return NextResponse.json({ success: false, message: "Santri tidak ditemukan" }, { status: 404 });
    }

    if (!pendaftar.DompetSantri) {
      // Jika dompet belum dibuat, buatkan secara otomatis
      const dompet = await prisma.dompetSantri.create({
        data: {
          pendaftar_id: pendaftar.id,
          qr_code_string: pendaftar.nomor_pendaftaran,
          saldo: 0,
        }
      });
      pendaftar.DompetSantri = dompet;
    }

    if (pendaftar.DompetSantri.status !== 'AKTIF') {
       return NextResponse.json({ success: false, message: `Kartu diblokir atau tidak aktif (Status: ${pendaftar.DompetSantri.status})` }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: pendaftar.id,
        nomor_pendaftaran: pendaftar.nomor_pendaftaran,
        nama_lengkap: pendaftar.nama_lengkap,
        jenjang: pendaftar.jenjang,
        foto_url: getFotoUrl(pendaftar.nama_lengkap),
        dompet: {
          id: pendaftar.DompetSantri.id,
          saldo: pendaftar.DompetSantri.saldo,
          batas_jajan_harian: pendaftar.DompetSantri.batas_jajan_harian,
        }
      }
    });

  } catch (error: any) {
    console.error("Error scanning QR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}

function getFotoUrl(namaLengkap: string): string {
  try {
    const photoDir = path.join(process.cwd(), "public/images/foto-kartu-jajan");
    if (!fs.existsSync(photoDir)) return "/images/avatars/default.png";
    
    const files = fs.readdirSync(photoDir);
    
    // 1. Coba cari file yang namanya sama persis dengan slug namaLengkap (misal: "khubaib-abdul-aziz")
    const slug = namaLengkap.toLowerCase().replace(/\s+/g, '-');
    const exactMatch = files.find(f => f.toLowerCase().includes(slug));
    if (exactMatch) return `/images/foto-kartu-jajan/${exactMatch}`;
    
    // 2. Jika tidak ada yang sama persis, cari yang memiliki paling banyak kata yang cocok
    const searchWords = namaLengkap.toLowerCase().split(" ").filter(w => w.length > 2);
    let bestMatch = null;
    let maxMatches = 0;
    
    for (const file of files) {
      const filename = file.toLowerCase();
      const matches = searchWords.filter(word => filename.includes(word)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = file;
      }
    }
    
    if (bestMatch && maxMatches > 0) {
      return `/images/foto-kartu-jajan/${bestMatch}`;
    }
  } catch (e) {
    console.error("Error finding photo", e);
  }
  return "/images/avatars/default.png";
}
