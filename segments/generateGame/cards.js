const suits = ['swords', 'shields', 'stars'];
const cards = [];
for (let i = 1; i <= 5; i++) {
  for (let j = 0; j < suits.length; j++) {
    cards.push({ value: i, suit: suits[j] });
  }
}
const cardName = card => `${card.value} of ${card.suit}`;

// -1 means aCard is better than bCard, 1 means bCard is better than aCard
const compareCards = (aCard, bCard) => {
  if (aCard.value == bCard.value) {
    return suits.indexOf(aCard.suit) > suits.indexOf(bCard.suit) ? -1 : 1;
  }
  return (aCard.value == 1 && bCard.value == 10) || aCard.value > bCard.value ? -1 : 1;
}

module.exports = {
  suits,
  cards,
  cardName,
  compareCards,
};