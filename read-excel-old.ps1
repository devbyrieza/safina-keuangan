$path = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_Santri_Baru_2026_Terpisah.xlsx'
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open($path)
    $allData = @()
    foreach ($sheet in $wb.Sheets) {
        $rows = $sheet.UsedRange.Rows.Count
        for ($i = 1; $i -le $rows; $i++) {
            $col1 = $sheet.Cells.Item($i, 1).Text
            $col2 = $sheet.Cells.Item($i, 2).Text
            $col3 = $sheet.Cells.Item($i, 3).Text
            $col4 = $sheet.Cells.Item($i, 4).Text
            if ($col1 -or $col2 -or $col3 -or $col4) {
                $allData += @{ Jenjang=$sheet.Name; Row=$i; C1=$col1; C2=$col2; C3=$col3; C4=$col4 }
            }
        }
    }
    $allData | ConvertTo-Json -Depth 2 | Out-File -Encoding utf8 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json'
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
