const { dialogflow, SimpleResponse, BasicCard, Image, Suggestions } = require('actions-on-google');
const functions = require('firebase-functions');
const { randomPop, sayOkay, hostingPath } = require('./util');

const app = dialogflow({ debug: true });

const clapperSuggestions = new Suggestions(['Turn on the lights', 'Power off my TV', '👏']);

app.intent('Default Welcome Intent', async (conv) => {
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

// 'Unrecognized Deep Link Fallback' *should* be an actual deeplink fallback but I cannot get it working despite following the docs (https://developers.google.com/actions/dialogflow/define-actions#handling_unrecognized_actions_when_users_invoke_your_action)
app.intent(['Default Fallback Intent', 'Unrecognized Deep Link Fallback', 'clapper_connector'], (conv) => {
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
