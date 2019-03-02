const { dialogflow, SimpleResponse, BasicCard, Image, Suggestions } = require('actions-on-google');
const functions = require('firebase-functions');
const { randomPop, sayOkay, hostingPath } = require('./util');

const app = dialogflow({ debug: true });

const clapperSuggestions = new Suggestions(['Turn on the lights', 'Power off my TV', '👏']);

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(
        `<speak><voice gender='male'><prosody rate='90%' pitch='-2st'>Pairing...</prosody></voice><break time='450ms' /></speak>`,
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

app.intent('actions_intent_NO_INPUT', (conv) => {
    conv.close(`Sorry, I couldn't hear what you just said.`);
});

app.intent(['Default Fallback Intent', 'Unrecognized Deep Link', 'clapper_connector'], (conv) => {
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

app.intent('self_destruct', (conv) => {
    const okayPhrase = sayOkay();
    conv.close(
        okayPhrase,
        new SimpleResponse({
            text: '5...4...3...2...1...',
            speech: `<speak><voice gender='male'><prosody rate='90%' pitch='-2st'><break time='1000ms' />5<break time='1000ms' />4<break time='1000ms' />3<break time='1000ms' />2<break time='1000ms' />1<break time='1000ms' /><audio src='${hostingPath('audio/clap-1.mp3')}' /><break time='1000ms' /></prosody></voice></speak>`,
        }),
        new BasicCard({
            image: new Image({ url: hostingPath('img/clap.png'), alt: '*clap* *clap*' }),
        }),
    );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
