$file1 = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$file2 = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'

foreach ($file in @($file1, $file2)) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
        
        # Change photo box background from grey to maroon
        $content = $content.Replace("background: #d3d3d3;", "background: #550000;")
        
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated photo box background in: $file"
    } else {
        Write-Host "File not found: $file"
    }
}
