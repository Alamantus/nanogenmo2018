const {percentChance, choose} = require('../../helpers');

const generateWalk = require('./generateWalk');
const generateExplore = require('./generateExplore');
const generateRest = require('./generateRest');

module.exports = (story) => {
  let output = '';
  
  story.visited.push({
    name: story.currentLocation.name,
    type: story.currentLocation.type,
    place: story.currentLocation.place,
  });
  const lastLocation = story.visited[story.visited.length - 1];
  story.currentLocation = Object.assign({}, choose(story.locations));
  story.currentLocation.place = choose(story.currentLocation.places);

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

  output += ` the ${story.currentLocation.specifier}. They are ${story.currentLocation.place.preposition} the ${story.currentLocation.place.type} called "${story.currentLocation.place.name}"`;

  switch (action) {
    case 'walked through': {
      output += generateWalk(story);
      break;
    }
    case 'explored': {
      output += generateExplore(story);
      break;
    }
    case 'rested at': {
      output += generateRest(story);
      break;
    }
  }

  return output;
}