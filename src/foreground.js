const port = chrome.extension.connect({
    name: 'jisho-client'
});

console.log('[Jisho-Anki-Client] Running!');

// Add a button to each entry on the page. 
document.querySelectorAll(".concept_light-status").forEach((element, index) => {
    element.insertAdjacentHTML('beforeend', `<div class='anki-export-button-${index}' style='font-size: 14px;'><a>Export to Anki</a></div>`);
});
// Get an array of all buttons that we just created.
let buttons = document.querySelectorAll(`div[class^='anki-export-button']`);

// This loop is responsible for adding an event listener for all export buttons on the page.

buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        let button = event.currentTarget;
        let note = new Note(button).getFormatted();
        port.postMessage(note);
    });
});

port.onMessage.addListener((message) => {
    let successType = message.error === null ? '✓' : '❌';
    document.querySelector(`.${message.target}`).innerText = `Export to Anki ${successType}`;

    if(message.error) {
        console.log(`Unable to create card: ${message.error}`);
    } else if(message.result) {
        console.log(`Card successfully created: ${message.result}`);
    }

});

// Need to figure out how to isolate Note by itself.
// We can add a method that gets the button's className. That way, we can send it to the server, and then send a message back to the client, GET the button's name and update the text to indicate success/failure.
class Note {

    constructor(button) {
        this._button = button;
        if(!button) {
            console.error('Button not provided to constructor.');
        }
    }

    getWord() {
        return this._button.parentElement.parentElement.getElementsByClassName('text')[0].innerText
    }

    getDefinitions() {
        let definitions = [];
        let defs = this._button.parentElement.parentElement.parentElement.querySelector('[class^=meanings-wrapper]').children;
        for(var i = 0; i < defs.length - 1; i += 2) {
            let type = defs[i].innerText,
                children = Array.from(defs[i+1].children[0].children),
                meanings = children.map((child) => child.innerText.trim()).join(' ').trim().replace('Read more', '');

            definitions.push({
                type: type,
                definition: meanings
            });
        }

        return definitions;

    }

    getInfo() {
        return Array.from(this._button.parentElement.querySelectorAll('[class^=concept_light-tag]'))
                    .map((c) => c.innerText);
    }

    getAudioUrl() {
        return this._button.parentElement.querySelector('audio')?.firstElementChild?.src || null;
    }

    getFirstExample() {
        return {
            en: this._button.parentElement.parentElement.parentElement.querySelector('[class^="japanese japanese_gothic clearfix"]') !== null
                ? Array.from(this._button.parentElement.parentElement.parentElement
                       .querySelector('[class^="japanese japanese_gothic clearfix"]').children)
                       .filter((child) => child.className === 'english')[0].innerText
                : null,
            jp: this._button.parentElement.parentElement.parentElement.querySelector('[class^="japanese japanese_gothic clearfix"]') !== null 
                ? Array.from(this._button.parentElement.parentElement.parentElement.querySelector('[class^="japanese japanese_gothic clearfix"]')
                       .querySelectorAll('span[class^=unlinked]'))
                       .map((child) => child.innerText).join('') + '。' 
                : null
        }
    }

    getFurigana() {
        let kanjiFurigana = this._button.parentElement.parentElement.querySelector('[class^="furigana"]').innerText,
            charsToReplace = this._button.parentElement.parentElement.querySelector('[class^="text"]').firstChild.wholeText.trim(),
            furigana = charsToReplace.replace(charsToReplace, kanjiFurigana) + this.getWord().replace(charsToReplace, '');
        return furigana;
    }

    getInvoker() {
        return this._button.className;
    }

    // Should we store these values in fields so that 'this' can reference these fields?
    getFormatted() {
        return {
            word: this.getWord(),
            furigana: this.getFurigana(),
            definitions: this.getDefinitions(),
            audio: this.getAudioUrl(),
            info: this.getInfo(),
            sentence: this.getFirstExample(),
            invoker: this.getInvoker(),
            type: 'addNote'
        };
    }

}

