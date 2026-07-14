$exportDir = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam'
$zipPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Bahan_ID_Card_AlImam.zip'
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
Compress-Archive -Path "$exportDir\*" -DestinationPath $zipPath -Force
Write-Host 'Done'
