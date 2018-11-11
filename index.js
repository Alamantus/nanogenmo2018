const fs = require('fs');
const Language = require('./classes/Language');
const Character = require('./classes/Character');
const Chapter = require('./segments/Chapter');
global.races = require('./data/races');
global.races.forEach(race => race.language = new Language(race.languageConfig));

class Story {
    constructor() {
        this.protagonist = new Character('good');
        this.antagonist = new Character('bad');
        this.chapterNumber = 1;
    }

    numberOfWords (string) {
        const wordsBySpaces = string.split(' ').length;
        const wordsByHyphens = string.split('-').length;
        const wordsByEmdashes = string.split('—').length;
        return wordsBySpaces + wordsByHyphens + wordsByEmdashes;
    }

    write () {
        let output = Chapter(this);
        
        // while(this.numberOfWords(output) < 50000) {
        //     output += '\n\n' + Chapter(this);
        // }

        output += '\n\n' + this.numberOfWords(output) + ' words';

        console.log(output);
        fs.writeFileSync('./novel.txt', output);
    }
}

const story = new Story();
story.write();
