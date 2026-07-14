$templatePath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$previewPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'

$previewContent = [System.IO.File]::ReadAllText($previewPath, [System.Text.Encoding]::UTF8)

# Find Abdul Aziz Ali's base64
$regex = [regex]::new('(?s)<!-- Santri #1 : Abdul Aziz Ali DEPAN -->.*?<img src="(data:image/[^"]+)"')
$match = $regex.Match($previewContent)

if ($match.Success) {
    $azizBase64 = $match.Groups[1].Value
    
    $templateContent = [System.IO.File]::ReadAllText($templatePath, [System.Text.Encoding]::UTF8)
    
    # 1. Replace the base64 image in the template
    $photoPattern = '(?s)(<div class="photo-box">\s*<img src=")[^"]+(")'
    $templateContent = [regex]::Replace($templateContent, $photoPattern, "`${1}$azizBase64`${2}")
    
    # 2. Replace the name (case insensitive)
    $templateContent = $templateContent -ireplace "Muhammad<br>Rasya Athaya", "ABDUL<br>AZIZ ALI"
    
    # 3. Replace the NIS
    $templateContent = $templateContent -replace "25260031", "2601070001"
    
    [System.IO.File]::WriteAllText($templatePath, $templateContent, [System.Text.Encoding]::UTF8)
    Write-Host "Template successfully updated with Abdul Aziz's photo."
} else {
    Write-Host "Failed to extract Aziz base64."
}
