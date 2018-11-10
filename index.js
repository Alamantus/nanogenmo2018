const fs = require('fs');
const Language = require('./classes/Language');
const races = require('./data/races');

let output = '';

races.forEach(race => {
    const lang = new Language(race.languageConfig);
    const line = race.name + ', example ' + race.language + ' (' + lang.name + ') word: ' + lang.generateWord();
    output += line + '\n';
    console.log(line);
});

// console.log(output);
fs.writeFileSync('./novel.txt', output);
