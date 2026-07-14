$exportDir = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam'
$photoExportDir = Join-Path $exportDir '04_Foto_Santri_Berdasarkan_NIS'
$photoSrcDir = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\public\images\foto-kartu-jajan'
$jsonFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json'

# Ensure directories
if (-not (Test-Path $exportDir)) { New-Item -ItemType Directory -Force -Path $exportDir | Out-Null }
if (Test-Path $photoExportDir) { Remove-Item -Recurse -Force $photoExportDir }
New-Item -ItemType Directory -Force -Path $photoExportDir | Out-Null

$jsonData = Get-Content $jsonFile -Raw | ConvertFrom-Json
$students = @()
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $students += $item
    }
}

$availablePhotos = Get-ChildItem -Path $photoSrcDir -File | Where-Object { $_.Extension -match '\.(jpg|png|jpeg)$' }
$mappedStudents = @()

Write-Host "Mapping 36 students..."
foreach ($s in $students) {
    $nama = $s.C2
    $nis = $s.C4
    $simpleName = $nama.ToLower() -replace '[^a-z0-9]', ''
    
    $matchedPhoto = $null
    foreach ($p in $availablePhotos) {
        $pName = $p.Name.ToLower() -replace '[^a-z0-9]', ''
        if ($pName -match $simpleName -or $simpleName -match ($p.BaseName.ToLower() -replace '[^a-z0-9]', '')) {
            $matchedPhoto = $p
            break
        }
    }
    
    if (-not $matchedPhoto) {
        if ($nama -match 'Abdul Hakim') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'abdulhakim' | Select -First 1 }
        if ($nama -match 'M Fazril') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'fazril' | Select -First 1 }
        if ($nama -match 'Muh Asrorin') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'asrorin' | Select -First 1 }
        if ($nama -match 'Azzam') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'azzam' | Select -First 1 }
        if ($nama -match 'Hafidz Reo') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'reo' | Select -First 1 }
        if ($nama -match 'Yahya Ayyash') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'ayyash' | Select -First 1 }
        if ($nama -match 'Rasyid Ridho') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'rasyid' | Select -First 1 }
        if ($nama -match 'Rifqi Hamid') { $matchedPhoto = $availablePhotos | Where-Object Name -match 'rifqy' | Select -First 1 }
        if (-not $matchedPhoto) {
            $matchedPhoto = $availablePhotos | Where-Object Name -match $nis | Select -First 1
        }
    }
    
    if ($matchedPhoto) {
        $ext = $matchedPhoto.Extension
        $newPhotoName = "$nis$ext"
        $destPath = Join-Path $photoExportDir $newPhotoName
        Copy-Item $matchedPhoto.FullName $destPath -Force
        
        $bytes = [System.IO.File]::ReadAllBytes($matchedPhoto.FullName)
        $base64 = [System.Convert]::ToBase64String($bytes)
        $extClean = $matchedPhoto.Extension.Replace('.','').ToLower()
        if ($extClean -eq 'jpg') { $extClean = 'jpeg' }
        
        $mappedStudents += @{
            Nama = $nama
            NIS = $nis
            Foto = "data:image/$extClean;base64,$base64"
        }
    }
}
Write-Host "Mapped $($mappedStudents.Count) photos!"

Write-Host "Generating HTML Preview..."
$logoPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\logo.png'
$logoBytes = [System.IO.File]::ReadAllBytes($logoPath)
$logoBase64 = [System.Convert]::ToBase64String($logoBytes)

# We will generate a base64 QR for each student to make it purely offline
$qrBase = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data="
$webClient = New-Object System.Net.WebClient

$html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview Kartu Santri Al Imam (36 Santri)</title>
    <style>
        body {
            background: #333;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            padding: 40px;
            font-family: Arial, sans-serif;
        }
        .card-container {
            display: flex;
            gap: 20px;
            background: #444;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
        .card {
            width: 204px;
            height: 324px;
            position: relative;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            background-size: cover;
            background-position: center;
        }
        .card-front {
            background-image: url('data:image/svg+xml;utf8,<svg width="204" height="324" viewBox="0 0 204 324" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="204" height="324" fill="white"/><path d="M0 0H204V324H0V0Z" fill="url(%23paint0_linear)"/><path d="M140 0C140 33.1371 166.863 60 200 60H204V324H0V0H140Z" fill="%23550000"/><defs><linearGradient id="paint0_linear" x1="102" y1="0" x2="102" y2="324" gradientUnits="userSpaceOnUse"><stop stop-color="%23E2E2E2"/><stop offset="1" stop-color="%23FFFFFF"/></linearGradient></defs></svg>');
        }
        .card-front::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg width="204" height="324" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 204 324" stroke="%23330000" stroke-width="2" opacity="0.1"/></svg>');
            pointer-events: none;
        }
        .photo-box {
            position: absolute;
            top: 60px;
            left: 52px;
            width: 100px;
            height: 120px;
            background-color: #550000;
            border: 2px solid #D4AF37;
            overflow: hidden;
        }
        .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .logo-box {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 5px;
            padding: 2px;
            box-sizing: border-box;
        }
        .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .name-text {
            position: absolute;
            top: 195px;
            left: 0;
            width: 204px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            color: #D4AF37;
            text-transform: uppercase;
        }
        .nis-text {
            position: absolute;
            top: 220px;
            left: 0;
            width: 204px;
            text-align: center;
            font-size: 9px;
            color: #fff;
            font-weight: bold;
        }
        .qr-box {
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: #fff;
            padding: 3px;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .qr-box img {
            width: 100%;
            height: 100%;
        }
        .vertical-title {
            position: absolute;
            right: 15px;
            top: 100px;
            width: 20px;
            word-wrap: break-word;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            letter-spacing: 5px;
            writing-mode: vertical-rl;
            text-orientation: upright;
        }
        .card-back {
            background-color: #550000;
            padding: 15px;
            box-sizing: border-box;
            color: #fff;
            font-size: 8px;
            display: flex;
            flex-direction: column;
        }
        .back-header {
            text-align: center;
            margin-bottom: 10px;
        }
        .back-header img {
            width: 30px;
            margin-bottom: 5px;
        }
        .back-header h3 {
            margin: 0;
            font-size: 9px;
            color: #D4AF37;
            line-height: 1.2;
        }
        .back-content {
            flex-grow: 1;
        }
        .back-content ol {
            padding-left: 12px;
            margin: 5px 0;
            text-align: justify;
        }
        .back-content li {
            margin-bottom: 4px;
        }
        .signature {
            text-align: right;
            margin-top: 10px;
        }
        .signature img {
            height: 25px;
            margin-right: 15px;
        }
        /* Page title */
        h1 {
            width: 100%;
            text-align: center;
            color: white;
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <h1>Preview 36 Kartu Santri Al Imam</h1>
"@

for ($i = 0; $i -lt $mappedStudents.Count; $i++) {
    $ms = $mappedStudents[$i]
    $nama = $ms.Nama
    $nis = $ms.NIS
    $foto = $ms.Foto
    
    # Download QR
    try {
        $qrBytes = $webClient.DownloadData($qrBase + $nis)
        $qrB64 = [System.Convert]::ToBase64String($qrBytes)
        $qrDataUrl = "data:image/png;base64,$qrB64"
    } catch {
        # Fallback to online image if download fails
        $qrDataUrl = $qrBase + $nis
    }
    
    $html += @"
    <div class="card-container">
        <!-- FRONT -->
        <div class="card card-front">
            <div class="logo-box">
                <img src="data:image/png;base64,$logoBase64" alt="Logo">
            </div>
            <div class="photo-box">
                <img src="$foto" alt="Foto Santri">
            </div>
            <div class="name-text">
                $nama
            </div>
            <div class="nis-text">
                No Induk: $nis
            </div>
            <div class="qr-box">
                <img src="$qrDataUrl" alt="QR Code">
            </div>
            <div class="vertical-title">
                KARTU JAJAN SANTRI
            </div>
        </div>
        
        <!-- BACK -->
        <div class="card card-back">
            <div class="back-header">
                <img src="data:image/png;base64,$logoBase64" alt="Logo">
                <h3>PESANTREN<br>AL IMAM AL ISLAMI</h3>
            </div>
            <div class="back-content">
                <ol>
                    <li>Kartu ini adalah identitas resmi Santri Pesantren Al Imam Al Islami.</li>
                    <li>Kartu ini terintegrasi dengan sistem digital untuk keperluan administrasi dan transaksi kantin.</li>
                    <li>Kartu tidak dapat dipindahtangankan kepada orang lain.</li>
                    <li>Jika kartu hilang atau rusak, wajib segera melapor kepada bagian administrasi.</li>
                </ol>
            </div>
            <div class="signature">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="TTD">
                <br>Administrasi
            </div>
        </div>
    </div>
"@
}

$html += @"
</body>
</html>
"@

$previewDest = Join-Path $exportDir '02_Preview_36_Kartu_Santri.html'
[System.IO.File]::WriteAllText($previewDest, $html, [System.Text.Encoding]::UTF8)

# Delete old preview if it exists
$oldPreview = Join-Path $exportDir '02_Preview_29_Kartu_Santri.html'
if (Test-Path $oldPreview) { Remove-Item -Force $oldPreview }

Write-Host "Zipping everything up..."
$zipPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam.zip'
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
Compress-Archive -Path "$exportDir\*" -DestinationPath $zipPath -Force

Write-Host "DONE!"
