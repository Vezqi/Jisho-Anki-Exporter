# Jisho-Anki Exporter

- This is a Chrome extension that I was commissioned to do that adds a button to dictionary entries on [jisho.org](https://jisho.org/) to export terms and related info to an Anki deck.

![Image](https://i.imgur.com/2ltozuT.png)

# Installation

- Requires [AnkiConnect](https://ankiweb.net/shared/info/2055492159) to be installed as an add-on in Anki.
- Requires the provided Anki [template deck](https://github.com/Vezqi/Jisho-Anki-Exporter/blob/master/Jisho-Anki%20Exports.apkg).

1) Download the contents of this repository and open the template deck in Anki.
2) Create a new folder anywhere on your PC, name it whatever you want, and add the `src` directory from the .zip as well as the `manifest.json` file.
3) If not enabled already, navigate over to `chrome://extensions` and then toggle developer mode on the right hand side, enabling it.
4) On the left side of the page, click the button indicating "load an unpacked extension", and then locate the folder you just created and select it.
5) Head on over to [jisho.org](https://jisho.org), search for a word, export the word to a deck, and it should work! Just make sure Anki is running and that you have AnkiConnect installed! 

If you are would like to load a **release** version:

- Make sure you have [AnkiConnect](https://ankiweb.net/shared/info/2055492159) installed as an add-on in Anki.
- Make sure you have the provided Anki [template deck](https://github.com/Vezqi/Jisho-Anki-Exporter/blob/master/Jisho-Anki%20Exports.apkg) imported into Anki.

1) Download the latest [release](https://github.com/Vezqi/Jisho-Anki-Exporter/releases) from this repository.
2) Extract the contents of the release folder to anywhere on your PC.
3) If not enabled already, navigate over to `chrome://extensions` and then toggle developer mode on the right hand side, enabling it.
4) On the left side of the page, click the button indicating "load an unpacked extension", and then locate the release folder and select it.
5) Head on over to [jisho.org](https://jisho.org), search for a word, and you should now see a button on the left hand side of each entry to export it to Anki.

Please keep in mind that this will only add cards to Anki if the Anki application is up and running, as well as the webserver provided by AnkiConnect. :)

Note: Once this is available to download through Chrome as an extension, the previous steps will no longer apply.

# Known Issues

- Sometimes AnkiConnect prevents incoming requests due to some CORS issues. This happens rarely, but if you add `"*"` to `webCorsOriginList` in AnkiConnect's config, then this issue does not persist.

- Background is reporting some errors which need to be handled, such as...
    - `Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.`
    - `No tab with id: ...`
    - `Unchecked runtime.lastError: Cannot access contents of url "https://github.com/Vezqi/Jisho-Anki-Exporter". Extension manifest must request permission to access this host.`

# To-do

- Nothing for the time being!

# Collaboration

- If you would like to collaborate on this project, feel free to create a pull request, or message me on [Twitter](https://twitter.com/Vezqi) if you have any questions! 

- If you would like to beautify the original deck's format, feel free to customize it and make sure it contains all of the same files and create a pull request.

# Feedback

- Feel free to create an issue or send me a DM on [Twitter](https://twitter.com/Vezqi)!
