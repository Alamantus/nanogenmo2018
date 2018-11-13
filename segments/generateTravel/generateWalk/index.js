const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../../helpers');

const encounter = require('./encounter');

module.exports = (story, generateTravel) => {
  let output = '';

  switch (story.currentLocation.type) {
    default: {
      switch (story.currentLocation.place.type) {
        default: {
          // if (!percentChance(averageLuck)) {
            output += encounter(story, generateTravel);
          // }
          
          break;
        }
      }
      break;
    }
  }

  return output;
}