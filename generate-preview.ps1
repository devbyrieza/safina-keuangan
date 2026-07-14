$jsonData = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json' -Raw | ConvertFrom-Json

$students = @()
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $students += $item
    }
}

$photoDir = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\public\images\foto-kartu-jajan'
$availablePhotos = Get-ChildItem -Path $photoDir -File | Where-Object { $_.Extension -match '\.(jpg|png|jpeg)$' }
$usedPhotos = @()

$mappedStudents = @()
foreach ($s in $students) {
    $nama = $s.C2
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
    }
    
    if ($matchedPhoto) {
        $mappedStudents += @{
            Nama = $nama
            NIS = $s.C4
            # For the preview HTML, point directly to the NIS filename in the SAME folder
            Foto = "./$($s.C4)$($matchedPhoto.Extension)"
        }
        $usedPhotos += $matchedPhoto.Name
    }
}

$srcFile  = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$outFile  = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_Foto_PSP\Preview_Desain_Kartu.html'

$html = [System.IO.File]::ReadAllText($srcFile, [System.Text.Encoding]::UTF8)

$depanStart = $html.IndexOf('<!-- DEPAN -->')
$belakangStart = $html.IndexOf('<!-- BELAKANG -->')
$depanRaw = $html.Substring($depanStart, $belakangStart - $depanStart)
$bodyEnd = $html.LastIndexOf('</body>')
$belakangRaw = $html.Substring($belakangStart, $bodyEnd - $belakangStart)

$photoPattern = '(?s)(class="photo-box">\s*<img src=")[^"]+(")'
$namePattern  = '(?s)(<h2>).*?(</h2>)'
$nisPattern   = '(No Induk: )[^<]+'

$depanTpl = [regex]::Replace($depanRaw, $photoPattern, '${1}PHOTO_SRC${2}')
$depanTpl = [regex]::Replace($depanTpl, $namePattern,  '${1}NAMA_SANTRI${2}')
$depanTpl = [regex]::Replace($depanTpl, $nisPattern,   '${1}NIS_SANTRI')

$headStart = $html.IndexOf('<head>')
$headEnd   = $html.IndexOf('</head>') + '</head>'.Length
$headBlock = $html.Substring($headStart, $headEnd - $headStart)

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('<!DOCTYPE html>')
[void]$sb.AppendLine('<html lang="id">')
$newHead = $headBlock -replace '<title>[^<]*</title>', '<title>Kartu Jajan Santri Al Imam 2026</title>'
$newHead = $newHead -replace '(body\s*\{[^}]+)justify-content:\s*center;', '$1justify-content: center; flex-wrap: wrap; gap: 30px;'
[void]$sb.AppendLine($newHead)
[void]$sb.AppendLine('<body>')

[void]$sb.AppendLine('<div style="width:100%;text-align:center;color:#ddc192;font-family:Montserrat,sans-serif;font-size:18px;font-weight:800;padding:10px;background:#2a0000;margin-bottom:20px;">')
[void]$sb.AppendLine("&#9733; KARTU JAJAN SANTRI &mdash; PESANTREN AL IMAM 2026 &mdash; $($mappedStudents.Count) Santri &#9733;")
[void]$sb.AppendLine('</div>')

$no = 1
foreach ($s in $mappedStudents) {
    $front = $depanTpl
    $front = $front -replace 'PHOTO_SRC', $s.Foto
    
    $namaWords = $s.Nama.Split(' ')
    if ($namaWords.Length -gt 1) {
        $first = $namaWords[0]
        $rest = ($namaWords[1..($namaWords.Length-1)] -join ' ')
        $namaFormatted = "$first<br>$rest"
    } else {
        $namaFormatted = $s.Nama
    }
    
    $front = $front -replace 'NAMA_SANTRI', $namaFormatted.ToUpper()
    $front = $front -replace 'NIS_SANTRI', $s.NIS
    
    [void]$sb.AppendLine("<!-- Santri #$no : $($s.Nama) DEPAN -->")
    [void]$sb.AppendLine($front)
    [void]$sb.AppendLine("<!-- Santri #$no : $($s.Nama) BELAKANG -->")
    [void]$sb.AppendLine($belakangRaw)
    
    $no++
}

[void]$sb.AppendLine('</body>')
[void]$sb.AppendLine('</html>')

[System.IO.File]::WriteAllText($outFile, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Generated Preview HTML to $outFile"

# Re-zip the Data_Foto_PSP folder
$outDir = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_Foto_PSP'
$zipPath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_Foto_PSP.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$outDir\*" -DestinationPath $zipPath -Force
Write-Host "Re-zipped $zipPath including Preview HTML"
