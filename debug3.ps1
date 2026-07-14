$jsonFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json'
$photoExportDir = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam\04_Foto_Santri_Berdasarkan_NIS'
$jsonData = Get-Content $jsonFile -Raw | ConvertFrom-Json

foreach ($s in $jsonData) {
    if ($s.C2 -and $s.C4 -and $s.C2 -ne 'Nama Santri' -and $s.C2 -ne '') {
        $nis = $s.C4
        $matchedPhoto = Get-ChildItem -Path $photoExportDir -Filter "$nis.*" | Select-Object -First 1
        if ($matchedPhoto) {
            $bytes = [System.IO.File]::ReadAllBytes($matchedPhoto.FullName)
            $base64 = [System.Convert]::ToBase64String($bytes)
            Write-Host "$nis - $($base64.Substring(1000,30))"
        }
    }
}
