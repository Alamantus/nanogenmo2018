const {randomInt, percentChance, choose, shuffle, capitalize, correctArticle} = require('../../../helpers');
const wordCollection = require('../../../data/words');

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
  output += `The party walked into the ${choose(wordCollection.adjectives)} tavern and ${percentChance(50) ? 'found' : 'saw that there were'} ${numberOfPeople > 0 ? numberOfPeople : 'no'} ${numberOfPeople == 1 ? 'person' : 'people'} there plus the ${bartenderTitle}. `;

  if (bartender.knowsProtagonist) {
    if (percentChance(50)) {
      output += `${bartender.fullName}, the ${bartenderTitle}, saw ${story.protagonist.name} and his friends walk in. `
    } else {
      output += `${story.protagonist.name} saw ${bartender.fullName}, the ${bartenderTitle}, when ${story.protagonist.pronoun.subject} walked in. `
    }
  }

  return output;
}