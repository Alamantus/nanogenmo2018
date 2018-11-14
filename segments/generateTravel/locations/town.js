const {randomInt, percentChance, choose} = require('../../../helpers');

module.exports = (story) => {
  let output = '';

  switch (story.currentLocation.place.type) {
    default: {
      // if (!percentChance(averageLuck)) {
      output += JSON.stringify(story.currentLocation.place);
      // }

      break;
    }
    case 'tavern': {
      output += 'The party stops to see some the tavern.';
      break;
    }
    case 'well': {
      output += 'The party stops at the well to meet some people.';
      break;
    }
    case 'inn': {
      output += 'The party stops at the inn to get some rest for the night.';
      break;
    }
    case 'shop': {
      output += 'The party stops at the shop to see what they can buy.';
      break;
    }
    case 'blacksmith': {
      output += 'The party stops at the blacksmith to see if there was cool weaponry or armor to buy.';
      break;
    }
  }

  return output;
}