const {percentChance, choose, shuffle} = require('../../helpers');

const {suits, cards, cardName, compareCards} = require('./cards');
const reactToTurn = require('./reactToTurn');

module.exports = (players, isSolitaire) => {
  let output = '';

  const deck = shuffle(cards);
  const maxRounds = 20;
  let rounds = 0;
  
  while (deck.length > 0) {
    players.forEach(player => {
      if (deck.length > 0) {
        player.hand.push(deck.splice(0, 1)[0]);
      }
    });
  }

  const compareHands = (a, b) => {
    const aCard = a.hand[0],
      bCard = b.hand[0];
    return compareCards(aCard, bCard);
  }

  if (players.length > 2) {
    players.sort(compareHands);
    output += `After comparing the first cards, ${players[0].name}'s ${cardName(players[0].hand[0])} won ${players[0].pronoun.object} the first turn. `
    players.forEach(player => {
      player.hand.push(player.hand.splice(0, 1)[0]);
    });
  }

  while (!players.some(player => player.hand.length == cards.length) && rounds < maxRounds) {
    if (players.length > 2) {
      players.forEach(player => {
        const target = choose(players.filter(person => person.fullName != player.fullName));
        output += `${player.name} chose ${target.name} to compare cards, and they both drew their next cards: `;
        output += `${player.name} revealed a ${cardName(player.hand[0])} and ${target.name} flipped a ${cardName(target.hand[0])}, so `;
        const playerWon = compareHands(player, target) < 0;
        if (playerWon) {
          output += player.name;
          player.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
        } else {
          output += target.name;
          target.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
        }
        output += ' took both cards. ';

        if (percentChance(30)) {
          if (percentChance(50)) {
            output += '\n\n' + reactToTurn(player, playerWon ? 'good' : 'bad') + '\n\n';
          } else {
            if (target.hasOwnProperty('personality')) {
              output += '\n\n' + reactToTurn(target, playerWon ? 'bad' : 'good') + '\n\n';
            }
          }
        }
      });
    } else {
      const player = players[0];
      const target = players[1];
      output += `${player.name} revealed a ${cardName(player.hand[0])} and ${target.name} flipped a ${cardName(target.hand[0])}, so `;
      const playerWon = compareHands(player, target) < 0;
      if (playerWon) {
        output += player.name;
        player.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
      } else {
        output += target.name;
        target.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
      }
      output += ' took both cards. ';

      if (percentChance(30)) {
        if (percentChance(50)) {
          output += '\n\n' + reactToTurn(player, playerWon ? 'good' : 'bad') + '\n\n';
        } else {
          if (target.hasOwnProperty('personality')) {
            output += '\n\n' + reactToTurn(target, playerWon ? 'bad' : 'good') + '\n\n';
          }
        }
      }
    }

    rounds++;
  }

  let winner;
  if (rounds >= maxRounds) {
    players.forEach(player => {
      if (!winner || player.hand.length > winner.hand.length) {
        winner = player;
      }
    });
    output += `Play continued until ${isSolitaire && winner.name != players[0].name ? players[0] + ' eventually lost' : winner.name + ' finally won'}.`
  } else {
    winner = players.find(player => player.hand.length == cards.length);
    output += `${winner.name} won the game! `;
  }
  
  return output;
}