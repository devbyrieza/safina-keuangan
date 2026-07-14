$exportDir = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam'

if (Test-Path $exportDir) {
    Remove-Item -Recurse -Force $exportDir
}
New-Item -ItemType Directory -Force -Path $exportDir | Out-Null

# 1. Copy Template
$templateSrc = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$templateDest = Join-Path $exportDir '01_Template_Kartu_AlImam.html'
Copy-Item $templateSrc $templateDest

# 2. Copy Preview
$previewSrc = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'
$previewDest = Join-Path $exportDir '02_Preview_29_Kartu_Santri.html'
Copy-Item $previewSrc $previewDest

# 3. Copy Excel Data
$excelSrc = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'
$excelDest = Join-Path $exportDir '03_Data_Siswa_Siap_Import.xlsx'
Copy-Item $excelSrc $excelDest

# 4. Copy and Rename Photos by NIS
$photoExportDir = Join-Path $exportDir '04_Foto_Santri_Berdasarkan_NIS'
New-Item -ItemType Directory -Force -Path $photoExportDir | Out-Null

$jsonData = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json' -Raw | ConvertFrom-Json
$students = @()
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $students += $item
    }
}

$photoDir = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\public\images\foto-kartu-jajan'
$availablePhotos = Get-ChildItem -Path $photoDir -File | Where-Object { $_.Extension -match '\.(jpg|png|jpeg)$' }

$mappedCount = 0
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
    
    # Manual overrides for tricky names
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
        $ext = $matchedPhoto.Extension
        $newPhotoName = "$nis$ext"
        $destPath = Join-Path $photoExportDir $newPhotoName
        Copy-Item $matchedPhoto.FullName $destPath
        $mappedCount++
    }
}

Write-Host "Organized successfully in $exportDir!"
Write-Host "Copied $mappedCount photos."
