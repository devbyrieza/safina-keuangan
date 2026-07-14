$file1 = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Kartu-Ujian-AlImam.html'
$file2 = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Preview_Desain_Kartu.html'

foreach ($file in @($file1, $file2)) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
        
        # Replace normal casing
        $content = $content.Replace("Pesantren Al Imam", "Pesantren Al Imam Al Islami")
        
        # In case there's an already replaced string like "Pesantren Al Imam Al Islami Al Islami", fix it
        $content = $content.Replace("Pesantren Al Imam Al Islami Al Islami", "Pesantren Al Imam Al Islami")
        
        # Replace uppercase
        $content = $content.Replace("PESANTREN AL IMAM", "PESANTREN AL IMAM AL ISLAMI")
        $content = $content.Replace("PESANTREN AL IMAM AL ISLAMI AL ISLAMI", "PESANTREN AL IMAM AL ISLAMI")
        
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}
