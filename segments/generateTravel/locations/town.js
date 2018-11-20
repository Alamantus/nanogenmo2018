const {randomInt, percentChance, choose} = require('../../../helpers');

const generateTavern = require('../events/tavern');

module.exports = (story) => {
  let output = '';

  switch (story.currentLocation.place.type) {
    default:
    case 'bar':
    case 'tavern': {
      output += generateTavern(story);
      break;
    }
    case 'plaza':
    case 'well': {
      output += 'The party stops to meet some people and get some direction. ';
      break;
    }
    case 'inn': {
      output += 'The party stops at the inn to get some rest for the night. ';
      break;
    }
    case 'market':
    case 'shop': {
      output += 'The party stops at the ' + story.currentLocation.place.type + ' to see what they can buy.';
      break;
    }
    case 'armory':
    case 'blacksmith': {
      output += 'The party stops at the ' + story.currentLocation.place.type + ' to see if there was cool weaponry or armor to buy.';
      break;
    }
  }

  return output;
}