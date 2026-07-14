# generate-kartu-v2.ps1
# Ekstrak template LENGKAP dari file asli, ganti hanya foto/nama/NIS

$srcFile  = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$outFile  = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\kartu-jajan-santri.html'

Write-Host "Membaca file asli..."
$html = [System.IO.File]::ReadAllText($srcFile, [System.Text.Encoding]::UTF8)

# --- Ekstrak CSS (termasuk background base64) ---
$cssStart = $html.IndexOf('<style>')
$cssEnd   = $html.IndexOf('</style>') + '</style>'.Length
$cssBlock = $html.Substring($cssStart, $cssEnd - $cssStart)
Write-Host "CSS diekstrak: $($cssBlock.Length) chars"

# --- Ekstrak DEPAN card template ---
$depanStart = $html.IndexOf('<!-- DEPAN -->')
$belakangStart = $html.IndexOf('<!-- BELAKANG -->')
$depanRaw = $html.Substring($depanStart, $belakangStart - $depanStart)
Write-Host "DEPAN template: $($depanRaw.Length) chars"

# --- Ekstrak BELAKANG card template ---
$bodyEnd = $html.LastIndexOf('</body>')
$belakangRaw = $html.Substring($belakangStart, $bodyEnd - $belakangStart)
Write-Host "BELAKANG template: $($belakangRaw.Length) chars"

# --- Temukan src foto santri di card DEPAN ---
# Foto ada di dalam <div class="photo-box"><img src="data:...">
$photoPattern = '(?s)(class="photo-box">\s*<img src=")[^"]+(")'
$hasPhoto = [regex]::IsMatch($depanRaw, $photoPattern)
Write-Host "Photo pattern found: $hasPhoto"

# --- Temukan nama santri (UPPERCASE) ---
# <h2>MUHAMMAD RASYA ATHAYA</h2>
$namePattern  = '(<h2>)[^<]+(</h2>)'
$nisPattern   = '(No Induk: )[^<]+'

# Ganti dengan placeholder
$depanTpl = [regex]::Replace($depanRaw, $photoPattern, '${1}PHOTO_SRC${2}')
$depanTpl = [regex]::Replace($depanTpl, $namePattern,  '${1}NAMA_SANTRI${2}')
$depanTpl = [regex]::Replace($depanTpl, $nisPattern,   '${1}NIS_SANTRI')

Write-Host "Template siap. Verifikasi placeholder:"
Write-Host "  - PHOTO_SRC: $($depanTpl.Contains('PHOTO_SRC'))"
Write-Host "  - NAMA_SANTRI: $($depanTpl.Contains('NAMA_SANTRI'))"
Write-Host "  - NIS_SANTRI: $($depanTpl.Contains('NIS_SANTRI'))"

# --- Data 29 santri ---
$santri = @(
    # MTs (15 santri)
    @{ Nama="Abdul Aziz Ali";              NIS="2601070001"; Foto="public/images/foto-kartu-jajan/abdul-aziz-ali.jpg" },
    @{ Nama="Abdul Hakim";                 NIS="2601070002"; Foto="public/images/foto-kartu-jajan/abdulhakim.jpg" },
    @{ Nama="Ahmad Farros Al Barqy";       NIS="2601070003"; Foto="public/images/foto-kartu-jajan/ahmad-farros-al-barqy.jpg" },
    @{ Nama="Atqanul Ummah Ahmad";         NIS="2601070004"; Foto="public/images/foto-kartu-jajan/atqanul-ummah-ahmad.jpg" },
    @{ Nama="Azka Panji Kusuma";           NIS="2601070005"; Foto="public/images/foto-kartu-jajan/azka-panji-kusuma.png" },
    @{ Nama="Fariq Malaibui";              NIS="2601070006"; Foto="public/images/foto-kartu-jajan/fariq-malaibui.png" },
    @{ Nama="Haidar Ayyubi";               NIS="2601070007"; Foto="public/images/foto-kartu-jajan/haidar-ayyubi.jpg" },
    @{ Nama="Labibullah El Fatih";         NIS="2601070008"; Foto="public/images/foto-kartu-jajan/labibullah-el-fatih.jpg" },
    @{ Nama="M Fazril Alkais";             NIS="2601070009"; Foto="public/images/foto-kartu-jajan/m-fazril-alkais.png" },
    @{ Nama="Muh Asrorin Da Silva";        NIS="2601070010"; Foto="public/images/foto-kartu-jajan/muh-asrorin-da-silva.png" },
    @{ Nama="Muhammad Azzam Al Hafiz";     NIS="2601070011"; Foto="public/images/foto-kartu-jajan/muhammad-azzam-al-hafidz.jpg" },
    @{ Nama="Muhammad Hafidz Reo Afelano"; NIS="2601070012"; Foto="public/images/foto-kartu-jajan/muhammad-hafidz-reo-afelano.jpg" },
    @{ Nama="Muhammad Rifqi Hamid";        NIS="2601070013"; Foto="public/images/foto-kartu-jajan/muhammad-rifqy-hamid.jpg" },
    @{ Nama="Muhammad Yahya Ayyash";       NIS="2601070014"; Foto="public/images/foto-kartu-jajan/muhammad-yahya-ayyash-mts.jpg" },
    @{ Nama="Naufal Dzakiy Purnama";       NIS="2601070015"; Foto="public/images/foto-kartu-jajan/naufal-dzakiy-purnama.jpg" },
    # IL (14 santri)
    @{ Nama="Abdurrahim Pati Raja";        NIS="2602070001"; Foto="public/images/foto-kartu-jajan/abdurrahim-pati-raja.png" },
    @{ Nama="Daffa Muammar Dzaki";         NIS="2602070002"; Foto="public/images/foto-kartu-jajan/daffa-muammar-dzaki.jpg" },
    @{ Nama="Fanni Hariri Hamonangan";     NIS="2602070003"; Foto="public/images/foto-kartu-jajan/fanni-hariri-hamonangan.jpg" },
    @{ Nama="Farid";                       NIS="2602070004"; Foto="public/images/foto-kartu-jajan/farid.jpg" },
    @{ Nama="Favian Radi";                 NIS="2602070005"; Foto="public/images/foto-kartu-jajan/favian-radi.jpg" },
    @{ Nama="Hibban Hibaturrahman";        NIS="2602070006"; Foto="public/images/foto-kartu-jajan/hibban-hibaturrahman.jpg" },
    @{ Nama="Ken Alfarezha Haryadi";       NIS="2602070007"; Foto="public/images/foto-kartu-jajan/ken-alfarezha-haryadi.jpg" },
    @{ Nama="Khubaib Abdul Aziz";          NIS="2602070008"; Foto="public/images/foto-kartu-jajan/khubaib-abdul-aziz.jpg" },
    @{ Nama="Lalu Muhamad Rizky Ananda";   NIS="2602070009"; Foto="public/images/foto-kartu-jajan/lalu-muhamad-rizky-ananda.jpg" },
    @{ Nama="Miizan Alghifary Dizlilar";   NIS="2602070010"; Foto="public/images/foto-kartu-jajan/miizan-alghifary-dizlilar.jpg" },
    @{ Nama="Muhammad Rasyid Ridho";       NIS="2602070011"; Foto="public/images/foto-kartu-jajan/muhammad-rasyid-ridho.png" },
    @{ Nama="Muhammad Rizky";              NIS="2602070012"; Foto="public/images/foto-kartu-jajan/muhammad-rizky.png" },
    @{ Nama="Raylan Akbar";                NIS="2602070013"; Foto="public/images/foto-kartu-jajan/raylan-akbar.png" },
    @{ Nama="Zakaria Reynaldo";            NIS="2602070014"; Foto="public/images/foto-kartu-jajan/zakaria-reynaldo.jpg" }
)

# --- Ekstrak HEAD section (untuk fonts/links) ---
$headStart = $html.IndexOf('<head>')
$headEnd   = $html.IndexOf('</head>') + '</head>'.Length
$headBlock = $html.Substring($headStart, $headEnd - $headStart)

# --- Generate body cards ---
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('<!DOCTYPE html>')
[void]$sb.AppendLine('<html lang="id">')
# Ganti title di head
$newHead = $headBlock -replace '<title>[^<]*</title>', '<title>Kartu Jajan Santri Al Imam 2026</title>'
# Modifikasi CSS body agar flex-wrap
$newHead = $newHead -replace '(body \{[^}]+)justify-content: center;', '$1justify-content: center; flex-wrap: wrap;'
[void]$sb.AppendLine($newHead)
[void]$sb.AppendLine('<body>')
[void]$sb.AppendLine('<div style="width:100%;text-align:center;color:#ddc192;font-family:Montserrat,sans-serif;font-size:18px;font-weight:800;padding:10px;background:#2a0000;margin-bottom:10px;">')
[void]$sb.AppendLine("&#9733; KARTU JAJAN SANTRI &mdash; PESANTREN AL IMAM 2026 &mdash; $($santri.Count) Santri &#9733;")
[void]$sb.AppendLine('</div>')

$no = 1
foreach ($s in $santri) {
    Write-Host "Generating kartu #$no - $($s.Nama)..."
    
    # Front card
    $front = $depanTpl
    $front = $front -replace 'PHOTO_SRC', $s.Foto
    $front = $front -replace 'NAMA_SANTRI', $s.Nama.ToUpper()
    $front = $front -replace 'NIS_SANTRI', $s.NIS
    
    [void]$sb.AppendLine("<!-- Santri #$no : $($s.Nama) DEPAN -->")
    [void]$sb.AppendLine($front)
    
    # Back card (identical for all)
    [void]$sb.AppendLine("<!-- Santri #$no : $($s.Nama) BELAKANG -->")
    [void]$sb.AppendLine($belakangRaw)
    
    $no++
}

[void]$sb.AppendLine('</body>')
[void]$sb.AppendLine('</html>')

# --- Tulis output ---
Write-Host ""
Write-Host "Menulis file output..."
[System.IO.File]::WriteAllText($outFile, $sb.ToString(), [System.Text.Encoding]::UTF8)

$sizeKB = [Math]::Round((Get-Item $outFile).Length / 1KB)
Write-Host ""
Write-Host "====================================="
Write-Host "SELESAI!"
Write-Host "File: $outFile"
Write-Host "Ukuran: ${sizeKB} KB"
Write-Host "Total santri: $($santri.Count)"
Write-Host "====================================="
