const {randomInt, percentChance, choose} = require('../../../helpers');

module.exports = (story) => {
  let output = '';

  switch (story.currentLocation.place.type) {
    default: {
      // if (!percentChance(averageLuck)) {
      output += encounter(story, generateTravel);
      // }

      break;
    }
  }

  return output;
}