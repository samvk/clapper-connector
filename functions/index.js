const { dialogflow, SimpleResponse, BasicCard, Image, Suggestions } = require('actions-on-google');
const functions = require('firebase-functions');
const { randomPop, sayOkay, hostingPath } = require('./util');

const app = dialogflow({ debug: true });

const clapperSuggestions = new Suggestions(['Turn on the lights', 'Power off my TV', '👏']);

// CHANGEME need to have all deeplinks trigger fallback intent
app.intent('Default Welcome Intent', async (conv) => {
    conv.ask(
        `<speak><voice gender='male'><prosody rate='90%' pitch='-2st'>Pairing...</prosody></voice><break time='400ms' /></speak>`,
        `<speak><voice gender='female'>Connected!  \n${randomPop(['What would you like me to do?', 'What can I do for you?'])}</voice></speak>`,
        clapperSuggestions,
    );
});

app.intent('help', (conv) => {
    conv.ask(
        'Greetings, I can connect automatically to any compatible devices in the area. Just tell me what to do.',
        clapperSuggestions,
    );
});

app.intent(['Default Fallback Intent', 'clapper_connector'], (conv) => {
    const okayPhrase = sayOkay();
    conv.close(
        new SimpleResponse({
            text: okayPhrase,
            speech: `<speak>${okayPhrase}!<break time='450ms' /><audio src='${hostingPath('audio/clap-1.mp3')}' /><break time='300ms' /></speak>`,
        }),
        new BasicCard({
            image: new Image({ url: hostingPath('img/clap.png'), alt: '*clap* *clap*' }),
        }),
    );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
