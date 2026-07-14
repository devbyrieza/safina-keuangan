$templatePath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$exportDir = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam'
$previewDest = Join-Path $exportDir '02_Preview_36_Kartu_Santri.html'
$jsonFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json'
$photoExportDir = Join-Path $exportDir '04_Foto_Santri_Berdasarkan_NIS'

Write-Host "Reading original template..."
$templateHtml = Get-Content $templatePath -Raw

# Extract styles
$styleStart = $templateHtml.IndexOf('<style>')
$styleEnd = $templateHtml.IndexOf('</style>') + 8
$styles = $templateHtml.Substring($styleStart, $styleEnd - $styleStart)

# Extract card template
$cardStart = $templateHtml.IndexOf('<!-- DEPAN -->')
$cardEnd = $templateHtml.IndexOf('</body>')
$cardTemplate = $templateHtml.Substring($cardStart, $cardEnd - $cardStart)

# Modify styles slightly for the preview wrapper
$styles = $styles -replace 'body \{', 'body { flex-wrap: wrap; gap: 40px; padding: 40px; background-color: #333;'

$html = @"
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview 36 Kartu Santri Al Imam</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    $styles
    <style>
        h1 {
            width: 100%;
            text-align: center;
            color: white;
            margin-bottom: 0;
            font-family: 'Montserrat', sans-serif;
            font-size: 24px;
        }
        .card-container {
            display: flex;
            gap: 20px;
            background: #444;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            margin-bottom: 20px;
        }
        @media (max-width: 600px) {
            .card-container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <h1>Preview 36 Kartu Santri Al Imam</h1>
"@

$jsonData = Get-Content $jsonFile -Raw | ConvertFrom-Json
$students = @()
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $students += $item
    }
}

$qrBase = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data="
$webClient = New-Object System.Net.WebClient

Write-Host "Generating cards..."
foreach ($s in $students) {
    $nama = $s.C2.ToUpper()
    $nis = $s.C4
    
    # Try to break name into two lines if it's too long, like the template (ABDUL<br>AZIZ ALI)
    $words = $nama.Split(' ')
    if ($words.Length -gt 2) {
        $namaFormatted = "$($words[0])<br>$($words[1]) $($words[2])"
        if ($words.Length -gt 3) {
            $namaFormatted += " $($words[3])"
        }
    } elseif ($words.Length -eq 2) {
        $namaFormatted = "$($words[0])<br>$($words[1])"
    } else {
        $namaFormatted = $nama
    }
    
    # Get photo
    $matchedPhoto = Get-ChildItem -Path $photoExportDir -Filter "$nis.*" | Select-Object -First 1
    if ($matchedPhoto) {
        $bytes = [System.IO.File]::ReadAllBytes($matchedPhoto.FullName)
        $base64 = [System.Convert]::ToBase64String($bytes)
        $extClean = $matchedPhoto.Extension.Replace('.','').ToLower()
        if ($extClean -eq 'jpg') { $extClean = 'jpeg' }
        $fotoData = "data:image/$extClean;base64,$base64"
    } else {
        $fotoData = ""
    }
    
    # QR Code
    try {
        $qrBytes = $webClient.DownloadData($qrBase + $nis)
        $qrB64 = [System.Convert]::ToBase64String($qrBytes)
        $qrDataUrl = "data:image/png;base64,$qrB64"
    } catch {
        $qrDataUrl = $qrBase + $nis
    }
    
    $studentCard = $cardTemplate
    $studentCard = $studentCard -replace 'ABDUL<br>AZIZ ALI', $namaFormatted
    $studentCard = $studentCard -replace 'No Induk: 2601070001', "No Induk: $nis"
    $studentCard = $studentCard -replace 'src="https://api.qrserver.com/v1/create-qr-code/\?size=100x100&data=https://pesantren-alimam.com"', "src=`"$qrDataUrl`""
    
    if ($fotoData) {
        # The template has <img src="data:image... alt="Foto Santri"> inside it now.
        $imgTag = "<img src=`"$fotoData`" alt=`"Foto Santri`">"
        # Match <img src="data:image/[anything not a quote]" alt="Foto Santri">
        $studentCard = $studentCard -replace '<img src="data:image/[^"]+" alt="Foto Santri">', $imgTag
        # Just in case it still has the placeholder
        $placeholderBlock = '<!-- Foto Placeholder -->\s*<div class="photo-placeholder">\s*<i class="fas fa-user"></i>\s*</div>'
        $studentCard = $studentCard -replace $placeholderBlock, $imgTag
    }
    
    $html += @"
    <div class="card-container">
        $studentCard
    </div>
"@
}

$html += @"
</body>
</html>
"@

Write-Host "Saving Preview HTML..."
[System.IO.File]::WriteAllText($previewDest, $html, [System.Text.Encoding]::UTF8)

Write-Host "Zipping up..."
$zipPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam.zip'
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
Compress-Archive -Path "$exportDir\*" -DestinationPath $zipPath -Force

Write-Host "Done!"
