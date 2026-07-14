$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open('C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_Santri_Baru_2026_Terpisah.xlsx')
foreach($sheet in $wb.Sheets) {
    $csvPath = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_' + $sheet.Name + '.csv'
    $sheet.SaveAs($csvPath, 6)
}
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
