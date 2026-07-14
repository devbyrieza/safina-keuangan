const ExcelJS = require('exceljs');

async function formatExcel() {
    const filePath = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/03_Data_Siswa_Siap_Import.xlsx';
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    workbook.eachSheet((worksheet, sheetId) => {
        // Auto-fit columns based on content
        worksheet.columns.forEach((column, i) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            // Give some padding. Min 10, max 60.
            column.width = Math.min(Math.max(maxLength + 2, 12), 60);
        });

        // Format Header (Row 1)
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDDC192' } // Krem Emas
            };
            cell.font = {
                color: { argb: 'FF550000' }, // Merah Maroon
                bold: true
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
            };
        });
        headerRow.height = 25; // Good height for header

        // Format Data Rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header

            row.eachCell((cell, colNumber) => {
                // Apply borders
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
                
                // Normal alignment, wrap text ONLY for Alamat column
                // Assuming Alamat is column 8 (H)
                const isAlamatColumn = colNumber === 8;
                cell.alignment = { 
                    vertical: 'middle', 
                    wrapText: isAlamatColumn 
                };
                
                // Alternate row color
                if (rowNumber % 2 === 0) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFDFBFA' } // very light tint of emas
                    };
                }
            });
            // Reset row height to default
            row.height = 18;
        });
    });

    await workbook.xlsx.writeFile(filePath);
    console.log('Formatted Excel file saved!');
}

formatExcel().catch(console.error);
