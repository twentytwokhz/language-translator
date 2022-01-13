import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import LanguageCode from "./languageCode";
import langCodes from "./langCodes";
import ApiEntry from "./apiEntry";
import API_TYPES from "./apiTypes";

const AZURE_TRANSLATE_API_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
const LIBRE_TRANSLATE_API_URL = "https://libretranslate.com/translate";

const DEFAULT_API_LIST = {
	"Builtin": AZURE_TRANSLATE_API_URL,
	"Azure": AZURE_TRANSLATE_API_URL,
	"LibreTranslate": LIBRE_TRANSLATE_API_URL
};

const AZURE_AUTH_URL =
	"https://func-language-worker-auth.azurewebsites.net/api/GetAuthToken";
const MAX_CHARACTERS = 2000;

interface LanguageTranslatorSettings {
	targetLanguage: LanguageCode;
	apiType: API_TYPES,
	translateApiUrl: string;
	maxCharacters: Number;
	token: string;
}

const DEFAULT_SETTINGS: LanguageTranslatorSettings = {
	targetLanguage: {
		text: "English",
		code: "en",
	},
	apiType: API_TYPES.Builtin,
	translateApiUrl: AZURE_TRANSLATE_API_URL,
	maxCharacters: MAX_CHARACTERS,
	token: ""
};

export default class LanguageTranslator extends Plugin {
	settings: LanguageTranslatorSettings;

	getTextLibreTranslate = async (text: string, lang: string) => {
		const payload = JSON.stringify({
			q: text,
			source: "auto",
			target: lang,
			api_key: this.settings.token
		});
		const myHeaders = new Headers({
			"Content-type": "application/json",
		});
	}

	getTextAzure = async (text: String, lang: String) => {
		const payload = JSON.stringify([{ text: text }]);
		const myHeaders = new Headers({
			"Ocp-Apim-Subscription-Key": this.settings.token,
			"Ocp-Apim-Subscription-Region": "WestEurope",
			"Content-type": "application/json",
		});
		const response = await fetch(
			`${this.settings.translateApiUrl}&to=${lang}`,
			{
				method: "POST",
				body: payload,
				headers: myHeaders,
			}
		);
		const json = await response.json();
		return json[0].translations[0].text;
	}

	onEditorCallback = async (editor: Editor) => {
		let res = "[translation error]";
		try {
			const selection = editor.getSelection();
			if (selection.length > this.settings.maxCharacters) {
				new Notice(`Exceeded ${this.settings.maxCharacters} max characters!`);
				return;
			}
			let textForTranslation = selection;
			let targetLang = this.settings.targetLanguage.code;

			let splittedText = textForTranslation.split(":", 2);
			if (splittedText.length != 2 && !targetLang) {
				new Notice("Incorrect format!");
				return;
			} else if (splittedText.length == 2) {
				//contains lang code
				targetLang = splittedText[0];
				textForTranslation = splittedText[1];
			}
			

			
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
		editor.replaceSelection(res);
	};

	async onload() {
		await this.loadSettings();
		if (this.settings.apiType == API_TYPES.Builtin) {
			if (!this.settings.token) {
				this.settings.token = await this.getBuiltinAzureToken();
			}
		}

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "language-translator-editor-command",
			name: "Insert translation",
			editorCallback: this.onEditorCallback,
			hotkeys: [
				{
					modifiers: ["Ctrl", "Shift"],
					key: "R",
				},
			],
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LanguageTranslatorSettingsTab(this.app, this));
	}

	getBuiltinAzureToken = async () => {
		try {
			const response = await fetch(AZURE_AUTH_URL);
			return await response.text();
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
	};

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class LanguageTranslatorSettingsTab extends PluginSettingTab {
	plugin: LanguageTranslator;

	constructor(app: App, plugin: LanguageTranslator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Language Translator Settings" });

		new Setting(containerEl)
			.setName("Target Language")
			.setDesc("Set the translation target language (automatically detects source language)")
			.addDropdown((dropDown) => {
				langCodes.forEach((el) => {
					dropDown.addOption(el.code, el.text);
				});
				dropDown.onChange(async (value) => {
					this.plugin.settings.targetLanguage = langCodes.find(
						(l) => l.code == value
					);
					await this.plugin.saveSettings();
				});
				dropDown.setValue(this.plugin.settings.targetLanguage.code);
			});
		
		new Setting(containerEl)
			.setName("Translator API Type")
			.setDesc("Set preferred API")
			.addDropdown((dropDown) => {
				Object.keys(API_TYPES).forEach((el) => {
					dropDown.addOption(el, el);
				});
				dropDown.onChange(async (value) => {
					this.plugin.settings.translateApiUrl = DEFAULT_API_LIST.Builtin;
					alert(value);
					alert(API_TYPES.Builtin.toString());
					if (value == API_TYPES.Builtin.toString()) {
						console.info("LanguageTranslator: getting new builtin token");
						this.plugin.settings.token = await this.plugin.getBuiltinAzureToken();
					}
					else {
						//show API token section
					}
					await this.plugin.saveSettings();
				});
				dropDown.setValue(this.plugin.settings.translateApiUrl.value);
			});

		new Setting(containerEl)
			.setName("API Url")
			.addText((text) => {
				text.setPlaceholder("Enter url")
					.setValue(this.plugin.settings.translateApiUrl.value)
					.onChange(async (value) => {
						console.log("New api url: " + value);
						//add quote format validation
						
						this.plugin.settings.translateApiUrl = API_LIST.find(
							(l) => l.value == value
						);;
						await this.plugin.saveSettings();
					});
			});
	}
}
