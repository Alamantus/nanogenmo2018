const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../helpers');
const monsters = require('../../data/monsters');

module.exports = (story, generateTravel) => {
  let output = '';

  const fullParty = [story.protagonist, ...story.party];
  const averageLuck = fullParty.reduce((total, member) => total += member.stats.luck, 0) / fullParty.length;
  const averageViolence = fullParty.reduce((total, member) => total += member.stats.violence, 0) / fullParty.length;
  const averageBravery = fullParty.reduce((total, member) => total += member.stats.bravery, 0) / fullParty.length;
  const averageRationality = fullParty.reduce((total, member) => total += member.stats.rationality, 0) / fullParty.length;

  switch (story.currentLocation.type) {
    default: {
      switch (story.currentLocation.place.type) {
        default: {
          // if (!percentChance(averageLuck)) {
            const monster = Object.assign({}, choose(monsters));
            monster.type = 'enemy';
            const turnOrder = shuffle([monster, ...fullParty]);
            let willFight = false;
            output += `As they were walking, `;
            if (turnOrder[0].type == 'enemy') {
              output += `a ${monster.name} jumped out and attacked ${shuffle(fullParty)[0].name}!`;
              willFight = true;
            } else {
              output += `${turnOrder[0].name} saw a ${monster.name}! ${capitalize(turnOrder[0].pronoun.subject)} `;

              if (percentChance(turnOrder[0].stats.rationality)) {
                output += 'pointed it out to the others, ';
                if (percentChance(averageBravery) || percentChance(averageViolence)) {
                  output += 'and they decided to eliminate the threat.'
                  willFight = true;
                } else {
                  output += 'but they decided to avoid it to spare themselves any undue danger.'
                }
              } else {
                output += `kept it to ${turnOrder[0].pronoun.object}self, `
                if (percentChance(turnOrder[0].stats.violence) || percentChance(turnOrder[0].stats.bravery)) {
                  output += 'opting to run in and destroy it alone instead of alerting anyone else.';
                  willFight = true;
                } else {
                  output += 'deciding it was better to ignore the threat.'

                  if (percentChance(averageLuck)) {
                    output += ` Luckily, the party was able to avoid the ${monster.name} and move onward without any issues.`;
                  } else {
                    output += ` Unfortunately, the ${monster.name} spotted the party as they moved past and jumped out with an attack!`;
                    const monsterIndex = turnOrder.findIndex(character => character.type == 'enemy');
                    turnOrder.unshift(turnOrder.splice(monsterIndex, 1));
                    willFight = true;
                  }
                }
              }
            }

            if (willFight) {
              output += 'GENERATE FIGHT';
            } else {
              story.currentLocation.place = choose(story.currentLocation.places);
              output += '\n\n' + generateTravel(story, false);
            }
          // }
          
          break;
        }
      }
      break;
    }
  }

  return output;
}