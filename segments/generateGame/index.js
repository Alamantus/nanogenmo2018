const {choose} = require('../../helpers');

const conquer = require('./conquer');
const splits = require('./splits');
const overpower = require('./overpower');

module.exports = (players, gameType = 'conquer') => {
  let output = choose(players).name + ' ';

  players = players.map(player => Object.assign({ hand: [] }, player));

  const isSolitaire = players.length == 1;
  if (isSolitaire && gameType != 'overpower') {
    players.push({hand: []});
  }
  
  if (['conquer', 'splits'].includes(gameType)) {
    output += `shuffled the deck and dealt the cards${isSolitaire ? ' for ' + players[0].pronoun.object + 'self' : ''}. `;
      if (isSolitaire) {
        players[1].name = 'the solitaire deck';
      }
    } else {
      output += 'gathered up the dice into the cup. ';
      if (isSolitaire && gameType != 'overpower') {
        players[1].name = 'the challenge roll';
      }
  }

  switch (gameType) {
    case 'conquer': {
      output += conquer(players, isSolitaire);
      break;
    }
    default:
    case 'splits': {
      output += splits(players, isSolitaire);
      break;
    }
    // case 'sets': {
    //   output += sets(players, isSolitaire);
    //   break;
    // }
    case 'overpower': {
      output += overpower(players, isSolitaire);
      break;
    }
  }

  return output;
}