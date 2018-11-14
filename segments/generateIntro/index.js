const {randomInt, percentChance, choose, capitalize} = require('../../helpers');

const friendReply = require('./friendReply');

module.exports = (story) => {
    let output = '';

    switch (story.storyType) {
        case ('quest'): {
            output += `A storm has been brewing in the dark realm of ${story.evilPlaceName}. Rumors of ${story.antagonist.fullName}, ${story.antagonist.title}, building a fierce army have been spreading, and the realm of ${story.worldName} was stricken with fear. `;
            break;
        }
        case ('rescue'): {
            output += `${story.antagonist.fullName}, ${story.antagonist.title}, sent ${story.antagonist.pronoun.possessive} army down upon the people of ${story.worldName} in a fury, crushing the capital and taking over without mercy. `;
            break;
        }
        case ('revenge'):
        case ('restoration'): {
            output += `When ${story.antagonist.fullName}, ${story.antagonist.title}, overtook the citadel of ${story.evilPlaceName} with ${story.antagonist.pronoun.possessive} horrible army, ${story.worldName} suffered a horrible loss. `;
            break;
        }
    }

    switch (story.protagonist.weaponExperience) {
        case 'master': {
            output += `The ${story.storyType == 'rescue' ? 'former ' : ''}${story.rulerTitle} of ${story.worldName} sent out a ${story.storyType == 'rescue' ? 'plea' : 'request'} for aid to the renowned ${story.protagonist.weapon.name}master, ${story.protagonist.fullName}.`
            break;
        }
        case 'learner': {
            output += `${story.protagonist.fullName}, a fledgling ${story.protagonist.weapon.name}-learner, was in ${story.protagonist.pronoun.possessive} cosy ${story.protagonist.homeType} when they heard about the ${story.storyType == 'quest' ? 'threat' : 'treachery'} of ${story.antagonist.title}, ${story.antagonist.fullName}, and ${story.protagonist.pronoun.subject} felt a drive to do something about it.`
            break;
        }
        case 'user': {
            output += `News about ${story.antagonist.fullName}, ${story.antagonist.title}, reached the ${story.protagonist.homeland} of ${story.protagonist.fullName} slowly over a series of updates. Feeling sympathetic toward the plight of ${story.worldName}, the ${story.protagonist.weapon.name} warrior set out to help.`
            break;
        }
    }

    output += `\n\n`;
    output += `${story.protagonist.name} was ${story.protagonist.describe()} and was a ${story.protagonist.weaponExperience} of the ${story.protagonist.weapon.name}. `;
    output += `Knowing that ${story.antagonist.title} and ${story.antagonist.pronoun.possessive} army could never be defeated alone, ${story.protagonist.name} decided that ${story.protagonist.pronoun.subject} will need at least ${story.party.length} other brave soul${story.party.length == 1 ? '' : 's'} to assist ${story.protagonist.pronoun.object}. `;
    
    const friendPartyMembers = story.party.filter(member => member.knowsProtagonist);
    const strangerPartyMembers = story.party.filter(member => !member.knowsProtagonist);

    let travelVerb;
    switch (story.protagonist.personality) {
        default: {
            travelVerb = 'headed over';
            break;
        }
        case 'sweet': {
            travelVerb = 'skipped';
            break;
        }
        case 'kind': {
            travelVerb = 'ran';
            break;
        }
        case 'mean': {
            travelVerb = 'stomped';
            break;
        }
        case 'salty': {
            travelVerb = 'meandered';
            break;
        }
    }

    if (friendPartyMembers.length > 0) {
        output += `Fortunately, ${story.protagonist.pronoun.subject} knew ${story.protagonist.pronoun.subject} could count on at least ${friendPartyMembers.length} friend${friendPartyMembers.length == 1 ? '' : 's'} to come help ${story.protagonist.pronoun.object} on ${story.protagonist.pronoun.possessive} journey.`;
        output += '\n\n';

        friendPartyMembers.forEach((friend, index) => {
            if (index !== 0 && index !== friendPartyMembers.length - 1) {
                output += 'Next, ';
            } else if (index !== 0 && index === friendPartyMembers.length - 1) {
                output += 'Finally, ';
            }

            output += `${story.protagonist.name} ${travelVerb} to ${friend.name}, the ${friend.race.name} ${friend.weapon.name}-${friend.weaponExperience}'s, ${friend.homeType} to request their assistance. `;

            output += friendReply(friend, story);
        });
    }

    if (friendPartyMembers.length > 0 && strangerPartyMembers.length > 0) {
        output += `While ${friendPartyMembers.length} friend${friendPartyMembers.length == 1 ? '' : 's'} is great, ${story.protagonist.name} knew that ${story.protagonist.pronoun.subject} still needed ${strangerPartyMembers.length} more ${strangerPartyMembers.length == 1 ? 'person' : 'people'} to help. `;
    }
    
    if (strangerPartyMembers.length > 0) {
        const meetingPlace = choose(['tavern', 'bar', 'park', 'plaza', 'gathering place']);
        output += `So ${story.protagonist.name} ${travelVerb} to ${story.protagonist.pronoun.possessive} local ${meetingPlace} ${friendPartyMembers.length > 0 ? `with ${story.protagonist.pronoun.possessive} friend${friendPartyMembers.length == 1 ? '' : 's '}` : ''}to find some more assistance.`
        output += `\n\n${friendPartyMembers.length > 0 ? story.protagonist.name : capitalize(story.protagonist.pronoun.subject)} moved to the center of the ${meetingPlace} and announced, "${story.protagonist.introduce()} `;

        switch (story.protagonist.personality) {
            default: {
                output += `I intend to help the people of ${story.worldName}, and ${friendPartyMembers.length > 0 ? 'we' : 'I'} need ${friendPartyMembers.length > 0 ? 'more' : 'some'} assistance to do this."`;
                break;
            }
            case 'sweet':
            case 'kind': {
                output += `I have heard of ${story.antagonist.fullName}'s ${story.storyType == 'quest' ? 'threat' : 'treachery'}, and I want to do something to help ${story.worldName}! ${friendPartyMembers.length > 0 ? 'we' : 'I'} need ${friendPartyMembers.length > 0 ? 'more' : 'some'} friends to help ${friendPartyMembers.length > 0 ? 'us' : 'me'}!"`;
                break;
            }
            case 'mean':
            case 'salty': {
                output += `I can't stand the thought of living under ${story.antagonist.title}'s reign, and ${friendPartyMembers.length > 0 ? 'we' : 'I'} want to do something to stop ${story.antagonist.pronoun.object}. Who here will help ${friendPartyMembers.length > 0 ? 'us' : 'me'}?"`;
                break;
            }
        }

        output += '\n\n';
        
        strangerPartyMembers.forEach((stranger, index) => {
            if (index !== 0 && index !== friendPartyMembers.length - 1) {
                output += 'Next, ';
            } else if (index !== 0 && index === friendPartyMembers.length - 1) {
                output += 'Finally, ';
            }

            output += `${capitalize(stranger.describe())} stood and said, "${stranger.introduce()} I am a ${stranger.weaponExperience} of the ${stranger.weapon.name}."`;

            output += '\n\n';

            output += friendReply(stranger, story, false);
        });
    }

    output += `Having gathered enough friends to begin ${story.protagonist.pronoun.possessive} journey, ${story.protagonist.name} sets out from ${story.protagonist.pronoun.possessive} ${story.currentLocation.size} and ${story.currentLocation.description} home in the ${story.currentLocation.specifier} with ${story.protagonist.pronoun.possessive} newly-assembled party to brave the dangers on the way to the lair of ${story.antagonist.title}...`;
    
    return output + '\n\n';
}