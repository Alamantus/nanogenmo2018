const {randomInt, choose} = require('../../helpers');

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

  let action;
  switch (randomInt(0, 2)) {
    case 0: {
      action = 'walked through';
      break;
    }
    case 1: {
      action = 'explored';
      break;
    }
    case 2: {
      action = 'traveled through';
      break;
    }
  }

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

  return output;
}