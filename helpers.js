const random = (min = 0, max = 1) => {
    return (Math.random() * (max - min)) + min;
}

const randomInt = (min = 0, max = 1) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const choose = (array) => {
    let choice;
    let tries = 0;
    while (choice == undefined && tries < 10) {
        choice = array[randomInt(0, array.length - 1)];
        tries++;
    }
    return (choice == undefined) ? array[0] : choice;
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