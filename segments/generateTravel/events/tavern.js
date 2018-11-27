const {randomInt, percentChance, choose, shuffle, capitalizeWords, correctArticle} = require('../../../helpers');
const wordCollection = require('../../../data/words');

const generateFight = require('../../generateFight');
const generateGame = require('../../generateGame');
const Character = require('../../../classes/Character');

module.exports = (story) => {
  let output = '';

  const bartenderKnowsProtagonist = story.visited.findIndex(visited => story.currentLocation.name == visited.name && story.currentLocation.place.name == visited.place.name) > -1;
  const bartender = new Character(percentChance(70) ? 'good' : 'bad', {knowsProtagonist: bartenderKnowsProtagonist});
  const bartenderTitle = story.currentLocation.place.type == 'tavern' ? 'tavern keeper' : 'bartender';
  
  const numberOfPeople = randomInt(0, 10);
  const people = [];
  for (let i = 0; i < numberOfPeople; i++) {
    const personKnowsProtagonist = bartenderKnowsProtagonist ? percentChance(50) : false;
    people.push(new Character(percentChance(70) ? 'good' : 'bad', {knowsProtagonist: personKnowsProtagonist}));
  }
  output += `The party walked into the ${choose(wordCollection.adjectives)} ${story.currentLocation.place.type} and ${percentChance(50) ? 'found' : 'saw that there were'} ${numberOfPeople > 0 ? numberOfPeople : 'no'} ${numberOfPeople == 1 ? 'person' : 'people'} there plus the ${bartenderTitle}. `;

  if (bartender.knowsProtagonist) {
    if (percentChance(50)) {
      output += `${story.protagonist.name} saw ${bartender.fullName}, the ${bartenderTitle}, when ${story.protagonist.pronoun.subject} walked in. `;

      switch (story.protagonist.personality) {
        default: {
          output += `\n\n"This place hasn't changed a bit!" ${story.protagonist.name} said, looking around.`;
          break;
        }
        case 'sweet': {
          output += `\n\n"Ah! This place is still so great!" ${story.protagonist.name} giggled, turning in a circle to take in the ${story.currentLocation.place.type}.`;
          break;
        }
        case 'kind': {
          output += `\n\n"Wow, This place still looks pretty good!" ${story.protagonist.name} smiled, looking around.`;
          break;
        }
        case 'mean': {
          output += `\n\n"Dang, what a dump. I can't believe this place is still in business!" ${story.protagonist.name} grimmaced.`;
          break;
        }
        case 'salty': {
          output += `\n\n"Heh, well, it's not pretty, but it's definitely a ${story.currentLocation.place.type}," ${story.protagonist.name} chuckled.`;
          break;
        }
      }
    } else {
      output += `${bartender.fullName}, the ${bartenderTitle}, saw ${story.protagonist.name} and ${story.protagonist.pronoun.possessive} friends walk in.`;
    }

    switch (bartender.personality) {
      default: {
        output += `\n\n"Well hello there, ${story.protagonist.name}! How goes the journey?" ${bartender.name} said.`;
        break;
      }
      case 'sweet': {
        output += `\n\n"Oh, ${story.protagonist.name}! It's so great to see you! How is everything going?" ${bartender.name} beamed.`;
        break;
      }
      case 'kind': {
        output += `\n\n"${story.protagonist.name}! What a surprise! I trust things are going well?" ${bartender.name} smiled.`;
        break;
      }
      case 'mean': {
        output += `\n\n"Hey look, it's ${story.protagonist.name}! What are you doing here? Is your adventure not going as well as you hoped?" ${bartender.name} laughed.`;
        break;
      }
      case 'salty': {
        output += `\n\n"Well well, it's ${story.protagonist.name}! Didn't expect to see you around. How are things?" ${bartender.name} grunted.`;
        break;
      }
    }

    switch (story.protagonist.personality) {
      default: {
        output += `\n\n"Always a pleasure, ${bartender.name}! `;
        break;
      }
      case 'sweet': {
        output += `\n\n"${bartender.name}! I'm so happy you're here! `;
        break;
      }
      case 'kind': {
        output += `\n\n"Ah, ${bartender.name}! I'm so glad to see you here! `;
        break;
      }
      case 'mean': {
        output += `\n\n"Oh, ${bartender.name}! I can't believe you've stuck around this long. `;
        break;
      }
      case 'salty': {
        output += `\n\n"Ha! ${bartender.name}! What are you even still doing here? You shoulda gotten outta here when you had a chance! `;
        break;
      }
    }
    output += `The journey ${story.averageHP / story.averageMaxHP >= 0.5 ? 'is going well' : 'has been difficult'}." ${story.protagonist.name} replied.`;
  }

  output += '\n\n';

  shuffle(story.fullParty).forEach(character => {
    const action = choose(['drink', 'play']);

    switch (action) {
      case 'drink': {
        const drinkAmount = percentChance(50) ? 'little' : 'lot'
        output += `${character.name} ${drinkAmount == 'little' ? 'felt thirsty' : 'wanted to get drunk'} and approached the bar, saying, "`;
        switch (character.personality) {
          default: {
            output += `I'd like `;
            break;
          }
          case 'sweet':
          case 'kind': {
            output += `May I please have `;
            break;
          }
          case 'mean':
          case 'salty': {
            output += `Get me `;
            break;
          }
        }
        const drink = choose(['ale', 'beer', 'cider', 'mead', 'wine', 'liquor']);
        output += `your ${drinkAmount == 'little' ? 'best' : 'strongest'} ${drink}!"`;
        
        const drinkName = capitalizeWords(choose(percentChance(70) ? wordCollection.adjectives : wordCollection.superlatives) + ' ' + choose(wordCollection.concepts));
        output += `\n\nThe ${bartenderTitle} nodded, poured a pint of the ${drinkName} ${drink} and slid it over to ${character.name}. `;
        if (drinkAmount == 'litte') {
          output += `${character.name} sipped at it, enjoying the flavor. `
        } else {
          output += `${character.name} downed it, nodding in satisfaction. `
        }
        
        if (percentChance(50)) {
          output += `The ${drinkName} turned out to be too much for ${character.pronoun.object}, and ${character.pronoun.subject} got drunk as ${character.pronoun.subject} continued drinking. `
          if (!percentChance(character.stats.rationality)) {
            if (numberOfPeople > 0) {
              let targetIndex = randomInt(0, people.length - 1);
              let target = people[targetIndex];
              if (target == undefined) {
                target = new Character('good');
                targetIndex = -1;
              }
              target.isEnemy = true;
              output += `${capitalizeWords(character.pronoun.subject)} looked over and saw ${target.describe()}. ${character.name} walked over to pick a fight.`;
              output += `\n\n"${character.introduce()} I am a ${character.weaponExperience} of the ${character.weapon.name}, and I think we should fight!" ${character.name} boasted.`;
              output += `\n\n"Well, ${target.introduce()} And I am a ${target.weaponExperience} of the ${target.weapon.name}, and I accept your challenge!" ${character.name} retorted.`;
              output += '\n\n' + generateFight([character, target]);
              if (targetIndex >= 0) {
                people.splice(targetIndex, 1);
              }
            } else {
              output += `After some time, ${character.pronoun.subject} ${percentChance(character.stats.luck) ? '' : 'threw up and '}${percentChance(50) ? 'passed out' : 'fell asleep'} on the bar.`;
            }
          }
        }

        break;
      }
      case 'play': {
        const gameType = choose(['conquer', 'splits', /* 'sets',  */'overpower']);
        const gameTool = ['conquer', 'splits'].includes(gameType) ? 'deck of cards' : 'set of dice';
        if (numberOfPeople > 0) {
          let target = choose(people);
          if (target == undefined) target = new Character('good');
          output += `${character.name} noticed ${target.describe()} sitting at a table with a ${gameTool}. ${character.name} walked over to request a game.`;
          output += `\n\n"${target.introduce()} Sit down and we can get started," ${target.name} smirked, "We're playing ${capitalizeWords(gameType)}."`
          output += '\n\n' + generateGame([character, target], gameType);
        } else {
          output += `${character.name} found a ${gameTool} and played a game of ${capitalizeWords(gameType)} by ${character.pronoun.object}self. `
          output += generateGame([character], gameType);
        }
        break;
      }
    }
    output += '\n\n';
  });

  return output;
}