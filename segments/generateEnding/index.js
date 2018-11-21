const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../helpers');

const Character = require('../../classes/Character');
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
                output += '\n\n' + generateFight(shuffle(turnOrder));
            }
            break;
        }
    }
    
    return output;
}