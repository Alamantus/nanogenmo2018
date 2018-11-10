const {random, randomInt, capitalizeWords} = require('../helpers');

const consonants = [
    'b', 'bl', 'br',
    'c', 'cl', 'cr',
    'd', 'dl', 'dr',
    'f', 'fl', 'fr',
    'g', 'gl', 'gr',
    'h',
    'j',
    'k', 'kl', 'kr',
    'l',
    'm', 'ml', 'mr',
    'n',
    'p', 'pl', 'pr',
    'r',
    's', 'sl', 'sr',
    't', 'tl', 'tr',
    'v',
    'w',
    'z', 'zl', 'zr',
];
const vowels = [
    'a', 'aa', 'ae', 'ai', 'ao', 'au',
    'e', 'ea', 'ee', 'ei', 'eo', 'eu',
    'i', 'ia', 'ie', 'ii', 'io', 'iu',
    'o', 'oa', 'oe', 'oi', 'oo', 'ou',
    'u', 'ua', 'ue', 'ui', 'uo', 'uu',
];

module.exports = class Language {
    constructor() {
        this.minWordLength = randomInt(2, 5);
        this.maxWordLength = randomInt(5, 9);
        
        this.consonants = consonants.filter(() => random() >= 0.3);
        while (this.consonants.length < 5) {
            const consonant = consonants[randomInt(0, consonants.length - 1)];
            if (!this.consonants.includes(consonant)) {
                this.consonants.push(consonant);
            }
        }

        this.vowels = vowels.filter(() => random() >= 0.3);
        while (this.vowels.length < 2) {
            const vowel = vowels[randomInt(0, vowels.length - 1)];
            if (!this.vowels.includes(vowel)) {
                this.vowels.push(vowel);
            }
        }

        this.name = capitalizeWords(this.generateWord());
    }

    generateWord (length = null) {
        const characters = [];
        const numberOfCharacters = (length) ? length : randomInt(this.minWordLength, this.maxWordLength);
        const startWithConsonant = random() >= 0.5;

        for (let i = 0; i < numberOfCharacters; i++) {
            const listToUse = (i % 2 === (startWithConsonant ? 0 : 1)) ? this.consonants : this.vowels;
            characters.push(listToUse[randomInt(0, listToUse.length - 1)]);
        }
        
        return characters.join('');
    }
}