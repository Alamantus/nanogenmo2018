const {
    random,
    randomInt,
    choose,
    percentChance,
    correctArticle,
} = require('../helpers');

const clothing = require ('../data/clothing');
const weapons = require ('../data/weapons');

module.exports = class Character {
    constructor(type = 'good', {
        race,
        knowsProtagonist,
    } = {}) {
        this.type = type;
        
        const typeRaces = global.races.filter(race => race.type == type);
        this.race = race ? race : choose(typeRaces);

        this.knowsProtagonist = knowsProtagonist ? knowsProtagonist : percentChance(50);

        this.name = this.race.language.generateName();
        this.lastName = this.race.language.generateName();
        
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

        this.maxHP = randomInt(20, 50);
        this.hp = this.maxHP;
        this.stats = {
            bravery: randomInt(25, 75),
            rationality: randomInt(15, 85),
            luck: randomInt(0, 100),
            violence: randomInt(0, 100),
        };
        this.weapon = choose(weapons);
        this.weaponExperience = choose(['master', 'learner', 'user']);

        let torso = choose(clothing.torso);
        let legs = choose(clothing.legs);
        let head = choose(clothing.head);
        this.clothing = {
            torso: {
                type: torso.name,
                needsArticle: torso.needsArticle,
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            },
            legs: {
                type: legs.name,
                needsArticle: legs.needsArticle,
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            },
            head: percentChance(50) ? {
                type: head.name,
                needsArticle: head.needsArticle,
                color: (percentChance(25) ? choose(clothing.colors) + '-and-' : '') + choose(clothing.colors),
            } : null,
        }

        this.homeType = choose(['house', 'cottage', 'shack', 'hovel', 'cave', 'dwelling', 'bungalow', 'cabin']);
    }

    get fullName () {
        return this.name + ' ' + this.lastName;
    }

    get heightString () {
        const height = this.height.toFixed(1);
        const inches = parseInt(height.substr(height.indexOf('.') + 1));
        return Math.floor(this.height) + ' feet' + (inches > 0 ? ' and ' +  inches + ' inch' + (inches == 1 ? '' : 'es') : '') + ' tall';
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

    describe (definiteArticle = false) {
        return `${definiteArticle ? 'the' : correctArticle(this.gender)} ${this.gender} ${this.race.name} who was about ${this.heightString}`
            + ` and wore ${this.clothing.torso.needsArticle ? correctArticle(this.clothing.torso.color) + ' ' : ''}${this.clothing.torso.color} ${this.clothing.torso.type}`
            + ` with ${this.clothing.legs.needsArticle ? correctArticle(this.clothing.legs.color) + ' ' : ''}${this.clothing.legs.color} ${this.clothing.legs.type}`
            + (this.clothing.head ? ` and ${this.clothing.head.needsArticle ? correctArticle(this.clothing.head.color) + ' ' : ''}${this.clothing.head.color} ${this.clothing.head.type} on ${this.pronoun.possessive} head` : '');
    }
}