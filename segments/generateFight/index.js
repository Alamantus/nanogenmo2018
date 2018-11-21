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

module.exports = (turnOrder, {limitTurns = true, canRun = true, winText, loseText} = {}) => {
  let output = '';

  const party = turnOrder.filter(character => !character.isEnemy);
  const enemies = turnOrder.filter(character => character.isEnemy);

  const anEnemyIsAlive = () => enemies.some(enemy => enemy.hp > 0);
  const didLoseFight = () => party.every(member => member.hp <= 0);
  
  const maxTurns = limitTurns ? 50 : 999;
  let turns = 0;
  
  while (anEnemyIsAlive() && !didLoseFight() && turns < maxTurns) {
    turns++;
    turnOrder.forEach(character => {
      if (character.hasOwnProperty('isDodging')) delete character.isDodging;

      if (character.hp <= 0 || !anEnemyIsAlive()) return;
      
      const attackObject = character.hasOwnProperty('weapon') ? character.weapon : character;
      const characterName = `${character.hasOwnProperty('personality') ? '' : 'the '}${character.name}`;

      if (character.isEnemy) {
        const runChance = (1 - (character.hp / character.maxHP)) * 100;
        if (canRun && percentChance(runChance)) {
          character.hp = 0;
          output += `${capitalize(characterName)} ${percentChance(50) ? 'got spooked' : 'became afraid'} and ran away ${percentChance(50) ? 'to avoid dying' : `before the party could finish ${character.hasOwnProperty('personality') ? character.pronoun.object : 'it'} off`}! `;
          return;
        }
      }

      const target = choose((character.isEnemy ? party : enemies).filter(thing => thing.hp > 0));
      if (!target) {
        output += `${capitalize(characterName)} got ${percentChance(50) ? 'confused' : 'distracted'} and ${percentChance(50) ? 'just stood there' : 'looked around'}. `;
        return;
      }
      
      const targetName = `${target.hasOwnProperty('personality') ? '' : 'the '}${target.name}`;

      if (character.hasOwnProperty('stats') && !percentChance(character.stats.bravery)) {
        output += `${capitalize(characterName)} `;
        output += !percentChance(character.stats.bravery) ? `lost ${character.pronoun.possessive} nerve and ran a little distance away`
          : `took a defensive stance to try to fend off the enemy's advance`;
        output += '. ';
        character.isDodging = true;
        return;
      }

      output += `${capitalize(characterName)} ${percentChance(50) ? (percentChance(50) ? 'stepped up' : 'ran up') : (percentChance(50) ? 'looked around and decided' : 'recklessly moved')} to attack ${targetName} with `;
      output += (character.hasOwnProperty('weapon') ? `${character.pronoun.possessive} ${attackObject.name}` : `${correctArticle(attackObject.attack)} ${attackObject.attack}`) + '... ';
        
      let canHit = true;
      if (target.isDodging) {
        if (percentChance(50)) {
          if (percentChance(50)) {
            output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} couldn't hit ${targetName}! `;
            canHit = false;
          } else {
            output += `${capitalize(targetName)} tried to dodge, but ${characterName} was too fast! `;
          }
        } else {
          output += `But ${targetName} dodged quickly and avoided ${character.hasOwnProperty('pronoun') ? character.pronoun.possessive : 'its'} ${attackObject.attack}! `;
          canHit = false;
        }
      }
      
      if (canHit && percentChance(attackObject.accuracy)) {
        const numberOfAttacks = character.hasOwnProperty('stats') && percentChance(character.stats.violence) ? 2 : 1;

        for (let i = 0; i < numberOfAttacks; i++) {
          if (target.hp > 0) {
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
                output += die(target) + ' ';
              }
            } else {
              output += ` and ${targetName} `;
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
        }
      } else if (canHit) {
        output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} missed! `;
      }
    });

    if (percentChance(50)) {
      turnOrder = shuffle(turnOrder);
    }

    output += '\n\n';
  }
  
  const didLose = didLoseFight() || turns >= maxTurns;
  
  if (didLose) {
    output += loseText ? loseText : 'The party pulled itself together and ran away before they could get battered any more than they already had been!';
  } else {
    output += winText ? winText : 'The party gathered itself together in victory, continuing their trek onward.';
  }
  
  return output;
}