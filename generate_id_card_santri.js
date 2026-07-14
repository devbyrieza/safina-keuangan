const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = XLSX.readFile('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/documents/Data_Siswa_CRM_Al_Imam_TERISI.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

const photoDir = 'C:/Users/itpua/Dev/Work/al-andalus/safina-keuangan/public/images/foto-kartu-jajan';
const photos = fs.readdirSync(photoDir);

function findPhoto(nama) {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const normalizedName = normalize(nama);
    for (const photo of photos) {
        const photoBase = path.basename(photo, path.extname(photo));
        if (normalize(photoBase) === normalizedName) return photo;
    }
    const nameWords = normalizedName.split('-').filter(w => w.length > 2);
    for (const photo of photos) {
        const photoBase = normalize(path.basename(photo, path.extname(photo)));
        const matchCount = nameWords.filter(w => photoBase.includes(w)).length;
        if (matchCount >= Math.min(2, nameWords.length)) return photo;
    }
    return null;
}

function formatDate(val) {
    if (!val) return '-';
    if (typeof val === 'number') {
        const date = new Date((val - 25569) * 86400 * 1000);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return val;
}

const cards = data.map((row, idx) => {
    const nama = row['Nama'] || '-';
    const nis = row['Nomor Identitas 1'] || '-';
    let kelas = row['Kelas Detail'] || row['Kelas'] || '-';
    if (typeof kelas === 'string') {
        kelas = kelas.replace(/7 MTs/g, 'MTs').replace(/Kelas IL/g, 'IL');
    }

    const photo = findPhoto(nama);
    const photoPath = photo ? `../safina-keuangan/public/images/foto-kartu-jajan/${photo}` : null;

    const nameParts = nama.split(' ');
    let nameDisplay = nama;
    if (nameParts.length > 3) {
        const mid = Math.ceil(nameParts.length / 2);
        nameDisplay = nameParts.slice(0, mid).join(' ') + '<br>' + nameParts.slice(mid).join(' ');
    }

    return `
        <!-- ${idx + 1}. ${nama} -->
        <div class="id-card">
            <div class="card-header">
                <div class="logos-row">
                    <img src="public/images/logo.png" alt="Al Imam">
                    <img src="public/images/logo-andalus.png" alt="Andalus">
                </div>
                <div class="header-pesantren">PESANTREN<br>AL-IMAM AL-ISLAMI</div>
                <div class="header-event">Welcome Day Santri Baru 2026</div>
            </div>
            <div class="photo-wrap">
                <div class="photo-box">
                    ${photoPath
                        ? `<img src="${photoPath}" alt="${nama}" style="width:100%;height:100%;object-fit:cover;object-position:top;">`
                        : `<div class="no-photo">FOTO<br>BELUM<br>ADA</div>`
                    }
                </div>
            </div>
            <div class="card-body">
                <div class="badge-santri">SANTRI BARU</div>
                <div class="card-name">${nameDisplay}</div>
                <div class="divider"></div>
                <div class="info-rows">
                    <div class="info-row">
                        <span class="info-label">NIS</span>
                        <span class="info-value">${nis}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Jenjang</span>
                        <span class="info-value">${kelas}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">WELCOME DAY · AL-IMAM · 2026</div>
        </div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Card Santri — Welcome Day Pesantren Al-Imam Al-Islami 2026</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --maroon:       #6b0000;
            --maroon-deep:  #3d0000;
            --maroon-light: #8b1a1a;
            --gold:         #b8994e;
            --gold-dark:    #8c6e2a;
            --gold-light:   #f0d890;
            --cream:        #fdf8f0;
            --cream-dark:   #f2e8d0;
            --cream-mid:    #e8d8b8;
            --white:        #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background: #f0e8d8;
            background-image:
                radial-gradient(ellipse 70% 50% at 20% 20%, rgba(107,0,0,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 60% 70% at 80% 80%, rgba(184,153,78,0.1) 0%, transparent 60%);
            min-height: 100vh;
            padding: 3rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
        }

        /* ===== PAGE HEADER ===== */
        .page-header { text-align: center; }
        .basmalah {
            font-size: 1.5rem;
            color: var(--maroon);
            margin-bottom: 0.5rem;
            opacity: 0.75;
        }
        .page-header h1 {
            font-family: 'Cinzel', serif;
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--maroon-deep);
            letter-spacing: 2px;
        }
        .page-header p {
            color: rgba(61,0,0,0.5);
            font-size: 0.82rem;
            margin-top: 0.3rem;
            letter-spacing: 0.5px;
        }

        /* ===== BUTTONS ===== */
        .btn-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .btn {
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            border: none;
            letter-spacing: 0.5px;
        }
        .btn-print {
            background: linear-gradient(135deg, var(--maroon-deep), var(--maroon));
            color: var(--gold-light);
            box-shadow: 0 4px 20px rgba(61,0,0,0.25);
        }
        .btn-print:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(61,0,0,0.4); }

        /* ===== SECTION TITLE ===== */
        .section-title {
            display: flex; align-items: center; gap: 1rem;
            width: 100%; max-width: 1100px;
        }
        .section-title::before, .section-title::after {
            content: ''; flex: 1; height: 1px;
            background: linear-gradient(90deg, transparent, var(--gold-dark));
        }
        .section-title::after { background: linear-gradient(90deg, var(--gold-dark), transparent); }
        .section-title span {
            font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem;
            color: var(--maroon); letter-spacing: 2px; text-transform: uppercase; white-space: nowrap;
        }

        /* ===== CARDS GRID ===== */
        .cards-grid {
            display: flex; gap: 1rem; flex-wrap: wrap;
            justify-content: center; max-width: 1150px;
        }

        /* ===== ID CARD — LIGHT THEME ===== */
        .id-card {
            width: 54mm;
            height: 86mm;
            border-radius: 14px;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
            background: var(--cream);
            box-shadow:
                0 8px 30px rgba(61,0,0,0.15),
                0 0 0 1px rgba(184,153,78,0.35);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            flex-shrink: 0;
        }
        .id-card:hover {
            transform: translateY(-6px) rotate(-0.3deg);
            box-shadow:
                0 20px 50px rgba(61,0,0,0.25),
                0 0 0 1px rgba(184,153,78,0.6),
                0 0 20px rgba(184,153,78,0.15);
        }

        /* HEADER — Maroon gradient */
        .card-header {
            background: linear-gradient(160deg, var(--maroon-deep) 0%, var(--maroon) 55%, var(--maroon-light) 100%);
            text-align: center;
            padding: 0.65rem 0.6rem 2.2rem;
            position: relative;
            clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
            flex-shrink: 0;
        }
        .card-header::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, transparent, var(--gold-light), var(--gold), var(--gold-light), transparent);
        }
        .card-header::after {
            content: '';
            position: absolute; bottom: 27px; left: 12%; width: 76%; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(240,216,144,0.5), transparent);
        }

        .logos-row {
            display: flex; justify-content: center; align-items: center;
            gap: 6px; margin-bottom: 4px;
        }
        .logos-row img { height: 16px; width: auto; opacity: 0.92; }

        .header-pesantren {
            font-family: 'Cinzel', serif;
            font-size: 0.6rem; font-weight: 700;
            color: var(--gold-light);
            letter-spacing: 0.6px; line-height: 1.3;
            text-shadow: 0 1px 6px rgba(0,0,0,0.6);
            margin-bottom: 0.15rem;
        }
        .header-event {
            font-size: 0.4rem;
            color: rgba(240,216,144,0.7);
            letter-spacing: 0.5px; font-weight: 500;
        }

        /* PHOTO */
        .photo-wrap {
            display: flex; justify-content: center;
            margin-top: -28px; position: relative; z-index: 10; flex-shrink: 0;
        }
        .photo-box {
            width: 68px; height: 85px; border-radius: 8px;
            background: var(--cream-dark);
            border: 2.5px solid var(--gold);
            display: flex; align-items: center; justify-content: center;
            box-shadow:
                0 0 0 3px rgba(184,153,78,0.2),
                0 0 12px rgba(184,153,78,0.3),
                0 4px 16px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .photo-box img {
            width: 100%; height: 100%; object-fit: cover;
            object-position: top center;
            filter: brightness(1.05) contrast(1.05) saturate(1.05);
            display: block;
        }
        .no-photo {
            display: flex; align-items: center; justify-content: center;
            height: 100%; color: rgba(107,0,0,0.35);
            font-size: 0.5rem; text-align: center; font-weight: 700;
        }

        /* CARD BODY */
        .card-body {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 0.35rem 0.6rem 0.25rem;
            gap: 0.28rem;
        }

        /* SANTRI Badge */
        .badge-santri {
            background: linear-gradient(135deg, var(--maroon-deep), var(--maroon));
            color: var(--gold-light);
            font-family: 'Outfit', sans-serif;
            font-weight: 900; font-size: 0.66rem; letter-spacing: 2px;
            padding: 0.18rem 0.7rem; border-radius: 3px;
            border: 1px solid rgba(184,153,78,0.4);
            box-shadow: 0 2px 8px rgba(61,0,0,0.35);
            text-transform: uppercase;
        }

        /* NAME */
        .card-name {
            font-family: 'Outfit', sans-serif;
            font-size: 0.78rem; font-weight: 800;
            color: var(--maroon-deep); text-align: center; line-height: 1.2;
        }

        /* DIVIDER */
        .divider {
            width: 65%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            flex-shrink: 0;
        }

        /* INFO ROWS */
        .info-rows { width: 100%; display: flex; flex-direction: column; gap: 2px; }
        .info-row {
            display: flex; justify-content: space-between; align-items: center; padding: 0 2px;
        }
        .info-label {
            font-size: 0.38rem; text-transform: uppercase;
            color: rgba(107,0,0,0.45); letter-spacing: 1px; font-weight: 700;
        }
        .info-value { font-size: 0.62rem; color: var(--maroon); font-weight: 700; }

        /* FOOTER */
        .card-footer {
            background: linear-gradient(90deg, var(--maroon-deep) 0%, var(--maroon) 50%, var(--maroon-deep) 100%);
            color: var(--gold-light);
            text-align: center; padding: 0.38rem 0.5rem;
            font-family: 'Outfit', sans-serif;
            font-size: 0.44rem; font-weight: 900;
            letter-spacing: 1.8px; text-transform: uppercase;
            border-top: 1.5px solid rgba(184,153,78,0.4);
            flex-shrink: 0;
        }

        /* DECORATIVE background pattern on card body area */
        .id-card::before {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 55%;
            background-image: radial-gradient(rgba(184,153,78,0.08) 1px, transparent 1px);
            background-size: 8px 8px;
            pointer-events: none;
            z-index: 0;
        }
        .card-body, .photo-wrap { position: relative; z-index: 1; }

        /* PRINT */
        @media print {
            body { background: white !important; padding: 8mm !important; }
            .page-header, .btn-row, .section-title { display: none !important; }
            .cards-grid { gap: 5mm !important; max-width: 100% !important; }
            .id-card {
                box-shadow: none !important;
                border: 0.5px solid #ccc !important;
                transform: none !important;
                transition: none !important;
                break-inside: avoid;
            }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>
<body>

    <div class="page-header">
        <div class="basmalah">﷽</div>
        <h1>ID CARD SANTRI BARU</h1>
        <p>Welcome Day · Pesantren Al-Imam Al-Islami Sukabumi · Tahun Pelajaran 2026/2027</p>
    </div>

    <div class="btn-row">
        <button class="btn btn-print" onclick="window.print()">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            CETAK SEMUA ID CARD SANTRI (36)
        </button>
    </div>

    <div class="section-title"><span>🎓 Preview ID Card — 36 Santri Baru</span></div>

    <div class="cards-grid">
${cards}
    </div>

</body>
</html>`;

fs.writeFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-santri.html', html);
console.log('Done! Light cream theme applied.');
