<p align="center">
  <a href="https://github.com/twentytwokhz/language-translator">
    <img src="https://github.com/twentytwokhz/language-translator/raw/master/translator.png" alt="Logo" height=100>
  </a>
  <h1 align="center">Language Translator</h1>

  <p align="center">
    An Obsidian plugin to translate selected text in the desired language.
    <br />
    <br />
    <a href="https://github.com/twentytwokhz/language-translator/issues">Report a Bug</a>
    ·
    <a href="https://github.com/twentytwokhz/language-translator/issues">Request a Feature</a>
  </p>
</p>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/twentytwokhz/language-translator)
![GitHub Release Date](https://img.shields.io/github/release-date/twentytwokhz/language-translator)
![GitHub issues](https://img.shields.io/github/issues/twentytwokhz/language-translator)

![GitHub all releases](https://img.shields.io/github/downloads/twentytwokhz/language-translator/total)
![GitHub](https://img.shields.io/github/license/twentytwokhz/language-translator)

<!-- ABOUT THE PROJECT -->

# Language Translator

ro:An Obsidian plugin to translate selected text in the desired language.

## About The Project

This plugin allows you to translate selected text into the desired language.
It's based on a free instance of Azure Translator. Please do not abuse it :)

_Word of advice_

Keep in mind this is an **initial** version and that the plugin interface is _subject to change_!
PS: If you have recommendations please see the [Contributing](##Contributing) section

## Installing

Find this plugin in the listing of community plugins in Obsidian and add it to your application.

Or, if you'd like to install it manually, clone this repository to the `.obsidian/plugins/` directory in your vault, navigate to your newly cloned folder, run `npm i` or `yarn` to install dependencies, and run `npm run build` or `yarn build` to compile the plugin.

## Settings

![settings](img/settings.jpg)
The plugin allows for certain types of configuration:

**Target Language**

Here we select what is the default target for our translation.

**API Type**

The plugin allows choice between the Builtin Azure API (limited version) and your own hosted services in *Azure* or *LibreTranslate*.

**Azure Translator region**

This setting is to allow you to set up your own Azure Translator instance with your predefined region.
The default Azure region used by the builtin API is `global`

**API Url**

This is to distinguish between the default Azure API Url and other possible hosting locations

**API Token**

This token is required only for privately hosted instances of *Azure* or *LibreTranslate*

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
   <img src="img/language-translator-command.png" alt="Logo" height=100>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details

<!-- CONTACT -->

## Contact

Florin Bobis - [@twentytwokhz](https://github.com/twentytwokhz) - florinbobis@gmail.com

Project Link: [https://github.com/twentytwokhz/language-translator](https://github.com/twentytwokhz/language-translator)
