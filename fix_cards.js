const fs = require('fs');
let content = fs.readFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', 'utf8');

// Replace the old pattern that we missed
const oldPattern = /<div class="card-header">\s*<div class="header-pesantren">PESANTREN AL-IMAM AL-ISLAMI<\/div>\s*<div class="header-event">Welcome Day &amp; Kedatangan Santri Baru 2026<\/div>\s*<\/div>/g;

const newReplacement = `<div class="card-header">
                <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 5px;">
                    <img src="public/images/logo.png" alt="Al Imam" style="height: 18px; width: auto; opacity: 0.9;">
                    <img src="public/images/logo-andalus.png" alt="Andalus" style="height: 18px; width: auto; opacity: 0.9;">
                </div>
                <div class="header-pesantren">PESANTREN<br>AL-IMAM AL-ISLAMI</div>
                <div class="header-event">Welcome Day &amp; Kedatangan Santri Baru 2026</div>
            </div>`;

content = content.replace(oldPattern, newReplacement);

fs.writeFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', content);
console.log('Replaced successfully');
