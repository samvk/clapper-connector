const randomPop = (arr) => arr[Math.floor(Math.random() * arr.length)];
module.exports.randomPop = randomPop;

// common phrases
module.exports.sayOkay = () => randomPop(['Ok', 'Sure', 'Alright']);
