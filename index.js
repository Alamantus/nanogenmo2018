const fs = require('fs');
const Language = require('./classes/Language');

const lang = new Language();

const output = lang.name;

console.log(output);
fs.writeFileSync('./novel.txt', output);
