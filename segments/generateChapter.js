const {randomInt, percentChance, choose, capitalize} = require('../helpers');
const generateIntro = require('./generateIntro');
const generateTravel = require('./generateTravel');

module.exports = (story, isEnding = false) => {
    const quoteRace = choose(global.races);
    const quoteLanguage = quoteRace.language;
    let quote = `"${quoteLanguage.generateSentence()}"`
        + `\n―${quoteLanguage.generateName()} ${quoteLanguage.generateName()}, `
        + `${choose(['grand', 'great', 'beloved', 'ancient', 'wise'])} ${quoteRace.name} `
        + `${choose(['sage', 'warrior', 'lorebearer', 'bard', 'arbiter', 'poet', 'king', 'queen', 'ruler'])}`;

    let output = '';

    if (!isEnding) {
        output += 'Chapter ' + story.chapterNumber;
    } else {
        output += story.title;
    }
    output += '\n\n~~~~~~~~\n' + quote + '\n~~~~~~~~\n\n';

    let typeOfChapter = story.chapterNumber == 1 ? 'beginning' : 'normal';
    // if (story.numberOfWords > 20000) typeOfChapter = 'middle';
    // if (story.numberOfWords > 40000) typeOfChapter = 'ending';
    if (isEnding) typeOfChapter = 'ending';

    switch (typeOfChapter) {
        default: {
            output += generateTravel(story);
            break;
        }
        case 'beginning': {
            output += generateIntro(story);
            break;
        }
        // case 'ending': {
        //     break;
        // }
    }

    story.chapterNumber++;
    return output;
}