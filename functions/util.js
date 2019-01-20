const randomPop = (arr) => arr[Math.floor(Math.random() * arr.length)];
module.exports.randomPop = randomPop;

module.exports.hostingPath = (path) => `https://the-clapper-cd63b.firebaseapp.com/${path}`;

// common phrases
module.exports.sayOkay = () => randomPop(['Okay', 'Sure', 'Alright']);
