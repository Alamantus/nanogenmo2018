const {
  randomInt,
  percentChance,
  choose,
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
      if (character.hp <= 0 || !anEnemyIsAlive()) return;
      
      const attackObject = character.hasOwnProperty('weapon') ? character.weapon : character;
      const damage = randomInt(attackObject.minDamage, attackObject.maxDamage);
      
      const characterName = `${character.hasOwnProperty('personality') ? '' : 'The '}${character.name}`;
      const target = choose((character.isEnemy ? party : enemies).filter(thing => thing.hp > 0));
      const targetName = `${target.hasOwnProperty('personality') ? '' : 'the '}${target.name}`;

      output += `${capitalize(characterName)} stepped up to attack ${targetName} with `;
      output += (character.hasOwnProperty('weapon') ? `${character.pronoun.possessive} ${character.weapon.name}` : `${correctArticle(character.attack)} ${character.attack}`) + '... ';
        
      if (percentChance(attackObject.accuracy)) {
        const damageRatio = damage / target.hp;
        target.hp -= damage;
        
        output += `${capitalize(characterName)} ${attackObject.verb} ${targetName}`;

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
      } else {
        output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} missed! `;
      }
    });
    output += '\n\n';
  }

  if (didLoseFight()) {
    output += 'The party pulled itself together and ran away before they could get battered any more than they already had been!';
  } else {
    output += 'The party gathered itself together in victory, continuing their trek onward.';
  }
  
  return output;
}