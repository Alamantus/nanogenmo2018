const random = (min = 0, max = 1) => {
    return (Math.random() * (max - min)) + min;
}

const randomInt = (min = 0, max = 1) => {
    return Math.round(random(min, max));
}

const choose = (array) => {
    let choice;
    while (choice == undefined) {
        choice = array[randomInt(0, array.length - 1)];
    }
    return choice;
}

const shuffle = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
}

const percentChance = (percent) => {
    return random(0, 100) < percent;
}

const capitalize = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

const capitalizeWords = (string) => {
    return string.split(' ').map(word => capitalize(word)).join(' ');
}

const firstLetterIsVowel = (string) => {
    return ['a', 'e', 'i', 'o', 'u'].includes(string.substr(0, 1).toLowerCase());
}

const correctArticle = (string) => {
    return 'a' + (firstLetterIsVowel(string) ? 'n' : '');
}

module.exports = {
    random,
    randomInt,
    choose,
    shuffle,
    percentChance,
    capitalize,
    capitalizeWords,
    firstLetterIsVowel,
    correctArticle,
};