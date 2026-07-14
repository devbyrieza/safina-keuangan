const xlsx = require('xlsx');
const filePath = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/03_Data_Siswa_Siap_Import.xlsx';

const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Find column indices from row 1 (index 0)
const headers = data[0];
const idxNisn = headers.indexOf('NISN') !== -1 ? headers.indexOf('NISN') : 2; 
const idxName = headers.indexOf('Nama Lengkap') !== -1 ? headers.indexOf('Nama Lengkap') : headers.findIndex(h => h && h.toLowerCase().includes('nama'));
const idxTempat = headers.indexOf('Tempat Lahir') !== -1 ? headers.indexOf('Tempat Lahir') : headers.findIndex(h => h && h.toLowerCase().includes('tempat'));
const idxAlamat = headers.indexOf('Alamat Lengkap') !== -1 ? headers.indexOf('Alamat Lengkap') : headers.findIndex(h => h && h.toLowerCase().includes('alamat'));

console.log("Indices:", { idxNisn, idxName, idxTempat, idxAlamat });

for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[idxName]) continue;

    if (row[idxName].includes('Panji Ahmad')) {
        row[idxNisn] = '0096483042';
        row[idxTempat] = 'KOTA JAKARTA TIMUR';
        row[idxAlamat] = 'lubang buaya cipayung jakarta timur, RT 006 / RW 008, Kel. LUBANG BUAYA, Kec. CIPAYUNG, KOTA JAKARTA TIMUR, DKI JAKARTA';
        console.log('Updated Panji Ahmad');
    }
    
    if (row[idxName].includes('Zakaria Reynaldo')) {
        row[idxNisn] = '3097025745';
        row[idxTempat] = 'KABUPATEN BANYU ASIN';
        row[idxAlamat] = 'Dusun lll desa sri tiga, RT 009, Kel. SRI TIGA, Kec. SUMBER MARGA TELANG, KABUPATEN BANYU ASIN, SUMATERA SELATAN';
        console.log('Updated Zakaria Reynaldo');
    }
}

// Convert back to sheet
const newSheet = xlsx.utils.aoa_to_sheet(data);

// Preserve column widths if possible
if (sheet['!cols']) newSheet['!cols'] = sheet['!cols'];
if (sheet['!merges']) newSheet['!merges'] = sheet['!merges'];
if (sheet['!rows']) newSheet['!rows'] = sheet['!rows'];
if (sheet['!margins']) newSheet['!margins'] = sheet['!margins'];
if (sheet['!autofilter']) newSheet['!autofilter'] = sheet['!autofilter'];

workbook.Sheets[sheetName] = newSheet;
xlsx.writeFile(workbook, filePath);
console.log('Done writing excel!');
