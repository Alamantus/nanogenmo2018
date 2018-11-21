const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../helpers');

const Character = require('../../classes/Character');
const monsters = require('../../data/monsters');
const generateFight = require('../generateFight');

module.exports = (story) => {
    let output = '';

    switch (story.storyType) {
        default:
        case 'quest': {
            output += `After much long and arduous travel, ${story.protagonist.name} and ${story.protagonist.pronoun.possessive} friends finally reached the ${percentChance(50) ? 'wretched' : 'evil'} realm of ${story.evilPlaceName}. `;
            const averageHPPercent = story.averageHP / story.averageMaxHP;
            output += `The ${averageHPPercent > 0.5 ? 'well-prepared' : 'battered and bruised'} party surveyed the army of ${story.antagonist.fullName} ${story.antagonist.title} arrayed before them, ${percentChance(story.averageBravery) ? 'but the fearsome sight did not drive them away' : 'and they were terrified by the fearsome sight'}. `;
            output += `Though they felt great fear, our heroes knew that they needed to face ${story.antagonist.title} and put an end to the danger ${story.antagonist.pronoun.subject} posed to ${story.worldName}. `;
            break;
        }
    }

    const enemyBuilding = choose(['castle', 'fortress', 'stronghold', 'dungeon']);
    
    const approachType = choose(['sneak', 'rush']);

    switch (approachType) {
        default:
        case 'sneak': {
            output += `Taking special care not to be seen, the party makes their way into the shadows to avoid being seen by ${story.antagonist.title}'s army. `;

            // if (percentChance(story.averageRationality)) {
            if (percentChance(story.averageRationality)) {
                output += `With much care and patience, they made their way to the ${enemyBuilding} without being spotted. `;
            } else {
                const numberOfEnemies = percentChance(story.averageLuck) ? 1 : randomInt(1, 3);
                const enemies = [];
                for (let i = 0; i < numberOfEnemies; i++) {
                    const enemy = new Character('bad', {maxHP: randomInt(8, 12)});
                    enemy.name = `the ${enemy.gender} ${enemy.race.name} in the ${enemy.clothing.torso.color} ${enemy.clothing.torso.type}`;
                    enemy.isEnemy = true;
                    enemies.push(enemy);
                }
                const turnOrder = shuffle([...enemies, ...story.fullParty]);
                output += `The party made their way to the ${enemyBuilding}, but were spotted by ${enemies.map(enemy => enemy.describe()).join(' and ')}. ${enemies.length > 1 ? 'They' : capitalize(enemies[0].pronoun.subject)} ran to intercept the party and prevent them from continuing forward!`;
                output += '\n\n' + generateFight(shuffle(turnOrder), {
                    winText: `Looking about them to make sure they could hide better, the party moved on.`,
                    loseText: `The party scattered and hid to avoid taking any more damage. When the coast was clear, they regrouped and continued onward.`,
                });
            }

            break;
        }
    }

    const obstacle = choose([/* 'puzzle', 'lock',  */'guard']);
    output += `\n\nWhen they finally reached the entrance of the ${enemyBuilding}, they were met with a ${obstacle}: `;
    switch (obstacle) {
        default:
        case 'guard': {
            const guard = percentChance(50) ? new Character('bad') : Object.assign({}, choose(monsters));
            guard.hp = randomInt(30, 50);
            if (guard.hasOwnProperty('maxHP')) guard.maxHP = guard.hp;
            if (guard.hasOwnProperty('weapon')) {
                guard.weapon.minDamage *= 2;
                guard.weapon.maxDamage *= 2;
                guard.weapon.accuracy += 15;
                guard.weapon.name = `${choose(['wicked', 'evil', 'giant, bloody', 'horrible'])} ${guard.weapon.name}`;
            } else {
                guard.minDamage *= 2;
                guard.maxDamage *= 2;
                guard.accuracy += 30;
                guard.attack = `${choose(['terrible', 'horrifying', 'wicked', 'nasty', 'terrifying', 'evil'])} ${guard.attack}`;
            }
            guard.name = guard.hasOwnProperty('personality') ? `the ${guard.gender} ${guard.race.name}` : 'giant ' + guard.name;
            guard.isEnemy = true;
            output += `${guard.hasOwnProperty('personality') ? guard.describe() + 'holding a ' + guard.weapon.name : 'a ' + guard.name} standing in the way! `;

            let turnOrder;
            if (percentChance(story.averageLuck)) {
                turnOrder = [...story.fullParty, guard];
                output += `They quickly hid in the shadows before they were spotted and waited until ${guard.name.includes('the') ? guard.name : 'the ' + guard.name} turned its back.`;
            } else {
                turnOrder = [guard, ...story.fullParty];
                output += `${capitalize(guard.name.includes('the') ? guard.name : 'the ' + guard.name)} spotted them as they approached and quickly moved into a defensive possition to protect the door.`;
            }

            output += '\n\n' + generateFight(turnOrder, {
                canRun: false,
                winText: `${choose(story.fullParty).name} then stood watch while the rest of the party got through the door.`,
                loseText: `With a burst of divine light, ${choose(story.fullParty).name} cried out, and ${guard.name.includes('the') ? guard.name : 'the ' + guard.name} was suddenly gone! Stunned but not surprised, the party entered the ${enemyBuilding}.`,
            });
            break;
        }
    }
    
    return output;
}