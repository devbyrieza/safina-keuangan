$jsonData = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json' -Raw | ConvertFrom-Json
$students = @()
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $students += $item
    }
}
Write-Host "Total students: $($students.Count)"
