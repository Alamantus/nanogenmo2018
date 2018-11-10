const fs = require('fs');
const {capitalize} = require('./helpers');
const Language = require('./classes/Language');
const Character = require('./classes/Character');
global.races = require('./data/races');
global.races.forEach(race => race.language = new Language(race.languageConfig));

let output = '';

const protagonist = new Character('good');
const antagonist = new Character('bad');

output += `${capitalize(protagonist.describe())} steps up and says, "${protagonist.introduce()}"

But ${antagonist.describe()} stands in ${protagonist.pronoun.possessive} way and says, "${antagonist.introduce()}"`;

console.log(output);
fs.writeFileSync('./novel.txt', output);
