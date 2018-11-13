const {
  randomInt,
  percentChance,
  choose,
  shuffle,
  capitalize,
  correctArticle,
} = require('../../helpers');

const reactToDamage = require('./reactToDamage');
const die = require('./die');

module.exports = (turnOrder) => {
  let output = '';

  const party = turnOrder.filter(character => !character.isEnemy);
  const enemies = turnOrder.filter(character => character.isEnemy);

  const anEnemyIsAlive = () => enemies.some(enemy => enemy.hp > 0);
  const didLoseFight = () => party.every(member => member.hp <= 0);
  
  while (anEnemyIsAlive() && !didLoseFight()) {
    turnOrder.forEach(character => {
      if (character.hasOwnProperty('isDodging')) delete character.isDodging;

      if (character.hp <= 0 || !anEnemyIsAlive()) return;
      
      const attackObject = character.hasOwnProperty('weapon') ? character.weapon : character;

      const characterName = `${character.hasOwnProperty('personality') ? '' : 'The '}${character.name}`;
      const target = choose((character.isEnemy ? party : enemies).filter(thing => thing.hp > 0));
      if (!target) {
        output += `${characterName} got ${percentChance(50) ? 'confused' : 'distracted'} and ${percentChance(50) ? 'just stood there' : 'looked around'}. `;
        return;
      }
      
      const targetName = `${target.hasOwnProperty('personality') ? '' : 'the '}${target.name}`;

      if (character.hasOwnProperty('stats') && !percentChance(character.stats.bravery)) {
        output += `${characterName} `;
        output += !percentChance(character.stats.bravery) ? `lost ${character.pronoun.possessive} nerve and ran a little distance away`
          : `took a defensive stance to try to fend off the enemy's advance`;
        output += '. ';
        character.isDodging = true;
        return;
      }

      output += `${capitalize(characterName)} ${percentChance(50) ? (percentChance(50) ? 'stepped up' : 'ran up') : (percentChance(50) ? 'looked around and decided' : 'recklessly moved')} to attack ${targetName} with `;
      output += (character.hasOwnProperty('weapon') ? `${character.pronoun.possessive} ${attackObject.name}` : `${correctArticle(attackObject.attack)} ${attackObject.attack}`) + '... ';
        
      if (target.isDodging) {
        if (percentChance(50)) {
          output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} couldn't hit ${targetName}! `;
        } else {
          output += `But ${targetName} dodged quickly and avoided ${character.hasOwnProperty('pronoun') ? character.pronoun.possessive : 'its'} ${attackObject.attack}! `;
        }
      } else if (percentChance(attackObject.accuracy)) {
        const numberOfAttacks = character.hasOwnProperty('stats') && percentChance(character.stats.violence) ? 2 : 1;

        for (let i = 0; i < numberOfAttacks; i++) {
          const damage = randomInt(attackObject.minDamage, attackObject.maxDamage);
          const damageRatio = damage / target.hp;
          target.hp -= damage;
          
          output += `${capitalize(characterName)} ${attackObject.verb} ${targetName}`;
          if (i == 1) {
            output += percentChance(50) ? ' again' : ' a second time';
          }

          if (target.hasOwnProperty('personality')) {
            output += reactToDamage(damageRatio, target) + ' ';

            if (target.hp <= 0) {
              die(target);
            }
          } else {
            output += ` and the ${target.name} `;
            if (damageRatio <= 0.2) {
              output += 'shook its head, hurt but still ok. '
            } else if (damageRatio > 0.2 && damageRatio <= 0.5) {
              output += 'let out a cry of pain. '
            } else {
              output += 'howled in pain. '
            }

            if (target.hp <= 0) {
              output += 'It let out one last cry of pain and collapsed to the ground, dead! ';
            }
          }
        }
      } else {
        output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} missed! `;
      }
    });

    if (percentChance(50)) {
      turnOrder = shuffle(turnOrder);
    }

    output += '\n\n';
  }

  if (didLoseFight()) {
    output += 'The party pulled itself together and ran away before they could get battered any more than they already had been!';
  } else {
    output += 'The party gathered itself together in victory, continuing their trek onward.';
  }
  
  return output;
}