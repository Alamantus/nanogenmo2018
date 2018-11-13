const {randomInt, percentChance, choose, shuffle, capitalize, correctArticle} = require('../../../helpers');
const allMonsters = require('../../../data/monsters');

const generateFight = require('../../generateFight');

module.exports = (story, generateTravel) => {
  let output = '';

  const monsters = [];
  let monsterString = '';
  const numberOfEnemies = randomInt(1, (!percentChance(story.averageLuck) ? 5 : 2));
  for (let i = 0; i < numberOfEnemies; i++) {
    const monster = Object.assign({ isEnemy: true }, choose(allMonsters));
    monsterString += correctArticle(monster.name) + ' ' + monster.name;
    if (i < numberOfEnemies - 1) {
      monsterString += ' and ';
    }
    monsters.push(monster);
  }
  
  const turnOrder = shuffle([...monsters, ...story.fullParty]);
  let willFight = false;

  output += `As they were walking, `;

  if (turnOrder[0].isEnemy) {
    output += `${monsterString} jumped out and attacked the party!`;
    willFight = true;
  } else {
    output += `${turnOrder[0].name} saw ${monstersString}! ${capitalize(turnOrder[0].pronoun.subject)} `;

    if (percentChance(turnOrder[0].stats.rationality)) {
      output += 'pointed it out to the others, ';

      if (percentChance(story.averageBravery) || percentChance(story.averageViolence)) {
        output += 'and they decided to eliminate the threat.'
        willFight = true;
      } else {
        output += 'but they decided to avoid it to spare themselves any undue danger.'
      }
    } else {
      output += `kept it to ${turnOrder[0].pronoun.object}self, `

      if (percentChance(turnOrder[0].stats.violence) || percentChance(turnOrder[0].stats.bravery)) {
        output += 'opting to run in and destroy it alone instead of alerting anyone else.';
        willFight = true;
      } else {
        output += 'deciding it was better to ignore the threat.'

        if (percentChance(story.averageLuck)) {
          output += ` Luckily, the party was able to avoid the ${monsterString} and move onward without any issues.`;
        } else {
          output += ` Unfortunately, the ${monsters[0].name} spotted the party as they moved past and jumped out with an attack!`;
          const monsterIndex = turnOrder.findIndex(character => character.isEnemy);
          turnOrder.unshift(turnOrder.splice(monsterIndex, 1));
          willFight = true;
        }
      }
    }
  }

  output += '\n\n'

  if (willFight) {
    output += generateFight(turnOrder);
  } else {
    story.currentLocation.place = choose(story.currentLocation.places);
    output += generateTravel(story, false);
  }

  return output;
}