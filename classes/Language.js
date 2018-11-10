const {randomInt, percentChance, capitalizeWords} = require('../helpers');

const consonants = [
    'b', 'bl', 'br',
    'c', 'ch', 'cl', 'cr',
    'd', 'dl', 'dr',
    'f', 'fl', 'fr',
    'g', 'gl', 'gr',
    'h',
    'j',
    'k', 'kh', 'kl', 'kr',
    'l',
    'm', 'ml', 'mr',
    'n',
    'p', 'pl', 'pr',
    'r',
    's', 'sh', 'sl', 'sm', 'sn', 'sp', 'sr', 'st', 'sw',
    't', 'th', 'tr', 'tw',
    'v',
    'w',
    'x',
    'y',
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
    constructor({
        minWordLength,
        maxWordLength,
        minConsonants = 5,
        consonantExclusions = [],
        consonantPercentChance = 70,
        doubleConsonantPercentChance = 30,
        minVowels = 2,
        vowelExclusions = [],
        vowelPercentChance = 70,
        doubleVowelPercentChance = 30,
    } = {}) {
        this.minWordLength = minWordLength ? minWordLength : randomInt(2, 5);
        this.maxWordLength = maxWordLength ? maxWordLength : randomInt(5, 9);
        
        const doAddConsonant = (consonant) => {
            if (consonantExclusions.includes(consonant)) return false;
            
            if (consonant.length == 1) {
                return percentChance(consonantPercentChance);
            } else {
                return percentChance(doubleConsonantPercentChance);
            }
        }
        this.consonants = consonants.filter(doAddConsonant);
        while (this.consonants.length < minConsonants) {
            const consonant = consonants[randomInt(0, consonants.length - 1)];
            if (!this.consonants.includes(consonant) && doAddConsonant(consonant)) {
                this.consonants.push(consonant);
            }
        }

        const doAddVowel = (vowel) => {
            if (vowelExclusions.includes(vowel)) return false;

            if (vowel.length == 1) {
                return percentChance(vowelPercentChance);
            } else {
                return percentChance(doubleVowelPercentChance);
            }
        }
        this.vowels = vowels.filter(doAddVowel);
        while (this.vowels.length < minVowels) {
            const vowel = vowels[randomInt(0, vowels.length - 1)];
            if (!this.vowels.includes(vowel) && doAddVowel(vowel)) {
                this.vowels.push(vowel);
            }
        }

        this.name = capitalizeWords(this.generateWord());
    }

    generateWord (length = null) {
        const characters = [];
        const numberOfCharacters = (length) ? length : randomInt(this.minWordLength, this.maxWordLength);
        const startWithConsonant = percentChance(50);

        for (let i = 0; i < numberOfCharacters; i++) {
            const listToUse = (i % 2 === (startWithConsonant ? 0 : 1)) ? this.consonants : this.vowels;
            characters.push(listToUse[randomInt(0, listToUse.length - 1)]);
        }
        
        return characters.join('');
    }
}