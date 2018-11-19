const {percentChance, choose, shuffle} = require('../../helpers');

const {suits, cards, cardName, compareCards} = require('./cards');
const reactToTurn = require('./reactToTurn');

module.exports = (players, isSolitaire) => {
  let output = '';

  const deck = shuffle(cards);
  const maxRounds = 3;
  let rounds = 0;
  
  players.forEach(player => {
    player.points = 0;
    player.hand = [];
  });
  for (let i = 0; i < 3; i++) {
    players.forEach(player => {
      player.points = 0;
      if (deck.length > 0) {
        player.hand.push(deck.splice(0, 1)[0]);
      }
    });
  }

  const everyCardIsSameValue = hand => hand.reduce((total, card) => total + card.value, 0) / hand.length === hand[0].value;
  const everyCardIsSameSuit = hand => hand.reduce((lastSuit, card) => card.suit == lastSuit ? card.suit : false, hand[0].suit) === hand[0].suit;
  const cardsAreSequential = hand => hand.sort(compareCards).reverse().reduce((lastValue, card) => card.value == (lastValue ? lastValue : -1) + 1 ? card.value : false, hand[0].value) !== false;

  const checkPoints = hand => {
    if (everyCardIsSameValue(hand)) {
      return hand[0].value * hand.length;
    }
    if (cardsAreSequential(hand)) {
      const sameSuit = everyCardIsSameSuit(hand);
      return hand.reduce((total, card) => total + (card.value * (sameSuit ? 2 : 1)), 0);
    } else if (hand[0].value == hand[1].value || hand[0].value == hand[2].value) {
      return hand[0].value * 2;
    } else if (hand[1].value == hand[2].value) {
      return hand[1].value * 2;
    }

    return 0;
  };

  const points = {};
  players.forEach(player => {
    player.points = checkPoints(player.hand);

    output += `${player.name} `;
    if (!isSolitaire && player.points == 0) {
      player.hand.sort(compareCards).reverse();

      output += `looked at their cards, thought for a moment, and discarded their ${cardName(player.hand[0])} to draw a new one, and `;
      
      deck.push(player.hand.splice(0, 1)[0]);
      player.hand.push(deck.splice(0, 1)[0]);
      player.points = checkPoints(player.hand);
    }

    output += `laid down their cards: ${player.hand.map(card => `the ${cardName(card)}`).join(' and ')}. `;
    
    if (!points.hasOwnProperty(player.points.toString())) {
      points[player.points.toString()] = [];
    }
    points[player.points.toString()].push(player);
  });

  let highestPoints = 0;
  for (let pointValue in points) {
    if (parseInt(pointValue) > highestPoints) {
      highestPoints = parseInt(pointValue);
    }
  }
  // output += JSON.stringify(points);

  let winner = points[highestPoints.toString()];

  if (winner.length > 1) {
    const winnerString = winner.map(player => player.name).join(' and ');
    output += `${percentChance(50) ? 'It' : 'Which means it'} was a ${winner.length > 2 ? winner.length + '-way tie split among' : 'tie between'} ${winnerString}!`;
  } else {
    output += `${percentChance(50) ? 'So' : 'Which means'} ${winner[0].name} won!`
  }
  
  return output;
}