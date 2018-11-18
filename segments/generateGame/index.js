const {randomInt, percentChance, choose, shuffle} = require('../../helpers');

const suits = ['swords', 'shields', 'stars'];
const cards = [];
for (let i = 1; i <= 5; i++) {
  for (let j = 0; j < suits.length; j++) {
    cards.push({value: i, suit: suits[j]});
  }
}
const cardName = card => `${card.value} of ${card.suit}`;

module.exports = (players, gameType = 'conquer') => {
  let output = choose(players).name + ' ';

  players = players.map(player => Object.assign({ hand: [] }, player));

  const isSolitaire = players.length == 1;
  if (isSolitaire) {
    players.push({hand: []});
  }
  
  if (['conquer', 'splits'].includes(gameType)) {
    output += `shuffled the deck and dealt the cards${isSolitaire ? ' for ' + players[0].pronoun.object + 'self' : ''}. `;
      if (isSolitaire) {
        players[1].name = 'the solitaire deck';
      }
    } else {
      output += 'gathered up the dice into the cup. ';
      if (isSolitaire) {
        players[1].name = 'the challenge roll';
      }
  }
  
  const deck = shuffle(cards);
  const maxRounds = 20;
  let rounds = 0;

  switch (gameType) {
    default: {
      while (deck.length > 0) {
        players.forEach(player => {
          if (deck.length > 0) {
            player.hand.push(deck.splice(0, 1)[0]);
          }
        });
      }
      const compareCards = (a, b) => {
        const aCard = a.hand[0],
          bCard = b.hand[0];
        if (aCard.value == bCard.value) {
          return suits.indexOf(aCard.suit) > suits.indexOf(bCard.suit) ? -1 : 1;
        }
        return (aCard.value == 1 && bCard.value == 10) || aCard.value > bCard.value ? -1 : 1;
      }

      if (players.length > 2) {
        players.sort(compareCards);
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
            if (compareCards(player, target) < 0) {
              output += player.name;
              player.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
            } else {
              output += target.name;
              target.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
            }
            output += ' took both cards. ';
          });
        } else {
          const player = players[0];
          const target = players[1];
          output += `${player.name} revealed a ${cardName(player.hand[0])} and ${target.name} flipped a ${cardName(target.hand[0])}, so `;
          if (compareCards(player, target) < 0) {
            output += player.name;
            player.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
          } else {
            output += target.name;
            target.hand.push(player.hand.splice(0, 1)[0], target.hand.splice(0, 1)[0]);
          }
          output += ' took both cards. ';
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

      
      break;
    }
  }

  return output;
}