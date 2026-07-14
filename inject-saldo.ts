import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pendaftar = await prisma.pendaftar.findFirst({
    where: { nama_lengkap: { contains: "Khubaib" } },
    include: { DompetSantri: true }
  });

  if (!pendaftar) return console.log("Khubaib not found");

  let dompetId = pendaftar.DompetSantri?.id;

  if (!dompetId) {
    const dompet = await prisma.dompetSantri.create({
      data: {
        pendaftar_id: pendaftar.id,
        qr_code_string: pendaftar.nomor_pendaftaran,
        saldo: 500000,
        status: "AKTIF"
      }
    });
    dompetId = dompet.id;
  } else {
    await prisma.dompetSantri.update({
      where: { id: dompetId },
      data: { saldo: 500000, status: "AKTIF" }
    });
  }

  await prisma.transaksiDompet.create({
    data: {
      dompet_id: dompetId,
      jenis_transaksi: "TOPUP",
      nominal: 500000,
      keterangan: "Top Up Perdana (Bonus Sistem)",
      saldo_akhir: 500000
    }
  });

  console.log("Saldo Khubaib berhasil diisi Rp 500.000!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
