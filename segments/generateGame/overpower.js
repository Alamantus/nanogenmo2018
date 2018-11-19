const {randomInt, percentChance, choose, shuffle} = require('../../helpers');

module.exports = (players, isSolitaire) => {
  let output = '';

  players = shuffle(players);
  
  let continuePlaying = isSolitaire;
  
  let lastRoll = randomInt(1, 6);
  let currentRoll = lastRoll;
  
  output += `${players[0].name} starts the game by rolling a ${currentRoll}. `
  
  let rounds = 1;
  while (players.length > 1 || (isSolitaire && continuePlaying)) {
    const currentPlayerIndex = rounds % players.length;
    const currentPlayer = players[currentPlayerIndex];
    currentRoll = randomInt(1, 6);

    output += `${currentPlayer.name} rolled a ${currentRoll}, `;
    
    if (currentRoll > lastRoll || (currentRoll == 1 && lastRoll == 6)) {
      output += `which beat the previously-rolled ${lastRoll}${percentChance(50) ? ', allowing the game to continue' : ''}. `;
      lastRoll = currentRoll;
      continuePlaying = true;
    } else {
      output += `which did not beat the previously-rolled ${lastRoll}, `
      if (isSolitaire) {
        continuePlaying = false;
        output += `ending ${currentPlayer.name}'s game.`
      } else {
        output += `knocking ${currentPlayer.name} out of the game! `
        players.splice(currentPlayerIndex, 1);
      }
    }

    rounds++;
  }

  if (!isSolitaire) {
    output += `Which means that ${players[0].name} won the game!`
  }
  
  return output;
}