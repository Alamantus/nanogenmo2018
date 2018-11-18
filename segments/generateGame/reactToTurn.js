module.exports = (character, type) => {
  let output = '';

  switch (type) {
    case 'good': {
      switch (character.personality) {
        default: {
          output += `${character.name} smiled, exclaiming, "Yes! I got it!"`;
          break;
        }
        case 'sweet': {
          output += `${character.name} giggled, exclaiming, "Yay! I did it!"`;
          break;
        }
        case 'kind': {
          output += `${character.name} laughed, exclaiming, "Ha! Gotcha!"`;
          break;
        }
        case 'mean': {
          output += `${character.name} barked a laugh, exclaiming, "Ha! I'm the best!"`;
          break;
        }
        case 'salty': {
          output += `${character.name} laughed, exclaiming, "Yes! Take that!"`;
          break;
        }
      }
      break;
    }
    case 'bad': {
      switch (character.personality) {
        default: {
          output += `${character.name} frowned, muttering, "Darn!"`;
          break;
        }
        case 'sweet': {
          output += `${character.name} frowned, exclaiming, "Oh no!"`;
          break;
        }
        case 'kind': {
          output += `${character.name} grunted, exclaiming, "No!"`;
          break;
        }
        case 'mean': {
          output += `${character.name} cursed, yelling, "Damn it!"`;
          break;
        }
        case 'salty': {
          output += `${character.name} swore, muttering, "Damn!"`;
          break;
        }
      }
      break;
    }
    // case 'winning': {
    //   break;
    // }
    // case 'losing': {
    //   break;
    // }
  }
  
  return output;
}