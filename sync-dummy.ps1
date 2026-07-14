$previewPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'
$templatePath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'

$previewContent = [System.IO.File]::ReadAllText($previewPath, [System.Text.Encoding]::UTF8)

# Find Abdul Aziz Ali's photo block
# It should look like:
# <!-- Santri #1 : Abdul Aziz Ali DEPAN -->
# ... <img src="data:image/jpeg;base64,..."
$regex = [regex]::new('(?s)<!-- Santri #1 : Abdul Aziz Ali DEPAN -->.*?<img src="(data:image/[^"]+)"')
$match = $regex.Match($previewContent)

if ($match.Success) {
    $azizBase64 = $match.Groups[1].Value
    
    $templateContent = [System.IO.File]::ReadAllText($templatePath, [System.Text.Encoding]::UTF8)
    
    # Replace Rasya's photo with Aziz's base64
    $templateContent = $templateContent -replace 'public/images/foto-kartu-jajan/rasya.png', $azizBase64
    
    # Replace name and NIS
    $templateContent = $templateContent.Replace("MUHAMMAD<br>RASYA ATHAYA", "ABDUL<br>AZIZ ALI")
    $templateContent = $templateContent.Replace("No Induk: 25260031", "No Induk: 2601070001")
    
    [System.IO.File]::WriteAllText($templatePath, $templateContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated template with Abdul Aziz Ali's photo and details."
} else {
    Write-Host "Could not find Abdul Aziz Ali's photo in preview HTML."
}
