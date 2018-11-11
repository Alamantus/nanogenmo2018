const {randomInt, percentChance, choose, capitalize} = require('../helpers');
const generateIntro = require('./generateIntro');

module.exports = (story) => {
    const quoteRace = choose(global.races);
    const quoteLanguage = quoteRace.language;
    let quote = `"${quoteLanguage.generateSentence()}"`
        + `\n―${quoteLanguage.generateName()} ${quoteLanguage.generateName()}, `
        + `${choose(['grand', 'great', 'beloved', 'ancient', 'wise'])} ${quoteRace.name} `
        + `${choose(['sage', 'warrior', 'lorebearer', 'bard', 'arbiter', 'poet', 'king', 'queen', 'ruler'])}`;

    let output = 'Chapter ' + story.chapterNumber + '\n\n~~~~~~~~\n' + quote + '\n~~~~~~~~\n\n';

    let typeOfChapter = story.chapterNumber == 1 ? 'beginning' : 'normal';
    // if (story.numberOfWords > 20000) typeOfChapter = 'middle';
    if (story.numberOfWords > 40000) typeOfChapter = 'ending';

    switch (typeOfChapter) {
        default: {
            const location = choose(global.locations);
            location.name = choose(global.races).language.generateName();
            const place = choose(location.places);
            let action;
            switch (randomInt(0, 2)) {
                case 0: {
                    action = 'walking through';
                    break;
                }
                case 1: {
                    action = 'exploring';
                    break;
                }
                case 2: {
                    action = 'traveling through';
                    break;
                }
            }

            output += percentChance(50) ? 'We find our heroes ' : 'Our heroes are ';
            output += `${action} the ${place} of ${location.name} ${location.type}.`;
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