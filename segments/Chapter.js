const {capitalize} = require('../helpers');

module.exports = (story) => {
    let output = `${capitalize(story.protagonist.describe())} steps up and says, "${story.protagonist.introduce()}"`
        + `\n\nBut ${story.antagonist.describe()} stands in ${story.protagonist.pronoun.possessive} way and says, "${story.antagonist.introduce()}"`
        + '\n\n' + story.protagonist.race.language.generateSentence(null, null, story.protagonist.name);

    return output;
}