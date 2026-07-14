$excelFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_Santri_Baru_2026_Terpisah.xlsx'
$jsonFile = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\santri-baru-old.json'

Write-Host "Extracting JSON data used for export..."
$jsonData = Get-Content $jsonFile -Raw | ConvertFrom-Json
$exportedStudents = @{}
foreach ($item in $jsonData) {
    if ($item.C2 -and $item.C4 -and $item.C2 -ne 'Nama Santri' -and $item.C2 -ne '') {
        $cleanName = $item.C2.Trim().ToLower()
        $exportedStudents[$cleanName] = $item.C4.Trim()
    }
}
Write-Host "Total exported students: $($exportedStudents.Count)"

Write-Host "Opening Excel file: $excelFile"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($excelFile)
    
    # Iterate through all sheets to find the mapping
    $mismatches = @()
    $matches = 0
    $notFound = @()
    
    foreach ($sheet in $wb.Sheets) {
        $rows = $sheet.UsedRange.Rows.Count
        $cols = $sheet.UsedRange.Columns.Count
        
        # Look for Name and NIS columns
        $nameCol = -1
        $nisCol = -1
        
        for ($c = 1; $c -le $cols; $c++) {
            $header = $sheet.Cells.Item(1, $c).Text
            if ($header -match 'nama' -or $header -match 'santri') { $nameCol = $c }
            if ($header -match 'nis' -or $header -match 'identitas') { $nisCol = $c }
        }
        
        # If we can't find clear headers, just guess column 2 is name and column 4 is NIS (like the JSON)
        if ($nameCol -eq -1) { $nameCol = 2 }
        if ($nisCol -eq -1) { $nisCol = 4 }
        
        for ($r = 2; $r -le $rows; $r++) {
            $nameVal = $sheet.Cells.Item($r, $nameCol).Text
            $nisVal = $sheet.Cells.Item($r, $nisCol).Text
            
            if (-not [string]::IsNullOrWhiteSpace($nameVal)) {
                $cleanName = $nameVal.Trim().ToLower()
                
                if ($exportedStudents.ContainsKey($cleanName)) {
                    $exportedNis = $exportedStudents[$cleanName]
                    if ($exportedNis -ne $nisVal) {
                        $mismatches += [PSCustomObject]@{
                            Name = $nameVal
                            ExcelNIS = $nisVal
                            ExportedNIS = $exportedNis
                        }
                    } else {
                        $matches++
                    }
                    $exportedStudents.Remove($cleanName)
                }
            }
        }
    }
    
    Write-Host "---- VERIFICATION RESULTS ----"
    Write-Host "Matched perfectly: $matches"
    
    if ($mismatches.Count -gt 0) {
        Write-Host "MISMATCHES FOUND:" -ForegroundColor Red
        $mismatches | Format-Table
    } else {
        Write-Host "NO MISMATCHES! All NIS match exactly!" -ForegroundColor Green
    }
    
    if ($exportedStudents.Count -gt 0) {
        Write-Host "Students in export but NOT found in Excel:" -ForegroundColor Yellow
        foreach ($k in $exportedStudents.Keys) {
            Write-Host "- $k (NIS: $($exportedStudents[$k]))"
        }
    }
    
} finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
