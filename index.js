const fs = require('fs');
const {randomInt, percentChance, choose, capitalizeWords} = require('./helpers');
const Language = require('./classes/Language');
const Character = require('./classes/Character');
const generateChapter = require('./segments/generateChapter');
global.races = require('./data/races');
global.races.forEach(race => race.language = new Language(race.languageConfig));
const wordCollection = require('./data/words');
const possibleLocations = require('./data/locations');

class Story {
    constructor() {
        this.protagonist = new Character('good', { knowsProtagonist: true, });
        this.protagonist.homeland = choose(['town', 'village', 'city', 'homestead', 'villa', 'fiefdom', 'homeland']);
        this.party = this.generateParty();
        this.antagonist = new Character('bad');
        this.antagonist.title = 'the ' + choose(['breaker', 'destroyer', 'doom-bringer', 'destroyer of innocence', 'evil', 'great evil', 'destroyer of worlds']);

        this.worldName = this.protagonist.race.language.generateName();
        this.evilPlaceName = this.antagonist.race.language.generateName();
        this.locations = this.generateLocations();
        this.visited = [];
        this.currentLocation = choose(this.locations);
        this.lastLocation = null;
        
        this.chapterNumber = 0;
        this.storyType = choose(['quest', 'revenge', 'rescue', 'restoration']);
        this.title = this.generateTitle();
        this.numberOfWords = 0;
        this.rulerTitle = choose(['king', 'queen', 'ruler', 'chancellor', 'duke', 'dutchess', 'lord', 'lady', 'leader']);
    }

    get fullParty () {
        return [this.protagonist, ...this.party];
    }

    get averageLuck () {
        return this.fullParty.reduce((total, member) => total += member.stats.luck, 0) / this.fullParty.length;
    }

    get averageViolence () {
        return this.fullParty.reduce((total, member) => total += member.stats.violence, 0) / this.fullParty.length;
    }

    get averageBravery () {
        return this.fullParty.reduce((total, member) => total += member.stats.bravery, 0) / this.fullParty.length;
    }

    get averageRationality () {
        return this.fullParty.reduce((total, member) => total += member.stats.rationality, 0) / this.fullParty.length;
    }

    get averageMaxHP () {
        return this.fullParty.reduce((total, member) => total += member.maxHP, 0) / this.fullParty.length;
    }

    get averageHP () {
        return this.fullParty.reduce((total, member) => total += member.hp, 0) / this.fullParty.length;
    }

    generateParty () {
        const party = [];
        const number = randomInt(2, 4);
        for (let i = 0; i < number; i++) {
            party.push(new Character('good'));
        }
        return party;
    }

    healParty () {
        story.fullParty.forEach(character => character.hp = character.maxHP);
    }

    generateLocations () {
        const locations = [];
        const number = randomInt(15, 30);
        for (let i = 0; i < number; i++) {
            const newLocation = Object.assign({ origin: choose(global.races) }, choose(possibleLocations));
            newLocation.name = newLocation.origin.language.generateName();
            newLocation.specifier = `${newLocation.type} ${percentChance(50) ? 'of' : 'called'} ${newLocation.name}`;
            newLocation.size = percentChance(50) ? (percentChance(50) ? 'large' : 'small') : (percentChance(50) ? 'cramped' : 'huge');
            newLocation.description = choose(wordCollection.descriptions);
            let feature = '';
            const numberOfFeatures = randomInt(1, 2);
            for (let f = 0; f < numberOfFeatures; f++) {
                feature += percentChance(60) ? choose(wordCollection.descriptions) + ' ' : '';
                switch (newLocation.type) {
                    case 'town':
                    case 'city': {
                        feature += choose(['buildings', 'houses', 'alleys', 'walkways', 'streets']);
                        break;
                    }
                    case 'plains': {
                        feature += choose(['flowers', 'dirt patches', 'grass', 'trees', 'fields']);
                        break;
                    }
                    case 'forest': {
                        feature += choose(['trees', 'leaves', 'bushes', 'thickets', 'groves']);
                        break;
                    }
                    case 'mountain': {
                        feature += choose(['peaks', 'valleys', 'cliffs', 'caves']);
                        break;
                    }
                }
                if (numberOfFeatures > 1 && f < numberOfFeatures - 1) {
                    feature += ' and ';
                }
            }
            newLocation.feature = feature;

            newLocation.places.forEach(place => {
                if (['town', 'city'].includes(newLocation.type)) {
                    place.name = 'The ' + choose(wordCollection.adjectives) + ' ' + choose(wordCollection.nouns)[0];
                    place.name = capitalizeWords(place.name);
                } else {
                    place.name = newLocation.origin.language.generateName();
                }
            });
            locations.push(newLocation);
        }
        return locations;
    }

    generateTitle () {
        let title = `The ${this.storyType} `;
        switch (this.storyType) {
            case ('quest'): {
                title += percentChance(50) ? 'of ' + this.protagonist.fullName : 'to ' + this.evilPlaceName;
                break;
            }
            case ('revenge'): {
                title += percentChance(50) ? 'of ' + this.antagonist.fullName : 'upon ' + this.evilPlaceName;
                break;
            }
            case ('rescue'): {
                title += 'of ' + this.worldName;
                break;
            }
            case ('restoration'): {
                title += 'of ' + this.evilPlaceName;
                break;
            }
        }

        return capitalizeWords(title);
    }

    countWords (string) {
        string = string.replace(/(\s)+/g, '$1');
        const wordsByWhitespace = string.split(/\s/).length;
        const wordsByHyphens = string.split('-').length;
        const wordsByEmdashes = string.split('—').length;
        return wordsByWhitespace + wordsByHyphens + wordsByEmdashes;
    }

    write () {
        let output = this.title + '\nA fantasy novel generated by Robbie Antenesse <dev@alamantus.com> for NaNoGenMo 2018';
        
        // Generate an ending first and subtract its words from 50000
        const ending = generateChapter(this, true);
        const requiredWords = 50000 - this.countWords(ending);
        this.healParty();

        while(this.numberOfWords < requiredWords) {
            output += '\n--------------------\n\n' + generateChapter(this);
            this.numberOfWords = this.countWords(output);
        }

        output += '\n--------------------\n\n' + ending;
        this.numberOfWords = this.countWords(output);

        output += '\n\n' + this.numberOfWords + ' words';

        console.log(output);
        fs.writeFileSync('./novel.txt', output);
    }
}

const story = new Story();
story.write();
