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

const TRANSLATE_API_URL = "https://api.cognitive.microsofttranslator.com";
const AUTH_URL =
	"https://func-language-worker-auth.azurewebsites.net/api/GetAuthToken";
const MAX_CHARACTERS = 1000;

interface LanguageTranslatorSettings {
	defaultLanguage: LanguageCode;
}

const DEFAULT_SETTINGS: LanguageTranslatorSettings = {
	defaultLanguage: {
		text: "English",
		code: "en",
	},
};

export default class LanguageTranslator extends Plugin {
	settings: LanguageTranslatorSettings;
	token: string;

	onEditorCallback = async (editor: Editor) => {
		let res = "[translation error]";
		try {
			const selection = editor.getSelection();
			if (selection.length > MAX_CHARACTERS) {
				new Notice(`Exceeded ${MAX_CHARACTERS} max characters!`);
				return;
			}

			let textForTranslation = selection;
			let targetLang = this.settings.defaultLanguage.code;

			let splittedText = textForTranslation.split(":", 2);
			if (splittedText.length != 2 && !targetLang) {
				new Notice("Incorrect format!");
				return;
			} else if (splittedText.length == 2) {
				//contains lang code
				targetLang = splittedText[0];
				textForTranslation = splittedText[1];
			}

			const payload = JSON.stringify([{ text: textForTranslation }]);
			const myHeaders = new Headers({
				"Ocp-Apim-Subscription-Key": this.token,
				"Ocp-Apim-Subscription-Region": "WestEurope",
				"Content-type": "application/json",
			});

			const response = await fetch(
				`${TRANSLATE_API_URL}/translate?api-version=3.0&to=${targetLang}`,
				{
					method: "POST",
					body: payload,
					headers: myHeaders,
				}
			);
			const json = await response.json();
			res = json[0].translations[0].text;
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
		editor.replaceSelection(res);
	};

	getToken = async () => {
		try {
			const response = await fetch(AUTH_URL);
			this.token = await response.text();
		} catch (err) {
			console.log(err);
			new Notice(err.message);
		}
	};

	async onload() {
		await this.loadSettings();
		await this.getToken();
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
			.setName("Default Language")
			.setDesc("Set default language for translations")
			.addDropdown((dropDown) => {
				langCodes.forEach((el) => {
					dropDown.addOption(el.code, el.text);
				});
				dropDown.onChange(async (value) => {
					this.plugin.settings.defaultLanguage = langCodes.find(
						(l) => l.code == value
					);
					await this.plugin.saveSettings();
				});
				dropDown.setValue(this.plugin.settings.defaultLanguage.code);
			});
	}
}
