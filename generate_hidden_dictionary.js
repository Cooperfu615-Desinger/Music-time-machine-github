
import fs from 'fs';

const genres = JSON.parse(fs.readFileSync('./src/data/genres.json', 'utf-8'));
const newGenres = { ...genres };

// Helpers
const toId = (str) => str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

Object.values(newGenres).forEach(genre => {
    if (genre.subGenreIds) {
        // Map old names to new IDs
        const newSubIds = genre.subGenreIds.map(subName => {
            // If it's already an ID in our system (unlikely given previous check, but safety first)
            if (newGenres[subName]) return subName;

            const newId = toId(subName);

            // Create hidden entry if not exists
            if (!newGenres[newId]) {
                newGenres[newId] = {
                    id: newId,
                    name: {
                        "zh-TW": subName,
                        "zh-CN": subName,
                        "en": subName,
                        "ja": subName
                    },
                    desc: {
                        "zh-TW": `${subName} 是 ${genre.name['zh-TW']} 的一個衍生流派。`,
                        "zh-CN": `${subName} 是 ${genre.name['zh-CN']} 的一个衍生流派。`,
                        "en": `${subName} is a sub-genre of ${genre.name['en']}.`,
                        "ja": `${subName} は ${genre.name['ja']} の派生ジャンルです。`
                    },
                    subGenreIds: [],
                    artists: [],
                    audioPath: null,
                    imagePath: null,
                    isHidden: true,
                    parentId: genre.id
                };
            }
            return newId;
        });

        genre.subGenreIds = newSubIds;
    }
});

fs.writeFileSync('./src/data/genres.json', JSON.stringify(newGenres, null, 2));
console.log(`Updated genres.json with hidden dictionary entries. Total count: ${Object.keys(newGenres).length}`);
