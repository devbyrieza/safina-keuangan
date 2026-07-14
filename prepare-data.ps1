$santri = @(
    @{ Nama='Abdul Aziz Ali'; NIS='2601070001'; Foto='public/images/foto-kartu-jajan/abdul-aziz-ali.jpg' },
    @{ Nama='Abdul Hakim'; NIS='2601070002'; Foto='public/images/foto-kartu-jajan/abdulhakim.jpg' },
    @{ Nama='Ahmad Farros Al Barqy'; NIS='2601070003'; Foto='public/images/foto-kartu-jajan/ahmad-farros-al-barqy.jpg' },
    @{ Nama='Atqanul Ummah Ahmad'; NIS='2601070004'; Foto='public/images/foto-kartu-jajan/atqanul-ummah-ahmad.jpg' },
    @{ Nama='Azka Panji Kusuma'; NIS='2601070005'; Foto='public/images/foto-kartu-jajan/azka-panji-kusuma.png' },
    @{ Nama='Fariq Malaibui'; NIS='2601070006'; Foto='public/images/foto-kartu-jajan/fariq-malaibui.png' },
    @{ Nama='Haidar Ayyubi'; NIS='2601070007'; Foto='public/images/foto-kartu-jajan/haidar-ayyubi.jpg' },
    @{ Nama='Labibullah El Fatih'; NIS='2601070008'; Foto='public/images/foto-kartu-jajan/labibullah-el-fatih.jpg' },
    @{ Nama='M Fazril Alkais'; NIS='2601070009'; Foto='public/images/foto-kartu-jajan/m-fazril-alkais.png' },
    @{ Nama='Muh Asrorin Da Silva'; NIS='2601070010'; Foto='public/images/foto-kartu-jajan/muh-asrorin-da-silva.png' },
    @{ Nama='Muhammad Azzam Al Hafiz'; NIS='2601070011'; Foto='public/images/foto-kartu-jajan/muhammad-azzam-al-hafidz.jpg' },
    @{ Nama='Muhammad Hafidz Reo Afelano'; NIS='2601070012'; Foto='public/images/foto-kartu-jajan/muhammad-hafidz-reo-afelano.jpg' },
    @{ Nama='Muhammad Rifqi Hamid'; NIS='2601070013'; Foto='public/images/foto-kartu-jajan/muhammad-rifqy-hamid.jpg' },
    @{ Nama='Muhammad Yahya Ayyash'; NIS='2601070014'; Foto='public/images/foto-kartu-jajan/muhammad-yahya-ayyash-mts.jpg' },
    @{ Nama='Naufal Dzakiy Purnama'; NIS='2601070015'; Foto='public/images/foto-kartu-jajan/naufal-dzakiy-purnama.jpg' },
    @{ Nama='Abdurrahim Pati Raja'; NIS='2602070001'; Foto='public/images/foto-kartu-jajan/abdurrahim-pati-raja.png' },
    @{ Nama='Daffa Muammar Dzaki'; NIS='2602070002'; Foto='public/images/foto-kartu-jajan/daffa-muammar-dzaki.jpg' },
    @{ Nama='Fanni Hariri Hamonangan'; NIS='2602070003'; Foto='public/images/foto-kartu-jajan/fanni-hariri-hamonangan.jpg' },
    @{ Nama='Farid'; NIS='2602070004'; Foto='public/images/foto-kartu-jajan/farid.jpg' },
    @{ Nama='Favian Radi'; NIS='2602070005'; Foto='public/images/foto-kartu-jajan/favian-radi.jpg' },
    @{ Nama='Hibban Hibaturrahman'; NIS='2602070006'; Foto='public/images/foto-kartu-jajan/hibban-hibaturrahman.jpg' },
    @{ Nama='Ken Alfarezha Haryadi'; NIS='2602070007'; Foto='public/images/foto-kartu-jajan/ken-alfarezha-haryadi.jpg' },
    @{ Nama='Khubaib Abdul Aziz'; NIS='2602070008'; Foto='public/images/foto-kartu-jajan/khubaib-abdul-aziz.jpg' },
    @{ Nama='Lalu Muhamad Rizky Ananda'; NIS='2602070009'; Foto='public/images/foto-kartu-jajan/lalu-muhamad-rizky-ananda.jpg' },
    @{ Nama='Miizan Alghifary Dizlilar'; NIS='2602070010'; Foto='public/images/foto-kartu-jajan/miizan-alghifary-dizlilar.jpg' },
    @{ Nama='Muhammad Rasyid Ridho'; NIS='2602070011'; Foto='public/images/foto-kartu-jajan/muhammad-rasyid-ridho.png' },
    @{ Nama='Muhammad Rizky'; NIS='2602070012'; Foto='public/images/foto-kartu-jajan/muhammad-rizky.png' },
    @{ Nama='Raylan Akbar'; NIS='2602070013'; Foto='public/images/foto-kartu-jajan/raylan-akbar.png' },
    @{ Nama='Zakaria Reynaldo'; NIS='2602070014'; Foto='public/images/foto-kartu-jajan/zakaria-reynaldo.jpg' }
)

$outDir = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_Foto_PSP'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

foreach ($s in $santri) {
    $src = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\' + $s.Foto
    if (Test-Path $src) {
        $ext = [System.IO.Path]::GetExtension($src)
        $dest = Join-Path $outDir ($s.NIS + $ext)
        Copy-Item -Path $src -Destination $dest -Force
    }
}
Write-Host 'Copied and renamed files:'
Get-ChildItem $outDir | Select-Object Name

# Make sure we don't include an existing zip file
$zipPath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_Foto_PSP.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Compress-Archive -Path "$outDir\*" -DestinationPath $zipPath -Force
Write-Host 'Created ZIP file.'
