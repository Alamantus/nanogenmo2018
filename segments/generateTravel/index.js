const {percentChance, choose, correctArticle} = require('../../helpers');

const encounter = require('./events/encounter');
const generateTown = require('./locations/town');

const generateTravel = (story, randomizeLocation = true) => {
  let output = '';
  
  story.visited.push({
    name: story.currentLocation.name,
    type: story.currentLocation.type,
    place: Object.assign({}, story.currentLocation.place),
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
    } else {
      output += 'Our heroes moved on from where they were in'
    }
  } else if (story.visited.findIndex(location => location.name == story.currentLocation.name) > -1) {
    output += 'The party returned to';
  } else {
    output += 'Our heroes ' + action;
  }

  output += ` the ${story.currentLocation.specifier}, ${correctArticle(story.currentLocation.size)} ${story.currentLocation.size} and ${story.currentLocation.description} place with ${story.currentLocation.feature}. They were ${story.currentLocation.place.preposition} the ${story.currentLocation.place.type} called "${story.currentLocation.place.name}"`;

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
    default:
    case 'path':
    case 'forest':
    case 'mountain': {
      switch (story.currentLocation.place.type) {
        default: {
          if (!percentChance(story.averageLuck)) {
            output += encounter(action, story, generateTravel);
          } else {
            if (action == 'rested at') {
              output += 'The party set up camp and rested for the night. '
              story.healParty();
            } else {
              output += 'Not encountering anything interesting, the party continues onward. ';
            }
            output += generateTravel(story);
          }

          break;
        }
      }
      break;
    }
    case 'town':
    case 'city': {
      const doStop = action == 'walked through' ? percentChance(50) : true;
      if (doStop) {
        output += generateTown(story);
      } else {
        output += 'Not wanting to stop, they continued onward. ';
        output += generateTravel(story);
      }
      break;
    }
  }

  return output;
}

module.exports = generateTravel;