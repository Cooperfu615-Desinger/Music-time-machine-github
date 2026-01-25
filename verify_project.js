
import fs from 'fs';
import path from 'path';

const genres = JSON.parse(fs.readFileSync('./src/data/genres.json', 'utf-8'));
const timeline = JSON.parse(fs.readFileSync('./src/data/timeline.json', 'utf-8'));

let errors = [];
let warnings = [];

// 1. Check Timeline Coverage
const timelineIds = new Set();
Object.values(timeline).forEach(arr => arr.forEach(id => timelineIds.add(id)));
console.log(`Timeline Genres: ${timelineIds.size}`);

timelineIds.forEach(id => {
    if (!genres[id]) errors.push(`Timeline ID missing from genres: ${id}`);
});

// 2. Check Data Integrity
Object.values(genres).forEach(genre => {
    ['zh-TW', 'zh-CN', 'en', 'ja'].forEach(lang => {
        if (!genre.name[lang]) errors.push(`Missing Name (${lang}) for ${genre.id}`);
        if (!genre.desc[lang]) errors.push(`Missing Desc (${lang}) for ${genre.id}`);
    });

    // 3. Check Audio Resources
    if (genre.audioPath) {
        // audioPath is like "/assets/audio/jazz.mp3"
        const relativePath = genre.audioPath.substring(1); // remove leading slash
        const fullPath = path.join('public', relativePath);
        if (!fs.existsSync(fullPath)) {
            warnings.push(`Missing audio file for ${genre.id}: ${fullPath}`);
        }
    }
});

// 4. Check Hidden Dictionary Count
const totalGenres = Object.keys(genres).length;
const hiddenCount = Object.values(genres).filter(g => g.isHidden).length;
console.log(`Total Genres: ${totalGenres}`);
console.log(`Hidden Genres: ${hiddenCount}`);

if (errors.length > 0) {
    console.error("ERRORS FOUND:");
    errors.forEach(e => console.error(e));
    process.exit(1);
} else {
    console.log("Data Integrity Check: PASS");
}

if (warnings.length > 0) {
    console.warn("WARNINGS (Non-blocking):");
    warnings.forEach(w => console.warn(w));
}

console.log("Verification Complete.");
