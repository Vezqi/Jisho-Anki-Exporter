try {
    const ANKI_CONNECT_URL = 'http://localhost:8765'
    console.log(`[Jisho-Anki] Background running!`);

    chrome.extension.onConnect.addListener((port) => {
        console.log(`Connected to port: ${port.name}`);
        if (port.name === 'jisho-client') {
            port.onMessage.addListener(async (message) => {
                if(message.type === 'addNote') {
                    console.log(message);

                    let createdNote = await Anki.createNote(message);
                    
                    console.log(createdNote);
                    port.postMessage({
                        target: message.invoker,
                        result: createdNote.result,
                        error: createdNote.error
                    });
                }
            });
        }
    });

    class Anki {
        static async ping() {
            // ping and see if Anki is open.
            // Make sure that Anki is running and that you have AnkiConnect installed.
            let response = await fetch(ANKI_CONNECT_URL, {
                method: 'GET'
            });

            if(response.ok) {
                return true;
            } else {
                return false;
            }

        }

        static async checkForDeck() {
            let posted = await fetch(ANKI_CONNECT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'deckNames',
                    version: 6
                })
            });
    
            let responseJson = await posted.json();
            let parsedResult = responseJson.result;

            return parsedResult.includes('Jisho-Anki Exports');
        }

        static async createNote(entry) {
            let deckExists = await this.checkForDeck();
            let online = await this.ping();

            if(deckExists && online) {
                let audioFileName = entry.audio !== null ? entry.audio.split('/audio')[1] : null,
                    audioField = entry.audio !== null ? [{
                        url: entry.audio,
                        filename: audioFileName,
                        fields: ['Furigana']
                    }] : [];

                let body =  {
                    action: 'addNote',
                    version: 6,
                    params: {
                        note: {
                            deckName: 'Jisho-Anki Exports',
                            modelName: 'Basic',
                            fields: {
                                Front: entry.word,
                                Back: entry.definitions.map((def) => `${def.definition}・${def.type}`).join('<br>'),
                                Furigana: entry.furigana ?? '',
                                Other: entry.info.join(', ') ?? '',
                                Example: `${entry.sentence.jp ?? ''}<br>${entry.sentence.en ?? ''}`,
                            },
                            options: {
                                allowDuplicate: false,
                                duplicateScope: 'deck'
                            },
                            tags: ['jisho-anki-exporter'],
                            audio: audioField
                        }
                    }
                };

                let posted = await fetch(ANKI_CONNECT_URL, {
                    method: 'POST',
                    body: JSON.stringify(body)
                });

                let responseJson = await posted.json();
                return responseJson;

            }
        }

    }

} catch (e) {
    console.log(`An error occurred: ${e}`);
}