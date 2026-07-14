$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open('C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_Santri_Baru_2026_Terpisah.xlsx')

Write-Host "Jumlah Sheet: $($wb.Sheets.Count)"
for ($s = 1; $s -le $wb.Sheets.Count; $s++) {
    $ws = $wb.Sheets.Item($s)
    Write-Host ""
    Write-Host "=== SHEET $s : $($ws.Name) ==="
    $rows = $ws.UsedRange.Rows.Count
    $cols = $ws.UsedRange.Columns.Count
    Write-Host "Rows: $rows  Cols: $cols"
    for ($i = 1; $i -le $rows; $i++) {
        $line = ""
        for ($j = 1; $j -le $cols; $j++) {
            $val = $ws.Cells.Item($i, $j).Text
            $line += "| $val "
        }
        Write-Host $line
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
