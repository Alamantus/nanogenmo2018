const {
    random,
    randomInt,
    choose,
    percentChance,
    capitalize,
    capitalizeWords,
    firstLetterIsVowel,
    correctArticle,
} = require('../helpers');

const personalities = [
    'sweet',
    'kind',
    'mean',
    'salty',
];

const clothing = {
    torso: [
        'blouse',
        'shirt',
        'tunic',
        'leather armor',
        'chain mail',
    ],
    legs: [
        'skirt',
        'pants',
        'shorts',
        'greaves',
        'loincloth',
    ],
    head: [
        'floppy hat',
        'cap',
        'hood',
        'cowl',
        'bonnet',
        'helmet',
    ],
    colors: [
        'black',
        'tan',
        'brown',
        'blue',
        'green',
        'red',
        'white',
        'yellow',
        'maroon',
        'orange',
        'purple',
    ],
}

module.exports = class Character {
    constructor(type = 'good', {
        race,
    } = {}) {
        this.type = type;
        
        const typeRaces = global.races.filter(race => race.type == type);
        this.race = race ? race : choose(typeRaces);
        this.name = capitalize(this.race.language.generateWord());
        this.lastName = capitalize(this.race.language.generateWord());
        
        this.gender = choose(['female', 'male', 'feminine', 'masculine', 'nonbinary']);
        switch (this.gender) {
            case 'feminine':
            case 'female': this.pronoun = {
                subject: 'she',
                object: 'her',
                possessive: 'her',
            }; break;
            case 'masculine':
            case 'male': this.pronoun = {
                subject: 'he',
                object: 'him',
                possessive: 'his',
            }; break;
            default: this.pronoun = {
                subject: 'they',
                object: 'them',
                possessive: 'their',
            }; break;
        }
        
        this.height = random(this.race.minHeight, this.race.maxHeight),

        this.personality = choose(['neutral', 'sweet', 'kind', 'mean', 'salty']);

        this.clothing = {
            torso: {
                type: choose(clothing.torso),
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            },
            legs: {
                type: choose(clothing.legs),
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            },
            head: percentChance(50) ? {
                type: choose(clothing.head),
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            } : null,
        }
    }

    introduce () {
        let introduction = `I am ${this.name} of the ${this.lastName} clan.`;

        switch (this.personality) {
            case 'sweet': introduction += ' It\'s a pleasure to meet you!'; break;
            case 'kind': introduction += ' Nice to meet you!'; break;
            case 'mean': introduction += ' And don\'t you forget it!'; break;
            case 'salty': introduction += ' Not that I care what you think.'; break;
            default: break;
        }

        return introduction;
    }

    describe () {
        return `${correctArticle(this.gender)} ${this.gender} ${this.race.name} who is about ${this.height.toFixed(1)} feet tall`
            + ` and wearing ${correctArticle(this.clothing.torso.color)} ${this.clothing.torso.color} ${this.clothing.torso.type}`
            + ` with ${correctArticle(this.clothing.legs.color)} ${this.clothing.legs.color} ${this.clothing.legs.type}`
            + (this.clothing.head ? ` and ${correctArticle(this.clothing.head.color)} ${this.clothing.head.color} ${this.clothing.head.type} on ${this.pronoun.possessive} head` : '');
    }
}