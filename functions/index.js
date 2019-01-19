const { dialogflow, SimpleResponse, BasicCard, Image, Suggestions } = require('actions-on-google');
const functions = require('firebase-functions');
const { randomPop, sayOkay } = require('./util');

const app = dialogflow({ debug: true });

const clapImage = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTA3LjIzNCA1MDcuMjM0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDcuMjM0IDUwNy4yMzQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMjUgMCAwIC0xLjI1IDAgNDUpIj4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBzdHlsZT0iZmlsbDojRUY5NjQ1OyIgZD0iTTE3LjczNy0yMTcuNzEzYzAsMC0xNS44NjEsMTQuNjg5LTEuMTcyLDMwLjU2MWMxNC42ODksMTUuODQ5LDMwLjU2MSwxLjE0OSwzMC41NjEsMS4xNDkNCgkJCQlsNzMuNjI2LTY4LjE5OGMtMS4xNjEsMS4wOTIsNS4xMiwxMC4wMDEsNC4xODcsMTAuODY2TDIyLjc0My0xNDguNjg0YzAsMC0xNS44NjEsMTQuNjg5LTEuMTcyLDMwLjUzOA0KCQkJCWMxNC43LDE1Ljg2MSwzMC41NjEsMS4xNzIsMzAuNTYxLDEuMTcybDk2LjExOS04OS4wMzFjLTAuMjI4LDAuMjA1LDYuOTI5LDguMzE3LDYuNzkzLDguNDQyTDQzLjYxLTk0LjM0NA0KCQkJCWMwLDAtMTUuODYxLDE0LjY4OS0xLjE3MiwzMC41NDljMTQuNywxNS44NDksMzAuNTYxLDEuMTYxLDMwLjU2MSwxLjE2MWwxMTEuNDIzLTEwMy4yMTljMC4xMzctMC4xMTQsNy43NzEsNy41NTUsNy45OTksNy4zMzkNCgkJCQlMODguMjY4LTYyLjA0MmMwLDAtMTUuODYxLDE0LjY4OS0xLjE3MiwzMC41NDljMTQuNywxNS44NDksMzAuNTYxLDEuMTYxLDMwLjU2MSwxLjE2MXM3Ny41MDUtNzEuNzk0LDExMC4xMjYtMTAyLjAwMg0KCQkJCWMzMi42MDktMzAuMjA4LDM5Ljk1OS0yMi4yNzgsMzkuOTU5LTIyLjI3OGwtMjkuNDQ2LDI3LjI3M2wtMzQuMDA4LDMxLjQ4MmMwLDAtMTUuODYxLDE0LjY4OS0xLjE2MSwzMC41NDkNCgkJCQljMTQuNywxNS44NzIsMzAuNTQ5LDEuMTgzLDMwLjU0OSwxLjE4M2w4Ny4yMzMtODAuODA1YzUyLjU0My00OC42NzQsNTUuNjk0LTEzMC43NDIsNy4wMDktMTgzLjI5Ng0KCQkJCWMtNDguNjc0LTUyLjU1NC0xMzAuNzUzLTU1LjY4My0xODMuMzA3LTcuMDJjLTIuNzc2LDIuNTcxLTcuNzYsNy41NDMtNy41NDMsNy43ODJsLTAuMzc1LTAuNDMyTDE3LjczNy0yMTcuNzEzeiIvPg0KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGREM1RDsiIGQ9Ik01MC43MzMtMTk1LjUzOGMwLDAtMTUuODYxLDE0LjY4OS0xLjE3MiwzMC41NDljMTQuNjg5LDE1Ljg3MiwzMC41NDksMS4xODMsMzAuNTQ5LDEuMTgzDQoJCQkJbDczLjYzNy02OC4yMjFjLTEuMTcyLDEuMDkyLDUuMTIsMTAuMDAxLDQuMTg3LDEwLjg2Nkw1NS43MzktMTI2LjUwOWMwLDAtMTUuODYxLDE0LjY4OS0xLjE3MiwzMC41NDlzMzAuNTQ5LDEuMTcyLDMwLjU0OSwxLjE3Mg0KCQkJCWw5Ni4xMTktODkuMDQyYy0wLjIxNiwwLjIxNiw2Ljk0LDguMzE3LDYuODA0LDguNDQyTDc2LjYwNi03Mi4xNTdjMCwwLTE1Ljg2MSwxNC42NzctMS4xNzIsMzAuNTM4czMwLjU0OSwxLjE3MiwzMC41NDksMS4xNzINCgkJCQlsMTExLjQyMy0xMDMuMjA4YzAuMTQ4LTAuMTM3LDcuNzcxLDcuNTMyLDcuOTk5LDcuMzI3TDEyMS4yNjMtMzkuODU2YzAsMC0xNS44NjEsMTQuNjg5LTEuMTcyLDMwLjUzOA0KCQkJCWMxNC42ODksMTUuODYxLDMwLjU0OSwxLjE3MiwzMC41NDksMS4xNzJzNzcuNTE3LTcxLjgwNSwxMTAuMTM3LTEwMi4wMTNjMzIuNTk3LTMwLjE5NywzOS45NTktMjIuMjY2LDM5Ljk1OS0yMi4yNjYNCgkJCQlsLTI5LjQ1NywyNy4yNzNMMjM3LjI4My03My42N2MwLDAtMTUuODQ5LDE0LjY4OS0xLjE3MiwzMC41NDljMTQuNywxNS44NjEsMzAuNTYxLDEuMTcyLDMwLjU2MSwxLjE3Mmw4Ny4yMjItODAuNzk0DQoJCQkJYzUyLjU1NC00OC42NzQsNTUuNjk0LTEzMC43NTMsNy4wMi0xODMuMjk2Yy00OC42ODYtNTIuNTU0LTEzMC43NTMtNTUuNjk0LTE4My4zMDctNy4wMDljLTIuNzg4LDIuNTYtNy43Niw3LjUzMi03LjU0Myw3Ljc2DQoJCQkJbC0wLjM4Ny0wLjQzMkw1MC43MzMtMTk1LjUzOHoiLz4NCgkJCTxnPg0KCQkJCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkFDMzM7IiBkPSJNMjc3LjMxLTM3LjQ4OWMtMi40MjMsMC00Ljg4MSwwLjc3NC02Ljk0LDIuMzY3Yy00Ljk4MywzLjg0Ni01Ljg5NCwxMC45OTEtMi4wNDgsMTUuOTYzDQoJCQkJCWwzMy44OTQsNDMuODYxYzMuODEyLDQuOTcyLDEwLjk2OCw1LjkwNSwxNS45NTIsMi4wNDhjNC45NzItMy44MzQsNS44ODItMTAuOTgsMi4wNDgtMTUuOTUybC0zMy44OTQtNDMuODYxDQoJCQkJCUMyODQuMDkxLTM1Ljk2NCwyODAuNzIzLTM3LjQ4OSwyNzcuMzEtMzcuNDg5Ii8+DQoJCQkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQUMzMzsiIGQ9Ik0yMTQuMjY1LTQzLjY0NGMtNi4yODEsMC0xMS4zNzgsNS4wOTctMTEuMzc4LDExLjM3OHY1Ni44ODljMCw2LjI4MSw1LjA5NywxMS4zNzgsMTEuMzc4LDExLjM3OA0KCQkJCQljNi4yOTIsMCwxMS4zNzgtNS4wOTcsMTEuMzc4LTExLjM3OHYtNTYuODg5QzIyNS42NDMtMzguNTQ3LDIyMC41NTctNDMuNjQ0LDIxNC4yNjUtNDMuNjQ0Ii8+DQoJCQkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQUMzMzsiIGQ9Ik0zMjEuNDEtNzMuOTg5Yy00LjY0MiwwLTkuMDExLDIuODY3LTEwLjY4NCw3LjQ5OGMtMi4xNjIsNS45MDUsMC44OTksMTIuNDI1LDYuNzkzLDE0LjU3NQ0KCQkJCQlsNTIuMTQ0LDE4Ljk2N2M1LjkyOCwyLjE1LDEyLjQzNi0wLjkxLDE0LjU3NS02LjgwNGMyLjE2Mi01LjkwNS0wLjg5OS0xMi40MzYtNi43OTMtMTQuNTg2bC01Mi4xNDQtMTguOTU1DQoJCQkJCUMzMjQuMDE2LTczLjc2MSwzMjIuNjk2LTczLjk4OSwzMjEuNDEtNzMuOTg5Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==';

app.intent('Default Welcome Intent', (conv) => {
    // CHANGEME need text here (and need to break up "pairing" and "connected" speech bubbles.)
    // CANGEME also play with this audio a bit more. Maybe slow down the "Pairing" line? And try different voices
    const connectedPhrase = `Connected!  \n${randomPop(['What would you like me to do?', 'What can I do for you?'])}`;
    conv.ask(
        new SimpleResponse({
            text: 'Pairing...',
            speech: `<speak>
                <voice gender="male">Pairing</voice>
                <break time="500ms" />
                <voice gender="female">${connectedPhrase}</voice>
            </speak>`,
        }),
        connectedPhrase,
        new Suggestions(['Turn on the lights', 'Power off my TV', '👏']),
    );
});

app.intent('help', (conv) => {
    conv.ask(
        'Greetings, I can connect automatically to any compatible devices in the area. Just tell me what to do.',
        new Suggestions(['Turn on the lights', 'Power off my TV']),
    );
});

app.intent(['Default Fallback Intent', 'clapper_connector'], (conv) => {
    conv.close(
        new SimpleResponse({
            text: sayOkay(),
            // CHANGEME needs to be a soundbite
            speech: `<speak>CHANGEME clap clap</speak>`,
        }),
        new BasicCard({
            // CHANGEME need to upload this image I guess (also, why it it yelling at me about "accessibilityText"?)
            image: new Image({ url: clapImage, alt: '*clap* *clap*' }),
        }),
    );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
