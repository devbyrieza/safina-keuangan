$templatePath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$previewPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'

$previewContent = [System.IO.File]::ReadAllText($previewPath, [System.Text.Encoding]::UTF8)

# Find Aziz's Base64 from the photo-box specifically
$regex = [regex]::new('(?s)<!-- Santri #1 : Abdul Aziz Ali DEPAN -->.*?<div class="photo-box">\s*<img src="(data:image/[^"]+)"')
$match = $regex.Match($previewContent)

if ($match.Success) {
    $azizBase64 = $match.Groups[1].Value
    
    $templateContent = [System.IO.File]::ReadAllText($templatePath, [System.Text.Encoding]::UTF8)
    
    # Replace the image inside photo-box
    $photoPattern = '(?s)(<div class="photo-box">\s*<img src=")[^"]+(")'
    $templateContent = [regex]::Replace($templateContent, $photoPattern, "`${1}$azizBase64`${2}")
    
    # Fix the background color that was missed!
    $templateContent = $templateContent -replace 'background-color: #d4d4d4;', 'background-color: #550000;'
    
    [System.IO.File]::WriteAllText($templatePath, $templateContent, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed template perfectly!"
} else {
    Write-Host "Regex failed to find Aziz photo."
}
