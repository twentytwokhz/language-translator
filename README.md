![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/twentytwokhz/language-translator?style=flat-square)
![GitHub all releases](https://img.shields.io/github/downloads/twentytwokhz/language-translator/total?logo=GitHub&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/twentytwokhz/language-translator?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/twentytwokhz/language-translator?logo=Git&style=flat-square)

# Language Translator

An Obsidian plugin to translate selected text in the desired language.

## About The Project

This plugin allows you to translate selected text into the desired language.
It's based on a free instance of Azure Translator. Please do not abuse it :)

_Word of advice_

Keep in mind this is an **initial** version and that the plugin interface is _subject to change_!
PS: If you have recommendations please see the [Contributing](##Contributing) section

## Installing

Find this plugin in the listing of community plugins in Obsidian and add it to your application.

Or, if you'd like to install it manually, clone this repository to the `.obsidian/plugins/` directory in your vault, navigate to your newly cloned folder, run `npm i` or `yarn` to install dependencies, and run `npm run build` or `yarn build` to compile the plugin.

<!-- USAGE EXAMPLES -->

## Usage

1. First you need to define the text to be translated. There are two options available:
   - By explicitly specifying the language code

     ```markdown
     fr:I want to break free
     ```
     First part is the prefix containing the language code (See codes [here](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support)). The second part is the actual text for translation.

   - Or directly, using the default source language code in the settings.

     ```markdown
     I want to break free
     ```
     
2. Select the text
3. Execute the translation by
   - Hitting `Ctrl+P` and executing the `Language Translator: Insert translation` command
   - or by using the predefined hotkey (default is `Ctrl+Shift+R`)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details

<!-- CONTACT -->

## Contact

Florin Bobis - [@twentytwokhz](https://github.com/twentytwokhz) - florinbobis@gmail.com

Project Link: [https://github.com/twentytwokhz/language-translator](https://github.com/twentytwokhz/language-translator)
