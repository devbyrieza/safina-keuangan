# Script: generate-kartu-jajan.ps1
# Membaca CSS dari file asli, lalu generate kartu jajan untuk 29 santri

$srcFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$outFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\kartu-jajan-santri.html'

Write-Host "Membaca file asli..."
$html = Get-Content $srcFile -Raw

# Ekstrak CSS dari <style> sampai </style>
$cssMatch = [regex]::Match($html, '(?s)<style>(.*?)</style>')
$css = $cssMatch.Groups[1].Value
Write-Host "CSS berhasil diekstrak."

# Data santri: Nama, NIS, Jenjang, FilenameFoto
$santri = @(
    # MTs
    @{ Nama="Abdul Aziz Ali";           NIS="2601070001"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/abdul-aziz-ali.jpg" },
    @{ Nama="Abdul Hakim";              NIS="2601070002"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/abdulhakim.jpg" },
    @{ Nama="Ahmad Farros Al Barqy";    NIS="2601070003"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/ahmad-farros-al-barqy.jpg" },
    @{ Nama="Atqanul Ummah Ahmad";      NIS="2601070004"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/atqanul-ummah-ahmad.jpg" },
    @{ Nama="Azka Panji Kusuma";        NIS="2601070005"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/azka-panji-kusuma.png" },
    @{ Nama="Fariq Malaibui";           NIS="2601070006"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/fariq-malaibui.png" },
    @{ Nama="Haidar Ayyubi";            NIS="2601070007"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/haidar-ayyubi.jpg" },
    @{ Nama="Labibullah El Fatih";      NIS="2601070008"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/labibullah-el-fatih.jpg" },
    @{ Nama="M Fazril Alkais";          NIS="2601070009"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/m-fazril-alkais.png" },
    @{ Nama="Muh Asrorin Da Silva";     NIS="2601070010"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/muh-asrorin-da-silva.png" },
    @{ Nama="Muhammad Azzam Al Hafiz";  NIS="2601070011"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/muhammad-azzam-al-hafidz.jpg" },
    @{ Nama="Muhammad Hafidz Reo Afelano"; NIS="2601070012"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/muhammad-hafidz-reo-afelano.jpg" },
    @{ Nama="Muhammad Rifqi Hamid";     NIS="2601070013"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/muhammad-rifqy-hamid.jpg" },
    @{ Nama="Muhammad Yahya Ayyash";    NIS="2601070014"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/muhammad-yahya-ayyash-mts.jpg" },
    @{ Nama="Naufal Dzakiy Purnama";    NIS="2601070015"; Jenjang="MTs"; Foto="public/images/foto-kartu-jajan/naufal-dzakiy-purnama.jpg" },
    # IL
    @{ Nama="Abdurrahim Pati Raja";     NIS="2602070001"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/abdurrahim-pati-raja.png" },
    @{ Nama="Daffa Muammar Dzaki";      NIS="2602070002"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/daffa-muammar-dzaki.jpg" },
    @{ Nama="Fanni Hariri Hamonangan";  NIS="2602070003"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/fanni-hariri-hamonangan.jpg" },
    @{ Nama="Farid";                    NIS="2602070004"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/farid.jpg" },
    @{ Nama="Favian Radi";              NIS="2602070005"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/favian-radi.jpg" },
    @{ Nama="Hibban Hibaturrahman";     NIS="2602070006"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/hibban-hibaturrahman.jpg" },
    @{ Nama="Ken Alfarezha Haryadi";    NIS="2602070007"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/ken-alfarezha-haryadi.jpg" },
    @{ Nama="Khubaib Abdul Aziz";       NIS="2602070008"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/khubaib-abdul-aziz.jpg" },
    @{ Nama="Lalu Muhamad Rizky Ananda"; NIS="2602070009"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/lalu-muhamad-rizky-ananda.jpg" },
    @{ Nama="Miizan Alghifary Dizlilar"; NIS="2602070010"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/miizan-alghifary-dizlilar.jpg" },
    @{ Nama="Muhammad Rasyid Ridho";    NIS="2602070011"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/muhammad-rasyid-ridho.png" },
    @{ Nama="Muhammad Rizky";           NIS="2602070012"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/muhammad-rizky.png" },
    @{ Nama="Raylan Akbar";             NIS="2602070013"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/raylan-akbar.png" },
    @{ Nama="Zakaria Reynaldo";         NIS="2602070014"; Jenjang="IL"; Foto="public/images/foto-kartu-jajan/zakaria-reynaldo.jpg" }
)

# Ekstrak logo dan back-logo base64 dari HTML asli
$logoMatch = [regex]::Match($html, 'class="pill-logo">[\s]*<img src="([^"]+)"')
$logoSrc = $logoMatch.Groups[1].Value

$backLogoMatch = [regex]::Match($html, 'class="watermark">[\s]*<img src="([^"]+)"')
$backLogoSrc = $backLogoMatch.Groups[1].Value

$backHeaderLogoMatch = [regex]::Match($html, 'class="header-back">[\s]*<h3>[^<]+</h3>[\s]*<h2>[^<]+</h2>[\s]*<p>[^<]+</p>[\s]*<img src="([^"]+)"')
# Ekstrak logo al-andalus di back
$alAndalogoMatch = [regex]::Match($html, 'header-back.*?<img src="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$alAndalogoSrc = $alAndalogoMatch.Groups[1].Value

Write-Host "Logo extracted: $($logoSrc.Substring(0,[Math]::Min(50,$logoSrc.Length)))..."

# Ekstrak section back card dari HTML asli (satu contoh)
$backCardMatch = [regex]::Match($html, '(?s)<!-- BELAKANG -->(.*?)(?=<!-- DEPAN -->|$)')
$backCardTemplate = $backCardMatch.Groups[1].Value
# Ambil konten dari div id-card pertama setelah <!-- BELAKANG -->
$backInnerMatch = [regex]::Match($backCardTemplate, '(?s)<div class="id-card">(.*?)</div>\s*</body>')
$backInner = $backInnerMatch.Groups[1].Value

Write-Host "Back card inner length: $($backInner.Length)"

# Ambil konten back card dari HTML asli
$fullBackMatch = [regex]::Match($html, '(?s)(<!-- BELAKANG -->[\s\S]*?</div>[\s]*</body>)')
$fullBack = $fullBackMatch.Groups[1].Value

# Generate cards HTML
$cards = ""
$no = 1
foreach ($s in $santri) {
    $namaUpper = $s.Nama.ToUpper()
    $cards += @"

    <!-- DEPAN - $($s.Nama) -->
    <div class="id-card front-card">
        <div class="overlay"></div>
        <div class="content">
            <div class="pill-logo">
                <img src="$logoSrc" alt="logo" style="width:40px;">
            </div>
            <div class="photo-box">
                <img src="$($s.Foto)" alt="$($s.Nama)" style="width:100%;height:100%;object-fit:cover;object-position:top;">
            </div>
            <div class="student-info">
                <h2>$namaUpper</h2>
                <p>No Induk: $($s.NIS)</p>
            </div>
            <div class="qr-box"></div>
        </div>
        <div class="pill-text">P<br>A<br>A<br>S</div>
    </div>
"@
    $no++
}

# Bangun HTML lengkap
$output = @"
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kartu Jajan Santri - Pesantren Al Imam 2026</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
$css

        /* Layout grid untuk print */
        body {
            background-color: #525659;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 30px;
            font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
            justify-content: center;
        }

        .front-card .pill-text {
            position: absolute;
            top: 10px;
            bottom: 10px;
            right: 15px;
            width: 55px;
            background-color: var(--primary-maroon);
            border-radius: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: transparent;
            -webkit-text-stroke: 1px white;
            font-size: 32px;
            font-weight: 800;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 5px;
            writing-mode: vertical-rl;
            text-orientation: upright;
            box-shadow: -2px 0px 10px rgba(0,0,0,0.1);
        }

        @media print {
            body { background: white; padding: 10px; gap: 10px; }
            .id-card { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div style="width:100%;text-align:center;color:#ddc192;font-size:20px;font-weight:800;margin-bottom:10px;">
        &#9733; KARTU JAJAN SANTRI - PESANTREN AL IMAM 2026 &mdash; ${$santri.Count} Santri &#9733;
    </div>

$cards

</body>
</html>
"@

$output | Out-File -FilePath $outFile -Encoding UTF8
Write-Host ""
Write-Host "====================================="
Write-Host "SELESAI! File tersimpan di:"
Write-Host $outFile
Write-Host "Total santri: $($santri.Count)"
Write-Host "====================================="
