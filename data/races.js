module.exports = [
    {
        name: 'human',
        type: 'good',
        minHeight: 5,
        maxHeight: 6,
        languageName: 'Ancient',
        languageConfig: {
            minConsonants: 10,
            consonantExclusions: [
                'dl',
                'kh',
                'ml',
                'zl',
                'zr',
            ],
            minVowels: 3,
            vowelExclusions: [
                'aa',
                'ao',
                'ei',
                'eo',
                'eu',
                'ii',
                'iu',
                'oa',
                'oe',
                'oi',
                'ua',
                'ue',
                'ui',
                'uo',
                'uu',
            ],
        },
    },
    {
        name: 'elf',
        type: 'good',
        minHeight: 5,
        maxHeight: 7,
        languageName: 'Elvish',
        languageConfig: {
            minConsonants: 4,
            doubleConsonantPercentChance: 0,
            consonantExclusions: [
                'g',
                'j',
                'n',
                'p',
                'v',
                'x',
                'z',
            ],
            minVowels: 10,
            doubleVowelPercentChance: 70,
            vowelExclusions: [
                'ee',
                'oo',
            ],
        },
    },
    {
        name: 'dwarf',
        type: 'good',
        minHeight: 4,
        maxHeight: 5,
        languageName: 'Dwarvish',
        languageConfig: {
            minWordLength: 4,
            maxWordLength: 10,
            minConsonants: 10,
            doubleConsonantPercentChance: 70,
            consonantExclusions: [
                'dl',
                'kh',
                'ml',
                'w',
                'x',
                'y',
                'zl',
                'zr',
            ],
            minVowels: 3,
            vowelPercentChance: 50,
            doubleVowelPercentChance: 40,
            vowelExclusions: [
                'aa',
                'ao',
                'ei',
                'eo',
                'eu',
                'ii',
                'iu',
                'oa',
                'oe',
                'oi',
                'ua',
                'ue',
                'ui',
                'uo',
                'uu',
            ],
        },
    },
    {
        name: 'orc',
        type: 'bad',
        minHeight: 6,
        maxHeight: 7,
        languageName: 'Orcish',
        languageConfig: {
            minWordLength: 2,
            maxWordLength: 5,
            minConsonants: 20,
            doubleConsonantPercentChance: 70,
            consonantExclusions: [
                'c',
                'ch',
                'cl',
                'cr',
                'f',
                'fl',
                'fr',
                'h',
                'tw',
                'w',
                'y',
            ],
            minVowels: 2,
            vowelPercentChance: 50,
            doubleVowelPercentChance: 0,
        },
    },
    {
        name: 'goblin',
        type: 'bad',
        minHeight: 3,
        maxHeight: 4,
        languageName: 'Goblin',
        languageConfig: {
            minWordLength: 3,
            maxWordLength: 11,
            minConsonants: 15,
            consonantPercentChance: 50,
            doubleConsonantPercentChance: 80,
            minVowels: 4,
            vowelPercentChance: 50,
            doubleVowelPercentChance: 50,
        },
    },
]