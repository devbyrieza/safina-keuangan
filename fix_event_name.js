const fs = require('fs');
let content = fs.readFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', 'utf8');

// Replace the redundant event name in the header of all cards
const oldPattern = /<div class="header-event">Welcome Day &amp; Kedatangan Santri Baru 2026<\/div>/g;
const newReplacement = '<div class="header-event">Welcome Day Santri Baru 2026</div>';

content = content.replace(oldPattern, newReplacement);

fs.writeFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/id-card-panitia.html', content);
console.log('Fixed redundant text');
