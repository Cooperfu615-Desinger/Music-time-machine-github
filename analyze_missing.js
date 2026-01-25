
import fs from 'fs';

const genres = JSON.parse(fs.readFileSync('./src/data/genres.json', 'utf-8'));
const knownIds = new Set(Object.keys(genres));
const missing = new Set();

Object.values(genres).forEach(genre => {
    if (genre.subGenreIds) {
        genre.subGenreIds.forEach(sub => {
            // Check if sub matches a known ID (case-insensitive for now?)
            // The current subGenreIds are Names (e.g. "Rockabilly"), keys are IDs (e.g. "rock-and-roll")
            // We need to see if we can convert Name -> ID and find it.
            const potentialId = sub.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            if (!knownIds.has(potentialId)) {
                missing.add(sub);
            }
        });
    }
});

console.log(`Missing sub-genres count: ${missing.size}`);
console.log(Array.from(missing).slice(0, 20)); // Show sample
