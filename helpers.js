const random = (min = 0, max = 1) => {
    return (Math.random() * (max - min + 1)) + min;
}

const randomInt = (min = 0, max = 1) => {
    return Math.floor(random(min, max));
}

const percentChance = (percent) => {
    return random(0, 100) < percent;
}

const capitalize = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

const capitalizeWords = (string) => {
    return string.split(' ').map(word => capitalize(word)).join('');
}

module.exports = {
    random,
    randomInt,
    percentChance,
    capitalize,
    capitalizeWords,
};