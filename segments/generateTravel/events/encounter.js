const {randomInt, percentChance, choose, shuffle, capitalize, correctArticle} = require('../../../helpers');
const allMonsters = require('../../../data/monsters');

const generateFight = require('../../generateFight');

module.exports = (action, story, generateTravel) => {
  let output = '';

  const monsters = [];
  let monsterString = '';
  const numberOfEnemies = randomInt(1, (percentChance(story.averageLuck) ? 2 : 5));
  for (let i = 0; i < numberOfEnemies; i++) {
    const monster = Object.assign({ isEnemy: true }, choose(allMonsters));
    monsters.push(monster);
  }
  let monsterCount = monsters.reduce((collection, monster) => {
    const monsterIndex = collection.findIndex(item => item.name == monster.name);
    if (monsterIndex < 0) {
      collection.push({name: monster.name, quantity: 1});
    } else {
      collection[monsterIndex].quantity++;
    }
    return collection;
  }, []);
  monsterCount.forEach((monster, i) => {
    if (monster.quantity == 1) {
      monsterString += correctArticle(monster.name) + ' ' + monster.name;
    } else {
      monsterString += monster.quantity + ' ' + monster.name + 's';
    }
    if (i < monsterCount.length - 1) {
      monsterString += ' and ';
    }
  });
  
  const turnOrder = shuffle([...monsters, ...story.fullParty]);
  let willFight = false;

  output += 'As they were ';
  switch (action) {
    case 'walked through': {
      output += 'walking';
      break;
    }
    case 'explored': {
      output += 'exploring';
      break;
    }
    case 'rested at': {
      output += 'resting';
      break;
    }
  }
  output += ', ';

  if (turnOrder[0].isEnemy) {
    output += `${monsterString} jumped out and attacked the party!`;
    willFight = true;
  } else {
    output += `${turnOrder[0].name} saw ${monsterString}! ${capitalize(turnOrder[0].pronoun.subject)} `;

    if (percentChance(turnOrder[0].stats.rationality)) {
      output += 'pointed it out to the others, ';

      if ((numberOfEnemies > 4 && percentChance(story.averageRationality))
        || percentChance(story.averageBravery) || percentChance(story.averageViolence)) {
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
          turnOrder.unshift(turnOrder.splice(monsterIndex, 1)[0]);
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