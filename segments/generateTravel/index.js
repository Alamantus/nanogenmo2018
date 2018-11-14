const {percentChance, choose} = require('../../helpers');

const encounter = require('./events/encounter');
const generateTown = require('./locations/town');

const generateTravel = (story, randomizeLocation = true) => {
  let output = '';
  
  story.visited.push({
    name: story.currentLocation.name,
    type: story.currentLocation.type,
    place: story.currentLocation.place,
  });
  const lastLocation = story.visited[story.visited.length - 1];

  if (randomizeLocation) {
    story.currentLocation = Object.assign({}, choose(story.locations));
    story.currentLocation.place = choose(story.currentLocation.places);
  }

  const action = choose(['walked through', 'explored', 'rested at']);

  if (lastLocation.name == story.currentLocation.name) {
    if (lastLocation.place == story.currentLocation.place) {
      output += 'Our heroes remained in'
    }
  } else if (story.visited.findIndex(location => location.name == story.currentLocation.name) > -1) {
    output += 'The party returned to';
  } else {
    output += 'Our heroes ' + action;
  }

  output += ` the ${story.currentLocation.specifier}. They were ${story.currentLocation.place.preposition} the ${story.currentLocation.place.type} called "${story.currentLocation.place.name}"`;

  switch (action) {
    default:
    case 'walked through': {
      output += ', trying to make their way through.\n\n';
      break;
    }
    case 'explored': {
      output += ', seeing what they could find.\n\n';
      break;
    }
    case 'rested at': {
      output += ', recovering from all the walking they had done.\n\n';
      break;
    }
  }

  switch (story.currentLocation.type) {
    default: {
      switch (story.currentLocation.place.type) {
        default: {
          // if (!percentChance(averageLuck)) {
          output += encounter(action, story, generateTravel);
          // }

          break;
        }
      }
      break;
    }
    case 'town': {
      const doStop = action == 'walked through' ? percentChance(50) : true;
      if (doStop) {
        output += generateTown(story);
      } else {
        output += 'Not wanting to stop, they continued onward. ';
      }
      break;
    }
  }

  return output;
}

module.exports = generateTravel;