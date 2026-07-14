const fs = require('fs');
let content = fs.readFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', 'utf8');

// Replace the incorrect webp block with the correct png block and text wrap
const oldPattern = /<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 5px;">\s*<img src="public\/images\/logo-andalus\.webp" alt="Andalus" style="height: 18px; width: auto; opacity: 0\.9;">\s*<img src="public\/images\/logo\.png" alt="Al Imam" style="height: 18px; width: auto; opacity: 0\.9;">\s*<\/div>\s*<div class="header-pesantren">PESANTREN AL-IMAM AL-ISLAMI<\/div>/g;

const newReplacement = `<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 5px;">
                    <img src="public/images/logo.png" alt="Al Imam" style="height: 18px; width: auto; opacity: 0.9;">
                    <img src="public/images/logo-andalus.png" alt="Andalus" style="height: 18px; width: auto; opacity: 0.9;">
                </div>
                <div class="header-pesantren">PESANTREN<br>AL-IMAM AL-ISLAMI</div>`;

content = content.replace(oldPattern, newReplacement);

fs.writeFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', content);
console.log('Fixed the other 7 cards!');
