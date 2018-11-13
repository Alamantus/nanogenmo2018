const {percentChance, choose} = require('../../helpers');

const generateWalk = require('./generateWalk');
const generateExplore = require('./generateExplore');
const generateRest = require('./generateRest');

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
      output += generateWalk(story, generateTravel);
      break;
    }
    // case 'explored': {
    //   output += ', seeing what they could find.\n\n';
    //   output += generateExplore(story);
    //   break;
    // }
    // case 'rested at': {
    //   output += ', recovering from all the walking they had done.\n\n';
    //   output += generateRest(story);
    //   break;
    // }
  }

  return output;
}

module.exports = generateTravel;