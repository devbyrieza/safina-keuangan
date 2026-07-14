$html = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam\02_Preview_36_Kartu_Santri.html' -Raw
$matches = [regex]::Matches($html, '<img src="data:image/(jpeg|png);base64,([a-zA-Z0-9+/]+={0,2})" alt="Foto Santri"')
foreach ($m in $matches) {
    Write-Host $m.Groups[2].Value.Substring(1000, 30)
}
