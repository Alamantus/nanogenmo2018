const {randomInt, percentChance, choose, capitalize} = require('../helpers');

module.exports = (story) => {
    let output = '';

    switch (story.storyType) {
        case ('quest'): {
            output += `A storm has been brewing in the dark realm of ${story.evilPlaceName}. Rumors of ${story.antagonist.fullName}, ${story.antagonist.title}, building a fierce army have been spreading, and the realm of ${story.worldName} has been stricken with fear.`;
            break;
        }
        case ('rescue'): {
            output += `${story.antagonist.fullName}, ${story.antagonist.title}, sent ${story.antagonist.pronoun.possessive} army down upon the people of ${story.worldName} in a fury, crushing the capital and taking over without mercy.`;
            break;
        }
        case ('revenge'):
        case ('restoration'): {
            output += `When ${story.antagonist.fullName}, ${story.antagonist.title}, overtook the citadel of ${story.evilPlaceName} with ${story.antagonist.pronoun.possessive} horrible army, ${story.worldName} suffered a horrible loss.`;
            break;
        }
    }

    output += `\n\n`;
    output += `${capitalize(story.protagonist.describe())} steps up and says, "${story.protagonist.introduce()}"`
        + `\n\nBut ${story.antagonist.describe()} stands in ${story.protagonist.pronoun.possessive} way and says, "${story.antagonist.introduce()}"`;
    
    return output + '\n\n';
}