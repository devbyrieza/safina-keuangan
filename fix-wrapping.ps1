$file1 = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$file2 = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'

foreach ($file in @($file1, $file2)) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
        
        # Replace only the header occurrence (h3 in original, but could be different in preview? Wait, preview has the exact same block)
        $content = $content.Replace("<h3>Pesantren Al Imam Al Islami</h3>", "<h3>Pesantren<br>Al Imam Al Islami</h3>")
        
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated wrapping in: $file"
    } else {
        Write-Host "File not found: $file"
    }
}
