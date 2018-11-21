const {randomInt, percentChance, choose, shuffle, capitalize} = require('../../helpers');

const Character = require('../../classes/Character');
const monsters = require('../../data/monsters');
const generateFight = require('../generateFight');

module.exports = (story) => {
    let output = '';

    switch (story.storyType) {
        default:
        case 'quest': {
            output += `After much long and arduous travel, ${story.protagonist.name} and ${story.protagonist.pronoun.possessive} friends finally reached the ${percentChance(50) ? 'wretched' : 'evil'} realm of ${story.evilPlaceName}. `;
            const averageHPPercent = story.averageHP / story.averageMaxHP;
            output += `The ${averageHPPercent > 0.5 ? 'well-prepared' : 'battered and bruised'} party surveyed the army of ${story.antagonist.fullName} ${story.antagonist.title} arrayed before them, ${percentChance(story.averageBravery) ? 'but the fearsome sight did not drive them away' : 'and they were terrified by the fearsome sight'}. `;
            output += `Though they felt great fear, our heroes knew that they needed to face ${story.antagonist.title} and put an end to the danger ${story.antagonist.pronoun.subject} posed to ${story.worldName}. `;
            break;
        }
    }

    const enemyBuilding = choose(['castle', 'fortress', 'stronghold', 'dungeon']);
    
    const approachType = choose(['sneak', 'rush']);

    switch (approachType) {
        default:
        case 'sneak': {
            output += `Taking special care not to be seen, the party makes their way into the shadows to avoid being seen by ${story.antagonist.title}'s army. `;

            // if (percentChance(story.averageRationality)) {
            if (percentChance(story.averageRationality)) {
                output += `With much care and patience, they made their way to the ${enemyBuilding} without being spotted. `;
            } else {
                const numberOfEnemies = percentChance(story.averageLuck) ? 1 : randomInt(1, 3);
                const enemies = [];
                for (let i = 0; i < numberOfEnemies; i++) {
                    const enemy = new Character('bad', {maxHP: randomInt(8, 12)});
                    enemy.name = `the ${enemy.gender} ${enemy.race.name} in the ${enemy.clothing.torso.color} ${enemy.clothing.torso.type}`;
                    enemy.isEnemy = true;
                    enemies.push(enemy);
                }
                const turnOrder = shuffle([...enemies, ...story.fullParty]);
                output += `The party made their way to the ${enemyBuilding}, but were spotted by ${enemies.map(enemy => enemy.describe()).join(' and ')}. ${enemies.length > 1 ? 'They' : capitalize(enemies[0].pronoun.subject)} ran to intercept the party and prevent them from continuing forward!`;
                output += '\n\n' + generateFight(shuffle(turnOrder), {
                    winText: `Looking about them to make sure they could hide better, the party moved on.`,
                    loseText: `The party scattered and hid to avoid taking any more damage. When the coast was clear, they regrouped and continued onward.`,
                });
            }

            break;
        }
    }

    if (story.averageHP < (story.averageMaxHP / 2)) {
        output += `Our heroes were tired after their fights, so they decided to sit and rest in a secluded area to recover before storming the ${enemyBuilding}. `;
        const healer = choose(story.fullParty);
        const healAmount = randomInt(story.averageMaxHP / 2, story.averageMaxHP);
        const healFeeling = (story.averageMaxHP + (story.averageMaxHP / 2)) / 2 >= healAmount ? 'a lot' : 'a little bit';
        output += `${healer.name} ${choose(['passed around some food', 'said a prayer', 'led the party in meditation', 'did some breathing exercises with the others'])}, and the party felt ${healFeeling} better.`
        story.healParty(healAmount);
    }

    const obstacle = choose([/* 'puzzle', 'lock',  */'guard']);
    output += `\n\nWhen they finally reached the entrance of the ${enemyBuilding}, they were met with a ${obstacle}: `;
    switch (obstacle) {
        default:
        case 'guard': {
            const guard = percentChance(50) ? new Character('bad') : Object.assign({}, choose(monsters));
            guard.hp = randomInt(40, 60);
            if (guard.hasOwnProperty('maxHP')) guard.maxHP = guard.hp;
            if (guard.hasOwnProperty('weapon')) {
                guard.weapon.minDamage *= story.fullParty.length;
                guard.weapon.maxDamage *= story.fullParty.length;
                guard.weapon.accuracy += 15;
                guard.weapon.name = `${choose(['wicked', 'evil', 'giant, bloody', 'horrible'])} ${guard.weapon.name}`;
            } else {
                guard.minDamage *= story.fullParty.length;
                guard.maxDamage *= story.fullParty.length;
                guard.accuracy += 30;
                guard.attack = `${choose(['terrible', 'horrifying', 'wicked', 'nasty', 'terrifying', 'evil'])} ${guard.attack}`;
            }
            guard.name = guard.hasOwnProperty('personality') ? `the ${guard.gender} ${guard.race.name}` : 'giant ' + guard.name;
            guard.isEnemy = true;
            output += `${guard.hasOwnProperty('personality') ? guard.describe() + ' holding a ' + guard.weapon.name : 'a ' + guard.name} standing in the way! `;

            let turnOrder;
            if (percentChance(story.averageLuck)) {
                turnOrder = [...story.fullParty, guard];
                output += `They quickly hid in the shadows before they were spotted and waited until ${guard.name.includes('the') ? guard.name : 'the ' + guard.name} turned its back.`;
            } else {
                turnOrder = [guard, ...story.fullParty];
                output += `${capitalize(guard.name.includes('the') ? guard.name : 'the ' + guard.name)} spotted them as they approached and quickly moved into a defensive possition to protect the door.`;
            }

            output += '\n\n' + generateFight(turnOrder, {
                canRun: false,
                winText: `${choose(story.fullParty).name} then stood watch while the rest of the party got through the door.`,
                loseText: `With a burst of divine light, ${choose(story.fullParty).name} cried out, and ${guard.name.includes('the') ? guard.name : 'the ' + guard.name} was suddenly gone! Stunned but not surprised, the party entered the ${enemyBuilding}.`,
            });
            break;
        }
    }

    output += `\n\nThe inside of the ${enemyBuilding} was ${choose(['large', 'cramped', 'damp', 'musty', 'narrow'])} and ${choose(['terrifying', 'imposing', 'fiery', 'unsettling'])}. `;
    output += `After wandering around for a while, our heroes finally came face to face with ${story.antagonist.title} ${story.antagonist.pronoun.subject}self, ${story.antagonist.fullName}! ${story.antagonist.describe(true)} stood with ${story.antagonist.pronoun.possessive} ${story.antagonist.weapon.name}, pointing it at ${story.protagonist.name}.`;
    output += `\n\n"You must be ${story.protagonist.fullName}, the thorn in my side I have been hearing about! ${story.antagonist.introduce()} Prepare to die!" ${story.antagonist.name} bellowed.`;

    // Respond to antagonist.
    
    output += '\n\n' + generateFight(shuffle([story.antagonist, ...story.fullParty]), {
        limitTurns: false,
        canRun: false,
        winText: `And with that, our heroes had struck the last blow against ${story.antagonist.title}. `,
        loseText: `The whole party had fallen, and with a haughty sneer, ${story.antagonist.title} cast ${story.antagonist.pronoun.possessive} ${story.antagonist.weapon.name} aside and turned back to where  ${story.antagonist.pronoun.subject} had been sitting when our heroes had arrived. They were defeated.`,
    });

    if (output.substr(-9) == 'defeated.') {
        output += `\n\nBut ${story.protagonist.name} stirred, struggling to ${story.protagonist.pronoun.possessive} feet, leaning against ${story.protagonist.pronoun.possessive}  ${story.protagonist.weapon.name}. `;
        output += `Feebly reaching out, ${story.protagonist.pronoun.subject} stretched out ${story.protagonist.pronoun.possessive} hand toward ${story.antagonist.title} ${story.antagonist.fullName}. `;
        output += `The sneering smile dropped as ${story.antagonist.name} watched a growing glimmer of light gather in ${story.protagonist.name}'s hand, ${story.antagonist.pronoun.possessive} eyes filling with horror.`;
        output += `\n\n"No! This is impossible! The ${story.protagonist.race.languageName} magics are just a myth!" ${story.antagonist.pronoun.subject} cried out as the light shot out from ${story.protagonist.name}'s hand, directly into ${story.antagonist.name}'s chest.`;
        output += `\n\n"Nooooooo!!!" ${story.antagonist.fullName}, ${story.antagonist.title}, screamed as they were burned away to dust.`;
        output += `\n\nAnd with that, ${story.protagonist.fullName}, the ${story.protagonist.weaponExperience} of the ${story.protagonist.weapon.name}, our great hero, let out their last breath and collapsed to the floor. ${capitalize(story.protagonist.pronoun.possessive)} final act of sacrifice `;
    } else {
        const survivors = story.fullParty.filter(character => character.hp > 0);
        const dead = story.fullParty.filter(character => character.hp <= 0);
        const numberDead = dead.length;
        if (numberDead > 0) {
            output += `${survivors.join(' and ')} looked ${numberDead > 1 ? 'around' : 'down'} at their fallen friend${numberDead > 1 ? 's' : ''} and wept. `;
            if (dead.findIndex(character => character.fullName == story.protagonist.fullName) > -1) {
                output += `Among the dead was ${story.protagonist.fullName}, the ${story.protagonist.weaponExperience} of the ${story.protagonist.weapon.name}, our great hero. `;
            }
            output += `${survivors.length > 1 ? 'They' : capitalize(survivors[0].pronoun.subject)} made a makeshift cart to carry ${survivors.length > 1 ? 'their' : survivors[0].pronoun.possessive} beloved friend${numberDead > 1 ? 's' : ''} and began the grueling trek back home. `;
            output += `Though ${survivors.length > 1 ? 'they' : survivors[0].pronoun.subject} had won, ${survivors.length > 1 ? 'they' : survivors[0].pronoun.subject} had paid a great price. But in the end, our heroes `;
        } else {
            output += `Grateful for their good fortune, our heroes collected themselves up and basked in the glory of their victory. Our glorious, shining heroes `;
        }
    }

    output += `had saved the land of ${story.worldName}, and the dark realm of ${story.evilPlaceName} was freed of its curse.`;

    output += '\n\nTHE END'
    
    return output;
}