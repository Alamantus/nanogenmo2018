const fs = require('fs');
const Language = require('./classes/Language');

const lang = new Language();

const output = lang.name;

fs.writeFileSync('./novel.txt', output);