const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelFile = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/03_Data_Siswa_Siap_Import.xlsx';
const photoSourceDir = 'C:/Users/itpua/Dev/Work/al-andalus/safina-keuangan/public/images/foto-kartu-jajan';
const photoDestDir = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/04_Foto_Santri_Berdasarkan_NIS';
const templateFile = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/01_Template_Kartu_AlImam.html';
const newPreviewFile = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Bahan_ID_Card_AlImam/02_Preview_36_Kartu_Santri.html';

const wb = xlsx.readFile(excelFile);
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

const sourcePhotos = fs.readdirSync(photoSourceDir).filter(f => f !== 'Gemini_Generated_Image_k41kz7k41kz7k41k.jpg' && !f.startsWith('.'));

function getSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function getSlug2(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

const hardcodedMap = {
    'Muhammad Azzam Al Hafiz': 'muhammad-azzam-al-hafidz.jpg',
    'Muhammad Rifqi Hamid': 'muhammad-rifqy-hamid.jpg',
    'Muhammad Yahya Ayyash': 'muhammad-yahya-ayyash-mts.jpg'
};

let htmlOutput = '';
const templateContent = fs.readFileSync(templateFile, 'utf8');
const headMatch = templateContent.match(/([\s\S]*?)<div class="id-card">/);
const headerHTML = headMatch[1];
const cardRegex = /<div class="id-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
const cards = templateContent.match(cardRegex);
const frontCardTemplate = cards[0];
const backCardTemplate = cards[1];

htmlOutput += headerHTML;

let copied = 0;
data.forEach(student => {
    const nis = student['Nomor Identitas 1'];
    let name = student['Nama'].trim();
    
    let nameParts = name.toUpperCase().split(' ');
    let line1 = nameParts.length > 0 ? nameParts[0] : '';
    let line2 = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    let nameHTML = line2 ? line1 + '<br>' + line2 : line1;

    let matchedPhoto = null;
    if (hardcodedMap[name]) {
        matchedPhoto = hardcodedMap[name];
    } else {
        const slug1 = getSlug(name);
        const slug2 = getSlug2(name);
        for (let photo of sourcePhotos) {
            let base = photo.replace(/\.[a-z]+$/, '');
            if (photo.includes(slug1) || photo.includes(slug2) || slug1.includes(base) || slug2.includes(base)) {
                matchedPhoto = photo;
                break;
            }
        }
    }

    let photoExt = '.jpg';
    if (matchedPhoto) {
        photoExt = path.extname(matchedPhoto);
        fs.copyFileSync(path.join(photoSourceDir, matchedPhoto), path.join(photoDestDir, nis + photoExt));
        copied++;
    } else {
        console.log('No photo for:', name, 'NIS:', nis);
    }

    let studentCard = frontCardTemplate
        .replace(/04_Foto_Santri_Berdasarkan_NIS\/[0-9]+\.[a-z]+/gi, '04_Foto_Santri_Berdasarkan_NIS/' + nis + photoExt)
        .replace(/<h2>.*?<\/h2>/, '<h2>' + nameHTML + '</h2>')
        .replace(/<p>No Induk: [0-9]+<\/p>/, '<p>No Induk: ' + nis + '</p>');

    htmlOutput += studentCard + '\n';
    htmlOutput += backCardTemplate + '\n';
});

htmlOutput += '\n</body>\n</html>';
fs.writeFileSync(newPreviewFile, htmlOutput);
console.log('Successfully mapped and generated ' + data.length + ' cards. Copied ' + copied + ' photos.');
