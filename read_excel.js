const XLSX = require('xlsx');
const wb = XLSX.readFile('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/documents/Data_Siswa_CRM_Al_Imam_TERISI.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);
console.log('HEADERS:', Object.keys(data[0]));
console.log('\nSAMPLE ROWS:');
data.slice(0, 3).forEach((row, i) => {
    console.log(`\n=== Row ${i+1} ===`);
    Object.entries(row).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
});
console.log('\nTotal rows:', data.length);
