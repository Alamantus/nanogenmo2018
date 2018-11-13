const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../helpers');

const reactToDamage = require('./reactToDamage');

module.exports = (turnOrder) => {
  let output = '';

  const party = turnOrder.filter(character => !character.isEnemy);
  const enemies = turnOrder.filter(character => character.isEnemy);

  const anEnemyIsAlive = () => enemies.some(enemy => enemy.hp > 0);
  const didLoseFight = () => party.every(member => member.hp <= 0);

  // output += '\n\n';
  // output += anEnemyIsAlive ? 'enemyIsAlive' : 'enemyNOTalive';
  // output += '\n\n';
  // output += didLoseFight ? 'didLoseFight' : 'didWinFight';
  
  while (anEnemyIsAlive() && !didLoseFight()) {
    turnOrder.forEach(character => {
      if (character.hp <= 0 || !anEnemyIsAlive()) return;
      
      const attackObject = character.hasOwnProperty('weapon') ? character.weapon : character;
      const damage = randomInt(attackObject.minDamage, attackObject.maxDamage);
      
      const characterName = `${character.hasOwnProperty('personality') ? '' : 'The '}${character.name}`;
      const target = choose((character.isEnemy ? party : enemies).filter(thing => thing.hp > 0));
      const targetName = `${target.hasOwnProperty('personality') ? '' : 'the '}${target.name}`;

      output += `${capitalize(characterName)} stepped up to attack ${targetName} with `;
      output += (character.hasOwnProperty('weapon') ? `${character.pronoun.possessive} ${character.weapon.name}` : `a ${character.attack}`) + '... ';
        
      if (percentChance(attackObject.accuracy)) {
        const damageRatio = damage / target.hp;
        target.hp -= damage;
        
        output += `${capitalize(characterName)} ${attackObject.attack} ${target.name}`;

        if (target.hasOwnProperty('personality')) {
          output += reactToDamage(damageRatio, target);

          if (target.hp <= 0) {
            output += ` ${target.name} succumbed to the pain`;
            switch (target.personality) {
              default: {
                output += ` and fell to ${target.pronoun.possessive} knees.`;
                break;
              }
              case 'sweet': {
                output += `, crying out as ${target.pronoun.subject} fell backwards.`;
                break;
              }
              case 'kind': {
                output += `, dropping to ${target.pronoun.possessive} knees and falling to their side.`;
                break;
              }
              case 'mean': {
                output += `, yelling out in anger as ${target.pronoun.subject} fell.`;
                break;
              }
              case 'salty': {
                output += ` and groaned as ${target.pronoun.subject} slumped backward.`;
                break;
              }
            }
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
        output += `But ${character.hasOwnProperty('pronoun') ? character.pronoun.subject : 'it'} missed!`;
      }

      output += '\n\n';
    });
  }

  if (didLoseFight()) {
    output += 'The party pulls itself together, running away before they can get battered any more than they already have been!';
  } else {
    output += 'The party gathers itself together in victory, continuing their trek onward.';
  }
  
  return output;
}